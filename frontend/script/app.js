'use strict';

const toggleNav = function () {
  let toggleTrigger = document.querySelectorAll('.js-toggle-nav');
  for (let i = 0; i < toggleTrigger.length; i++) {
    toggleTrigger[i].addEventListener('click', function () {
      // console.log('Toggle Mobile Nav');
      document.querySelector('body').classList.toggle('has-mobile-nav');
    });
  }
};

const listenToLogo = function () {
  document.querySelectorAll('.js-logo').forEach(function (logo) {
    logo.addEventListener('click', function () {
      // console.log('Clicked logo');
      window.location.href = 'welcome.html';
    });
  });
};

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

const listenToFilterBtns = function (htmlFilterClass) {
  const btns = document.querySelectorAll(htmlFilterClass);
  for (const btn of btns) {
    btn.addEventListener('click', function () {
      // console.log('filter clicked',this);
      if (!this.classList.contains('c-filter--active')) {
        for (const btn of btns) {
          btn.classList.remove('c-filter--active');
        }
        this.classList.add('c-filter--active');
        // console.log(this.getAttribute('data-filter'));
        // return this.getAttribute('data-filter');
      }
    });
  }
};

const init = function () {
  console.log('app.js: init');
  toggleNav();
  listenToLogo();

  // test
  //  console.log('app.js: click');
  //  document.querySelector('.js-click').addEventListener('click', function () {
  //    showNotification('error', 'je login is gelukt danje!', 'success');
  //  });
};

document.addEventListener('DOMContentLoaded', init);
