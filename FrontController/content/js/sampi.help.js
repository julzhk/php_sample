(function($) {
    $.helpHandler = {
        getHelpContent : function(options){
            var inner_html = ['<div class="help_body">'];
            if(options.help_type!==undefined){
                inner_html.push(this.content({type:options.help_type}));
            } else {
                if(options.context!==undefined){
                    inner_html.push(this.content({type:options.context}));
                    if(options.context!=='self_admin' && options.detail!=='object'){
                        inner_html.push(this.content({type:'object'}));
                    }
                }
                if(options.detail!==undefined){
                    inner_html.push(this.content({type:options.detail}));
                }
                if(options.minor_view!==undefined){
                    inner_html.push(this.content({type:options.minor_view}));
                }
            }
            inner_html.push('</div>');
            return (inner_html.join(''));
        },
        createHelpDialog : function(options){
            var target_ele = $('#help_stage').html(this.getHelpContent(options));
            var config = {
                close: function(event, ui) {
                    $(this).dialog('destroy');
                }
                , position: ['right','top']
                , height: 400
                , buttons: {
                    "Close": function() {
                        $(this).dialog('destroy');
                    }
                }
            }
            $('.help_body', target_ele).dialog(config);
        },
        activateHelp : function(options){
            options.curr_loc = $('#system_cache').data('loc');
            this.createHelpDialog(options);
        },
        content : function(options){
            var type = {
                object : ['<div class="ui-widget-header ui-corner-top margin-top pad-left pad-right inline-block">',sampiDic.tasks_projects_description_header,'</div>'
                            ,'<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">'
                                ,'<div class="pad-all"><span class="holder_object"></span>',sampiDic.project_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_0"></span>',sampiDic.new_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_1"></span>',sampiDic.on_time_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_2"></span>',sampiDic.low_risk_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_3"></span>',sampiDic.high_risk_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_4"></span>',sampiDic.complete_task_explanation,'</div>'
                            ,'</div>']
                ,my_spaces : ['<div class="ui-widget-header ui-corner-top margin-top pad-left pad-right inline-block">',sampiDic.tasks_projects_description_header,'</div>'
                            ,'<div class="ui-widget-content ui-corner-bottom ui-corner-tr pad-all">'
                                ,'<div class="pad-all"><span class="holder_object"></span>',sampiDic.project_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_0"></span>',sampiDic.new_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_1"></span>',sampiDic.on_time_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_2"></span>',sampiDic.low_risk_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_3"></span>',sampiDic.high_risk_task_explanation,'</div>'
                                ,'<div class="pad-all"><span class="urgency_4"></span>',sampiDic.complete_task_explanation,'</div>'
                            ,'</div>']

            }
            if(type[options.type]!==undefined){
                return (type[options.type].join(''));
            } else {
                return ('')
            }
        }
    };
})(jQuery);