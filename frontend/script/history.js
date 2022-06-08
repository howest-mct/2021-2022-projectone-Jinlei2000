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
    $('.js-table').DataTable({
      info: false,
      lengthChange: false,
      pageLength: 15,
      responsive: true,
      // ordering: false,
      order: [],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search ...',
      },
    });
  }
};

document.addEventListener('DOMContentLoaded', historyInit);
// #endregion
