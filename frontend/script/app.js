'use strict';

// #region ***  DOM references                           ***********
const lanIP = `${window.location.hostname}`;
const socketio = io(`//${lanIP}:443`, {
  path: '/socket.io',
  transports: ['websocket'],
});
// je kan // gebruiken zo kan die zelf zoeken naar poort
let backend = `//${lanIP}/api/v1`;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showNotification = function (type, message, title) {
  // type: succes, error, or warning
  if (type === 'success') {
    new Notify({
      title: title,
      text: message,
      status: 'success',
      autoclose: true,
      autotimeout: 5000,
      speed: 500,
      position: 'right bottom',
      customIcon: '<i class="las la-check-circle c-icon"></i>',
    });
  } else if (type === 'warning') {
    new Notify({
      title: title,
      text: message,
      status: 'warning',
      autoclose: true,
      autotimeout: 5000,
      speed: 500,
      position: 'right bottom',
      customIcon: '<i class="las la-exclamation-circle c-icon"></i>',
    });
  } else if (type === 'error') {
    new Notify({
      title: title,
      text: message,
      status: 'error',
      autoclose: true,
      autotimeout: 5000,
      speed: 500,
      position: 'right bottom',
      customIcon: '<i class="las la-times-circle c-icon"></i>',
    });
  }
};

const showApiError = function () {
  showNotification('error', 'Something went wrong while fetching data from the api.');
};


// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
const tokenValid = function (json) {
  // console.log('logged_in_as: ', json.logged_in_as);
}

const callbackTokenError = function () {
  showNotification('error', 'Token is not valid or don\'t have a token!');
  window.location.href = '/index.html';
};
// #endregion

// #region ***  Data Access - get___                     ***********
const checkToken = function (page) {
  const token = localStorage.getItem('access_token');
  localStorage.setItem('page', page);
  const url = backend + `/protected/`;
  handleData(url, tokenValid, callbackTokenError, 'GET', null, token);
}
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToLogo = function () {
  document.querySelectorAll('.js-logo').forEach(function (logo) {
    logo.addEventListener('click', function () {
      // console.log('Clicked logo');
      window.location.href = 'welcome.html';
    });
  });
};

const toggleNav = function () {
  let toggleTrigger = document.querySelectorAll('.js-toggle-nav');
  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      // console.log('Toggle Mobile Nav');
      document.querySelector('body').classList.toggle('has-mobile-nav');
    });
  }
};

const listenToNavBtns = function () {
  const poweroffBtns = document.querySelectorAll('.js-poweroff-btn');
  const openBtns = document.querySelectorAll('.js-open-btn');
  for (const p of poweroffBtns) {
    p.addEventListener('click', function () {
      console.log('poweroff clicked');
      socketio.emit('F2B_buttons',{button: 'poweroff'});
    });
  }
  for (const o of openBtns) {
    o.addEventListener('click', function () {
      console.log('open clicked');
      socketio.emit('F2B_buttons', { button: 'open' });
    });
  }

}

const listenToSocketConnection = function () {
  try {
    socketio.on('connect', function () {
      console.log('verbonden met socket webserver');
    });
  } catch (error) {
    console.log(`socketio don't have connection`);
    showNotification('error', 'Sockect connection lost!');
  }
  socketio.on('B2F_button', function (data) {
    console.log('B2F_button', data);
    const message = data.message;
    if (message == 'poweroff') {
      showNotification('warning', 'Raspberry Pi is going to poweroff!');
    } else if (message == 'opening') {
      showNotification('success', 'Door is open now.');
    }else if (message == 'already opened') {
      showNotification('warning', 'Door is already open.');
    }
  })
   socketio.on('B2F_full_volume', function () {
    if (!document.querySelector('.js-index-page')) {
      showNotification('warning', 'The trash can is full.');
    }
   });
};

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.log('app.js: init');
  listenToSocketConnection();
  toggleNav();
  listenToLogo();
  listenToNavBtns();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion
