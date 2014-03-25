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
       * 获取事件对象
       * @param  {Object} ev - 高级浏览器事件对象
       * @return {Object}    - 兼容的浏览器对象
       */
      getEventObject: function (ev) {
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
      }
    };

    return util;
  }
})(window);
