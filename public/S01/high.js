$(function () {
    $('#container').highcharts({
        chart: {
            type: 'line',
            backgroundColor: '#010B6A',
            style: {
                fontFamily: 'monospace',
                color: "#fff"
            }
            // color:'#fff'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: ['13:57:05', '13:57:10', '13:57:15', '13:57:20', '13:57:25', '13:57:30', '13:57:35', 
            '13:57:40', '13:57:45', '13:57:50'],
            labels: {
                 style: {
                    color: '#fff',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels: {
                 style: {
                    color: '#fff',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    style: {
                    color: '#fff',
                    font: '11px Trebuchet MS, Verdana, sans-serif'
                }

                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '',
            color: 'orange',
            data: [0,0,0,1076.09,0,0,399.96,0,716.73,0]
        }, {
            name: '',
            color: 'yellow',
            data: [863.21,584.81,729.27,1487.94,945.49,117.69,1074.23,269.77,3756.49,878.98]
        }]
    });
});