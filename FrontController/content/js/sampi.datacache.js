/*
 * Sampi Plan - Data Fetching and Caching
 */

(function($) {
    $.dataCache = {
        get : function(options){
            var data_array = [];
            data_array = this.mapDataFilter(this.getCache(options.set_name), options);
            return data_array;
        },
        set : function(data_obj){
            if(data_obj.mapped_data !== undefined){
                var del_flag = (data_obj.del_flag===undefined) ? false : data_obj.del_flag;
                var md = data_obj.mapped_data;
                for(var this_set in md){
                    if(md[this_set].map !== undefined){
                        this.setCache(md[this_set], {"set_name": this_set, "del_flag" : del_flag});
                    }
                }
                $.navHandler.refreshContext(md);
            }
        },
        /**
         * This merges the two sets together, removing duplicates from the old set and inserting the new set.
         * @param data_array(array) The new data to merge into the cache.
         * @param curr_set(array) The current data to update.
         * @return array The resulting updated array.
         */
        updateMerge : function(data_array, curr_set){
            var result_array = [];
            var new_set = data_array.data;
            for(var j=0, len_j=curr_set.data.length; j<len_j; j+=1){
                var n = curr_set.data[j];
                if(n!==null){
                    for(var i=0, len=new_set.length; i<len; i+=1){
                        var m = new_set[i];
                        if(m[0] === n[0]){
                            result_array.push(m);
                            new_set.splice(i,1);
                            n=false;
                            break;
                        }
                    }
                    if(n){
                        result_array.push(n);
                    }
                }
            }
            result_array = new_set.concat(result_array);
            var return_obj = {
                data: result_array,
                map: data_array.map
            }
            return return_obj;
        },
        hydrate : function(data_set, map_obj){
            var curr_obj = {};
            for(var this_prop in map_obj){
                if(typeof(map_obj[this_prop])==="number"){
                    curr_obj[this_prop] = data_set[map_obj[this_prop]];
                }
            }
            return curr_obj;
        },
        /**
         * This will accept a map data set and filter options.
         * @param data_obj(object) This is map_data:{map,data}
         * @param options(object) filter_by:[{field,rel,value}]
         * @return array Hydrated data object array (field names as properties)
         */
        mapDataFilter : function(data_obj, options){
            function sort(data_set, options){
                var result_array = [];
                if(options.sort_by!==undefined && options.sort_by.length!==undefined && data_set.length>0){
                    var sort_array = options.sort_by;
                    result_array.push(data_set[0]);
                    var lenk = sort_array.length;
                    for(var i=1, len=data_set.length; i<len; i+=1){
                        var new_array=data_set[i];
                        var dn_set = false;
                        for(var j=0, lenj=result_array.length; j<lenj; j+=1){
                            var old_array=result_array[j];
                            for(var k=0; k<lenk; k+=1){
                                if(old_array[sort_array[k]]>new_array[sort_array[k]]){
                                    dn_set = true;
                                    k=lenk;
                                } else if(old_array[sort_array[k]]<new_array[sort_array[k]]){
                                    k=lenk;
                                } 
                            }
                            if(dn_set){
                                result_array.splice(j,0,new_array);
                                j=lenj;
                            } else if(lenj===j+1){
                                result_array = result_array.concat(new_array);
                            }
                        }
                    }
                } else {
                    result_array = data_set;
                }
                return result_array;
            }
            function filter(data_set, map_obj, filter_obj){
                var result_data = data_set;
                if(filter_obj!==undefined && filter_obj.length!==undefined){
                    result_data = false;
                    for(var i=0, len=filter_obj.length; i<len; i+=1){
                        var f=filter_obj[i];
                        for(var j=0, lenj=f.length; j<lenj; j+=1){
                            var data_val = data_set[map_obj[f[j].field]];
                            if(compare[f[j].rel](data_val, f[j].value)){
                                result_data = true;
                            } else {
                                result_data = false;
                                j=lenj;
                            }
                        }
                        if(result_data){
                            result_data = data_set;
                            i=len;
                        }
                    }
                } 
                return result_data;
            }
            var compare = {
                eq : function(dval, fval){
                    return (dval===fval);
                },
                neq : function(dval, fval){
                    return (dval!==fval);
                },
                lt : function(dval, fval){
                    var result = dval*1<fval*1
                    return (result);
                },
                lteq : function(dval, fval){
                    return (dval<=fval);
                },
                gt : function(dval, fval){
                    var result = dval*1>fval*1
                    return (result);
                },
                gteq : function(dval, fval){
                    return (dval>=fval);
                },
                //Self-equality for the data set.
                seq : function(dval,fval){
                    return (dval===data_set[map_obj[fval]]);
                }
            }
            var result_array = [];
            if(data_obj.data!==undefined && data_obj.data.length!==undefined){
                var limit = (options.limit===undefined) ? data_obj.data.length : options.limit;
                for(var i=0, len=data_obj.data.length; i<len; i+=1){
                    var data_set = data_obj.data[i];
                    var map_obj = data_obj.map
                    if(filter(data_set, map_obj, options.filter_by)){
                        result_array.push(this.hydrate(data_set, data_obj.map));
                        if(result_array.length>=limit){
                            i=len;
                        }
                    }
                }
                result_array = sort(result_array, options);
            }
            return result_array;
        },
        getCache : function(set_name){
            var cached_array = $('#system_cache').data(set_name);
            if(cached_array===undefined || cached_array.data === undefined){
                cached_array = [];
            } 
            return cached_array;
        },
        setCache : function(data_array, options){
            var curr_set = $('#system_cache').data(options.set_name);
            //Check to make sure that it is not an empty set before merging and saving.
            if(data_array.map !== undefined
            && data_array.map.length === undefined
            && data_array.data !== undefined
            && data_array.data.length>0){
                //If it is user_perm, just save it, do not merge.
                if(curr_set !== undefined && options.set_name!=="user_perm" && options.del_flag===false){
                    data_array = this.updateMerge(data_array, curr_set);
                }
                $('#system_cache').data(options.set_name, data_array);
                if(options.set_name==="dic"){
                    data_array = $.dataCache.get({set_name:"dic"});
                    this.setDic(data_array, options);
                }
            }
        },
        setDic : function(data_array, options){
            var iso_code = $.cookie('iso_code');
            if(sampiDic===undefined){
                sampiDic = {};
            }
            var temp_dic = sampiDic;
            if(data_array.length>0){
                for(var i=0, len=data_array.length; i<len; i+=1){
                    if(temp_dic[data_array[i].iso_code]===undefined){
                        temp_dic[data_array[i].iso_code]={};
                    }
                    temp_dic[data_array[i].iso_code][data_array[i].term_name]= data_array[i].value;
                    if(data_array[i].iso_code=== iso_code 
                        || (data_array[i].iso_code==='en' 
                            && (temp_dic[iso_code]===undefined || temp_dic[iso_code][data_array[i].term_name]===undefined)
                        )){
                        temp_dic[data_array[i].term_name]= data_array[i].value;
                    }
                }
            }
            sampiDic = temp_dic;
        }
    };
})(jQuery);

