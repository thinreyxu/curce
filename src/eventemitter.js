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
      var events = {};
      

      function on (type, callback) {
        if (op.enabled) {
          events[type] = events[type] || [];
          events[type].push(callback);
        }

        return this;
      }

      function off (type, callback) {
        if (op.enabled) {
          if (typeof type === 'undefined') {
            events = {};
          }
          else if (typeof type === 'function') {
            callback = type;
            type = undefined;
            for (var item in events) {
              var callbacks = events[item];
              for (var i = 0; i < callbacks.length; i++) {
                if (callbacks[i] === callback) {
                  callbacks.splice(i--, 1);
                }
              }
            }
          }
          else if (typeof type === 'string' && typeof callback === 'undefined' && type in events) {
            delete events[type];
          }
          else if (typeof type === 'string' && typeof callback === 'function') {
            var callbacks = events[type];
            if (callbacks) {
              for (var i = 0; i < callbacks.length; i++) {
                if (callbacks[i] === callback) {
                  callbacks.splice(i--, 1);
                }
              }
            }
          }
        }

        return this;
      }

      function emit (type, data, context) {
        var callbacks = events[type];
        if (callbacks) {
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].call(context, data);
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