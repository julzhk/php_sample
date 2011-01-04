//NAMESPACES
(function($) {
//Creates a namespace for the static reference materials
    $.viewS.tree = function(options){
        var build = {
            flat : function(options){
                var tree_array = options[options.base_type];
                var result_array = [];
                var m,i,len;
                var node = {};
                var group_arr = [];
                for (i = 0, len = tree_array.length; i < len; i+=1) {
                    m = tree_array[i];
                    node = this[options.node_type](m, options);
                    if(node.group_by!==undefined){
                        if(group_arr.length===0 || (group_arr.length>0 && group_arr[0].group_by===node.group_by)){
                            group_arr.push(node);
                        } else {
                            result_array.push({item_html:['<li><span>',group_arr[0].group_by,'</span>',this.child_to_html(group_arr),'</li>'].join('')});
                            group_arr = [node];
                        }
                    } else {
                        result_array.push(node);
                    }
                }
                if(group_arr.length>0){
                    result_array.push({item_html:['<li><span>',group_arr[0].group_by,'</span>',this.child_to_html(group_arr),'</li>'].join('')});
                }
                return (result_array);
            },
        /**
         * This method will grow a tree from the roots and then sort any top level items alphabetically by title.
         * Children will bubble up using this arrangement, so the levels are relative rather than absolute.
         */
            nested : function(options){
                var result_array = [];
                var m,n,i,k,len,len_k;
                var pre_array = [];
                var post_array = [];
                var child_array = [];
                var tree_array = options[options.base_type];
                var curr_state = {
                    tree_state : $.navHandler.getObjectTreeState(),
                    curr_obj : options.object_id
                }
                for (i = 0, len = tree_array.length; i < len; i+=1) {
                    m = tree_array.pop(); //Reduce the array by the one we are placing now.
                    var this_object = {
                        root_id : m.root_id*1 ,
                        lft : m.lft*1,
                        rgt : m.rgt*1 ,
                        level : m.level*1,
                        work_remain : m.work_remain*1
                    };// Must have numbers for these operations to work.
                    pre_array = [];
                    post_array = [];
                    child_array = [];
                    for(k=0, len_k=result_array.length; k<len_k; k+=1){
                        n = result_array[k];
                        if((this_object.root_id > n.root_id*1) || (this_object.lft > n.lft*1)){
                            pre_array.push(n);
                        } else if((this_object.root_id < n.root_id*1) || (this_object.rgt < n.rgt*1)){
                            post_array.push(n);
                        } else {
                            child_array.push(n);
                        }
                    }
                    if(!((options.type=='task' || options.type=='today')
                        && (-2 === this_object.work_remain)
                            && 0 === child_array.length && 1!==(this_object.rgt-this_object.lft))){
                        var new_node = this[options.node_type](m, options, curr_state, child_array);
                        if(new_node !== ''){
                            pre_array.push(new_node);
                        }
                        result_array = pre_array.concat(post_array);
                    }
                }

                //Now, go through the array and sort by object_name to get the different spaces to be in alpha order.
                var final_array = [];
                for (i = 0, len = result_array.length; i < len; i+=1) {
                    m = result_array[i];
                    var this_root_id = m.root_id*1;
                    pre_array = [];
                    post_array = [];
                    for(k=0, len_k=final_array.length; k<len_k; k+=1){
                        n = final_array[k];
                        var that_root_id = n.root_id*1;
                        if((m.label<n.label) && (this_root_id!==that_root_id)){
                            post_array.push(n);
                        } else {
                            pre_array.push(n);
                        }
                    }
                    pre_array.push(m);
                    final_array = pre_array.concat(post_array);
                }
                if(options.get_html===undefined &&options.view_arr!==undefined && options.view_arr.length>0){
                    final_array = options.view_arr.concat(final_array);
                }
                return (final_array);
            },
            child_to_html : function(child_array, add_class){
                add_class = (add_class===undefined) ? '' : add_class;
                var result_html = '';
                if(child_array.length){
                    var result_array = ['<ul class="', add_class,'">'];
                    for(var i=0, len=child_array.length; i<len; i+=1){
                        result_array.push(child_array[i].item_html);
                    }
                    result_array.push('</ul>');
                    result_html = result_array.join('');
                }
                return result_html;
            },
            set_status : function(obj_id, curr_state, curr_sel){
                var state = 'closed';
                if(curr_state.indexOf(obj_id)>-1 || curr_sel===" selected"){
                    state = 'open';
                }
                return state;
            },
            is_obj_selected : function(obj_id, curr_obj_id){
                var selected = "";
                if(curr_obj_id*1===obj_id*1){
                    selected = " selected";
                }
                return selected;
            },
            is_child_selected : function(child_array, curr_sel){
                if(curr_sel!==" selected"){
                    for(var i=0, len=child_array.length; i<len; i+=1){
                        if(child_array[i].curr_sel===" selected"){
                            return(" selected");
                        }
                    }
                    return ("");
                }
                return curr_sel;
            },
            is_selected_source : function(this_id,options){
                var pos = $.inArray(this_id, options.curr_sel.source);
                if(pos>-1){
                    return true;
                }
                return false;
            },
            is_checked : function(this_id,options){
                var pos = $.inArray(this_id, options.curr_sel[options.sel_rel]);
                if(pos>-1){
                    return true;
                }
                return false;
            },
            createFileChild : function(item_data, options, child_array){
                var result_obj = {
                    child_array:child_array,
                    options:options
                }
                if(options.file!==undefined && options.file.length>0){
                    var f,i,len;
                    var used_root_arr = [];
                    var child_file_arr = [];
                    var remain_arr = [];
                    var temp_arr = [];
                    //check to see if any of the files are childen of this object
                    for(i=0, len=options.file.length; i<len; i+=1){
                        f=options.file[i];
                        if(item_data.root_id===f.obj_root_id
                            && item_data.lft<f.obj_lft
                            && item_data.rgt>f.obj_rgt
                            && child_file_arr[f.root_id]===undefined){
                            used_root_arr.push(f.root_id);
                            child_file_arr[f.root_id]=f;
                        } else if(child_file_arr[f.root_id]!==undefined
                            && child_file_arr[f.root_id].updated_at>f.updated_at){
                            child_file_arr[f.root_id]=f;
                        } else if(child_file_arr[f.root_id]===undefined){
                            remain_arr.push(f);
                        }
                    }
                    //now go back through the list again to make sure it is the most up to date
                    for(i=0, len=remain_arr.length; i<len; i+=1){
                        f = remain_arr[i];
                        if(child_file_arr[f.root_id]!==undefined
                            && child_file_arr[f.root_id].updated_at>f.updated_at){
                            child_file_arr[f.root_id]=remain_arr.splice(i,1);
                        } else if(child_file_arr[f.root_id]!==undefined){
                            remain_arr.splice(i,1);
                        }
                    }
                    //now, compile the final array of children from the list
                    if(used_root_arr.length>0){
                        for(i=0, len=used_root_arr.length; i<len; i+=1){
                            f = child_file_arr[used_root_arr[i]];
                            var temp_item = this.fileListItem(f, options);
                            temp_arr.push(temp_item.item_html);
                        }
                        temp_arr.push('</li></ul></li>');
                        var file_list = temp_arr.join('');
                        temp_arr = [];
                        temp_arr[0] = {item_html:this.child_to_html([{item_html:file_list}])};
                        child_array = temp_arr.concat(child_array);
                    }
                    result_obj.child_array = child_array;
                    result_obj.options.file=remain_arr;
                }
                return result_obj;
            },

            /**
            *This is used when making the approval template display view.
            *@param item_data {array} Array of the object data.
            *@returns {object} An object with the required formatting values.
            **/
            approvalTemplateListItem : function(item_data){
                var this_href = $.sys.contentRef.format_approval_node(item_data);
                var item_object = {
                    title: this_href,
                    expanded: true,
                    id: item_data.id,
                    root_id: item_data.root_id,
                    rgt: item_data.rgt,
                    lft: item_data.lft,
                    labelStyle: item_data.type
                }
                return item_object;
            },
            selectionListItem : function(item_data, target_path, curr_state){
                var this_href = ['<a href="#select_object/', item_data.object_id, '">', item_data.object_name, '</a>'].join('');
                var item_object = {
                    title: this_href,
                    expanded: true,
                    object_id: item_data.object_id,
                    root_id: item_data.root_id,
                    rgt: item_data.rgt,
                    lft: item_data.lft,
                    addClass: 'item_name ' + this.set.urgencyClass(item_data)
                }
                return item_object;
            },
            fileListItem : function(item_data, options){
                var item_object = {};
                var item_html= [];
                if(item_data.root_id === null){
                    return ({item_html:''});
                }
                item_html.push('<li><span title="',item_data[0].description,'">', item_data[0].title, ' - V', item_data[0].version,'</span>');
                item_html.push($.sys.workingLayoutRef.fileLinkRef({file_id:item_data[0].id, file_type:'proof_file'}));
                item_html.push($.sys.workingLayoutRef.fileLinkRef({file_id:item_data[0].id, file_type:'main_file'}));
                if(options.curr_obj.service_level>=$.sysConst.TASK_USER){
                    item_html.push('<a class="add_file_icon" href="#activate/form_dialog/form_name/save_file/object_id/',options.object_id,'/file_id/',item_data[0].root_id,'" title="', sampiDic.add_file,'">', sampiDic.add_file,'</a>');
                }
                if(item_data[0].description || item_data.length>1){
                    item_html.push('<ul>');
                    if(item_data[0].description){
                        item_html.push('<div class="text-sm">',item_data[0].description,'</div>');
                    }
                    if(item_data.length>1){
                        for(var i=1, len=item_data.length; i<len; i+=1){
                            item_html.push('<li><div>V', item_data[i].version);
                            item_html.push($.sys.workingLayoutRef.fileLinkRef({file_id:item_data[i].id, file_type:'proof_file'}));
                            item_html.push($.sys.workingLayoutRef.fileLinkRef({file_id:item_data[i].id, file_type:'main_file'}));
                            item_html.push('</li>');
                        }
                    }
                    item_html.push('</ul>');
                }
                item_html.push('</li>');
                item_object.item_html = item_html.join('');
                return item_object;
            },
            /**
            *This is used to format each report into a tree node with children.
            *@param item_data {array} Array of the object data.
            *@returns {object} An object with the required formatting values.
            **/
            tagListItem : function(item_data){
                var item_object = {
                    title: $.sys.contentRef.tag_node(item_data),
                    addClass: 'tag_list'
                }
                return item_object;
            },
            userAdminItem : function(item_data, options){
                var node = {
                    editLinks : function(){
                        return([
                            '<a class="pad-left text-sm edit_team_icon" href="#activate/form_dialog/form_name/update_user_team/space_id/',options.space_id,'/user_id/',item_data.id,'">',sampiDic.edit_teams,'</a>'].join(''));
                    },
                    userTeams : function(){
                        var result = [];
                        var this_user_teams = $.dataCache.get({set_name:"admin_team_user"
                            , filter_by:[[{field:"user_id", rel:"eq", value:item_data.id}]]});
                        var filter_arr = [];
                        for(var i=0, len=this_user_teams.length; i<len; i+=1){
                            var temp_node = [{field:"space_id", rel:"eq", value:options.space_id}
                                ,{field:"id", rel:"eq", value:this_user_teams[i].team_id}];
                            filter_arr.push(temp_node);
                        }
                        this_user_teams = $.dataCache.get({set_name:"admin_team", filter_by:filter_arr, sort_by:['team_name']});
                        for(i=0, len=this_user_teams.length; i<len; i+=1){
                            if(this_user_teams[i].team_name!=="__active" && this_user_teams[i].team_name!=="__inactive"){
                                result.push('<div>',this_user_teams[i].team_name,'</div>');
                            }
                        }
                        return result.join('');
                    },
                    base : function(){
                        return (['<ul><li class="">'
                                    ,this.userTeams()
                                    ,'</li></ul>'].join(''));
                    }
                }
                var href = this.userName(item_data);
                var title = ' title="'+sampiDic.user_teams+'"';
                var item_object = {
                    item_html: ['<li',title,'>',href,node.editLinks(),node.base(),'</li>'].join('')
                }
                return item_object;
            },
            userName : function(user_data){
                var node ={
                    user_name : function(){
                        return ('<span>' + user_data.last_name + ', ' + user_data.first_name + '</span>');
                    },
                    user_email : function(){
                        var email = $.dataSet.firstAdminAttributeValueByUser(user_data.id, 'email');
                        return ('<span class="ghost-name">' + email + sampiDic.ghost_status +'</span>');
                    }
                };
                return((user_data.last_name===undefined || user_data.last_name==='') ? node.user_email() : node.user_name());
            },
            teamAdminItem : function(item_data, options){
                if(item_data.team_name==="__active" || item_data.team_name==="__inactive"){
                    return ({item_html:""});
                }
                var node = {
                    editLinks : function(){
                        return([
                            '<a class="pad-left text-sm edit_security_icon" href="#activate/form_dialog/form_name/update_team_perm/space_id/',options.space_id,'/team_id/',item_data.id,'" title="',sampiDic.edit_perm,'">',sampiDic.edit_perm,'</a>'
                            ,'<a class="pad-left text-sm edit_user_icon" href="#activate/form_dialog/form_name/update_team_user/space_id/',options.space_id,'/team_id/',item_data.id,'" title="',sampiDic.edit_users,'">',sampiDic.edit_users,'</a>'
                            ,'<a class="pad-left text-sm edit_object_icon" href="#activate/form_dialog/form_name/update_team_object/space_id/',options.space_id,'/team_id/',item_data.id,'" title="',sampiDic.edit_objects,'">',sampiDic.edit_objects,'</a>'].join(''));
                    },
                    userTeams : function(){
                        var result = [];
                        var temp_array = $.dataCache.get({set_name:"admin_team_user"
                            , filter_by:[[{field:"team_id", rel:"eq", value:item_data.id}]]});
                        var filter_arr = [];
                        for(var i=0, len=temp_array.length; i<len; i+=1){
                            var temp_node = [{field:"id", rel:"eq", value:temp_array[i].user_id}];
                            filter_arr.push(temp_node);
                        }
                        temp_array = $.dataCache.get({set_name:"admin_user", filter_by:filter_arr, sort_by:['last_name']});
                        for(i=0, len=temp_array.length; i<len; i+=1){
                            result.push('<div>',build.userName(temp_array[i]),'</div>');
                        }
                        return result.join('');
                    },
                    base : function(){
                        return (['<ul><li class="">'
                                    ,this.userTeams()
                                    ,'</li></ul>'].join(''));
                    }
                }
                var href = ['<span>',item_data.team_name,'</span>'].join('');
                var title = ' title="'+sampiDic.team_users+'"';
                var item_object = {
                    item_html: ['<li',title,'>',href,node.editLinks(),node.base(),'</li>'].join('')
                }
                return item_object;
            },
            /**
            *This is used to format each report into a tree node with children.
            *@param item_data {array} Array of the object data.
            *@param options {object} The configuration options.
            *@returns {object} An object with the required formatting values.
            **/
            statusListItem : function(item_data, options){
                var status_node = {
                    status_report_work_done : function(work_done_desc){
                        var layout_ele = '';
                        if(null!==work_done_desc && work_done_desc.length>0){
                            layout_ele = ['<div><span class="small_title">',sampiDic.work_done_title,':</span> ',work_done_desc,'</div>'].join('');
                        }
                        return layout_ele;
                    },
                    status_report_work_next : function(work_next_desc){
                        var layout_ele = '';
                        if(null!==work_next_desc && work_next_desc.length>0){
                            layout_ele = ['<div><span class="small_title">',sampiDic.work_next_title,':</span> ',work_next_desc,'</div>'].join('');
                        }
                        return layout_ele;
                    },
                    status_report_issue : function(issue_desc){
                        var layout_ele = '';
                        if(null!==issue_desc && issue_desc.length>0){
                            layout_ele = ['<div><span class="small_title">',sampiDic.roadblock_title,':</span> ',issue_desc,'</div>'].join('');
                        }
                        return layout_ele;
                    },
                    status_report_work_remain_time : function(work_remain){
                        var work_remain_value = [];
                        work_remain = (work_remain*1===-2) ? 0 : work_remain;
                        if((typeof (work_remain*1)==="number") && (work_remain*1 >= 0)){
                            work_remain_value = ['<span>',(work_remain/3600).toFixed(1),' ',sampiDic.hours_remain,'</span>'];
                        }
                        return (work_remain_value.join(''));
                    },
                    status_report_work_done_time : function(work_done){
                        var work_done_value = [];
                        if(typeof (work_done*1)==="number" && (work_done*1 > 0)){
                            work_done_value = ['<span>',(work_done/3600).toFixed(1) + ' ',sampiDic.hours_worked,'</span>'];
                        }
                        return (work_done_value.join(''));
                    },
                    status_report_node : function(item_data){
                        var work_done_report = this.status_report_work_done(item_data.work_done_desc);
                        var work_next_report = this.status_report_work_next(item_data.work_next_desc);
                        var issue_report = this.status_report_issue(item_data.issue_desc);
                        var result = '';
                        if(!(work_done_report==='' && work_next_report==='' && issue_report==='')){
                            result = ['<ul><li class="status_detail">'
                                    ,work_done_report
                                    ,work_next_report
                                    ,issue_report
                                    ,'</li></ul>'
                                ].join('');
                        }
                        return (result);
                    }
                }
                var user = $.dataCache.get({set_name:"user", filter_by:[[{field:"id", rel:"eq", value:item_data.owner_id}]]})[0];
                var curr_obj = $.dataCache.get({set_name:"object", filter_by:[[{field:"object_id", rel:"eq", value:item_data.object_id}]]})[0];
                var inner = status_node.status_report_node(item_data);
                var work_remain_value = status_node.status_report_work_remain_time(item_data.work_remain);
                var work_done_value = status_node.status_report_work_done_time(item_data.work_done);
                var href = ['<span>(',curr_obj.object_name,') ',user.first_name,' ',user.last_name,':'];
                if(item_data.work_remain*1===-1){
                    
                } else {
                    href.push(' ',work_done_value
                            ,' ',work_remain_value);
                }
                href.push('</span>')
                href = href.join('');
                var title = [' title="']
                if(item_data.work_remain*1!==-1){
                    var temp_remain = (item_data.work_remain*1!==-2) ? item_data.work_remain : 0;
                    title.push((temp_remain/3600).toFixed(1),' ',sampiDic.hours_remain);
                }
                title.push('"');
                title = title.join('');
                var item_object = {
                    item_html: ['<li',title,'>',href,inner,'</li>'].join(''),
                    group_by: $.samUtil.formatEpochDateToDMY(item_data.updated_at).curr_datestamp
                }
                return item_object;
            },
            commentListItem : function(item_data, options){
                var comment_node = {
                    reply_link : function(item_data){
                        var item_html = [
                            '<span><a class="margin-lr ui-widget" href="#activate/form_dialog/form_name/reply_comment/object_id/'
                            ,item_data[0].object_id,'/comment_parent_id/',item_data[0].comment_parent_id,'">'
                            ,sampiDic.reply,'</a></span>'].join('');
                        return (item_html);
                    },
                    node : function(child_data, curr_user, t_o){
                        var layout_array = [
                            '<span class="ui-widget-header ui-corner-top margin-top pad-left pad-right inline-block">',curr_user.first_name
                                ,' ',curr_user.last_name
                                ,' - ', $.samUtil.formatEpochDateToPrettyDate(child_data.updated_at)
                                ,' : ', $.samUtil.convertEpochToTimeAmPm(child_data.updated_at)
                            ,'</span>', , t_o.reply_link
                            ,'<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">',child_data.content,'</div>'
                        ];
                        child_data.item_html = layout_array.join('');
                        return(child_data);
                    },
                    thread_header : function(t_o){
                        var user_list = [];
                        for(var i=0, len=t_o.user_names.length; i<len; i+=1){
                            user_list.push([' ',t_o.user_names[i].last_name].join(''));
                        }
                        user_list.join(',');
                        t_o.thread_header = ['<span>',t_o.title,' - '
                            ,$.samUtil.formatEpochDateToPrettyDate(t_o.most_recent.updated_at)
                            ,':',user_list,'</span>'].join('');
                        return t_o;
                    },
                    thread : function(item_data){
                        var thread_obj = {};
                        thread_obj.user_array=[];
                        thread_obj.user_names=[];
                        thread_obj.most_recent={};
                        thread_obj.title='';
                        thread_obj.reply_link = comment_node.reply_link(item_data);
                        thread_obj.children=[{item_html:'<li>'}];
                        for(var i=0, len=item_data.length; i<len; i+=1){
                            var m = item_data[i];
                            if(m.id===m.comment_parent_id){
                                thread_obj.title=m.title;
                            }
                            var user_index = thread_obj.user_array.indexOf(m.owner_id);
                            var curr_user = '';
                            if(-1===user_index){
                                curr_user = $.dataCache.get({set_name:"user", filter_by:[[{field:"id", rel:"eq", value:m.owner_id}]]})[0];
                                thread_obj.user_array.push(m.owner_id);
                                thread_obj.user_names.push(curr_user);
                            } else {
                                curr_user = thread_obj.user_names[user_index];
                            }
                            if(len===i+1){
                                thread_obj.most_recent = m;
                                thread_obj.most_recent.first_name = curr_user.first_name;
                                thread_obj.most_recent.last_name = curr_user.last_name;
                            }
                            thread_obj.children.push(comment_node.node(m, curr_user, thread_obj));
                        }
                        thread_obj.children.push({item_html:'</li>'})
                        thread_obj = comment_node.thread_header(thread_obj);
                        return thread_obj;
                    }
                }
                var inner = comment_node.thread(item_data);
                var child = this.child_to_html(inner.children);
                var item_object = {
                    item_html: ['<li>',inner.thread_header,child,'</li>'].join('')
                }
                return item_object;
            },
            objectAdminListItem : function(item_data, options, curr_state, child_array){
                var urgency_status = $.viewS.set({type:"urgencyClass", object_data:item_data});
                var href = ['<span class="',urgency_status,'">', item_data.object_name, '</span>'
                            ,'<a class="text-sm pad-left del_icon" href="#activate/form_dialog/form_name/delete_object/object_id/',item_data.object_id,'">', sampiDic.del,'</a>'
                            ].join('');
                var child = this.child_to_html(child_array);
                var item_object = {
                    object_id: item_data.object_id,
                    root_id: item_data.root_id,
                    rgt: item_data.rgt,
                    lft: item_data.lft,
                    item_html: ['<li class="">',href,child,'</li>'].join('')
                }
                return item_object;
            },
            /**
            *This is used to make an object item for a selectable tree listing.
            *@param item_data {array} Array of the object data.
            *@param options {object} Options configuration object.
            *@param curr_state {object} An object that holds the state of the user.
            *@param child_array {array} An array of child objects.
            *@returns {object} An object with the required formatting values.
            **/
            objectListItem : function(item_data, options, curr_state, child_array){
                if(options.type==="file"){
                    var result_obj = this.createFileChild(item_data, options, child_array);
                    child_array = result_obj.child_array;
                    options = result_obj.options;
                } else {
                    child_array = (child_array===undefined) ? [] : child_array;
                }
                var child = this.child_to_html(child_array);
                curr_state = (curr_state===undefined) ? {curr_obj:[],tree_state:[]} : curr_state;
                var urgency_status = $.viewS.set({type:"urgencyClass", object_data:item_data, child_html:child});
                var selected = this.is_obj_selected(item_data.object_id, curr_state.curr_obj);
                var href = []
                if(item_data.object_id*1>0){
                    href.push('<a href="',options.href_base, '/object_id/', item_data.object_id , '"');
                } else {
                    href.push('<span');
                }
                href.push(' class="', urgency_status,selected,'" title="',item_data.content,'">', item_data.object_name);
                if(item_data.object_id*1>0){
                    href.push('</a>');
                } else {
                    href.push('</span>');
                }
                href = href.join('');
                selected = this.is_child_selected(child_array, selected);
                var state = this.set_status(item_data.object_id, curr_state.tree_state, selected);
                                
                var item_object = {
                    object_id: item_data.object_id,
                    root_id: item_data.root_id,
                    rgt: item_data.rgt,
                    lft: item_data.lft,
                    item_html: ['<li class="',state,'">',href,child,'</li>'].join(''),
                    curr_sel: selected
                }
                return item_object;
            },
            /**
            *This is used to make an object item for a selectable tree listing.
            *@param item_data {array} Array of the object data.
            *@param options {object} Options configuration object.
            *@param curr_state {object} An object that holds the current selections.
            *@param child_array {array} An array of child objects.
            *@returns {object} An object with the required formatting values.
            **/
            objectSelectItem : function(item_data, options, curr_state, child_array){
                var item_object = '';
                if(!(options.sel_rel==='target' && this.is_selected_source(item_data.object_id,options))){
                    options.sel_inherit = (options.sel_inherit===undefined) ? true : options.sel_inherit;
                    var is_checked = this.is_checked(item_data.object_id, options);
                    var urgency_status = $.viewS.set({type:"urgencyClass", object_data:item_data});
                    urgency_status = (is_checked) ?
                        urgency_status+"_checked" : urgency_status+"_unchecked";
                    var href = ['<a href="#activate/select_item/sel_type/',options.sel_type,'/sel_rel/',options.sel_rel,'/id/', item_data.object_id];
                    href.push((options.space_id!==undefined)? '/space_id/' + options.space_id : '');
                    href.push((options.team_id!==undefined)? '/team_id/' + options.team_id : '');
                    href.push('" class="' , urgency_status , '">' , item_data.object_name , '</a>');
                    href = href.join('');
                    var child = this.child_to_html(child_array);
                    if(options.sel_rel!=='target' && options.sel_inherit && is_checked){
                        child = child.replace(/unchecked/g, "checked");
                    }
                    item_object = {
                        object_id: item_data.object_id,
                        root_id: item_data.root_id,
                        rgt: item_data.rgt,
                        lft: item_data.lft,
                        item_html: ['<li class="','">',href,child,'</li>'].join('')
                    }
                }
                return item_object;
            },
            /**
            *This is used to make an user item for a selectable tree listing.
            *@param item_data {array} Array of the user data.
            *@param options {object} Options configuration object.
            *@returns {object} An object with the required formatting values.
            **/
            userSelectItem : function(item_data, options){
                var item_object = '';
                var status = (this.is_checked(item_data.id, options)) ? "checked" : "unchecked";
                var user_name = this.userName(item_data);
                var href = ['<a class="',status,'" href="#activate/select_item/sel_type/',options.sel_type,'/sel_rel/',options.sel_rel,'/id/', item_data.id,'/team_id/',options.team_id,'/space_id/',options.space_id,'">', user_name ,'</a>'].join('');
                item_object = {
                    object_id: item_data.object_id,
                    root_id: item_data.root_id,
                    rgt: item_data.rgt,
                    lft: item_data.lft,
                    item_html: ['<li class="','">',href,'</li>'].join('')
                }
                return item_object;
            },
            /**
            *This is used to make an team item for a selectable tree listing.
            *@param item_data {array} Array of the team data.
            *@param options {object} Options configuration object.
            *@returns {object} An object with the required formatting values.
            **/
            teamSelectItem : function(item_data, options){
                if(item_data.team_name==="__active" || item_data.team_name==="__inactive"){
                    return ({item_html:""});
                }
                var item_object = '';
                var status = (this.is_checked(item_data.id, options)) ? "checked" : "unchecked";
                var href = ['<div><a class="',status,'" href="#activate/select_item/sel_type/',options.sel_type,'/sel_rel/',options.sel_rel,'/id/', item_data.id,'/user_id/',options.user_id,'/space_id/',options.space_id,'">',item_data.team_name,'</a></div>'].join('');
                item_object = {
                    object_id: item_data.object_id,
                    root_id: item_data.root_id,
                    rgt: item_data.rgt,
                    lft: item_data.lft,
                    item_html: ['<li class="','">',href,'</li>'].join('')
                }
                return item_object;
            }
        }
        //This activates the tree.
        if(options.get_html!==undefined){
            var new_node = build[options.node_type](options.get_html, options, {tree_state:[], curr_obj:[]}, build[options.tree_type](options));
            return (new_node);
        } else {
            var tree_obj = build[options.tree_type](options);
            var result = build.child_to_html(tree_obj, 'text-sm');
            $(options.target_sel).html(result).treeview(options.treeview_opt);
            return (true);
        }
    }
})(jQuery);