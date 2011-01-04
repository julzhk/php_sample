(function($) {
    $.formHandler = {
        /**
         *This method receives a form reference object, checks to see if the same one is currently active.
         *After the check, it will reset any existing forms, which will automatically destroy them.
         *Next the new form is inserted into the form holder and then activates the dialog widget with that.
         *@param options {object} Configuration object.
         **/
        activateForm : function(options){
            var form_holder = this.insertForm(options);
            options.form_object.form_title = (options.form_object.form_title===undefined) ? '' : options.form_object.form_title;
            var button_obj = {
                "Save": function(){$.formHandler.handlePost(options, $(this));}
                ,"Cancel":function(){
                    $(this).dialog('destroy');
                    $.formHandler.cancelForm();
                }
            }
            if(options.form_object.button_obj!==undefined){
                button_obj = options.form_object.button_obj;
            }
            if(form_holder){
                $.ui.dialog.defaults.bgiframe = true;
                $(form_holder).children().dialog(
                    { autoOpen: true,
                        width: 600,
                        minWidth: 300,
                        close: function(event, ui) {
                            $(this).dialog('destroy');
                            $.formHandler.cancelForm();
                        },
                        title: options.form_object.form_title,
                        buttons : button_obj
                    });
                options.form_act="activate";
                $.sys.formStorage[options.form_name](options);
            }
        },
        cancelForm : function(){
            $("#dialog_form").parent().remove();
            $("form.file_upload.active").parent().remove();
            $("form.update_user_avatar.active").parent().remove();
        },
        getForm : function(options){
            if(options.form_name!==undefined && $.sys.formStorage[options.form_name]!==undefined){
                options.form_act="init";
                var user_id = $.dataCache.get({set_name:"user_info"})[0];
                options.trans_id = $.samUtil.MD5(user_id.id+ '_' + (new Date()).getTime());
                options.form_object = $.sys.formStorage[options.form_name](options);
                this.activateForm(options);
            }
        },
        handlePost : function(options, this_dialog){
           $('form.active').postForm(options);
        },
        postSuccess : function(){
            this.destroySimpleEditor();
            $("form.active").parent().parent().css("margin-top", "-10000px");
            $("form.file_upload.active").removeClass('active').addClass('posted');
            $("form.update_user_avatar.active").removeClass('active').addClass('posted');
            $("#dialog_form").parent().dialog('destroy').remove();
            uploadCompleted();
        },
        insertForm : function(options){
            var active_form;
            if($('#dialog_form').length>0 || $('form.active').length>0){
                return false;
            }
            active_form = $('#active_form').html(options.form_object.form_body);
            return active_form;
        },
        getPostData : function(target_element, target_class) {
            var data_areas = $('#'+target_element+ ' .' +target_class).get();
            var post_data = "";
            var temp_val = '';
            var search_strings = [];
            search_strings[0] = {base:'<li><ul>', replace:'<ul>'};
            search_strings[1] = {base:'</ul></li>', replace:'</ul>'};
            search_strings[2] = {base:'<li><ol>', replace:'<ol>'};
            search_strings[3] = {base:'</ol></li>', replace:'</ol>'};
            search_strings[4] = {base:'\n\r', replace: '</br>'};
            search_strings[5] = {base:'\r\n', replace: '</br>'};
            search_strings[6] = {base:'\n', replace: '</br>'};
            search_strings[7] = {base:'\r', replace: '</br>'};
            search_strings[8] = {base:'&', replace: '%26'};
            search_strings[9] = {base:'class="Apple-style-span"', replace: ''};
            for(var i = 0, data_areas_length = data_areas.length; i<data_areas_length; i+=1) {
                var m = data_areas[i];
                if(m.value !== ""){
                    for(var j=0, len_j=search_strings.length; j<len_j; j+=1){
                        var s = search_strings[j];
                        if(m.value.indexOf(s.base)>-1){
                            temp_val = m.value.split(s.base);
                            m.value = temp_val.join(s.replace);
                        }
                    }
                    post_data = post_data + "&" + m.name + "=" + m.value;
                }
            }
            //remove the leading & and return the post_data
            return post_data.substring(1);
        },
        itemSelect : function(options){
            var active_form = $('form.active');
            options.curr_sel = active_form.data('curr_sel');
            if(options.curr_sel !==undefined && options.curr_sel[options.sel_rel]!==undefined){
                for (var m in options.curr_sel){
                    if(m!==undefined && m!==options.sel_rel && options.curr_sel[m].length!==undefined){
                        var pos_m = $.inArray(options.id, options.curr_sel[m]);
                        if(pos_m>-1){
                            options.curr_sel[m].splice(pos_m, 1);
                        }
                    }
                }
                //Check to see if the value is already in place and toggle it.
                var pos = $.inArray(options.id, options.curr_sel[options.sel_rel]);
                if(pos>-1){
                    options.curr_sel[options.sel_rel].splice(pos, 1);
                } else if(options.sel_type==="multi"){
                    options.curr_sel[options.sel_rel].push(options.id);
                } else {
                    options.curr_sel[options.sel_rel] = [options.id];
                }
                options.form_name = active_form.attr('name');
                options.form_act = "activate";
                $.sys.formStorage[options.form_name](options);
            }
        },
        activateSimpleEditor : function(target_elements, editor_config){
            if(editor_config===null || editor_config===undefined){
                editor_config = {
                    iconsPath:'image/nicEditorIcons.gif',
                    buttonList: [
                        'bold',
                        'italic',
                        'underline',
                        'left',
                        'center',
                        'right',
                        'justify',
                        'ol',
                        'ul',
                        'subscript',
                        'superscript',
                        'strikethrough',
                        'removeformat',
                        'indent',
                        'outdent',
                        'hr',
                        'forecolor',
                        'bgcolor',
                        'link',
                        'unlink',
                        'fontSize',
                        'fontFamily',
                        'fontFormat'
                    ],
                    maxHeight:'200'
                }
            }
            nicEditors.allTextAreas(editor_config);
            this.setEditorPanelWidth($('form.active .nicEdit-panel div'));
            this.setEditorWidth($('form.active .nicEdit-main div'));
        },
        setEditorWidth : function(target_panel){
            $(target_panel).attr('width', '98%');
            this.setEditorParentWidth(target_panel);
        },
        setEditorPanelWidth : function(target_panel){
            this.setEditorParentWidth($(target_panel).parent());
        },
        setEditorParentWidth : function(target_panel){
            $(target_panel).parent().attr('width', '100%');
        },
        saveSimpleEditor : function(){
            var editor_array = nicEditors.editors;
            if(editor_array.length){
                for(var i=0, len=editor_array.length; i<len; i+=1){
                    var m = editor_array[i];
                    m.nicInstances[0].saveContent();
                }
            }
        },
        destroySimpleEditor : function(){
            var editor_array = nicEditors.editors;
            if(editor_array.length){
                for(var i=0, len=editor_array.length; i<len; i+=1){
                    var m = editor_array[i];
                    m.removeInstance();
                }
            }
        }
    };
})(jQuery);