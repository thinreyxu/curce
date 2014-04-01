(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['router/HashRouter', 'router/StateRouter'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.CompoundRouter = init(_exports.HashRouter, _exports.StateRouter);
  }

  function init (HashRouter, StateRouter) {
    
    function CompoundRouter () { }

    CompoundRouter.HashRouter = HashRouter;
    CompoundRouter.StateRouter = StateRouter;

    CompoundRouter.create = function (name, op) {
      if (typeof name === 'string' && name in CompoundRouter) {
        return new CompoundRouter[name](op);
      }
      else if (!name || typeof name === 'object') {
        op = name;
        name = '';
        if ('onpopstate' in window) {
          return new CompoundRouter.StateRouter(op);
        }
        else {
          return new CompoundRouter.HashRouter(op);
        }
      }
    };

    return CompoundRouter;
  }
})(window);