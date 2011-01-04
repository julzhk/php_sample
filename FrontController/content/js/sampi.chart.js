//NAMESPACES
(function($) {
//Creates a namespace for the static reference materials
    $.viewS.sparkline = function(target_data, target_id){
        var options = $.dataSet.processStatusToBdBu(target_data);
        $.jqplot(target_id, [options.baseline,options.peakline,options.myvalues,options.cum_work], {
            gridPadding: {top:0, right:0, bottom:0, left:0},
            axes: {
                xaxis: {
                    renderer:$.jqplot.DateAxisRenderer,
                    showTicks: false,
                    showTickMarks: false
                },
                yaxis: {
                    showTicks: false
                    , showTickMarks: false
                    , autoscale: true
                }
            },
            title: {
                text: '',   // title for the plot,
                show: false
            },
            series: [{
                lineWidth: 1,
                color: '#fffdf6',
                markerOptions: {
                    show: false,             // wether to show data point markers.
                    style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                            // filledDiamond or filledSquare.
                    lineWidth: .5,       // width of the stroke drawing the marker.
                    size: 2,            // size (diameter, edge length, etc.) of the marker.
                    color: '#666666',    // color of marker, set to color of line by default.
                    shadow: false       // wether to draw shadow on marker or not.
                    }
                },
                {
                lineWidth: 1,
                color: '#fffdf6',
                markerOptions: {
                    show: false,             // wether to show data point markers.
                    style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                            // filledDiamond or filledSquare.
                    lineWidth: .5,       // width of the stroke drawing the marker.
                    size: 2,            // size (diameter, edge length, etc.) of the marker.
                    color: '#333333',    // color of marker, set to color of line by default.
                    shadow: false       // wether to draw shadow on marker or not.
                    }
                },
                {
                lineWidth: 1.5,
                markerOptions: {
                    show: true,             // wether to show data point markers.
                    style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                            // filledDiamond or filledSquare.
                    lineWidth: .5,       // width of the stroke drawing the marker.
                    size: 2,            // size (diameter, edge length, etc.) of the marker.
                    color: '#666666',    // color of marker, set to color of line by default.
                    shadow: false       // wether to draw shadow on marker or not.
                    }
                },
                {
                lineWidth: 1.5,
                markerOptions: {
                    show: true,             // wether to show data point markers.
                    style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                            // filledDiamond or filledSquare.
                    lineWidth: .5,       // width of the stroke drawing the marker.
                    size: 2,            // size (diameter, edge length, etc.) of the marker.
                    color: '#333333',    // color of marker, set to color of line by default.
                    shadow: false       // wether to draw shadow on marker or not.
                    }
                }
            ],
            grid: {
                drawGridLines: false,
                gridLineColor: '#fffdf6',    // **Color of the grid lines.
                background: '#fffdf6',      // CSS color spec for background color of grid.
                borderColor: '#fffdf6',     // CSS color spec for border around grid.
                borderWidth: 1,
                shadow: false
            }
        });
    }
    $.viewS.sparklineDetail = function(target_data, target_id){
        var options = $.dataSet.processStatusToBdBu(target_data);
        if(options.max_est*2<options.cum_max*1 || options.cum_max*2<options.max_est*1){
            options.chart = {
                axesDefaults:{useSeriesColor: true},
                grid:{gridLineWidth:1.0, borderWidth:2.5, shadow:false},
                title: {
                    text: '',   // title for the plot,
                    show: false
                },
                legend: {
                    show: true,
                    location: 'nw',     // compass direction, nw, n, ne, e, se, s, sw, w.
                    xoffset: 24,        // pixel offset of the legend box from the x (or x2) axis.
                    yoffset: 24       // pixel offset of the legend box from the y (or y2) axis.
                },
                series: [{
                        label: sampiDic.hours_remain,
                        lineWidth: 1.5,
                        markerOptions: {

                            show: true,             // wether to show data point markers.
                            style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                                    // filledDiamond or filledSquare.
                            lineWidth: .5,       // width of the stroke drawing the marker.
                            size: 2,            // size (diameter, edge length, etc.) of the marker.
                            color: '#666666',    // color of marker, set to color of line by default.
                            shadow: false       // wether to draw shadow on marker or not.
                        }
                    },
                    {
                        yaxis:'y2axis',
                        label:sampiDic.hours_worked,
                        lineWidth: 1.5,
                        markerOptions: {
                            show: true,             // wether to show data point markers.
                            style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                                    // filledDiamond or filledSquare.
                            lineWidth: .5,       // width of the stroke drawing the marker.
                            size: 2,            // size (diameter, edge length, etc.) of the marker.
                            color: '#333333',    // color of marker, set to color of line by default.
                            shadow: false       // wether to draw shadow on marker or not.
                        }
                    }
                ],
                axes:{
                    xaxis:{renderer:$.jqplot.DateAxisRenderer, pad:1.05, tickOptions:{formatString:'%d-%m-%y'}},
                    yaxis:{
                        pad:1.05
                        , min:-0.01
                        , autoscale: true
                    },
                    y2axis:{
                        pad:1.05
                        , min:-0.01
                        , autoscale: true
                    }
                }
            }
        } else {
            options.chart = {
                axesDefaults:{useSeriesColor: true},
                grid:{gridLineWidth:1.0, borderWidth:2.5, shadow:false},
                title: {
                    text: '',   // title for the plot,
                    show: false
                },
                legend: {
                    show: true,
                    location: 'nw',     // compass direction, nw, n, ne, e, se, s, sw, w.
                    xoffset: 24,        // pixel offset of the legend box from the x (or x2) axis.
                    yoffset: 24       // pixel offset of the legend box from the y (or y2) axis.
                },
                series: [{
                        label: sampiDic.hours_remain,
                        lineWidth: 1.5,
                        markerOptions: {
                            show: true,             // wether to show data point markers.
                            style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                                    // filledDiamond or filledSquare.
                            lineWidth: .5,       // width of the stroke drawing the marker.
                            size: 2,            // size (diameter, edge length, etc.) of the marker.
                            color: '#666666',    // color of marker, set to color of line by default.
                            shadow: false       // wether to draw shadow on marker or not.
                        }
                    },
                    {
                        label:sampiDic.hours_worked,
                        lineWidth: 1.5,
                        markerOptions: {
                            show: true,             // wether to show data point markers.
                            style: 'filledCircle',  // circle, diamond, square, filledCircle.
                                                    // filledDiamond or filledSquare.
                            lineWidth: .5,       // width of the stroke drawing the marker.
                            size: 2,            // size (diameter, edge length, etc.) of the marker.
                            color: '#333333',    // color of marker, set to color of line by default.
                            shadow: false       // wether to draw shadow on marker or not.
                        }
                    }
                ],
                axes:{
                    xaxis:{renderer:$.jqplot.DateAxisRenderer
                        , pad:1.05
                        , tickOptions:{formatString:'%d-%m-%y'}},
                    yaxis:{pad:1.05, min:-0.01}
                }
            }
        }

        $.jqplot(target_id, [options.myvalues,options.cum_work], options.chart);
    }
})(jQuery);