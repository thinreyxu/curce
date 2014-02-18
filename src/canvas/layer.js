(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['mixin', 'Collection'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.Canvas = _exports.Canvas || {};
    _exports.Canvas.Layer = init(_exports.mixin, _exports.Collection);
  }

  function init (mixin, Collection) {
    
    var Layer = function () {
      this._children = [];
      this.clearOnDraw = true;
    }

    mixin(Layer.prototype, Collection.prototype);

    Layer.prototype.add = function () {

    }

    Layer.prototype.draw = function (canvas, gd) {
      if (this.clearOnDraw) {
        
      }
      this.forEach(function (child, index, children) {
        child.draw();
      })
    }
  }
})(window);