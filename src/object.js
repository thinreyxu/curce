(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exprots.object = init();
  }

  function init () {
    var NeoObject = function () {};
    
    NeoObject.breaker = {};

    NeoObject.forEach = Object.keys ?
    function forEach (obj, callback) {
      if (!obj || typeof obj !== 'object') return;
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var ret = callback.call(obj, obj[name], name, obj);
        if (ret === NeoObject.breaker) {
          break;
        }
      }
    } :
    function forEach (obj, callback) {
      if (typeof obj !== 'object') return;
      for (var name in obj) {
        var ret = callback.call(obj, obj[name], name, obj);
        if (ret === NeoObject.breaker) {
          break;
        }
      }
    };

    NeoObject.keys = Object.keys ?
    Object.keys :
    function keys (obj) {
      var thekeys = [];
      for (var key in obj) {
        thekeys.push(key);
      }
      return thekeys;
    };

    return NeoObject;
  }
})(window);