(function (_exports) {
  if (window.define && define.amd) {
    define(['extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.EventEmitter = init(_exports.extend);
  }

  function init (extend) {

    var Defaults = {
      enabled: true
    };

    function EventEmitter () { }

    EventEmitter.create = function (op) {

      var op = extend({}, Defaults, op);
      var listeners = {};
      
      function on (type, callback, data, context) {
        if (op.enabled) {
          listeners[type] = listeners[type] || [];
          listeners[type].push({
            callback: callback,
            data: data || null,
            context: context || null
          });
        }

        return this;
      }

      function off (type, callback) {
        if (op.enabled) {
          if (typeof type === 'undefined') {
            listeners = {};
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
        }

        return this;
      }

      function emit (type, data, context) {

        var callbacks = listeners[type];
        if (callbacks) {
          for (var i = 0; i < callbacks.length; i++) {
            var listener = callbacks[i];
            var cb = listener.callback,
                ct = context !== undefined? context : listener.context,
                dt = extend({}, listener.data, data);
            var ev = {
              type: type,
              data: dt
            };
            cb.call(ct, ev);
          }
        }
      }

      function enable (enabled) {
        op.enabled = enabled !== undefined ? enabled : true;
      }

      return {
        on: on,
        off: off,
        emit: emit,
        enable: enable
      };
    };

    return EventEmitter;
  }
})(window);