require.config({
  baseUrl: '../../../src'
});
require(['event/event'], function (event) {

  var box = document.getElementById('box');

  event.on(box, 'click', {
    name: 'box'
  },function (ev, data1, data2) {
    var box = ev.currentTarget;

    box.innerHTML = ev.storage.name;
    box.style.color = data1 || '#fff';
    box.style.backgroundColor = data2 || '#333';
  });

  event.emit(box, 'click', 'red', 'green');
});