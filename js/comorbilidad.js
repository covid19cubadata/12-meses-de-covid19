var comorbilidad = [
  ['Hipertensión Arterial', 266],
  ['Diabetes Mellitus', 134],
  ['Cardiopatía Isquémica', 97],
  ['Enfermedad Pulmonar', 56],
  ['Insuficiencia Renal Crónica', 43],
  ['Obesidad', 25],
  ['demencia senil', 21],
  ['Enfermedad Cerebrovascular', 21],
];

var mrange = ['Enfermedades'];
var mfalle = ['Fallecidos'];

for (var i = 0; i < comorbilidad.length; i++) {
  mrange.push(comorbilidad[i][0]);
  mfalle.push(comorbilidad[i][1]);
}

c3.generate({
  bindto: '#comorbilidad',
  data: {
    x: mrange[0],
    columns: [mrange, mfalle],
    type: 'bar',
    colors: {
      Fallecidos: '#B01E22',
    },
  },
  legend: {
    show: false,
  },
  axis: {
    x: {
      label: {
        text: 'Enfermedades',
      },
      type: 'categorical',
      tick: {
        rotate: -45,
        multiline: false,
      },
      height: 120,
    },
    y: {
      label: 'Fallecidos',
      position: 'outer-middle',
    },
  },
});

comorbiliadad2 = [
  ['Ninguna', 11],
  ['1 Enfermedad', 57],
  ['2 Enfermedades', 103],
  ['3 Enfermedades', 100],
  ['4 Enfermedades', 68],
  ['5 Enfermedades', 19],
  ['6 Enfermedades', 3],
];

c3.generate({
  bindto: '#comorbilidad2',
  data: {
    columns: comorbiliadad2,
    type: 'pie',
    colors: {
      Ninguna: '#1A8323',
      '1 Enfermedad': '#B01E22',
      '2 Enfermedades': '#1C1340',
      '3 Enfermedades': '#CA9F31',
      '4 Enfermedades': '#00AEEF',
      '5 Enfermedades': '#939393',
    },
  },
  tooltip: {
    format: {
      value: function (value, r, id, index) {
        return value + ' (' + (r * 100).toFixed(2) + '%)';
      },
    },
  },
});
