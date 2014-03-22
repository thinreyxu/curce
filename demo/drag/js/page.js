require.config({
  baseUrl: '../../src'
});
require(['drag', 'event', 'dom'], function (drag, event, dom) {

  var desktopSupport = document.hasOwnProperty('onmouseover');
  var mobileSupport = document.hasOwnProperty('ontouchmove');

  var box = document.getElementById('box');
  var left = 0, top = 0, downLeft, downTop;
  drag(box, {
    desktopSupport: desktopSupport,   // 支持桌面端
    mobileSupport: mobileSupport     // 支持移动端
  });
  event.on(box, 'dragstart', function (ev, data) {
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
  event.on(box, 'dragmove', function (ev, data) {
    if (desktopSupport) {
      dom.setStyle(this, {
        left: data.curX - data.startX + downLeft + 'px',
        top: data.curY - data.startY + downTop + 'px'
      });
    }
    else if (mobileSupport) {
      left = data.curX - data.startX + downLeft;
      top = data.curY - data.startY + downTop;
      dom.setStyle(box, {
        '-webkit-transform': 'translate(' + left + 'px, ' + top + 'px)'
      });
    }
    console.log('dragmove');
  });
  event.on(box, 'dragend', function (ev, data) {
    console.log('dragend');
  });
});