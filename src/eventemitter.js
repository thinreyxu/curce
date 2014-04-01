(function (_exports) {
  if (window.define && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.EventEmitter = init();
  }

  function init () {

    var defaults = {
      enabled: true
    };

    function EventEmitter () {
      this._listeners = {};
    }

    /**
     * 订阅
     * @param  {String}   type     事件类型
     * @param  {Object}   [data]   数据
     * @param  {Function} callback 事件处理器
     * @param  {[type]}   context  this
     */
    EventEmitter.prototype.on = function (type, data, callback, context) {
      if (typeof data === 'function') {
        // ( type, callback, context )
        context = callback;
        callback = data;
        data = undefined;
      }
      on.call(this, this._listeners, type, data, callback, context);
      return this;
    };

    /**
     * 取消订阅
     * @param  {String}   [type]      事件类型
     * @param  {Function} [callback]  事件处理器
     */
    EventEmitter.prototype.off = function (type, callback) {
      off.call(this, this._listeners, type, callback);
      return this;
    };

    /**
     * 发布事件
     * @param  {String|Object}  type  事件类型/事件对象 { type: 事件类型 }
     * @param  {...*}           data  数据
     */
    EventEmitter.prototype.emit = function (type, data) {
      data = [].slice.call(arguments, 1);
      emit.apply(this, [this._listeners, type].concat(data));
      return this;
    };

    /**
     * 添加别名方法
     * @param  {Object}           o       宿主对象，通常为某个原型对象
     * @param  {String|String[]}  types   事件名称，可以是字符串或数组
     *                                    为字符串时，可以是空格分割的多个事件名
     */
    EventEmitter.extendHandler = function (o, types) {

      if (typeof types === 'string') {
        types = types.match(/\S+/g) || [];
      }
      for (var i = 0; i < types.length; i++) {
        extendHandler(o, types[i]);
      }
      
    };

    function extendHandler (o, type) {
      var capped = type.charAt(0).toUpperCase() + type.substring(1);
      o['on' + capped] = function (data, callback, context) {
        if (typeof data === 'function') {
          context = callback;
          callback = data;
          data = undefined;
        }
        return on.call(this, this._listeners, type, data, callback, context);
      };
    }

    /**
     * 订阅
     */
    function on (listeners, type, data, callback, context) {
      listeners[type] = listeners[type] || [];

      var listener = {
        type: type,
        callback: callback,
        data: data || null,
        context: context || null
      };
      listeners[type].push(listener);

      return this;
    }

    /**
     * 取消订阅
     */
    function off (listeners, type, callback) {
      if (typeof type === 'undefined') {
        // ( listeners )
        for (var item in listeners) {
          if (listeners.hasOwnProperty(item)) {
            delete listeners[item];
          }
        }
      }
      else if (typeof type === 'function') {
        // ( listeners, callback )
        callback = type;
        type = undefined;
        for (var item in listeners) {
          var callbacks = listeners[item];
          for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i].callback === callback) {
              callbacks.splice(i--, 1);
            }
          }
        }
      }
      else if (typeof type === 'string' && typeof callback === 'undefined' && type in listeners) {
        // ( listeners, type )
        delete listeners[type];
      }
      else if (typeof type === 'string' && typeof callback === 'function') {
        // ( listeners, type, callback )
        var callbacks = listeners[type];
        if (callbacks) {
          for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i].callback === callback) {
              callbacks.splice(i--, 1);
            }
          }
        }
      }

      return this;
    }

    /**
     * 发布事件
     */
    function emit (listeners, type) {
      var ev;
      if (typeof type === 'object')
        ev = type;
      else
        ev = { type: type };

      var data = [].slice.call(arguments, 2);
      var ls = listeners[ev.type];

      if (ls) {
        for (var i = 0; i < ls.length; i++) {
          var l = ls[i];
          l.data && (ev.data = l.data);
          l.callback.apply(l.context || this, [ev].concat(data));
        }
      }
    }

    return EventEmitter;
  }
})(window);
