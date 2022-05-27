'use strict';

// #region ***  DOM references                           ***********
let htmlGeneralInformation;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showGeneralInformation = function () {
  console.log('showGeneralInformation');
  htmlGeneralInformation.innerHTML = `
            <h2 class="u-mb-clear u-mb-md c-lead c-lead--xl">General information</h2>
            <div class="o-layout o-layout--gutter">
              <div class="o-layout__item u-1-of-2-bp3">
                <div class="c-card">
                  <h3 class="c-card__title">Info<i class="c-card__icon-sm las la-pen js-toggle-popup"></i></h3>
                  <p class="u-mb-clear u-mb-md">Name: Garbage bin 1</p>
                  <p class="u-mb-clear">Location: Marksesteenweg 58, 8500 Kortrijk, Belgie</p>
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
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
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
  
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const dashboardInit = function () {
  console.log('dashboard.js: init');
  if (document.querySelector('.js-dashboard-page')) {
    htmlGeneralInformation = document.querySelector('.js-general-information');

    showGeneralInformation();

    listenToSocket();
    listenToFilterBtns('.js-filter-average');
    listenToFilterBtns('.js-filter-total');

    listenToQuestions();
    togglePopup();
  }
};

document.addEventListener('DOMContentLoaded', dashboardInit);
// #endregion

