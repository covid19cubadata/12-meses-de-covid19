var chart_d,
regionColors = {
    'Pinar del Río': "#00553d",
    'Artemisa': "#fe0002",
    'La Habana': "#020085",
    'Mayabeque': "#940000",
    'Matanzas': "#e36d70",
    'Cienfuegos': "#00a261",
    'Villa Clara': "#ff7a13",
    'Sancti Spíritus': "#fe6515",
    'Ciego de Ávila': "#008dd0",
    'Camagüey': "#003060",
    'Las Tunas': "#009c55",
    'Holguín': "#007fc6",
    'Granma': "#0b4ca0",
    'Santiago de Cuba': "#ef242a",
    'Guantánamo': "#515a57",
    'Isla de la Juventud': "#38b396"
},
startDate = '03/11/2020',
endDateD = '03/11/2020'

function getDate(data){
    var text = data.split(/\r\n|\n/);
    var columns = text[0].split(',');
    var text_date = columns[columns.length - 1]
    var date = text_date.split("_")[0];
    console.log(date);
    return date;
}

JSC.fetch('data/province_deceases.csv')
  .then(function(response) {
      return response.text();
  }) 
  .then(function(text) {
      endDateD = getDate(text);
      var data = JSC.csv2Json(text); 
      chart_d = renderChart_d(data); 
  }) 
  .catch(function(error) { 
      console.error(error); 
  }); 

function renderChart_d(data) { 
  var stopped = true, 
      timer, 
      frameDelay = 5, 
      currentDate = startDate; 
return JSC.chart( 
    'deceases_bar_race',
    { 
    type: 'horizontal column solid', 
    // Controls the speed of the animation and the chart. 
    animation: { duration: 70 },
    margin_right: 30, 
    yAxis: { 
        // Lock the scale minimum at 0 and use 10% padding (of data) for max. 
        scale_range: { padding: 0.1, min: 0 }, 
        // on top. 
        orientation: 'opposite', 
        // Dont make room for tick labels overflow. The chart level margin_right: 30, setting will ensure there is enough space for them. 
        overflow: 'hidden'
    }, 
    xAxis: { 
        // Hide x axis ticks (vertical axis on horizontal chart) 
        defaultTick_enabled: false, 
        scale: { invert: true }, 
        alternateGridFill: 'none'
    }, 
    title: { 
        position: 'center', 
        label: { 
        margin_bottom: 40, 
        text: ''
        } 
    }, 
    annotations: [ 
        { 
        id: 'year',
        label: { 
            text: formatAnnotation_d(new Date(startDate))
        }, 
        position: 'inside right'
        } 
    ],

    defaultPoint: { 
        label_text: '%id: <b>%yvalue</b>'
    }, 
    defaultSeries: { 
        legendEntry_visible: false, 
        mouseTracking_enabled: false
    }, 
    series: makeSeries_d(data), 
    toolbar: { 
        defaultItem: { 
        position: 'inside top', 
        offset: '0,-65', 
        boxVisible: false, 
        margin: 6 
        }, 
        items: {
        startLabel: { 
            type: 'label', 
            label_text: new Date(startDate).getFullYear() + ''
        }, 
        slider: { 
            type: 'range', 
            width: 300, 
            // Reduce chart update frequency to smooth slider action. 
            debounce: 20, 
            value: new Date(startDate).getTime(), 
            min: new Date(startDate).getTime(), 
            max: new Date(endDateD).getTime(), 
            events_change: function(val) { 
            // Update chart 
            moveSlider_d(val); 
            // Stop playback if manually handling the slider. 
            playPause_d(true); 
            } 
        },
        endLabel: { 
            type: 'label', 
            label_text: new Date(endDateD).getFullYear() + ''
        }, 
        Pause: { 
            type: 'option', 
            value: false, 
            // Lock width so that it doesnt change when changing between Play and Pause 
            width: 50, 
            margin: [6, 6, 6, 16], 
            label_text: 'Play', 
            icon_name: 'system/default/play',
            events_change: function(val) { 
            playPause_d(!stopped); 
            } 
        } 
        } 
    } 
    }, 
    function(c) { 
    // Start the animation once the chart is rendered. 
    playPause_d(true, c); 
    } 
); 

function makeSeries_d(data) { 
    var dateStr = currentDate + '_date'; 
    data.sort(function(a, b) { 
    return b[dateStr] - a[dateStr]; 
    }); 
    return JSC.nest() 
    .key('state') 
    .pointRollup(function(key, val) { 
        var value = val[0]; 
        return { 
        x: data.indexOf(value), 
        id: key, 
        y: value[dateStr], 
        color: regionColors[value.region] 
        }; 
    }) 
    .series(data); 
} 
        
function moveSlider_d(date, cb) { 
    var dt = new Date(date); 
    currentDate = JSC.formatDate( 
    new Date( 
        dt.getFullYear(), 
        dt.getMonth(), 
        dt.getDate()
    ), 
    'MM/dd/yyyy'
    ); 

    // Update chart label and slider 
    chart_d 
    .annotations('year')
    .options( 
        { label_text: formatAnnotation_d(dt) }, 
        { animation_duration: 0 } 
    ); 
    chart_d 
    .uiItems('slider') 
    .options({ value: dt.getTime() }); 

    // Update points. The then: cb update option will execute the callback once the animation is finished. 
    chart_d 
    .series(0)
    .options(
        { points: makeSeries_d(data)[0].points },
        { then: cb }
    ); 
} 

function animateChart_d() { 
    if (!stopped) { 
    timer = setTimeout(function() { 
        var dt = new Date(currentDate); 
        currentDate = dt.setDate(dt.getDate() + 1); 
        if (currentDate >= new Date(endDateD).getTime()) { 
            clearInterval(timer); 
        currentDate = endDateD; 
        chart_d 
            .uiItems('slider') 
            .options({ 
            value: new Date( 
                currentDate 
            ).getTime() 
            }); 
        playPause_d(true); 
        } 
        moveSlider_d(currentDate, animateChart_d); 
    }, frameDelay); 
    } 
} 

function playPause_d(val, chrt) { 
    var c = chrt || chart_d; 
    if (val) { 
    if (!stopped) { 
        // Stop 
        c.uiItems('Pause').options({ 
            label_text: 'Play', 
            icon_name: 'system/default/play'
        }); 
        clearInterval(timer); 
        stopped = true; 
    } 
    } else { 
    if (stopped) { 
        // Play 
        c.uiItems('Pause').options({ 
            label_text: 'Pause', 
            icon_name: 'system/default/pause'
        }); 
        stopped = false; 
        animateChart_d(); 
    } 
    } 
} 

function formatAnnotation_d(dt) { 
    var year = dt.getFullYear();
    var options = {year: "numeric", month: "short", day: "numeric"};
    var day = dt.toLocaleDateString("es-ES", options); 
    return ( 
    '<span style="font-size:20px; font-weight:bold; width:160px">' + day +
    '</span><br>' +
    '<br>Fallecidos:<br><span align="center" style="font-size:24px; font-weight:bold; width:180px">{%sum:n0}</span>'
    ); 
} 
}