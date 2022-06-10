'use strict';

// #region ***  DOM references                           ***********
let htmlDataTable;
let filter = 'all';
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const checkValue = function (value) {
  if (value == null) {
    return '-';
  } else if (value == '0.0 kg') {
    return '0 kg';
  } else if (value.includes('cm')) {
    let volume = parseFloat(value.replace(',', '.').replace(' cm', ''));
    let result = Math.round(Math.abs(((volume - 28.5) * 100) / 16.5));
    result = result > 100 ? 100 : result;
    result = result < 5 ? 0 : result;
    return `${result} %`;
  } else {
    return value;
  }
};
const showTable = function (json) {
  // console.log('history.js: showTable', json);
  let htmlString = '';
  for (const item of json.table) {
    // console.log('item', item);
    const name = item.name ? item.name : 'User';
    htmlString += `<tr>
                    <td>${name}</td>
                    <td>${item.time}</td>
                    <td>${checkValue(item.value)}</td>
                    <td>${item.description}</td>
                   </tr>`;
  }

  if ($.fn.DataTable.isDataTable('.js-table')) {
    $('.js-table').DataTable().destroy();
  }
  htmlDataTable.innerHTML = htmlString;
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
  listenToFilter('.js-filter-time');
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getHistory = function (time) {
  const url = backend + `/history/${time}/`;
  handleData(url, showTable, showApiError, 'GET');
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
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
        filter = this.innerHTML;
        getHistory(filter);
      }
    });
  }
};

const listenToSocket = function () {
  socketio.on('B2F_refresh_data', function () {
    console.log('B2F_refresh_data');
    getHistory(filter);
  });
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const historyInit = function () {
  console.log('history.js: init');
  if (document.querySelector('.js-history-page')) {
    htmlDataTable = document.querySelector('.js-data-table');

    checkToken('history.html');

    getHistory('all');

    listenToSocket();
  }
};

document.addEventListener('DOMContentLoaded', historyInit);
// #endregion
