require.config({
  baseUrl: '../../../src'
});
require(['dom', 'event/event', 'event/event.drag'], function (dom, event) {

  var desktopSupport = document.hasOwnProperty('onmouseover');
  var mobileSupport = document.hasOwnProperty('ontouchmove');

  var box = document.getElementById('box');
  var left = 0, top = 0, downLeft, downTop;
  var startX, startY;

  event.on(box, 'dragstart', function (ev) {
    startX = ev.clientX;
    startY = ev.clientY;
    if (desktopSupport) {
      downLeft = this.offsetLeft;
      downTop = this.offsetTop;
      dom.setStyle(this, 'position', 'relative');
    }
    else if (mobileSupport) {
      downLeft = left;
      downTop = top;
    }
    console.log('dragstart');
  });
  event.on(box, 'dragmove', function (ev) {
    if (desktopSupport) {
      dom.setStyle(this, {
        left: ev.clientX - startX + downLeft + 'px',
        top: ev.clientY - startY + downTop + 'px'
      });
    }
    else if (mobileSupport) {
      left = ev.clientX - startX + downLeft;
      top = ev.clientY - startY + downTop;
      dom.setStyle(box, {
        '-webkit-transform': 'translate(' + left + 'px, ' + top + 'px)'
      });
    }
    console.log('dragmove');
  });
  event.on(box, 'dragend', function (ev) {
    console.log('dragend');
  });
});