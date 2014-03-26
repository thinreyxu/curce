(function (_exports) {
  if (window.define) {
    define(['event/event', 'extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    init(_exports.event, _exprots.extend);
  }

  function init (event, extend) {

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

      var initValues = getInitValues(el);

      event.on(el, 'mousedown', function (evst) {
        var element = document;

        var dragging = false;

        if (el.setCapture) {
          // 支持老版IE
          element = el;
          el.setCapture();
        }
        else {
          evst.preventDefault();
        }

        event.on(element, 'mousemove', onmousemove);
        event.on(element, 'mouseup', onmouseup);

        function onmousemove (ev) {
          if (!dragging) {
            dragging = true;
            var evt = event.createEvent('dragstart', evst, initValues);
            evt.type = 'dragstart';
            event.emit(el, evt);
          }
          if (dragging) {
            var evt = event.createEvent('dragmove', ev, initValues);
            evt.type = 'dragmove';
            event.emit(el, evt);
          }
        }

        function onmouseup (ev) {
          if (dragging) {
            dragging = false;
            var evt = event.createEvent('dragend', ev, initValues);
            evt.type = 'dragend';
            event.emit(el, evt);
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

      event.on(el, 'touchstart', function (evst) {
        console.log(evst);
        evst.preventDefault();
        // evst.stopPropagation();
        
        // 只允许跟随第一个手指移动
        if (el.data.touchID !== undefined) {
          return;
        }

        var touch = evst.changedTouches[0];
        
        initValues = getInitValues (el, touch);
        el.data.touchID = touch.identifier;

        var dragging = false;

        event.on(el, 'touchmove', ontouchmove);
        event.on(el, 'touchend', ontouchend);
        // event.on(el, 'touchcancel', ontouchend);

        function ontouchmove (ev) {
          if (!dragging) {
            dragging = true;
            var evt = event.createEvent('dragstart', evst, initValues);
            evt.type = 'dragstart';
            event.emit(el, evt);
          }
          var touch = getTouchesById(el.data.touchID, ev.targetTouches);
          if (touch && dragging) {
            initValues = getInitValues (el, touch);
            var evt = event.createEvent('dragmove', ev, initValues);
            evt.type = 'dragmove';
            event.emit(el, evt);
          }
        }

        function ontouchend (ev) {
          var touch = getTouchesById(el.data.touchID, ev.changedTouches);
          if (touch) {
            if (dragging) {
              initValues = getInitValues (el, touch);
              var evt = event.createEvent('dragend', ev, initValues);
              evt.type = 'dragend';
              event.emit(el, evt);
            }
            el.data.touchID = undefined;
            event.off(el, 'touchmove', ontouchmove);
            event.off(el, 'touchend', ontouchend);
            // event.off(el, 'touchcancel', ontouchend);
          }
        }
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

    function getInitValues (el, alternative) {
      return extend(false, {
        target: el,
        delegateTarget: el,
        currentTarget: el
      }, alternative);
    }
  }
})(window);