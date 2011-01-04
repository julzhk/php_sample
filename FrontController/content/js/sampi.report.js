/*
 * Sampi Plan - Report Methods
 * 2009 Sampi, Ltd. All Rights Reserved
 */
(function($) {
//Creates a namespace for the reports
    $.reportS = {
        cumWork : function(options){
            //This can be basically a velocity graph.
            options = $.dataSet.currObjectByObject(options);
            var item_data = options.curr_obj;
            var child_arr = $.dataSet.objectsByObject({object_id:item_data.object_id});
            var status_arr = [];
            var filter_arr = [];
            var user_status_arr = [];
            var user_arr = [];
            var temp = '';

            filter_arr.push([{field:"object_id", rel:"eq", value:item_data.object_id}]);
            for(var j=0, lenj=child_arr.object.length; j<lenj; j+=1){
                filter_arr.push([{field:"object_id", rel:"eq", value:child_arr.object[j].object_id}
                    ,{field:"work_remain", rel:"neq", value:-1}]);
            }
            status_arr = $.dataCache.get({set_name:"taskscrum", filter_by:filter_arr}).reverse();
            var urgency_status = $.viewS.set({type:"urgencyClass", object_data:item_data});
            if(status_arr.length>0){
                var content = '<div class="' + urgency_status + '">' + item_data.object_name + '</div>';
                $('#detail .ui-layout-content').html(content);
                for(j=0, lenj=status_arr.length; j<lenj; j+=1){
                    temp = $.inArray(status_arr[j].owner_id, user_arr);
                    if(temp===-1){
                        temp = user_arr.length;
                        user_arr.push(status_arr[j].owner_id);
                        user_status_arr[temp]=[];
                    }
                    if(status_arr[j].work_remain===-2){
                        for(var i=0, len=user_arr.length; i<len; i+=1){
                            var alt_arr = status_arr[j];
                            alt_arr.work_done = 0;
                            if(user_arr[i]!==status_arr[j].owner_id){
                                user_status_arr[i].push(alt_arr);
                            } else {
                                user_status_arr[i].push(status_arr[j]);
                            }
                        }
                    } else {
                        user_status_arr[temp].push(status_arr[j]);
                    }
                }
                for(j=0, lenj=user_status_arr.length; j<lenj; j+=1){
                    var this_user = $.dataCache.get({set_name:"user", filter_by:[[{field:"id", rel:"eq", value:user_status_arr[j][0].owner_id}]]})[0];
                    content = ['<div class="chart_block"><div class="chart_title">', this_user.last_name, ',', this_user.first_name ,'</div>',
                            '<div id="bdwu_chart_object_',item_data.object_id,'_user_',this_user.id,'" class="report-list-chart">','</div></div>'
                        ].join('');
                    var this_chart_id = 'bdwu_chart_object_'+item_data.object_id+'_user_'+this_user.id
                    $('#detail .ui-layout-content').append(content);
                    var this_chart = $('#'+this_chart_id);
                    this_chart.width(this_chart.width());//This sets the fixed width equal to the percentage that the CSS generates.
                    $.viewS.sparklineDetail(user_status_arr[j], this_chart_id);
                }
            }
        },
        cumBurnDown : function(options){
            options = $.dataSet.getStatusReportsByObjectDateSpan(options);
            var urgency_status = $.viewS.set({type:"urgencyClass", object_data:options.curr_obj});
            var content = ['<span class="', urgency_status,'">', options.curr_obj.object_name, '</span>',
                        '<div id="bdwu_chart_object_',options.object_id,'" class="report-list-chart">','</div>'
                ].join('');
            $('#detail .ui-layout-content').html(content);
            if(options.taskscrum.length>0){
                $.viewS.sparklineDetail(options.taskscrum.reverse(), "bdwu_chart_object_" + options.object_id);
            }
        }
    };
})(jQuery);


