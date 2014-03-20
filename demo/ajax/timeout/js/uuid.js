(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.uuid = init();
  }

  function init () {
    // 32进制随机数
    function uuid32 (bit) {
      var a, b, times, mod, id = '';
      bit = Math.min(Math.max(bit || 6, 1), 1024);
      
      times = Math.floor(bit / 6);
      mod = bit % 6;

      if (mod) { 
        a = 1 << (mod - 1) * 5;
        b = 1 << mod * 5;
        id += Math.floor(Math.random() * (b - a) + a).toString(32);
      }
      if (times) {
        a = 1 << 25;
        b = 1 << 30;
        while (times--) {
          id += Math.floor(Math.random() * (b - a) + a).toString(32);
        }
      }
      return id;
    }

    // 2-36进制随机数
    function uuid (bit, radix) {
      var a, b, times, mod, id = '';
      bit = Math.min(Math.max(bit || 8, 1), 1024);
      radix = Math.min(Math.max(radix || 36, 2), 36);

      mod = bit % 8;
      times = (bit - mod) / 8;

      if (mod) {
        a = Math.pow(radix, mod - 1);
        b = Math.pow(radix, mod);
        id += Math.floor(Math.random() * (b - a) + a).toString(radix);
      }
      if (times) {
        a = Math.pow(radix, 7);
        b = Math.pow(radix, 8);
        while (times--) {
          id += Math.floor(Math.random() * (b - a) + a).toString(radix);
        }
      }
      return id;
    }

    return {
      uuid: uuid,
      uuid32: uuid32
    };
  }
})(window);