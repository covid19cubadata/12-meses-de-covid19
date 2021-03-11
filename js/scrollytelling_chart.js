class ScrollytellingChart {
    constructor(milestones, regions) {
        Chart.defaults.global.tooltips.enabled = false;
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.title.display = false;
        this._dataRaw = undefined;
        this._data = undefined;
        this._x = undefined;
        this._active = undefined;
        this._daily = undefined;
        this._deaths = undefined;
        this._active_name = undefined;
        this._daily_name = undefined;
        this._active_total_name = undefined;
        this._daily_total_name = undefined;
        this._config = undefined;
        this._chart = undefined;
        this._milestones = milestones;
        this._regions = [];
        for (let i = 0; i < regions.length; ++i) {
            let item = regions[i];
            let a = item[0];
            let b = item[1];
            let aYear = parseInt(a.split('/')[0]);
            let aMonth = parseInt(a.split('/')[1]) - 1;
            let aDay = parseInt(a.split('/')[2]);
            let aDate = new Date(aYear, aMonth, aDay);
            let bYear = parseInt(b.split('/')[0]);
            let bMonth = parseInt(b.split('/')[1]) - 1;
            let bDay = parseInt(b.split('/')[2]);
            let bDate = new Date(bYear, bMonth, bDay);
            this._regions.push([aDate, bDate]);
        }
        this._dates = [];
    }

    init = async function (ctx) {
        let dataRaw = await fetch('data/evolution_of_cases_by_days.json');
        let dataDeathsRaw = await fetch('data/evolution_of_deaths_by_days.json');
        let data = await dataRaw.json();
        let dataDeaths = await dataDeathsRaw.json();
        let x = data['date']['values'];
        this._dates = [];
        for (let i = 0; i < x.length; ++i) {
            let item = x[i];
            let itemYear = parseInt(item.split('/')[0]);
            let itemMonth = parseInt(item.split('/')[1]) - 1;
            let itemDay = parseInt(item.split('/')[2]);
            let itemDate = new Date(itemYear, itemMonth, itemDay);
            this._dates.push(itemDate);
        }
        let active = data['active']['values'];
        let accumulated = data['accumulated']['values'];
        let daily = data['daily']['values'];
        let deaths = dataDeaths['accumulated']['values'];
        let active_name = 'Casos Activos';
        let daily_name = 'Casos Diarios';
        let active_total_name = 'Total Casos Activos';
        let daily_total_name = 'Todal Casos Diarios';
        let config = {
            type: 'line',
            data: {
                labels: x.map(d => d.split('/')[2] + '/' + d.split('/')[1]),
                datasets: [{
                    label: null,
                    backgroundColor: "#1c1340",
                    borderColor: "#1c1340",
                    fill: false,
                    data: [],
                    pointRadius: 10,
                }, {
                    label: daily_name,
                    backgroundColor: "#ff0000",
                    borderColor: "#ff0000",
                    fill: false,
                    data: [],
                }, {
                    label: daily_total_name,
                    backgroundColor: "#e6e6e6",
                    borderColor: "#e6e6e6",
                    fill: false,
                    data: daily,
                }, {
                    label: daily_name,
                    backgroundColor: "#ffcccc",
                    borderColor: "#ffcccc",
                    fill: "end",
                    data: [],
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 65,
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
        this._deaths = deaths;
        this._active_name = active_name;
        this._daily_name = daily_name;
        this._active_total_name = active_total_name;
        this._daily_total_name = daily_total_name;
        this._config = config;
        this._chart = chart;
        return this.goToPercent(0);
    }

    goToPercent(percent) {
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
            let today_deaths = this._deaths.slice(index, index + 1)[0];
            let dataset = this._config.data.datasets[0];
            if (this._milestones.includes(today_date)) {
                dataset.data = daily.slice(0, daily.length - 1).map(_ => null).concat([daily[daily.length - 1]]);
            } else {
                dataset.data = [];
            }
            dataset = this._config.data.datasets[1];
            dataset.data = daily;
            dataset = this._config.data.datasets[3];
            dataset.data = [];
            let todayYear = parseInt(today_date.split('/')[0]);
            let todayMonth = parseInt(today_date.split('/')[1]) - 1;
            let todayDay = parseInt(today_date.split('/')[2]);
            let todayDate = new Date(todayYear, todayMonth, todayDay);
            let regions = this._regions.filter(item => item[0] <= todayDate && todayDate <= item[1]);
            if (regions.length > 0) {
                let region = regions[0];
                for (let i = 0; i < this._dates.length; ++i) {
                    let temp = this._dates[i];
                    if (region[0] <= temp && temp <= region[1]) {
                        dataset.data.push(this._daily[i]);
                    } else {
                        dataset.data.push(null);
                    }
                }
            }
            this._chart.update();
            let json = [
                ['Fecha', today_date],
                ['Activos', today_active],
                ['Acumulados', today_accumulated],
                ['Diarios', today_daily],
                ['Fallecidos', today_deaths],
            ];
            return json;
        }
    }
}

// window.onload = async function () {
//     let ctx = document.getElementById('canvas').getContext('2d');
//     let main = d3.select('main');
//     let scrolly = main.select('#scrolly');
//     let figure = scrolly.select('figure');
//     let article = scrolly.select('article');
//     let step = article.selectAll('.step');

//     // initialize the scrollama
//     let scroller = scrollama();

//     // generic window resize listener event
//     function handleResize(chartx) {
//         setupStickyfill();
//         // 1. update height of step elements
//         let stepH = Math.floor(window.screen.height * 0.15);
//         step.style('height', stepH + 'px');

//         let figureHeight = window.screen.height * 0.75;
//         let figureMarginTop = 0;//window.screen.height - figureHeight;

//         figure
//             .style('height', figureHeight + 'px')
//             .style('top', figureMarginTop + 'px');

//         chartx._chart.resize();

//         // 3. tell scrollama to update new element dimensions
//         scroller.resize();
//     }

//     // scrollama event handlers
//     function handleStepEnter(response, charx) {
//         // console.log(response);
//         // response = { element, direction, index }

//         // add color to current step only
//         step.classed('is-active', function (d, i) {
//             return i === response.index;
//         });

//         let percent = response.index * 100 / 18;
//         charx.goToPercent(percent, 'legends');
//     }

//     function setupStickyfill() {
//         d3.selectAll('.sticky').each(function () {
//             Stickyfill.add(this);
//         });
//     }

//     async function init() {
//         let chart = new ScrollytellingChart(['2020-10-16'], [['2020-10-16', '2021-10-16']]);
//         await chart.getChart(ctx, 'legends');
//         handleResize(chart);
//         scroller
//             .setup({
//                 step: '#scrolly article .step',
//                 offset: 0.95,
//                 debug: false,
//             })
//             .onStepEnter(response => handleStepEnter(response, chart));
//         window.addEventListener('resize', () => handleResize(chart));
//     }

//     init();

// };

