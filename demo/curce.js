(function (exports) {

  var arrproto = Array.prototype;


  /*
    构造函数
    ---------------------------------------------------------------------------
  */

  function curce (arg) {
    
    if (this instanceof curce === false) {
      return new curce(arg);
    }

    switch (typeof arg) {
      case 'function':
        // dom ready
        domready(arg, null, curce);
        break;
      case 'string':
        if (arg.match(/<.+>/)) {
          // createElement
          this.es = arg;
          var m = arg.match(/^<(\w+?)\/?>&/);
          if (m) {
            this.add(document.createElement(m[1]));
          }
          else {
            this.add(createElement(arg));
          }
        }
        else {
          // query by selector
          this.qs = arg;
          this.add(querySelectorAll(arg));
        }
        break;
      case 'object':
        // wrap elements
        this.add(arg);
        break;
    }
  }



  /*
    实例方法
    ---------------------------------------------------------------------------
  */

  // 元素添加
  curce.prototype.add = function (obj) {
    if (obj.length && (obj instanceof NodeList || obj instanceof HTMLCollection || obj instanceof ActiveXObject || obj instanceof Array)) {
      for (var i = 0, len = obj.length; i < len; i++) {
        arrproto.push.call(this, obj[i]);
      }
    }
    else {
      arrproto.push.call(this, obj);
    }
  };



  /*
    私有方法
    ---------------------------------------------------------------------------
  */

  // DOM ready
  var domready = (function () {

    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', readyHandler, false);
    }
    else {
      var script = document.createElement('script');
      var head = document.getElementsByTagName('head')[0];

      script.defer = true;
      script.onreadystatechange = function () {
        if (script.readystate === 'complete') {
          readyHandler();
          head.removeChild(script);
        }
      }

      head.appendChild(script);
    }

    function readyHandler () {
      domready.isReady = true;
      if (domready.callbacks) {
        for (var i = 0, cb; i < domready.callbacks.length; i++) {
          cb = domready.callbacks[i];
          cb.fn.apply(cb.context, cb.args);
        }
      }
    }

    function domready (fn, context) {
      context = context || null;
      args = arrproto.slice.call(arguments, 2);

      var callee = domready;
      
      if (callee.isReady === true) {
        fn.apply(context, args);
      }
      else {
        callee.callbacks = callee.callbacks || [];
        callee.callbacks.push({fn: fn, context: context, args: args})
      }
    }

    return domready;
  })();

  function createElement (str) {

    var container = document.createElement('div');

    container.innerHTML = str;

    return container.children;
  }

  /*
    类方法
    ---------------------------------------------------------------------------
  */

  // 继承
  function inherits (Sup, Sub, methods) {
    
    function Class () {
      if (arguments.length === 0) {
        return;
      }

      Sup.apply(this, arguments);
      Sub.apply(this, arguments);
    }

    Class.prototype = new Sup();
    Class.prototype.constructor = Class;

    if (typeof methods === 'object') {
      for (var name in methods) {
        Class.prototype[name] = methods[name];
      }
    }

    return Class;
  }
  curce.inherits = inherits;

  // 扩展
  function extend () {
    var len = arguments.length;

    if (len === 0) {
      return;
    }

    var result = {}, arg;

    for (var i = 0; i < len; i++) {
      if (arg = arguments[i]) {
        for (var item in arg) {
          result[item] = arg[item];
        }
      }
    }

    return result;
  }
  curce.extend = extend;

  // 混入
  function mixin () {
    if (arguments.length === 0) {
      return;
    }

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      for (item in obj) {
        if (obj.hasOwnProperty(item)) {
          arguments[0][item] = obj[item];
        }
      }
    }

    return arguments[0];
  }
  curce.mixin = mixin;

  // querystring
  var querystring = (function () {

    return {
      // 将对象字符串化
      stringify: function (obj, sep, eq) {
        sep = sep || '&';
        eq = eq || '=';

        var result = [];
        
        for (var item in obj) {
          result.push(item + eq + obj[item].toString());
        }

        return result.join(sep);
      },

      // 解析字符串为对象
      parse: function (str, sep, eq) {
        sep = sep || '&';
        eq = eq || '=';

        var result = {};
        var pairs = str.split(sep);
        
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split(eq);
          result[pair[0]] = pair[1];
        }

        return result;
      }
    };
  })();
  curce.querystring = querystring;

  // uuid
  function uuid () {
    // 返回一个14位16进制串
    var id = new Date().getTime() + Math.random().toString().substring(2, 6);
    id = parseInt(id, 10).toString(16);
    return id;
  }
  curce.uuid = uuid;

  // jsonp
  var jsonp = (function () {

    var defaults = {
      cbname: 'cb',
      context: null
    };

    function jsonp (url, options, cb) {
      // 处理参数
      if (arguments.length === 1 && typeof url === 'object') {
        options = url;
        url = options.url;
        cb = options.cb;
        delete options.url;
        delete options.cb;
      }

      if (arguments.length === 2 && typeof options === 'function') {
        cb = options;
        options = {};
      }

      // 处理设置
      var s = extend (defaults, options);

      // 导出 cb 到全局作用域
      var cbname = s.cbname + uuid();
      window[cbname] = function (res) {
        cb.call(s.context, res);
        delete window[cbname];
      }

      // 处理 querystring
      var qs = {}
      qs[s.cbname] = cbname;
      qs['t'] = uuid();
      qs = extend(s.data, qs);

      // 处理 url
      url += url.indexOf('=') !== -1 ? '&' : '?';
      url += querystring.stringify(qs);

      // 处理 script 元素
      var script = document.createElement('script');
      var head = document.getElementsByTagName('head')[0];
      script.src = url;
      head.appendChild(script);
    }

    return jsonp;
  })();
  curce.jsonp = jsonp;

  // Sandbox
  var sandbox = function () {

    Sandbox.modules = [];


    function Sandbox () {
      var args = arrproto.slice.call(arguments),
          callback = args.pop(),
          modules = (args[0] && typeof args[0] === 'string') ? args : args[0];

      if (this instanceof Sandbox === false) {
        return new Sandbox()
      }

      // 将模块名存入 modules 数组中
      if (!modules || modules = '*') {
        modules = [];
        for (var item in Sandbox.modules) {
          if (Sandbox.modules.hasOwnProperty(item)) {
            modules.push(item);
          }
        }
      }

      for (var i = 0; i < modules.length; i++) {
        Sandbox.modules[modules[i]](this);
      }

      callback(this);
    }

    return Sandbox;
  };
  curce.sandbox = sandbox;

  // pub/sub
  var EA = (function () {
    function EA () {
      this.events = [];
    }

    EA.prototype.on = function (type, fn, context) {
      this.events.push({
        type: type,
        fn: fn,
        context: context || null
      })
    };

    EA.prototype.trigger = function (type) {
      for (var i = 0; i < this.events.length; i++) {
        var e = this.events[i];
        if (e.type === type) {
          e.fn.call(e.context);
        }
      }
    };

    EA.prototype.off = function (type, fn) {
      for (var i = 0; i < this.events.length; i++) {
        var e = this.evetns[i];
        if (e.type === type) {
          if (fn && e.fn === fn || !fn) {
            this.events.splice(i, 1);
          }
        }
      }
    };

    return EA;
  })();
  curce.EA = EA;

  // Form Serialize
  var serializeForm = (function () {

    function serializeForm (form) {
      var elements = form.elements, el;
      var results = [];

      for (var i = 0, len = elements.length; i < len; i++) {
        el = elements[i];

        if (!el.name.length) {
          continue;
        }

        switch (el.type) {
          case undefined:
          case 'button':
          case 'submit':
          case 'reset':
          case 'file':
            break;
          case 'select-one':
            pushSelect (results, el.name, el.options);
            break;
          case 'select-multiple':
            pushSelect (results, el.name + '[]', el.options);
            break;
          case 'radio':
            el.checked && push(results, el.name, el.value);
            break;
          case 'checkbox':
            el.checked && push(results, el.name + '[]', el.value);
            break;
          default:
            push(results, el.name, el.value);
        }
      }

      return results.join('&');
    }

    function pushSelect (arr, name, options) {
      for (var i = 0, len = options.length; i < len; i++) {
        if (options[i].selected === true) {
          push(arr, name, options[i].value || options[i].text);
        }
      }

      return arr;
    }

    function push (arr, name, value) {
      arr.push(name + '=' + encodeURIComponent(value));

      return arr;
    }

    return serializeForm;
  })();
  exports.serializeForm = serializeForm;

  // function onmousewheel (el, fn) {

  //   if ('onmousewheel' in el) {
  //     el.onmousewheel = mousewheelHandler;
  //   }
  //   else if (el.addEventListener) {
  //     el.addEventListener('DOMMouseScroll', mousewheelHandler, false);
  //   }

  //   function mousewheelHandler (e) {

  //     e = e || event;

  //     var delta = e.wheelDelta || -e.detail;
  //     delta = (delta > 0 ? 1 : -1);
  //     fn.call(el, e, delta);

  //     e.preventDefault && e.preventDefault();
  //     return false;
  //   }
  // }
  // exports.onmousewheel = onmousewheel;
  /*
    接口输出
    ---------------------------------------------------------------------------
  */

  // 输出接口
  exports.curce = curce;
  exports.$ = curce;
  exports.extend = extend;
})(window);