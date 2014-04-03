(function (_exports) {
  if (typeof define === 'function' && define.amd) {
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
     * @param  {String}   type     事件类型，可为空格分割的多个类型名称
     * @param  {Object}   [data]   数据
     * @param  {Function} handler  事件处理器
     * @param  {[type]}   context  this
     */
    EventEmitter.prototype.on = function (type, data, handler, context) {
      if (typeof data === 'function') {
        // ( type, handler, context )
        context = handler;
        handler = data;
        data = undefined;
      }
      on.call(this, this._listeners, type, data, handler, context);
      return this;
    };

    /**
     * 取消订阅
     * @param  {String}   [type]      事件类型
     * @param  {Function} [handler]   事件处理器
     */
    EventEmitter.prototype.off = function (type, handler) {
      if (typeof type === 'function') {
        handler = type;
        type = undefined;
      }
      off.call(this, this._listeners, type, handler);
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
      return this;
    };

    function extendHandler (o, type) {
      var capped = type.charAt(0).toUpperCase() + type.substring(1);
      o['on' + capped] = function (data, handler, context) {
        if (typeof data === 'function') {
          context = handler;
          handler = data;
          data = undefined;
        }
        on.call(this, this._listeners, type, data, handler, context);
        return this;
      };
    }

    /**
     * 订阅
     */
    function on (listeners, type, data, handler, context) {
      var types = type instanceof [].constructor ? type : (type.match(/\S+/g) || []);
      for (var i = 0; i < types.length; i++) {
        type = types[i];
        listeners[type] = listeners[type] || [];
        var listener = {
          type: type,
          handler: handler,
          data: data || null,
          context: context || null
        };
        listeners[type].push(listener);
      }
    }

    /**
     * 取消订阅
     */
    function off (listeners, type, handler) {

      var types;
      if (type instanceof [].constructor) {
        types = type;
      }
      else if (typeof type === 'string' && type !== '*') {
        types = type.match(/\S+/g) || [];
      }
      else if (typeof type === 'undefined' || type === '*') {
        types = [];
        for (var key in listeners) {
          types.push(key);
        }
      }

      for (var i = 0; i < types.length; i++) {
        type = types[i];
        if (type in listeners) {
          if (typeof handler === 'function') {
            // ( listeners, type, handler )
            var handlers = listeners[type];
            for (var j = 0; j < handlers.length; j++) {
              if (handlers[j].handler === handler) {
                handlers.splice(j--, 1);
              }
            }
          }
          else if (typeof handler === 'undefined') {
            // ( listeners, type )
            delete listeners[type];
          }
        }
      }
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
          l.handler.apply(l.context || this, [ev].concat(data));
        }
      }
    }

    return EventEmitter;
  }
})(window);
