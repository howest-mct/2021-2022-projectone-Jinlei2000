'use strict';
const statsInit = function () {
  console.log('stats.js: init');
  listenToFilterBtns('.js-filter-time');
};

document.addEventListener('DOMContentLoaded', statsInit);
