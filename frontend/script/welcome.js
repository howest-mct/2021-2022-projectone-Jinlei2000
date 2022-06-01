// #region ***  DOM references                           ***********
let htmlWelcomePage, htmlUsername;
let userid;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showUsername = function (user) {
  htmlUsername.innerHTML = `<h1 class="c-lead c-lead--xl u-mb-sm js-username">Welcome, ${user.name}!</h1>`;
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getUsername = function (userid) {
  const url = backend + `/users/${userid}/`;
  handleData(url, showUsername, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********

// #endregion

const welcomeInit = function () {
  console.log('welcome.js: init');

  htmlWelcomePage = document.querySelector('.js-welcome-page');
  htmlUsername = document.querySelector('.js-username');

  if (htmlWelcomePage) {
    checkToken('welcome.html');
    userid = localStorage.getItem('userid');
    console.log('userid: ', userid);
    getUsername(userid);
  }
};

document.addEventListener('DOMContentLoaded', welcomeInit);
