(function (_exports) {

  if (typeof define === 'function' && define.amd) {
    define(['curce/anime/anime'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    init(_exports.Anime);
  }

  function init (Anime) {
    var Easing = {
      // 二次
      QuadIn: function (r) {
        return r * r;
      },
      QuadOut: function (r) {
        return r * (2 - r);
      },
      QuadInOut: function (r) {
        if (r <= 0.5) {
          return 2 * r * r;
        }
        else {
          return (2 * r * (2 - r) - 1);
        }
      },
      // 三次
      CubicIn: function (r) {
        return Math.pow(r, 3);
      },
      CubicOut: function (r) {
        return (Math.pow(r - 1, 3) + 1);
      },
      CubicInOut: function (r) {
        if (r <= 0.5) {
          return Math.pow(r, 3) * 4;
        }
        else {
          return (Math.pow(r - 1, 3) * 4 + 1);
        }
      },
      // 四次
      QuartIn: function (r) {
        return Math.pow(r, 4);
      },
      QuartOut: function (r) {
        return (1 - Math.pow(r - 1, 4));
      },
      QuartInOut: function (r) {
        if (r <= 0.5) {
          return Math.pow(r, 4) * 8;
        }
        else {
          return (1 - Math.pow(r - 1, 4) * 8);
        }
      },
      // 五次
      QuintIn: function (r) {
        return Math.pow(r, 5);
      },
      QuintOut: function (r) {
        return (Math.pow(r - 1, 5) + 1);
      },
      QuintInOut: function (r) {
        if (r <= 0.5) {
          return Math.pow(r, 5) * 16;
        }
        else {
          return (Math.pow(r - 1, 5) * 16 + 1);
        }
      },
      // 三角函数
      SineIn: function (r) {
        return (1 - Math.cos(Math.PI / 2 * r));
      },
      SineOut: function (r) {
        return Math.sin(Math.PI / 2 * r);
      },
      SineInOut: function (r) {
        return (1 - Math.cos(Math.PI * r)) / 2;
      },
      // 指数/对数
      ExpoIn: function (r) {
        if (r === 0) {
          return 0;
        }
        else {
          return Math.pow(1024, r - 1);
        }
      },
      ExpoOut: function (r) {
        if (r === 1) {
          return 1;
        }
        else {
          return (1 - Math.pow(1024, -r));
        }
      },
      ExpoInOut: function (r) {
        if (r === 0) {
          return 0;
        }
        else if (r === 1) {
          return 1;
        }
        
        if (r <= 0.5) {
          return Math.pow(1024, 2 * r - 1) / 2;
        }
        else {
          return (1 - Math.pow(1024, 1 - 2 * r) / 2);
        }
      },
      // 圆
      CircIn: function (r) {
        return ( 1 - Math.sqrt(1 - r * r));
      },
      CircOut: function (r) {
        return Math.sqrt(r * (2 - r));
      },
      CircInOut: function (r) {
        if (r <= 0.5) {
          return (0.5 - Math.sqrt(0.25 - r * r));
        }
        else {
          return (Math.sqrt((r - 0.5) * (1.5 - r)) + 0.5);
        }
      },
      // 弹性
      ElasticIn: function (r) {
        if (r === 0) {
          return 0;
        }
        else {
          return Math.pow(1024, r - 1) * Math.sin(9 / 2 * Math.PI * r);
        }
      },
      ElasticOut: function (r) {
        if (r === 1) {
          return 1;
        }
        else {
          return (1 - Math.pow(1024, -r) * Math.cos(9 / 2 * Math.PI * r));
        }
      },
      ElasticInOut: function (r) {
        if (r === 0) {
          return 0;
        }
        if (r === 1) {
          return 1;
        }
        if (r < 0.5) {
          return Math.pow(1024, r * 2 - 1) * Math.sin(9 * Math.PI * r) / 2;
        }
        else {
          return (1 - Math.pow(1024, 1 - 2 * r) * Math.sin(9 * Math.PI * r) / 2);
        }
      },
      // 回复
      BackIn: function (r) {
        var k = 2;

        return Math.pow(r, 2) * ((1 + k) * r - k);
      },
      BackOut: function (r) {
        var k = 2;

        return (Math.pow(r - 1, 2) * ((k + 1) * r - 1) + 1);
      },
      BackInOut: function (r) {
        var k = 2;

        if (r <= 0.5) {
          return 2 * Math.pow(r, 2) * (2 * (k + 1) * r - k);
        }
        else {
          return (2 * Math.pow(r - 1, 2) * (2 * (k + 1) * r - k - 2) + 1);
        }
      },
      // 弹跳
      // 设 g = 10，四次弹跳时，求得 k ～= 0.397913141;
      // t1 = Math.sqrt(2/g) ~= 0.4472135955
      // t2 = k * t1 = 0.17795216648; 2 * t2 = 0.35590433296
      // t3 = k * t2 = 0.07080950551; 2 * t3 = 0.14161901102
      // t4 = k * t3 = 0.02817603275; 2 * t4 = 0.05635206550
      BounceIn: function (r) {
        var t1 = 0.4472135955;
        var t2 = 0.17795216648;
        var t3 = 0.07080950551;
        var t4 = 0.02817603275;

        if (r === 1) {
          return 1;
        }
        if (r <= 2 * t4) {
          return 5 * (Math.pow(t4, 2) - Math.pow(r - t4, 2));
        }
        else if (r > 2 * t4 && r <= 2 * (t4 + t3)) {
          return 5 * (Math.pow(t3, 2) - Math.pow(r - 2 * t4 - t3, 2));
        }
        else if (r > 2 * (t4 + t3) && r <= 2 * (t4 + t3 + t2)) {
          return 5 * (Math.pow(t2, 2) - Math.pow(r - 2 * (t4 + t3) - t2, 2));
        }
        else {
          return (1 - 5 * Math.pow(r - 1, 2));
        }
      },
      BounceOut: function (r) {
        var t1 = 0.4472135955;
        var t2 = 0.17795216648;
        var t3 = 0.07080950551;
        var t4 = 0.02817603275;

        if (r === 1) {
          return 1;
        }
        if (r <= t1) {
          return 5 * r * r;
        }
        else if (r > t1 && r <= 2 * t2 + t1) {
          return (5 * Math.pow(r - t1 - t2, 2) - 5 * Math.pow(t2, 2) + 1);
        }
        else if (r > 2 * t2 + t1 && r <= 2 * (t3 + t2) + t1) {
          return (5 * Math.pow(r - t1 - 2 * t2 - t3, 2) - 5 * Math.pow(t3, 2) + 1);
        }
        else {
          return (5 * Math.pow(r - t1 - 2 * t2 - 2 * t3 - t4, 2) - 5 * Math.pow(t4, 2) + 1);
        }
      },
      BounceInOut: function (r) {
        var t1 = 0.4472135955;
        var t2 = 0.17795216648;
        var t3 = 0.07080950551;
        var t4 = 0.02817603275;

        if (r <= t4) {
          return 5 * (Math.pow(t4, 2) - Math.pow(2 * r - t4, 2)) / 2;
        }
        else if (r > t4 && r <= t4 + t3) {
          return 5 * (Math.pow(t3, 2) - Math.pow(2 * r - 2 * t4 - t3, 2)) / 2;
        }
        else if (r > t4 + t3 && r <= t4 + t3 + t2) {
          return 5 * (Math.pow(t2, 2) - Math.pow(2 * r - 2 * (t4 + t3) - t2, 2)) / 2;
        }
        else if (r > t4 + t3 + t2 && r <= 0.5) {
          return (1 - 5 * Math.pow(2 * r - 1, 2)) / 2;
        }
        else if (r > 0.5 && r <= 0.5 + t1/2) {
          return (5 * Math.pow(2 * r - 1, 2) + 1) / 2;
        }
        else if (r > 0.5 + t1/2 && r <= 0.5 + t2 + t1/2) {
          return (5 * Math.pow(2 * r - 1 - t1 - t2, 2)/2 - 5 * Math.pow(t2, 2)/2 + 1);
        }
        else if (r > 0.5 + t2 + t1/2 && r <= 0.5 + t3 + t2 + t1/2) {
          return (5 * Math.pow(2 * r - 1 - t1 - 2 * t2 - t3, 2)/2 - 5 * Math.pow(t3, 2)/2 + 1);
        }
        else {
          return (5 * Math.pow(2 * r - 1 - t1 - 2 * t2 - 2 * t3 - t4, 2)/2 - 5 * Math.pow(t4, 2)/2 + 1);
        }
      }
    };

    Anime.extendEasing(Easing);
  }

})(window);