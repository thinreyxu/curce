(function (_exports) {
  if (window.define) {
    define(['uuid', 'extend', 'querystring', 'url'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.ajax = init(_exports.uuid, _exports.extend, _exports.querystring, _exporsts.url);
  }

  function init (uuid, extend, querystring, ourl) {

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
        , cors = false
        , curlocation
        , reqLocation
        , xhr;

      // 处理参数url
      if (typeof url === 'object') {
        options = url;
        url = options.url;
      }

      // 判断跨域请求
      if (ourl.isAbs(url)) {
        curLocation = ourl.location();
        reqLocation = ourl.parse(url);
        
        // 填补默认端口
        for (var i = 0, loc = [curLocation, reqLocation]; i < loc.length; i++) {
          if (!loc[i].port) {
            switch (loc[i].protocol) {
              case 'http:':   loc[i].port = '80'; break;
              case 'https:':  loc[i].port = '443'; break;
            }
          }
        }

        if (reqLocation.protocol !== curLocation.protocol
          || reqLocation.hostname !== curLocation.hostname
          || reqLocation.port !== curLocation.port) {
          cors = true;
        }
      }

      // 创建xhr对象
      xhr = create_xhr(cors);

      // 无法创建xhr对象，结束ajax()
      if (xhr === null) {
        throw new Error('Cannot create XHR object.');
        return;
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

      // 设置xhr属性
      if (s.xhrFields) {
        for (var i in s.xhrFields) {
          xhr[i] = s.xhrFields[i];
        }
      }

      // 连接服务器
      xhr.open(s.method, url, s.async, s.username, s.password);

      // 设置请求体数据类型
      if ((s.method === 'POST' || s.method === 'PUT') && s.data) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      }

      // 设置请求头
      if (s.headers && xhr.setRequestHeader) {
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
        // ie 的 xdr 也会使用 onload 和 onerror
        xhr.onload = onLoad;
        xhr.onerror = onError;
      }
      else {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            onLoad();
          }
        };
      }

      // 完成处理
      function onLoad () {
        onComplete();
        if (xhr.status >=200 && xhr.status < 300 || xhr.status === 304)
        {
          s.success && s.success.call(s.context, xhr.responseText, xhr);
        }
        else {
          s.error && s.error.call(s.context, new Error('error'), xhr);
        }
      }
      function onError () {
        onComplete();
        s.error && s.error.call(s.context, new Error('error'), xhr);
      }
      function onComplete () {
        complete = true;
        timer && clearTimeout(timer);
      }

      // 取消处理
      function abort (message) {
        if (!complete && !aborted) {
          onComplete();
          aborted = true;
          message = message || 'abort';
          xhr.abort();
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
    function create_xhr (cors) {
      var xhr = {};
      var progIDs = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
      if (window.XMLHttpRequest) {
        create_xhr = function (cors) {
          return !cors ? new XMLHttpRequest() :
            (typeof create_coxhr === 'function' ? create_coxhr() : null);
        };
      }
      else if (window.ActiveXObject) {
        var i = 0;
        while (progIDs[i]) {
          try {
            new ActiveXObject(progIDs[i]);
            create_xhr = function (cors) {
              return !cors ? new ActiveXObject(progIDs[i]) :
                (typeof create_coxhr === 'function' ? create_coxhr() : null);
            };
            break;
          }
          catch (ex) { i++; }
        }
      }
      else {
        create_xhr = function (cors) {
          return null;
        };
      }
      
      return create_xhr(cors);
    }

    // 创建支持跨域的xhr对象
    function create_coxhr () {
      if (window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
        create_coxhr = function () {
          return new XMLHttpRequest();
        };
      }
      else if (window.XDomainRequest) {
        create_coxhr = function () {
          return new XDomainRequest();
        };
      }
      else {
        create_coxhr = function () {
          return null;
        };
      }

      return create_coxhr();
    }

    return ajax;
  }

})(window);
