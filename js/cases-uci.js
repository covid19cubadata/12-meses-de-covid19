var timeToDiag = ['data1', 4.9, 5.4, 6.5];
var hospitalizationTime = ['data2', 8.8, 2.6, 1.7];
var timeInICU = ['data3', 0, 4.8, 3.1];
var postICUTime = ['data4', 0, 4.2, 0];
var showHospTime = true;
var casesICUColors = {
    'data1': '#a5a6e9',
    'data2': '#21238a',
    'data3': '#ff3300',
    'data4': '#21238a',
};

var casesUCICategories = [
    'Leves y Moderados',
    'Graves y Críticos',
    'Fallecidos'
];

function buildCasesUCI() {
    var toggle = function (id) {}
    var focus = function (id) {}

    var casesICUBarChart = c3.generate({
        bindto: '#casesUCI',
        data: {
            type: 'bar',
            columns: [
                timeToDiag,
                hospitalizationTime,
                timeInICU,
                postICUTime,
            ],
            colors: casesICUColors,
            names: {
                data1: 'Tiempo desde el inicio síntomas al Diagnóstico',
                data2: 'Tiempo de Hospitalización',
                data3: 'Tiempo en UCI',
                data4: 'Tiempo de Hospitalización',
            },
            groups: [
                ['data4', 'data3', 'data2', 'data1']
            ],
            labels: {
                format: function (v, id, i, j) {
                    if(v > 0) {
                        return v;
                    }
                },
            },
            order: null
        },
        axis: {
            x: {
                type: 'category',
                categories: casesUCICategories
            },
            rotated: true
        },
        legend: {
            hide: 'data4',
            item: {
                onclick: function (id) {
                    if(id === 'data2') {
                        toggle('data4');
                    }
                    toggle(id);
                },
                onmouseover: function (id) {
                    if(id === 'data2') {
                        focus([id, 'data4']);
                    }
                    else {
                        focus(id);
                    }
                }
            }
        },
        tooltip: {
            grouped: false,
            format: {
                value: function (value, ratio, id , index) {
                    if(id === 'data2') {
                        return round(value + postICUTime[index + 1]);
                    }
                    if(id === 'data4') {
                        return round(value + hospitalizationTime[index + 1]);
                    }
                    return value;
                }
            }
        }
    });

    toggle = function (id) {
        casesICUBarChart.toggle(id);
    };

    focus = function (id) {
        casesICUBarChart.focus(id);
    }
}

function round(num) {
    return Math.floor(num * 10) / 10;
}

buildCasesUCI();
