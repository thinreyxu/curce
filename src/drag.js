(function (_exports) {
  if (window.define) {
    define(['event'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.drag = init(_exports.event);
  }

  function init (event) {
    function Drag (el, options) {
      if (this instanceof Drag === false) {
        return new Drag(el, options);
      };
      var self = this;
      this.el = el;
      this.s = options || {};
      // 桌面端
      // addEventForDeskop.call(this);
      // 移动端
      addEventForMobile.call(this);
    }

    function addEventForDeskop () {
      var self = this;
      event.on(self.el, 'mousedown', function (ev, data) {
        var startX = ev.clientX
          , startY = ev.clientY
          , element = document;

        event.emit(self.el, 'dragstart', {
          curX: startX,
          curY: startY
        });

        if (self.el.setCapture) {
          element = self.el;
          self.el.setCapture();
        }

        event.on(element, 'mousemove', function (ev, data) {
          event.emit(self.el, 'drag', {
            startX: startX,
            startY: startY,
            curX: ev.clientX,
            curY: ev.clientY,
            offsetX: ev.clientX - startX,
            offsetY: ev.clientY - startY
          });
        });

        event.on(element, 'mouseup', function (ev, data) {
          event.emit(self.el, 'dragend', {
            startX: startX,
            startY: startY,
            curX: ev.clientX,
            curY: ev.clientY,
            offsetX: ev.clientX - startX,
            offsetY: ev.clientY - startY
          });
          if (element.releaseCapture) {
            element.releaseCapture();
          }
          event.off(element, 'mousemove');
          event.off(element, 'mouseup');
        });

        ev.preventDefault();
      });
    }

    function addEventForMobile () {
      var self = this;
      event.on(self.el, 'touchstart', function (ev, data) {
        var startX = ev.targetTouches[0].pageX
          , startY = ev.targetTouches[0].pageY;

        event.emit(self.el, 'dragstart', {
          curX: startX,
          curY: startY
        });

        event.on(self.el, 'touchmove', function (ev, data) {
          var touch = ev.targetTouches[0];
          event.emit(self.el, 'drag', {
            startX: startX,
            startY: startY,
            curX: touch.pageX,
            curY: touch.pageY,
            offsetX: touch.pageX - startX,
            offsetY: touch.pageY - startY
          });
        });

        event.on(self.el, 'touchend', function (ev, data) {
          var touch = ev.changedTouches[0];
          event.emit(self.el, 'dragend', {
            startX: startX,
            startY: startY,
            curX: touch.pageX,
            curY: touch.pageY,
            offsetX: touch.pageX - startX,
            offsetY: touch.pageY - startY
          });
          event.off(self.el, 'touchmove');
          event.off(self.el, 'touchend');
        });

        ev.preventDefault();
      });
    }

    Drag.prototype.on = function (type, selector, handler, data) {
      event.on(this.el, type, selector, handler, data);
      return this;
    }
    Drag.prototype.off = function (type, selector, handler) {
      event.off(this.el, type, selector, handler);
      return this;
    }

    return Drag;
  }
})(window);