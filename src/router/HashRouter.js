(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['router/Router', 'inherit'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.HashRouter = init(_exports.Router, _exports.inherit);
  }

  function init (Router, inherit) {

    function HashRouter (op) {
      this._super(op);
    }

    HashRouter.defaults = {
      silence: false,
      root: '/',
      fragmentPrefix: '#!',
      timerResolution: 20
    };

    // @override
    HashRouter.prototype._setFragment = function (fragment) {
      location.hash = fragment;
    };

    // @override
    HashRouter.prototype._getFragment = function () {
      return location.hash;
    };

    // @override
    HashRouter.prototype._onFragmentChange = function (callback) {
      if ('onhashchange' in window) {
        window.onhashchange = callback;
      }
      else {
        this._timer = setInterval(callback, 1000 / this.s.timerResolution);
      }
    };

    HashRouter = inherit(Router, HashRouter);

    return HashRouter;
  }
})(window);