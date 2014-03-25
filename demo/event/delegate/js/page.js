require.config({
  baseUrl: '../../../src/'
});

require(['event/event'], function (event) {
  var list = document.getElementById('list');
  event.on(list, 'mouseenter', 'li', function (ev) {
    this.className = 'hover';
    console.log('mouse entered');
  });
  event.on(list, 'mouseleave', 'li', function (ev) {
    this.className = '';
    console.log('mouse left');
  });
  event.emit(list.children[0].children[0], 'mouseenter');
});