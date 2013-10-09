(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.dom = init();
  }

  function init () {
    function dom () {};

    // dom.contains()
    if (document.compareDocumentPosition) {
      dom.contains = function (container, contained, equal) {
        var result = container.compareDocumentPosition(contained);
        if (equal && result === 0 || (result & 16) === 16) {
          return true;
        }
        return false;
      }
    }
    else {
      dom.contains = function (container, contained, equal) {
        contained = equal ? contained.parentNode : contained;
        while (contained) {
          if (contained === container) {
            return true;
          }
          contained = contained.parentNode;
        }
        return false;
      }
    }

    return dom;
  }
})(window);