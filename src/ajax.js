(function (_exports) {
  if (window.define) {
    define(['uuid', 'extend', 'querystring'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.ajax = init(_exports.uuid, _exports.extend, _exports.querystring);
  }

  function init (uuid, extend, querystring) {

    var defaults = {
      method: 'GET',
      async: true,
      data: null,
      context: null,
      timeout: 0
    };

    function ajax (url, options) {
      var s = {}
        , timer = null
        , aborted = false
        , complete = false
        , xhr = create_xhr();

      if (typeof url === 'object') {
        options = url;
        url = options.url;
      }

      // 设置选项
      s = extend(s, defaults, options);
      'url' in s && delete s.url;

      // 序列化数据
      if (s.data && typeof s.data === 'object') {
        s.data = querystring.stringify(s.data);
      }
      s.method = s.method.toUpperCase();

      // 拼接查询字符串
      if ((s.method === 'GET' || s.method === 'DELETE')) {
        url += url.indexOf('&') != -1 ? '&' : '?';
        url += (s.data ? s.data + '&' : '') + 't=' + uuid.uuid();
      }

      // 连接服务器
      xhr.open(s.method, url, s.async, s.username, s.password);

      // 设置请求体数据类型
      if ((s.method === 'POST' || s.method === 'PUT') && s.data) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      }

      // 设置请求头
      if (s.headers) {
        for (var i in s.headers) {
          xhr.setRequestHeader(i, s.headers[i]);
        }
      }

      // 发送数据
      xhr.send(s.data);

      // 超时监听
      if (s.timeout && (s.timeout === +s.timeout)) {
        // 使用xhr的ontimeout，当超时时间为1时，
        // 在Chrome中并不能触发超时，而在firefox中可以，
        // 所以不用xhr的ontimeout，改用定时器。
        timer = setTimeout(function () {
          abort('timeout');
        }, s.timeout);
      }

      // 结果监听
      if ('onload' in xhr && 'onerror' in xhr) {
        xhr.onload = done;
        xhr.onerror = done;
      }
      else {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            done();
          }
        }
      }

      // 完成处理
      function done () {
        complete = true;
        timer && clearTimeout(timer);
        if (xhr.status >=200 && xhr.status < 300 || xhr.status === 304) {
          s.success && s.success.call(s.context, xhr.responseText, xhr);
        }
        else {
          s.error && s.error.call(s.context, new Error('error'), xhr);
        }
      }

      // 取消处理
      function abort (message) {
        if (!complete && !aborted) {
          message = message || 'abort';
          timer && clearTimeout(timer);
          xhr.abort();
          aborted = true;
          s.error && s.error.call(s.context, new Error(message), xhr);
        }
        return this;
      }

      // 返回对象
      return {
        _xhr: xhr,
        url: url,
        abort: abort
      };
    }

    // 创建xhr对象
    function create_xhr () {
      var xhr = {};
      var progIDs = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
        create_xhr = function () {
          return new XMLHttpRequest();
        }
      }
      else if (window.ActiveXObject) {
        var i = 0;
        while (progIDs[i]) {
          try {
            xhr = new ActiveXObject(progIDs[i]);
            create_xhr = function () {
              return new ActiveXObject(progIDs[i]);
            }
            break;
          }
          catch (ex) { i++; }
        }
      }
      else {
        xhr = null;
        create_xhr = function () {
          return null;
        }
      }
      return xhr;
    }

    return ajax;
  }

})(window);