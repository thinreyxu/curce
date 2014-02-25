(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.R2RE = init();
  }

  function init () {

    function R2RE () {
      this.processors = [];
    }

    R2RE.prototype.use = function (processors) {
      if (typeof processors === 'string' || typeof processors === 'function') {
        processors = [processors];
      }
      for (var i = 0; i < processors.length; i++) {
        if (typeof processors[i] === 'string') {
          for (var j = 0; j < Processors.length; j++) {
            if (processors[i] === Processors[j].name) {
              this.processors.push(Processors[j].processor);
            }
          }
        }
        else if (typeof processors[i] === 'function') {
          this.processors.push(processors[i]);
        }
      }
    };

    /**
     * 将路由字符串变成正则表达式
     * @param  {String} str - 路由字符串
     * @return {RegExp}     - 正则表达式
     */
    R2RE.prototype.makeRegExp = function (str) {
      var route = { str: str };

      next.call(this, this.processors, 0, route, function (route) {
        if (!(route.str instanceof RegExp))
          route.re = new RegExp('^' + route.str + '$');
        else
          route.re = route.str;
      })();

      return route.re;
    };

    function next (collection, i, params, callback) {
      var self = this;
      return function _next (forward) {
        if (forward !== false && i < collection.length) {
          collection[i](params, next.call(self, collection, i + 1, params, callback));
        }
        else {
          callback && callback.call(this, params);
        }
      };
    }

    var Processors = R2RE.Processors = [];

    R2RE.addProcessor = function (name, processor) {
      Processors.push({
        name: name,
        processor: processor
      });
    };

    R2RE.addProcessor('regexp', function (route, next) {
      if (route.str instanceof RegExp) {
        var str = route.str.toString().replace(/^\/\^?|\$?\/$/g, '').replace(/\\/g, '\\');
        route.str = new RegExp('^' + str + '$');
        next(false);
      }
      else {
        next();
      }
    });

    R2RE.addProcessor('escapeRegExp', function (route, next) {
      if (typeof route.str === 'string') {
        var escapeRegExp = /[\^()\[\]{}?+=\-,.$|\\\/]/g;
        route.str = route.str.replace(escapeRegExp, '\\$&');
      }
      next();
    });

    R2RE.addProcessor('namedParam', function (route, next) {
      if (typeof route.str === 'string') {
        var namedParam = /:\w+/g;
        route.str = route.str.replace(namedParam, '(\\w+)');
      }
      next();
    });

    R2RE.addProcessor('splatParam', function (route, next) {
      if (typeof route.str === 'string') {
        var splatParam = /\*\w+/g;
        route.str = route.str.replace(splatParam, '([\\w\\/=?&#]*?)');
      }
      next();
    });

    R2RE.addProcessor('wildcard', function (route, next) {
      if (typeof route.str === 'string') {
        var wildcard = /^\*$/;
        route.str = route.str.replace(wildcard, '.*');
      }
      next();
    });

    return R2RE;
  }
})(window);