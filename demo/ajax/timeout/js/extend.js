(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.extend = init();
  }

  function init () {
    function extend () {
      var deep = true
        , args = [].slice.call(arguments)
        , length
        , result
        , arg;

      (typeof args[0] === 'boolean') && (deep = args.shift());
      result = args.shift();
      length = args.length;

      for (var i = 0; i < length; i++) {
        arg = args[i];
        for (var item in arg) {
          if (arg.hasOwnProperty(item)) {
            if (typeof arg[item] === 'object' && deep) {
              result[item] = extend({}, arg[item]);
            }
            else {
              result[item] = arg[item];
            }
          }
        }
      }

      return result;
    }
    return extend;
  }
})(window);