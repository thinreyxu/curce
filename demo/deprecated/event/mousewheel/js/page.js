require.config({
  baseUrl: '../../../../src'
});

require(['deprecated/event'], function (event) {

  event.on(document, 'mousewheel', function (ev) {
    console.log(1, ev, ev.detail, ev.wheelDelta);
  });

});
