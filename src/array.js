(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.array = init();
  }

  function init () {

    var arrayProto = Array.prototype,
        methods = 'join pop push concat reverse shift unshift slice splice sort filter forEach some every map indexOf lastIndexOf reduce reduceRight'.split(' '),
        newArrayProtoMethods = 'filter forEach forEachRight some every map indexOf lastIndexOf reduce reduceRight'.split(' ');

    function NeoArray () {}

    // 添加现有的方法
    forEach(methods, function (name) {
      if (name in arrayProto) {
        var fn = arrayProto[name];
        NeoArray[name] = function (array) {
          args = arrayProto.slice.call(arguments, 1);
          return fn.apply(array, args);
        };
      }
    });

    /**
     * [forEach]
     */
    function forEach (array, callback) {
      var len = array.length;
      for (var i = 0; i < array.length; i++) {
        callback.call(array, array[i], i, array);
        i -= len - array.length;
        len = array.length;
      }
    }

    function forEachRight (array, callback) {
      for (var i = len - 1; i >= 0; i--) {
        callback.call(array, array[i], i, array);
      }
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
          if (isNaN(item) && typeof item === 'number' &&
              isNaN(arr[i]) && typeof arr[i] === 'number' ||
              item === arr[i] && i in arr)
          {
            return i;
          }
        }
        return -1;
      };
    }

    if (!arrayProto.lastIndexOf) {
      NeoArray.lastIndexOf = function lastIndexOf (arr, item, from) {
        var len = arr.length;
        if (from === undefined || from > len - 1) {
          from = len - 1;
        }
        if (from < 0) {
          from = from + len;
        }
        for (var i = from; i >= 0; i--) {
          if (isNaN(item) && typeof item === 'number' &&
              isNaN(arr[i]) && typeof arr[i] === 'number'||
              item === arr[i] && i in arr)
          {
            return i;
          }
        }
        return -1;
      };
    }

    if (!arrayProto.reduce) {
      NeoArray.reduce = function reduce (arr, callback, initValue) {
        var i = 0, len = arr.length;
        if (initValue === undefined) {
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
      NeoArray.reduceRight = function reduceRight (arr, callback, initValue) {
        var len = arr.length, i = len - 1;
        if (initValue === undefined) {
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


    return NeoArray;
  }
})(window);