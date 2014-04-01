(function (_exports) {
  if (window.define) {
    define(['object'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.querystring = init(_exports.object);
  }

  function init (object) {
    var QueryString = function () {};

    // 序列化 QueryString 对象
    QueryString.stringify = function stringify (query, sep1, sep2, encode) {

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
      encode = encode || false;

      // query 为 QueryString 数组
      if (query instanceof Array) {
        for (var i = 0; i < query.length; i += 2) {
          if (encode) {
            result.push(encodeURIComponent(query[i]) + sep2 + encodeURIComponent(query[i + 1]));
          }
          else {
            result.push(query[i] + sep2 + query[i + 1]);
          }
        }
      }
      // query 为 QueryString 对象
      else {
        object.forEach(query, function (value, name, query) {
          if (query.hasOwnProperty(name)) {
            if (encode) {
              result.push(encodeURIComponent(name) + sep2 + encodeURIComponent(value));
            }
            else {
              result.push(name + sep2 + value);
            }
          }
        });
      }

      return result.join(sep1);
    };

    // 构建 QueryString 对象
    QueryString.parse = function parse (str, sep1, sep2, decode) {
      var result = {};
      parser(str, sep1, sep2, decode, function (key, value) {
        result[key] = value;
      });
      return result;
    };

    // 构建 QueryString 数组
    // Note：plain object 遍历是按书写顺序输出的，
    // 所以无需使用解析成数组以保证顺序的正确，此代码可删除
    QueryString.parseAsArray = function parseAsArray (str, sep1, sep2, decode) {
      var result = [];
      parser(str, sep1, sep2, decode, function (key, value) {
        result.push(key);
        result.push(value);
      });
      return result;
    };

    function parser (str, sep1, sep2, decode, callback) {

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
      decode = decode || false;

      var params = str.split(sep1);
      for (var i = 0; i < params.length; i++) {
        var index = params[i].indexOf(sep2);
        var name = params[i].substring(0, index);
        var value = params[i].substring(index + sep2.length);
        if (decode) {
          callback(decodeURIComponent(name), decodeURIComponent(value));
        }
        else {
          callback(name, value);
        }
      }
    }


    return QueryString;
  }
})(window);