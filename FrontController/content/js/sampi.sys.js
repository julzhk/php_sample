/**
 *This is the callback method for the rad upload.
 **/
function uploadCompleted(){
    $('form.file_upload').addClass('destroy').each(function(){
        $('.rad_app',this).each(function(){
            var ele = $(this);
            var ele_id = ele.attr('id');
            if(document[ele_id].getUploadStatus !== undefined){
                var ele_status = document[ele_id].getUploadStatus();
                if(ele_status>0){
                    ele.parent().html("<div>Complete</div>");
                } else {
                    ele.parents('form.file_upload.destroy').removeClass('destroy');
                }
            }
        })
    })
    $('form.update_user_avatar.posted').addClass('destroy').each(function(){
        $('.rad_app',this).each(function(){
            var ele = $(this);
            var ele_id = ele.attr('id');
            if(document[ele_id].getUploadStatus !== undefined){
                var ele_status = document[ele_id].getUploadStatus();
                if(ele_status>0){
                    var options ={
                        user_info : $.dataCache.get({set_name:"user_info"})[0]
                    };
                    options.user_info.userimage = (options.user_info.userimage!==undefined && options.user_info.userimage!==null && options.user_info.userimage!=='') ? 'newavatarsuccess': options.user_info.userimage;
                    $('#header .ui-layout-header').html($.sys.workingLayoutRef.header_layout(options));
                } else {
                    ele.parents('form.update_user_avatar.destroy').removeClass('destroy');
                }
            }
        })
    })
    $('form.destroy.posted').parent().dialog('destroy').remove();
}

(function($) {
    $.sys={}
//Creates a namespace for the static reference materials
    $.sys.workingLayoutRef = {
        alertBody : function(options){
            return (['<div class="alert_body" title="',options.alert_title,'">',options.alert_content,'</div>'].join(''));
        },
        detailOverview : function(options){
            return('<img src="image/Overview_Detail_Layout.png" width="553" height="475" alt="Detail Quick Reference" />')
        },
        generalOverview : function(options){
            return('<img src="image/Overview_Layout.png" width="547" height="572" alt="Detail Quick Reference" />')
        },
        statusInner : function(options){
            var span_period = (options.span_period===undefined) ? 1814400 : options.span_period*1 + 604800;
            var start_date = $.samUtil.formatEpochDateToDMY(options.taskscrum[options.taskscrum.length-1].work_date).curr_datestamp
            var date_range = $.samUtil.formatEpochDateToDMY(options.taskscrum[0].work_date).curr_datestamp;
            if(start_date!==date_range){
                date_range = start_date + '>' + date_range;
            }
            
            return (['<div id="curr_sparkline" class="object_sparkline"></div><div>'
                    , sampiDic.title_updated_items
                    , '(', date_range ,')'
                    , ' <a href="#context/',options.context,'/detail/',options.detail,'/object_id/',options.object_id,'/minor_view/status/span_period/',span_period,'">',sampiDic.show_additional_week,'</a>'
                    , '</div><div class="reports"></div>'].join(''));
        },
        fileLinkRef : function(options){
            var link = [];
            var curr_arr = $.dataSet.getFileStoreByFileId(options.file_id, options.file_type);
            if(curr_arr !== undefined && curr_arr.currsize !== undefined){
                if(curr_arr.currsize*1 === curr_arr.totalsize*1){
                    link.push('<a class="pad-left text-sm" href="', $.sysConst.base_target_clean ,'?task=ajaxfacade&option1=getfilebyfileid&file_type=',options.file_type,'&file_id=',options.file_id,'&file_name=',curr_arr.filename,'">',sampiDic[options.file_type],'</a>');
                } else {
                    link.push('<span class="pad-left text-sm">',sampiDic.proof_file,' ',sampiDic.uploading,'</span>');
                }
            }
            return(link.join(''));
        },
        controlPanelRef : function(options){
            var tools_control = [
                '<div>'
                    , '<a class="add_space_icon" href="#activate/form_dialog/form_name/new_space" title="',sampiDic.new_space,'">',sampiDic.new_space,'</a>'
                , '</div></br>'];
            var return_obj = {header:tools_control.join('')};
            var curr_root_id = 0;
            var user_space_id = $.dataCache.get({set_name:"object", filter_by:[[{field:"owner_id", rel:"eq", value:options.user_info.id},{field:"object_type", rel:"eq", value:'Personal Space'}]]})[0].object_id;
            tools_control = ['</ul>'];
            for(var i=0, len=options.user_perm.length; i<len; i+=1){
                var this_obj = options.user_perm[i];
                if(curr_root_id!==this_obj.root_id && this_obj.account_admin*1>0){
                    var minor_view_type = (this_obj.object_id===user_space_id)? 'info' : 'admin_user';
                    tools_control.push('<li><div>'
                            ,'<a href="',options.href_base,'/detail/space_admin/space_id/',this_obj.root_id,'/minor_view/',minor_view_type,'">',this_obj.space_name,'</a>'
                        ,'</div></br></li>');
                    curr_root_id = this_obj.root_id;
                }
            }
            tools_control.push('</ul>');
            return_obj.content = tools_control.join('');
            return(return_obj);
        },
        browseAppletButton : function(options){
            var path = location.pathname;
            path = path.split('/');
            var temp_path = '';
            for(var i=0, len = path.length; i<len-1; i+=1){
                if(path[i]!==""){
                    temp_path = temp_path + '/' + path[i];
                }
            }
            path = temp_path;
            var inner_html = [];
            var _info = navigator.userAgent;
            var ie = (_info.indexOf("MSIE") > 0);
            var win = (_info.indexOf("Win") > 0);
            if(win){
                if(ie){
                    inner_html.push('<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"'
                                    ,' codebase="http://java.sun.com/update/1.6.0/jinstall-6-windows-i586.cab#version=1,5"');
                } else {
                    inner_html.push('<object type="application/x-java-applet;version=1.5"');

                }
                    inner_html.push(' class="rad_app" width="100" height="25"  id="rup_',options.ele_id,'">'
                                    ,'<param name="archive" value="dndplus.jar">'
                                    ,'<param name="code" value="com.radinks.dnd.DNDAppletPlus">'
                                    ,'<param name="name" value="Rad Upload Plus">');
            } else {
                    /* mac and linux */
                    inner_html.push('<applet '
                                    ,'archive  = "dndplus.jar"'
                                    ,'code     = "com.radinks.dnd.DNDAppletPlus"'
                                    ,'name     = "Rad Upload Plus"'
                                    ,'hspace   = "0"'
                                    ,'vspace   = "0" MAYSCRIPT="yes"'
                                    ,'width = "100"'
                                    ,'height = "25"'
                                    ,'align = "middle"'
                                    ,'id="rup_',options.ele_id,'"'
                                    ,'class="rad_app">');
            }

            inner_html.push('<param name = "url" value = "',location.protocol,'//' ,location.host, path,'/resume.php'
                            ,'?trans_id='
                            ,options.trans_id
                            ,'&file_type='
                            ,options.file_type
                            ,'&object_id='
                            ,options.object_id
                            ,'">'
                            ,'<param name = "resume" value = "yes">'
                            ,'<param name = "message" value="">'
                            ,'<param name = "browse" value = "yes">'
                            ,'<param name = "browse_button" value = "yes">'
                            ,'<param name = "bachelor" value = "yes">'
                            ,'<param name = "gzip" value = "yes">'
                            ,'<param name = "max_upload" value = "5120000">'
                            ,'<param name="MAYSCRIPT" value="true">'
                            ,'<param name="scriptable" value="true">'
                            ,'<param name="jsnotify" value="yes">');
            if(win){
                inner_html.push('</object>');
            } else {
                inner_html.push('</applet>');
            }
            return (inner_html.join(''));
        },
        header_layout : function(options){
            var layout_html = [
                    '<div id="header-nav">',
                        '<div id="header-nav-1" class="inline">',
                            '<span class="today active-holder ui-corner-all"><a class="today today_icon" style="', $.sys.workingLayoutRef.avatarStyle(options) ,'" href="#context/today" title="',sampiDic.today_name,'">',sampiDic.today_name,'</a></span>',
                            '<span class="tasks active-holder ui-corner-all"><a class="tasks my_tasks_icon" href="#context/tasks" title="', sampiDic.my_tasks_name,'">', sampiDic.my_tasks_name,'</a></span>',
                            '<span class="team_tasks active-holder ui-corner-all"><a class="team_tasks team_tasks_icon" href="#context/team_tasks" title="',sampiDic.team_tasks_name,'">',sampiDic.team_tasks_name,'</a></span>',
                            '<span class="depot active-holder ui-corner-all"><a class="depot depot_icon" href="#context/depot" title="',sampiDic.depot_name,'">',sampiDic.depot_name,'</a></span>',
                            '<span class="logout active-holder ui-corner-all"><a class="logout logout_icon" href="#activate/logout" title="', sampiDic.logout,'">', sampiDic.logout,'</a></span>',
                            '<span class="help active-holder ui-corner-all"><a class="help help_icon" href="#activate/help" title="', sampiDic.help,'">', sampiDic.help,'</a></span>',
                        '</div>',
                    '</div>'
                ].join('');
            return layout_html;
        },
        main_layout : function(init_data, activate_process, pre_post_process){
            if(init_data) {
                var layout_html = ['<div class="layout ui-widget">',
                        '<div id="control" class="ui-layout-center ui-corner-all">',
                            '<div class="ui-layout-header ui-widget-header ui-corner-all"></div>',
                            '<div class="ui-layout-content ui-widget ui-widget-content ui-corner-all"></div>',
                        '</div>',
                        '<div id="detail" class="ui-layout-east ui-corner-all">',
                            '<div class="ui-layout-header"></div>',
                            '<div class="ui-layout-content ui-widget ui-widget-content ui-corner-all"></div>',
                        '</div>',
                        '<div id="header" class="ui-layout-west ui-corner-all">',
                            '<div class="ui-layout-header ui-corner-all"></div>',
                        '</div>',
                    '</div>',
                    '<div id="system_cache"></div>',
                    '<div id="active_form"></div>',
                    '<div id="active_upload"></div>',
                    '<div id="alert_stage"></div>',
                    '<div id="help_stage"></div>'].join('');
                return layout_html;
            } else if(activate_process){
                return(true);
            } else if(pre_post_process){
                return(true);
            }
            return (false);
        },
        login_header : function(options){
            var lang_arr = $.dataSet.activeLanguages();
            var header = ['<div><a class="sampi_icon" title="Sampi Plan" href="http://www.sampiplan.com">Sampi Plan</a></div>'];
            for(var i=0, len=lang_arr.length; i<len; i+=1){
                header.push('<div><a title="',lang_arr[i].english_name,'" href="#activate/change_dic/iso_code/',lang_arr[i].iso_code,'">',lang_arr[i].native_name,'</a></div>');
            }
            return (header.join(''));
        },
        controlHeader : function(options){
            var result = '';
            var urgency_class = '';
            var control_html = [''];
            var header_controls = [];
            var object_id = '';
            var header_name = sampiDic.self_spaces;
            if(options.object_id!==undefined && options.curr_obj!==undefined){
                var breadcrumb = [['<a href="#context/', options.context,'" class="breadcrumb" title="',sampiDic.self_spaces,'">', sampiDic.self_spaces, '</a>'].join(''),'>'];
                urgency_class = $.viewS.set({object_data:options.curr_obj, type:"urgencyClass"});
                header_name = options.curr_obj.object_name;
                for(var i=options.parent_arr.length-1; i>=0; i-=1){
                    breadcrumb.push(['<a href="', options.href_base,'/object_id/', options.parent_arr[i].object_id, '" class="breadcrumb" title="',options.parent_arr[i].content,'">', options.parent_arr[i].object_name, '</a>'].join(''),'>');
                }
                breadcrumb = breadcrumb.join('');

                options.curr_obj.rgt = options.curr_obj.rgt*1;
                options.curr_obj.lft = options.curr_obj.lft*1;
                if(options.curr_obj.service_level>=$.sysConst.TASK_USER){
                    control_html.push(
                        '<a class="add_task_icon" href="#activate/form_dialog/form_name/new_blob/work_remain/-1/parent_id/',options.object_id,'" title="', sampiDic.add_task,'">', sampiDic.add_task,'</a>'
                        ,'<a class="add_project_icon" href="#activate/form_dialog/form_name/new_blob/work_remain/-2/parent_id/',options.object_id,'" title="', sampiDic.add_project,'">', sampiDic.add_project,'</a>');
                    if(options.curr_obj.lft<options.curr_obj.rgt-1){
                        control_html.push(
                            '<a class="move_object_icon" href="#activate/form_dialog/form_name/move_object/object_id/',options.object_id,'" title="', sampiDic.move_object,'">', sampiDic.move_object,'</a>');
                    }
                }
                if(options.curr_obj.service_level*1>$.sysConst.READ_WRITE && options.curr_obj.object_id!==options.curr_obj.root_id){
                    header_controls.push(
                        '<a class="edit_icon margin-left-sm" href="#activate/form_dialog/form_name/new_blob/object_id/'
                        ,options.object_id,'" title="',sampiDic.edit,'">',sampiDic.edit,'</a>'
                    );
                }
                if($.dataSet.adminStatusBySpace({space_id:options.curr_obj.root_id})){
                    header_controls.push(
                        '<a class="tool_icon" href="#context/', options.context ,'/object_id/',options.object_id,'/detail/space_admin/space_id/'
                        ,options.curr_obj.root_id,'/minor_view/admin_user" title="',sampiDic.settings,'">',sampiDic.settings,'</a>'
                    );
                } 
                header_controls = header_controls.join('');
            } else {
                object_id = $.dataSet.getUserSpaceId(options);
                header_controls.push(
                    '<a class="tool_icon margin-left-sm" href="#context/', options.context ,'/object_id/',object_id,'/detail/space_admin/space_id/'
                    ,object_id,'/minor_view/admin_user" title="',sampiDic.settings,'">',sampiDic.settings,'</a>'
                );
                header_controls = header_controls.join('');
                control_html.push('<a class="add_space_icon" href="#activate/form_dialog/form_name/new_space" title="',sampiDic.new_space,'">',sampiDic.new_space,'</a>');
            }
            result = [
                    '<div class="ui-widget-header ui-corner-all">'
                        ,'<div class="',urgency_class,'">'
                            ,header_name,header_controls
                        ,'</div>'
                        ,'<div class="header-breadcrumb">'
                            ,breadcrumb
                        ,'</div>'
                        ,'<div class="detail-controls pad-left">',control_html.join(''),'</div>'
                    ,'</div>'
            ].join('');
            return (result);
        },
        todayDetail : function(options){
            var object_id = $.dataSet.getUserSpaceId(options);
                var header_controls =[
                    '<a class="tool_icon margin-left-sm" href="#context/', options.context ,'/object_id/',object_id,'/detail/space_admin/space_id/'
                    ,object_id,'/minor_view/admin_user" title="',sampiDic.settings,'">',sampiDic.settings,'</a>'
                ].join('');
            options.header = [
                '<div class="ui-widget-header ui-corner-all">',
                    '<span class="">',
                                options.user_info.first_name, ' ', options.user_info.last_name,header_controls,
                    '</span>',
                    '<span class="header-options">',
                    '</span>',
                    '<div class="detail-controls pad-left">'
                        ,'<a class="add_space_icon" href="#activate/form_dialog/form_name/new_space" title="',sampiDic.new_space,'">',sampiDic.new_space,'</a>'
                    ,'</div>',
                '</div>'
            ].join('');
            options.content = '';
            return (options);
        },
        objectDetail : function(options){
            var object_array = options.object[0];
            var base_href = [
                '#context/',options.context,'/detail/object/object_id/'
                ,object_array.object_id,'/minor_view/'
            ].join('');
            var item_html = [
                '<div class="ui-widget-header ui-corner-all header-menubar">',
                    '<span class="header-options">',
                        '<span class="summary active-holder ui-corner-all"><a class="summary_link summary_detail_icon" href="',base_href,'summary" title="', sampiDic.summary_link ,'">&nbsp</a></span>',
                        '<span class="status active-holder ui-corner-all"><a class="status_link status_detail_icon" href="',base_href,'status" title="', sampiDic.status_link ,'">&nbsp</a></span>',
                        '<span class="comment active-holder ui-corner-all"><a class="comment_link share_detail_icon" href="',base_href,'comment" title="', sampiDic.comment_link ,'">&nbsp</a></span>',
                        '<span class="file active-holder ui-corner-all"><a class="file_link file_detail_icon" href="',base_href,'file" title="',sampiDic.file_link ,'">&nbsp</a></span>',
                        '<span class="team active-holder ui-corner-all"><a class="team_link team_detail_icon" href="',base_href,'team" title="', sampiDic.team_link ,'">&nbsp</a></span>',
                        '<span class="report active-holder ui-corner-all"><a class="report_link report_detail_icon" href="',base_href,'report" title="', sampiDic.reports_name ,'">&nbsp</a></span>',
                    '</span>',
                    '<span class="detail-controls pad-left"></span>',
                '</div>'
            ].join('');
            return item_html;
        },
        objectDetailControl : function(options){
             var type = {
                status : function(options){
                    var control_html = [''];
                    if(options.curr_obj.service_level>=$.sysConst.TASK_USER  && options.curr_obj.work_remain*1!==-2){
                        control_html.push(
                        '<a class="add_status_icon" href="#activate/form_dialog/form_name/update_task/object_id/',options.object_id,'" title="',sampiDic.add_status,'">',sampiDic.add_status,'</a>');
                    }
                    return control_html.join('');
                },
                comment : function(options){
                    var control_html = [''];
                    if(options.curr_obj.service_level>=$.sysConst.READ_WRITE){
                        control_html.push(
                        '<a class="add_message_icon" href="#activate/form_dialog/form_name/new_comment/object_id/',options.object_id,'" title="', sampiDic.add_message,'">', sampiDic.add_message,'</a>');
                    }
                    return control_html.join('');
                },
                file : function(options){
                    var control_html = [''];
                    if(options.curr_obj.service_level>=$.sysConst.TASK_USER){
                        control_html.push(
                        '<a class="add_file_icon" href="#activate/form_dialog/form_name/save_file/object_id/',options.object_id,'" title="', sampiDic.add_file,'">', sampiDic.add_file,'</a>');
                    }
                    return control_html.join('');
                },
                team : function(options){
                    var control_html = [''];
                    if(options.curr_obj.service_level>=$.sysConst.TASK_USER){
                        control_html.push('');
                    }
                    return control_html.join('');
                },
                summary : function(options){
                    var control_html = [type.status(options), type.comment(options), type.file(options), type.team(options)];
                    return control_html.join('');
                }
            }
            return (type[options.minor_view](options));
        },
        spaceDetail : function(options){
            options.base_href = [
                '#context/',options.context,'/detail/space_admin/space_id/'
                ,options.space_id,'/minor_view/'
            ].join('');
            if(options.curr_space===undefined){
                options.curr_space = {object_name:''};
            }
            var item_html = [
                '<div class="header-summary">',
                    '<div class="header-summary-title">',
                        options.curr_space.object_name,
                        //'<a class="pad-left edit_icon" href="#activate/form_dialog/form_name/new_blob/object_id/'
                           // ,options.object_id,'" title="',sampiDic.edit,'">',sampiDic.edit,'</a>',
                    '</div>',
                '</div>',
                '<div class="ui-widget-header ui-corner-all">',
                    '<span class="header-options">',
                        '<span class="admin_user active-holder ui-corner-all" >',
                            '<a class="users_detail_icon" href="',options.base_href,'admin_user">', sampiDic.user_admin ,'</a>',
                        '</span>',
                        '<span class="admin_team active-holder ui-corner-all" >',
                            '<a class="teams_detail_icon" href="',options.base_href,'admin_team">', sampiDic.team_admin ,'</a>',
                            '</span>',
                        //'<span class="inline">',
                        //    '<a href="',options.base_href,'admin_approval">', sampiDic.approval_admin ,'</a>',
                       //     '|',
                       // '</span>',
                        '<span class="admin_object active-holder ui-corner-all">',
                            '<a class="subs_detail_icon" href="',options.base_href,'admin_object">', sampiDic.object_admin ,'</a>',
                        '</span>',
                       // '<span class="inline">',
//                            '<a href="',options.base_href,'admin_file">', sampiDic.file_admin ,'</a>',
//                            '|',
//                        '</span>',
//                        '<span class="inline">',
//                            '<a href="',options.base_href,'admin_account">', sampiDic.account_admin ,'</a>',
//                        '</span>',
                    '</span>',
                    '<span class="detail-controls"></span>',
                '</div>'
            ].join('');
            return item_html;
        },
        spaceDetailControl : function(options){
             var type = {
                admin_user : function(options){
                    var control_html = [
                        '<a class="pad-left text-sm add_user_icon" href="#activate/form_dialog/form_name/invite_user/space_id/',options.space_id,'">',sampiDic.invite_user,'</a>'
                        ];
                    return control_html.join('');
                },
                admin_team : function(options){
                    var control_html = [
                        '<a class="pad-left text-sm add_team_icon" href="#activate/form_dialog/form_name/new_team/space_id/',options.space_id,'">',sampiDic.new_team,'</a>'
                    ];
                    return control_html.join('');
                },
                admin_approval : function(options){
                    var control_html = [''];
                    return control_html.join('');
                },
                admin_object : function(options){
                    var control_html = [];
                    //control_html.push('<a class="move_object_icon" href="#activate/form_dialog/form_name/move_object/object_id/',options.object_id,'" title="', sampiDic.move_object,'">', sampiDic.move_object,'</a>')
                    return control_html.join('');
                },
                admin_file : function(options){
                    var control_html = [''];
                    return control_html.join('');
                },
                admin_account : function(options){
                    var control_html = [''];
                    return control_html.join('');
                }
            }
            return (type[options.minor_view](options));
        },
        selfDetail : function(options){
            options.base_href = [
                '#context/',options.context,'/detail/',options.detail,'/space_id/'
                ,options.space_id,'/minor_view/'
            ].join('');
            var item_html = [
                '<div class="header-summary">',
                    '<div class="header-summary-title">',
                        '<div>',options.user_info.first_name,' ',options.user_info.last_name,'<a class="pad-left edit_icon" href="#activate/form_dialog/form_name/update_user_info" title="',sampiDic.edit,'">',sampiDic.edit,'</a></div></div>',
                        '<div>',$.dataSet.firstAttributeValueByUser(options.user_info.id, 'email'),'<a class="pad-left edit_icon" href="#activate/form_dialog/form_name/update_user_email" title="',sampiDic.edit,'">',sampiDic.edit,'</a></div>',
                    '</div>',
                '</div>',
                '<div class="ui-widget-header ui-corner-all">',
                    '<span class="header-options roomy med_back_color">',
                        '<span class="info active-holder ui-corner-all" >',
                            '<a class="user_info_detail_icon" href="',options.base_href,'info">', sampiDic.self_info ,'</a>',
                        '</span>',
//                        '<span class="inline" >',
//                            '<a href="',options.base_href,'spaces">', sampiDic.self_spaces ,'</a>',
//                            '|',
//                        '</span>',
//                        '<span class="inline">',
//                            '<a href="',options.base_href,'account">', sampiDic.self_account ,'</a>',
//                        '</span>',
                    '</span>',
                    '<span class="detail-controls"></span>',
                '</div>'
            ].join('');
            return item_html;
        },
        selfDetailControl : function(options){
             var type = {
                info : function(options){
                    var control_html = [
                        '<a class="pad-left text-sm add_avatar_icon" href="#activate/form_dialog/form_name/update_user_avatar/">',sampiDic.new_avatar,'</a>'
                    ];
                    return control_html.join('');
                },
                spaces : function(options){
                    var control_html = [''];
                    return control_html.join('');
                },
                account : function(options){
                    var control_html = [''];
                    return control_html.join('');
                }
            }
            if(type[options.minor_view]!==undefined){
                return (type[options.minor_view](options));
            }
            
        },
        reportDetail : function(options){
            var item_html = [
                '<div class="header-summary">',
                    '<div class="header-summary-title">',
                        sampiDic[options.report_name],
                    '</div>',
                '</div>',
                '<div class="ui-widget-header ui-corner-all">',
                    '<span class="header-options"></span>',
                    '<span class="detail-controls pad-left"></span>',
                '</div>'
            ].join('');
            return item_html;
        },
        reportList : function(options){
            var item_html = [];
            if(options!==undefined && options.report!==undefined){
                for(var i=0, len=options.report.length; i<len; i+=1){
                    item_html.push(
                        '<div>'
                            ,'<a href="',options.loc, '/report_name/', options.report[i].report_name, '" title="',sampiDic[options.report[i].report_name], '" >',sampiDic[options.report[i].report_name],'</a>'
                        ,'</div>'
                    );
                }
            }
            item_html = item_html.join('');
            return item_html;
        },
        helpContent : function(options){
            var type = {
                status : function(options){
                    var result_html = ['<div><div>',sampiDic.status_help_summary,'</div>'];
                    if(options.curr_obj.service_level>=$.sysConst.TASK_USER  && options.curr_obj.work_remain*1!==-2){
                        result_html.push(
                            '<a class="add_status_icon" href="#activate/form_dialog/form_name/update_task/object_id/',options.object_id,'" title="',sampiDic.add_status,'">',sampiDic.add_status,'</a>'
                            ,'<span>',sampiDic.status_help_add,'</span>'
                        );
                    }
                    result_html.push('</div>');
                    return result_html.join('');
                },
                comment : function(options){
                    var result_html = ['<div><div>',sampiDic.comment_help_summary,'</div>'];
                    if(options.curr_obj.service_level>=$.sysConst.READ_WRITE){
                        result_html.push(
                            '<a class="add_message_icon" href="#activate/form_dialog/form_name/new_comment/object_id/',options.object_id,'" title="', sampiDic.add_message,'">', sampiDic.add_message,'</a>'
                            ,'<span>',sampiDic.comment_help_add,'</span>'
                        );
                    }
                    result_html.push('</div>');
                    return result_html.join('');
                },
                file : function(options){
                    var result_html = ['<div><div>',sampiDic.file_help_summary,'</div>'];
                    if(options.curr_obj.service_level>=$.sysConst.TASK_USER){
                        result_html.push(
                        '<a class="add_file_icon" href="#activate/form_dialog/form_name/save_file/object_id/',options.object_id,'" title="', sampiDic.add_file,'">', sampiDic.add_file,'</a>'
                        ,'<span>',sampiDic.file_help_add,'</span>'
                        );
                    }
                    result_html.push('</div>');
                    return result_html.join('');
                },
                team : function(options){
                    var result_html = ['<div><div>',sampiDic.team_help_summary,'</div>'];
                    if(options.curr_obj.service_level>=$.sysConst.TASK_USER){
                        result_html.push('');
                    }
                    result_html.push('</div>');
                    return result_html.join('');
                },
                object_select : function(options){
                    var result_html = [
                        '<div class="margin-all">'
                            ,'<div>',sampiDic.select_item_for_detail,'</div>'
                            ,'<div class="ui-widget-header ui-corner-top margin-top pad-left pad-right inline-block">',sampiDic.tasks_projects_description_header,'</div>'
                            ,'<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">'
                                ,'<div class="pad-all"><span class="holder_object"></span>',sampiDic.project_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_0"></span>',sampiDic.new_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_1"></span>',sampiDic.on_time_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_2"></span>',sampiDic.low_risk_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_3"></span>',sampiDic.high_risk_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_4"></span>',sampiDic.complete_task_explanation,'</div>'
                            ,'</div>'
                        ,'</div>'];
                    return result_html.join('');
                }
            }
            options.help_type = (options.help_type===undefined) ? options.minor_view : options.help_type;
            return (type[options.help_type](options));
        },
        titleHolder: function(options){
            return (['<div class="ui-widget-header ui-corner-top margin-top pad-left pad-right inline-block">',options.title,'</div>'].join(''));
        },
        userInfo: function(options){
            options = $.dataSet.getUserInfo(options);
            var item_html = [
                '<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">'
                ,'<span class="user_icon inline-block" style="', $.sys.workingLayoutRef.avatarStyle(options),'"></span>'
                ,'<span class="inline-block pad-left pad-right"><div>',options.user_info.last_name,', ', options.user_info.first_name,'</div>'];
            for(var i=0, len=options.user_info.userattributes.length; i<len; i+=1){
                if(options.user_info.userattributes[i].attribute === 'email'){
                    item_html.push('<div>',sampiDic.email,': ',options.user_info.userattributes[i].value,'</div>');
                }
            }
            if(options.work_summary!==undefined){
                item_html.push(
                    '<div>',sampiDic.work_done_title,': ',(options.work_summary.work_total/3600).toFixed(1) + ' ',sampiDic.hours_worked,'</div>'
                    ,'<div>',sampiDic.work_remaining,': ',(options.work_summary.work_remain/3600).toFixed(1) + ' ',sampiDic.hours_remain,'</div>');
            }
            if(options.updated_at!==undefined){
                item_html.push(
                    '<div>',$.samUtil.formatEpochDateToPrettyDate(options.updated_at),'</div>');
            }
            item_html.push('</span></div>');
            return item_html.join('');
        },
        avatarStyle: function(options){
            var user_icon = '';
            if(options.user_info['userimage']!==undefined &&
                 options.user_info['userimage']!==null
                 && options.user_info['userimage'] !==''){
                 user_icon = 'background: transparent url('+"'"+ $.sysConst.base_target_clean +'?task=avatar&user_id='+options.user_info.id+"'"+') no-repeat top center;'
            }
            return user_icon;
        },
        commentSummary : function(comment_arr, options){
            var item_html = [];
            var parent_arr = (comment_arr.comment_parent_arr!==undefined) ? comment_arr.comment_parent_arr : comment_arr;
            var curr_obj = $.dataSet.currObjectByObject({object_id:comment_arr.object_id}).curr_obj;
            var base_href = ['#context/',options.context,'/detail/object/object_id/'
                    ,curr_obj.object_id,'/minor_view/'
                ].join('');
            var user_info_arr = $.dataSet.getUserInfo({user_id:comment_arr.owner_id}).user_info;
            item_html.push('<div><a href="',base_href,'comment">',$.samUtil.formatEpochDateToPrettyDate(comment_arr.updated_at),' - ');
            if(curr_obj.object_id!==options.object_id){
                item_html.push(curr_obj.object_name,':');
            }
            item_html.push(parent_arr.title,' (',user_info_arr.last_name,', ', user_info_arr.first_name,') ','</a></div>');
            return (item_html.join(''));
        },
        fileSummary : function(file_arr, options){
            var item_html = [];
            var curr_obj = $.dataSet.currObjectByObject({object_id:file_arr.object_id}).curr_obj;
            var base_href = ['#context/',options.context,'/detail/object/object_id/'
                    ,curr_obj.object_id,'/minor_view/'
                ].join('');
            var user_info_arr = $.dataSet.getUserInfo({user_id:file_arr.owner_id}).user_info;
            item_html.push('<div><a href="',base_href,'file">',$.samUtil.formatEpochDateToPrettyDate(file_arr.updated_at),' - ');
            if(curr_obj.object_id!==options.object_id){
                item_html.push(curr_obj.object_name,':');
            }
            item_html.push(file_arr.title,' (',user_info_arr.last_name,', ', user_info_arr.first_name,') ','</a></div>');
            return (item_html.join(''));
        },
        statusSummary : function(status_arr, options){
            var item_html = [];
            var summary_text = [];
            var curr_obj = $.dataSet.currObjectByObject({object_id:status_arr.object_id}).curr_obj;
            var base_href = ['#context/',options.context,'/detail/object/object_id/'
                    ,curr_obj.object_id,'/minor_view/'
                ].join('');
            var user_info_arr = $.dataSet.getUserInfo({user_id:status_arr.owner_id}).user_info;
            item_html.push('<div><a href="',base_href,'status">',$.samUtil.formatEpochDateToPrettyDate(status_arr.updated_at),' - ');
            if(curr_obj.object_id!==options.object_id){
                item_html.push(curr_obj.object_name,':');
            }
            if(status_arr.work_done*1>0){
                summary_text.push((status_arr.work_done/3600).toFixed(1) + ' ',sampiDic.hours_worked);
            }
            if(status_arr.work_remain*1>0){
                summary_text.push('/',(status_arr.work_remain/3600).toFixed(1) + ' ',sampiDic.hours_remain);
            }
            item_html.push(summary_text.join(''),' (',user_info_arr.last_name,', ', user_info_arr.first_name,') ','</a></div>');
            return (item_html.join(''));
        },
        statusSummaryDetail : function(options){
            var item_html = [];
            var work_total_sum = 0;
            var work_remain_sum = 0;
            var projects_sum = 0;
            var active_tasks_sum = 0;
            var inactive_tasks_sum = 0;
            var complete_tasks_sum = 0;
            for(var i=0, len=options.work_summary.length; i<len; i+=1){
                work_total_sum += options.work_summary[i].work_total;
                work_remain_sum += options.work_summary[i].work_remain;
            }
            for(i=0, len=options.object.length; i<len; i+=1){
                if(options.object[i].work_remain*1>0 && options.object[i].object_id!==options.curr_obj.object_id){
                    active_tasks_sum += 1;
                } else if(options.object[i].work_remain*1===0 && options.object[i].object_id!==options.curr_obj.object_id){
                    complete_tasks_sum += 1;
                } else if(options.object[i].work_remain*1===-1 && options.object[i].object_id!==options.curr_obj.object_id){
                    inactive_tasks_sum += 1;
                } else if(options.object[i].work_remain*1===-2 && options.object[i].object_id!==options.curr_obj.object_id){
                    projects_sum += 1;
                }
            }
            if(options.work_summary!==undefined){
                if(projects_sum>0){
                    item_html.push('<div>',projects_sum,' Projects</div>');
                }
                if(work_total_sum>0){
                    item_html.push('<div>',(work_total_sum/3600).toFixed(1) + ' ',sampiDic.hours_worked);
                    if(complete_tasks_sum>0){
                        item_html.push(' in ',complete_tasks_sum,' Complete Tasks');
                    }
                    item_html.push('</div>');
                }
                if(work_remain_sum>0){
                    item_html.push('<div>',(work_remain_sum/3600).toFixed(1) + ' ',sampiDic.hours_remain);
                    if(active_tasks_sum>1){
                        item_html.push(' in ',active_tasks_sum,' Active Tasks');
                    }
                    item_html.push('</div>');
                }
                if(inactive_tasks_sum>0){
                    item_html.push('<div>',inactive_tasks_sum,' New Tasks</div>');
                }
            }
            return (item_html.join(''));
        },
        objectContent : function(options){
            var item_html = [];
            item_html.push('<div class="header-summary">',
                    '<p class="text-sm" title="',options.curr_obj.content,'">',options.curr_obj.content,'</p>',
                '</div>');
            return (item_html.join(''));
        }


    }
})(jQuery);