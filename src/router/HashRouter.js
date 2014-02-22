(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['eventemitter', 'mixin', 'extend', 'router/r2re'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.HashRouter = init(_exports.EventEmitter, _exports.mixin, _exports.extend, _exports.R2RE);
  }

  function init (EventEmitter, mixin, extend, R2RE) {

    var r2re = new R2RE();
    r2re.use(['regexp', 'escapeRegExp', 'namedParam', 'splatParam', 'wildcard']);

    var defaults = {
      silence: false,
      root: '/'
    };

    function Router (op) {
      EventEmitter.call(this);

      this.init(op);
    }

    mixin(Router.prototype, EventEmitter.prototype);
    EventEmitter.extend(Router.prototype, ['route', 'error']);

    Router.prototype.init = function (op) {
      this._started = false;
      this._routes = [];
      this._lastFragment = '';
      this.s = extend({}, defaults, op);

      this.s.root = ('/' + this.s.root + '/').replace(/\/+/g, '/');
    };

    Router.prototype.start = function () {
      if (this._started) {
        return;
      }

      // 注册事件
      var self = this;
      onHashChange(function () {
        route.call(self);
      });
      
      route.call(this, this.s.silence);
    };

    Router.prototype.route = function (route, callback) {
      this._routes.push({
        route: route,
        regexp: r2re.makeRegExp(route),
        callback: callback
      });
    };

    Router.prototype.navigate = function (fragment) {
      setFragment(fragment, this.s.root);
    };

    function onHashChange (callback) {
      if ('onhashchange' in window) {
        window.onhashchange = callback;
      }
      else {
        this._timer = setInterval(callback, 50);
      }
    }

    function route (silence) {
      // 1. 检查 hash 合法
      var isFragmentValid = checkFragment.call(this, this.s.root);
      if (isFragmentValid) {
        // 2. 获取 fragment
        var fragment = getFragment(this.s.root);
        // 3. 加载 fragment
        if (fragment !== this._lastFragment) {
          loadFragment.apply(this, [, silence]);
        }
      }
    }

    function checkFragment (root) {
      var initial = ('#!' + root).replace(/\/$/, '');
      var hash = location.hash;
      if (hash && hash.indexOf(initial) !== 0) {
        this.emit('error', { fragment: '', code: 404 });
        return false;
      }
      return true;
    }
    
    function loadFragment (fragment, silence) {
      fragment = fragment || getFragment(this.s.root);
      this._lastFragment = fragment;
      if (!silence) {
        var routed = false;
        for (var i = 0; i < this._routes.length; i++) {
          var ro = this._routes[i];  // ro = route object
          if (ro.regexp.test(fragment)) {
            routed = true;
            var params = extractParams(fragment, ro.regexp);
            var ret = ro.callback.apply(this, params);
            this.emit('route', {
              fragment: fragment,
              route: ro.route,
              callback: ro.callback,
              params: params
            });
            if (ret === false) break;
          }
        }
        // 处理 404 错误
        if (routed === false) {
          this.emit('error', { fragment: fragment, code: 404 });
        }
      }
    }

    function setFragment (fragment, root) {
      root = root || defaults.root;
      if (fragment.indexOf(root) !== 0) {
        fragment = root + fragment;
      }
      location.hash = ('#!/' + fragment).replace(/\/{2,}/g, '/');
    }

    function getFragment (root) {
      root = root || defaults.root;

      var initial = ('#!' + root).replace(/\/$/, '');
      var hash = location.hash || initial;
      var fragment = '';

      fragment = hash.replace(/\?.*$/, ''); //去掉 query string
      fragment = fragment.replace(initial, ''); // 去掉开头的"#!/root"
      // 如果 hash 就是 "#!/root"，被替换掉开头后，没有‘/’，所以要添加一下，
      // 然而又要避免其他情况如 "#!/root/path" 下有‘/’从而添加‘/’后出现多个连续‘/’的情况
      fragment = ('/' + fragment).replace(/^\/{2,}/, '/');

      return fragment;
    }

    function extractParams (fragment, re_route) {
      var result = re_route.exec(fragment);
      return result ? result.slice(1) : [];
    }

    return Router;
  }
})(window);