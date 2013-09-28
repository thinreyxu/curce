(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.fn = init();
  }

  function init () {
    
    var functionProto = Function.prototype
      , oldFunctionProtoMethods = ['call', 'apply']
      , newFunctionProtoMethods = ['bind']
      , call = Function.prototype.call;

    function NeoFunction (func) {
      if (this instanceof NeoFunction === false) {
        return new NeoFunction(func);
      }
      this._wrapped = func;
      this.length = func.length;
      this.name = func.name;
    }

    NeoFunction.prototype.valueOf = function () {
      return this._wrapped.valueOf();
    };

    NeoFunction.prototype.toString = function () {
      return this._wrapped.toString();
    };

    for (var i = 0; i < newFunctionProtoMethods.length; i++) {
      !function () {
        var method = newFunctionProtoMethods[i];
        if (method in functionProto) {
          NeoFunction[method] = function () {
            return call.apply(functionProto[method], arguments);
          };
        }
      }();
    }

    if (!functionProto.bind) {
      NeoFunction.bind = function (NeoFunction, context) {
        var args = Array.prototype.slice.call(arguments, 2);

        function _proto () {}
        _proto.prototype = NeoFunction.prototype;

        function _fn () {
          return NeoFunction.apply(this instanceof _proto ? this : context, args.concat(Array.prototype.slice.call(arguments)));
        }
        _fn.prototype = new _proto();

        return _fn;
      }
    }

    for (var method in NeoFunction) {
      !function (method) {
        if (NeoFunction.hasOwnProperty(method) && typeof NeoFunction[method] === 'function') {
          if (method in functionProto) {
            NeoFunction.prototype[method] = function () {
              return functionProto[method].apply(this._wrapped, arguments);
            }
          }
          else {
            NeoFunction.prototype[method] = function () {
              return NeoFunction[method].apply(this._wrapped, [this._wrapped].concat(Array.prototype.slice.call(arguments)));
            }
          }
        }
      }(method);
    }

    for (var i = 0; i < oldFunctionProtoMethods.length; i++) {
      !function () {
        var method = oldFunctionProtoMethods[i];
        NeoFunction[method] = function () {
          return call.apply(functionProto[method], arguments);
        };
        NeoFunction.prototype[method] = function () {
          return functionProto[method].apply(this._wrapped, arguments);
        };
      }();
    }

    return NeoFunction;
  }
})(window);