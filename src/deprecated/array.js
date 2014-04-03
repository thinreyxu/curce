(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.array = init();
  }

  function init () {
    var arrayProto = Array.prototype
      , oldArrayProtoMethods = ['join', 'pop', 'push', 'concat', 'reverse', 'shift', 'unshift', 'slice', 'splice', 'sort']
      , newArrayProtoMethods = ['filter', 'forEach', 'some', 'every', 'map', 'indexOf', 'lastIndexOf', 'reduce', 'reduceRight']
      , omMethods = ['concat', 'push', 'slice', 'filter', 'map', 'compact']
      , call = Function.prototype.call;

    function NeoArray (arr) {
      if (arr instanceof NeoArray) {
        return arr;
      }
      if (this instanceof NeoArray === false) {
        return new NeoArray(arr);
      }
      this._wrapped = arr || [];
    }

    // 定义新方法
    for (var i = 0; i < newArrayProtoMethods.length; i++) {
      !function (i) {
        var method = newArrayProtoMethods[i];
        if (method in arrayProto) {
          NeoArray[method] = function () {
            return call.apply(arrayProto[method], arguments);
          };
        }
      }(i);
    }
    if (!arrayProto.filter) {
      NeoArray.filter = function filter (arr, callback, context) {
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
      NeoArray.forEach = function forEach (arr, callback, context) {
        context = (context === undefined ? null : context);
        for (var i = 0, len = arr.length; i < len; i++) {
          if (i in arr) {
            callback.call(context, arr[i], i, arr);
          }
        }
      };
    }
    if (!arrayProto.some) {
      NeoArray.some = function some (arr, callback, context) {
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
      NeoArray.every = function every (arr, callback, context) {
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
      NeoArray.map = function map (arr, callback, context) {
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
      NeoArray.indexOf = function indexOf (arr, item, from) {
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
      NeoArray.lastIndexOf = function lastIndexOf (arr, item, from) {
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
      NeoArray.reduce = function reduce (arr, callback, initValue) {
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

    if (!arrayProto.reduce) {
      NeoArray.reduceRight = function reduceRight (arr, callback, initValue) {
        var len = arr.length, i = len - 1;
        if (2 in arguments === false) {
          initValue = arr[i--];
        }
        for (; i >= 0; i--) {
          if (i in arr) {
            initValue = callback.call(null, initValue, arr[i], i, arr);
          }
        }
        return initValue;
      };
    }

    NeoArray.forEachRight = function forEachRight (arr, callback, context) {
      context = (context === undefined ? null : context);
      for (var i = arr.length - 1; i >= 0; i--) {
        if (i in arr) {
          callback.call(context, arr[i], i, arr);
        }
      }
    };

    NeoArray.compact = function compact (arr, hole) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        if (i in arr && (!hole || NeoArray.indexOf(hole, arr[i]) === -1)) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    };

    NeoArray.prototype.value = function () {
      return this._wrapped;
    };
    NeoArray.prototype.result = function () {
      return this._result !== undefined ? this._result : this._wrapped;
    };
    NeoArray.prototype.valueOf = function () {
      return this._wrapped.valueOf();
    };
    NeoArray.prototype.toString = function () {
      return this._wrapped.toString();
    };

    // 添加原型方法
    for (var method in NeoArray) {
      !function (method) {
        if (NeoArray.hasOwnProperty(method) && typeof NeoArray[method] === 'function') {
          if (method in arrayProto) {
            NeoArray.prototype[method] = function () {
              var result = arrayProto[method].apply(this._wrapped, arguments)
                , ret = new NeoArray(this._wrapped);
              ret._result = result;
              return ret;
            };
          }
          else {
            NeoArray.prototype[method] = function () {
              var result = NeoArray[method].apply(this._wrapped, [this._wrapped].concat(arrayProto.slice.call(arguments)))
                , ret = new NeoArray(this._wrapped);
              ret._result = result;
              return ret;
            };
          }
        }
      }(method);
    }
    for (var i = 0; i < omMethods.length; i++) {
      !function () {
        var method = omMethods[i];
        if (method in arrayProto) {
          NeoArray.prototype[method + '_'] = function () {
            return new NeoArray(arrayProto[method].apply(this._wrapped, arguments));
          }
        }
        else {
          NeoArray.prototype[method + '_'] = function () {
            return new NeoArray(NeoArray[method].apply(this._wrapped, [this._wrapped].concat(arrayProto.slice.call(arguments))));
          }
        }
      }();
    }
    // 处理旧 Array 方法
    for (var i = 0; i < oldArrayProtoMethods.length; i++) {
      !function () {
        var method = oldArrayProtoMethods[i];
        NeoArray[method] = function () {
          return call.apply(arrayProto[method], arguments);
        };
        NeoArray.prototype[method] = function () {
          var result = arrayProto[method].apply(this._wrapped, arguments)
            , ret = new NeoArray(this._wrapped);
          ret._result = result;
          return ret;
        };
      }(i);
    }

    return NeoArray;
  }
})(window);