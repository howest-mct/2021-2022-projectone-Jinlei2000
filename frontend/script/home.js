// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showName = function (data) {
  // console.log("showName ",data);
  const name = data.name;
  document.querySelector('.js-name').innerHTML = `${name}`;
};

const showStatusVolume = function (volumePercent) {
  let htmlString = ``;
  console.log('showStatusVolume', volumePercent);
  if (volumePercent == 0) {
    htmlString = `<span class="c-card__circle c-card__circle--green"></span>empty`;
  } else if (volumePercent > 90) {
    htmlString = `<span class="c-card__circle c-card__circle--red"></span>full`;
  } else if (volumePercent > 0) {
    htmlString = `<span class="c-card__circle"></span>filled`;
  }
  document.querySelector('.js-status-volume').innerHTML = htmlString;
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getName = function () {
  const url = backend + `/info/`;
  handleData(url, showName, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const calcVolumeToProcent = function (volume) {
  let result = Math.round(Math.abs(((volume - 28.5) * 100) / 16.5));
  result = result > 100 ? 100 : result;
  result = result < 5 ? 0 : result;
  return result;
};

const listenToSockect = function () {
  socketio.on('B2F_live_data', function (payload) {
    console.log('B2F_live_data');
    const volumePercent = calcVolumeToProcent(payload.volume);
    showStatusVolume(volumePercent);
  });
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const HomeInit = function () {
  console.log('HomeInit');
  if (document.querySelector('.js-home-page')) {
    checkToken('home.html');
    listenToSockect();
    getName();
    changeColor();
  }
};

document.addEventListener('DOMContentLoaded', HomeInit);
// #endregion
