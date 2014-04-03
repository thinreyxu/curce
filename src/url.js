(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/querystring'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.url = init(_exports.querystring);
  }

  function init (querystring) {
    /*re_url
      [1]:origin
      [2]:protocol
      [3]:host
      [4]:hostname
      [5]:port
      [6]:pathname
      [7]:search
      [8]:hash
    */
    var rurl = /^((?:((?:http|https|file):)\/\/)?(([\w\-]+(?:\.[\w\-]+)*)(?::(\d+))?)?)((?:[\/\w&.]+)*)(\?[\w%\-+.=&]*)?(#[\w\-]*)?$/,
        rprotocol = /^(?:http|https|file):/;

    /**
     * 判断是否为绝对地址
     */
    function isAbs (url) {
      return rprotocol.test(url);
    }

    /**
     * 转换相对地址为绝对地址
     */
    function abs (url) {
      if (!(url = url.replace(/^\s+|\s+$/g, ''))) {
        return '';
      }
      if (isAbs(url)) {
        return url;
      }
      
      var origin = window.location.origin || window.location.href.match(rurl)[1], // lteie8没有origin属性
          paths = window.location.pathname.substring(1, window.location.pathname.lastIndexOf('/')).split('/'),
          length = paths.length,
          relPaths = url.split('/'),
          result;

      if (relPaths[0] === '') {
        result = origin + url;
      }
      else {
        if (relPaths[0] === '.') {
          relPaths.shift();
        }
        else if (relPaths[0] === '..') {
          while (relPaths[0] === '..' && paths.length) {
            relPaths.shift();
            paths.pop();
          }
        }
        result = origin + '/' + paths.concat(relPaths).join('/');
      }
      return result;
    }

    /**
     * 解析 url 字符串为 url 对象
     */
    function parse (surl, parseQueryString) {
      var result = null, tmp;
      parseQueryString = parseQueryString || false;

      if (typeof surl === 'string' && (surl = surl.replace(/^\s+|\s+$/g)) !== ''){
        result = {};
        if (isAbs(surl)) {
          if ((tmp = rurl.exec(surl))) {
            result.origin = tmp[1];
            result.protocol = tmp[2];
            result.host = tmp[3];
            result.hostname = tmp[4];
            result.port = tmp[5];
            result.pathname = tmp[6];
            result.search = tmp[7];
            result.hash = tmp[8];

            if (parseQueryString && result.search) {
              result.query = querystring.parse(result.search.substring(1), true);
            }
          }
          else {
            result = null;
          }
        }
        else {
          result.pathname = surl;
        }
        result.href = surl;
      }
      return result;
    }

    /**
     * 节点 url 对象转换为 url 字符串
     */
    function stringify (ourl) {
      var result = '';

      if (typeof ourl === 'object' && ourl !== null) {
        if (ourl.origin) {
          result += ourl.origin;
        }
        else if (ourl.protocol) {
          if (ourl.host) {
            result += ourl.protocol + '//' + ourl.host;
          }
          else if (ourl.hostname) {
            result += ourl.protocol + '//' + ourl.hostname;
            if (ourl.port) {
              result += ':' + ourl.port;
            }
          }
        }

        if (ourl.pathname) {
          result += ourl.pathname;
        }
        else {
          result += '/';
        }

        if (ourl.search) {
          result += ourl.search;
        }
        else if (ourl.query) {
          result += '?' + querystring.stringify(ourl.query);
        }

        if (ourl.hash) {
          result += ourl.hash;
        }
      }

      return result;
    }

    /**
     * 便捷方法：将当前 location 地址转换为 url 对象
     */
    function location (parseQueryString) {
      parseQueryString = parseQueryString || false;
      return parse(window.location.href, parseQueryString);
    }

    return {
      isAbs: isAbs,
      abs: abs,
      parse: parse,
      stringify: stringify,
      location: location
    };
  }
})(window);