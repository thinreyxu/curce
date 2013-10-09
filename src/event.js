(function (_exports) {
  if (window.define) {
    define(['selector', 'dom', 'extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.event = init(_exports.query, _exports.dom);
  }

  var listeners = [];

  function init (query, dom) {

    /*
      register event listener
      ---------------------------
      supporting event delegation
    */
    function on (el, type, selector, handler, data) {
      if (typeof selector === 'function') {
        data = handler
        handler = selector;
        selector = undefined;
      }
      if (selector) {
        var listener = function (ev) {
          ev = getEventObject(ev, el);
          var targets = query(selector, el);
          for (var i = targets.length - 1; i >= 0; i--) {
            if (dom.contains(targets[i], ev.target, true)) {
              ev.delegateTarget = targets[i];
              var ret = handler.call(targets[i], ev, data);
              ret === false && ev.preventDefault();
            }
          };
        };
        listener.selector = selector;
      }
      else {
        var listener = function (ev) {
          ev = getEventObject(ev, el);
          var ret = hander.call(el, ev);
          ret === false && ev.preventDefault();
        };
      }
      listener.el = el;
      listener.type = type;
      listener.handler = handler;
      listener.data = data;
      listeners.push(listener);
      addEventListener(el, type, listener);
    }

    /*
      remove event listener
      ----------------------
      event.off(el)  直接解除
      event.off(el, type)  直接解除
      event.off(el, type, selector)  获取 handler 后解除
      event.off(el, type, selector, hander)  获取 handler 后解除
      event.off(el, handler)  获取 handler 后解除
      event.off(el, type, handler)  获取 handler 后解除
    */
    function off (el, type, selector, handler) {
      if (typeof selector === 'function') {
        handler = selector;
        selector = undefined;
      }
      if (typeof type === 'function') {
        handler = type;
        type = undefined;
      } 
      eachListener(el, type, selector, handler,
        function (l, i, listeners) {
          removeEventListener(l.el, l.type, l);
          listeners.splice(i, 1);
        }
      );
    }

    /*
      emit event
      ----------
    */
    function emit (el, type, selector, data) {
      eachListener(el, type, selector, handler,
        function (l, i, listeners) {
          var ev = {
            type: l.type,
            currentTarget: l.el,
          };
          if (l.selector) {
            var els = query(l.selector, l.el);
            for (var j = 0, len = els.length; j < len; j++) {
              ev.delegateTarget = ev.target =  els[j];
              typeof els[j][type] === 'function' ?
                els[j][type]() :
                l.call(els[j], ev, extend({}, l.data, data));
            }
          }
          else {
            ev.target = l.el;
            typeof l.el[type] === 'function' ?
              l.el[type]() :
              l.call(l.el, ev, extend({}, l.data, data));
          }
        }
      );
    }

    function eachListener (el, type, selector, handler, callback) {
      for (var i = 0, len = listeners.length; i < len; i++) {
        var l = listeners[i];
        if (l.el !== el) continue;
        if (type && l.type !== type) continue;
        if (selector && l.selector !== selector) continue;
        if (handler && l.handler !== handler) continue;
        callback(l, i, listeners);
        i-= len - listeners.length;
        len = listeners.length;
      }
    }

    function getEventObject (ev) {
      if (!ev) {
        ev = window.event;
        ev.relatedTarget = ev.toElement || ev.fromElement;
        ev.target = ev.srcElement;
        ev.currentTarget = el;
        ev.preventDefault = function () {
          e.returnValue = false;
        };
        ev.stopPropagation = function () {
          e.cancelBubble = true;
        };
      }
      return ev;
    }

    function addEventListener (el, type, handler) {
      if (window.addEventListener) {
        addEventListener = function (el, type, handler) {
          return el.addEventListener(type, handler, false);
        };
      }
      else if (window.attachEvent) {
        addEventListener = function (el, type, handler) {
          return el.attachEvent('on' + type, handler);
        };
      }
      return addEventListener(el, type, handler);
    }

    function removeEventListener (el, type, handler) {
      if (window.removeEventListener) {
        removeEventListener = function (el, type, handler) {
          return el.removeEventListener(type, handler, false);
        };
      }
      else if (window.detachEvent) {
        removeEventListener = function (el, type, handler) {
          return el.detachEvent('on' + type, handler);
        };
      }
      return removeEventListener(el, type, handler);
    }

    return {
      on: on,
      off: off,
      emit: emit
    };
  }
})(window);