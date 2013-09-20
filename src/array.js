(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.array = init();
  }

  function init () {
    var filter, forEach, forEachRight, some, every, map, indexOf, lastIndexOf, reduce, reduceRight
      , methods = {}
      , arrayProto = Array.prototype
      , oldArrayProtoMethods = ["join", "pop", "push", "concat", "reverse", "shift", "unshift", "slice", "splice", "sort"]
      , newArrayProtoMethods = ["filter", "forEach", "forEachRight" "some", "every", "map", "indexOf", "lastIndexOf", "reduce", "reduceRight"]
      , call = Function.prototype.call;

    function NeoArray = function (arr) {
      if (arr instanceof NeoArray) {
        return arr;
      }
      if (this instanceof NeoArray === false) {
        return new NeoArray(arr);
      }
      this._wrapped = arr;
    }

    // 定义未定义的方法
    if (!arrayProto.filter) {
      filter = function filter (arr, callback, context) {
        var result = [];
        context = (context === undefined ? null : context);
        for (var i = 0, len = arr.length; i < len; i++) {
          if (i in arr && callback.call(context, arr[i], i, arr)) {
            result.push(arr[i]);
          }
        }
        return result;
      };
    }
    if (!arrayProto.forEach) {
      forEach = function forEach (arr, callback, context) {
        context = (context === undefined ? null : context);
        for (var i = 0, len = arr.length; i < len; i++) {
          if (i in arr) {
            callback.call(context, arr[i], i, arr);
          }
        }
      };
    }
    if (!arrayProto.forEachRight) {
      forEachRight = function forEachRight (arr, callback, context) {
        context = (context === undefined ? null : context);
        for (var i = arr.length - 1; i >= 0; i--) {
          if (i in arr) {
            callback.call(context, arr[i], i, arr);
          }
        }
      };
    }
    if (!arrayProto.some) {
      some = function some (arr, callback, context) {
        context = (context === undefined ? null : context);
        for (var i = 0, len = arr.length; i < len; i++) {
          if (i in arr) {
            if (callback.call(context, arr[i], i, arr)) {
              return true;
            }
          }
        }
        return false;
      };
    }
    if (!arrayProto.every) {
      every = function every (arr, callback, context) {
        context = (context === undefined ? null : context);
        for (var i = 0, len = arr.length; i < len; i++) {
          if (i in arr) {
            if (!callback.call(context, arr[i], i, arr)) {
              return false;
            }
          }
        }
        return true;
      };
    }
    if (!arrayProto.map) {
      map = function map (arr, callback, context) {
        var result = [], len = arr.length;
        context = (context === undefined ? null : context);
        for (var i = 0; i < len; i++) {
          if (i in arr) {
            result[i] = callback.call(context, arr[i], i, arr);
          }
        }
        return result;
      };
    }
    if (!arrayProto.indexOf) {
      indexOf = function indexOf (arr, item, from) {
        var len = arr.length;
        if (from === undefined || from < 0 && (from = from + len) < 0) {
          from = 0;
        }
        for (var i = from; i < len; i++) {
          if (isNaN(item) && typeof item === 'number' 
            && isNaN(arr[i]) && typeof arr[i] === 'number'
            || item === arr[i] && i in arr) {
            return i;
          }
        }
        return -1;
      }
    }
    if (!arrayProto.lastIndexOf) {
      lastIndexOf = function lastIndexOf (arr, item, from) {
        var len = arr.length
        if (from === undefined || from > len - 1) {
          from = len - 1;
        }
        if (from < 0) {
          from = from + len;
        }
        for (var i = from; i >= 0; i--) {
          if (isNaN(item) && typeof item === 'number' 
            && isNaN(arr[i]) && typeof arr[i] === 'number'
            || item === arr[i] && i in arr) {
            return i;
          }
        }
        return -1;
      };
    }
    if (!arrayProto.reduce) {
      reduce = function reduce (arr, callback, initValue) {
        var i = 0, len = arr.length;
        if (2 in arguments === false) {
          initValue = arr[i++];
        }
        for (; i < len; i++) {
          if (i in arr) {
            initValue = callback.call(null, initValue, arr[i], i, arr);
          }
        }
        return initValue;
      };
    }
    if (!arrayProto.reduceRight) {
      reduceRight = function reduceRight (arr, callback, initValue) {
        var len = arr.length, i = len - 1;
        if (2 in arguments === false) {
          initValue = arr[i--];
        }
        for (; i >= 0; i--) {
          if (i in arr) {
            initValue = callback.call(initValue, arr[i], i, arr);
          }
        }
        return initValue;
      }
    }

    methods = {
      'filter':       filter,
      'forEach':      forEach,
      'some':         some,
      'every':        every,
      'map':          map,
      'indexOf':      indexOf,
      'lastIndexOf':  lastIndexOf,
      'reduce':       reduce,
      'reduceRight':  reduceRight
    };


    // 处理新 Array 方法
    for (var method in newArrayProtoMethods) {
      if (method in arrayProto) {
        NeoArray.prototype[method] = arrayProto[method];
        NeoArray[method] = function () {
          return call.apply(arrayProto[method], arguments);
        }
      }
      else {
        NeoArray.prototype[method] = function () {
          return methods.apply(this._wrapped, [this._wrapped].concatarguments)
        }
        NeoArray[method] = methods[method];
      }
    }

    // 处理旧 Array 方法
    for (var method in oldArrayProtoMethods) {
      NeoArray[method] = function () {
        return Function.prototype.call.apply(arrayProto[method], arguments);
      }
      NeoArray.prototype[method] = function () {
        return arrayProto[method].apply(this._wrapped, arguments);
      };
    }

    return NeoArray;
  }
})(window);