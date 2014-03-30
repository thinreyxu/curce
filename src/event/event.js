(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['selector', 'dom', 'extend', 'object', 'event/util'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.event = init(_exports.query, _exports.dom, _exports.extend, _exports.object, _exports.event_util);
  }

  function init (query, dom, extend, object, util) {

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
    event.emit = function emit (el, type) {
      var ev;

      if (typeof type === 'object') {
        ev = type;
        type = ev.type;
      }

      var triggerType = type;
      var processor = processors[type] || {};
      if (processor.transType) {
        triggerType = processor.transType(type);
      }

      if (ev) {
        initEvent(ev, { type: triggerType });
      }
      else {
        ev = createEvent(triggerType);
      }

      var data = [].slice.call(arguments, 2);
      ev.storage = data;  // 使用 data 命名在 IE678 会有问题

      ev.target = el;
      ev.delegatedTarget = el;
      ev.currentTarget = el;

      dispatchEvent(el, ev);
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

      if (processor.transType) {
        listener.bindType = processor.transType(listener.type);
      }

      // 创建包装后的事件处理函数
      listener.bindHandler = function (ev) {

        // 避免在使用 event.emit() 是调用如 click() 等方法再次执行
        if (avoidEventType && ev.type === avoidEventType) {
          return;
        }

        // 初始化自定义事件对象
        listener.ev = initEvent(util.getEvent(ev));
        listener.ev.delegatedTarget = listener.el;
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

      var emitData = listener.ev.storage;  // 派发事件时的数据存储于 ev 之上  // 使用 data 命名在 IE678 会有问题
      listener.ev.storage = listener.data; // 换成注册时的数据  // 使用 data 命名在 IE678 会有问题

      // 委托事件
      if (listener.selector) {

        var els = query(listener.selector, listener.el);
        for (var i = 0; i < els.length; i++) {

          if (dom.contains(els[i], listener.ev.target, true)) {
            listener.ev.delegatedTarget = els[i];
            // 过滤事件
            if (processor.beforeExecute && processor.beforeExecute(listener) === false) {
              continue;
            }
            var ret = listener.handler.apply(listener.context || els[i], [listener.ev].concat(emitData));
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
        var ret = listener.handler.apply(listener.context || listener.el, [listener.ev].concat(emitData));
        if (ret === false) {
          listener.ev.preventDefault();
        }
      }

      // 重置事件对象
      listener.ev.storage = emitData;  // 将派发事件时的数据重新存回 ev,以便事件冒泡  // 使用 data 命名在 IE678 会有问题
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
    function createEvent (type, initValues) {

      var processor = processors[type] || {};
      if (processor.transType) {
        type = processor.transType();
      }

      // 创建事件对象
      var ev = util.createEvent(type);

      initEvent(ev, initValues);

      return ev;
    }

    function initEvent (ev, initValues) {
      
      initValues = initValues || {};

      util.initEvent(
        initValues.type !== undefined ? initValues.type : ev.type,
        initValues.bubbles !== undefined ? initValues.bubbles : ev.bubbles,
        initValues.cancelable !== undefined ? initValues.cancelable : ev.cancelable
      );
      // ev.type = ev.eventType || ev.type || '';
      ev.target = ev.target || ev.srcElement || null;
      ev.currentTarget = ev.currentTarget || null;
      ev.bubbles = ev.bubbles !== undefined ? ev.bubbles : true;
      ev.cancelable = ev.cancelable !== undefined ? ev.cancelable : true;
      ev.timeStamp = ev.timeStamp || new Date().getTime();
      ev.defaultPrevented = ev.defaultPrevented || false;
      ev.isTrusted = ev.isTrusted || true;

      // 鼠标事件
      if (typeNameMap.MouseEvent.indexOf(ev.type) > -1 || typeNameMap.WheelEvent.indexOf(ev.type) > -1) {
        ev.relatedTarget = ev.relatedTarget || (ev.fromElement === ev.target ? ev.toElement : ev.fromElement) || null;
      }

      // 鼠标滚轮事件
      if (typeNameMap.WheelEvent.indexOf(ev.type) > -1) {
        if ('wheelDelta' in ev === false) {
          ev.wheelDelta = ev.wheelDelta || (ev.detail && -40 * ev.detail) || 0;
        }
      }

      ev.propagationStopped = false;
      ev.immediatePropagationStopped = false;

      // preventDefault
      var _preventDefault = ev.preventDefault;
      ev.preventDefault = function () {
        if (_preventDefault) {
          _preventDefault.call(this);
        }
        else {
          this.returnValue = false;
        }
        this.defaultPrevented = true;
      };

      // stopPropagation
      var _stopPropagation = ev.stopPropagation;
      ev.stopPropagation = function () {
        if (_stopPropagation) {
          _stopPropagation.call(this);
        }
        else {
          this.cancelBubble = true;
        }
        this.propagationStopped = true;
      };

      // stopImmediatePropagation
      // 实际上在 IE 中不能停止同一元素上的其他事件处理器的调用,只能停止冒泡
      var _stopImmediatePropagation = ev.stopImmediatePropagation;
      ev.stopImmediatePropagation = function () {
        if (_stopImmediatePropagation) {
          _stopImmediatePropagation.call(this);
        }
        else {
          this.cancelBubble = true;
        }
        this.propagationStopped = true;
        this.immediatePropagationStopped = true;
      };

      // 初始值
      if (typeof initValues === 'object') {
        object.forEach(initValues, function (value, name) {
          if (name === 'type' || name === 'bubbles' || name === 'cancelable') {
            return;
          }
          // console.log(value, name);
          ev[name] = value;
        });
      }
    
      return ev;
    }

    var typeNameMap = {
      'MouseEvent': 'mouseover mouseout mouseenter mouseleave mousedown mouseup mousemove click dbclick',
      'WheelEvent': 'mousewheel wheel DOMMouseScroll',
      'InputEvent': 'beforeinput input',
      'KeyboardEvent': 'keydown keyup keypress',
      'UIEvent': 'load unload abort error select resize scroll DOMActive submit reset change',
      'FocusEvent': 'blur focus focusin focusout DOMFocusIn DOMFocusOut',
      'CompositionEvent': 'compositionstart compositionupdate compositionend',
      'MutationEvent': 'DOMAttrModified DOMCharacterDataModified DOMNodeInserted DOMNodeInsertedIntoDocument DOMNodeRemoved DOMNodeRemovedFromDocument DOMSubtreeModified'
    };

    /**
     * [dispatchEvent]
     * 分派事件
     */
    function dispatchEvent (el, ev) {
      util.dispatchEvent(el, ev, customDispatchEvent);
    }

    function customDispatchEvent (el, ev) {
       // 事件冒泡链
      var bubblePath = [];
      while(el.parentNode) {
        bubblePath.push(el = el.parentNode);
      }

      var ontype = 'on' + ev.type;
      // 沿着冒泡链分派事件
      do {
        // 分派注册的事件
        var len = listeners.length;
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];

          if (ev.currentTarget !== listener.el) continue;
          if (ev.type !== listener.type) continue;

          listener.ev = ev;
          
          executeEventListener(listener);

          // 修正因移除监听器导致的变化
          i -= len - listeners.length;
          len = listeners.length; 
        }

        // 触发 0 级 DOM 事件
        if (typeof ev.currentTarget[ontype] === 'function') {
          ev.currentTarget[ontype](ev, data);
        }
      } while (ev.bubbles && !ev.propagationStopped && (ev.currentTarget = bubblePath.shift() || null));

      // 触发 click() focus() 等方法
      var tmp;

      if (typeof el[ev.type] === 'function') {
        avoidEventType = ev.type;
        tmp = el[ontype];
        el[ontype] = null;
        el[ev.type]();
        el[ontype] = tmp;
        avoidEventType = '';
      }
    }


    //////////////////////////////////////
    // processor: mouseenter/mouseleave //
    //////////////////////////////////////
    (function () {
      var processor = {
        transType: function (type) {
          return type === 'mouseenter' ? 'mouseover' : 'mouseout';
        },
        beforeExecute: function (listener) {
          var ev = listener.ev;
          if (dom.contains(ev.delegatedTarget || ev.currentTarget, ev.relatedTarget, true)) {
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
        transType: function (type) {
          // 不能使用 onwheel 事件,截至写下次注释时,ff 31.0a1 (2014-03-29)
          // 虽然支持 onwheel 事件,可事件对象中却没有和滚动方向有关的值
          if ('onmousewheel' in document) {
            return 'mousewheel';
          }
          else {
            return 'DOMMouseScroll';
          }
        }
      };

      event.extendProcessor('wheel mousewheel DOMMouseScroll', processor);
    })();

    return event;
  }
})(window);
