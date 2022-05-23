'use strict';
const historyInit = function () {
  console.log('history.js: init');
  listenToFilterBtns('.js-filter-time');
  listenToFilterBtns('.js-filter-action');
};

document.addEventListener('DOMContentLoaded', historyInit);
