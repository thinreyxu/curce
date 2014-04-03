(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/selector', 'curce/dom', 'curce/extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.event = init(_exports.query, _exports.dom);
  }

  var listeners = [];

  function init (query, dom, extend) {

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
      newHandler && addEventListener(el, newHandler.type, newHandler);
    }

    function makeHandler (el, type, selector, handler, data) {
      var innerHandler = (!(type in handlerFactories) ? handler :
        handlerFactories[type](el, type, selector, handler, data));

      if (!innerHandler) {
        return;
      }

      if (selector) {
        var listener = function (ev, data) {
          ev = getEventObject(ev, el);
          var targets = query(selector, el);
          for (var i = targets.length - 1; i >= 0; i--) {
            if (dom.contains(targets[i], ev.target, true)) {
              ev.delegateTarget = targets[i];
              ev.currentTarget = el;
              innerHandler.call(targets[i], ev, data) === false && ev.preventDefault();
            }
          };
        };
        listener.selector = selector;
      }
      else {
        var listener = function (ev, data) {
          ev = getEventObject(ev, el);
          ev.currentTarget = el;
          innerHandler.call(el, ev, data) === false && ev.preventDefault();
        };
      }
      listener.el = el;
      listener.type = innerHandler.type || type;
      listener.handler = handler;
      listener.data = data;
      listeners.push(listener);

      return listener;
    }

    /*
      支持事件代理的移除监听器方法
      -------------------------
      event.off(el)
      event.off(el, type)
      event.off(el, type, selector)
      event.off(el, type, selector, handler)
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
      if (typeof selector === 'object') {
        data = selector,
        selector = undefined
      }
      eachListener(el, type, selector, undefined,
        function (l, i, listeners) {
          var ev = {
            type: l.type,
            currentTarget: l.el
          };
          if (l.selector) {
            var els = query(l.selector, l.el);
            for (var j = 0, len = els.length; j < len; j++) {
              ev.delegateTarget = ev.target =  els[j];
              typeof els[j][type] === 'function' ?
                els[j][type]() : // click(),focus(),blur()
                l.call(els[j], ev, extend({}, l.data, data));
            }
          }
          else {
            ev.target = l.el;
            typeof l.el[type] === 'function' ?
              l.el[type]() : // click(),focus(),blur()
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
        i -= len - listeners.length;
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
      if (ev.detail) {
        ev.wheelDelta = - ev.detail * 40;
      }
      else if (ev.wheelDelta) {
        ev.detail = - ev.wheelDelta / 40;
      }
      return ev;
    }

    // 兼容的注册事件监听器方法
    function addEventListener (el, type, handler) {
      if (window.addEventListener) {
        addEventListener = function (el, type, handler) {
          return el.addEventListener && el.addEventListener(type, handler, false);
        };
      }
      else if (window.attachEvent) {
        addEventListener = function (el, type, handler) {
          return el.attachEvent && el.attachEvent('on' + type, handler);
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

    // handlerFactories.default = function (handler) {
    //   return function (context, ev, data) {
    //     var ret = handler.call(context, ev, data);
    //     ret === false && ev.preventDefault();
    //   };
    // }

    handlerFactories.mouseenter =
    handlerFactories.mouseleave =
    function (el, type, selector, handler, data) {
      function listener (ev, data) {
        if (!dom.contains(ev.delegateTarget || ev.currentTarget, ev.relatedTarget, true)) {   
          return handler.call(this, ev, data);
        }
      }
      
      if (type === 'mouseenter') {
        listener.type = 'mouseover';
      }
      else if (type === 'mouseleave'){
        listener.type = 'mouseout';
      }

      return listener;
    }

    handlerFactories.mousewheel =
    handlerFactories.DOMMouseScroll =
    function (el, type, selector, handler, data) {
      var listener = handler;
      // IE, Safari and Chrome
      if ('onmousewheel' in document) {
        listener.type = 'mousewheel';
      }
      // Firefox
      else {
        listener.type = 'DOMMouseScroll';
      }
      return listener; 
    };

    var readyTest = false
      , readyHandlers = []
      , isReady = false;
    // 对于 DOMContentLoaded 事件，el 只能是 document，
    // 同时 selector 也将不起到任何作用，如果制定了 selector， 它将被忽略
    // 即 DOMContentLoaded 事件不支持事件代理
    handlerFactories.DOMContentLoaded =
    function (el, type, selector, handler, data) {
      // 如果 el 不为 document，不处理此元素的 DOMContentLoaded 事件
      if (el !== document) {
        return;
      }

      // 如果 DOM 已经解析完成，则直接调用事件监听器
      if (document.readyState === 'complete' || isReady === true) {
        setTimeout(function () {
          handler.call(el, {
            type: 'DOMContentLoaded',
            target: el,
            currentTarget: el
          }, data);
        }, 0);
        return;
      }
      
      // 支持 DOMContentLoaded 事件的浏览器绑定该事件
      if (typeof document.addEventListener === 'function') {
        var listener = handler;
        return listener;
      }
      
      // 不支持 DOMContentLoaded 事件的浏览器使用 script 标签
      // 缓存事件监听器
      readyHandlers.push({
        el: el,
        handler: handler,
        data: data
      });
      // 使用 script 标签，检测 dom ready
      if (!readyTest) {
        readyTest = true;
        var head = document.getElementsByTagName('head')[0]
          , script = document.createElement('script');

        script.defer = true;
        script.onreadystatechange = function () {
          if (script.readyState === 'complete') {
            isReady = true;
            head.removeChild(script);
            while (readyHandlers.length) {
              !function (h) {
                setTimeout(function () {
                  h.handler.call(h.el, {
                    target: h.el,
                    currentTarget: h.el,
                    type: 'DOMContentLoaded'
                  }, h.data);
                }, 0);
              }(readyHandlers.shift());
            }
          }
        };
        head.appendChild(script);
      }
    };

    return {
      on: on,
      off: off,
      emit: emit
    };
  }
})(window);