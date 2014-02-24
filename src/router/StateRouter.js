(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['router/Router', 'inherit'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.StateRouter = init(_exports.Router, _exports.inherit);
  }

  function init (Router, inherit) {

    function StateRouter (op) {
      this._super(op);
    }

    StateRouter.defaults = {
      silence: false,
      root: '/',
      fragmentPrefix: '',
      timerResolution: 20
    };

    // @override
    StateRouter.prototype.navigate = function (fragment) {
      this._super(fragment);
      // 由于没有监视 history state 的事件，所以在设置 fragment 后，仍需手动路由
      this._route();
    };

    // @override
    StateRouter.prototype._setFragment = function (fragment) {
      history.pushState({}, '', fragment);
    };

    // @override
    StateRouter.prototype._getFragment = function () {
      return location.pathname;
    };

    // @override
    StateRouter.prototype._onFragmentChange = function (callback) {
      var self = this;
      if ('onpopstate' in window) {
        window.onpopstate = callback;
      }
      else {
        this._timer = setInterval(callback, 1000 / this.s.timerResolution);
      }
    };

    StateRouter = inherit(Router, StateRouter);

    return StateRouter;
  }
})(window);