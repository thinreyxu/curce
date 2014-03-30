(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.string = init();
  }

  function init () {
    var NeoString = function () {};

    /**
     * [camelize]
     * a-bc-de -> aBcDe
     */
    NeoString.camelize = function camelize (str) {
      return str.replace(/-([a-zA-Z])/g, function ($0, char) {
        return char.toUpperCase();
      });
    };

    /**
     * [hyphenize]
     * aBcDe -> a-bc-de
     */
    NeoString.hyphenize = function hyphenize (str) {
      return str.replace(/([A-Z])/g, '-$1');
    };

    /**
     * [capitalize]
     * abcde -> Abcde
     */
    NeoString.capitalize = function capitalize (str) {
      return str.charAt(0).toUpperCase() + str.substring(1);
    };

    return NeoString;
  }
})(window);