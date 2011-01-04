(function($) {
    $.dataSet = {
        teamsByObject : function(options){
            var i,len,temp_node;
            var filter_arr = [];
            if(options.min_service===undefined){
                options.min_service=1;
            }
            if(options.object_id===undefined){
                if(options.parent_id!==undefined){
                    options.object_id=options.parent_id;
                } else {
                    return options;
                }
            }
            this.getObjectWithParentsByObjectId(options);
            filter_arr = [{field_name:"blob_id", rel:"eq", value_name:"object_id"}];
            filter_arr = this.makeFilterByFieldName(options.parent_arr, filter_arr);
            options.blob_team = $.dataCache.get({set_name:"blob_team", filter_by:filter_arr});
            filter_arr = [];
            for(i=0, len=options.blob_team.length; i<len; i+=1){
                temp_node = [{field:"id", rel:"eq", value:options.blob_team[i].team_id}
                    , {field:"service_level", rel:"gteq", value:options.min_service}];
                filter_arr.push(temp_node);
            }
            options.team = $.dataCache.get({set_name:"team", filter_by:filter_arr});

            filter_arr = [{field_name:"team_id", rel:"eq", value_name:"id"}];
            filter_arr = this.makeFilterByFieldName(options.team, filter_arr);
            options.team_user = $.dataCache.get({set_name:"team_user", filter_by:filter_arr});
            options.user_id_arr = [];
            for(i=0, len=options.team_user.length; i<len; i+=1){
                options.user_id_arr.push(options.team_user[i].user_id);
            }
            options = $.dataSet.getUserInfoArrayByUserIdArray(options)
            return options;
        },
        adminTeamsByUser: function(options){
            var i,len,temp_node;
            var filter_arr = [];
            if(options.user_id===undefined){
                return options;
            }
            options.curr_team_user = $.dataCache.get({set_name:"admin_team_user"
                , filter_by:[[{field:"user_id", rel:"eq", value:options.user_id}]]});
            for(i=0, len=options.curr_team_user.length; i<len; i+=1){
                temp_node = [{field:"id", rel:"eq", value:options.curr_team_user[i].team_id}
                    ,{field:"space_id", rel:"eq", value:options.space_id}];
                filter_arr.push(temp_node);
            }
            options.curr_team = $.dataCache.get({set_name:"admin_team", filter_by:filter_arr});
            return options;
        },
        adminUsersByTeam : function(options){
            var filter_arr = [];
            if(options.team_id===undefined){
                return options;
            }
            options.curr_team_user = $.dataCache.get({set_name:"admin_team_user"
                , filter_by:[[{field:"team_id", rel:"eq", value:options.team_id}]]});
            filter_arr = [{field_name:"id", rel:"eq", value_name:"user_id"}];
            filter_arr = this.makeFilterByFieldName(options.curr_team_user, filter_arr);
            options.curr_user = $.dataCache.get({set_name:"admin_user", filter_by:filter_arr});
            return options;
        },
        adminTeamsBySpace : function(options){
            var i,len,temp_node;
            var filter_arr = [];
            if(options.space_id===undefined){
                return options;
            }
            options.admin_team = $.dataCache.get({set_name:"admin_team"
                , filter_by:[[{field:"space_id", rel:"eq", value:options.space_id}]]});
            filter_arr = [];
            for(i=0, len=options.admin_team.length; i<len; i+=1){
                temp_node = [{field:"team_id", rel:"eq", value:options.admin_team[i].id}];
                filter_arr.push(temp_node);
            }
            options.admin_team_user = $.dataCache.get({set_name:"admin_team_user", filter_by:filter_arr});
            filter_arr = [];
            for(i=0, len=options.admin_team_user.length; i<len; i+=1){
                temp_node = [{field:"id", rel:"eq", value:options.admin_team_user[i].user_id}];
                filter_arr.push(temp_node);
            }
            options.admin_user = $.dataCache.get({set_name:"admin_user", filter_by:filter_arr});
            return options;
        },
        adminObjectsByTeam : function(options){
            if(options.team_id===undefined){
                return options;
            }
            options.admin_blob_team = $.dataCache.get({set_name:"admin_blob_team"
                , filter_by:[[{field:"team_id", rel:"eq", value:options.team_id}]]});
            return options;
        },
        adminObjectsBySpace : function(options){
            if(options.space_id===undefined){
                return options;
            }
            options.admin_object = $.dataCache.get({set_name:"admin_object"
                , filter_by:[[{field:"root_id", rel:"eq", value:options.space_id}]]
                ,sort_by:['level', 'lft']});
            return options;
        },
        adminStatusBySpace : function(options){
            if(options.space_id===undefined){
                return (false);
            }
            var result = options.user_perm = $.dataCache.get({
                    set_name:"admin_object"
                    , filter_by:[[{field:"root_id", rel:"eq", value:options.space_id}]]
                });
            return ((result.length>0)?true:false);
        },
        objectsByObject : function(options){
            this.currObjectByObject(options);
            options.object = $.dataCache.get({set_name:"object"
                , filter_by:[[{field:"root_id", rel:"eq", value:options.curr_obj.root_id}
                    ,{field:"rgt", rel:"lt", value:options.curr_obj.rgt}
                    ,{field:"lft", rel:"gt", value:options.curr_obj.lft}]]
                , sort_by:['root_id', 'level', 'lft']});
            return options;
        },
        getObjectWithSubsByObjectId : function(options){
            this.currObjectByObject(options);
            this.objectsByObject(options);
            options.object = [options.curr_obj].concat(options.object);
            return (options);
        },
        getObjectWithParentsByObjectId : function(options){
            this.currObjectByObject(options);
            this.getParentObjects(options);
            options.parent_arr = [options.curr_obj].concat(options.parent_arr);
            return (options);
        },
        getDrivingParents : function(options){
            if(options.driven_object_id===undefined){
                this.currObjectByObject(options);
                options.driven_object_id=options.object_id;
            }
            if(options.driven_object_id!==undefined){
                options.parent_arr = this.getObjectWithParentsByObjectId({object_id:options.driven_object_id}).parent_arr;
                for(var i=0, len=options.parent_arr.length; i<len; i+=1){
                    if(options.parent_arr[i].set_finish !== undefined
                        && options.parent_arr[i].set_finish*1 !== 0
                        && (options.driving_finish_obj===undefined
                            || options.driving_finish_obj.set_finish*1>options.parent_arr[i].set_finish*1)){
                        options.driving_finish_obj = options.parent_arr[i];
                    }
                    if(options.parent_arr[i].set_start !== undefined
                        && options.parent_arr[i].set_start*1 !== 0
                        && (options.driving_start_obj===undefined
                            || options.driving_start_obj.set_start*1<options.parent_arr[i].set_start*1)){
                        options.driving_start_obj = options.parent_arr[i];
                    }
                }
            }
            return (options);
        },
        firstAttributeValueByUser : function(user_id, attribute){
            var attrib_arr = $.dataCache.get({set_name:"userattributes"
                , filter_by:[[{field:"attribute", rel:"eq", value:attribute}
                    ,{field:"user_id", rel:"eq", value:user_id}]]
                , sort_by:['updated_at']});
            return ((attrib_arr.length!==undefined && attrib_arr[0].value!==undefined) ? attrib_arr[0].value : '');
        },
        firstAdminAttributeValueByUser : function(user_id, attribute){
            var attrib_arr = $.dataCache.get({set_name:"admin_user_attributes"
                , filter_by:[[{field:"attribute", rel:"eq", value:attribute}
                    ,{field:"user_id", rel:"eq", value:user_id}]]
                , sort_by:['updated_at']});
            return ((attrib_arr.length!==undefined) ? attrib_arr[0].value : '');
        },
        /**
         * Given an array of objects, make a filter array for the given object field name.
         * @param <array> source_arr An array of objects.
         * @param <array> filter_arr An array with pairs of field_name, value_name, and rel.
         * @return <array> Filter array.
         */
        makeFilterByFieldName : function(source_arr, filter_arr){
            var result_arr = [];
            for(var i=0, len=source_arr.length; i<len; i+=1){
                var temp_arr = [];
                for(var j=0, lenj=filter_arr.length; j<lenj; j+=1){
                    temp_arr.push({field:filter_arr[j].field_name, rel:filter_arr[j].rel, value:source_arr[i][filter_arr[j].value_name]});
                }
                result_arr.push(temp_arr);
            }
            return (result_arr);
        },
        getRecentCommentByObjectId : function(options){
            this.currObjectByObject(options);
            var obj_count = (((options.curr_obj.rgt*1-1)-options.curr_obj.lft*1)/2)+1;
            if(options.object===undefined || options.object.length!==obj_count){
                this.getObjectWithSubsByObjectId(options);
            }
            var filter_arr = this.makeFilterByFieldName(options.object, [{value_name:'object_id', field_name:'object_id', rel:'eq'}])
            options.comment = $.dataCache.get({set_name:"comment", filter_by:filter_arr, limit:5});
            for(var i=0, len=options.comment.length; i<len; i+=1){
                if(options.comment[i].comment_parent_id!==options.comment[i].id){
                    options.comment[i].comment_parent_arr = $.dataCache.get({set_name:"comment", filter_by:[[{field:'id', rel:'eq', value:options.comment[i].comment_parent_id}]]})[0];
                }
            }
            return (options);
        },
        getRecentFilesByObjectId : function(options){
            this.currObjectByObject(options);
            var obj_count = (((options.curr_obj.rgt*1-1)-options.curr_obj.lft*1)/2)+1;
            if(options.object===undefined || options.object.length!==obj_count){
                this.getObjectWithSubsByObjectId(options);
            }
            var filter_arr = this.makeFilterByFieldName(options.object, [{value_name:'object_id', field_name:'object_id', rel:'eq'}])
            options.file = $.dataCache.get({set_name:"file", filter_by:filter_arr, limit:5});
            return (options);
        },
        getRecentStatusReportsByObject : function(options, limit){
            limit = (limit===undefined) ? 5 : limit;
            var obj_count = (((options.curr_obj.rgt*1-1)-options.curr_obj.lft*1)/2)+1;
            if(options.object===undefined || options.object.length!==obj_count){
                this.getObjectWithSubsByObjectId(options);
            }
            var filter_arr = this.makeFilterByFieldName(options.object, [{value_name:'object_id', field_name:'object_id', rel:'eq'}])
            options.taskscrum = $.dataCache.get({set_name:"taskscrum", filter_by:filter_arr, limit:limit});
            return (options);
        },
        getFileStoreByFileId : function(file_id, file_type){
            var file_arr = $.dataCache.get({set_name:"filestore"
                , filter_by:[[{field:"file_id", rel:"eq", value:file_id}
                    ,{field:"filetype", rel:"eq", value:file_type}]]});
            return ((file_arr.length!==undefined) ? file_arr[0] : []);
        },
        objectsByRoot : function(options){
            this.currObjectByObject(options);
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by:[[{field:"root_id", rel:"eq", value:options.curr_obj.root_id}]]
                    , sort_by:['root_id', 'level', 'lft']});
            return options;
        },
        currObjectByObject : function(options){
            if(options.object_id===undefined){
                options.object_id = $('#system_cache').data('curr_object_id');
            }
            options.curr_obj = $.dataCache.get({set_name:"object", filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]})[0];
            return options;
        },
        activeLanguages : function(){
            return ($.dataCache.get({set_name:"languages"}));
        },
        parentObjectByObject : function(options){
            this.currObjectByObject(options);
            options.parent_obj = $.dataCache.get({set_name:"object"
                , filter_by:[[{field:"root_id", rel:"eq", value:options.curr_obj.root_id}
                    ,{field:"level", rel:"eq", value:((options.curr_obj.level*1)-1)+''}
                    ,{field:"rgt", rel:"gt", value:options.curr_obj.rgt}
                    ,{field:"lft", rel:"lt", value:options.curr_obj.lft}]]
                })[0];
            return options;
        },
        getParentObjects : function(options){
            if(options.object_id !== undefined){
                this.currObjectByObject(options);
                options.parent_arr = $.dataCache.get({set_name:"object"
                    , filter_by:[[{field:"root_id", rel:"eq", value:options.curr_obj.root_id}
                        ,{field:"level", rel:"lt", value:(options.curr_obj.level*1)}
                        ,{field:"rgt", rel:"gt", value:options.curr_obj.rgt}
                        ,{field:"lft", rel:"lt", value:options.curr_obj.lft}]]
                    , sort_by:['rgt']});
            }
            return options;
        },
        getUserSpaceId : function(options){
            var object_id = $.dataCache.get({set_name:"object"
                    , filter_by:[[{field:"object_type", rel:"eq", value:"Personal Space"}]]})[0].object_id;
            return (object_id);
        },
        getReportsByObject : function(options){
            options.report = [];
            if(options.object_id !== undefined){
                this.currObjectByObject(options);
                options.user_perm = $.dataCache.get({
                    set_name:"user_perm"
                    , filter_by:[[{field:"root_id", rel:"eq", value:options.curr_obj.root_id}]]
                    , sort_by:['service_level']
                });
                var filter_arr = [];
                var temp_node = '';
                for(var i=0, len=options.user_perm.length; i<len; i+=1){
                    temp_node = [{field:"service_level", rel:"lteq", value:options.user_perm[i].service_level}];
                    filter_arr.push(temp_node);
                }
                options.report = $.dataCache.get({set_name:"report", filter_by:filter_arr});
            }
            return options;
        },
        getStatusReportsByObjectDateSpan : function(options){
            this.currObjectByObject(options);
            var offset = (options.span_period===undefined) ? 0 : options.span_period;
            if(options.curr_obj.work_remain==="-2"){
                var child_arr = $.dataSet.objectsByObject({object_id:options.curr_obj.object_id});
                var filter_arr = [];
                filter_arr.push([{field:"object_id", rel:"eq", value:options.curr_obj.object_id}]);
                for(var j=0, lenj=child_arr.object.length; j<lenj; j+=1){
                    filter_arr.push([{field:"object_id", rel:"eq", value:child_arr.object[j].object_id}]);
                }
                if(offset>0){
                    var most_recent = $.dataCache.get({set_name:"taskscrum", filter_by:filter_arr, limit:1})[0];
                    if(most_recent!==undefined){
                        var offset_date = most_recent.work_date*1 - offset;
                        for(j=0, lenj=filter_arr.length; j<lenj; j+=1){
                            filter_arr[j][1] = {field:"work_date", rel:"gt", value:offset_date};
                        }
                    }
                }
                options.taskscrum = $.dataCache.get({set_name:"taskscrum", filter_by:filter_arr});
            } else {
                options.taskscrum = $.dataCache.get({set_name:"taskscrum", filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]});
            }
            return (options);
        },
        getObjectAlternateActiveUsers : function(options){
            this.currObjectByObject(options);
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            if (options.user_id===undefined){
                options.user_id = options.user_info.id;
            }
            var scrum_arr = $.dataCache.get({set_name:"taskscrum", filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}
                    ,{field:"owner_id", rel:"neq", value:options.user_id}]]});
            var filter_arr = [];
            var user_arr = [options.user_id];
            for(var i=0, len=scrum_arr.length; i<len; i+=1){
                if($.inArray(scrum_arr[i].owner_id, user_arr)===-1 && scrum_arr[i].work_remain*1>0){
                    filter_arr.push([{field:"id", rel:"eq", value:scrum_arr[i].owner_id}]);
                    user_arr.push(scrum_arr[i].owner_id);
                }
            }
            if(filter_arr.length>0){
                options.alt_active_users = $.dataCache.get({set_name:"user", filter_by:filter_arr});
            }
            return (options);
        },
        getWorkRemainByObjectAndUser : function(options){
            var user_arr = [];
            var complete_arr = [];
            var status_arr = [];
            this.getStatusReportsByObjectDateSpan(options);
            for(var i=0, len=options.taskscrum.length; i<len; i+=1){
                if(options.taskscrum[i].work_remain*1!==-1){
                    if(options.taskscrum[i].work_remain*1===-2){
                        complete_arr.push(options.taskscrum[i].object_id);
                    }
                    var user_loc = $.inArray(options.taskscrum[i].owner_id, user_arr);
                    if(user_loc===-1){
                        user_arr.push(options.taskscrum[i].owner_id);
                        user_loc = user_arr.length-1;
                        status_arr[user_loc]={};
                        status_arr[user_loc].active_objects = [];
                        status_arr[user_loc].work_remain = 0;
                        status_arr[user_loc].work_total = 0;
                    }
                    if($.inArray(options.taskscrum[i].object_id, status_arr[user_loc].active_objects)===-1){
                        status_arr[user_loc].active_objects.push(options.taskscrum[i].object_id);
                        if($.inArray(options.taskscrum[i].object_id, complete_arr)===-1
                            && options.taskscrum[i].work_remain*1>0){
                            status_arr[user_loc].work_remain += options.taskscrum[i].work_remain*1;
                        }
                    }
                    if(options.taskscrum[i].work_done*1>0){
                        status_arr[user_loc].work_total += options.taskscrum[i].work_done*1;
                    }
                }
            }
            options.active_users = user_arr;
            options.work_summary = status_arr;
            return (options);
        },
        nextObjectSiblingByObject : function(options){
            this.currObjectByObject(options);
            options.sibling_obj = $.dataCache.get({set_name:"object"
                , filter_by:[[{field:"root_id", rel:"eq", value:options.curr_obj.root_id}
                    ,{field:"level", rel:"eq", value:(options.curr_obj.level)}
                    ,{field:"lft", rel:"eq", value:((options.curr_obj.rgt*1)+1)+''}]]
                })[0];
            return options;
        },
        userTopActive : function(options){
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            if (options.user_id===undefined){
                options.user_id = options.user_info.id;
            }
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by:[
                        [{field:"work_remain", rel:"gteq", value:"-1"}
                        ,{field:"work_remain", rel:"neq", value:"0"}
                        ,{field:"work_remain", rel:"neq", value:"-2"}
                        ,{field:"owner_id", rel:"eq", value:options.user_id}]
                        ]
                    , sort_by:['urgency_index', 'work_remain']
                    });
            options.object.reverse();
            return options;
        },
        userTopUI : function(options){
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            if (options.user_id===undefined){
                options.user_id = options.user_info.id;
            }
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by:[
                        [{field:"work_remain", rel:"gt", value:"0"}
                        ,{field:"urgency_index", rel:"gt", value:"0"}
                        ,{field:"owner_id", rel:"eq", value:options.user_id}]
                        ,[{field:"work_remain", rel:"eq", value:"-1"}
                        ,{field:"urgency_index", rel:"gt", value:"0"}
                        ,{field:"owner_id", rel:"eq", value:options.user_id}]
                        ]
                    , sort_by:['urgency_index', 'work_remain']
                    });
            options.object.reverse();
            return options;
        },
        userNewObj : function(options){
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            if (options.user_id===undefined){
                options.user_id = options.user_info.id;
            }
            var complete_arr = [];
            var user_obj_arr = [];
            var filter_arr = [[{field:"owner_id", rel:"eq", value:options.user_info.id}]
                ,[{field:"work_remain", rel:"eq", value:"-2"}]];
            var status_arr = $.dataCache.get({set_name:"taskscrum", filter_by:filter_arr});
            if(status_arr.length>0){
                for(var j=0, lenj=status_arr.length; j<lenj; j+=1){
                    if(status_arr[j].work_remain===-2 || (status_arr[j].owner_id===options.user_info.id && status_arr[j].work_remain===0)){
                        complete_arr.push(status_arr[j].object_id);
                    } else if($.inArray(status_arr[j].object_id, complete_arr)===-1
                        && $.inArray(status_arr[j].object_id, user_obj_arr)===-1
                        && status_arr[j].work_remain===-1){
                        user_obj_arr.push(status_arr[j].object_id);
                    }
                }
            }

            filter_arr = [[{field:"work_remain", rel:"eq", value:"-1"}
                        ,{field:"owner_id", rel:"eq", value:options.user_id}]];
            for(j=0, lenj=user_obj_arr.length; j<lenj; j+=1){
                filter_arr.push([{field:"object_id", rel:"eq", value:user_obj_arr[j]}]);
            }
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by: filter_arr
                    , sort_by:['object_name']
                    });
            return (options);
        },
        teamTopUI : function(options){
            var i,len;
            var filter_arr = [];
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            if (options.user_id===undefined){
                options.user_id = options.user_info.id;
            }
            options.team_user = $.dataCache.get({set_name:"team_user"
                , filter_by:[[{field:"user_id", rel:"eq", value:options.user_id}]]});
            for(i=0, len=options.team_user.length; i<len; i+=1){
                filter_arr.push([{field:"team_id", rel:"eq", value:options.team_user[i].team_id}]);
            }
            options.blob_team = $.dataCache.get({set_name:"blob_team"
                , filter_by: filter_arr});
            filter_arr = [];
            for(i=0, len=options.blob_team.length; i<len; i+=1){
                filter_arr.push([{field:"work_remain", rel:"gt", value:"0"}
                        ,{field:"urgency_index", rel:"gt", value:"0"}
                        ,{field:"manager_id", rel:"eq", value:options.blob_team[i].team_id}]);
            }
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by: filter_arr
                    , sort_by:['urgency_index', 'work_remain']
                    });
            options.object.reverse();
            return options;
        },
        currObjectFilter : function(options){
            var filter_arr = [];
            if(options.curr_obj === undefined && options.object_id!==undefined){
                this.currObjectByObject(options);
            }
            if(options.curr_obj !== undefined){
                filter_arr = [{field:"root_id", rel:"eq", value:options.curr_obj.root_id}
                            ,{field:"lft", rel:"gt", value: options.curr_obj.lft}
                            ,{field:"rgt", rel:"lt", value:options.curr_obj.rgt}];
            }
            return (filter_arr);
        },
        myTasks : function(options){
            var complete_arr = [];
            var user_obj_arr = [];
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            if (options.user_id===undefined){
                options.user_id = options.user_info.id;
            }
            var filter_arr = [[{field:"owner_id", rel:"eq", value:options.user_info.id}]
                ,[{field:"work_remain", rel:"eq", value:"-2"}]];
            var status_arr = $.dataCache.get({set_name:"taskscrum", filter_by:filter_arr});
            if(status_arr.length>0){
                for(var j=0, lenj=status_arr.length; j<lenj; j+=1){
                    if(status_arr[j].work_remain===-2 || (status_arr[j].owner_id===options.user_info.id && status_arr[j].work_remain===0)){
                        complete_arr.push(status_arr[j].object_id);
                    } else if($.inArray(status_arr[j].object_id, complete_arr)===-1
                        && $.inArray(status_arr[j].object_id, user_obj_arr)===-1){
                        user_obj_arr.push(status_arr[j].object_id);
                    }
                }
            }

            var curr_obj_filter_arr = this.currObjectFilter(options);
            curr_obj_filter_arr.push({field:"work_remain", rel:"neq", value:"0"})
            filter_arr = [curr_obj_filter_arr.concat([{field:"work_remain", rel:"eq", value:"-2"}])];
            for(j=0, lenj=user_obj_arr.length; j<lenj; j+=1){
                curr_obj_filter_arr.concat({field:"object_id", rel:"eq", value:user_obj_arr[j]});
                filter_arr.push(curr_obj_filter_arr.concat({field:"object_id", rel:"eq", value:user_obj_arr[j]}));
            }
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by: filter_arr
                    , sort_by:['root_id', 'level', 'lft']
                    });
            return (options);
        },
        allCurrObjects : function(options){
            var filter_arr = [this.currObjectFilter(options)];
            var search_obj = {set_name:"object"
                    , sort_by:['root_id', 'level', 'lft']
                    };
            if(filter_arr.length>0 && filter_arr[0].length>0){
                search_obj.filter_by = filter_arr;
            }
            options.object = $.dataCache.get(search_obj);
            return (options);
        },
        getUserInfo : function(options){
            if(options.user_info===undefined && options.user_id===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
                options.user_id = options.user_info.id;
            } else {
                options.user_info = $.dataCache.get({set_name:"user", filter_by:[[{field:"id", rel:"eq", value:options.user_id}]]})[0];
            }

            options.user_info.userattributes = $.dataCache.get({set_name:"userattributes", filter_by:[[{field:"user_id", rel:"eq", value:options.user_id}]]});
            return (options);
        },
        getUserInfoArrayByUserIdArray : function(options){
            options.user_info_arr = [];
            if(options.user_id_arr!==undefined && options.user_id_arr.length>0){
                var filter_arr = [];
                for(var i=0, len=options.user_id_arr.length; i<len; i+=1){
                    filter_arr.push([{field:"id", rel:"eq", value:options.user_id_arr[i]}]);
                }
                options.user_info_arr = $.dataCache.get({set_name:"user", filter_by:filter_arr, sort_by:['last_name', 'first_name']});
                for(i=0, len=options.user_info_arr.length; i<len; i+=1){
                    options.user_info_arr[i].userattributes = $.dataCache.get({set_name:"userattributes", filter_by:[[{field:"user_id", rel:"eq", value:options.user_info_arr[i].user_id}]]});
                }
            }
            return (options);
        },
        getTeamUsersByTeamId : function(options){
            if(options.team_id!==undefined){
                options.user_id_arr = [];
                var temp_arr = $.dataCache.get({set_name:"team_user", filter_by:[[{field:"team_id", rel:"eq", value:options.team_id}]]});
                for(var i=0, len=temp_arr.length; i<len; i+=1){
                    options.user_id_arr.push(temp_arr[i].user_id);
                }
                $.dataSet.getUserInfoArrayByUserIdArray(options);
            }
            return (options);
        },
        activeObjects : function(options){
            var filter_arr = [];
            var temp_arr = this.currObjectFilter(options);
            temp_arr.push({field:"work_remain", rel:"gt", value:"0"});
            filter_arr.push(temp_arr);
            temp_arr = this.currObjectFilter(options);
            temp_arr.push({field:"work_remain", rel:"eq", value:"-1"});
            filter_arr.push(temp_arr);
            temp_arr = this.currObjectFilter(options);
            temp_arr.push({field:"work_remain", rel:"eq", value:"-2"});
            filter_arr.push(temp_arr);

            options.object = $.dataCache.get({set_name:"object"
                    , filter_by: filter_arr
                    , sort_by:['root_id', 'level', 'lft']
                    });
            return (options);
        },
        teamTasks: function(options){
            var i,len;
            var filter_arr = [];
            if(options.user_info===undefined){
                options.user_info = $.dataCache.get({set_name:"user_info"})[0];
            }
            options.team_user = $.dataCache.get({set_name:"team_user"
                , filter_by:[[{field:"user_id", rel:"eq", value:options.user_info.id}]]});
            for(i=0, len=options.team_user.length; i<len; i+=1){
                filter_arr.push([{field:"team_id", rel:"eq", value:options.team_user[i].team_id}]);
            }
            options.blob_team = $.dataCache.get({set_name:"blob_team"
                , filter_by: filter_arr});
            filter_arr = [];
            for(i=0, len=options.blob_team.length; i<len; i+=1){
                var temp_arr = this.currObjectFilter(options);
                temp_arr.push({field:"work_remain", rel:"gt", value:"0"}
                        ,{field:"manager_id", rel:"eq", value:options.blob_team[i].team_id});
                filter_arr.push(temp_arr);
                temp_arr = this.currObjectFilter(options);
                temp_arr.push({field:"work_remain", rel:"eq", value:"-1"}
                        ,{field:"manager_id", rel:"eq", value:options.blob_team[i].team_id});
                filter_arr.push(temp_arr);
                temp_arr = this.currObjectFilter(options);
                temp_arr.push({field:"work_remain", rel:"eq", value:"-2"});
                filter_arr.push(temp_arr);
            }
            options.object = $.dataCache.get({set_name:"object"
                    , filter_by: filter_arr
                    , sort_by:['root_id', 'level', 'lft']
                    });
            return options;
        },
        removeChildObjects : function(obj_array){
            for(var i=0, len=obj_array.length; i<len; i+=1){
                obj_array[i] = $.dataCache.get({set_name:"object", filter_by:[[{field:"object_id", rel:"eq", value:obj_array[i]}]]})[0];
            }
            for(i=0; i<obj_array.length; i+=1){
                var m = obj_array[i];
                len=obj_array.length;
                if(m.discard===undefined){
                    for(var j=i+1; j<len; j+=1){
                        var n = obj_array[j];
                        if(n.discard===undefined){
                            if(m.rgt*1>n.rgt*1 && m.lft*1<n.lft*1){
                                obj_array[j].discard=true;
                                break;
                            } else if (m.rgt*1<n.rgt*1 && m.lft*1>n.lft*1){
                                obj_array[i].discard=true;
                                break;
                            }
                        }
                    }
                }

            }
            var result_array = [];
            for(i=0, len=obj_array.length; i<len; i+=1){
                m=obj_array[i];
                if(m.discard===undefined){
                    result_array.push(m.object_id);
                }
            }
            return result_array;
        },
        processStatusToBdBu : function(target_data){
            var options = {};
            options.myvalues = [];
            options.cum_work = [];
            options.baseline = [];
            options.peakline = [];
            options.max_est = 0;
            options.cum_max = 0;
            var curr_est = 0;
            var curr_date = '';
            var curr_datetime = '';
            var est = {
                cum : [],
                prev : []
            }
            var curr_id = '';
            var min_date = 0;
            var max_date = 0;

            function saveTotalEst(est){
                var total_est = 0;
                var lenj = (est.prev.length<est.cum.length) ? est.cum.length : est.prev.length;
                for(var j=0; j<lenj; j+=1){
                    if(est.prev[j]!==undefined && est.cum[j]===undefined){
                        est.cum[j]=est.prev[j];
                    }
                    if(est.cum[j]!==undefined){
                        total_est += est.cum[j];
                    }
                }
                if(options.max_est<total_est){
                    options.max_est=total_est;
                }
                options.myvalues.push([max_date, total_est]);
                max_date = curr_date;
                est.prev = est.cum;
                est.cum = [];
                est.cum[curr_id] = curr_est;
                return est;
            }

            if(target_data.length===0){
                return options;
            }
            //This primes the chart with the pre-work done before the first status.
            curr_est = (target_data[0].work_remain/3600)+(target_data[0].work_done/3600);
            curr_id = target_data[0].object_id*1;
            if(target_data.length===1){
                curr_datetime = $.samUtil.formatEpochDateToDMY(((target_data[0].created_at*1)-(target_data[0].work_done*1)), -1);
                curr_date = curr_datetime.curr_datestamp;
                curr_datetime = curr_datetime.curr_timestamp;
                est.prev[curr_id]= curr_est;
            } else {
                curr_datetime = $.samUtil.formatEpochDateToDMY(((target_data[0].created_at*1)-(target_data[0].work_done*1)));
                curr_date = curr_datetime.curr_datestamp;
                curr_datetime = curr_datetime.timestamp;
                est.cum[curr_id] = curr_est;
            }
            options.cum_work[0] = [curr_datetime,0];
            min_date=curr_date;
            max_date=curr_date;
            options.max_est = curr_est;

            for(var i=0, len=target_data.length; i<len; i+=1){
                curr_datetime = $.samUtil.formatEpochDateToDMY(target_data[i].created_at*1);
                curr_date = curr_datetime.curr_datestamp;
                curr_datetime = curr_datetime.curr_timestamp;
                curr_est = target_data[i].work_remain/3600;
                curr_id = target_data[i].object_id*1;
                if(max_date!=curr_date && max_date<curr_date){
                    est = saveTotalEst(est);
                } else {
                    if(est.cum[curr_id]===undefined || est.cum[curr_id]<curr_est || curr_est===0){
                        est.cum[curr_id] = curr_est ;
                    }
                }
                options.cum_max += (target_data[i].work_done/3600);
                options.cum_work.push([curr_datetime, options.cum_max]);
            }
            //Flush the estimate cache.
            saveTotalEst(est);

            if(max_date!==0){
                options.baseline[0] = [min_date,0];
                options.baseline[1] = [max_date,0];
                options.peakline[0] = [min_date,options.max_est];
                options.peakline[1] = [max_date,options.max_est];
            }
            return options;
         }
    }
})(jQuery);