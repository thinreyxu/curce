(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exprots.object = init();
  }

  function init () {
    var NeoObject = function () {};
    
    NeoObject.isOfType = isOfType;
    function isOfType (obj, type) {
      return type === getType(obj);
    }

    // 这太不靠谱，只能检验内置类型
    NeoObject.getType = getType;
    function getType (obj) {
      var type = typeof obj;
      if (type !== 'object') {
        return type;
      }
      else {
        var str = Object.prototype.toString.call(obj);
        return str.substring(8, str.length - 1);
      }
    }

    NeoObject.extend = extend;
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

    return NeoObject;
  }
})(window);