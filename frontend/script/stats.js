'use strict';
// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getChartData = function (time) {
  const url = backend + `/stats/${time}/`;
  handleData(url, 'GET', callbackChartData, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const statsInit = function () {
  console.log('stats.js: init');
  if (document.querySelector('.js-history-page')) {
    checkToken('stats.html');
    getChartData('day');
    listenToFilterBtns('.js-filter-time');
  }
};

document.addEventListener('DOMContentLoaded', statsInit);
// #endregion
