$.getJSON('https://covid.ourworldindata.org/data/latest/owid-covid-latest.json', function(data){
    'use-strict';

    function filter(region, values, x, y){
        let population = values["population"];
        let cases      = values["total_cases"];
        let deaths     = values["total_deaths"];
        let morthality = deaths !== 0 ? deaths/population : 0;
        let fatality   = (deaths !== 0) || (cases !== 0) ? deaths/cases : 0;

        if(!region.includes("OWID") && deaths != null && cases != null){
            x.push(morthality);
            y.push(fatality);
        }

    }

    let xLabel = ['xLabel']
    let yLabel = ['yLabel']

    Object.keys(data).forEach(key => filter(key, data[key], xLabel, yLabel));

    console.log(xLabel);
    console.log(yLabel);

    var chart = c3.generate({
        bindto: '#deceasesComparisonDiv',
        data: {
            xs: {
                yLabel: 'xLabel'
            },
        columns: [
            xLabel,
            yLabel
        ],
        type: 'scatter'
        }
    });

});



