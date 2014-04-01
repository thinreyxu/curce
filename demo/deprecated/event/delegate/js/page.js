require.config({
  baseUrl: '../../../../src/'
});

require(['selector', 'deprecated/event'], function (query, event) {
  var list = query('.list')[0];
  event.on(list, 'mouseenter', 'li', function (ev) {
    this.className = 'hover';
    console.log('mouse entered');
  });
  event.on(list, 'mouseleave', 'li', function (ev) {
    this.className = '';
    console.log('mouse left');
  });
});