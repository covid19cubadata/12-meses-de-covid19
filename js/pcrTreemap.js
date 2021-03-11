// JS 
var chart = JSC.chart('pcr_treemap', { 
    debug: false, 
    type: 'treemap', 
    legend_visible: false, 
    defaultPoint: { 
      tooltip: '%name<br/>Tests (PCR): %yvalue', 
      label_text: '%code<br/>{%yValue:N0}'
    }, 
    series: [ 
      { 
        name: 'Provincias', 
        points: [ 
          { 
            name: 'Pinar del Río', 
            y: 120126,
            color: '#00553d',
            attributes: { code: 'PR' } 
          }, 
          { 
            name: 'Artemisa', 
            y: 66556,
            color: '#fe0002',
            attributes: { code: 'AR' } 
          }, 
          { 
            name: 'La Habana', 
            y: 1103170,
            color: '#020085',
            attributes: { code: 'LH' } 
          }, 
          { 
            name: 'Mayabeque', 
            y: 54194,
            color: '#e36d70',
            attributes: { code: 'MY' } 
          },
          { 
            name: 'Matanzas', 
            y: 131610,
            color: '#e36d70',
            attributes: { code: 'MT' } 
          }, 
          { 
            name: 'Cienfuegos', 
            y: 48266,
            color: '#00a261',
            attributes: { code: 'CF' } 
          }, 
          { 
            name: 'Villa Clara', 
            y: 100588,
            color: '#ff7a13',
            attributes: { code: 'VC' } 
          }, 
          { 
            name: 'Sancti Spíritus', 
            y: 63665,
            color: '#fe6515',
            attributes: { code: 'SS' } 
          }, 
          { 
            name: 'Ciego de Ávila', 
            y: 134103,
            color: '#008dd0',
            attributes: { code: 'CA' } 
          }, 
          { 
            name: 'Camagüey', 
            y: 79037,
            color: '#003060',
            attributes: { code: 'CM' } 
          }, 
          { 
            name: 'Las Tunas', 
            y: 30879,
            color: '#009c55',
            attributes: { code: 'LT' } 
          }, 
          { 
            name: 'Holguín', 
            y: 85083,
            color: '#007fc6',
            attributes: { code: 'HG' } 
          }, 
          { 
            name: 'Granma', 
            y: 29136,
            color: '#0b4ca0',
            attributes: { code: 'GR' } 
          }, 
          { 
            name: 'Santiago de Cuba', 
            y: 130977,
            color: '#ef242a',
            attributes: { code: 'SC' } 
          }, 
          { 
            name: 'Guantánamo', 
            y: 49608,
            color: '#515a57',
            attributes: { code: 'GT' } 
          }, 
          { 
            name: 'Isla de la Juventud', 
            y: 18498,
            color: '#38b396',
            attributes: { code: 'IJ' } 
          } 
        ] 
      } 
    ] 
  }); 