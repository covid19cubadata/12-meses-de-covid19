var deceasedMaleCases = ['male', 0, 0, 0, 2, 8, 25, 37, 57, 81, 0];
var deceasedFemaleCases = ['female', 0, 0, 0, 2, 5, 17, 19, 41, 63, 0];
var deceasedTotalCases = ['total', 0, 0, 0, 4, 13, 42, 56, 98, 144, 0]
var deceasedUnknownCases = ['unknown', 0];
var deceasedCasesColors = {
    male: '#1C1340',
    female: '#B01E22',
    total: '#939393',
    unknown: '#1A8323'
};
var ageRangeCategories = [
    '0-9',
    '10-19',
    '20-29',
    '30-39',
    '40-49',
    '50-59',
    '60-60',
    '70-79',
    '80 o más',
    'Desconocido'
];

function buildDeceasedSexsPie() {
    c3.generate({
        bindto: '#sexDeceasedPie',
        data: {
            type: 'pie',
            columns: [
                deceasedMaleCases,
                deceasedFemaleCases,
                deceasedUnknownCases
            ],
            names: {
                male: 'Hombres',
                female: 'Mujeres',
                unknown: 'No reportado'
            },
            colors: deceasedCasesColors
        },
    });
};

function buildAgeRanges() {
    c3.generate({
        bindto: '#deceasedAgeRange',
        data: {
            type: 'bar',
            columns: [
                deceasedMaleCases,
                deceasedFemaleCases,
                deceasedTotalCases
            ],
            colors: deceasedCasesColors,
            names: {
                male: 'Hombres',
                female: 'Mujeres',
                total: 'Fallecidos'
            },
            groups: [
                ['male', 'female']
            ],
            order: null
        },
        axis: {
            x: {
                label: {
                    text: 'Rango etario',
                    position: 'outer-center',
                },
                type: 'categorical',
                tick: {
                    rotate: -30,
                    multiline: false
                },
                height: 45,
                categories: ageRangeCategories
            },
            y: {
                label: 'Fallecidos',
                position: 'outer-middle',
            }
        }
    });
}

buildDeceasedSexsPie();
buildAgeRanges();
