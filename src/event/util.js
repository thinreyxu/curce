(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.event = _exports.event || {};
    _exports.event_util = init();
  }

  function init () {

    var util = {
      /**
       * 创建事件对象
       * @param  {String} type 事件类型
       * @return {Object}      事件对象
       */
      createEvent: function (type) {
        var ev = {};
        if (document.createEvent) {
          ev = document.createEvent('HTMLEvents');
        }
        else if (document.createEventObject) {
          ev = document.createEventObject();
        }
        this.initEvent(ev, type, true, true);
        return ev;
      },

      /**
       * 初始化事件对象
       * @param  {Object}   ev          事件对象
       * @param  {String}   type        事件类型
       * @param  {Boolean}  bubbles     事件是否冒泡
       * @param  {Boolean}  cancelable  事件是否取消
       * @return {Object}               初始化后的对象
       */
      initEvent: function (ev, type, bubbles, cancelable) {
        if (typeof type !== 'string') return;
        if (typeof bubbles !== 'boolean') bubbles = true;
        if (typeof cancelable !== 'boolean') cancelable = true;
        if (ev.initEvent) {
          ev.initEvent(type, bubbles, cancelable);
        }
        else {
          ev.type = type;
          ev.bubbles = bubbles;
          ev.cancelable = cancelable;
        }
        return ev;
      },

      /**
       * 获取事件对象
       * @param  {Object} ev - 高级浏览器事件对象
       * @return {Object}    - 兼容的浏览器对象
       */
      getEvent: function (ev) {
        return ev || window.event;
      },

      /**
       * 添加事件监听器
       * @param {HTMLElement} el      监听元素
       * @param {String}      type    事件类型
       * @param {Function}    handler 事件处理
       */
      addEventListener: function (el, type, handler) {
        if (window.addEventListener) {
          this.addEventListener = function (el, type, handler) {
            return el.addEventListener && el.addEventListener(type, handler, false);
          };
        }
        else if (window.attachEvent) {
          this.addEventListener = function (el, type, handler) {
            return el.attachEvent && el.attachEvent('on' + type, handler);
          };
        }
        return this.addEventListener(el, type, handler);
      },

      /**
       * 移除事件监听器
       * @param {HTMLElement} el      监听元素
       * @param {String}      type    事件类型
       * @param {Function}    handler 事件处理
       */
      removeEventListener: function (el, type, handler) {
        if (window.removeEventListener) {
          this.removeEventListener = function (el, type, handler) {
            return el.removeEventListener(type, handler, false);
          };
        }
        else if (window.detachEvent) {
          this.removeEventListener = function (el, type, handler) {
            return el.detachEvent('on' + type, handler);
          };
        }
        return this.removeEventListener(el, type, handler);
      },

      /**
       * 派发事件
       * @param  {HTMLElement}  el    DOM 元素
       * @param  {Object}       ev    事件对象
       */
      dispatchEvent: function (el, ev, altDispatcher) {
        if (el.dispatchEvent) {
          el.dispatchEvent(ev);
        }
        else if (el.fireEvent) {
          try {
            // 触发自定义事件时,在IE678中会报错
            el.fireEvent('on' + ev.type, ev);
          }
          catch (err) {
            altDispatcher && altDispatcher.call(el, el, ev);
          }
        }
      }
    };

    return util;
  }
})(window);
