var noimportedCases = ['Casos No Importados', 54267];
var importedCases = ['Casos Importados', 4890];
var casesColors = {
    'Casos Importados': '#1C1340',
    'Casos No Importados': '#B01E22'
};

function buildImportedPie() {
    c3.generate({
        bindto: '#importedPie',
        data: {
            type: 'pie',
            columns: [noimportedCases, importedCases],
            colors: casesColors
        },
    });
};

buildImportedPie();
