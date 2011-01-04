/*
 * Sampi Plan - layout Functions
 * 2009 Sampi, Ltd. All Rights Reserved
 */
(function($) {
    $.lay = {
        initLogin : function() {
            var layout_obj = this.init.login();
            return layout_obj;
        },
        initInterface : function(rec_data) {
            this.init.app(rec_data);
        },
        init : {
            lang_select : function(options){
                if(outerLayout===''){
                    $.lay.init.layout(options);
                }
                var iso_code = $.cookie('iso_code');
                if(iso_code===undefined || iso_code===null){
                    iso_code = 'en';
                }
                if(options!==undefined && options.iso_code!==undefined){
                    iso_code = options.iso_code;
                }
                $.samUtil.createCookie('iso_code',iso_code);
                $.getInitDic(iso_code);
            },
            layout : function(options){
                options = (options===undefined) ? {} : options;
                options.init = 'layout';
                outerLayout = $.viewS.init(options);
                $.navHandler.initAnchor();
                $('#detail .ui-layout-content').html('<img alt="Loading" src="image/wait.gif"></br>Loading...Please Wait');
            },
            login : function(options){
                options = (options===undefined) ? {} : options;
                options.init = 'login';
                $.viewS.init(options);
            },
            app : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                $('#header .ui-layout-header').html($.sys.workingLayoutRef.header_layout(options));
                $('#detail .ui-layout-content').html('');
                $('#control .ui-layout-content').html('');
                var curr_href = window.location.href;
                var curr_loc_obj = $.navHandler.splitLoc(curr_href);
                if(undefined === curr_loc_obj.context || '' === curr_loc_obj.context){
                    window.location.hash = "#context/today";
                }
                $.navHandler.initCheck();
                $.navHandler.initTreeToggle();
            },
            logout : function(options){
                options = (options===undefined) ? {} : options;
                $('#system_cache').data('active_user',false);
                options.init = 'login';
                $.viewS.init(options);
            }
        },
        context : {
            today : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options.get_html = {
                    object_id:-1
                    , work_remain:-2
                    , rgt:0
                    , lft:0
                    , root_id:0
                };
                options.type='today';
                options.node_type="objectListItem";
                options.href_base="#context/today/detail/object/minor_view/summary";
                options.target_sel='#control .ui-layout-content';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.base_type="object";
                $.viewS.context(options);
            },
            tasks : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options = $.dataSet.myTasks(options);
                options = $.dataSet.getParentObjects(options);
                options.type='task';
                options.node_type="objectListItem";
                options.href_base="#context/tasks/detail/object/minor_view/summary";
                options.target_sel='#control .ui-layout-content';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.base_type="object";
                options.tree_type="nested";
                $.viewS.context(options);
            },
            team_tasks : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options = $.dataSet.teamTasks(options);
                options = $.dataSet.getParentObjects(options);
                options.type='task';
                options.node_type="objectListItem";
                options.href_base="#context/team_tasks/detail/object/minor_view/summary";
                options.target_sel='#control .ui-layout-content';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.base_type="object";
                options.tree_type="nested";
                $.viewS.context(options);
            },
            file : function(options){
                var filter_arr = [];
                var i,len,temp_node;
                var temp_arr = [];
                options.file = $.dataCache.get({set_name:"file"});
                for(i=0, len=options.file.length; i<len; i+=1){
                    temp_node = [{field:"object_id", rel:"eq", value:options.file[i].object_id}];
                    filter_arr.push(temp_node);
                }
                temp_arr = $.dataCache.get({set_name:"object", filter_by:filter_arr});
                filter_arr = []
                for(i=0, len=options.file.length; i<len; i+=1){
                    for(var j=0, lenj=temp_arr.length; j<lenj; j+=1){
                        if(temp_arr[j].object_id===options.file[i].object_id){
                            options.file[i].obj_root_id=temp_arr[j].root_id;
                            options.file[i].obj_level=temp_arr[j].level;
                            options.file[i].obj_lft=temp_arr[j].lft;
                            options.file[i].obj_rgt=temp_arr[j].rgt;
                            j=lenj;
                        }
                    }
                }
                filter_arr = []
                for(i=0, len=temp_arr.length; i<len; i+=1){
                    temp_node = [{field:"root_id", rel:"eq", value:temp_arr[i].root_id}
                        , {field:"level", rel:"lt", value:temp_arr[i].level}
                        , {field:"lft", rel:"lt", value:temp_arr[i].lft}
                        , {field:"rgt", rel:"gt", value:temp_arr[i].rgt}
                        , {field:"work_remain", rel:"eq", value:"-2"}
                        ];
                    filter_arr.push(temp_node);
                }
                options.object = $.dataCache.get({set_name:"object"
                    , filter_by:filter_arr
                    , sort_by:['root_id', 'level', 'lft']
                });
                options.type='file';
                options.node_type="objectListItem";
                options.href_base="#context/file/detail/object/minor_view/summary";
                options.target_sel='#control .ui-layout-content';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.base_type="object";
                options.tree_type="nested";
                $.viewS.context(options);
            },
            depot : function(options){
                options = $.dataSet.allCurrObjects(options);
                options = $.dataSet.getParentObjects(options);
                options.type='depot';
                options.node_type="objectListItem";
                options.href_base="#context/depot/detail/object/minor_view/summary";
                options.target_sel='#control .ui-layout-content';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.base_type="object";
                options.tree_type="nested";
                $.viewS.context(options);
            },
            search : function(options){
                options.object = $.dataCache.get({set_name:"object",
                        sort_by:['root_id', 'level', 'lft']
                    });
                options.type='search';
                options.node_type="objectListItem";
                options.href_base="#context/search/detail/object/minor_view/summary";
                options.target_sel='#control .ui-layout-content';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.base_type="object";
                options.tree_type="nested";
                $.viewS.context(options);
            },
            self_admin : function(options){
                $.viewS.context(options);
            }
        },
        detail : {
            object : function(options){
                $.navHandler.setState('curr_object_id', options.object_id);
                $.navHandler.checkObjectUserAccess(options);
                options = $.dataSet.currObjectByObject(options);
                options.object = $.dataCache.get({set_name:"object", filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]});
                
                options.target_sel = '#detail .ui-layout-header';
                $.viewS.detail(options);
            },
            space_admin : function(options){
                $.navHandler.setState('curr_space_id', options.space_id);
                options.curr_space = $.dataCache.get({set_name:"object", filter_by:[[{field:"object_id", rel:"eq", value:options.space_id}]]})[0];
                options.detail_layout_method = 'spaceDetail';
                if(options.curr_space.object_type==="Personal Space"){
                    options.detail_layout_method = 'selfDetail';
                    options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                    options.user_perm = $.dataCache.get({set_name:"user_perm", sort_by:['root_id', 'level', 'rgt']});
                }
                options.target_sel = '#detail .ui-layout-header';
                $.viewS.detail(options);
            },
            self_admin : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options.user_perm = $.dataCache.get({set_name:"user_perm", sort_by:['root_id', 'level', 'rgt']});
                options.target_sel = '#detail .ui-layout-header';
                $.viewS.detail(options);
            },
            file : function(){

            },
            approval : function(){

            }
        },
        minor_view : {
            summary : function(options){
                options = $.dataSet.teamsByObject(options);
                options = $.dataSet.getWorkRemainByObjectAndUser(options);
                options = $.dataSet.getRecentCommentByObjectId(options);
                options = $.dataSet.getRecentFilesByObjectId(options);
                options.base_type="summary";
                options.target_sel='#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            status : function(options){
                //Defaults to the number of seconds in 2 weeks.
                options.span_period = (options.span_period===undefined) ? 1209600 : options.span_period;
                $.dataSet.getStatusReportsByObjectDateSpan(options);
                options.base_type="taskscrum";
                options.node_type="statusListItem";
                options.target_sel='#detail .ui-layout-content';
                options.treeview_opt= {
                    collapsed: true,
                    animated: "fast"
                }
                options.tree_type="flat";
                $.viewS.minorView(options);
            },
            comment : function(options){
                //This gets the comment data by thread sorted by the most recent comments.
                //We might want to pull this out into a separate method to get threaded data.
                var obj_comment_arr = $.dataCache.get({set_name:"comment",
                        filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]],
                        sort_by:["updated_at"]
                    })
                var used_thread_id = [];
                options.comment_threads=[];
                for(var i=0, len=obj_comment_arr.length; i<len; i+=1){
                    var curr_par_id = obj_comment_arr[i].comment_parent_id;
                    if(-1===$.inArray(curr_par_id, used_thread_id)){
                        used_thread_id.push(curr_par_id);
                        var temp_thread = $.dataCache.get({set_name:"comment",
                            filter_by:[[{field:"comment_parent_id", rel:"eq", value:curr_par_id}]],
                            sort_by:["comment_parent_id","created_at"]
                        });
                        options.comment_threads.unshift(temp_thread);
                    }
                }
                options.node_type="commentListItem";
                options.treeview_opt = {
                    collapsed: true,
                    animated: "fast"
                };
                options.tree_type="flat";
                options.base_type="comment_threads";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            tags : function(options){
                options.tags = $.dataCache.get({set_name:"tag", filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]});
                options.user = $.dataCache.get({set_name:"user", filter_by:[]});
                options.base_type="tags";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            file : function(options){
                var obj_file_arr = $.dataCache.get({set_name:"file"
                    , filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]
                    , sort_by:['updated_at']});
                obj_file_arr.reverse();
                options.file = [];
                var used_root_arr = [];
                for(var i=0, len=obj_file_arr.length; i<len; i+=1){
                    var this_file = obj_file_arr[i]
                    if($.inArray(this_file.root_id, used_root_arr)===-1){
                        used_root_arr.push(this_file.root_id);
                        var temp_file_arr = $.dataCache.get({set_name:"file"
                            , filter_by:[[{field:"root_id", rel:"eq", value:this_file.root_id}]]
                            , sort_by:['version']});
                        temp_file_arr.reverse();
                        options.file.push(temp_file_arr);
                    }
                }
                options.user = $.dataCache.get({set_name:"user", filter_by:[]});
                options.node_type="fileListItem";
                options.treeview_opt = {
                    collapsed: true,
                    animated: "fast"
                };
                options.tree_type="flat";
                options.base_type="file";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            team : function(options){
                options = $.dataSet.teamsByObject(options);
                options = $.dataSet.getWorkRemainByObjectAndUser(options);
                options.base_type="team";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            schedule : function(options){
                options.schedulelinks = $.dataCache.get({set_name:"schedulelinks"
                        , filter_by:[
                            [{field:"start_object_id", rel:"eq", value:options.object_id}],
                            [{field:"end_object_id", rel:"eq", value:options.object_id}]
                        ]});
                options.object = $.dataCache.get({set_name:"object", filter_by:[]});
                options.base_type="schedulelinks";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            subs : function(options){
                $.dataSet.objectsByObject(options);
                options.type='subs';
                options.node_type="objectListItem";
                options.href_base='#context/' + options.context + '/detail/object/minor_view/status';
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.tree_type="nested";
                options.base_type="object";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            admin_user : function(options){
                options = $.dataSet.adminTeamsBySpace(options);
                options.node_type="userAdminItem";
                options.href_base='#context/' + options.context;
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.tree_type="flat";
                options.base_type="admin_user";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            admin_team : function(options){
                options = $.dataSet.adminTeamsBySpace(options);
                options.node_type="teamAdminItem";
                options.href_base='#context/' + options.context;
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.tree_type="flat";
                options.base_type="admin_team";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            admin_approval : function(options){
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            admin_object : function(options){
                options.curr_space = $.dataCache.get({set_name:"admin_object", filter_by:[[{field:"object_id", rel:"eq", value:options.space_id}]]})[0];
                options.admin_object = $.dataCache.get({set_name:"admin_object"
                    , filter_by:[[{field:"root_id", rel:"eq", value:options.space_id}]]
                    , sort_by:['root_id', 'level', 'lft']});
                options.type='admin_object';
                options.node_type="objectAdminListItem";
                options.treeview_opt={
                    collapsed: true,
                    animated: "fast"
                };
                options.tree_type="nested";
                options.base_type="admin_object";
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            admin_file : function(options){
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            admin_account : function(options){
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            info : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options.user_perm = $.dataCache.get({set_name:"user_perm", sort_by:['root_id', 'level', 'rgt']});
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            spaces : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options.user_perm = $.dataCache.get({set_name:"user_perm", sort_by:['root_id', 'level', 'rgt']});
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            account : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options.user_perm = $.dataCache.get({set_name:"user_perm", sort_by:['root_id', 'level', 'rgt']});
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            },
            report : function(options){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options = $.dataSet.getReportsByObject(options);
                options.target_sel = '#detail .ui-layout-content';
                $.viewS.minorView(options);
            }
        }
    }
    $.fn.initButton = function(){
        this.hover(
            function(){
                $(this).addClass("ui-state-hover");
            },
            function(){
                $(this).removeClass("ui-state-hover");
            }
        ).mousedown(function(){
            $(this).addClass("ui-state-active");
        })
        .mouseup(function(){
            $(this).removeClass("ui-state-active");
        });
    }
})(jQuery);

