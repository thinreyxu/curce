(function (_exports) {
  if (window.define && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.inherit = init();
  }

  function init () {

    /**
     * 将对象 source 中在 names 中出现的属性，或全部属性置入到 target 中
     * @param {Object} target - 需要置入属性的对象，目标对象
     * @param {Object} source - 提供置入属性的对象，源对象
     * @param {Array} names - 字符串数组，数组项为置入的属性的名字
     * @returns {Object} - 置入了新属性的对象
     */    
    function mixin (target, source, names) {
      if (names && names.length) {
        for (var i = 0; i < names.length; i++) {

          var name = names[i];

          if (name in source) {
            target[name] = source[name];
          }
        }
      }
      else {
        for (var name in source) {
          target[name] = source[name];
        }
      }
      return target;
    }

    return mixin;
  }

})(window);