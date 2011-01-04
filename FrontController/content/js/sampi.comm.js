/* 
 * Sampi Plan - Comm Functions
 * 2009 Sampi, Ltd. All Rights Reserved
 */
(function($) {
    $.samComm = {
        registerConfirm : function(responseText, statusText){
            var rec_data = $.samComm.processResponse(responseText);
            $('div.loadmask').parent().unmask();
            if(rec_data.status!==undefined && rec_data.status===0){
                if(rec_data.mapped_data!==undefined){
                    $.samComm.loadInterface(rec_data);
                } else if(rec_data.confirm_email!==undefined && rec_data.confirm_email){
                    alert(sampiDic.confirm_email_instructions);
                }
            } else if(rec_data.status!==undefined && rec_data.status===10){
                alert(sampiDic.duplicate_entry);
            } else if(rec_data.status!==undefined && rec_data.status===4){
                $('#system_cache').removeData('active_user');
                alert(sampiDic.password_incorrect);
            } else if(rec_data.status!==undefined && rec_data.status===3){
                alert(sampiDic.general_error_instructions);
            }
        },
        processResponse : function(process_text){
            var rec_data = {};
            //@TODO - Should wrap this in a Try->Catch
            if(process_text){
                rec_data = JSON.parse(process_text);
                if(rec_data.mapped_data !== undefined){
                    $("#system_cache").data('t_c', rec_data.t_c);
                    $.dataCache.set(rec_data);
                }
            }
            return rec_data;
        },
        loadInterface : function(rec_data){
            var active_user = $('#system_cache').data('active_user');
            if(active_user === undefined || active_user===false){
                if(rec_data.mapped_data.user_info!==undefined){
                    $('#system_cache').data('active_user',true);
                    $.lay.initInterface(rec_data.mapped_data);
                }  
            }
        },
        storeResponse : function(responseText, statusText)  {
            var rec_data = $.samComm.processResponse(responseText);
            $.samComm.loadInterface(rec_data);
            return rec_data;
        },
        storeInitDic : function(responseText, statusText)  {
            var rec_data = $.samComm.processResponse(responseText);
            if(sampiDic===undefined || sampiDic.en===undefined){
                $.samUtil.deleteCookie('X-Mapping-caklakng');
                $.samUtil.deleteCookie('toyboxuserid');
                $.lay.init.lang_select();
                return (false);
            }
            if(rec_data!==undefined && rec_data.mapped_data!==undefined && rec_data.mapped_data.user_info!==undefined){
                $.samComm.loadInterface(rec_data);
            } else {
                $.lay.init.login();
            }
            return rec_data;
        },
        storeAdminResponse : function(responseText, statusText)  {
            var rec_data = {};
            if(responseText){
                rec_data = JSON.parse(responseText);
                if(rec_data.mapped_data !== undefined){
                    var curr_t_c = $("#system_cache").data('admin_t_c');
                    $("#system_cache").data('admin_t_c', rec_data.t_c);
                    $.dataCache.set(rec_data);
                    var prev_loc = $('#system_cache').data('loc');
                    if(curr_t_c===undefined && prev_loc.detail==="space_admin"){
                        $.navHandler.refreshEverything();
                    }
                }
            }
        },
        storeResponseForm : function(responseText, statusText)  {
            var rec_data = $.samComm.storeResponse(responseText, statusText);
            if(rec_data.status===0){
                $.formHandler.postSuccess();
                if(rec_data.mapped_data !== undefined){
                    $.navHandler.refreshDetail(rec_data.mapped_data);
                }
            }
        },
        postResponse : function(responseText, statusText){
            return true;
        }
    }
    $.fn.postForm = function(options) {
        if($('div.loadmask').length===0){
            options = (options===undefined) ? {} : options;
            options.success_func = (options.success_func===undefined) ? options.success_func = 'storeResponseForm' : options.success_func;
            options.form_act = 'pre_post';
            options.form_name = (options.form_name===undefined) ? this.attr('id') : options.form_name;
            if($.sys.formStorage[options.form_name]!==undefined){
               options = $.sys.formStorage[options.form_name](options)
            }
            var button_holder = $('.ui-dialog-buttonpane');
            button_holder = (button_holder.length===0) ? $('.buttonpane', this) : button_holder;
            if(options && options.alert===undefined){
                button_holder.mask();
                var dataString = this.serialize();
                $.ajax({
                    type: "POST",
                    url: $.sysConst.base_target_clean,
                    data: dataString,
                    timeout:   30000,
                    success: $.samComm[options.success_func]
                    });
            } else {
                if(options.alert!==undefined){
                    $.viewS.alert(options);
                } else {
                    alert(sampiDic.cannot_post);
                }
            }
            return false;
        }
    };

    $.postData = function(dataString, options) {
      if(dataString){
          $.ajax({
            type: "POST",
            url: $.sysConst.base_target_clean,
            data: dataString,
            timeout:   30000,
            success: $.samComm.postResponse
          });
      }
    };
    $.getData = function(dataString, options) {
        if(dataString){
            $.ajax({
                type: "GET",
                url: $.sysConst.base_target_clean,
                data: dataString,
                timeout:   30000,
                success: $.samComm.storeResponse
            });
        }
    };
    $.getInitDic = function(iso_code){
        iso_code = (iso_code === undefined) ? 'en' : iso_code;
        var dataString = 'task=loginfacade&option1=getinitdic&iso_code=' + iso_code;
        $.ajax({
            type: "GET",
            url: $.sysConst.base_target_clean,
            data: dataString,
            timeout:   30000,
            success: $.samComm.storeInitDic
        });
    };
    $.getAdminData = function(dataString, options) {
        if(dataString.t_c === undefined){
            var t_c_val = $("#system_cache").data('admin_t_c');
            if(t_c_val!==undefined){
                dataString.t_c = t_c_val;
            }
        }
        if(dataString){
            $.ajax({
                type: "GET",
                url: $.sysConst.base_target_clean,
                data: dataString,
                timeout:   30000,
                success: $.samComm.storeAdminResponse
            });
        }
    };
})(jQuery);