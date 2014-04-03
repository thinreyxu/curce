require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/event/event', 'curce/event/event.ready'], function (event) {
  event.on(document, 'ready', function (ev) {
    console.log('ready');
  });

  event.on(document, 'DOMContentLoaded', function (ev) {
    console.log('DOMContentLoaded');
  });
});