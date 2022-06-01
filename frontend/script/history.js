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
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const historyInit = function () {
  console.log('history.js: init');
  if (document.querySelector('.js-history-page')) {
    checkToken('history.html');
    listenToFilterBtns('.js-filter-time');
    listenToFilterBtns('.js-filter-category');
  }
};

document.addEventListener('DOMContentLoaded', historyInit);
// #endregion
