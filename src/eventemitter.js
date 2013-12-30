(function (_exports) {
  if (window.define && define.amd) {
    define(['extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.EventEmitter = init(_exports.extend);
  }

  function init (extend) {

    var defaults = {
      enabled: true
    };

    function EventEmitter () {
      this._listeners = {};
    }

    EventEmitter.prototype.on = function (type, callback, data, context) {
      return on.call(this, this._listeners, type, callback, data, context);
    };

    EventEmitter.prototype.off = function (type, callback) {
      return off.call(this, this._listeners, type, callback);
    };

    EventEmitter.prototype.emit = function (type) {
      var data = Array.prototype.slice.call(arguments, 1);
      return emit.apply(this, [this._listeners, type].concat(data));
    };

    EventEmitter.create = function () {
      var listeners = {};
      
      var ret = {};
      ret.on = function (type, callback, data, context) {
        return on.call(this, listeners, type, callback, data, context);
      };
      ret.off = function (type, callback) {
        return off.call(this, listeners, type, callback);
      };
      ret.emit = function (type) {
        var data = Array.prototype.slice.call(arguments, 1);
        return emit.apply(this, [listeners, type].concat(data));
      };

      return ret;
    };

    EventEmitter.extend = function (o, events) {

      if (typeof evetns === 'string') {
        events = [events];
      }
      for (var i = 0; i < events.length; i++) {
        (function (type) {
          var capped = type.charAt(0).toUpperCase() + type.substring(1);
          o['on' + capped] = function (callback, data, context) {
            return this.on.call(this, type, callback, data, context);
          };
        })(events[i]);
      }
    };

    function on (listeners, type, callback, data, context) {
      listeners[type] = listeners[type] || [];
      listeners[type].push({
        callback: callback,
        data: data,
        context: context
      });

      return this;
    }

    function off (listeners, type, callback) {
      if (typeof type === 'undefined') {
        for (var item in listeners) {
          if (listeners.hasOwnProperty(item)) {
            delete listeners[item];
          }
        }
      }
      else if (typeof type === 'function') {
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
        delete listeners[type];
      }
      else if (typeof type === 'string' && typeof callback === 'function') {
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

    function emit (listeners, type) {

      var data = Array.prototype.slice.call(arguments, 2);
      var ls = listeners[type];

      if (ls) {
        for (var i = 0; i < ls.length; i++) {
          var l = ls[i],
              ct = typeof l.context !== 'undefined' ? l.context : this,
              ev = { type: type, data: l.data };

          l.callback.apply(ct, [ev].concat(data));
        }
      }
    }

    return EventEmitter;
  }
})(window);