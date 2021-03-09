var allDeceasesDataEnabled = false;
var allDeceasesData = [];
var minX = 1;
var minY = 1;
var cubaColour = "#eb3323";
var americaColour = "#f7c88a";
var africaColour = "#9be48b";
var oceaniaColour = "#fffd92";
var europeColour = "#d387e7";
var asiaColour = "#8783e3";
var neutralColour = "D1D2D4";

function pointColor(points) {
    pointBackgroundColors = [];
    for (i = 0; i < points.length; i++) {
        if (points[i].name === 'Cuba') {
            pointBackgroundColors.push(cubaColour);
        } else {
            switch(points[i].continent){
                case "Africa":
                    pointBackgroundColors.push(africaColour);
                    break;
                case "Asia":
                    pointBackgroundColors.push(asiaColour);
                    break;
                case "Europe":
                    pointBackgroundColors.push(europeColour);
                    break;
                case "Oceania":
                    pointBackgroundColors.push(oceaniaColour);
                    break;
                case "North America":
                    pointBackgroundColors.push(americaColour);
                    break;
                case "South America":
                    pointBackgroundColors.push(americaColour);
                    break;
                default:
                    pointBackgroundColors.push(neutralColour);
            }
        }
    }
    return pointBackgroundColors;
}

function getDeceasesData() {


    $.getJSON('data/codes-countries.json', function (data) {
        'use-strict';

        function filter(region, values, acc) {
            var code = values["alpha2"];
            var name = values["name"];
            var population = values["population"];
            var continent = values['continent'];
            var cases = values["total_cases"];
            var deaths = values["total_deaths"];
            var morthality = deaths !== 0 ? (deaths / population ) * 10000 : 0;
            var fatality = (deaths !== 0) || (cases !== 0) ? (deaths / cases) * 100 : 0;
            morthality = Math.round(morthality * 100)/100;
            fatality = Math.round(fatality * 100)/100;

            if (!region.includes("OWID") && deaths != null && cases != null && deaths != 0) {
                acc.push({ 'name': name, 'code': code, 'x': morthality, 'y': fatality, 'continent': continent })
            }

        }

        Object.keys(data).forEach(key => filter(key, data[key], allDeceasesData));

        var ctx = document.getElementById('deceasesComparison');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',

            data: {
                datasets: [{
                    data: allDeceasesData,
                    pointBackgroundColor: pointColor(allDeceasesData)
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Letalidad vs mortalidad por países'
                },
                legend: {
                    display: true
                },        
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Mortalidad ( % por millón de habitantes )',
                            type: 'linear',
                            position: 'bottom'
                          }
                    }],
                    yAxes: [{
                        scaleLabel: {
                          display: true,
                          labelString: 'Letalidad ( % )'
                        }
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

                            try {
                                var code = titleLines[0];
                                var title = titleLines[1];

                                if(code !== undefined && code != "")
                                {
                                    innerHtml += `<tr><th><img src='/data/flags/${code}.png' class='icon' /> ` + title + '</th></tr>';
                                }
                                else{
                                    innerHtml += '<tr><th>' + title + '</th></tr>';
                                }
                            }
                            catch (error) 
                            {
                                innerHtml += '<tr><th>' + title + '</th></tr>';
                            }

                            innerHtml += '</thead><tbody>';

                            bodyLines.forEach(function (body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.backgroundColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<span style="' + style + '"></span>';
                                innerHtml += '<tr><td>' + span + 'Letalidad: ' + body[0] + '</td></tr>';
                                innerHtml += '<tr><td>' + span + 'Mortalidad: ' + body[1] + '</td></tr>';
                            });
                            innerHtml += '</tbody>';

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
                                all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].code,
                                all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name
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


