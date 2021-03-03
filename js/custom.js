var world_map = L.map('world-map', {
  //center: [21.5, -79.371124],
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
var geojson = null;

console.log('custom');
$.getJSON('/data/countries.geojson').then(function (json) {
  console.log(json);
  geojson = L.geoJSON(json);
  geojson.bindTooltip(
    function (layer) {
      return '<span class="bd">' + layer.feature.properties.ADMIN + '</span>';
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
  // world_map.setZoom(2.5);
  world_map.flyTo([40, 0], 1.53);
});
