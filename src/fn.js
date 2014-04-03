(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.fn = init();
  }

  function init () {
    
    var functionProto = Function.prototype,
        methods = 'call apply bind'.split(' '),
        call = Function.prototype.call;

    function NeoFunction () {}

    for (var i = 0; i < methods.length; i++) {
      var name = methods[i];
      if (functionProto.hasOwnProperty(name)) {
        NeoFunction[name] = function (fn) {
          var args = [].slice.call(arguments, 1);
          return functionProto[name].apply(fn, args);
        };
      }
    }

    if (!functionProto.bind) {
      NeoFunction.bind = function (fn, context) {
        if (typeof fn !== "function") {
          return fn;
        }

        var args = [].slice.call(arguments, 2);

        // 保证使用 new _fn()得到的对象是 fn 类型
        function _proto () {}
        _proto.prototype = fn.prototype;

        function _fn () {
          // 保证使用 new _fn() 时，可以正确的初始化
          return fn.apply(this instanceof _proto ? this : context, args.concat([].slice.call(arguments)));
        }
        _fn.prototype = new _proto();

        return _fn;
      };
    }

    return NeoFunction;
  }
})(window);