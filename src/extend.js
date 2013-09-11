(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exprots.extend = init();
  }

  function init () {
    function extend () {
      var length = arguments.length
        , result = arguments[0] || {}
        , arg;

      if (length > 2) {
        for (var i = 1; i < length; i++) {
          arg = arguments[i];
          for (var item in arg) {
            if (arg.hasOwnProperty(item)) {
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