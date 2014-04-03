(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.uid = init();
  }

  function init () {
    /**
     * 生成 32 进制随机数， 默认6位
     * @param  {Number} bit   生成随机数的位数
     * @param  {Number} radix 生成随机数的进制
     * @return {String}       生成的随机数
     */
    // function uid32 (bit) {
    //   var a, b, times, mod, id = '';
    //   bit = Math.min(Math.max(bit || 6, 1), 1024);
      
    //   mod = bit % 6;
    //   times = (bit - mod) / 6;

    //   if (mod) { 
    //     a = 1 << (mod - 1) * 5;
    //     b = 1 << mod * 5;
    //     id += Math.floor(Math.random() * (b - a) + a).toString(32);
    //   }
    //   if (times) {
    //     a = 1 << 25;  // (6 - 1) * 5
    //     b = 1 << 30;  // 6 * 5
    //     while (times--) {
    //       id += Math.floor(Math.random() * (b - a) + a).toString(32);
    //     }
    //   }
    //   return id;
    // }


    var defaults = {
      bpr: 8,    // bit per round 每轮生成位数
                  // 由于 Number.MAX_SAFE_INTEGET 为 2^52 - 1，
                  // 大于 36 ^ 10， 小于 36 ^ 11，
                  // 为保证可用，所以取 8
      bit: 8,     // 默认位数
      radix: 32   // 默认进制
    };

    /**
     * 生成 2-36 进制随机数, 默认 8 位 32 进制随机数
     * @param  {Number} bit   生成随机数的位数
     * @param  {Number} radix 生成随机数的进制
     * @return {String}       生成的随机数
     */
    function uid (bit, radix) {
      var a, b, times, mod, id = '', bpr = defaults.bpr;
      bit = Math.max(bit || defaults.bit, 1);
      radix = Math.min(Math.max(radix || defaults.radix, 2), 36);

      mod = bit % bpr;
      times = (bit - mod) / bpr;

      // 生成余数位 radix 进制数
      if (mod) {
        a = Math.pow(radix, mod - 1);
        b = Math.pow(radix, mod);
        id += Math.floor(Math.random() * (b - a) + a).toString(radix);
      }
      // 生成其余位 radix 进制数，每次生成 bpr 位
      if (times) {
        a = Math.pow(radix, bpr - 1);
        b = Math.pow(radix, bpr);
        while (times--) {
          id += Math.floor(Math.random() * (b - a) + a).toString(radix);
        }
      }
      return id;
    }

    return uid;
  }
})(window);