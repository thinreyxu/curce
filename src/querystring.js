(function (_exports) {
  if (window.define) {
    define(['object', 'array'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.QueryString = init(_exports.object);
  }

  function init (object, array) {
    var QueryString = function () {};

    // 序列化 QueryString 对象
    QueryString.stringify = stringify;
    function stringify (query, sep1, sep2, encode) {
      var result = [];

      switch ('boolean') {
        case typeof sep1:
          encode = sep1;
          sep1 = undefined;
          break;
        case typeof sep2:
          encode = sep2;
          sep2 = undefined;
          break;
      }

      sep1 = sep1 || '&';
      sep2 = sep2 || '=';
      encode = encode === undefined ? false : encode;

      // query 为 QueryString 数组
      if (object.isOfType(query, 'Array')) {
        array.forEach(query, function (item, index) {
          if (encode) {
            result.push(encodeURIComponent(item[0]) + sep2 + encodeURIComponent(item[1]));
          }
          else {
            result.push(item[0] + sep2 + item[1]);
          }
        })
      }
      // query 为 QueryString 对象
      else {
        for (var item in query) {
          if (query.hasOwnProperty(item)) {
            if (encode) {
              result.push(encodeURIComponent(item) + sep2 + encodeURIComponent(query[item]));
            }
            else {
              result.push(item + sep2 + query[item]);
            }
          }
        }
      }

      return result.join(sep1);
    };

    // 构建 QueryString 对象
    QueryString.parse = parse;
    function parse (str, sep1, sep2, decode) {
      var result = {};
      parser(str, sep1, sep2, decode, function (key, value) {
        result[key] = value;
      });
      return result;
    };

    // 构建 QueryString 数组
    // Note：plain object 遍历是按书写顺序输出的，
    // 所以无需使用解析成数组以保证顺序的正确，此代码可删除
    QueryString.parseAsArray = parseAsArray;
    function parseAsArray (str, sep1, sep2, decode) {
      var result = [];
      parser(str, sep1, sep2, decode, function (key, value) {
        result.push([key, value]);
      });
      return result;
    }

    function parser (str, sep1, sep2, decode, callback) {
      var tmp1, index;

      switch ('boolean') {
        case typeof sep1:
          decode = sep1;
          sep1 = undefined;
          break;
        case typeof sep2:
          decode = sep2;
          sep2 = undefined;
          break;
      }

      sep1 = sep1 || '&';
      sep2 = sep2 || '=';
      decode = decode === undefined ? false : decode;

      tmp1 = str.split(sep1);
      for (var i = 0; i < tmp1.length; i++) {
        index = tmp1[i].indexOf(sep2);
        if (decode) {
          callback(decodeURIComponent(tmp1[i].substring(0, index)), decodeURIComponent(tmp1[i].substring(index + 1)));
        }
        else {
          callback(tmp1[i].substring(0, index), tmp1[i].substring(index + 1));
        }
      }
    }


    return QueryString;
  }
})(window);