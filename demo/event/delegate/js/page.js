require.config({
  baseUrl: '../../../src/'
});

require(['selector', 'event'], function (query, event) {
  var list = query('.list');
  event.on(list[0], 'mouseover', 'li', function (ev) {
    this.className = 'hover';
  });
  event.on(list[0], 'mouseout', 'li', function (ev) {
    this.className = '';
  });
});