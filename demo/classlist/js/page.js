require.config({
  baseUrl: '../../src/'
});

require(['classlist'], function (classlist) {
  var boxes = document.getElementsByTagName('li');

  var btn_add = document.getElementById('addClass'),
      btn_remove = document.getElementById('removeClass'),
      btn_toggle = document.getElementById('toggleClass'),
      btn_contains = document.getElementById('containsClass');

  btn_add.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      classlist(boxes[i]).add('on');
    }
  }
  btn_remove.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      classlist.remove(boxes[i], 'on');
    }
  }
  btn_toggle.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      classlist(boxes[i]).toggle('on');
    }
  }
  btn_contains.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      alert(classlist(boxes[i]).contains('on'));
    }
  }
});
