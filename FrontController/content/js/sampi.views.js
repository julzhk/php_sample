//NAMESPACES
(function($) {
//Creates a namespace for the static reference materials
    $.viewS = {
         init : function (options){
            var type = {
                login : function(options){
                    var form_name = "login_form";
                    var curr_hash = window.location.hash;
                    if(curr_hash){
                        curr_hash = $.navHandler.splitLoc(curr_hash);
                        if(curr_hash.invite !== undefined || curr_hash.beta !== undefined){
                            form_name = "login_form_new";
                        }
                    }
                    var form_content = $.sys.formStorage[form_name]({form_act:'init'});
                    $('#header .ui-layout-content').html('');
                    $('#header .ui-layout-header').html($.sys.workingLayoutRef.login_header(options));
                    $('#detail .ui-layout-content').html(form_content.form_body);
                    $('#detail .ui-layout-header').html('');
                    $('#control .ui-layout-content').html(form_content.content);
                    $('#control .ui-layout-header').html('');
                    $.sys.formStorage[form_name]({form_act:'activate'});
                },
                layout : function(options){
                    $('#loading').after($.sys.workingLayoutRef.main_layout(true));
                    var layout_obj =  $('div.layout').layout({
                            center__paneSelector:	"#control"
                        ,	east__paneSelector:	"#detail"
                        ,	west__paneSelector:     "#header"
                        ,   east__size: '65%'
                        ,   east__closable: false
                        ,   west__resizable: false
                        ,   west__closable: false
                        ,   west__size: 80
//                        ,   triggerEventsOnLoad: true // REF - true is the default
//                        ,   onopen: function (pane, $Pane) {
//                                $Pane.unbind("dblclick");
//                            }
                    });
                    $('#loading').remove();
                    if($('#loading').length>0){
                        setTimeout(function(){
                            $.lay.init.login();
                        }, 500);
                    }
                    return (layout_obj);
                }
            }
            return (type[options.init](options));
        },
        context : function(options){
            var type = {
                today : function(options){
                    if($('#detail .ui-layout-header').children().length===0){
                        $('#detail .ui-layout-header').html('');
                        options.help_type = 'object_select';
                        $('#detail .ui-layout-content').html($.sys.workingLayoutRef.helpContent(options));
                    }
                    var detail_target = $('#control');
                    options.view_arr = [];
                    if(options.object_id===undefined){
                        options = $.sys.workingLayoutRef.todayDetail(options);
                        $('.ui-layout-header', detail_target).html(options.header);
                        options.tree_type="flat";
                        options = $.dataSet.userNewObj(options);
                        if(options.object.length>0){
                            options.get_html.object_name = sampiDic.user_obj_new_title;
                            options.get_html.content = sampiDic.user_obj_new_title;
                            options.view_arr.push($.viewS.tree(options));
                        }

                        options = $.dataSet.userTopUI(options);
                        if(options.object.length>0){
                            options.get_html.object_name = sampiDic.user_obj_urgent_title;
                            options.get_html.content = sampiDic.user_obj_urgent_title;
                            options.view_arr.push($.viewS.tree(options));
                        }

                        options = $.dataSet.teamTopUI(options);
                        if(options.object.length>0){
                            options.get_html.object_name = sampiDic.team_obj_urgent_title;
                            options.get_html.content = sampiDic.team_obj_urgent_title;
                            options.view_arr.push($.viewS.tree(options));
                        }
                    }
                    options = $.dataSet.activeObjects(options);
                    if(options.object_id!==undefined){
                        options = $.dataSet.getParentObjects(options);
                        $('#control .ui-layout-header').html($.sys.workingLayoutRef.controlHeader(options));
                    }
                    options.tree_type="nested";
                    options.get_html=undefined;
                    $.viewS.tree(options);
                    if($(options.target_sel).html()===''){
                        window.location.hash = "#context/depot";
                    }
                },
                tasks : function(options){
                    $('#control .ui-layout-header').html($.sys.workingLayoutRef.controlHeader(options));
                    $.viewS.tree(options);
                },
                team_tasks : function(options){
                    $('#control .ui-layout-header').html($.sys.workingLayoutRef.controlHeader(options));
                    $.viewS.tree(options);
                },
                file : function(options){
                    $('#control .ui-layout-header').removeClass('ui-widget-header').removeClass('ui-corner-all').html('');
                    $.viewS.tree(options);
                },
                depot : function(options){
                    $('#control .ui-layout-header').html($.sys.workingLayoutRef.controlHeader(options));
                    $.viewS.tree(options);
                },
                tools : function(options){
                    var inner_html = $.sys.workingLayoutRef.controlPanelRef(options);
                    $('#control .ui-layout-header').addClass('ui-widget-header').addClass('ui-corner-all').html(inner_html.header);
                    $('#control .ui-layout-content').removeClass('treeview').html(inner_html.content);
                },
                search : function(options){
                    $.viewS.tree(options);
                },
                self_admin : function(options){
                    $('#control .ui-layout-header').removeClass('ui-widget-header').removeClass('ui-corner-all').html('');
                    $('#control .ui-layout-content').html('');
                }
            }
            $.navHandler.setCurr('#header', '.active-holder.'+options.context);
            type[options.context](options);
            outerLayout.resizeAll();
            outerLayout.sizeContent('center');
            outerLayout.sizeContent('west');
            outerLayout.sizeContent('east');
        },
        detail : function (options){
            var type = {
                object : function(options){
                    $(options.target_sel).html($.sys.workingLayoutRef.objectDetail(options));
                },
                space_admin : function(options){
                    $(options.target_sel).html($.sys.workingLayoutRef[options.detail_layout_method](options));
                },
                self_admin : function(options){
                    $(options.target_sel).html($.sys.workingLayoutRef.selfDetail(options));
                }
            }
            type[options.detail](options);
            outerLayout.resizeAll();
            outerLayout.sizeContent('center');
            outerLayout.sizeContent('west');
            outerLayout.sizeContent('east');
        },
        minorView : function (options){
            var type = {
                status : function(options){
                    if(options.taskscrum!==undefined && options.taskscrum.length>0){
                        $(options.target_sel).html($.sys.workingLayoutRef.statusInner(options));
                        options.target_sel='#detail .ui-layout-content .reports';
                        $.viewS.tree(options);
                        $.viewS.sparklineDetail(options.taskscrum.reverse(), 'curr_sparkline');
                    } else {
                        $(options.target_sel).html($.sys.workingLayoutRef.helpContent(options));
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.objectDetailControl(options));
                },
                comment : function(options){
                    if(options.comment_threads!==undefined && options.comment_threads.length!==0){
                        $.viewS.tree(options);
                    } else {
                        $(options.target_sel).html($.sys.workingLayoutRef.helpContent(options));
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.objectDetailControl(options));
                },
                file : function(options){
                    if(options.file!==undefined && options.file.length!==0){
                        $.viewS.tree(options);
                    } else {
                        $(options.target_sel).html($.sys.workingLayoutRef.helpContent(options));
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.objectDetailControl(options));
                },
                team : function(options){
                    if(options.team!==undefined){
                        var item_html =['<div class="margin-all">'];
                        var temp_obj = {};
                        if(options.active_users.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:'Owners'}));
                            for(var i=0, len=options.active_users.length; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.userInfo({user_id:options.active_users[i], work_summary:options.work_summary[i]}));
                            }
                        }
                        temp_obj = $.dataSet.getTeamUsersByTeamId({team_id:options.curr_obj.manager_id});
                        if(temp_obj.user_info_arr.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:'Managers'}));
                            for(i=0, len=temp_obj.user_info_arr.length; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.userInfo({user_id:temp_obj.user_info_arr[i].id, user_info:temp_obj.user_info_arr[i]}));
                            }
                        }
                        if(options.user_info_arr.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:'All Members'}));
                            for(i=0, len=options.user_info_arr.length; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.userInfo({user_id:options.user_info_arr[i].id, user_info:options.user_info_arr[i]}));
                            }
                        }
                        item_html.push('</div>');
                        $(options.target_sel).html(item_html.join(''));
                    } else {
                        $(options.target_sel).html($.sys.workingLayoutRef.helpContent(options));
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.objectDetailControl(options));
                },
                summary : function(options){
                    if(options.team!==undefined){
                        var len_default = 5;
                        var item_html =['<div class="margin-all">'];
                        item_html.push($.sys.workingLayoutRef.objectContent(options));
                        if(options.active_users.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:sampiDic.status_link}));
                            item_html.push('<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">');
                            var len = (options.taskscrum.length>len_default) ? len_default : options.taskscrum.length;
                            for(var i=0; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.statusSummary(options.taskscrum[i], options));
                            }
                            item_html.push('</div>');
                        }
                        if(options.comment.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:sampiDic.comment_link}));
                            item_html.push('<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">');
                            for(i=0, len=options.comment.length; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.commentSummary(options.comment[i], options));
                            }
                            item_html.push('</div>');
                        }
                        if(options.file.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:sampiDic.file_link}));
                            item_html.push('<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">');
                            for(i=0, len=options.file.length; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.fileSummary(options.file[i], options));
                            }
                            item_html.push('</div>');
                        }
                        if(options.team_user.length>0){
                            item_html.push($.sys.workingLayoutRef.titleHolder({title:sampiDic.team_link}));
                            item_html.push('<div>');
                            len = (options.team_user.length>len_default) ? len_default : options.team_user.length;
                            for(i=0; i<len; i+=1){
                                item_html.push($.sys.workingLayoutRef.userInfo({user_id:options.team_user[i].user_id, updated_at:options.team_user[i].updated_at}));
                            }
                            item_html.push('</div>');
                        }
                        item_html.push('</div>');
                        $(options.target_sel).html(item_html.join(''));
                    } else {
                        $(options.target_sel).html($.sys.workingLayoutRef.helpContent(options));
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.objectDetailControl(options));
                },
                admin_user : function(options){
                    $(options.target_sel).html('');
                    if(options.admin_user!==undefined){
                        $.viewS.tree(options);
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.spaceDetailControl(options));
                },
                admin_team : function(options){
                    $(options.target_sel).html('');
                    if(options.admin_team!==undefined){
                        $.viewS.tree(options);
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.spaceDetailControl(options));
                },
                admin_approval : function(options){
                    var item_html = [
                        'Approval Admin Active'
                    ].join('');
                    $(options.target_sel).html(item_html);
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.spaceDetailControl(options));
                },
                admin_object : function(options){
                    $(options.target_sel).html('');
                    if(options.admin_object!==undefined){
                        $.viewS.tree(options);
                    }
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.spaceDetailControl(options));
                },
                admin_file : function(options){
                    var item_html = [
                        'File Admin Active'
                    ].join('');
                    $(options.target_sel).html(item_html);
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.spaceDetailControl(options));
                },
                admin_account : function(options){
                    var item_html = [
                        'Account Admin Active'
                    ].join('');
                    $(options.target_sel).html(item_html);
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.spaceDetailControl(options));
                },
                info : function(options){
                    //@TODO : Enable updating the user's email. 
                    var item_html = [
                        '<div>',sampiDic.first_name, ': ', options.user_info.first_name
                        ,'<div>',sampiDic.last_name, ': ', options.user_info.last_name
                        ,'<div>',sampiDic.email, ': ', options.user_info.email,'</div>'
                    ].join('');
                    $(options.target_sel).html(item_html);
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.selfDetailControl(options));
                },
                spaces : function(options){
                    var item_html = [
                        'User Spaces Admin Active'
                    ].join('');
                    $(options.target_sel).html(item_html);
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.selfDetailControl(options));
                },
                account : function(options){
                    var item_html = [
                        'User Account Admin Active'
                    ].join('');
                    $(options.target_sel).html(item_html);
                    $('#detail .detail-controls').html($.sys.workingLayoutRef.selfDetailControl(options));
                },
                report : function(options){
                    if(options.report_name===undefined){
                        $(options.target_sel).html($.sys.workingLayoutRef.reportList(options));
                    } else {
                        $(options.target_sel).html($.sys.workingLayoutRef.reportDetail(options));
                        if($.reportS[options.report_name]!==undefined){
                            $.reportS[options.report_name](options);
                        }
                    }
                }
            }
            if(options.object_id!==undefined){
                $.navHandler.checkObjectUserAccess(options);  
            }
            $.navHandler.setCurr('#detail', '.active-holder.'+options.minor_view);
            type[options.minor_view](options);
            outerLayout.resizeAll();
            outerLayout.sizeContent('center');
            outerLayout.sizeContent('west');
            outerLayout.sizeContent('east');
        },
        alert: function(options){
            var type = {
                confirmYesNo : function(options){
                    var target_ele = $('#alert_stage').html($.sys.workingLayoutRef.alertBody(options));

                    var config = {
                        close: function(event, ui) {
                            options.confirm = false;
                            options.alert = undefined;
                            $(this).dialog('destroy');
                            $('form.active').postForm(options);
                        }
                        , modal: true
                        , buttons: {
                            "Yes": function() {
                                options.confirm = true;
                                options.alert = undefined;
                                $(this).dialog('destroy');
                                $('form.active').postForm(options);
                            }
                            , "No": function() {
                                options.confirm = false;
                                options.alert = undefined;
                                $(this).dialog('destroy');
                                $('form.active').postForm(options);
                            }
                        }
                    }
                    $('.alert_body', target_ele).dialog(config);
                }
            }
            if(type[options.alert]!==undefined){
                type[options.alert](options);
            }
        },
        set : function(options){
            var type = {
                /**
                 *This pulls out assigning the icon class for object urgency.
                 *@param options(object) object_data {array of object information}
                 *                      target_ele {dom element that the class is assigned to}
                 *@return (string) The class name of the urgency status.
                 **/
                 urgencyClass : function(options) {
                    var object_data = options.object_data;
                    var target_class='urgency_0';
                    if(object_data!==undefined){
                        if(-2 === (object_data.work_remain*1)) {
                            target_class=this.holderClass(options);
                        } else if(-1 === (object_data.work_remain*1) && !(object_data.urgency_index*1>0)){
                            target_class='urgency_0';
                        } else if(0 === (object_data.work_remain*1) ) {
                            target_class='urgency_4';
                        } else if(object_data.urgency_index >= 65) {
                            target_class='urgency_3';
                        } else if(object_data.urgency_index < 65 && object_data.urgency_index > 35) {
                            target_class='urgency_2';
                        } else if(object_data.urgency_index <= 35 && object_data.urgency_index >=0) {
                            target_class='urgency_1';
                        } else if((object_data.work_remain*1)>0 && -1===(object_data.urgency_index*1)){
                            target_class='urgency_1';
                        }
                    }
                    return target_class;
                },
                holderClass : function(options){
                    var target_class='holder_object';
                    if(options.child_html!==undefined){
                        var status_arr = [];
                        status_arr[0] = (options.child_html.indexOf('urgency_0')>-1) ? 'l' : 'o';
                        status_arr[1] = (options.child_html.indexOf('urgency_1')>-1) ? 'l' : 'o';
                        status_arr[2] = (options.child_html.indexOf('urgency_2')>-1) ? 'l' : 'o';
                        status_arr[3] = (options.child_html.indexOf('urgency_3')>-1) ? 'l' : 'o';
                        target_class = target_class + ' ' + status_arr.join('');
                    }
                    return target_class;
                }
            }
            return (type[options.type](options));
        }
    }
})(jQuery);