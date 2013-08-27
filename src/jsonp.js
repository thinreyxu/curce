(function (exports) {

  exports.jsonp = jsonp;

  var defaults, requestPool, jsonpcbs;

  defaults = {
    /*
    callback: function () {},
    url: 'http://www.site.com/api/'
    data: { foo: 'bar', baz: 'qux' } or 'foo=bar&baz=qux'
    */
    cbname: 'cb',
    context: null,
    timeout: 0
  };

  requestPool = {
    pool: [],
    add: function (request) {
      var index = -1;
      for (var i = 0; i < this.pool.length; i++) {
        if (this.pool[i].url === request.url) {
          index === i;
          break;
        }
      }
      if (index === -1) {
        this.pool.push(request);
      }
    },
    remove: function (request) {
      for (var i = 0; i < this.pool.length; i++) {
        if (this.pool[i] === request) {
          this.pool.splice(i, 1);
          break;
        }
      }
    },
    abort: function () {
      while(this.pool.length) {
        this.pool.shift().abort();
      }
      this.pool = [];
    }
  }

  /*
    三种调用方式：
    1. jsonp(url, options, success);
    2. jsonp(url, success);
    3. jsonp(options);
  */
  function jsonp (url, options, success) {
    // jsonp(url, success)
    if (arguments.length === 2 && typeof options === 'function') {
      success = options;
      options = {};
    }

    // jsonp(options)
    else if (arguments.length === 1 && typeof url === 'object') {
      options = url;
      url = options.url;
      success = options.success;
      delete options.url;
      delete options.success;
    }

    // TODO: jsonp(url)
    // else if (argumetns.length === 1 && typeof url === 'string') {
    // }

    var request,       // jsonp请求对象
        aborted,       // 是否已经取消请求
        timeoutTimer,  // 超时定时器
        s,             // 设置
        qs,            // 查询字符串对象
        cbname,        // 回调函数名
        head,          // document.head
        script,        // script元素
        requestURL;    // 拼接了查询字符串的url，用于作为requestPool中request的标识

    s = extend({}, defaults, options);  // 深度拷贝对象并存入s中

    // 寄存回调到window上以备调用
    cbname = 'cb' + uuid();
    while (window[cbname]) {
      cbname = 'cb' + uuid();
    }
    window[cbname] = function (data) {
      aborted = true;
      // 清除超时定时器
      clearTimeout(timeoutTimer);
      success && success.call(s.context, data);
      clearRequest(request);
    }

    // 拼接url
    url += url.indexOf('?') !== -1 ? '&' : '?';
    url = requestURL = url + (s.data ? queryString.stringify(s.data) : '');
    url += '&' + s.cbname + '=' + cbname;

    // 创建
    head = document.head || document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.id = cbname;
    script.src = url;
    head.appendChild(script);

    // 设置超时定时器
    if (s.timeout) {
      timeoutTimer = setTimeout(function () {
        aborted = true;
        clearRequest(request);
        s.error && s.error.call(s.context, new Error('Timeout ' + s.timeout));
      });
    }

    // 创建请求对象，并添加到请求池中
    requestPool.add(request = {
      url: requestURL,
      cbname: cbname,
      abort: function () {
        if (!aborted) {
          aborted = true;
          // 清除超时定时器
          clearTimeout(timeoutTimer);
          window[cbname] = function () {
            clearRequest(request);
          };
          s.error && s.error.call(s.context, new Error('Request aborted!'));
        }
      }
    });

    return request;
  }

  jsonp.abort = function () {
    requestPool.abort();
  }

  function clearRequest (request) {
    // 清除script标签
    var script = document.getElementById(request.cbname);
    script && script.parentNode && script.parentNode.removeChild(script);
    script = undefined;

    // 清除寄存在window上的回调
    if (window[request.cbname]) {
      try {
        // ie78 不支持删除 window 上的属性
        delete window[request.cbname];
      }
      catch (ex) {
        window[request.cbname] = undefined;
      }
    }

    // 清除请求池中的请求
    requestPool.remove(this);
  }

  function extend () {
    var deep = true,
        args = [].slice.call(arguments);
    
    if (typeof args[0] === 'boolean') {
      deep = args[0];
      args.unshift();
    }

    for (var i = 1, len = args.length; i < len; i++) {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          if (typeof args[i][key] === 'object') {
            args[0][key] = extend({}, args[i][key]);
          }
          else {
            args[0][key] = args[i][key];
          }
        }
      }
    }

    return args[0];
  }

  function uuid (bits) {
    var id = '';
    
    bits = bits || 8;

    for (var i = 0; i < bits; i++) {
      id += Math.floor(Math.random() * 36).toString(36);
    }

    return id;
  }

  return exports;
})(window);