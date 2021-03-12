window.onload = async function () {
    let ctx = document.getElementById('canvas').getContext('2d');
    var main = d3.select('main');
    var scrolly = main.select('#scrolly');
    var figure = scrolly.select('figure');
    var article = scrolly.select('article');
    var step = article.selectAll('.step');

    var scroller = scrollama();
    let chart = new ScrollytellingChart(
        [
            '2020/03/11',
            '2020/03/18',
            '2020/03/23',
            '2020/04/03',
            '2020/04/16',
            '2020/04/24',
            '2020/05/04',
            '2020/05/11',
            '2020/07/19',
            '2020/09/03',
            '2020/11/03',
            '2020/11/19',
            '2021/01/04',
            '2021/01/08',
            '2021/02/02',
            '2021/02/06',
            '2021/02/08',
            '2021/02/10',
            '2021/03/07',
            '2021/03/10'
        ],
        [
            ['2020/03/11', '2020/07/19'],
            ['2020/07/20', '2020/11/19'],
            ['2020/11/20', '2021/03/10']
        ]
    );
    let legends = await chart.init(ctx);
    legends.forEach(item => {
        d3.select(`#${item[0]}`).text(`${item[0]}: ${item[1]}`);
    });

    setupStickyfill();
    handleResize();
    scroller
        .setup({
            step: '#scrolly article .step',
            offset: 0.9,
            debug: false
        })
        .onStepEnter(handleStepEnter);
    window.addEventListener('resize', handleResize);

    function handleResize() {
        var figureHeight = window.innerHeight * 0.80;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;
        figure
            .style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');
        scroller.resize();
        chart._chart.resize();
    }

    function handleStepEnter(response) {
        step.classed('is-active', function (d, i) {
            return i === response.index;
        });
        let percent = response.index * 100 / $('.step').length;
        let legends = chart.goToPercent(percent);
        legends.forEach(item => {
            d3.select(`#${item[0]}`).text(`${item[0]}: ${item[1]}`);
        });
    }

    function setupStickyfill() {
        d3.selectAll('.sticky').each(function () {
            Stickyfill.add(this);
        });
    }
}