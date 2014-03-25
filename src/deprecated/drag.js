(function (_exports) {
  if (window.define) {
    define(['deprecated/event', 'extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.drag = init(_exports.event, _exports.extend);
  }

  function init (event, extend) {

    var defaults = {
      desktopSupport: true,   // 支持桌面端
      mobileSupport: false     // 支持移动端
    };

    function Drag (el, op) {

      if (this instanceof Drag === false) {
        return new Drag(el, op);
      }

      this.el = el;
      this.s = extend({}, defaults, op);

      // 桌面端
      if (this.s.desktopSupport) {
        addEventForDesktop.call(this);
      }
      // 移动端
      if (this.s.mobileSupport) {
        addEventForMobile.call(this);
      }
    }

    /**
     * 添加桌面端的支持
     */
    function addEventForDesktop () {

      var self = this;

      event.on(self.el, 'mousedown', function (ev) {
        var startX = ev.clientX
          , startY = ev.clientY
          , element = document;

        var dragging = false
          , data = {};

        if (self.el.setCapture) {
          // 支持老版IE
          element = self.el;
          self.el.setCapture();
        }
        else {
          ev.preventDefault();
        }

        event.on(element, 'mousemove', onmousemove);
        event.on(element, 'mouseup', onmouseup);

        function onmousemove (ev) {
          if (!dragging) {
            dragging = true;
            data.startX = startX;
            data.startY = startY;
            event.emit(self.el, 'dragstart', data);
          }
          if (dragging) {
            data.curX = ev.clientX;
            data.curY = ev.clientY;
            event.emit(self.el, 'dragmove', data);
          }
        }

        function onmouseup (ev) {
          if (dragging) {
            dragging = false;
            data.endX = ev.clientX;
            data.endY = ev.clientY;
            event.emit(self.el, 'dragend', data);
          }
          if (element.releaseCapture) {
            element.releaseCapture();
          }
          event.off(element, 'mousemove', onmousemove);
          event.off(element, 'mouseup', onmouseup);
        }
      });
    }

    /**
     * 添加移动端的支持
     */
    function addEventForMobile () {

      var self = this;
      self.touchID = undefined;

      event.on(self.el, 'touchstart', function (ev) {
        ev.preventDefault();
        // ev.stopPropagation();
        
        if (self.touchID !== undefined) {
          return;
        }

        var touch = ev.changedTouches[0];
        self.touchID = touch.identifier;

        var startX = touch.pageX
          , startY = touch.pageY;

        var dragging = false
          , data = {};


        event.on(self.el, 'touchmove', ontouchmove);
        event.on(self.el, 'touchend', ontouchend);
        // event.on(self.el, 'touchcancel', ontouchend);

        function ontouchmove (ev) {
          if (!dragging) {
            dragging = true;
            data.startX = startX,
            data.startY = startY;
            event.emit(self.el, 'dragstart', data);
          }
          var touch = null;
          for (var i = 0; i < ev.targetTouches.length; i++) {
            if (ev.targetTouches[i].identifier === self.touchID) {
              touch = ev.targetTouches[i];
              break;
            }
          }
          if (touch && dragging) {
            data.curX = touch.pageX;
            data.curY = touch.pageY;
            event.emit(self.el, 'dragmove', data);
          }
        }

        function ontouchend (ev) {
          var touch = null;
          for (var i = 0; i < ev.changedTouches.length; i++) {
            if (ev.changedTouches[i].identifier === self.touchID) {
              touch = ev.changedTouches[i]
              break;
            }
          }
          if (touch) {
            if (dragging) {
              data.endX = touch.pageX;
              data.endY = touch.pageY;
              event.emit(self.el, 'dragend', data);
            }
            self.touchID = undefined;
            event.off(self.el, 'touchmove', ontouchmove);
            event.off(self.el, 'touchend', ontouchend);
            // event.off(self.el, 'touchcancel', ontouchend);
          }
        }
      });
    }

    return Drag;
  }
})(window);