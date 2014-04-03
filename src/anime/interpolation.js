(function (_exports) {

  if (typeof define === 'function' && define.amd) {
    define(['curce/anime'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    init(_exports.Anime);
  }

  function init (Anime) {

    var Interpolation = {
      Bezier: function (r, series) {
        
      },
      CatmullRom: function (r, series) {
        
      }
    };

    Anime.extendEasing(Easing);
  }

})(window);