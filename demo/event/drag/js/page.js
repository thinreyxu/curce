require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/event/event', 'curce/event/event.drag', 'curce/raf'], function (event) {

  var box = document.getElementById('box');
  var left = 0, top = 0, downLeft, downTop;
  var startX, startY;
  var id;

  event.on(box, 'dragstart', function (ev) {
    ev.stopPropagation();
    startX = ev.clientX;
    startY = ev.clientY;
    downLeft = left;
    downTop = top;

    id = requestAnimationFrame(update);
  });
  
  event.on(box, 'dragmove', function (ev) {
    ev.stopPropagation();
    left = ev.clientX - startX + downLeft;
    top = ev.clientY - startY + downTop;
  });

  event.on(box, 'dragend', function (ev) {
    ev.stopPropagation();
    cancelAnimationFrame(id);
  });

  function update () {
    var transform = Modernizr.prefixed('transform');

    if (Modernizr.csstransforms3d) {
      box.style[transform] =  'translate3d('+left+'px,'+top+'px, 0px)';
    }
    else if (Modernizr.csstransforms) {
      box.style[transform] =  'translate('+left+'px,'+top+'px)';
    }
    else {
      box.style.left = left + 'px';
      box.style.top = top + 'px';
    }
    id = requestAnimationFrame(update);
  }

});