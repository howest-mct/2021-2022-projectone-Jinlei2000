// #region ***  DOM references                           ***********
let htmlWelcomePage, htmlUsername, htmlDeleteBtn;
let userid;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showUsername = function (user) {
  htmlUsername.innerHTML = `<h1 class="c-lead c-lead--xl u-mb-sm js-username">Welcome, ${user.name}!</h1>`;
  listenToDeleteBtn()
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
const callbackDeleteUser = function (){
  // console.log('delete user');
  localStorage.removeItem('token');
  localStorage.removeItem('userid');
  window.location.href = 'index.html';
}
// #endregion

// #region ***  Data Access - get___                     ***********
const getUsername = function (userid) {
  const url = backend + `/users/${userid}/`;
  handleData(url, showUsername, showApiError);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
const listenToDeleteBtn = function(){
  htmlDeleteBtn.addEventListener('click', function(){
    // console.log('delete click');
    const url = backend + `/users/${userid}/`;
    handleData(url, callbackDeleteUser, showApiError, 'DELETE');
  })
}

const listenToChangeColor = function () {
  const colorBtns = document.querySelectorAll('.c-color');
  for (const c of colorBtns) {
    c.addEventListener('click', function () {
      // console.log('color clicked');
      if (!this.classList.contains('c-color-active')) {
        const colorBtns = document.querySelectorAll('.c-color');
        colorBtns.forEach(function (btn) {
          btn.classList.remove('c-color-active');
        });
        this.classList.add('c-color-active');
        localStorage.setItem('color', this.value);
        changeColor();
      }
    });
  }
};
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********

// #endregion

const welcomeInit = function () {
  console.log('welcome.js: init');

  

  if (htmlWelcomePage) {
    htmlWelcomePage = document.querySelector('.js-welcome-page');
    htmlUsername = document.querySelector('.js-username');
    htmlDeleteBtn = document.querySelector('.js-delete');
    
    checkToken('welcome.html');
    userid = localStorage.getItem('userid');
    console.log('userid: ', userid);
    getUsername(userid);

    listenToChangeColor();
    changeColor();
  }
};

document.addEventListener('DOMContentLoaded', welcomeInit);
