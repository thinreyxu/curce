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
    QueryString.stringify = function (qs, sep1, sep2) {
      var result = [];

      sep1 = sep1 || '&';
      sep2 = sep2 || '=';

      for (var item in qs) {
        if (qs.hasOwnProperty(item)) {
          result.push(item + sep2 + qs[item]);
        }
      }

      return result.join(sep1);
    };

    // 构建QueryString对象
    QueryString.parse = function (str, sep1, sep2) {
      var result = {}, tmp1, tmp2;

      sep1 = sep1 || '&';
      sep2 = sep2 || '=';

      tmp1 = str.split(sep1);
      for (var i = 0; i < tmp1.length; i++) {
        tmp2 = tmp1[i].split(sep2);
        result[tmp2[0]] = tmp2[1];
      }

      return result;
    };

    return QueryString;
  }
})(window);