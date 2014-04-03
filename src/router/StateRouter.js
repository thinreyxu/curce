(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/router/Router', 'curce/inherit'], init);
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
    StateRouter.prototype._setURI = function (URI) {
      history.pushState({}, '', URI);
    };

    // @override
    StateRouter.prototype._getURI = function () {
      return location.pathname + location.search + location.hash;
    };

    // @override
    // StateRouter.prototype._onFragmentChange = function (callback) {
    //   // 使用 timer 来监视 history state，则无需监听 onpopstate
    //   // if ('onpopstate' in window) {
    //   //   window.onpopstate = callback;
    //   // }
    //   this._super(callback);
    // };

    StateRouter = inherit(Router, StateRouter);

    return StateRouter;
  }
})(window);