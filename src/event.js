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
      支持事件代理的注册监听器方法
      -------------------------
      supporting event delegation
    */
    function on (el, type, selector, handler, data) {
      if (typeof selector === 'function') {
        data = handler
        handler = selector;
        selector = undefined;
      }
      var newHandler = makeHandler(el, type, selector, handler, data);
      addEventListener(el, newHandler.type, newHandler.listener);
    }

    function makeHandler (el, type, selector, handler, data) {
      var innerHandler = type in handlerFactories ? 
        handlerFactories[type](handler) :
        handlerFactories['default'](handler);
      type = innerHandler.type || type;

      if (selector) {
        var listener = function (ev) {
          ev = getEventObject(ev, el);
          var targets = query(selector, el);
          for (var i = targets.length - 1; i >= 0; i--) {
            if (dom.contains(targets[i], ev.target, true)) {
              ev.delegateTarget = targets[i];
              ev.currentTarget = el;
              innerHandler(targets[i], ev, data);
            }
          };
        };
        listener.selector = selector;
      }
      else {
        var listener = function (ev) {
          ev = getEventObject(ev, el);
          ev.currentTarget = el;
          innerHandler(el, ev, data);
        };
      }
      listener.el = el;
      listener.type = type;
      listener.handler = handler;
      listener.data = data;
      listeners.push(listener);
      return {
        type: type,
        listener: listener
      };
    }

    /*
      支持事件代理的移除监听器方法
      -------------------------
      event.off(el)
      event.off(el, type)
      event.off(el, type, selector)
      event.off(el, type, selector, hander)
      event.off(el, handler)
      event.off(el, type, handler)
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
      触发事件
      ----------
      触发的事件的冒泡行为，需要加入此功能
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

    // 遍历监听器数组
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

    // 兼容的获取事件对象的方法
    // 还有待在使用过程中对此方法进行修补
    function getEventObject (ev) {
      if (!ev) {
        ev = window.event;
        ev.relatedTarget = ev.toElement || ev.fromElement;
        ev.target = ev.srcElement;
        ev.preventDefault = function () {
          e.returnValue = false;
        };
        ev.stopPropagation = function () {
          e.cancelBubble = true;
        };
      }
      return ev;
    }

    // 兼容的注册事件监听器方法
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

    // 兼容的移除事件监听器方法
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

    // 需要经过特殊处理的事件，例如：
    // mouseenter 需要判断相关元素是不是绑定事件的元素的子元素
    var handlerFactories = {};

    handlerFactories.default = function (handler) {
      return function (context, ev, data) {
        var ret = handler.call(context, ev, data);
        ret === false && ev.preventDefault();
      };
    }

    handlerFactories.mouseenter = function (handler) {
      function listener (context, ev, data) {
        if (!dom.contains(ev.delegateTarget || ev.currentTarget, ev.relatedTarget, true)) {   
          var ret = handler.call(context, ev, data);
          ret === false && ev.preventDefault();
        }
      }
      listener.type = 'mouseover';
      return listener;
    }

    handlerFactories.mouseleave = function (handler) {
      function listener (context, ev, data) {
        if (!dom.contains(ev.delegateTarget || ev.currentTarget, ev.relatedTarget, true)) {   
          var ret = handler.call(context, ev, data);
          ret === false && ev.preventDefault();
        }
      }
      listener.type = 'mouseout';
      return listener;
    }
    return {
      on: on,
      off: off,
      emit: emit
    };
  }
})(window);