require.config({
  baseUrl: '../../../src/'
});

require(['event/event', 'event/event.ready'], function (event) {
  event.on(document, 'ready', function (ev) {
    console.log('ready');
  });

  event.on(document, 'DOMContentLoaded', function (ev) {
    console.log('DOMContentLoaded');
  });
});