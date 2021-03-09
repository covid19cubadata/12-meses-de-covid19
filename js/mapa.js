// @ts-nocheck
/*jshint esversion: 6 */

var world_map = L.map('world-map', {
  layers: [],
  keyboard: false,
  dragging: true,
  zoomControl: true,
  boxZoom: false,
  doubleClickZoom: false,
  scrollWheelZoom: false,
  tap: true,
  touchZoom: true,
  zoomSnap: 0.05,
});
world_map.zoomControl.setPosition('topright');

var geojsonData = null;
var geojson = null;
var incidences = null;
var codes_countries = null;
const tenpow = Math.pow(10, 5);
const factor = 50000;

$.slides = {
  slide: 0,
  total: 0,
  data: {},
  timer: 500,
  isPaused: false,
  begin_date: '',
  end_date: '',
  _load: () => {
    $.slides.data = incidences[$.slides.slide];
    $.slides.begin_date = incidences[$.slides.slide].begin_date.replace(
      '-',
      '/'
    );
    $.slides.end_date = incidences[$.slides.slide].end_date.replace('-', '/');
    updateMap();
    updateWeek();
  },
  init: () => {
    $.slides.slide = 0;
    $.slides.total = incidences.length;
    $.slides._load();
  },
  next: () => {
    if ($.slides.slide < $.slides.total - 1) {
      $.slides.slide += 1;
      $.slides._load();
      console.log(`slide: ${$.slides.slide}`);
    }
  },
  prev: () => {
    if ($.slides.slide > 0) {
      $.slides.slide -= 1;
      $.slides._load();
      console.log(`slide: ${$.slides.slide}`);
    }
  },
  start: () => {
    $.slides.isPaused = true;
    setTimeout(() => {
      $.slides.slide = 0;
      $.slides._load();
      $.slides.play();
    }, $.slides.timer);
  },
  play: () => {
    setTimeout(() => {
      if ($.slides.isPaused) {
        $.slides.isPaused = false;
        return;
      }
      if ($.slides.slide < $.slides.total) {
        $.slides.next();
        $.slides.play();
      }
    }, $.slides.timer);
  },
  pause: () => {
    $.slides.isPaused = true;
  },
};

function logx(base, x) {
  return base === 10 ? Math.log10(x) : Math.log10(x) / Math.log10(base);
}

function getColorMap(code) {
  if (code in $.slides.data) {
    const incidence = $.slides.data[code];
    if (incidence) {
      var opac = logx(factor, (incidence * factor) / tenpow);
      if (opac < 0.07) {
        opac = 0.07;
      }
      return 'rgba(176,30,34,' + opac + ')';
    }
  }
  return '#D1D2D4';
}

function styleMap(feature) {
  return {
    weight: 0.5,
    opacity: 0.8,
    color: '#f5f1f1',
    fillOpacity: 1,
    fillColor: getColorMap(feature.properties.ISO_A3),
  };
}

function updateMap() {
  world_map.eachLayer((featureInstance) => {
    if (!featureInstance?.feature) {
      return;
    }
    const style = styleMap(featureInstance.feature);
    featureInstance.setStyle(style);
  });
}

function updateWeek() {
  $('#week').text(`${$.slides.begin_date} - ${$.slides.end_date}`);
}

$.when(
  $.getJSON('/data/incidences-per-day.json'),
  $.getJSON('/data/codes-countries.json'),
  $.getJSON('/data/countries.geojson')
).done(function (incidences_per_day, codes, json) {
  incidences = incidences_per_day[0];
  codes_countries = codes[0];
  $.slides.init();
  //$.slides.slide = 50;
  //$.slides._load();
  geojson = L.geoJSON(json[0], { style: styleMap });
  geojson.bindTooltip(
    (layer) => {
      //console.log(layer.feature.properties.ADMIN);
      const code = layer.feature.properties.ISO_A3;
      const data = code in $.slides.data ? $.slides.data[code] : 0;
      return (
        `<span class="bd">${layer.feature.properties.ADMIN}</span>` +
        '<br>' +
        `<span class="bd">${data.toFixed(4)}</span>`
      );
    },
    { sticky: true }
  );
  let ratio =
    (geojson.getBounds().getNorthEast().lat -
      geojson.getBounds().getSouthWest().lat) *
    0.05;
  world_map.addLayer(geojson);
  world_map.fitBounds(geojson.getBounds());
  world_map.setMaxBounds(geojson.getBounds().pad(ratio));
  world_map.flyTo([40, 0], 1.53);
});
