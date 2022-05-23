'use strict';

// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
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
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const dashboardInit = function () {
  console.log('dashboard.js: init');
  if (document.querySelector('.js-dashboard-page')) {
    listenToQuestions();
    togglePopup();
    listenToFilterBtns('.js-filter-average');
    listenToFilterBtns('.js-filter-total');
  }
};

document.addEventListener('DOMContentLoaded', dashboardInit);
// #endregion
