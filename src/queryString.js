(function (exports) {

  var queryString = {
    stringify: function (qs, sep1, sep2) {
      sep1 = sep1 || '&';
      sep2 = sep2 || '=';

      var result = [];

      for (var item in qs) {
        result.push(item + sep2 + qs[item]);
      }

      return result.join(sep1);
    },

    parse: function (str, sep1, sep2) {
      sep1 = sep1 || '&';
      sep2 = sep2 || '=';

      var result = {}, tmp1, tmp2;

      tmp1 = str.split(sep1);
      for (var i = 0; i < tmp1.length; i++) {
        tmp2 = tmp1[i].split(sep2);
        result[tmp2[0]] = tmp2[1];
      }

      return result;
    }
  };

  exports.queryString = queryString;
  return exports;
})(window);