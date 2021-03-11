

function getForeignAndNaviteData() {


    $.getJSON('data/foreignvsnatives.json', function (data) {
        'use-strict'; 

        dates = ['Fecha'];
        percentImported = ['% de casos importados en el día'];
		percentNotImported = ['% de casos no importados en el día'];

        Object.keys(data).forEach(function(day, index){
            var nI = data[day]['not imported'];
            var I = data[day]['imported'];
            var total = nI + I;
            
            dates.push(day);
            if(total === 0){
                percentImported.push(null);
                percentNotImported.push(null);
            }
            else{
                
                var pI = (I * 100/total).toFixed(2);
                var pNI = 100;
      
                percentImported.push(pI);
                percentNotImported.push(pNI);
            }    
            
        });

        c3.generate({
            bindto: "#daily-acthome-info",
            data: {
                x: dates[0],
                columns: [
                    dates,
                    percentNotImported,
                    percentImported
                ],
                type: 'area',
                colors: {
                    '% de casos importados en el día': '#1c1340',
                    '% de casos no importados en el día': '#b01e22'
                }
            },
            axis: {
                x: {
                    label: 'Fecha',
                    type: 'categorical',
                    tick: {
                        values: [0,dates.length/2,dates.length-2]
                    },
                    padding: {
                        left: 2,
                        right: 4
                    }
                },
                y: {
                    label: 'Casos',
                    position: 'outer-middle'
                }
            },
            grid: {
                x: {
                    lines: [
                        { 'value': '03/24', 'text': 'Cierre de fronteras' },
                        { 'value': '10/12', 'text': 'Apertura de aeropuertos fuera de La Habana' },
                        { 'value': '11/15', 'text': 'Apertura del Aeropuerto Internacional José Martí'},
                        { 'value': '01/01', 'text': 'Limitación de vuelos'},
                        { 'value': '01/10', 'text': 'Exigencia de PCR a la entrada al país'},
                        { 'value': '01/30', 'text': 'Nueva limitación de vuelos'}

                    ]
                }
            },
            tooltip: {
                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var $$ = this, config = $$.config,
                        titleFormat = config.tooltip_format_title || defaultTitleFormat,
                        nameFormat = config.tooltip_format_name || function (name) { return name; },
                        valueFormat = config.tooltip_format_value || defaultValueFormat,
                        text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {
                        if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }
          
                        if (! text) {
                            title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                            text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                        }
          
                        name = nameFormat(d[i].name);
                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

                        if(i === 0){
                            value2 = valueFormat(d[1].value, d[1].ratio, d[1].id, d[1].index);
                            value = 100 - value2;
                        }
          
                        text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                        text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                        text += "<td class='value'>" + value + "</td>";
                        text += "</tr>";
                    }
                    return text + "</table>";
                }
            }
        });

    }); 
}

getForeignAndNaviteData();