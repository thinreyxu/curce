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
        route.re = new RegExp('^' + route.str + '$');
      })();

      return route.re;
    };

    function next (collection, i, params, callback) {
      var self = this;
      return function () {
        if (i < collection.length) {
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
      var escapeRegExp = /[\^()\[\]{}?+=\-,.$|\\\/]/g;
      route.str = route.str.replace(escapeRegExp, '\\$&');
      next();
    });

    R2RE.addProcessor('name', function (route, next) {
      var namedParam = /:\w+/g;
      route.str = route.str.replace(namedParam, '(\\w+)');
      next();
    });

    R2RE.addProcessor('splat', function (route, next) {
      var splatParam = /\*\w+/g;
      route.str = route.str.replace(splatParam, '([\\w\\/]*)');
      next();
    });

    return R2RE;
  }
})(window);