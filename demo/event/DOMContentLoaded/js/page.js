require.config({
  baseUrl: '../../../src/',
  paths: {
    jquery: '../demo/lib/jquery/jquery'
  }
});

require(['jquery', 'event/event', 'event/event.ready'], function ($, event) {
  event.on(document, 'ready', function (ev) {
    console.log('ready');
  });

  $(function () {
    console.log('jquery ready');
  });

  event.on(document, 'DOMContentLoaded', function (ev) {
    console.log('DOMContentLoaded');
  });
});