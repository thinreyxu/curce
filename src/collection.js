(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.Collection = init();
  }

  function init () {
    
    function Collection () {
      this._children = [];
    }

    Collection.prototype.add = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
          for (var j = 0; j < arguments[j].length; j++) {
            if (this.indexOf(arguments[i][j]) === -1) {
              this._children.push(arguments[i][j]);
            }
          }
        }
        else {
          if (this.indexOf(arguments[i])) {
            this._children.push(arguments[i]);
          }
        }
      }
    };

    Collection.prototype.removeByIndex = function (index) {
      if (index >= 0 && index < this._children.length)
        this._children.splice(index, 1);
    };

    Collection.prototype.remove = function (item) {
      this.removeByIndex(this.indexOf(item));
    };

    Collection.prototype.empty = function () {
      for (var i = 0; i < this._children.length; i++)
        this.removeByIndex(i);
    };

    Collection.prototype.size = function () {
      return this._children.length;
    };

    Collection.prototype.getByIndex = function (index) {
      return this._children[index];
    };

    Collection.prototype.indexOf = function (item) {
      var index = -1;

      if (typeof this._children.indexOf === 'function') {
        index = this._children.indexOf(item);
      }
      else {
        for (var i = 0; i < this._children.length; i++) {
          if (this._children[i] === item) {
            index = i;
            break;
          }
        }
      }
      return index;
    };

    Collection.prototype.forEach = function (callback) {
      for (var i = 0; i < this._children.length; i++)
        callback && callback.call(this, this._children[i], i);
    };

    return Collection;
  }

})(window);