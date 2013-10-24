require.config({
  baseUrl: '../../src'
});
require(['drag', 'dom'], function (drag, dom) {
  var box = document.getElementById('box');
  var left = 0, top = 0, downLeft, downTop;
  drag(box)
    .on('dragstart', function (ev, data) {
      if ('onmouseover' in this) {
        downLeft = this.offsetLeft;
        downTop = this.offsetTop;
        dom.setStyle(this, 'position', 'relative');
      }
      else {
        downLeft = left;
        downTop = top;
      }
      console.log('dragstart');
    })
    .on('drag', function (ev, data) {
      if ('onmouseover' in this) {
        dom.setStyle(this, {
          left: data.curX - data.startX + downLeft + 'px',
          top: data.curY - data.startY + downTop + 'px'
        });
      }
      else {
        left = data.curX - data.startX + downLeft;
        top = data.curY - data.startY + downTop;
        dom.setStyle(this, {
          '-webkit-transform': 'translate(' + left + 'px, ' + top + 'px)'
        });
      }
      console.log('drag');
    })
    .on('dragend', function (ev, data) {
      console.log('dragend');
    });
});