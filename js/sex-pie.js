var maleCases = ['Hombres', 30481];
var femaleCases = ['Mujeres', 28676];
var casesColors = {
    'Hombres': '#1C1340',
    'Mujeres': '#B01E22'
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
