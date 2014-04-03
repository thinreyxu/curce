(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/object'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.extend = init(_exports.object);
  }

  function init (object) {
    
    function extend () {
      var deep = false,
          args = [].slice.call(arguments);

      if (typeof args[0] === 'boolean') {
        deep = args.shift();
      }

      var result = args.shift();

      for (var i = 0; i < args.length; i++) {
        object.forEach(args[i], populate);
      }

      function populate (value, name, arg) {
        if (arg.hasOwnProperty(name)) {
          if (typeof value === 'object' && deep) {
            result[name] = extend({}, value);
          }
          else {
            result[name] = value;
          }
        }
      }

      return result;
    }

    return extend;
  }
})(window);