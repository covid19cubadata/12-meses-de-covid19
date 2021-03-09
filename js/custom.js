class ChartX {
    constructor() {
        this._dataRaw = undefined;
        this._data = undefined;
        this._x = undefined;
        this._active = undefined;
        this._daily = undefined;
        this._active_name = undefined;
        this._daily_name = undefined;
        this._active_total_name = undefined;
        this._daily_total_name = undefined;
        this._chart = undefined;
    }

    init = async function (id = undefined) {
        let dataRaw = await fetch('data/data.json');
        let data = await dataRaw.json();
        let x = ['x'].concat(data['date']['values']);
        let active = data['active']['values'];
        let accumulated = data['accumulated']['values'];
        let daily = data['daily']['values'];
        let active_name = 'Casos Activos';
        let daily_name = 'Casos Diarios';
        let active_total_name = 'Total Casos Activos';
        let daily_total_name = 'Todal Casos Diarios';
        let chart = c3.generate({
            size: {
                height: $(window).height() - $(window).height() * 0.15,
            },
            data: {
                x: 'x',
                columns: [
                    x,
                    [active_total_name].concat(active),
                    [daily_total_name].concat(daily),
                ],
                regions: {
                    [active_total_name]: [{ 'style': 'dashed' }],
                    [daily_total_name]: [{ 'style': 'dashed' }],
                },
                colors: {
                    [active_total_name]: 'gray',
                    [daily_total_name]: 'gray',
                    [active_name]: 'blue',
                    [daily_name]: 'red',
                },
                axes: {
                    [active_total_name]: 'y',
                    [daily_total_name]: 'y2',
                    [active_name]: 'y',
                    [daily_name]: 'y2',
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        count: x.length / 10,
                        format: '%m/%d',
                    },
                },
                y2: {
                    show: true,
                },
                rotated: true,
            },
            grid: {
                x: {
                    lines: [
                        // { value: '2020-09-17', text: 'Label 1' },
                    ]
                }
            },
            legend: {
                show: false,
            },
            tooltip: {
                show: false,
            },
            point: {
                // show: false,
            },
        });
        this._dataRaw = dataRaw;
        this._data = data;
        this._x = x;
        this._active = active;
        this._accumulated = accumulated;
        this._daily = daily;
        this._active_name = active_name;
        this._daily_name = daily_name;
        this._active_total_name = active_total_name;
        this._daily_total_name = daily_total_name;
        this._chart = chart;
        if (id !== undefined) {
            this.goToPercent(0, id);
        }
        return chart;
    }

    goToPercent(percent, id = undefined) {
        if (percent < 0 || percent > 100) {
            console.error('Percent should be between 0 and 100');
        } else {
            d3.selectAll(".c3-circle").style("opacity", function (d) {
                // return d.value === 100 ? 1 : 0;
                console.log("#########################");
                return 1;
            })
            let index = parseInt(this._active.length * percent / 100, 10);
            index = Math.max(1, index);
            let active = this._active.slice(0, Math.max(Math.min(index, this._active.length), 0));
            let daily = this._daily.slice(0, Math.max(Math.min(index, this._daily.length), 0));
            let today_date = this._x.slice(index, index + 1)[0];
            let today_active = this._active.slice(index, index + 1)[0];
            let today_accumulated = this._accumulated.slice(index, index + 1)[0];
            let today_daily = this._daily.slice(index, index + 1)[0];
            this._chart.load({
                columns: [
                    [this._active_name].concat(active),
                    [this._daily_name].concat(daily),
                ],
                unload: chart.columns,
            });
            let json = [
                ['Fecha', today_date],
                ['Activos', today_active],
                ['Acumulados', today_accumulated],
                ['Diarios', today_daily],
            ];
            if (id !== undefined) {
                let html = '';
                for (let i = 0; i < json.length; i += 2) {
                    if (i + 1 < json.length) {
                        html += `<div><span class="m-1">${json[i][0]}: ${json[i][1]}</span><span class="m-1">${json[i + 1][0]}: ${json[i + 1][1]}</span></div>`
                    } else {
                        html += `<div><span class="m-1">${json[i][0]}: ${json[i][1]}</span></div>`
                    }
                }
                // json.forEach(item => {
                //     html += `<span class="m-1">${item[0]}: ${item[1]}</span>`
                // });
                console.log(html);
                document.getElementById(id).innerHTML = html;
            }
            return json;
        }
    }
}

class GoogleChart {
    constructor() {
        this._dataRaw = undefined;
        this._data = undefined;
        this._x = undefined;
        this._active = undefined;
        this._daily = undefined;
        this._active_name = undefined;
        this._daily_name = undefined;
        this._active_total_name = undefined;
        this._daily_total_name = undefined;
        this._config = undefined;
        this._chart = undefined;
    }

    getChart = async function (ctx, id = undefined) {
        let dataRaw = await fetch('data/data.json');
        let data = await dataRaw.json();
        let x = data['date']['values'];
        let active = data['active']['values'];
        let accumulated = data['accumulated']['values'];
        let daily = data['daily']['values'];
        let active_name = 'Casos Activos';
        let daily_name = 'Casos Diarios';
        let active_total_name = 'Total Casos Activos';
        let daily_total_name = 'Todal Casos Diarios';
        let config = {
            type: 'line',
            data: {
                labels: x.map(d => d.split('-')[2] + '/' + d.split('-')[1]),
                datasets: [{
                    label: daily_name,
                    backgroundColor: "red",
                    borderColor: "red",
                    fill: false,
                    data: [],
                }, {
                    label: daily_total_name,
                    backgroundColor: "grey",
                    borderColor: "grey",
                    fill: false,
                    data: daily,
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                maintainAspectRatio: false,
                elements: { line: { tension: 0 } },
                animation: { duration: 0 },
                hover: { animationDuration: 0 },
                responsiveAnimationDuration: 0,
                responsive: true,
                title: { display: false },
                showPoints: false,
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: { display: false },
                        gridLines: { display: false }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: daily_name
                        },
                        gridLines: { display: false }
                    }]
                }
            }
        };
        let chart = new Chart(ctx, config);
        this._dataRaw = dataRaw;
        this._data = data;
        this._x = x;
        this._active = active;
        this._accumulated = accumulated;
        this._daily = daily;
        this._active_name = active_name;
        this._daily_name = daily_name;
        this._active_total_name = active_total_name;
        this._daily_total_name = daily_total_name;
        this._config = config;
        this._chart = chart;
        if (id !== undefined) {
            this.goToPercent(0, id);
        }
        return chart;
    }

    goToPercent(percent, id = undefined) {
        if (percent < 0 || percent > 100) {
            console.error('Percent should be between 0 and 100');
        } else {
            let index = parseInt(this._active.length * percent / 100, 10);
            let active = this._active.slice(0, Math.max(Math.min(index, this._active.length), 0));
            let daily = this._daily.slice(0, Math.max(Math.min(index, this._daily.length), 0));
            index = Math.min(index, this._daily.length - 1);
            let today_date = this._x.slice(index, index + 1)[0];
            let today_active = this._active.slice(index, index + 1)[0];
            let today_accumulated = this._accumulated.slice(index, index + 1)[0];
            let today_daily = this._daily.slice(index, index + 1)[0];
            let dataset = this._config.data.datasets[0];
            dataset.data = daily;
            this._chart.update();
            let json = [
                ['Fecha', today_date],
                ['Activos', today_active],
                ['Acumulados', today_accumulated],
                ['Diarios', today_daily],
            ];
            if (id !== undefined) {
                let html = '';
                for (let i = 0; i < json.length; i += 2) {
                    if (i + 1 < json.length) {
                        html += `<div><span class="m-1">${json[i][0]}: ${json[i][1]}</span><span class="m-1">${json[i + 1][0]}: ${json[i + 1][1]}</span></div>`
                    } else {
                        html += `<div><span class="m-1">${json[i][0]}: ${json[i][1]}</span></div>`
                    }
                }
                // console.log(html);
                document.getElementById(id).innerHTML = html;
            }
            return json;
        }
    }
}

window.onload = async function () {
    let ctx = document.getElementById('canvas').getContext('2d');
    let main = d3.select('main');
    let scrolly = main.select('#scrolly');
    let figure = scrolly.select('figure');
    let article = scrolly.select('article');
    let step = article.selectAll('.step');

    // initialize the scrollama
    let scroller = scrollama();

    // generic window resize listener event
    function handleResize(chartx) {
        // 1. update height of step elements
        // let stepH = Math.floor(window.innerHeight * 0.15);
        // step.style('height', stepH + 'px');

        let figureHeight = window.innerHeight * 0.85;
        let figureMarginTop = 0;

        figure
            .style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');

        chartx._chart.resize();

        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response, charx) {
        // console.log(response);
        // response = { element, direction, index }

        // add color to current step only
        step.classed('is-active', function (d, i) {
            return i === response.index;
        });

        let percent = response.index * 100 / 18;
        charx.goToPercent(percent, 'legends');
    }

    function setupStickyfill() {
        d3.selectAll('.sticky').each(function () {
            Stickyfill.add(this);
        });
    }

    async function init() {
        Chart.defaults.global.tooltips.enabled = false;
        // Chart.defaults.global.elements.point.radius = 0;
        // Chart.defaults.global.elements.line.borderWidth = 10;
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.title.display = false;
        let chart = new GoogleChart();
        await chart.getChart(ctx, 'legends');
        setupStickyfill();
        handleResize(chart);
        scroller
            .setup({
                step: '#scrolly article .step',
                offset: 0.95,
                debug: true,
            })
            .onStepEnter(response => handleStepEnter(response, chart));
        window.addEventListener('resize', () => handleResize(chart));
    }

    init();

};

