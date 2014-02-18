(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['mixin', 'collection'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.Canvas = _exports.Canvas || {};
    _exports.Canvas.Stage = init(_exports.mixin, _exports.Collection);
  }

  function init (mixin, Collection) {
    
    var Stage = function (id) {
      // set canvas
      if (typeof id === 'string') {
        this.canvas = document.getElementById(id);
      }
      else if (id.tagName === 'CANVAS') {
        this.canvas = id;
      }

      // set graphical device
      this.gd = this.canvas.getContext('2d');
      
      // set dimension
      this.width = this.canvas.width;
      this.height = this.canvas.height;

      // init children
      this._children = [];

      this.clearOnDraw = true;
    }

    mixin(Stage.prototype, Collection.prototype);

    Stage.prototype.add = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
          for (var j = 0; j < arguments[j].length; j++) {
            if (this.indexOf(arguments[i][j]) === -1) {
              this._children.push(arguments[i][j]);
              arguments[i][j].stage = this;
            }
          }
        }
        else {
          if (this.indexOf(arguments[i])) {
            this._children.push(arguments[i]);
            arguments[i].stage = this;
          }
        }
      }
    };

    Stage.prototype.removeByIndex = function (index) {
      if (index >= 0 && index < this._children.length) {
        var child = this._children.splice(index, 1)[0];
        delete child.stage;
      }
    };

    Stage.prototype.draw = function () {
      if (this.clearOnDraw) {
        this.gd.clearRect(0, 0, this.width, this.height);
      }
      this.forEach(function (child, index, children) {
        child.draw()
      })
    };

    return Stage;
  }
})(window);