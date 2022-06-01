'use strict';

// #region ***  DOM references                           ***********
// const provider = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const provider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const copyright = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap Carto</a> contributors';
let map, layergroup;
let address = 'theodoor sevenslaan 7b';
let name_garbage = 'garbage bin 1';

const iconTrash = L.icon({
  iconUrl: 'img/trash-icon.png',
  iconSize: [44, 56],
  iconAnchor: [22, 55],
  popupAnchor: [0, -55],
  shadowUrl: 'img/trash-bin-shadow.png',
  shadowSize: [69, 55],
  shadowAnchor: [22, 55],
});
const iconHome = L.icon({
  iconUrl: 'img/home-icon.png',
  iconSize: [44, 56],
  iconAnchor: [22, 55],
  popupAnchor: [0, -55],
  shadowUrl: 'img/trash-bin-shadow.png',
  shadowSize: [69, 55],
  shadowAnchor: [22, 55],
});
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const makeMarker = function (coords) {
  // console.log(coords, adres, name);
  layergroup.clearLayers();
  let marker = L.marker(coords, { icon: iconTrash }).addTo(layergroup);
  marker.bindPopup(`<h3 class="c-lead c-lead--md u-mb-md u-fw-bold">${name_garbage}</h3><em>${address}</em>`);
};
const showMarker = function (json) {
  // console.log(json);
  let lon_lat = json.features[0].geometry.coordinates;
  let adres = json.features[0].properties.address_line2;
  lon_lat.reverse();
  // console.log(lon_lat);
  showMap(lon_lat);
  makeMarker(lon_lat);
};

const showMap = function (coords) {
  map = L.map('map').setView(coords, 15);
  L.tileLayer(provider, { attribution: copyright }).addTo(map);
  L.geolet({
    position: 'topleft',
    style: { display: 'flex', color: '#0B1D47' },
    activeStyle: { display: 'flex', color: '#264AFF' },
    popupContent: 'Current location',
    marker: L.marker([], { icon: iconHome }),
    minZoom: 10,
  }).addTo(map);
  if (document.querySelector('.js-map')) {
    layergroup = L.layerGroup().addTo(map);
  }
};

// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getCoordinates = function () {
  const myAPIKey = `2bb92724d0cd4edd8a5b0599e269f54c`;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&lang=nl&apiKey=${myAPIKey}`;
  // console.log(url);
  handleData(url, showMarker, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const mapInit = function () {
  console.log('map.js: init');
  if (document.querySelector('.js-map-page')) {
    checkToken('map.html');
    getCoordinates();
  }
};

document.addEventListener('DOMContentLoaded', mapInit);
// #endregion
