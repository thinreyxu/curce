require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/classlist'], function (classlist) {
  var boxes = document.getElementById('line').getElementsByTagName('li');

  var btn_add = document.getElementById('addClass'),
      btn_remove = document.getElementById('removeClass'),
      btn_toggle = document.getElementById('toggleClass'),
      btn_contains = document.getElementById('containsClass');


  btn_add.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      classlist.add(boxes[i], 'on');
    }
  };
  btn_remove.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      classlist.remove(boxes[i], 'on');
    }
  };
  btn_toggle.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      classlist.toggle(boxes[i], 'on');
    }
  };
  btn_contains.onclick = function () {
    for (var i = 0; i < boxes.length; i++) {
      alert(i + 1 + ':' + classlist.contains(boxes[i], 'on'));
    }
  };
});
