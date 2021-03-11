var maleCases = ['Hombres', 30102];
var femaleCases = ['Mujeres', 28277];
var casesColors = {
    'Hombres': '#B01E22',
    'Mujeres': '#1C1340'
};

function buildSexsPie() {
    c3.generate({
        bindto: '#sexPie',
        data: {
            type: 'pie',
            columns: [maleCases, femaleCases],
            colors: casesColors
        },
    });
};

buildSexsPie();
