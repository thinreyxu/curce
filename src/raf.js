(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    init();
  }

  function init () {
    var prefixes = ['webkit', 'ms', 'moz', 'o'];
    var lastCall = 0, i = 0;
    while(typeof window.requestAnimationFrame !== 'function' && i < prefixes.length) {
      window.requestAnimationFrame = window[prefixes[i] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[prefixes[i] + 'CancelAnimationFrame'] ||
                                    window[prefixes[i] + 'CancelRequestAnimationFrame'];
      i++;
    }
    
    if (typeof window.requestAnimationFrame !== 'function') {
      window.requestAnimationFrame = function (fn) {
        var now = new Date().getTime();
        var nextTimeToCall = Math.max(0, 16 - now + lastCall);
        var id = setTimeout(function () { fn(new Date().getTime()); }, nextTimeToCall);
        lastCall = now + nextTimeToCall;
        return id;
      };
    }

    if (typeof window.cancelAnimationFrame !== 'function') {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }
})(window);