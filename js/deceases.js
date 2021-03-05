var allDeceasesDataEnabled = false;
var allDeceasesData = [];
var minX = 0.00020
var minY = 0.020

function pointColor(points) {
    pointBackgroundColors = [];
    for (i = 0; i < points.length; i++) {
        if (points[i].name !== 'CUB') {
            pointBackgroundColors.push("#0062ff");
        } else {
            pointBackgroundColors.push("#c40000");
        }
    }
    return pointBackgroundColors;
}

function getDeceasesData() {
    

    $.getJSON('https://covid.ourworldindata.org/data/latest/owid-covid-latest.json', function (data) {
        'use-strict';

        function filter(region, values, acc) {
            var population = values["population"];
            var cases = values["total_cases"];
            var deaths = values["total_deaths"];
            var morthality = deaths !== 0 ? deaths / population : 0;
            var fatality = (deaths !== 0) || (cases !== 0) ? deaths / cases : 0;

            if (!region.includes("OWID") && deaths != null && cases != null) {
                acc.push({ 'name': region, 'x': morthality, 'y': fatality })
            }

        }

        Object.keys(data).forEach(key => filter(key, data[key], allDeceasesData));

        var ctx = document.getElementById('deceasesComparison');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: allDeceasesData,
                    pointBackgroundColor: pointColor(allDeceasesData)
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

        $("#deceasesComparison").click(
            function (evt) {
                allDeceasesDataEnabled = !allDeceasesDataEnabled;

                var newPoints = allDeceasesDataEnabled ? allDeceasesData.filter((x) => x.x < minX && x.y < minY) : allDeceasesData;

                var colors = pointColor(newPoints);

                scatterChart.data = {
                    datasets: [{
                        label: 'Scatter Dataset',
                        data: newPoints,
                        pointBackgroundColor: colors
                    }]
                };

                scatterChart.update();
            }
        );

    });
};

getDeceasesData();


