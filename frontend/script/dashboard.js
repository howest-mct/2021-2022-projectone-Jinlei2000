'use strict';

// #region ***  DOM references                           ***********
let htmlGeneralInformation, htmlLiveData;
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
};

const showLiveData = function (data) {
  console.log('showLiveData');
  const volume = data.volume;
  const weight = data.weight;
  const door = data.door;
  const valve = data.valve;
  const openedTimes = data.opened_times;
  const emptiedTimes = data.emptied_times;
  console.log(`volume: ${volume}, weight: ${weight}, door: ${door}, valve: ${valve}, openedTimes: ${openedTimes}, emptiedTimes: ${emptiedTimes}`);
  htmlLiveData.innerHTML = `
   <h2 class="u-mb-clear u-mb-md c-lead c-lead--xl">Live feed</h2>
            <div class="o-layout o-layout--gutter">
              <div class="o-layout__item u-1-of-3-bp2 u-1-of-2-bp1 u-flex-grow-1">
                <div class="c-card c-card--feed">
                  <svg class="c-card__icon-lg" id="Sensor_info" data-name="Sensor info" xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
                    <!-- change the volume with the stroke-width -->
                    <line class="js-icon-volume-live-feed" x1="23.89" y1="54.04" x2="71.26" y2="54.04" fill="none" stroke="#9aa2cc" stroke-miterlimit="10" stroke-width="54.34" />
                    <g id="logo">
                      <rect id="Rectangle_13" data-name="Rectangle 13" width="96" height="96" fill="none" />
                      <g id="trash-alt-1" transform="translate(11.705 6.172)">
                        <path
                          id="Path_201"
                          data-name="Path 201"
                          d="M128.959,43.934h-13.32l-5.5-9.162A7.774,7.774,0,0,0,103.477,31h-16.3a7.774,7.774,0,0,0-6.66,3.772l-5.5,9.162H61.694A2.591,2.591,0,0,0,59.1,46.528v2.594a2.591,2.591,0,0,0,2.594,2.594h2.594v54.33a7.766,7.766,0,0,0,7.764,7.764h46.566a7.766,7.766,0,0,0,7.764-7.764h0V51.7h2.594a2.591,2.591,0,0,0,2.594-2.594V46.51A2.615,2.615,0,0,0,128.959,43.934ZM86.9,39.224a.989.989,0,0,1,.828-.478h15.2a.943.943,0,0,1,.828.478l2.815,4.71h-22.5Zm31.719,66.8H72.034V51.7H118.6v54.33Z"
                          transform="translate(-59.1 -31)"
                          fill="#001eb3"
                        />
                      </g>
                    </g>
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
                    <i class="c-card__icon-lg las la-door-closed"></i>
                  </i>
                  <h3 class="c-card__title c-card__title--feed">
                    Door 1
                    <span class="c-card__value">${valve}</span>
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
                    <i class="c-card__icon-lg las la-door-open"></i>
                  </i>
                  <h3 class="c-card__title c-card__title--feed">
                    Door 2
                    <span class="c-card__value">${door}</span>
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

// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getGeneralData = function () {
  const url = backend + '/info/';
  handleData(url, showGeneralInformation, showApiError);
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

const togglePopup = function () {
  let toggleTrigger = document.querySelectorAll('.js-toggle-popup');
  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      // console.log('Toggle Popup');
      document.querySelector('body').classList.toggle('has-popup');
    });
  }
};

const listenToSocket = function () {
  socketio.on('B2F_live_data', function (data) {
    console.log('B2F_live_data');
    // console.log(data);
    showLiveData(data);
  });
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const dashboardInit = function () {
  console.log('dashboard.js: init');
  if (document.querySelector('.js-dashboard-page')) {
    htmlGeneralInformation = document.querySelector('.js-general-information');
    htmlLiveData = document.querySelector('.js-live-data');

    getGeneralData();

    listenToSocket();
    listenToFilterBtns('.js-filter-average');
    listenToFilterBtns('.js-filter-total');
  }
};

document.addEventListener('DOMContentLoaded', dashboardInit);
// #endregion
