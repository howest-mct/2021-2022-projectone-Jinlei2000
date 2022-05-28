'use strict';

// #region ***  DOM references                           ***********
let id;
let exists = false;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showBadgeId = function (badgeid) {
  document.querySelector('.js-input-badgeid').value = badgeid;
};

const showLogin = function () {
  document.querySelector('.js-login').classList.remove('u-hidden-card');
  document.querySelector('.js-create').classList.add('u-hidden-card');
  resetInputsValue();
  // console.log('showLogin');
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
const callbackCreateUser = function (json) {
  const id = json.badgeid;
  showNotification('success', 'user created', 'Signup');
  showLogin();
  socketio.emit('F2B_addNewUser');
};

const callbackCreateUserError = function (json){
  showNotification('error', 'no valid username or password', 'Signup');
}

const callbackCheckBadgeId = function (badges) {
  // console.log('callbackCheckBadgeId: ', badges);
  for (const badge of badges) {
    // console.log(badge.badgeid);
    // console.log(typeof id)
    // console.log(typeof badge.badgeid);
    if (badge.badgeid == id) {
      exists = true;
      // console.log('exists check: ', exists);
      if (!document.querySelector('.js-create').classList.contains('u-hidden-card')) {
        showNotification('error', 'badge id already exists', 'Badge id');
        showLogin();
      }
      break;
    }
  }
};

const callbackLogin = function (json) {
  const id = json.userid;
  // showNotification('success', 'login successful');
  // console.log('userid: ', id);
  socketio.emit('F2B_LoggedInUser');
  window.location.href = `/welcome.html?userid=${id}`;
}

const callbackLoginError = function (json) {
  showNotification('error', 'no valid username, password or user dont exists');
}

// #endregion

// #region ***  Data Access - get___                     ***********
const getAllUsersBadgeId = function () {
  const url = backend + `/users/`;
  handleData(url, callbackCheckBadgeId, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const resetInputsValue = function () {
    document.querySelector('.js-username').value = '';
    document.querySelector('.js-password').value = '';
    document.querySelector('.js-input-badgeid').value = '';
    document.querySelector('.js-username-login').value = '';
    document.querySelector('.js-password-login').value = '';
}

const toggleLogin = function () {
  const btns = document.querySelectorAll('.js-toggle-login');
  for (const btn of btns) {
    btn.addEventListener('click', function () {
      // console.log('toggleLogin: click');
      if (!document.querySelector('.js-login').classList.contains('u-hidden-card')) {
        document.querySelector('.js-login').classList.add('u-hidden-card');
        document.querySelector('.js-create').classList.remove('u-hidden-card');
      } else {
        document.querySelector('.js-login').classList.remove('u-hidden-card');
        document.querySelector('.js-create').classList.add('u-hidden-card');
      }
      resetInputsValue();
    });
  }
};

const toggleInfoBtn = function () {
  document.querySelector('.js-info-badge-id').addEventListener('click', function () {
    // console.log('toggleInfoBtn: click');
    document.querySelector('.c-info__text').classList.toggle('show-info');
  });
};

const listenToSignupBtn = function () {
  document.querySelector('.js-signup-btn').addEventListener('click', function () {
    // console.log('signup: click');
    const username = document.querySelector('.js-username').value;
    const password = document.querySelector('.js-password').value;
    const badgeId = document.querySelector('.js-input-badgeid').value;
    id = badgeId;
    if (exists == false) {
      if (username.length > 0 && password.length > 0 && badgeId.length > 0) {
        const body = JSON.stringify({
          username: username,
          password: password,
          badgeId: badgeId,
        });
        const url = backend + `/users/`;
        // console.log('url: ' + url);
        handleData(url, callbackCreateUser, callbackCreateUserError, 'POST', body);
      } else {
        // console.log('geen geldige gegevens ingevuld');
        showNotification('error', 'no valid username or password or badge id', 'Signup');
      }
    } 
  });
};

const listenToLoginBtn = function () {
  document.querySelector('.js-login-btn').addEventListener('click', function () {
    console.log('login: click');
    const username = document.querySelector('.js-username-login').value;
    const password = document.querySelector('.js-password-login').value;
    if (username.length > 0 && password.length > 0) {
      const url = backend + `/users/login/${username}/${password}/`;
      handleData(url, callbackLogin, callbackLoginError);
    }else{
      showNotification('error', 'username or password is empty', 'Login');
    }
  })
}

const listenToSocket = function () {
  socketio.on('B2F_sendBadgeId', function (payload) {
    // console.log('B2F_badgeId: ', payload);
    const badgeid = payload.badgeid;
    id = badgeid;
    getAllUsersBadgeId();
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
    listenToLoginBtn();
  }
};

document.addEventListener('DOMContentLoaded', indexInit);
// #endregion
