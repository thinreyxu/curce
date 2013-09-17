(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.QueryString = init();
  }

  function init () {
    var QueryString = {};

    // 序列化QueryString对象
    QueryString.stringify = function (query, sep1, sep2, encode) {
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

      return result.join(sep1);
    };

    // 构建QueryString对象
    QueryString.parse = function (str, sep1, sep2, decode) {
      var result = {}, tmp1, index;

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

      console.log(sep1, sep2, decode);

      tmp1 = str.split(sep1);
      for (var i = 0; i < tmp1.length; i++) {
        index = tmp1[i].indexOf(sep2);
        if (decode) {
          result[decodeURIComponent(tmp1[i].substring(0, index))] = decodeURIComponent(tmp1[i].substring(index + 1));
        }
        else {
          result[tmp1[i].substring(0, index)] = tmp1[i].substring(index + 1);
        }
      }

      return result;
    };

    return QueryString;
  }
})(window);