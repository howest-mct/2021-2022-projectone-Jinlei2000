'use strict';

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
    });
  }
};

const toggleInfoBtn = function () {
  document.querySelector('.js-info-badge-id').addEventListener('click', function () {
    console.log('toggleInfoBtn: click');
    document.querySelector('.c-info__text').classList.toggle('show-info');
  });
};

const indexInit = function () {
  console.log('index.js: init');
  toggleLogin();
  if (document.querySelector('.js-info-badge-id')) {
    toggleInfoBtn();
  }
};

document.addEventListener('DOMContentLoaded', indexInit);