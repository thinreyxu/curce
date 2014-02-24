(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['eventemitter', 'extend', 'router/r2re'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.Router = init(_exports.EventEmitter, _exports.extend, _exports.R2RE);
  }

  function init (EventEmitter, extend, R2RE) {

    var r2re = new R2RE();
    r2re.use(['regexp', 'escapeRegExp', 'namedParam', 'splatParam', 'wildcard']);

    function Router (op) {
      EventEmitter.call(this);
      this.init(op);
    }

    Router.defaults = {
      silence: false,
      root: '/',
      fragmentPrefix: '',
      timerResolution: 20
    };

    extend(Router.prototype, EventEmitter.prototype);
    EventEmitter.extend(Router.prototype, ['route', 'error']);

    Router.prototype.init = function (op) {
      this._started = false;
      this._routes = [];
      this._lastFragment = '';
      this.s = extend({}, this.constructor.defaults, op);

      this.s.root = ('/' + this.s.root + '/').replace(/\/+/g, '/');
    };

    Router.prototype.start = function () {
      if (this._started) {
        return;
      }

      // 注册事件
      var self = this;
      this._onFragmentChange(function () {
        self._route();
      });
      
      this._route(this.s.silence);
    };

    Router.prototype.route = function (route, callback) {
      this._routes.push({
        route: route,
        regexp: r2re.makeRegExp(route),
        callback: callback
      });
    };

    Router.prototype.navigate = function (fragment) {
      setFragment.call(this, fragment);
    };

    Router.prototype._setFragment = function (fragment) {
      this.constructor._curentURI = fragment;
      this.emit('urichange', { fragment: fragment });
    };

    Router.prototype._getFragment = function () {
      return this.constructor._curentURI;
    };

    Router.prototype._onFragmentChange = function (callback) {
      this.on('urichange', callback);
    };

    Router.prototype._route = function (silence) {
      // 1. 检查 fragment(hash) 合法
      var isFragmentValid = checkFragment.call(this);
      if (isFragmentValid) {
        // 2. 获取 fragment
        var fragment = getFragment.call(this);
        // 3. 加载 fragment
        if (fragment !== this._lastFragment) {
          loadFragment.apply(this, [, silence]);
        }
      }
    };

    function checkFragment () {
      var initial = (this.s.fragmentPrefix + this.s.root).replace(/\/$/, '');
      var fragment = this._getFragment();
      if (fragment && fragment.indexOf(initial) !== 0) {
        this.emit('error', { fragment: fragment, code: 404 });
        return false;
      }
      return true;
    }
    
    function loadFragment (fragment, silence) {
      fragment = fragment || getFragment.call(this);
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

    function setFragment (fragment) {
      if (fragment.indexOf(this.s.root) !== 0) {
        fragment = this.s.root + fragment;
      }
      fragment = (this.s.fragmentPrefix + fragment).replace(/\/{2,}/g, '/');
      this._setFragment(fragment);
    }

    function getFragment () {
      var initial = (this.s.fragmentPrefix + this.s.root).replace(/\/$/, '');
      var fragment = this._getFragment() || initial;

      fragment = fragment.replace(/\?.*$/, ''); //去掉 query string
      fragment = fragment.replace(initial, ''); // 去掉开头的"#!/root"
      // 如果 hash 就是 "#!/root"，被替换掉开头后，没有‘/’，所以要添加一下，
      // 然而又要避免其他情况如 "#!/root/path" 下有‘/’从而添加‘/’后出现多个连续‘/’的情况
      fragment = ('/' + fragment).replace(/^\/{2,}/, '/');

      return fragment;
    }

    function extractParams (fragment, regexp) {
      var result = regexp.exec(fragment);
      return result ? result.slice(1) : [];
    }

    return Router;
  }
})(window);