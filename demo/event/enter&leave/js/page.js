require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/event/event'], function (event) {

  var box1 = document.getElementById('box1'),
      box2 = document.getElementById('box2'),
      con = document.getElementById('console');

  event.on(box1, 'mouseenter', function (ev) {
    log('enter');
    this.className = 'box hover';
  });
  event.on(box1, 'mouseleave', function (ev) {
    log('leave');
    this.className = 'box ';
  });

  event.on(box2, 'mouseover', function (ev) {
    log('over');
    this.className = 'box hover';
  });
  event.on(box2, 'mouseout', function (ev) {
    log('out');
    this.className = 'box';
  });

  function log (msg) {
    con.innerHTML += '<div><time>' + new Date().toLocaleString() + '</time>  ' + msg + '</div>';
    con.scrollTop = con.scrollHeight - con.clientHeight;
  }
});