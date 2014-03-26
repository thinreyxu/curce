(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['selector', 'dom', 'extend', 'event/util', 'event/DOMEvent'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.event = init(_exports.query, _exports.dom, _exports.extend, _exports.event_util, _exports.event_DOMEvent);
  }

  function init (query, dom, extend, util, DOMEvent) {

    var listeners = [];     // 事件监听器

    var processors = {};    // 监听器处理器

    var avoidEventType = '';

    var event = {};

    /**
     * [extendProcessor]
     * 扩展处理器
     */
    event.extendProcessor = function extendProcessor (type, processor) {
      var types = type.match(/[\S]+/g) || [];
      for (var i = 0; i < types.length; i++) {
        processors[types[i]] = processor;
      }
    };

    /**
     * [on]
     * 注册监听事件
     * 使用方法： ev.on(el, type[, selector][, data], handler[, context])
     */
    event.on = function on (el, type, selector, data, handler, context) {
      if (typeof selector === 'function') {
        // ( el, type, handler )
        context = data;
        handler = selector;
        data = undefined;
        selector = undefined;
      }
      else if (typeof selector === 'object') {
        // ( el, type, data, handler )
        context = handler;
        handler = data;
        data = selector;
        selector = undefined;
      }
      else if (typeof data === 'function') {
        // ( el, type, selector, handler )
        context = handler;
        handler = data;
        data = null;
      }
      // 创建并添加监听器
      var listener = createEventListener(el, type, selector, data, handler, context);
      addEventListener(listener);
    };

    /**
     * [off]
     * 移除监听器
     * 使用方法：event.off(el[, type[, selector]][, handler])
     */
    event.off = function off (el, type, selector, handler) {
      if (typeof selector === 'function') {
        // ( el, type, handler )
        handler = selector;
        selector = undefined;
      }
      if (typeof type === 'function') {
        // ( el, handler )
        handler = type;
        type = undefined;
        selector = undefined;
      }

      var listener = createEventListener(el, type, selector, null, handler);
      removeEventListener(listener);
    };

    /**
     * [emit]
     * 触发事件
     * 使用方法：
     * 1. event.emit(el, type[, data])
     * 2. event.emit(el, Event[, data])
     */
    event.emit = function emit (el, type, data) {
      var ev;
      if (typeof type === 'object') {
        // (el, Event[, data])
        ev = type;
        type = ev.type;
      }
      else {
        // (el, type[, data]);
        ev = createEvent(type);
        ev.type = type;
      }

      ev.target = el;
      ev.delegateTarget = el;

      // 事件冒泡链
      var bubblePath = [el];
      while(el.parentNode) {
        bubblePath.push(el = el.parentNode);
      }

      // 沿着冒泡链分派事件
      var currentTarget;
      var ontype = 'on' + type;

      while (ev.bubbles && !ev.propagationStopped && (ev.currentTarget = bubblePath.shift() || null)) {

        // 分派注册的事件
        dispatchEvent(ev, data);

        // 触发 0 级 DOM 事件
        if (typeof ev.currentTarget[ontype] === 'function') {
          ev.currentTarget[ontype](ev, data);
        }
      }

      // 触发 click() focus() 等方法
      var tmp;

      if (typeof el[type] === 'function') {
        avoidEventType = type;
        tmp = el[ontype];
        el[ontype] = null;
        el[type]();
        el[ontype] = tmp;
        avoidEventType = '';
      }
    };

    /**
     * [one]
     * 执行一次的监听器
     * 使用方法： event.one(el, type[, selector][, data], handler[, context])
     */
    event.one = function one (el, type, selector, data, handler, context) {
      if (typeof selector === 'function') {
        // ( el, type, handler )
        context = data;
        handler = selector;
        data = undefined;
        selector = undefined;
      }
      else if (typeof selector === 'object') {
        // ( el, type, data, handler )
        context = handler;
        handler = data;
        data = selector;
        selector = undefined;
      }
      else if (typeof data === 'function') {
        // ( el, type, selector, handler )
        context = handler;
        handler = data;
        data = null;
      }
      // 创建并添加监听器
      var listener = createEventListener(el, type, selector, data, handler, context);
      listener.times = 1;
      addEventListener(listener);
    };


    /**
     * [createEvent]
     * 创建事件
     * 使用方法：event.createEvent(type[, ev[, data]])
     */
    event.createEvent = createEvent;

    /**
     * [createEventListener]
     * 创建监听器
     */
    function createEventListener (el, type, selector, data, handler, context) {
      return {
        // bindEl: el,
        // bindType: type,
        // bindHandler: handler,
        // ev: null,
        times: -1, // 监听器执行的次数
        data: data,
        el: el,
        type: type,
        handler: handler,
        selector: selector,
        context: context
      };
    }

    /**
     * [addEventListener]
     * 注册事件监听器
     */
    function addEventListener (listener) {
      // 获取特殊事件的处理器
      var processor = processors[listener.type] || {};

      // 在注册监听器以前调用处理方法
      // 如果不能通过则，返回
      if (processor.beforeAdd && processor.beforeAdd(listener) === false) {
        return;
      }

      // 创建包装后的事件处理函数
      listener.bindHandler = function (ev) {
        // 避免在使用 event.emit() 是调用如 click() 等方法再次执行
        if (avoidEventType && ev.type === avoidEventType) {
          return;
        }

        // 初始化自定义事件对象
        listener.ev = createEvent(ev.type, util.getEventObject(ev));
        listener.ev.delegateTarget = listener.el;
        listener.ev.currentTarget = listener.el;

        // 执行事件监听器
        executeEventListener(listener);
      };

      // 注册事件监听器
      util.addEventListener(listener.bindEl || listener.el, listener.bindType || listener.type, listener.bindHandler || listener.handler);

      // 存储事件监听器
      listeners.push(listener);
    }

    /**
     * [removeEventListener]
     * 移除事件监听器
     */
    function removeEventListener (listener) {
      for (var i = 0; i < listeners.length; i++) {
        var l = listeners[i];
        if (listener.el !== l.el) continue;
        if (listener.type && listener.type !== l.type) continue;
        if (listener.selector && listener.selector !== l.selector) continue;
        if (listener.handler && listener.handler !== l.handler) continue;
        util.removeEventListener(l.bindEl || l.el, l.bindType || l.type, l.bindHandler || l.handler);
        listeners.splice(i--, 1);
      }
    }

    /**
     * [executeEventListener]
     * 执行事件监听器
     */
    function executeEventListener (listener) {
      var processor = processors[listener.type] || {};

      // 委托事件
      if (listener.selector) {
        var els = query(listener.selector, listener.el);
        for (var i = 0; i < els.length; i++) {
          if (dom.contains(els[i], listener.ev.target, true)) {
            listener.ev.currentTarget = els[i];
            // 过滤事件
            if (processor.beforeExecute && processor.beforeExecute(listener) === false) {
              continue;
            }
            var ret = listener.handler.call(listener.context || els[i], listener.ev, listener.data);
            if (ret === false) {
              listener.ev.preventDefault();
            }
          }
        }
      }
      // 非委托事件
      else {
        // 过滤事件
        if (processor.beforeExecute && processor.beforeExecute(listener) === false) {
          return;
        }
        // 调用事件处理函数
        var ret = listener.handler.call(listener.context || listener.el, listener.ev, listener.data);
        if (ret === false) {
          listener.ev.preventDefault();
        }
      }

      // 重置事件对象
      listener.ev = null;

      // 移除已经执行了指定次数的监听器
      if (listener.times > 0 && --listener.times === 0) {
        removeEventListener(listener);
      }
    }

    /**
     * [createEvent]
     * 创建事件
     */
    function createEvent (type, ev, initValues) {
      initValues = initValues || {};
      if (!ev || ev.type === undefined) initValues.type = initValues.type || type;
      if (!ev || ev.bubbles === undefined) initValues.bubbles = initValues.bubbles || true;
      if (!ev || ev.cancelable === undefined) initValues.cancelable = initValues.cancelable || true;
      return DOMEvent.createEvent(type).initEvent(ev, initValues);
    }

    /**
     * [dispatchEvent]
     * 分派事件
     */
    function dispatchEvent (ev, data) {
      var len = listeners.length;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];

        if (ev.currentTarget !== listener.el) continue;
        if (ev.type !== listener.type) continue;

        var allData = extend({}, listener.data, data);

        listener.ev = ev;
        
        executeEventListener(listener);

        // 修正因移除监听器导致的变化
        i -= len - listeners.length;
        len = listeners.length; 
      }
    }


    //////////////////////////////////////
    // processor: mouseenter/mouseleave //
    //////////////////////////////////////
    (function () {
      var processor = {
        beforeAdd: function (listener) {
          listener.bindType = listener.type === 'mouseenter' ? 'mouseover' : 'mouseout';
        },
        beforeExecute: function (listener) {
          var ev = listener.ev;
          var relatedTarget = ev.relatedTarget;
          if (dom.contains(ev.currentTarget, ev.relatedTarget, true)) {
            return false;
          }
          return true;
        }    
      };
      // chrome 自带的 mouseenter/mouseleave 不支持事件委托
      // if ('onmouseenter' in document === false) { 
      event.extendProcessor('mouseenter', processor);
      event.extendProcessor('mouseleave', processor);
      // }
    })();


    //////////////////////////////////////
    // processor: wheel                 //
    // alias: mousewheel DOMMouseScroll //
    //////////////////////////////////////
    (function () {
      var processor = {
        beforeAdd: function (listener) {
          if ('onwheel' in document) {
            listener.bindType = 'wheel';
          }
          else if ('onmousewheel' in document) {
            listener.bindType = 'mousewheel';
          }
          else {
            listener.bindType = 'DOMMouseScroll';
          }
        }
      };

      event.extendProcessor('wheel mousewheel DOMMouseScroll', processor);
    })();

    return event;
  }
})(window);
