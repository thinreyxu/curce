require.config({
  baseUrl: '../../../src/'
});

require(['event'], function (event) {
  var box1 = document.getElementById('box1')
    , box2 = document.getElementById('box2')
    , con = document.getElementById('console');

  event.on(box1, 'mouseenter', function (ev, data) {
    log('enter');
    this.className = 'hover';
  });
  event.on(box1, 'mouseleave', function (ev, data) {
    log('leave');
    this.className = '';
  });

  event.on(box2, 'mouseover', function (ev, data) {
    log('over');
    this.className = 'hover';
  });
  event.on(box2, 'mouseout', function (ev, data) {
    log('out');
    this.className = '';
  });

  function log (msg) {
    con.innerHTML += '<div><time>' + new Date().toLocaleString() + '</time>  ' + msg + '</div>';
    con.scrollTop = con.scrollHeight - con.clientHeight;
  }
});