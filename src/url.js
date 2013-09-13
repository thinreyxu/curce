(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.url = init();
  }

  function init () {

    function abs (url) {
      if (!(url = url.replace(/^\s+|\s+$/g, ''))) {
        return '';
      }
      if (isAbs(url)) {
        return url;
      }

      var origin = location.origin,
          paths = location.pathname.substring(1, location.pathname.lastIndexOf('/')).split('/'),
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

    function isAbs (url) {
      var re_absUrl = /^[a-zA-Z]+:\/\//;
      return re_absUrl.test(url);
    }

    return {
      abs: abs
    };
  }
})(window);