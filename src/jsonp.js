(function (exports) {

  exports.jsonp = jsonp;

  var defaults = {
    cbname: 'cb',
    context: null
  };

  function jsonp (url, options, cb) {
    var cbname,
        script,
        head,
        qs,
        s;
    // jsonp(options)
    if (arguments.length === 1 && typeof url === 'object') {
      options = url;
      url = options.url;
      cb = options.cb;
      delete options[url];
      delete options[cb];
    }

    // jsonp(url, fn)
    if (arguments.length === 2 && typeof options === 'function') {
      cb = options;
      options = {};
    }

    s = extend({}, defaults, options);

    cbname = 'cb' + uuid();
    window[cbname] = function (res) {
      cb.call(s.context, res);
      try {
        // ie 78 不支持删除 window 上的属性
        delete window[cbname];
      }
      catch (ex) {
        window[cbname] = undefined;
      }
      script.parentNode.removeChild(script);
    }

    qs = {};
    qs[s.cbname] = cbname;
    qs['t'] = uuid();
    qs = extend(s.data, qs);

    url += url.indexOf('=') !== -1 ? '&' : '?';
    url += queryString.stringify(qs);

    script = document.createElement('script');
    head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    script.src = url;
  }

  return exports;

})(window);