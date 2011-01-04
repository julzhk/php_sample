//NAMESPACES
(function($) {
//Creates a namespace for the static reference materials
    $.sys.formStorage = {
        new_comment : function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    options = $.dataSet.currObjectByObject(options);
                    var form_obj = {
                        form_title: sampiDic.new_comment_title + options.curr_obj.object_name,
                        form_body: ['<div class="bd">'
                            , '<form id="dialog_form" class="active" method="post" action="', $.sysConst.base_target_clean ,'">'
                                , '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="ajaxfacade" />'
                                , '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="savecomment" />'
                                , '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />'
                                , '<div class="form_content">'
                                   , '<div><label class="form_label" for="title">',sampiDic.message_subject,'</label><input type="textbox" name="title" class="text_entry postable_data keyup_watch"/></div>'
                                   , '<div><label class="form_label" for="content">',sampiDic.message_content,'</label><textarea rows="2" class="rich_editor text_entry postable_data keyup_watch" name="content"></textarea></div>'
                                   , '<input type="hidden" class="postable_data hidden_form_field comment_parent_id" name="comment_parent_id" value="-1" />'
                                   , '<input type="hidden" class="postable_data hidden_form_field comment_id" name="comment_id" value="-1" />'
                                   , '<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="', options.object_id ,'" />'
                               , '</div>'
                           , '</form>'
                           , '</div>'].join(''),
                        form_help: 'This is the comment help info.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    $.formHandler.activateSimpleEditor($("#dialog_form input.rich_editor"));
                    return true;
                },
                pre_post : function(options){
                    $.formHandler.saveSimpleEditor();
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        reply_comment : function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    options.comment = $.dataCache.get({set_name:"comment",
                        filter_by:[[{field:"id", rel:"eq", value:options.comment_parent_id}]]
                    })
                    var form_obj = {
                        form_title: sampiDic.reply_comment_title + options.comment[0].title,
                        form_body: ['<div class="bd">'
                            , '<form id="dialog_form" class="active" method="post" action="', $.sysConst.base_target_clean ,'">'
                               , '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="ajaxfacade" />'
                               , '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="savecomment" />'
                               , '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="', t_c ,'" />'
                               , '<div class="form_content">'
                                   , '<label class="form_label" for="content">', sampiDic.message_reply,'</label><textarea rows="2" class="rich_editor text_entry postable_data keyup_watch" name="content"></textarea>'
                                   , '<input type="hidden" class="postable_data hidden_form_field comment_parent_id" name="comment_parent_id" value="', options.comment_parent_id ,'" />'
                                   , '<input type="hidden" class="postable_data hidden_form_field comment_id" name="comment_id" value="-1" />'
                                   , '<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="', options.object_id ,'" />'
                               , '</div>'
                           , '</form>'
                           , '</div>'].join('') ,
                        form_help: 'This is the comment help info.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    $.formHandler.activateSimpleEditor($("#dialog_form input.rich_editor"));
                    return true;
                },
                pre_post : function(options){
                    $.formHandler.saveSimpleEditor();
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_task : function(options){
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    options = $.dataSet.currObjectByObject(options);
                    var form_obj = {
                        form_title: sampiDic.update_task + options.curr_obj.object_name,
                        form_body: '<div class="bd">' +
                            '<form id="dialog_form" class="active" method="post" action="'+ $.sysConst.base_target_clean +'">' +
                            '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="ajaxfacade" />' +
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="savetaskscrum" />' +
                            '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                            '<div class="form_content">' +
                                '<div>' + sampiDic.work_done_today + '</br>' +
                                    '<input type="text" class="time" name="work_done_entered"/>' +
                                '</div>' +
                                '<div>' + sampiDic.work_remaining+ '</br>' +
                                    '<input type="text" class="time" name="work_remain_entered"/>' +
                                '</div>' +
                                '<div>' + sampiDic.what_did_you_do_today + '</br>' +
                                    '<textarea rows="2" class="text_entry postable_data" name="work_done_desc"></textarea>' +
                                '</div>' +
                                '<div>' + sampiDic.what_are_next_steps + '</br>' +
                                '<textarea rows="2" class="text_entry postable_data" name="work_next_desc"></textarea>' +
                                '</div>' +
                                '<div>' + sampiDic.current_issues + '</br>' +
                                    '<textarea rows="2" class="text_entry postable_data" name="issue_desc"></textarea>' +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field work_done" name="work_done" value="-1" />' +
                                '<input type="hidden" class="postable_data hidden_form_field work_remain" name="work_remain" value="-1" />' +
                                '<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="'+ options.object_id +'" />' +
                            '</div>' +
                            '</form>' +
                            '</div>',
                        form_help: 'This is the task update help info.'
                    }
                    return form_obj;
                },
                activate : function(options){
                },
                pre_post : function(options){
                    var form_ele = $('#dialog_form');
                    var entered_ele = $('input.time', form_ele);
                    for(var i=0, len=entered_ele.length; i<len; i+=1){
                        var m = entered_ele[i];
                        var target_name = m.name.split('_entered');
                        var target_ele = $('input.'+target_name[0], form_ele).get(0);
                        target_ele.value = $.samUtil.parseEnteredTime(m.value);
                    }
                    if(options.confirm===undefined && $('input.work_remain', form_ele).val()*1===0){
                        options = $.dataSet.getObjectAlternateActiveUsers(options);
                        if(options.alt_active_users!==undefined && options.confirm===undefined){
                            options.alert_title = "Task complete for everyone?";//sampiDic.confirm_task_complete_title;
                            options.alert_content = "Mark this task complete for anyone working on it?";//sampiDic.confirm_task_complete_question;
                            options.alert = 'confirmYesNo';
                        }
                    } else if(options.confirm){
                        options.alert = undefined;
                        $('input.work_remain', form_ele).val("-2");
                    }

                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        save_file : function(options){
            var type = {
                init : function(options){
                    if(options.file_id===undefined){
                        options.file_id = -1;
                        options = $.dataSet.currObjectByObject(options);
                    } else {
                        options.curr_file = $.dataCache.get({set_name:"file"
                            , filter_by:[[{field:"root_id", rel:"eq", value:options.file_id}]]
                            , sort_by:["version"]});
                        options.curr_file = options.curr_file[options.curr_file.length-1];
                    }
                    if(options.file_id===-1){
                        options.curr_file = {
                            title : ''
                        };
                    }
                    var form_title = (options.file_id===-1) ? sampiDic.new_file + options.curr_obj.object_name : sampiDic.update_file + options.curr_file.title;
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_title: form_title,
                        form_body: ['<div class="bd">'
                            ,'<form class="file_upload active" method="post" action="', $.sysConst.base_target_clean ,'">'
                            ,'<input type="hidden" class="postable_data hidden_form_field task" name="task" value="ajaxfacade" />'
                            ,'<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="savefile" />'
                            ,'<input type="hidden" class="postable_data hidden_form_field option1" name="trans_id" value="',options.trans_id,'" />'
                            ,'<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />'
                            ,'<div class="form_content">'
                                ,'<div>'+sampiDic.title + '</br>'
                                    ,'<input type="text" class="text_entry title_entry" name="title" value="', options.curr_file.title ,'"/>'
                                ,'</div>'
                                ,'<div>'+ sampiDic.description + '</br>'
                                    ,'<input type="text" class="text_entry" name="description"/>'
                                ,'</div>'
                                ,'<div class="proof_file">'
                                    ,'<span class="java_holder">Loading</span>'
                                    ,'<span class="comment pad-left">' + sampiDic.proof_file + '<span class="pad-left text-sm">Please upload a file for review (jpg/pdf/png).</span></span>'
                                ,'</div>'
                                ,'<div class="main_file">'
                                    ,'<span class="java_holder">Loading</span>'
                                    ,'<span class="comment pad-left">' + sampiDic.doc_file + '<span class="pad-left text-sm">Original file or an archive (zip/rar).</span></span>'
                                ,'</div>'
                                ,'<div>' + sampiDic.submit_for_approval + '</br>'
                                    ,'<input type="checkbox" class="checkbox_entry" name="submission_status"/>'
                                ,'</div>'
                                ,'<input type="hidden" class="postable_data hidden_form_field file_id" name="file_id" value="', options.file_id ,'"/>'
                                ,'<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="', options.object_id ,'" />'
                            ,'</div>'
                            ,'</form>'
                            ,'</div>'].join(''),
                        form_help: 'This is the help for the File Upload form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    $.postData({task:"ajaxfacade", option1:"savefileuploadtoken", trans_id:options.trans_id, object_id:options.object_id});
                    var upload_ele = $("form.file_upload.active");
                    options.ele_id = "main_file"+options.trans_id;
                    options.file_type = "main_file";
                    $(".main_file span.java_holder", upload_ele).html($.sys.workingLayoutRef.browseAppletButton(options));
                    options.ele_id = "proof_file"+options.trans_id;
                    options.file_type = "proof_file";
                    $(".proof_file span.java_holder", upload_ele).html($.sys.workingLayoutRef.browseAppletButton(options));
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.hideForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        move_object : function(options){
            var type = {
                init : function(options) {
                    var t_c = $("#system_cache").data('t_c');
                    var button_obj = {};
                    var form_obj = {
                        form_title: sampiDic.moving_objects,
                        form_body: '<div class="bd">' +
                            '<form id="dialog_form" name="move_object" class="active" method="post" action="'+ $.sysConst.base_target_clean +'">' +
                            '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="ajaxfacade" />' +
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="moveobject" />' +
                            '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                            '<div>' +
                                '<div class="display-group one">' +
                                    '<div>' + sampiDic.move_source_object + '</div>' +
                                    '<div class="base_holder ui-widget ui-widget-content ui-corner-all"></div>' +
                                    '<input type="hidden" class="postable_data object_id" name="object_id" />' +
                                '</div>' +

                                '<div class="display-group two" style="display: none;">' +
                                    '<div>' + sampiDic.select_target_object + '</div>' +
                                    '<div class="target_holder ui-widget ui-widget-content ui-corner-all"></div>' +
                                    '<input type="hidden" class="text_entry target_id" name="target_id"/>' +
                                '</div>' +
                                '<div class="display-group three" style="display: none;">' +
                                    '<div><label for="move_type">'+ sampiDic.move_type +'</label></div>' +
                                    '<div class="select_holder ui-widget ui-widget-content ui-corner-all">' +
                                        '<span class="pad-left"><INPUT type="radio" class="move_type" name="move_type" value="PRE" checked>'+ sampiDic.insert_before +'</span>' +
                                        '<span class="pad-left"><INPUT type="radio" class="move_type" name="move_type" value="POST">'+ sampiDic.insert_after +'</span>' +
                                        '<span class="pad-left"><INPUT type="radio" class="move_type" name="move_type" value="CHILD">'+ sampiDic.insert_into +'</span>' +
                                    '</div>' +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field sibling_id" name="sibling_id" value="-1"/>' +
                                '<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="-1" />' +
                            '</div>' +
                            '</form>' +
                            '</div>',
                        form_help: 'This is the help for the Move Object form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    //Fetch the data and activate the tree view placed in the selector_holder and wired up to the Object_id selection.
                    var active_form = $("#dialog_form");
                    if(options.display_group===undefined){
                        options.display_group = active_form.data("display_group");
                        if(options.display_group===undefined){
                            options.display_group = 'one';
                        }
                    }
                    if(options.display_group !== active_form.data("display_group")){
                        $('.display-group', active_form).hide();
                        $('.display-group.'+options.display_group, active_form).show();
                        options.button_obj = {};
                        if(options.display_group==='three'){
                            options.button_obj[sampiDic.save] = function(){$.formHandler.handlePost(options, $(this));};
                        } else {
                            var next_group = (options.display_group==='one') ? 'two' : 'three';
                            options.button_obj[sampiDic.next] = function(){
                                var temp_options = {
                                    form_name : options.form_name,
                                    display_group : next_group,
                                    activate_group : true,
                                    form_act : "activate"
                                };
                                $.sys.formStorage[options.form_name](temp_options);
                            }
                        }
                        options.button_obj[sampiDic.cancel] = function(){
                                $(this).dialog('destroy');
                                $.formHandler.cancelForm();
                            };
                        if(options.display_group!=='one'){
                            var prev_group = (options.display_group==='two') ? 'one' : 'two';
                            options.button_obj[sampiDic.previous] = function(){
                                var temp_options = {
                                    form_name : options.form_name,
                                    display_group : prev_group,
                                    activate_group : true,
                                    form_act : "activate"
                                };
                                $.sys.formStorage[options.form_name](temp_options);
                            };
                        }
                        active_form.data("display_group", options.display_group);
                        $('form.active').parent().dialog('option', 'buttons', options.button_obj);
                    } 
                    
                    if(options.curr_obj===undefined){
                        options.curr_obj = active_form.data("curr_obj");
                        if(options.curr_obj===undefined){
                            $.dataSet.currObjectByObject(options);
                        }
                    }
                    if(options.curr_sel===undefined){
                        options.curr_sel = active_form.data('curr_sel');
                        if(options.curr_sel===undefined){
                            options.curr_sel={
                                source:[]
                                ,target:[]
                            }
                        }
                    }
                    active_form.data('curr_obj', options.curr_obj);
                    active_form.data('curr_sel', options.curr_sel);
                    options = $.dataSet.objectsByObject(options);

                    if(options.display_group==='one'){
                        options.node_type="objectSelectItem";
                        options.sel_type = "multi";
                        options.treeview_opt = {animated: "fast"};
                        options.tree_type="nested";
                        options.sel_rel="source";
                        options.base_type="object";
                        options.target_sel = '#dialog_form div.base_holder';
                        $.viewS.tree(options);
                    }

                    if(options.display_group==='two'){
                        options = $.dataSet.objectsByRoot(options);
                        options.node_type="objectSelectItem";
                        options.sel_type="single";
                        options.sel_rel="target";
                        options.treeview_opt = {animated: "fast"};
                        options.tree_type="nested";
                        options.base_type="object";
                        options.target_sel = '#dialog_form div.target_holder';
                        $.viewS.tree(options);
                    }
                    
                },
                pre_post : function(options){
                    if(options.curr_sel.source.length===0 && options.curr_sel.target.length===0){
                        options = false;
                    } else {
                        var active_form = $('form.active');
                        options.curr_sel = active_form.data('curr_sel');
                        var move_type = '';
                        $('input.move_type', active_form)
                            .each(function(){
                                move_type = (this.checked) ? this.value : move_type;
                            });
                        options.object_id = options.curr_sel.target[0];
                        $.dataSet.parentObjectByObject(options);
                        if(move_type === 'PRE'){
                            $('input.sibling_id', active_form).val(options.object_id);
                        } else if(move_type === 'POST'){
                            //Check to see if the target is the end of the list.
                            if(options.parent_obj.rgt*1 === (options.curr_obj.rgt*1)+1){
                                $('input.parent_id', active_form).val(options.parent_obj.object_id);
                            } else {
                                $.dataSet.nextObjectSiblingByObject(options);
                                $('input.sibling_id', active_form).val(options.sibling_obj.object_id);
                            }
                        } else if(move_type === 'CHILD'){
                            $('input.parent_id', active_form).val(options.object_id);
                        } else {
                            return(false);
                        }
                        options.curr_sel.source = $.dataSet.removeChildObjects(options.curr_sel.source);
                        $('input.object_id', active_form).val(options.curr_sel.source.join(','));
                    }
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        new_blob : function(options){
                var type = {
                    init : function(options){
                        var t_c = $("#system_cache").data('t_c');
                        var object_data = {};
                        var form_title = '';
                        if(options.object_id!==undefined){
                            object_data = $.dataCache.get({set_name:"object"
                                , filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]
                            })[0];
                            form_title = sampiDic.edit_object + object_data.object_name;
                            options.driven_object_id = options.object_id;
                        } else if(options.parent_id!==undefined){
                            var parent_data = $.dataCache.get({set_name:"object"
                                , filter_by:[[{field:"object_id", rel:"eq", value:options.parent_id}]]
                            })[0];
                            object_data.owner_id=parent_data.owner_id;
                            object_data.manager_id=parent_data.manager_id;
                            object_data.object_id=-1;
                            form_title = sampiDic.new_project + parent_data.object_name;
                            if(options.work_remain*1===-1){
                                form_title = sampiDic.new_task + parent_data.object_name;
                            }
                            
                            options.driven_object_id = options.parent_id;
                        }
                        $.dataSet.getDrivingParents(options);
                        var object_name = '';
                        var content = '';
                        var owner_id = null;
                        var owner_name = '';
                        var manager_id = null;
                        var manager_name = '';
                        var set_start = null;
                        var set_start_temp = null;
                        var set_start_checked = '';
                        var set_finish = null;
                        var set_finish_temp = null;
                        var set_finish_checked = '';
                        var work_remain = -2;
                        var checked = '';
                        var start_obj_name = '';
                        var finish_obj_name = '';
                        if(options.driving_finish_obj!==undefined){
                            finish_obj_name = '<div>' + sampiDic.finish_driver + ' ' + options.driving_finish_obj.object_name
                                + ' (' + $.samUtil.convertEpochToMonDY(options.driving_finish_obj.set_finish) + ' : '
                                + $.samUtil.convertEpochToTimeAmPm(options.driving_finish_obj.set_finish) + ')</div>';
                        }
                        if(options.driving_start_obj!==undefined){
                            start_obj_name = '<div>' + sampiDic.start_driver + ' ' + options.driving_start_obj.object_name
                                + ' (' + $.samUtil.convertEpochToMonDY(options.driving_start_obj.set_start) + ' : '
                                + $.samUtil.convertEpochToTimeAmPm(options.driving_start_obj.set_start) + ')</div>';
                        }
                        if(options.work_remain!==undefined && options.work_remain !==""){
                            work_remain = options.work_remain*1;
                        }
                        if(object_data.work_remain !== undefined && object_data.work_remain !== ""){
                            work_remain = object_data.work_remain*1;
                        }
                        if(object_data.object_name!== undefined && object_data.object_name !== ""){
                              object_name =  'value="' + object_data.object_name + '"';
                        }
                        if(object_data.content !== undefined && object_data.content !== ""){
                              content =  object_data.content;
                        }
                        if(object_data.owner_id !== undefined && object_data.owner_id !== ""){
                            var owner_data = $.dataCache.get({set_name:"user"
                                , filter_by:[[{field:"id", rel:"eq", value:object_data.owner_id}]]
                            })[0];
                            if(owner_data!==undefined){
                                owner_id =  'value="' + object_data.owner_id + '"';
                                owner_name = 'value="' + owner_data.first_name + ' ' + owner_data.last_name + ' (' + $.dataSet.firstAttributeValueByUser(owner_data.id, 'email') + ')"';
                            }
                        }
                        if(object_data.manager_id !== undefined && object_data.manager_id !== ""){
                            var manager_data = $.dataCache.get({set_name:"team"
                                , filter_by:[[{field:"id", rel:"eq", value:object_data.manager_id}]]
                            })[0];
                            manager_id =  'value="' + object_data.manager_id + '"';
                            manager_name = 'value="' + manager_data.team_name + '"';
                        }
                        if(object_data.set_start !== undefined 
                            && typeof (object_data.set_start*1) === "number"
                            && object_data.set_start*1 !== 0){
                              set_start =  'value="' + object_data.set_start + '"';
                              set_start_temp =  'value="' + object_data.set_start*1000 + '"';
                              set_start_checked = ' checked';
                        }
                        if(object_data.set_finish !== undefined 
                            && typeof (object_data.set_finish*1) === "number"
                            && object_data.set_finish*1 !==0){
                              set_finish =  'value="' + object_data.set_finish + '"';
                              set_finish_temp =  'value="' + object_data.set_finish*1000 + '"';
                              set_finish_checked = ' checked';
                        }
                        var form_obj = {
                            form_title: form_title,
                            form_body: '<div class="bd">' +
                                '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="ajaxfacade" />' +
                                '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="saveblob" />' +
                                '<input type="hidden" class="postable_data hidden_form_field work_remain" name="work_remain" value="'+ work_remain +'" />' +
                                '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                '<div class="form_content">' +
                                    '<div><label class="form_label" for="object_name">'+sampiDic.name +'</label><input type="text" class="text_entry postable_data keyup_watch object_name" MAXLENGTH=30 name="object_name" '+ object_name +'/></div>' +
                                    '<div><label class="form_label" for="content">'+ sampiDic.description +'</label><textarea rows="2" class="text_entry postable_data keyup_watch object_content" name="content">'+ content +'</textarea></div>' +
                                    '<div class="form_label">'+ sampiDic.owner_name +'</div>' +
                                    '<div>' +
                                        '<input type="text" class="autocomplete owner_name" name="owner_name" '+ owner_name +'/>' +
                                        '<input type="hidden" class="postable_data hidden_form_field owner_id" name="owner_id" '+ owner_id +'/>' +
                                    '</div>' +
                                    '<div class="form_label">'+ sampiDic.team_name +'</div>' +
                                    '<div>' +
                                        '<input type="text" class="autocomplete manager_name" name="manager_name" '+ manager_name +'/>' +
                                        '<input type="hidden" class="postable_data hidden_form_field manager_id" name="manager_id" '+ manager_id +'/>' +
                                    '</div>' +
                                    '<div>' 
                                        + start_obj_name
                                        + '<div class="input_group">' 
                                        + '<div class="form_label">'+ sampiDic.start_date
                                                +'<input id="set_start_toggle" type="checkbox" name="set_start_toggle"'+ set_start_checked +' />'
                                            +'</div>' +
                                            '<input type="text" class="set_start_viewable set_start_toggle_group" name="set_start_viewable"/>' +
                                        '</div>' +
                                        '<div class="input_group pad-left set_start_toggle_group">' +
                                            '<div class="form_label">'+ sampiDic.time +'</div>' +
                                            '<input type="text" class="set_start_time_viewable timepicker" name="set_start_time_viewable"/>' +
                                        '</div>' +
                                        '<input type="hidden" class="set_start_temp" name="set_start_temp"'+ set_start_temp + '/>' +
                                        '<input type="hidden" class="postable_data set_start" name="set_start"'+ set_start + '/>' +
                                    '</div>' +
                                    '<div>' 
                                        + finish_obj_name
                                        + '<div class="input_group">'
                                            + '<div class="form_label">'+ sampiDic.finish_date
                                                +'<input id="set_finish_toggle" type="checkbox" name="set_finish_toggle"'+ set_finish_checked +' />'
                                            +'</div>' +
                                            '<input type="text" class="set_finish_viewable set_finish_toggle_group" name="set_finish_viewable"/>' +
                                        '</div>' +
                                        '<div class="input_group pad-left set_finish_toggle_group">' +
                                            '<div class="form_label">'+ sampiDic.time +'</div>' +
                                            '<input type="text" class="set_finish_time_viewable timepicker" name="set_finish_time_viewable"/>' +
                                        '</div>' +
                                        '<input type="hidden" class="hidden_form_field set_finish_temp" name="set_finish_temp" '+ set_finish_temp +'/>' +
                                        '<input type="hidden" class="hidden_form_field postable_data set_finish" name="set_finish" '+ set_finish +'/>' +
                                    '</div>' +
                                    '<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="'+ options.parent_id +'" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field object_id" name="object_id" value="'+ object_data.object_id +'"/>' +
                                '</div>' +
                                '</form>' +
                                '</div>',
                            form_help: 'This is the help for the New Blob form.'
                        }
                    return form_obj;
                },
                activate : function(options){
                    function initDateTime(toggle_sel, toggle_group, time_sel, date_sel, date_stor, date_set){
                        $(toggle_sel).click(function(e){
                                if(e.target.checked){
                                    $(toggle_group).show();
                                } else {
                                    $(toggle_group).hide();
                                }
                            }).triggerHandler("click");
                        var curr_set = $(date_set).val();
                        var curr_time = "12:00 am";
                        var curr_date = "";
                        if(curr_set!==undefined && typeof (curr_set*1)=== "number" && curr_set*1>0){
                            curr_time = $.samUtil.convertEpochToTimeAmPm(curr_set);
                            curr_date = $.samUtil.convertEpochToMonDY(curr_set);
                            curr_set = new Date(curr_set*1000);
                        } else {
                            curr_set = new Date();
                        }
                        var time_ele = $(time_sel).val(curr_time);
                        time_ele.timepickr({left:-150, top:-50, val:curr_time});
                        var date_ele = $(date_sel).val(curr_date);
                        date_ele.datepicker({dateFormat: 'dd-M-yy'
                            , altField: date_stor, altFormat:'@'
                            , defaultDate:curr_set, setDate:curr_set});
                    }
                    initDateTime("#set_start_toggle", ".set_start_toggle_group"
                        , "input.set_start_time_viewable", "input.set_start_viewable"
                        ,"input.set_start_temp", "input.set_start");
                    initDateTime("#set_finish_toggle", ".set_finish_toggle_group"
                        , "input.set_finish_time_viewable", "input.set_finish_viewable"
                        ,"input.set_finish_temp", "input.set_finish");
                    options.min_service=$.sysConst.TASK_USER;
                    options = $.dataSet.teamsByObject(options);
                    $("input.owner_name").autocomplete({
                            data: options.user_info_arr,
                            minChars: 0,
                            width: 310,
                            matchContains: "word",
                            autoFill: false,
                            formatItem: function(row, i, max) {
                                return i + "/" + max + ": \"" + row.first_name + " " + row.last_name + " (" + $.dataSet.firstAttributeValueByUser(row.id, 'email') + ")";
                            },
                            formatResult: function(row) {
                                return row.first_name + " " + row.last_name + " (" + $.dataSet.firstAttributeValueByUser(row.id, 'email') + ")";
                            },
                            result: function(event, data, formatted) {
                                $("input.owner_id").val(data.id);
                            }
                        });
                    $("input.manager_name").autocomplete({
                            data: options.team,
                            minChars: 0,
                            width: 310,
                            matchContains: "word",
                            autoFill: false,
                            formatItem: function(row, i, max) {
                                return i + "/" + max + ": \"" + row.team_name;
                            },
                            formatResult: function(row) {
                                return row.team_name;
                            },
                            result: function(event, data, formatted) {
                                $("input.manager_id").val(data.id);
                            }
                        });
                    return true;
                },
                pre_post : function(options){
                    var form_ele = $("#dialog_form");
                    var date=0;
                    var curr_toggle = $('#set_start_toggle', form_ele)[0];
                    if(curr_toggle.checked){
                        var time = $('input.set_start_time_viewable', form_ele).val();
                        if(time!==undefined){
                            time=$.samUtil.convertTimeAmPmToEpoch(time);
                        } else {
                            time=0;
                        }
                        date=$('input.set_start_temp', form_ele).val();
                        if(date!==undefined && typeof (date*1)=== "number" && date*1>0){
                            date = (date/1000) + time;
                        } else {
                            date=0;
                        }
                    }
                    $('input.set_start', form_ele).val(date);

                    date=0;
                    curr_toggle = $('#set_finish_toggle', form_ele)[0];
                    if(curr_toggle.checked){
                        time = $('input.set_finish_time_viewable', form_ele).val();
                        if(time!==undefined){
                            time=$.samUtil.convertTimeAmPmToEpoch(time);
                        } else {
                            time=0;
                        }
                        date=$('input.set_finish_temp', form_ele).val();
                        if(date!==undefined && typeof (date*1)=== "number" && date*1>0){
                            date = (date/1000) + time;
                        } else {
                            date=0;
                        }
                    }
                    $('input.set_finish', form_ele).val(date);
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        new_space: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                            '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="createspace" />' +
                                '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="useradminfacade" />' +
                                '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                '<input type="hidden" class="postable_data hidden_form_field space_type" name="space_type" value="Paid" />' +
                                '<div class="form_content">' +
                                    '<div><label for="space_name">'+ sampiDic.name +'</label><input type="text" class="text_entry postable_data" name="space_name"/></div>' +
                                '</div>' +
                            '</form>' +
                        '</div>',
                        form_help: 'This is the help for the New Spaces Form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    return true;
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        invite_user: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                                '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                    '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="inviteusertospace" />' +
                                        '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                                        '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                    '<div class="form_content">' +
                                    sampiDic.space_invite +
                                        '<div><label for="email">'+ sampiDic.email +'</label><input type="text" class="text_entry postable_data keyup_watch" name="email"/></div>' +
                                        '<input type="hidden" class="postable_data hidden_form_field space_id" name="space_id" value="'+options.space_id+'"/>' +
                                    '</div>' +
                                '</form>' +
                            '</div>',
                        form_help: 'This is the help for the Invite User Form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    return true;
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        new_team: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                                '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                    '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="createteam" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                    '<div class="form_content">' +
                                        sampiDic.create_new_team +
                                            '<div><label for="team_name">'+ sampiDic.team_name +'</label><input type="text" class="text_entry postable_data keyup_watch" name="team_name"/></div>' +
                                            '<input type="hidden" class="postable_data hidden_form_field space_id" name="space_id" value="'+options.space_id+'"/>' +
                                    '</div>' +
                                '</form>' +
                            '</div>',
                        form_help: 'This is the help for the New Team Form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    return true;
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_team_user : function(options){
            var type = {
                init : function(options) {
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                            '<form id="dialog_form" name="update_team_user" class="active" method="post" action="'+ $.sysConst.base_target_clean +'">' +
                            '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="updateteamuser" />' +
                            '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                            '<div>' +
                                '<div class="form_column_1">' +
                                    '<div>' + sampiDic.select_team_users + '</div>' +
                                    '<div class="base_holder"></div>' +
                                    '<input type="hidden" class="postable_data add" name="add" />' +
                                    '<input type="hidden" class="postable_data del" name="del" />' +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field team_id" name="team_id" value="'+ options.team_id +'" />' +
                            '</div>' +
                            '</form>' +
                            '</div>',
                        form_help: 'This is the help for the Update Team Users form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    //Fetch the data and activate the tree view placed in the selector_holder and wired up to the Object_id selection.
                    var active_form = $("#dialog_form");
                    if(options.curr_users===undefined){
                        var temp_array = $.dataCache.get({set_name:"admin_team_user"
                        , filter_by:[[{field:"team_id", rel:"eq", value:options.team_id}]]});
                        options.curr_users = [];
                        for(var i=0, len=temp_array.length; i<len; i+=1){
                            options.curr_users.push(temp_array[i].user_id);
                        }
                    }
                    if(options.curr_sel===undefined){
                        options.curr_sel={
                            source:options.curr_users
                        }
                    }
                    active_form.data('curr_sel', options.curr_sel);
                    options = $.dataSet.adminUsersByTeam(options);
                    options = $.dataSet.adminTeamsBySpace(options);
                    options.node_type="userSelectItem";
                    options.sel_type = "multi";
                    options.treeview_opt = {animated: "fast"};
                    options.tree_type="flat";
                    options.sel_rel="source";
                    options.base_type="admin_user";
                    options.target_sel = '#dialog_form div.base_holder';
                    $.viewS.tree(options);
                },
                pre_post : function(options){
                    var add_array = [];
                    var del_array = [];
                    var this_id = '';
                    var active_form = $('form.active');
                    options.curr_sel = active_form.data('curr_sel');
                    var temp_array = $.dataCache.get({set_name:"admin_team_user"
                    , filter_by:[[{field:"team_id", rel:"eq", value:options.team_id}]]});
                    options.curr_users = [];
                    for(var i=0, len=temp_array.length; i<len; i+=1){
                        options.curr_users.push(temp_array[i].user_id);
                    }
                    for(i=0, len=options.curr_sel.source.length; i<len; i+=1){
                        this_id = options.curr_sel.source[i];
                        if($.inArray(this_id, options.curr_users)===-1){
                            add_array.push(this_id);
                        }
                    }
                    for(i=0, len=options.curr_users.length; i<len; i+=1){
                        this_id = options.curr_users[i];
                        if($.inArray(this_id, options.curr_sel.source)===-1){
                            del_array.push(this_id);
                        }
                    }
                    if(add_array.length===0 && del_array.length===0){
                        //Nothing changed.
                        return(false);
                    }
                    if(add_array.length>0){
                        $('input.add', active_form).val(add_array.join(','));
                    }
                    if(del_array.length>0){
                        $('input.del', active_form).val(del_array.join(','));
                    }
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_user_team : function(options){
            var type = {
                init : function(options) {
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                            '<form id="dialog_form" name="update_user_team" class="active" method="post" action="'+ $.sysConst.base_target_clean +'">' +
                            '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="updateuserteam" />' +
                            '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                            '<div>' +
                                '<div class="form_column_1">' +
                                    '<div>' + sampiDic.select_user_teams + '</div>' +
                                    '<div class="base_holder"></div>' +
                                    '<input type="hidden" class="postable_data add" name="add" />' +
                                    '<input type="hidden" class="postable_data del" name="del" />' +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field user_id" name="user_id" value="'+ options.user_id +'" />' +
                                '<input type="hidden" class="postable_data hidden_form_field space_id" name="space_id" value="'+ options.space_id +'" />' +
                            '</div>' +
                            '</form>' +
                            '</div>',
                        form_help: 'This is the help for the Update User Teams form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                   //Fetch the data and activate the tree view placed in the selector_holder and wired up to the Object_id selection.
                    var active_form = $("#dialog_form");
                    options = $.dataSet.adminTeamsByUser(options);
                    if(options.curr_teams===undefined){
                        options.curr_teams = [];
                        for(var i=0, len=options.curr_team.length; i<len; i+=1){
                            options.curr_teams.push(options.curr_team[i].id);
                        }
                    }
                    if(options.curr_sel===undefined){
                        options.curr_sel={
                            source:options.curr_teams
                        }
                    }
                    active_form.data('curr_sel', options.curr_sel);
                    options = $.dataSet.adminTeamsBySpace(options);
                    options.node_type="teamSelectItem";
                    options.sel_type = "multi";
                    options.treeview_opt = {animated: "fast"};
                    options.tree_type="flat";
                    options.sel_rel="source";
                    options.base_type="admin_team";
                    options.target_sel = '#dialog_form div.base_holder';
                    $.viewS.tree(options);
                },
                pre_post : function(options){
                    var add_array = [];
                    var del_array = [];
                    var this_id = '';
                    var active_form = $('form.active');
                    options.curr_sel = active_form.data('curr_sel');
                    options = $.dataSet.adminTeamsByUser(options);
                    options.curr_teams = [];
                    for(var i=0, len=options.curr_team.length; i<len; i+=1){
                        options.curr_teams.push(options.curr_team[i].id);
                    }
                    for(i=0, len=options.curr_sel.source.length; i<len; i+=1){
                        this_id = options.curr_sel.source[i];
                        if($.inArray(this_id, options.curr_teams)===-1){
                            add_array.push(this_id);
                        }
                    }
                    for(i=0, len=options.curr_teams.length; i<len; i+=1){
                        this_id = options.curr_teams[i];
                        if($.inArray(this_id, options.curr_sel.source)===-1){
                            del_array.push(this_id);
                        }
                    }
                    if(add_array.length===0 && del_array.length===0){
                        //Nothing changed.
                        return(false);
                    }
                    if(add_array.length>0){
                        $('input.add', active_form).val(add_array.join(','));
                    }
                    if(del_array.length>0){
                        $('input.del', active_form).val(del_array.join(','));
                    }
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_team_object : function(options){
            var type = {
                init : function(options) {
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                            '<form id="dialog_form" name="update_team_object" class="active" method="post" action="'+ $.sysConst.base_target_clean +'">' +
                            '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="updateteamobject" />' +
                            '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                            '<div>' +
                                '<div class="form_column_1">' +
                                    '<div>' + sampiDic.select_team_objects + '</div>' +
                                    '<div class="base_holder"></div>' +
                                    '<input type="hidden" class="postable_data add" name="add" />' +
                                    '<input type="hidden" class="postable_data del" name="del" />' +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field team_id" name="team_id" value="'+ options.team_id +'" />' +
                            '</div>' +
                            '</form>' +
                            '</div>',
                        form_help: 'This is the help for the Update Team Ojbects form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    //Fetch the data and activate the tree view placed in the selector_holder and wired up to the Object_id selection.
                    var active_form = $("#dialog_form");
                    options = $.dataSet.adminObjectsByTeam(options);
                    if(options.curr_objects===undefined){
                        options.curr_objects = [];
                        for(var i=0, len=options.admin_blob_team.length; i<len; i+=1){
                            options.curr_objects.push(options.admin_blob_team[i].blob_id);
                        }
                    }
                    if(options.curr_sel===undefined){
                        options.curr_sel={
                            source:options.curr_objects
                        }
                    }
                    active_form.data('curr_sel', options.curr_sel);
                    options = $.dataSet.adminObjectsBySpace(options);
                    options.node_type="objectSelectItem";
                    options.sel_type = "multi";
                    options.sel_inherit = false;
                    options.treeview_opt = {animated: "fast"};
                    options.tree_type="nested";
                    options.sel_rel="source";
                    options.base_type="admin_object";
                    options.target_sel = '#dialog_form div.base_holder';
                    $.viewS.tree(options);
                },
                pre_post : function(options){
                    var add_array = [];
                    var del_array = [];
                    var this_id = '';
                    var active_form = $('form.active');
                    options.curr_sel = active_form.data('curr_sel');
                    var temp_array = $.dataCache.get({set_name:"admin_blob_team"
                    , filter_by:[[{field:"team_id", rel:"eq", value:options.team_id}]]});
                    options.curr_objects = [];
                    for(var i=0, len=temp_array.length; i<len; i+=1){
                        options.curr_objects.push(temp_array[i].blob_id);
                    }
                    for(i=0, len=options.curr_sel.source.length; i<len; i+=1){
                        this_id = options.curr_sel.source[i];
                        if($.inArray(this_id, options.curr_objects)===-1){
                            add_array.push(this_id);
                        }
                    }
                    for(i=0, len=options.curr_objects.length; i<len; i+=1){
                        this_id = options.curr_objects[i];
                        if($.inArray(this_id, options.curr_sel.source)===-1){
                            del_array.push(this_id);
                        }
                    }
                    if(add_array.length===0 && del_array.length===0){
                        //Nothing changed.
                        return(false);
                    }
                    if(add_array.length>0){
                        $('input.add', active_form).val(add_array.join(','));
                    }
                    if(del_array.length>0){
                        $('input.del', active_form).val(del_array.join(','));
                    }
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_team_perm: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">'+
                            '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="updateteamperm" />' +
                                '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                                '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                '<div class="form_content">' +
                                    '<div>'+ sampiDic.service_level +' ' +
                                        '<select class="postable_data service_level" name="service_level">' +
                                            '<option value="0">'+ sampiDic.none +'</option>' +
                                            '<option value="1">'+ sampiDic.read_only +'</option>' +
                                            '<option value="2">'+ sampiDic.contribute +'</option>' +
                                            '<option value="3">'+ sampiDic.tasking +'</option>' +
                                            '<option value="5">'+ sampiDic.project_management +'</option>' +
                                        '</select>' +
                                    '</div>' +
                                    '<div>  '+ sampiDic.space_admin_level +' ' +
                                        '<select class="postable_data account_admin" name="account_admin">' +
                                            '<option value="0">'+ sampiDic.none +'</option>' +
                                            '<option value="1">'+ sampiDic.modify +'</option>' +
                                        '</select>' +
                                    '</div>' +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field team_id" name="team_id" value="'+ options.team_id +'" />' +
                            '</form>' +
                           '</div>',
                        form_help : 'This is the help for the permissions editing form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    var active_form = $("#dialog_form");
                    options.curr_team = $.dataCache.get({set_name:"admin_team"
                        , filter_by:[[{field:"id", rel:"eq", value:options.team_id}]]})[0];
                    $(".service_level", active_form).val(options.curr_team.service_level);
                    $(".account_admin", active_form).val(options.curr_team.account_admin);
                    return true;
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        delete_object: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">'+
                            '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="deleteobject" />' +
                                '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="adminfacade" />' +
                                '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                '<div class="form_content">' +
                                    sampiDic.del_warn +
                                '</div>' +
                                '<input type="hidden" class="postable_data hidden_form_field object_id" name="object_id" value="'+ options.object_id +'" />' +
                            '</form>' +
                            '</div>'+
                           '</div>',
                        form_help : 'This is the help for the delete object form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                   return true;
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_user_info: function(options) {
            var type = {
                init : function(options){
                    options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                                '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                    '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="updateuserinfo" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="useradminfacade" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                    '<div class="form_content">' +
                                        '<div><label for="first_name">'+ sampiDic.first +' </label><input type="text" class="text_entry postable_data keyup_watch" name="first_name" value="'+ options.user_info.first_name +'"/></div>' +
                                        '<div><label for="last_name">'+ sampiDic.last +' </label><input type="text" class="text_entry postable_data keyup_watch" name="last_name" value="'+ options.user_info.last_name +'"/></div>' +
                                    '</div>' +
                                '</form>' +
                            '</div>',
                            form_help: 'This is the help for the Update User Info Form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    return true;
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_user_email: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: '<div class="bd">' +
                                '<form id="dialog_form" class="active" action="'+ $.sysConst.base_target_clean +'" method="post">' +
                                    '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="updateuseremail" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field task" name="task" value="useradminfacade" />' +
                                    '<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />' +
                                    '<div class="form_content">' +
                                        '<div><label for="email">'+ sampiDic.new_email +' </label><input type="text" class="text_entry postable_data email" name="email" value=""/></div>' +
                                    '</div>' +
                                '</form>' +
                            '</div>',
                            form_help: 'This is the help for the Update User Email Form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    return true;
                },
                pre_post : function(options){
                    var form_ele = $('#dialog_form.active');
                    var email = $('input.email', form_ele).val();
                    if($.samUtil.validEmail(email)){
                        return(options);
                    }
                    return(false);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        update_user_avatar: function(options) {
            var type = {
                init : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    var form_obj = {
                        form_body: ['<div class="bd">'
                            ,'<form class="update_user_avatar active" method="post" action="', $.sysConst.base_target_clean ,'">'
                            ,'<input type="hidden" class="postable_data hidden_form_field task" name="task" value="useradminfacade" />'
                            ,'<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="uploadavatar" />'
                            ,'<input type="hidden" class="postable_data hidden_form_field trans_id" name="trans_id" value="',options.trans_id,'" />'
                            ,'<input type="hidden" class="postable_data hidden_form_field t_c" name="t_c" value="'+ t_c +'" />'
                            ,'<div class="form_content">'
                                ,'<div class="avatar_file"><span class="java_holder">Loading</span>'
                                    ,'<span class="comment pad-left">',sampiDic.avatar_file_title,'<span class="pad-left text-sm">',sampiDic.avatar_file_instructions,'</span></span>'
                                ,'</div>'
                            ,'</div>'
                            ,'</form>'
                            ,'</div>'].join(''),
                        form_help: 'This is the help for the Update User Avatar form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    var t_c = $("#system_cache").data('t_c');
                    $.postData({task:"useradminfacade", option1:"saveavataruploadtoken", trans_id:options.trans_id, t_c:t_c});
                    var upload_ele = $("form.update_user_avatar.active");
                    options.ele_id = "avatar_file"+options.trans_id;
                    options.file_type = "avatar_file";
                    $(".avatar_file span.java_holder", upload_ele).html($.sys.workingLayoutRef.browseAppletButton(options));
                },
                pre_post : function(options){
                    return(options);
                },
                post_success: function(options){
                    $.formHandler.cancelForm();
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        approval_template_node_create: function(item_data){
            var option = 'create_approvaltemplate_node';
            if(item_data.node_id>0){
                option = 'updateapprovaltemplate';
            }
            var form_obj = {
                form_body: ['<div class="bd">' ,
                        '<form id="dialog_form" class="active" action="', $.sysConst.admin_target ,'" method="post">' ,
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="', option ,'" />' ,
                            '<input type="hidden" class="postable_data hidden_form_field template_id" name="template_id" value="', item_data.template_id ,'" />' ,
                            '<input type="hidden" class="postable_data hidden_form_field target_id" name="target_id" value="', item_data.target_id ,'" />' ,
                            '<div class="form_content">' ,
                                '<div><label for="template_name">Approval Tree Name </label><input type="text" class="text_entry postable_data keyup_watch" name="template_name"/></div>' ,
                                '<div><label for="type">Approval(a) or Distribution(b) </label><input type="text" class="text_entry postable_data keyup_watch" name="type"/></div>' ,
                                '<div><label for="duration">Approval Time (seconds) </label><input type="text" class="text_entry postable_data keyup_watch" name="duration"/></div>' ,
                                '<div><label for="team_id">Team ID </label><input type="text" class="text_entry postable_data keyup_watch" name="team_id"/></div>' ,
                                '<div><label for="user_id">User ID </label><input type="text" class="text_entry postable_data keyup_watch" name="user_id"/></div>' ,
                                '<div><label for="rel">Before(before), Inside(in), After(after) </label><input type="text" class="text_entry postable_data keyup_watch" name="rel"/></div>' ,
                                '<input type="hidden" class="postable_data hidden_form_field id" name="id" value="', item_data.node_id ,'"/>' ,
                            '</div>' ,
                        '</form>' ,
                    '</div>'].join(''),
                form_help: 'This is the help for the New Approval Template Node Form.'
             }
             return(form_obj);
        },
        approval_template_create: function(node_id) {
            var option = 'createapprovaltemplate';
            if(node_id>0){
                option = 'updateapprovaltemplate';
            }
            var form_obj = {
                form_body: ['<div class="bd">' ,
                        '<form id="dialog_form" class="active" action="', $.sysConst.admin_target ,'" method="post">' ,
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="', option ,'" />' ,
                            '<div class="form_content">' ,
                                '<div><label for="template_name">Approval Tree Name </label><input type="text" class="text_entry postable_data keyup_watch" name="template_name"/></div>' ,
                                '<input type="hidden" class="postable_data hidden_form_field space_id" name="space_id" value="',$.samUtil.getSpaceIdFromCenterHeader(),'"/>' ,
                                '<input type="hidden" class="postable_data hidden_form_field id" name="id" value="', node_id ,'"/>' ,
                            '</div>' ,
                        '</form>' ,
                    '</div>'].join(''),
                form_help: 'This is the help for the New Approval Tree Form.'
             }
             return(form_obj);
        },
        approval_node_delete: function(node_id) {
             var form_obj = {
                form_body: ['<div class="bd">' ,
                        '<form id="dialog_form" class="active" action="', $.sysConst.admin_target ,'" method="post">' ,
                            '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="deleteapprovaltemplate" />' ,
                            '<div class="form_content">' ,
                                '<div>You are about to delete this template, press Save to confirm.</div>',
                                '<input type="hidden" class="postable_data hidden_form_field approval_template_id" name="approval_template_id" value="', node_id,'"/>' ,
                            '</div>' ,
                        '</form>' ,
                    '</div>'].join(''),
                form_help: 'This is the help for the Delete Approval Template Form.'
             }
             return(form_obj);
        },
        approval_template_modify : function(init_data, activate_process, pre_post_process){
            if(init_data) {
                if(YAHOO.lang.isUndefined(init_data.return_method) || YAHOO.lang.isNull(init_data.return_method)){
                    init_data.return_method = '';
                }
                var form_obj = {
                    form_body: ['<div class="bd">' ,
                        '<form id="dialog_form" class="active" method="post" action="', $.sysConst.base_target_clean ,'">' ,
                        '<input type="hidden" class="postable_data hidden_form_field option1" name="option1" value="moveapprovaltemplate_node" />' ,
                        '<div class="container yui-g">' ,
                            '<div class="form_content yui-u first">' ,
                                '<div>Select an Object to Move:</br>' ,
                                    '<div class="base_name"></div>' ,
                                    '<input type="hidden" class="postable_data text_entry object_id" name="object_id" />' ,
                                '</div>' ,
                                '<div>Select a Target Object:</br>' ,
                                    '<div class="target_name"></div>' ,
                                    '<input type="hidden" class="text_entry target_id" name="target_id"/>' ,
                                '</div>' ,
                                '<div>' ,
                                    '<label for="move_type">Move Type<BR></label>' ,
                                    '<INPUT type="radio" class="move_type" name="move_type" value="PRE" checked> Insert Before<BR>' ,
                                    '<INPUT type="radio" class="move_type" name="move_type" value="POST"> Insert After<BR>' ,
                                    '<INPUT type="radio" class="move_type" name="move_type" value="CHILD"> Insert Into<BR>' ,
                                '</div>' ,
                                '<input type="hidden" class="postable_data hidden_form_field sibling_id" name="sibling_id" value="-1"/>' ,
                                '<input type="hidden" class="postable_data hidden_form_field parent_id" name="parent_id" value="-1" />' ,
                            '</div>' ,
                            '<div class="yui-u stop_event">' ,
                                '<div class="selector_holder container"></div>' ,
                            '</div>' ,
                        '</div>' ,
                        '</form>' ,
                        '</div>'].join(''),
                    form_help: 'This is the help for the Move Object form.'
                }
                return form_obj;
            } else if(activate_process){
                //Fetch the data and activate the tree view placed in the selector_holder and wired up to the Object_id selection.
                //YAHOO.S.aS.loadMethodObj.form_object_id_display($.samUtil.getFirstElementByClass('selector_holder', 'div', 'active_form'));
            } else if(pre_post_process){
                var move_type_array = YAHOO.util.Dom.getElementsByClassName('move_type', 'input', 'active_form');
                for (var i=0, len=move_type_array.length; i<len ; i+=1) {
                    if(move_type_array[i].checked) {
                            var move_type = move_type_array[i].value;
                    }
                }
                var target_id = $.samUtil.getFirstElementByClass('target_id', 'input', 'active_form').value;
                if(move_type === 'PRE'){
                    $.samUtil.getFirstElementByClass('sibling_id', 'input', 'active_form').value = target_id;
                } else if(move_type === 'POST'){
                    var target_parent = $.samUtil.getParentObject(target_id);
                    var target_object = YAHOO.S.aS.getObjectDetails(target_id);
                    //Check to see if the target is the end of the list.
                    if(target_parent.rgt*1 === (target_object.rgt*1)+1){
                        $.samUtil.getFirstElementByClass('parent_id', 'input', 'active_form').value = target_parent.object_id;
                    } else {
                        var sibling_obj = $.samUtil.getNextSibling(target_id, target_object);
                        $.samUtil.getFirstElementByClass('sibling_id', 'input', 'active_form').value = sibling_obj.object_id;
                    }
                } else if(move_type === 'CHILD'){
                    $.samUtil.getFirstElementByClass('parent_id', 'input', 'active_form').value = target_id;
                } 
            }
            return(true);
        },
        login_form_reset : function(options){
            var type = {
                init : function(options){
                    var form_obj = {
                        form_body: ['<div class="login-form ui-widget ui-corner-all">',
                                '<div class="title show ui-widget-header ui-corner-all">'+ sampiDic.please_log_in +'</div>',
                                '<div class="ui-widget-content ui-corner-all"><form id="login_form_reset" name="login_form_reset" class="post_form" action="', $.sysConst.base_target_clean ,'" method="post">',
                                    '<input class="postable_data option1" type="hidden" name="task" value="loginfacade"/>',
                                    '<input class="postable_data option1" type="hidden" name="option1" value="resetpassword"/>',
                                    '<div class="wrapper fluffy"><div class="form_grid">',
                                        '<div class="form_left"><label class="form_label" for="email">'+ sampiDic.email +':</label></div>',
                                        '<div class="form_right"><input class="postable_data email" value="" type="text" name="email" /></div>',
                                        '<div class="form_left"></div>',
                                        '<div class="form_right buttonpane">',
                                            '<button id="submit" class="submit_button ui-button ui-state-default ui-corner-all">'+ sampiDic.reset_password +'</button>',
                                            '<button id="login-user" class="ui-button ui-state-default ui-corner-all">'+ sampiDic.back_to_login +'</button>',
                                        '</div>',
                                    '</div></div>',
                                '</form></div>',
                            '</div>'].join(''),
                        "content": ['<div class="login-form ui-widget ui-corner-all">',
                                '<div class="wrapper fluffy ui-widget-content ui-corner-all">',
                                    '<button id="create-user" class="ui-button ui-state-default ui-corner-all">'+ sampiDic.sign_up_new_account +'</button>',
                                '</div>',
                            '</div>',
                            '<div>', sampiDic.curr_user_reset_password,'</div>'].join(''),
                        form_help: 'This is the help for the Login form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    $('#create-user').click(function() {
                        var form_content = $.sys.formStorage.login_form_new({form_act:'init'});
                        $('#detail .ui-layout-content').html(form_content.form_body);
                        $('#control .ui-layout-content').html(form_content.content);
                        $.sys.formStorage.login_form_new({form_act:'activate'});
                        })
                        .initButton();
                    $('#login-user').click(function() {
                        var form_content = $.sys.formStorage.login_form({form_act:'init'});
                        $('#detail .ui-layout-content').html(form_content.form_body);
                        $('#control .ui-layout-content').html(form_content.content);
                        $.sys.formStorage.login_form({form_act:'activate'});
                    })
                    .initButton();
                    $('#submit').click(
                        function(){
                            return($('#login_form_reset').postForm());
                        })
                    .initButton();
                    return(true);
                } ,
                pre_post : function(options){
                    options.success_func = 'registerConfirm';
                    var form_ele = $('#login_form_reset');
                    var email = $('input.email', form_ele).val();
                    if($.samUtil.validEmail(email)){
                        return(options);
                    }
                    return(false);
                },
                post_success: function(options){
                    return true;
                }
            }
            return (type[options.form_act](options));
        },
        login_form : function(options){
            var type = {
                init : function(options){
                    var form_obj = {
                        form_body: ['<div class="login-form ui-widget ui-corner-all">',
                                '<div class="title show ui-widget-header ui-corner-all">'+ sampiDic.please_log_in +'</div>',
                                '<div class="ui-widget-content ui-corner-all"><form id="login_form" name="login_form" class="post_form" action="', $.sysConst.base_target_clean , '" method="post">',
                                    '<input class="postable_data task" type="hidden" name="task" value="loginfacade"/>',
                                    '<input class="postable_data option1" type="hidden" name="option1" value="userlogin"/>',
                                    '<input class="postable_data invite_email" type="hidden" name="invite_email" />',
                                    '<input class="postable_data token" type="hidden" name="token" />',
                                    '<input class="postable_data space_id" type="hidden" name="space_id" />',
                                    '<input class="postable_data reset" type="hidden" name="reset" />',
                                    '<div class="wrapper fluffy"><div class="form_grid">',
                                        '<div class="form_left"><label class="form_label" for="email">'+ sampiDic.email +':</label></div>',
                                        '<div class="form_right"><input class="postable_data email" value="" type="text" name="email"/></div>',
                                        '<div class="form_left"><label class="form_label" for="password">'+ sampiDic.password +':</label></div>',
                                        '<div class="form_right"><input class="postable_data password" value="" type="password" name="password"/></div>',
                                        '<div class="form_left"></div>',
                                        '<div class="form_right buttonpane">',
                                            '<button id="submit" class="submit_button ui-button ui-state-default ui-corner-all">'+ sampiDic.login +'</button>',
                                            '<button id="reset-user" class="ui-button ui-state-default ui-corner-all">'+ sampiDic.forgot_password +'</button>',
                                        '</div>',
                                    '</div></div>',
                                '</form></div>',
                            '</div>'].join(''),
                        content: ['<div class="login-form ui-widget ui-corner-all">',
                                '<div class="wrapper fluffy ui-widget-content ui-corner-all">',
                                    '<button id="create-user" class="ui-button ui-state-default ui-corner-all">'+ sampiDic.sign_up_new_account +'</button>',
                                '</div>',
                            '</div>',
                            '<div>', sampiDic.curr_user_welcome,'</div>'].join(''),
                        form_help: 'This is the help for the Login form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    var curr_loc = window.location.href;
                    curr_loc = $.navHandler.splitLoc(curr_loc);
                    if(curr_loc.email!==undefined){
                        $('input.email').val(curr_loc.email);
                    }else if(curr_loc.invite_email!==undefined){
                        $('input.email').val(curr_loc.invite_email);
                    }
                    if(curr_loc.invite_email!==undefined){
                        $('input.invite_email').val(curr_loc.invite_email);
                    }
                    if(curr_loc.invite!==undefined){
                        $('input.token').val(curr_loc.invite);
                    }
                    if(curr_loc.token!==undefined){
                        $('input.token').val(curr_loc.token);
                    }
                    if(curr_loc.space_id!==undefined){
                        $('input.space_id').val(curr_loc.space_id);
                    }
                    if(curr_loc.reset!==undefined){
                        $('input.reset').val(curr_loc.reset);
                    }
                    $('#create-user').click(function() {
                        var form_content = $.sys.formStorage.login_form_new({form_act:'init'});
                        $('#detail .ui-layout-content').html(form_content.form_body);
                        $('#control .ui-layout-content').html(form_content.content);
                        $.sys.formStorage.login_form_new({form_act:'activate'});
                    })
                    .initButton();
                    $('#reset-user').click(function() {
                        var form_content = $.sys.formStorage.login_form_reset({form_act:'init'});
                        $('#detail .ui-layout-content').html(form_content.form_body);
                        $('#control .ui-layout-content').html(form_content.content);
                        $.sys.formStorage.login_form_reset({form_act:'activate'});
                    })
                    .initButton();
                    $('#submit').click(
                        function(){
                            return($('#login_form').postForm());
                        })
                    .initButton();
                    return(true);
                },
                pre_post : function(options){
                    options.success_func = 'registerConfirm';
                    
                    var form_ele = $('#login_form');
                    var email = $('input.email', form_ele).val();
                    var first_name = $('input.first_name', form_ele).val();
                    var last_name = $('input.last_name', form_ele).val();
                    var pass = $('input.password', form_ele).val();
                    if($.samUtil.validEmail(email)
                        && first_name!==''
                        && last_name!==''
                        && pass!==''){
                        return(options);
                    }
                    return(false);
                },
                post_success: function(options){
                   return true;
                }
            }

            return (type[options.form_act](options));

        },

        login_form_new : function(options){
            var type = {
                init : function(options){
                    var form_obj = {
                        form_body: ['<div class="login-form ui-widget ui-corner-all">',
                                '<div class="title show ui-widget-header ui-corner-all">'+ sampiDic.join_sampi_plan +'</div>',
                                '<div class="ui-widget-content ui-corner-all"><form id="login_form_new" name="login_form_new" class="post_form" action="', $.sysConst.base_target_clean , '" method="post">',
                                    '<input class="postable_data task" type="hidden" name="task" value="loginfacade"/>',
                                    '<input class="postable_data option1" type="hidden" name="option1" value="publicuserregister" />',
                                    '<input class="postable_data beta" type="hidden" name="beta"/>',
                                    '<input class="postable_data invite_email" type="hidden" name="invite_email" />',
                                    '<input class="postable_data token" type="hidden" name="token" />',
                                    '<input class="postable_data space_id" type="hidden" name="space_id" />',
                                    '<div class="wrapper fluffy"><div class="form_grid">',
                                        '<div class="form_left"><label class="form_label" for="first_name">'+ sampiDic.first_name +':</label></div>',
                                        '<div class="form_right"><input class="postable_data first_name" value="" type="text" name="first_name" /></div>',
                                        '<div class="form_left"><label class="form_label" for="last_name">'+ sampiDic.last_name +':</label></div>',
                                        '<div class="form_right"><input class="postable_data last_name" value="" type="text" name="last_name" /></div>',
                                        '<div class="form_left"><label class="form_label" for="email">'+ sampiDic.email +':</label></div>',
                                        '<div class="form_right"><input class="postable_data email" value="" type="text" name="email" /></div>',
                                        '<div class="form_left"><label class="form_label" for="password">'+ sampiDic.password +':</label></div>',
                                        '<div class="form_right"><input class="postable_data password" value="" type="password" name="password" /></div>',
                                        '<div class="form_left"></div>',
                                        '<div class="form_right buttonpane">',
                                            '<button id="submit" class="submit_button ui-button ui-state-default ui-corner-all">'+ sampiDic.sign_up +'</button>',
                                            '<button class="login-user ui-button ui-state-default ui-corner-all">'+ sampiDic.back_to_login +'</button>',
                                        '</div>',
                                    '</div></div>',
                                '</form></div>',
                            '</div>'].join(''),
                        content: ['<div class="login-form ui-widget ui-corner-all">',
                                '<div class="wrapper fluffy ui-widget-content ui-corner-all">',
                                    '<button class="login-user ui-button ui-state-default ui-corner-all">'+ sampiDic.login_to_my_account +'</button>',
                                '</div>',
                            '</div>',
                            '<div>', sampiDic.new_user_welcome,'</div>'].join(''),
                        form_help: 'This is the help for the Login form.'
                    }
                    return form_obj;
                },
                activate : function(options){
                    var curr_loc = window.location.href;
                    curr_loc = $.navHandler.splitLoc(curr_loc);
                    if(curr_loc.beta!==undefined){
                        $('input.beta').val(curr_loc.beta);
                    }
                    if(curr_loc.email!==undefined){
                        $('input.email').val(curr_loc.email);
                    } else if(curr_loc.invite_email!==undefined){
                        $('input.email').val(curr_loc.invite_email);
                    }

                    if(curr_loc.first_name!==undefined){
                        $('input.first_name').val(curr_loc.first_name);
                    }
                    if(curr_loc.last_name!==undefined){
                        $('input.last_name').val(curr_loc.last_name);
                    }
                    if(curr_loc.invite_email!==undefined){
                        $('input.invite_email').val(curr_loc.invite_email);
                    }
                    if(curr_loc.invite!==undefined){
                        $('input.token').val(curr_loc.invite);
                    }
                    if(curr_loc.space_id!==undefined){
                        $('input.space_id').val(curr_loc.space_id);
                    }
                    $('.login-user').click(function() {
                        var form_content = $.sys.formStorage.login_form({form_act:'init'});
                        $('#detail .ui-layout-content').html(form_content.form_body);
                        $('#control .ui-layout-content').html(form_content.content);
                        $.sys.formStorage.login_form({form_act:'activate'});
                    })
                    .initButton();
                    $('#submit').click(
                        function(){
                            return($('#login_form_new').postForm());
                        })
                    .initButton();
                    return(true);
                },
                pre_post : function(options){
                    options.success_func = 'registerConfirm';
                    
                    var form_ele = $('#login_form_new');
                    var email = $('input.email', form_ele).val();
                    var first_name = $('input.first_name', form_ele).val();
                    var last_name = $('input.last_name', form_ele).val();
                    var pass = $('input.password', form_ele).val();
                    if($.samUtil.validEmail(email)
                        && first_name!==''
                        && last_name!==''
                        && pass!==''){
                        return(options);
                    }
                    return(false);
                },
                post_success: function(options){
                    return true;
                }
            }
            return (type[options.form_act](options));
        }
    }
})(jQuery);