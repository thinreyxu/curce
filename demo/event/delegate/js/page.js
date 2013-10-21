require.config({
  baseUrl: '../../../src/'
});

require(['selector', 'event'], function (query, event) {
  var list = query('.list');
  event.on(list[0], 'mouseenter', 'li', function (ev) {
    this.className = 'hover';
    console.log('mouse entered');
  });
  event.on(list[0], 'mouseleave', 'li', function (ev) {
    this.className = '';
    console.log('mouse left');
  });
});