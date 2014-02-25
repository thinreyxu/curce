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
    HashRouter.prototype._setURI = function (URI) {
      location.hash = URI;
    };

    // @override
    HashRouter.prototype._getURI = function () {
      return location.hash || (this.s.fragmentPrefix + this.s.root);
    };

    // @override
    HashRouter.prototype._onFragmentChange = function (callback) {
      if ('onhashchange' in window) {
        window.onhashchange = callback;
      }
      else {
        this._super(callback);
      }
    };

    HashRouter = inherit(Router, HashRouter);

    return HashRouter;
  }
})(window);