var allDeceasesDataEnabled = false;
var allDeceasesData = [];
var minX = 0.00020
var minY = 0.020

function pointColor(points) {
    pointBackgroundColors = [];
    for (i = 0; i < points.length; i++) {
        if (points[i].name !== 'CUB') {
            pointBackgroundColors.push("#4789cc");
        } else {
            pointBackgroundColors.push("#cf9494");
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
                    // Disable the on-canvas tooltip
                    enabled: false,

                    custom: function (tooltipModel) {
                        // Tooltip Element
                        var tooltipEl = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table></table>';
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                            tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(getBody);

                            var innerHtml = '<thead>';

                            titleLines.forEach(function (title) {
                                innerHtml += "<tr><th><img src='/utils/flags/at.png' class='icon' /> " + title + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';

                            innerHtml += "<tr><td><img src='/utils/flags/at.png' class='icon' /></td></tr>";

                            bodyLines.forEach(function (body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.backgroundColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<span style="' + style + '"></span>';
                                innerHtml += '<tr><td>' + span + body + '</td></tr>';
                            });
                            innerHtml += '</tbody>';

                            console.log(innerHtml);

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        var position = this._chart.canvas.getBoundingClientRect();

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                        tooltipEl.style.pointerEvents = 'none';
                    },
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


