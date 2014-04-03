(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/eventemitter', 'curce/extend', 'curce/router/r2re'], init);
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
    EventEmitter.extendHandler(Router.prototype, ['route', 'error']);

    Router.prototype.init = function (op) {
      this._started = false;
      this._routes = [];
      this._lastURI = null;
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
        route.call(self);
      });
      
      if (!this.s.silence) {
        route.call(this);
      }
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

    Router.prototype._setURI = function (URI) {
      // 使用 Router._currentURI 作为中介，模拟地址栏的变化
      this.constructor._currentURI = URI;
    };

    Router.prototype._getURI = function () {
      return this.constructor._currentURI || '';
    };

    Router.prototype._onFragmentChange = function (callback) {
      var self = this;
      this._timer = setInterval(/*function () {
        var currentURI = self._getURI();
        if (currentURI !== self._lastURI) {
          callback();
          self._lastURI = currentURI;
        }
      }*/callback, 1000 / this.s.timerResolution);
    };

    function route () {
      var URI = this._getURI();
      // 1. 检查 URI 合法 且 fragment 发生变化
      if (isURIValid.call(this, URI) && isURIChanged.call(this, URI)) {
        // 2. 设置当前 URI
        this._lastURI = URI;
        // 3. 加载 fragment
        loadFragment.call(this, getFragment.call(this, URI));
      }
    }

    function isURIChanged (URI) {
      URI = URI || this._getURI();
      return URI !== this._lastURI;
    }

    function isURIValid (URI) {
      var initial = (this.s.fragmentPrefix + this.s.root).replace(/\/$/, '');
      URI = URI || this._getURI();
      // 不合法
      if (URI && URI.indexOf(initial) !== 0) {
        this.emit('error', { URI: URI, fragment: '', code: 404 });
        return false;
      }
      return true;
    }
    
    function loadFragment (fragment) {
      fragment = fragment || getFragment.call(this);
      var routed = false;
      for (var i = 0; i < this._routes.length; i++) {
        var ro = this._routes[i];  // ro = route object
        if (ro.regexp.test(fragment)) {
          routed = true;
          var params = extractParams(fragment, ro.regexp);
          var ret = ro.callback.apply(this, params);
          this.emit('route', {
            URI: makeURI.call(this, fragment),
            fragment: fragment,
            route: ro.route,
            callback: ro.callback,
            params: params
          });
          // 如果路由回调返回false，则不继续执行其他路由
          if (ret === false) break;
        }
      }
      // 处理 404 错误
      if (routed === false) {
        this.emit('error', {
          URI: makeURI.call(this, fragment),
          fragment: fragment,
          code: 404
        });
      }
    }

    function makeURI (fragment) {
      return (this.s.fragmentPrefix + this.s.root + fragment).replace(/\/{2,}/g, '/');
    }

    function setFragment (fragment) {
      var URI = makeURI.call(this, fragment);

      if (isURIChanged.call(this, URI)) {
        this._setURI(URI);
      }
    }

    function getFragment () {
      var initial = (this.s.fragmentPrefix + this.s.root).replace(/\/$/, '');
      var fragment = this._getURI();
      // 去掉开头的"#!/root"
      fragment = fragment.replace(initial, '');
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