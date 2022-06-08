'use strict';
// #region ***  DOM references                           ***********
let filter = 'all';
let myChartVolume, myChartWeight;
let htmlDiscriptions;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const addDiscription = function () {
  let htmlString = '';
  // console.log(filter,' 👌👌👌👌👌');
  if (filter == 'all') {
    htmlString = 'All time';
  } else if (filter == 'week') {
    htmlString = 'Last 7 days';
  } else if (filter == 'month') {
    htmlString = 'Current month';
  } else if (filter == 'day') {
    htmlString = 'Last 24 hours';
  }

  htmlDiscriptions = document.querySelectorAll('.js-description');
  for (const desc of htmlDiscriptions) {
    desc.innerHTML = htmlString;
  }
};

const calcVolumeToProcent = function (volume) {
  let result = Math.round(Math.abs(((volume - 28.5) * 100) / 17));
  result = result > 100 ? 100 : result;
  result = result < 0 ? 0 : result;
  // console.log('volume: ', volume, 'result: ', result);
  return result;
};

const showChartVolume = function (json) {
  let labels = [];
  let data = [];
  for (const x of json) {
    labels.push(x.time);
    data.push(calcVolumeToProcent(x.value));
  }
  if (!myChartVolume) {
    drawChartVolume(labels, data);
    // console.log('chart volume created😏✍😏😏😏');
  } else {
    updateChart(myChartVolume, labels, data);
  }
};
const drawChartVolume = function (time, value) {
  let ctx = document.querySelector('.js-chart-volume');

  const config = {
    type: 'line',
    data: {
      labels: time,
      datasets: [
        {
          label: 'volume',
          backgroundColor: 'white',
          borderColor: '#264AFF',
          data: value,
          fill: {
            target: 'start',
            above: '#3B5CFF',
          },
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 16,
          right: 16,
          top: 4,
          bottom: 16,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Volume in (%)',
          color: '#0B1C45',
          font: {
            weight: 'bold',
            size: 16,
            family: 'Inter',
            lineHeight: 1.5,
          },
        },
        legend: {
          display: false,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: true,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      responsive: true,
      maintainAspectRatio: true,
      elements: {
        line: {
          tension: 0.4,
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { display: false },
          type: 'linear',
          min: 0,
          // max: 100,
        },
      },
    },
  };

  myChartVolume = new Chart(ctx, config);
  addDiscription();
};

const showChartWeight = function (json) {
  let labels = [];
  let data = [];
  for (const x of json) {
    labels.push(x.time);
    data.push(x.value);
  }
  if (!myChartWeight) {
    drawChartWeight(labels, data);
    // console.log('chart volume created😏✍😏😏😏');
  } else {
    updateChart(myChartWeight, labels, data);
  }
};
const drawChartWeight = function (time, value) {
  let ctx = document.querySelector('.js-chart-weight');

  const config = {
    type: 'line',
    data: {
      labels: time,
      datasets: [
        {
          label: 'weight',
          backgroundColor: 'white',
          borderColor: '#264AFF',
          data: value,
          fill: {
            target: 'start',
            above: '#3B5CFF',
          },
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 16,
          right: 16,
          top: 4,
          bottom: 16,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Weight in (kg)',
          color: '#0B1C45',
          font: {
            weight: 'bold',
            size: 16,
            family: 'Inter',
            lineHeight: 1.5,
          },
        },
        legend: {
          display: false,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: true,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      responsive: true,
      maintainAspectRatio: true,
      elements: {
        line: {
          tension: 0.4,
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { display: false },
          type: 'linear',
          min: 0,
          // max: 5,
        },
      },
    },
  };

  myChartWeight = new Chart(ctx, config);
  addDiscription();
};

const updateChart = function (chart, labels, data) {
  // console.log('1', chart.data.labels);
  chart.data.labels = labels;
  chart.data.datasets.forEach((dataset) => {
    dataset.data = data;
  });
  // console.log('2', chart.data.labels);
  chart.update();
  addDiscription();
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getChartVolume = function (time) {
  const url = backend + `/history/charts/${time}/9`;
  handleData(url, showChartVolume, showApiError, 'GET');
};
const getChartWeight = function (time) {
  const url = backend + `/history/charts/${time}/10`;
  handleData(url, showChartWeight, showApiError, 'GET');
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
        // console.log(filter);
        getChartVolume(filter);
        getChartWeight(filter);
      }
    });
  }
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const statsInit = function () {
  console.log('stats.js: init');
  if (document.querySelector('.js-stats-page')) {
    checkToken('stats.html');
    getChartWeight('all');
    getChartVolume('all');
    listenToFilter('.js-filter-time');
  }
};

document.addEventListener('DOMContentLoaded', statsInit);
// #endregion
