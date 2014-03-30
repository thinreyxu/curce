require.config({
  baseUrl: '../../../src'
});

require(['event/event'], function (event) {
  var consoe = document.getElementById('console');
  event.on(document, 'mousewheel', function (ev) {
    ev.preventDefault();
    consoe.innerHTML = 'ev.wheelDelta:' + ev.wheelDelta;
  });

});
