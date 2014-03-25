require.config({
  baseUrl: '../../../src'
});

require(['event/event'], function (event) {
  event.on(document, 'mousewheel', function (ev) {
    console.log(ev, ev.detail, ev.wheelDelta);
  });

});
