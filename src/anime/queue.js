(function (_exports) {
  if (window.define) {
    define(['inherit', 'collection'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.AnimeQueue = init(_exports.inherit, _exports.Collection);
  }

  function init (inherit, Collection) {

    function AnimeQueue () {
      this._super();
    }

    (function (host, methods, creator) {
      for (var i = 0; i < methods.length; i++) {
        var name = methods[i];
        host[name] = creator.call(host, name, i);
      } 
    })(
      AnimeQueue.prototype,
      ['play', 'rewind', 'update', 'stop'],
      function (name, index) {
        return function () {
          var args = arguments;
          this.forEach(function (anime, index) {
            anime[name].apply(anime, args);
          });
        };
      }
      );

    AnimeQueue = inherit(Collection, AnimeQueue, AnimeQueue.prototype);

    return AnimeQueue;
  }

})(window);