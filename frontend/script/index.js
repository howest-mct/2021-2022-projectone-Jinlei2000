'use strict';

// #region ***  DOM references                           ***********
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showBadgeId = function (badgeid) {
  document.querySelector('.js-input-badgeid').value = badgeid;
}
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
const callbackCreateUser = function (json) {
  const id = json.badgeid;
  if(id > 0){
    showNotification('success', 'user created', 'Signup');
  }
};
// #endregion

// #region ***  Data Access - get___                     ***********
const getBadgeId = function () {
  if (document.querySelector('.js-login').classList.contains('u-hidden-card')) {
    console.log('bagdeid opvragen');
    socketio.emit('F2B_getBadgeId');
  }
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const toggleLogin = function () {
  const btns = document.querySelectorAll('.js-toggle-login');
  for (const btn of btns) {
    btn.addEventListener('click', function () {
      console.log('toggleLogin: click');
      if (!document.querySelector('.js-login').classList.contains('u-hidden-card')) {
        document.querySelector('.js-login').classList.add('u-hidden-card');
        document.querySelector('.js-create').classList.remove('u-hidden-card');
      } else {
        document.querySelector('.js-login').classList.remove('u-hidden-card');
        document.querySelector('.js-create').classList.add('u-hidden-card');
      }
      getBadgeId();
    });
  }
};

const toggleInfoBtn = function () {
  document.querySelector('.js-info-badge-id').addEventListener('click', function () {
    console.log('toggleInfoBtn: click');
    document.querySelector('.c-info__text').classList.toggle('show-info');
  });
};

const listenToSignupBtn = function () {
  document.querySelector('.js-signup-btn').addEventListener('click', function () {
    console.log('signup: click');
    const username = document.querySelector('.js-username').value;
    const password = document.querySelector('.js-password').value;
    const badgeId = document.querySelector('.js-input-badgeid').value;
    if (username.length > 0 && password.length > 0 && badgeId.length > 0) {
      const body = JSON.stringify({
        username: username,
        password: password,
        badgeId: badgeId,
      });
      const url = backend + `/users/`;
      console.log('url: ' + url);
      handleData(url, callbackCreateUser, null, 'POST', body);
    } else {
      // console.log('geen geldige gegevens ingevuld');
      showNotification('error', 'no valid username or password or badge id', 'Signup');
    }
  });
}

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
  socketio.on('B2F_sendBadgeId', function (payload) {
    // console.log('B2F_badgeId: ' + payload.badgeid);
    const badgeid = payload.badgeid;
    showBadgeId(badgeid);
  });
};

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const indexInit = function () {
  console.log('index.js: init');
  if (document.querySelector('.js-index-page')) {
    toggleLogin();
    if (document.querySelector('.js-info-badge-id')) {
      toggleInfoBtn();
    }
    listenToSocket();
    listenToSignupBtn();
  }
};

document.addEventListener('DOMContentLoaded', indexInit);
// #endregion
