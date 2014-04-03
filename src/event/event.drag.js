(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/extend', 'curce/event/event'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    init(_exprots.extend, _exports.event);
  }

  function init (extend, event) {

    var processor = {
      beforeAdd: function (listener) {
        if (!listener.el.data || !listener.el.data.dragEnabled) {
          listener.el.data = listener.el.data || {};
          listener.el.data.dragEnabled = true;
          new Drag(listener.el);
        }
      }
    };

    event.extendProcessor('dragstart dragmove dragend', processor);

    var defaults = {
      desktopSupport: 'onmousemove' in document,   // 支持桌面端
      mobileSupport: 'ontouchmove' in document     // 支持移动端
    };

    function Drag (el, op) {

      if (this instanceof Drag === false) {
        return new Drag(el, op);
      }

      this.el = el;
      this.s = extend({}, defaults, op);

      // 桌面端
      if (this.s.desktopSupport) {
        addEventForDesktop(this.el);
      }
      // 移动端
      if (this.s.mobileSupport) {
        addEventForMobile(this.el);
      }
    }

    /**
     * 添加桌面端的支持
     */
    function addEventForDesktop (el) {

      event.on(el, 'mousedown', function (ev_start) {
        ev_start.preventDefault();
        ev_start.stopPropagation();

        var element = document;

        var dragging = false;

        if (el.setCapture) {
          // 支持老版IE
          element = el;
          el.setCapture();
        }

        var evt_start = createEvent('dragstart', ev_start);


        event.on(element, 'mousemove', onmousemove);
        event.on(element, 'mouseup', onmouseup);

        function onmousemove (ev) {
          ev.stopPropagation();

          if (!dragging) {
            dragging = true;
            event.emit(el, evt_start);
          }
          if (dragging) {
            event.emit(el, createEvent('dragmove', ev));
          }
        }

        function onmouseup (ev) {

          ev.stopPropagation();

          if (dragging) {
            dragging = false;
            event.emit(el, createEvent('dragend', ev));
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
    function addEventForMobile (el) {

      var initValues;

      el.data.touchID = undefined;

      event.on(el, 'touchstart', function (ev_start) {

        ev_start.preventDefault();
        ev_start.stopPropagation();
        
        // 只允许跟随第一个手指移动
        if (el.data.touchID !== undefined) {
          return;
        }

        var touch = ev_start.changedTouches[0];
        el.data.touchID = touch.identifier;

        var evt_start = createEvent('dragstart', touch);

        var dragging = false;

        event.on(el, 'touchmove', ontouchmove);
        event.on(el, 'touchend', ontouchend);
        event.on(el, 'touchcancel', ontouchend);

        function ontouchmove (ev) {

          ev.stopPropagation();

          if (!dragging) {
            dragging = true;
            event.emit(el, evt_start);
          }
          var touch = getTouchesById(el.data.touchID, ev.targetTouches);
          if (touch && dragging) {
            event.emit(el, createEvent('dragmove', touch));
          }
        }

        function ontouchend (ev) {

          ev.stopPropagation();

          var touch = getTouchesById(el.data.touchID, ev.changedTouches);
          if (touch) {
            if (dragging) {
              dragging = false;
              event.emit(el, createEvent('dragend', touch));
            }
            el.data.touchID = undefined;
            event.off(el, 'touchmove', ontouchmove);
            event.off(el, 'touchend', ontouchend);
            event.off(el, 'touchcancel', ontouchend);
          }
        }
      }, false);
    }

    function createEvent (type, data) {
      return event.createEvent(type, {
        clientX: data.clientX,
        clientY: data.clientY,
        pageX: data.pageX,
        pageY: data.pageY,
        screenX: data.screenX,
        screenY: data.screenY
      });
    }

    function getTouchesById(identifier, touches) {
      var touch = null;
      for (var i = 0; i < touches.length; i++) {
        if (touches[i].identifier === identifier) {
          touch = touches[i];
          break;
        }
      }
      return touch;
    }
  }
})(window);