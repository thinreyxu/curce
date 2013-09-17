(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.cookie = init();
  }

  function init () {
    function setItem (name, value, expires, path, domain, secure) {
      var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      // 浏览器存储使用的GMT时间,JS的toGMTString()已经废弃，使用toUTCString()代替
      if (expires !== undefined) {
        switch (expires.constructor) {
          case Date:
            expires = expires.toUTCString();
            break;
          case String:
            expires = new Date(expires).toUTCString();
            break;
          case Number:
            expires = new Date(new Date().getTime() + expires * 1000).toUTCString();
            break;
        }
        cookie += '; expires=' + expires;
      }
      path && (cookie += '; path=' + path);
      domain && (cookie += '; domain=' + domain);
      secure && (cookie += '; secure');
      document.cookie = cookie;
    }

    function removeItem (name, path, domain, secure) {
      // 无需判断是否存在名为name的cookie，直接设置失效，浏览器会自动清除
      setItem(name, '', new Date(0), path, domain, secure);
    }

    function getItem (name) {
      var cookies, index, value = '';

      if (document.cookie) {
        cookies = document.cookie.split('; ');
        for (var i = 0; i < cookies.length; i++) {
          // 使用index而不是split()用来消除子cookie的影响
          // 没有使用encodeURIComponent()编码value，value中会有“=”
          index = cookies[i].indexOf('=');
          if (decodeURIComponent(cookies[i].substring(0, index)) === name) {
            value = decodeURIComponent(cookies[i].substring(index + 1));
            break;
          }
        }
      }

      return value;
    }

    function getItems () {
      var cookies, index, result = {};

      if (document.cookie) {
        // 空字符串使用split()会切出一个还有空字符串的数组
        // 所以之前判断document.cookie是否为空
        cookies = document.cookie.split('; ');
        for (var i = 0; i < cookies.length; i++) {
          index = cookies[i].indexOf('=');
          result[decodeURIComponent(cookies[i].substring(0, index))] = decodeURIComponent(cookies[i].substring(index + 1));
        }
      }

      return result;
    }

    // 在火狐上行不通，因为不能只靠name就使一条设置了不同于
    // 当前页面的path和domain，或者设置了secure的cookie失效
    // function clear () {}

    return {
      setItem: setItem,
      removeItem: removeItem,
      getItem: getItem,
      getItems: getItems
    };
  }
})(window);