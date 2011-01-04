/* 
 * Sampi Plan - Form Methods
 */

(function($) {

    $.navHandler = {
        splitLoc : function(loc){
            var loc_obj = {
                loc : loc,
                domain : '',
                context : '',
                detail : '',
                minor_view : ''
            }
            if(loc !== undefined){
                loc = loc.split('#');
                loc_obj.domain = loc[0];
                if(loc.length>1){
                    loc_obj.loc = ['#', loc[1]].join('');
                    loc = loc[1].split('/');
                    for (var i = 0, len=loc.length; i<len; i+=2) {
                        loc_obj[loc[i]]=loc[i+1];
                    }
                }
            }
            return loc_obj;
        },
        refreshEverything : function(){
            var curr_loc = window.location.href;
            var prev_loc = $('#system_cache').data('loc');
            this.compLoc(this.splitLoc(curr_loc), this.splitLoc(prev_loc.domain));
        },
        refreshContext : function(data_obj){
            var curr_loc_obj = $('#system_cache').data('loc');
            if(curr_loc_obj !==undefined 
                && curr_loc_obj.context !== undefined
                && curr_loc_obj.context !== ''
                && curr_loc_obj.context !== 'reports'
                && data_obj.object !== undefined){
                this.setView(curr_loc_obj, 'context');
            }
        },
        refreshDetail : function(data_obj){
            var minor_view = {
                status : 'taskscrum',
                comment : 'comment',
                tags : 'tag',
                file : 'file',
                team : 'team',
                subs : 'object',
                admin_user : 'admin_user',
                admin_team : 'admin_team',
                admin_object : 'admin_object',
                admin_file : 'admin_file',
                admin_approval: 'admin_approvaltemplate'
            }
            var curr_loc_obj = $('#system_cache').data('loc');
            if(curr_loc_obj !==undefined
                && curr_loc_obj.detail !== undefined
                && curr_loc_obj.detail !== ''
                && curr_loc_obj.minor_view !== undefined
                && curr_loc_obj.minor_view !== ''
                && minor_view[curr_loc_obj.minor_view] !== undefined
                && data_obj[minor_view[curr_loc_obj.minor_view]] !== undefined){
                if(data_obj.object!==undefined){
                    this.setView(curr_loc_obj, 'detail');
                }
                this.setView(curr_loc_obj, 'minor_view');
            } else if(curr_loc_obj.minor_view!==undefined
                && curr_loc_obj.minor_view==='summary'
                && (data_obj.taskscrum!==undefined
                    || data_obj.comment !==undefined
                    || data_obj.file !==undefined
                    || data_obj.team !==undefined)){
                this.setView(curr_loc_obj, 'detail');
                this.setView(curr_loc_obj, 'minor_view');
            }
            if(data_obj.object!==undefined){
                this.setView(curr_loc_obj, 'context');
            }

        },
        compLoc : function(curr_loc_obj, prev_loc_obj, e){
            if(prev_loc_obj.domain===curr_loc_obj.domain
                && (curr_loc_obj.activate!==undefined || curr_loc_obj.context!=="")){
                if(e!==undefined){
                    e.preventDefault();
                }
                if(curr_loc_obj.activate!==undefined){
                    this.activateMethod(curr_loc_obj);
                } else if(curr_loc_obj.loc!==prev_loc_obj.loc){
                    if(curr_loc_obj.context!==prev_loc_obj.context
                        && prev_loc_obj.object_id!==undefined
                        && curr_loc_obj.object_id===undefined){
                        curr_loc_obj.object_id = prev_loc_obj.object_id;
                        curr_loc_obj.loc = curr_loc_obj.loc + '/object_id/' + prev_loc_obj.object_id;
                        if(prev_loc_obj.minor_view!==undefined
                            && curr_loc_obj.minor_view===''){
                            curr_loc_obj.minor_view = prev_loc_obj.minor_view;
                            curr_loc_obj.loc = curr_loc_obj.loc + '/minor_view/' + prev_loc_obj.minor_view;
                            if(prev_loc_obj.detail!==undefined
                                && curr_loc_obj.detail===''){
                                curr_loc_obj.loc = curr_loc_obj.loc + '/detail/' + prev_loc_obj.detail;
                            }
                        }
                    }
                    if(curr_loc_obj.context!==''){
                        window.location.hash = curr_loc_obj.loc;
                        var title_text = 'Sampi Plan ';
                        if(curr_loc_obj.object_id===undefined){
                                title_text += '(' + sampiDic[curr_loc_obj.context + '_name'] + ')';
                        } else {
                                title_text += '(' + $.dataSet.currObjectByObject({object_id:curr_loc_obj.object_id}).curr_obj.object_name + ')';
                        }
                        document.title = title_text;
                    }
                    $('#system_cache').data('loc', curr_loc_obj);
                    $('#system_cache').data('loc_href', curr_loc_obj.loc);

                    this.setView(curr_loc_obj, 'context');
                    if(curr_loc_obj.context!==prev_loc_obj.context
                        || !(curr_loc_obj.detail===prev_loc_obj.detail
                            && curr_loc_obj.object_id===prev_loc_obj.object_id
                            && curr_loc_obj.space_id===prev_loc_obj.space_id)){
                        this.setView(curr_loc_obj, 'detail');
                        if(!(curr_loc_obj.minor_view==='')){
                            this.setView(curr_loc_obj, 'minor_view');
                        }
                    } else if(curr_loc_obj.minor_view==='report'
                        || (curr_loc_obj.span_period!==undefined && curr_loc_obj.span_period!==prev_loc_obj.span_period)){
                        this.setView(curr_loc_obj, 'minor_view');
                    }
                    if(!(curr_loc_obj.minor_view===prev_loc_obj.minor_view)){
                        this.setView(curr_loc_obj, 'minor_view');
                    }                    
                }
                return false;
            }
            return true;
        },
        setCurr : function(target_ele, target_class) {
            var target = $(target_ele);
            $('.active', target).removeClass('active');
            $(target_class, target).addClass('active');
        },
        activateMethod : function(options){
            var method_map = {
                form_dialog : function(options){$.formHandler.getForm(options)},
                select_item : function(options){$.formHandler.itemSelect(options)},
                help : function(options){
                    $.helpHandler.activateHelp(options);
                },
                post : function(options){
                    $.postData(options, options);
                },
                logout : function(options){$.samUtil.logout({cookie_name:'toyboxuserid'});},
                change_dic : function(options){$.lay.init.lang_select(options);}
            }
            if(method_map[options.activate]!==undefined){
                method_map[options.activate](options);
            }
        },
        setView : function(curr_loc, view_name){
            if(curr_loc[view_name]!==undefined && $.lay[view_name][curr_loc[view_name]]!==undefined){
                    $.lay[view_name][curr_loc[view_name]](curr_loc);
            }
        },
        setState : function(name,value){
            $('#system_cache').data(name, value);
        },
        setObjectTreeStateOpen : function(obj_id){
            var tree_state = this.getObjectTreeState();
            if(-1===tree_state.indexOf(obj_id)){
                tree_state.push(obj_id);
            }
            $('#system_cache').data('object_tree',tree_state);
        },
        setObjectTreeStateClose : function(obj_id){
            var tree_state = this.getObjectTreeState();
            var id_index = tree_state.indexOf(obj_id);
            if(id_index>-1){
                tree_state.splice(id_index,1);
            }
            $('#system_cache').data('object_tree',tree_state);
        },
        getObjectTreeState : function(){
            var tree_obj = $('#system_cache').data('object_tree');
            if(tree_obj===undefined){
                tree_obj=[];
            }
            return(tree_obj);
        },
        checkLoc : function(prev_href){
            var curr_loc = window.location.href;
            if(curr_loc !== prev_href){
                var prev_loc = $('#system_cache').data('loc');
                this.compLoc(this.splitLoc(curr_loc), prev_loc);
            }
            setTimeout(function(){
                    $.navHandler.checkLoc(curr_loc);
                }, 500);
        },
        checkUpdate : function(){
            var options = {};
            var t_c_val = $("#system_cache").data('t_c');
            var data_array = {task:"ajaxfacade", option1:"userdata", t_c:t_c_val};
            $.getData(data_array, options);
            setTimeout(function(){
                    $(".layout.ui-widget:first").one("click", function(){
                        $.navHandler.checkUpdate();
                    })
                }, 60000);
        },
        checkAnchor : function(e){
            var result = true;
            var prev_loc = $('#system_cache').data('loc');
            var curr_href = this.splitLoc(e.target.href);
            if(prev_loc===undefined){
                prev_loc = this.initLoc(curr_href);
            }
            result = this.compLoc(curr_href, prev_loc, e);
            return result;
        },
        initAnchor : function(){
            $("a").live("click", function(e){ 
                return($.navHandler.checkAnchor(e));
            });
        },
        initTreeToggle : function(){
            $("div.hitarea").live("click", function(e){
                var sib_link = $(e.target).siblings("a").get(0);
                if(sib_link!==undefined){
                    var loc_obj = $.navHandler.splitLoc(sib_link.href);
                    if($(e.target).hasClass('collapsable-hitarea')){
                        $.navHandler.setObjectTreeStateOpen(loc_obj.object_id);
                    } else if($(e.target).hasClass('expandable-hitarea')){
                        $.navHandler.setObjectTreeStateClose(loc_obj.object_id);
                    }
                }
                return true;
            });
        },
        initCheck : function(){
            
            var curr_href = window.location.href;
            var curr_loc = this.splitLoc(curr_href);
            var prev_loc = this.initLoc(curr_loc);
            this.compLoc(curr_loc, prev_loc);
            $.navHandler.checkLoc(curr_href);
            $.navHandler.checkUpdate();
        },
        initLoc : function(curr_loc){
            var prev_loc = this.splitLoc('');
            prev_loc.domain = curr_loc.domain;
            return (prev_loc);
        },
        checkObjectUserAccess : function(options){
            if(options.curr_obj===undefined){
                options.curr_obj = $.dataCache.get({set_name:"object", filter_by:[[{field:"object_id", rel:"eq", value:options.object_id}]]})[0];
            }
            if(options.curr_obj===undefined){
                return options;
            }
            options.user_perm = $.dataCache.get({set_name:"user_perm"
                , filter_by:[
                    [{field:"root_id", rel:"eq", value:options.curr_obj.root_id}
                    , {field:"level", rel:"lt", value:options.curr_obj.level}
                    , {field:"lft", rel:"lt", value:options.curr_obj.lft}
                    , {field:"rgt", rel:"gt", value:options.curr_obj.rgt}]
                    , [{field:"object_id", rel:"eq", value:options.object_id}]
                ]
                , sort_by:["service_level"]
            });
            options.curr_obj.service_level = options.user_perm[options.user_perm.length-1].service_level;
            return options;
        }
    };
})(jQuery);

