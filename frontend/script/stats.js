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
const statsInit = function () {
  console.log('stats.js: init');
  listenToFilterBtns('.js-filter-time');
};

document.addEventListener('DOMContentLoaded', statsInit);
// #endregion

