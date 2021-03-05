$.getJSON('https://covid.ourworldindata.org/data/latest/owid-covid-latest.json', function (data) {
    'use-strict';

    function filter(region, values, acc) {
        let population = values["population"];
        let cases = values["total_cases"];
        let deaths = values["total_deaths"];
        let morthality = deaths !== 0 ? deaths / population : 0;
        let fatality = (deaths !== 0) || (cases !== 0) ? deaths / cases : 0;

        if (!region.includes("OWID") && deaths != null && cases != null) {
            acc.push({ 'name': region, 'x': morthality, 'y': fatality })
        }

    }

    let acc = [];

    Object.keys(data).forEach(key => filter(key, data[key], acc));

    var ctx = document.getElementById('deceasesComparison');

    pointBackgroundColors = [];

    var scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Scatter Dataset',
                data: acc,
                pointBackgroundColor: pointBackgroundColors
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, all) {
                        return [
                            all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name,
                        ]
                    },
                    label: function (tooltipItem, all) {
                        return [
                            tooltipItem.value,
                            tooltipItem.label
                        ]
                    }
                }
            }
        }
    });

    for (i = 0; i < scatterChart.data.datasets[0].data.length; i++) {
        if (scatterChart.data.datasets[0].data[i].name !== 'CUB') {
            pointBackgroundColors.push("#0062ff");
        } else {
            pointBackgroundColors.push("#c40000");
        }
    }

    scatterChart.update();

});
