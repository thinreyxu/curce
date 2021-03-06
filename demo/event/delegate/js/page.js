require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/event/event'], function (event) {

  var list = document.getElementById('list');
  
  event.on(list, 'mouseenter', 'li', function (ev) {
    ev.delegatedTarget.className = 'hover';
    // console.log('mouse entered');
  });
  
  event.on(list, 'mouseleave', 'li', function (ev) {
    ev.delegatedTarget.className = '';
    // console.log('mouse left');
  });
  
  event.emit(list.children[0].children[0], 'mouseenter');

});