/**
 * Anime
 * Thinrey Xu, https://github.com/thinreyxu
 * Inspired by sole/tween.js, https://github.com/sole/tween.js
 */

(function (_exports) {
  if (window.define) {
    define(['mixin', 'extend', 'eventemitter'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.anime = init(_exports.mixin, _exports.extend, _exports.EventEmitter);
  }

  function init (mixin, extend, EventEmitter) {
    var animes = [];
    var animeStarted = false;
    var animeId;


    // 缓动函数
    var Easing = {
      // 一次
      Linear: function (r) {
        return r;
      },
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
    // 默认缓动
    Easing.Default = Easing.Linear;

    // 插值函数
    var Interpolation = {
      Linear: function (r, series) {
        var i = r * (series.length - 1), index = Math.floor(i), time = i - index;
        return {
          index: index,
          time: time
        };
      }
    };
    // 默认插值
    Interpolation.Default = Interpolation.Linear;

    function startAnime () {
      if (animeStarted === false) {
        animeStarted = true;
        updateAnime();
      }
    }

    function stopAnime () {
      if (animes.length > 0) {
        animes.splice(0, animes.length);
      }
      animeStarted = false;
      cancelAnimationFrame(animeId);
    }

    function updateAnime () {
      animeId = requestAnimationFrame(updateAnime);
      // console.log('updateAnime: _animateStarted = true');
      for (var i = 0; i < animes.length; i++) {
        animes[i].update(now());
      }
    }

    function addAnime (anime) {
      if (!anime._queued) {
        anime._queued = true;
        animes.push(anime);
        if (animes.length === 1) {
          startAnime();
        }
      }
    }

    function removeAnime (anime) {
      for (var i = 0; i < animes.length; i++) {
        if (animes[i] === anime) {
          animes[i]._queued = false;
          animes.splice(i--, 1);
          if (animes.length === 0) {
            stopAnime();
          }
        }
      }
    }

    var defaults = {
      easing: Easing.Linear,
      duration: 1000,
      delay: 0,
      interpolation: Interpolation.Linear,
      memo: false,
      memoDepth: 1,
      repeat: 0
    };

    /*
     * 动画对象构造方法
     * @constructor
     * @param {Object} o - 开始点对象
     * @param {Object} op - 选项
     */
    function Anime (o, op) {

      if (this instanceof Anime === false) {
        return new Anime(o, op);
      }

      this._s = extend({}, defaults, op);

      this._queued = false;

      this._from = o || {};   // 开始点
      this._oriFrom = {};     // 开始点原始数据拷贝
      this._to = [];          // 目标点数组
      
      // 保存一份原始的数据
      for (var prop in this._from) {
        this._oriFrom[prop] = this._from[prop];
      }

      this._started = false;
      this._current = 0;

      // 混入 EventEmitter 时，需要实现的属性
      this._listeners = {};
    }

    Anime.Easing = Easing;
    Anime.Interpolation = Interpolation;

    /*
     * 更新动画
     */
    Anime.prototype.update = function (time) {
      var elapse = time - this._startTime;

      if (elapse < 0) {
        return this;
      }

      var data = {
        current: this._from,
        last: this._last,
        currentPhase: this._current + 1,
        totalPhase: this._to.length,
        currentRepeat: this._s.repeat - this._repeat + 1,
        totalRepeat: this._s.repeat
      };


      if (this._started === false) {
        this._started = true;
        this.emit('start', data);
        this.emit('update', data);
      }

      // 阶段性结束 或 全部结束
      if (elapse >= this._end.duration) {
        // 设置属性
        for (var item in this._end.to) {
          var end = this._end.to[item];
          this._from[item] = end.length ? end[end.length - 1] : end;
        }

        this.emit('update', data);
        this.emit('phaseComplete', data);

        // 阶段性结束
        if (this._current < this._to.length - 1) {
          setNextAnimePhase.call(this, ++this._current);
        }
        // 全部结束
        else if (this._current === this._to.length - 1) {
          if (this._repeat--) {
            this.emit('repeat', data);
            init.call(this);
          }
          else {
            this.stop();
            this.emit('complete', data);
          }
        }
      }
      // 动画幀
      else {
        for (var item in this._end.to) {
          var end = this._end.to[item];
          if (end instanceof Array) {
            var ip = calcInterpolation(this._end.interpolation, this._startTime, this._end.duration, time, this._start[item], end);
            this._from[item] = calcProgress(this._end.easing[item], ip.s, ip.d, ip.t, ip.b, ip.e);
          }
          else {
            this._from[item] = calcProgress(this._end.easing[item], this._startTime, this._end.duration, time, this._start[item], this._end.to[item]);
          }
        }
        this.emit('update', data);
      }

      // 设置动画值缓存
      if (this._s.memo) {
        setMemoCache.call(this);
      }

      return this;
    };

    function init () {
      var s = this._s;
      var g = this._g = {};

      // 如果没有结束点，不执行动画
      if (!this._to || this._to.length === 0) {
        return;
      }

      // 处理缓动属性, 将缓动属性指向特定的缓动函数
      var type = typeof s.easing;
      if (type === 'string') {
        g.easingFn = Easing[normalizeEasingName(s.easing)] || Easing.Default;
      }
      else if (type === 'function') {
        g.easingFn = s.easing;
      }
      else {
        g.easingFn = Easing.Default;
      }

      g.easing = {};
      if (type === 'object') {
        for (var item in s.easing) {
          var easing = s.easing[item];
          g.easing[item] = typeof easing === 'function' ? easing : Easing[normalizeEasingName(easing)] || g.easingFn;
        }
      }

      // 处理插值属性
      var type = typeof s.interpolation;
      if (type === 'string') {
        g.interpolationFn = Interpolation[normalizeInterpolationName(s.interpolation)] || Interpolation.Default;
      }
      else if (type === 'function') {
        g.interpolationFn = s.interpolation;
      }
      g.interpolation = g.interpolationFn;

      g.duration = s.duration;
      g.delay = s.delay;

      // 确定开始时间及动画的开始结束点数据
      setNextAnimePhase.call(this, this._current = 0);
      
      // 处理动画目标值缓存
      if (s.memo) {
        this._last = [];
        setMemoCache.call(this);
      }
    }

    /*
     * 开始动画
     */
    Anime.prototype.start = function () {
      // 初始化
      init.call(this);
      this._repeat = this._s.repeat;

      // 加入动画队列
      addAnime(this);

      return this;
    };

    /*
     * 停止动画
     */
    Anime.prototype.stop = function (clearQueue, jumpToEnd) {
      clearQueue = clearQueue || false;
      jumpToEnd = jumpToEnd || false;

      this._started = false;
      // 移除动画队列
      removeAnime(this);
      return this;
    };

    /*
     * 添加阶段目标
     */
    Anime.prototype.to = function (to, duration, easing, delay, interpolation) {
      var stop = {
        to:             to,
        duration:       duration,
        easing:         easing,
        delay:          delay,
        interpolation:  interpolation
      };
      this._to.push(stop);
      return this;
    };

    /*
     * 选项设置方法
     */
    var props = {
      'delay': ['delay', 0],
      'easing': ['easing', Easing.Default],
      'duration': ['duration', 1000],
      'interpolation': ['interpolation', Interpolation.Default],
      'repeat': ['repeat', 1],
      'memo': ['memo', 1]
    };

    for (var name in props) {
      (function (name, prop) {
        Anime.prototype[name] = function () {
          if (this._started === false) {
            for (var i = 0; i < prop.length; i += 2) {
              this._s[prop[i]] = arguments[i] !== undefined ? arguments[i] : prop[i + 1];
            }
          }
          return this;
        };
      })(name, props[name]);
    }

    // 添加事件支持，混入 EventEmitter，并扩展独立事件监听器注册方法
    var events = ['start', 'update', 'complete', 'repeat', 'phaseComplete'];
    mixin(Anime.prototype, EventEmitter.prototype);
    EventEmitter.extend(Anime.prototype, events);


    /**
     * 检查值的类型，字符串、数字和数组返回真，其余返回假
     */
    function checkValueType (value) {
      var type = typeof value;
      if (type === 'string' ||
        type === 'number' ||
        type === 'object' && value instanceof Array)
      {
        return true;
      }
      return false;
    }

    /**
     * 设置下一动画阶段的开始点，结束点，以及开始的时间
     */
    function setNextAnimePhase (current) {
      var s = this._s, g = this._g;
      var lastEnd = this._end,
          stop = this._to[current],
          to = stop.to;

      if (current === 0) {
        // 清楚 thsi._from 的当前值
        for (var prop in this._from) {
          delete this._from[prop];
        }
        // 使用保存的原始数据填充 this._from
        for (var prop in this._oriFrom) {
          this._from[prop] = this._oriFrom[prop];
        }
      }

      // 设置结束点属性
      this._end = {};
      this._end.to = {};
      for (var prop in to) {
        if (checkValueType(to[prop])) {
          this._end.to[prop] = stop.to[prop];
          if (this._from[prop] === 'undefined') {
            this._from[prop] = 0;
          }
        }
      }

      // 设置开始点属性
      this._start = {};
      for (var prop in this._end.to) {
        this._start[prop] = this._from[prop];
      }


      // 处理每个 stop 的 easing 属性
      var easing = stop.easing,
          type = typeof easing;

      this._end.easing = {};

      if (type === 'object') {
        for (var prop in to) {
          var easing2 = easing[prop];
          this._end.easing[prop] = typeof easing2 === 'function' ?
            easing2 : Easing[normalizeEasingName(easing2)] || g.easing[prop] || g.easingFn;
        }
      }
      else if (type === 'string' || type === 'function' || type === 'undefined') {
        for (var prop in to) {
          this._end.easing[prop] = type === 'function' ?
            easing : Easing[normalizeEasingName(easing)] || g.easing[prop] || g.easingFn;
        }
      }

      // 处理每个 stop 的 interpolation 属性
      this._end.interpolation = typeof stop.interpolation === 'function' ?
        stop.interpolation : Interpolation[stop.interpolation] || g.interpolationFn;

      // 处理每个 stop 的 duration 和 delay
      this._end.duration = stop.duration || this._s.duration;
      this._end.delay = stop.delay || (current === 0 ? this._s.delay : 0);

      // 设置开始时间
      this._startTime = now() + this._end.delay;
    }

    /**
     * 设置动画幀的缓存值
     */
    function setMemoCache () {
      var cache = {};
      for (var prop in this._from) {
        cache[prop] = this._from[prop];
      }
      this._last.unshift(cache);
      if (this._last.length > this._s.memo) {
        this._last.pop();
      }
    }

    /**
     * 正规化缓动函数名称
     */
    function normalizeEasingName (name) {
      if (typeof name === 'string') { 
        return name.replace(/^(\w+?)(In)?(Out)?$/gi, function ($0, $1, $2, $3) {
          return $1.charAt(0).toUpperCase() + $1.substring(1) + ($2 ? 'In' : '') + ($3 ? 'Out' : '');
        });
      }
    }

    function normalizeInterpolationName (name) {
      if (typeof name === 'string') {
        return name.charAt(0).toUpperCase() + name.substring(1);
      }
    }

    /**
     * 根据 easingFn，计算动画幀的值
     * @param {Number} s - start 开始时间
     * @param {Number} d - duration 动画时长
     * @param {Number} t - time 当前时间, 
     * @param {Number} b - beginning 开始值
     * @param {Number} e - end 结束值
     * @returens {Number} - 当前值
     */
    function calcProgress (easingFn, s, d, t, b, e) {
      var r = (t - s) / d;
      return easingFn(r) * (e - b) + b;
    }

    /**
     * 根据 interpolatioinFn，计算在计算动画幀时需要的参数
     */
    function calcInterpolation (interpolatioinFn, s, d, t, b, e) {
      var series = [b].concat(e),
          r = (t - s) / d,
          ip = interpolatioinFn(r, series);
      return  { s: 0, d: 1, t: ip.time, b: series[ip.index], e: series[ip.index + 1] };
    }


    return Anime;
  }
  
  // 获取当前时间
  function now () {
    if (window.performance && window.performance.now) {
      return window.performance.now();
    }
    else {
      return new Date().getTime();
    }
  }

  function requestAnimationFrame (fn) {
    requestAnimationFrame = window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.msRequestAnimationFrame ||
                             function (fn) {
                                return setTimeout(fn, 1000/60);
                             };

    requestAnimationFrame(fn);
  }

  function cancelAnimationFrame (id) {
    cancelAnimationFrame = window.cancelAnimationFrame ||
                            window.webkitCancelAnimationFrame ||
                            window.mozCancelAnimationFrame ||
                            window.msCancelAnimationFrame ||
                            window.clearTimeout;

    cancelAnimationFrame(id);
  }
})(window);