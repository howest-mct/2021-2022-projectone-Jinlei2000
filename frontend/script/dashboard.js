'use strict';

// #region ***  DOM references                           ***********
let htmlGeneralInformation, htmlLiveData, htmlAverage, htmlTotal, htmlPopupConfirmBtn;
let htmlPopupName, htmlPopupLocation;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showGeneralInformation = function (info) {
  console.log('showGeneralInformation');
  htmlGeneralInformation.innerHTML = `
            <h2 class="u-mb-clear u-mb-md c-lead c-lead--xl">General information</h2>
            <div class="o-layout o-layout--gutter">
              <div class="o-layout__item u-1-of-2-bp3">
                <div class="c-card">
                  <h3 class="c-card__title">Info<i class="c-card__icon-sm las la-pen js-toggle-popup"></i></h3>
                  <p class="u-mb-clear u-mb-md">Name: ${info.name}</p>
                  <p class="u-mb-clear">Location: ${info.address}</p>
                </div>
              </div>
              <div class="o-layout__item u-1-of-2-bp3">
                <div class="c-card">
                  <h3 class="c-card__title">IP-Address</h3>
                  <p class="u-mb-clear u-mb-md">IP-Address: ${window.location.hostname}</p>
                  <p class="u-mb-clear">Hostname: smartgarbage.local</p>
                </div>
              </div>
            </div>
  `;
  togglePopup();
  listenToPopupConfirmBtn();
};

const calcVolumeIconLayer = function (procent) {
  const height = (18.1 / 100) * procent;
  const y = Math.abs(((height - 27) * 18) / 18);
  return `<rect x="8.2" y="${y}" class="st2" width="15.5" height="${height}"/>`;
};

const showLiveData = function (data) {
  // console.log('showLiveData');
  const volume = data.volume;
  const weight = data.weight;
  const door = data.door ? 'close' : 'open';
  const valve = data.valve ? 'close' : 'open';
  const openedTimes = data.opened_times;
  const emptiedTimes = data.emptied_times;

  const iconDoor = data.door ? 'las la-door-closed' : 'las la-door-open';
  const iconValve = data.valve ? 'las la-door-closed' : 'las la-door-open';
  // console.log(`volume: ${volume}, weight: ${weight}, door: ${door}, valve: ${valve}, openedTimes: ${openedTimes}, emptiedTimes: ${emptiedTimes}`);
  htmlLiveData.innerHTML = `
   <h2 class="u-mb-clear u-mb-md c-lead c-lead--xl">Live feed</h2>
            <div class="o-layout o-layout--gutter">
              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1">
                <div class="c-card c-card--feed">
                  
                <svg version="1.1" id="Sensor_info" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                              y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;height:96px;" xml:space="preserve">
                            <style type="text/css">
                              .st0{fill:none;}
                              .st1{fill:#001EB3;}
                              .st2{fill:#9AA2CC;}
                            </style>
                            <rect id="svgEditorBackground" class="st0" width="32" height="32"/>
                            <g id="logo">
                              <rect id="Rectangle_13" class="st0" width="32" height="32"/>
                              <g id="trash-alt-1" transform="translate(11.705 6.172)">
                                <path id="Path_201" class="st1" d="M15.5,0.2H11L9.2-2.9C8.7-3.6,7.9-4.1,7-4.1H1.6c-0.9,0-1.8,0.5-2.2,1.3l-1.8,3.1h-4.4
                                  c-0.5,0-0.9,0.4-0.9,0.9c0,0,0,0,0,0v0.9c0,0.5,0.4,0.9,0.9,0.9c0,0,0,0,0,0h0.9v18.1c0,1.4,1.2,2.6,2.6,2.6H12
                                  c1.4,0,2.6-1.2,2.6-2.6l0,0V2.8h0.9c0.5,0,0.9-0.4,0.9-0.9c0,0,0,0,0,0V1.1C16.3,0.6,16,0.2,15.5,0.2z M1.5-1.4
                                  c0.1-0.1,0.2-0.2,0.3-0.2h5.1c0.1,0,0.2,0.1,0.3,0.2L8,0.2H0.5L1.5-1.4z M12,20.9H-3.5V2.8H12L12,20.9L12,20.9z"/>
                              </g>
                            </g>
                            ${calcVolumeIconLayer(volume)}
                            </svg>

                  <h3 class="c-card__title c-card__title--feed">
                    Volume
                    <span class="c-card__value">${volume}<span class="c-lead c-lead--xl">%</span></span>
                  </h3>
                </div>
              </div>

              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1">
                <div class="c-card c-card--feed">
                  <i class="c-card__icon-lg las la-balance-scale-left"></i>
                  <h3 class="c-card__title c-card__title--feed">
                    Weight
                    <span class="c-card__value">${weight}<span class="c-lead c-lead--xl">kg</span></span>
                  </h3>
                </div>
              </div>

              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card">
                <div class="c-card c-card--feed">
                  <i class="c-card__icon-sm las la-question-circle js-card-button u-align-items-start">
                    <i class="c-card__icon-lg las la-door-open"></i>
                  </i>
                  <h3 class="c-card__title c-card__title--feed">
                    Emptied
                    <span class="c-card__value">${emptiedTimes}</span>
                  </h3>
                </div>
              </div>
              <!-- Info card -->
              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card-info u-hidden-card">
                <div class="c-card c-card--feed c-card--info">
                  <i class="c-card__icon-sm las la-times u-h-xl js-card-button"></i>
                  <p class="u-mb-clear">Number of times the trash can was emptied.</p>
                </div>
              </div>

              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card">
                <div class="c-card c-card--feed">
                  <i class="c-card__icon-sm las la-question-circle js-card-button u-align-items-start">
                    <i class="c-card__icon-lg las la-door-open"></i>
                  </i>
                  <h3 class="c-card__title c-card__title--feed">
                    Opened
                    <span class="c-card__value">${openedTimes}</span>
                  </h3>
                </div>
              </div>
              <!-- Info card -->
              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card-info u-hidden-card">
                <div class="c-card c-card--feed c-card--info">
                  <i class="c-card__icon-sm las la-times u-h-xl js-card-button"></i>
                  <p class="u-mb-clear">Number of times the lid has been opened from the garbage can.</p>
                </div>
              </div>

              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card">
                <div class="c-card c-card--feed">
                  <i class="c-card__icon-sm las la-question-circle js-card-button u-align-items-start">
                    <i class="c-card__icon-lg ${iconDoor}"></i>
                  </i>
                  <h3 class="c-card__title c-card__title--feed">
                    Door 1
                    <span class="c-card__value">${door}</span>
                  </h3>
                </div>
              </div>
              <!-- Info card -->
              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 js-card-info u-hidden-card">
                <div class="c-card c-card--feed c-card--info">
                  <i class="c-card__icon-sm las la-times u-h-xl js-card-button"></i>
                  <p class="u-mb-clear">Here you see the status of lid is: closed = close, opened = open.</p>
                </div>
              </div>

              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card">
                <div class="c-card c-card--feed">
                  <i class="c-card__icon-sm las la-question-circle js-card-button u-align-items-start">
                    <i class="c-card__icon-lg ${iconValve}"></i>
                  </i>
                  <h3 class="c-card__title c-card__title--feed">
                    Door 2
                    <span class="c-card__value">${valve}</span>
                  </h3>
                </div>
              </div>
              <!-- Info card -->
              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 js-card-info u-hidden-card">
                <div class="c-card c-card--feed c-card--info">
                  <i class="c-card__icon-sm las la-times u-h-xl js-card-button"></i>
                  <p class="u-mb-clear">Here you see the status of the door to empty is: closed = close, opened = open.</p>
                </div>
              </div>
            </div>
  `;
  listenToQuestions();
};

const showPopupInputValue = function (info) {
  htmlPopupName.placeholder = info.name;
  htmlPopupLocation.placeholder = info.address;
};

const showAverage = function (json) {
  // console.log(json);
  let volumeAverage = 0;
  let weightAverage = 0;
  for (const device of json) {
    // console.log(device);
    if (device.actionid) {
      if (device.actionid == 9) {
        volumeAverage = device.average;
      } else if (device.actionid == 10) {
        weightAverage = device.average;
      }
    }
  }
  htmlAverage.innerHTML = `<div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1">
                            <div class="c-card c-card--feed">
                              
                            
                            <svg version="1.1" id="Sensor_info" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                              y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32; height:96px;" xml:space="preserve">
                            <style type="text/css">
                              .st0{fill:none;}
                              .st1{fill:#001EB3;}
                              .st2{fill:#9AA2CC;}
                            </style>
                            <rect id="svgEditorBackground" class="st0" width="32" height="32"/>
                            <g id="logo">
                              <rect id="Rectangle_13" class="st0" width="32" height="32"/>
                              <g id="trash-alt-1" transform="translate(11.705 6.172)">
                                <path id="Path_201" class="st1" d="M15.5,0.2H11L9.2-2.9C8.7-3.6,7.9-4.1,7-4.1H1.6c-0.9,0-1.8,0.5-2.2,1.3l-1.8,3.1h-4.4
                                  c-0.5,0-0.9,0.4-0.9,0.9c0,0,0,0,0,0v0.9c0,0.5,0.4,0.9,0.9,0.9c0,0,0,0,0,0h0.9v18.1c0,1.4,1.2,2.6,2.6,2.6H12
                                  c1.4,0,2.6-1.2,2.6-2.6l0,0V2.8h0.9c0.5,0,0.9-0.4,0.9-0.9c0,0,0,0,0,0V1.1C16.3,0.6,16,0.2,15.5,0.2z M1.5-1.4
                                  c0.1-0.1,0.2-0.2,0.3-0.2h5.1c0.1,0,0.2,0.1,0.3,0.2L8,0.2H0.5L1.5-1.4z M12,20.9H-3.5V2.8H12L12,20.9L12,20.9z"/>
                              </g>
                            </g>
                            ${calcVolumeIconLayer(volumeAverage)}
                            </svg>

                            
                              <h3 class="c-card__title c-card__title--feed">
                                Volume
                                <span class="c-card__value">${volumeAverage}<span class="c-lead c-lead--xl">%</span></span>
                              </h3>
                            </div>
                          </div>
                          <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1">
                            <div class="c-card c-card--feed">
                              <i class="c-card__icon-lg las la-balance-scale-left"></i>
                              <h3 class="c-card__title c-card__title--feed">
                                Weight
                                <span class="c-card__value">${weightAverage}<span class="c-lead c-lead--xl">kg</span></span>
                              </h3>
                            </div>
                          </div>`;
  listenToFilter('.js-filter-average');
};

const showTotal = function (json) {
  // console.log(json);
  let emptiedTotal = 0;
  let openedTotal = 0;
  let weightTotal = 0;
  for (const x of json) {
    // console.log(x);
    if (x.actionid) {
      if (x.actionid == 2) {
        openedTotal = x.total;
      } else if (x.actionid == 22) {
        emptiedTotal = x.total;
      } else if (x.actionid == 10) {
        weightTotal = x.total;
      }
    }
  }
  // console.log(emptiedTotal, openedTotal);
  htmlTotal.innerHTML = `<div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1">
                            <div class="c-card c-card--feed">
                              <i class="c-card__icon-lg las la-balance-scale-left"></i>
                              <h3 class="c-card__title c-card__title--feed">
                                Weight
                                <span class="c-card__value">${weightTotal}<span class="c-lead c-lead--xl">kg</span></span>
                              </h3>
                            </div>
                          </div>

                          <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card">
                            <div class="c-card c-card--feed">
                              <i class="c-card__icon-sm las la-question-circle js-card-button u-align-items-start">
                                <i class="c-card__icon-lg las la-door-open"></i>
                              </i>
                              <h3 class="c-card__title c-card__title--feed">
                                Emptied
                                <span class="c-card__value">${emptiedTotal}</span>
                              </h3>
                            </div>
                          </div>
                          <!-- Info card -->
                          <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 js-card-info u-hidden-card">
                            <div class="c-card c-card--feed c-card--info">
                              <i class="c-card__icon-sm las la-times u-h-xl js-card-button"></i>
                              <p class="u-mb-clear">Number of times the trash can was emptied.</p>
                            </div>
                          </div>

                          <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1 js-card">
                            <div class="c-card c-card--feed">
                              <i class="c-card__icon-sm las la-question-circle js-card-button u-align-items-start">
                                <i class="c-card__icon-lg las la-door-open"></i>
                              </i>
                              <h3 class="c-card__title c-card__title--feed">
                                Opened
                                <span class="c-card__value">${openedTotal}</span>
                              </h3>
                            </div>
                          </div>
                          <!-- Info card -->
                          <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 js-card-info u-hidden-card">
                            <div class="c-card c-card--feed c-card--info">
                              <i class="c-card__icon-sm las la-times u-h-xl js-card-button"></i>
                              <p class="u-mb-clear">Number of times the lid has been opened from the garbage can.</p>
                            </div>
                          </div>`;
  listenToFilter('.js-filter-total');
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
const callbackCoords = function (json) {
  console.log(json);
  const coords = `${json.features[0].properties.lat},${json.features[0].properties.lon}`;
  const housenumber = json.features[0].properties.housenumber ? json.features[0].properties.housenumber : '';
  const city = json.features[0].properties.city ? json.features[0].properties.city : '';
  const postcode = json.features[0].properties.postcode ? json.features[0].properties.postcode : '';
  const street = json.features[0].properties.street ? json.features[0].properties.street : json.query.parsed.street;
  const address = `${street} ${housenumber}, ${postcode} ${city}`;
  const url = backend + `/info/`;
  // console.log(address, coords, htmlPopupName.value);
  const body = JSON.stringify({
    address: address,
    coordinates: coords,
    name: htmlPopupName.value,
  });
  handleData(url, callbackAddCoords, showApiError, 'PUT', body);
};

const callbackCoordsError = function (e) {
  showNotification('error', 'Address is not valid.');
};

const callbackAddCoords = function () {
  document.querySelector('body').classList.remove('has-popup');
  getGeneralData();
  showNotification('success', 'Address has been updated.');
};

// #endregion

// #region ***  Data Access - get___                     ***********
const getGeneralData = function () {
  const url = backend + '/info/';
  handleData(url, showGeneralInformation, showApiError);
};

const getPopupData = function () {
  const url = backend + '/info/';
  handleData(url, showPopupInputValue, showApiError);
};

const getCoordinates = function (address) {
  const myAPIKey = `2bb92724d0cd4edd8a5b0599e269f54c`;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&lang=nl&apiKey=${myAPIKey}`;
  // console.log(url);
  handleData(url, callbackCoords, callbackCoordsError);
};

const getAverageData = function (time) {
  const url = backend + `/history/average/${time}/`;
  handleData(url, showAverage, showApiError);
};

const getTotalData = function (time) {
  const url = backend + `/history/total/${time}/`;
  handleData(url, showTotal, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToQuestions = function () {
  const cards = document.querySelectorAll('.js-card');
  const cardsInfo = document.querySelectorAll('.js-card-info');
  // console.log(cards[0]);
  for (let i = 0; i < cards.length; i++) {
    const btn1 = cards[i].querySelector('.js-card-button');
    const btn2 = cardsInfo[i].querySelector('.js-card-button');
    // console.log(btn1);
    // console.log(btn2);
    btn1.addEventListener('click', function () {
      // console.log('close clicked');
      cards[i].classList.add('u-hidden-card');
      cardsInfo[i].classList.remove('u-hidden-card');
    });
    btn2.addEventListener('click', function () {
      // console.log('question clicked');
      cards[i].classList.remove('u-hidden-card');
      cardsInfo[i].classList.add('u-hidden-card');
    });
  }
};

const listenToFilter = function (htmlFilterClass) {
  const btns = document.querySelectorAll(htmlFilterClass);
  for (const btn of btns) {
    btn.addEventListener('click', function () {
      // console.log('filter clicked',this);
      if (!this.classList.contains('c-filter--active')) {
        for (const btn of btns) {
          btn.classList.remove('c-filter--active');
        }
        this.classList.add('c-filter--active');
        const filter = this.innerHTML;
        if (htmlFilterClass == '.js-filter-average') {
          getAverageData(filter);
        } else if (htmlFilterClass == '.js-filter-total') {
          getTotalData(filter);
        }
      }
    });
  }
};

const togglePopup = function () {
  let toggleTrigger = document.querySelectorAll('.js-toggle-popup');
  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      // console.log('Toggle Popup');
      htmlPopupName.value = '';
      htmlPopupLocation.value = '';
      document.querySelector('body').classList.toggle('has-popup');
    });
  }
};

const listenToPopupConfirmBtn = function () {
  htmlPopupConfirmBtn.addEventListener('click', function () {
    console.log('Popup Confirm Button clicked');
    const name = htmlPopupName.value;
    const location = htmlPopupLocation.value;
    if (name != '' && location != '') {
      if (name.length > 3 && location.length > 8) {
        getCoordinates(location);
      } else {
        showNotification('error', 'Name or location is to short, please try again.');
      }
    } else {
      showNotification('error', 'Please fill in the name and location fields');
    }
  });
};

const listenToSocket = function () {
  socketio.on('B2F_live_data', function (data) {
    // console.log('B2F_live_data');
    // console.log(data);
    showLiveData(data);
  });

  // const getActiveFilterTime = function (htmlFilterClass) {
  //   const btns = document.querySelectorAll(htmlFilterClass);
  //   for (const btn of btns) {
  //     if (btn.classList.contains('c-filter--active')) {
  //       return btn.innerHTML;
  //     }
  //   }
  // };

  // socketio.on('B2F_refresh_data', function () {
  //   console.log('B2F_refresh_data');
  //   getAverageData(getActiveFilterTime('.js-average-filter'));
  //   getTotalData(getActiveFilterTime('.js-total-filter'));
  // });
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const dashboardInit = function () {
  console.log('dashboard.js: init');
  if (document.querySelector('.js-dashboard-page')) {
    checkToken('dashboard.html');

    htmlGeneralInformation = document.querySelector('.js-general-information');
    htmlLiveData = document.querySelector('.js-live-data');
    htmlAverage = document.querySelector('.js-average');
    htmlTotal = document.querySelector('.js-total');
    htmlPopupConfirmBtn = document.querySelector('.js-popup-confirm-btn');
    htmlPopupName = document.querySelector('.js-popup-name');
    htmlPopupLocation = document.querySelector('.js-popup-location');

    getGeneralData();
    getAverageData('day');
    getTotalData('all');
    getPopupData();

    listenToSocket();
  }
};

document.addEventListener('DOMContentLoaded', dashboardInit);
// #endregion
