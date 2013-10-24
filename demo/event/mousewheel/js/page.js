require.config({
  baseUrl: '../../../src'
});

require(['event'], function (event) {
  var body = document;

  document.addEventListener('DOMContentLoaded', function (ev) {
    console.log('DOMContentLoaded');
    body.onmousewheel = function (ev) {
      console.log(2, ev);
    };
  }, false);

  // body.addEventListener('mousewheel', function (ev) {
  //   console.log(1, ev);
  // }, false);

  // body.addEventListener('DOMMouseScroll', function (ev) {
  //   console.log(3, ev);
  // }, false);
});