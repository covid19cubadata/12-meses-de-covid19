c3.generate({
  bindto: '#daily-acthome-info1',
  data: {
    x: datesImported[0],
    columns: [datesImported, dailyActive, dailyImported],
    axes: {
      'Casos activos': 'y',
      'Casos importados en el día': 'y2',
    },
    type: 'area',
    types: {
      'Casos activos': 'line',
    },
    groups: [['Casos activos'], ['Casos importados en el día']],
    colors: {
      'Casos activos': '#B01E22',
      'Casos importados en el día': '#1C1340',
    },
  },
  axis: {
    x: {
      label: 'Fecha',
      type: 'categorical',
      tick: {
        values: [0, datesImported.length / 2, datesImported.length - 2],
      },
      padding: {
        left: 2,
        right: 4,
      },
    },
    y: {
      label: 'Casos activos',
      position: 'outer-middle',
    },
    y2: {
      show: true,
      label: 'Casos importados en el día',
      position: 'outer-middle',
    },
    tooltip: {
      format: {
        title: function (d) {
          return 'Data ' + d;
        },
        value: function (value, ratio, id) {
          var format = id === 'data1' ? d3.format(',') : d3.format('$');
          return format(value);
        },
        //            value: d3.format(',') // apply this format to both y and y2
      },
    },
  },
});
