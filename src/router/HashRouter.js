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
    r2re.use(['regexp', 'name', 'splat']);

    var defaults = {
      silence: false
    };

    function Router (op) {
      EventEmitter.call(this);
      this._started = false;
      this._routes = [];
      this._lastFragment = '';
      this.s = extend({}, op, defaults);
    }

    mixin(Router.prototype, EventEmitter.prototype);
    EventEmitter.extend(Router.prototype, 'route');

    Router.prototype.start = function () {
      if (!this._started) {
        // 开始监测地址的改变
        // 注册事件
        var self = this;
        window.onhashchange = function () {
          checkFragment.call(self);
        };
        
        if (!this.s.silence) {
          checkFragment.call(this);
        }
      }
    };

    Router.prototype.route = function (route, callback) {
      this._routes.push({
        str: route,
        regexp: r2re.makeRegExp(route),
        callback: callback
      });
    };

    Router.prototype.navigate = function (fragment) {
      setFragment(fragment);
    };

    function checkFragment (fragment) {
      fragment = fragment || getFragment();
      if (fragment !== this._lastFragment) {
        execRouteCallback.call(this, fragment);
      }
    }

    function execRouteCallback (fragment) {
      for (var i = 0; i < this._routes.length; i++) {
        var route = this._routes[i],
            str_route = route.str,
            re_route = route.regexp,
            callback = route.callback;
        if (re_route.test(fragment)) {
          var params = extractParams(fragment, re_route);
          var ret = callback.apply(this, params);
          this.emit('route', str_route, callback, params);
          if (!ret) {
            break;
          }
        }
      }
    }

    function setFragment (fragment) {
      location.hash = ('#!/' + fragment).replace(/\/\//g, '/');
    }

    function getFragment () {
      var hash = location.hash;
      var fragment = hash.replace(/^#!/, '');
      return fragment;
    }

    function extractParams (fragment, re_route) {
      var result = re_route.exec(fragment);
      return result ? result.slice(1) : [];
    }

    return Router;
  }
})(window);