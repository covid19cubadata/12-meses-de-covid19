var maleCases = 30102;
var femaleCases = 28277;
var casesColors = [
    '#B01E22',
    '#1C1340'
];

function buildSexsPie() {
    var sexPieCtx = document.getElementById('sexPie').getContext('2d');
    console.log(sexPieCtx)
    var myPieChart = new Chart(sexPieCtx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [maleCases, femaleCases],
                backgroundColor: casesColors,
            }],
            labels: [
                'Hombres',
                'Mujeres'
            ],
        },
        options: {
            responsive: true
        }
    });
};

buildSexsPie();
