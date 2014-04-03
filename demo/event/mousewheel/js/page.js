require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/event/event'], function (event) {
  var consoe = document.getElementById('console');
  event.on(document, 'mousewheel', function (ev) {
    ev.preventDefault();
    consoe.innerHTML = 'ev.wheelDelta:' + ev.wheelDelta;
  });

});
