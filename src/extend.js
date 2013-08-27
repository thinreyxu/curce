(function (exports) {

  exports.extend = extend;

  function extend () {
    if (arguments.length === 0) {
      return;
    }

    if (arguments.length === 1) {
      return arguments[0];
    }

    var result = arguments[0], arg;
    for (var i = 1; i < arguments.length; i++) {
      if (arg = arguments[i]) {
        for (var item in arg) {
          result[item] = arg[item];
        }
      }
    }

    return result;
  }

  return exports;
})(window);