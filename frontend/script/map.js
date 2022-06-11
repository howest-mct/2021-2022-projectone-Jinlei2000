'use strict';

// #region ***  DOM references                           ***********
// const provider = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const provider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const copyright = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap Carto</a> contributors';
let map, layergroup;

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
const makeMarker = function (coords, name, address) {
  // console.log(coords, adres, name);
  layergroup.clearLayers();
  let marker = L.marker(coords, { icon: iconTrash }).addTo(layergroup);
  marker.bindPopup(`<h3 class="c-lead c-lead--md u-mb-md u-fw-bold">${name}</h3><em>${address}</em>`);
};
const showMarker = function (json) {
  // console.log(json);
  const coords = json.coordinates.split(',');
  const name = json.name;
  const address = json.address;
  console.log(coords, name, address);
  showMap(coords);
  makeMarker(coords,name,address);
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
  const url = backend + '/info/';
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

    changeColor();
  }
};

document.addEventListener('DOMContentLoaded', mapInit);
// #endregion
