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
        var i = r * (series.length - 1), index = Math.floor(i), p = i - index;
        return {
          b: series[index],
          e: series[index === series.length - 1 ? index : index + 1],
          p: p
        };
      }
    };
    // 默认插值
    Interpolation.Default = Interpolation.Linear;



    /**
     * 动画全局函数
     */
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

    /*
     * 动画对象默认值
     */
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

      this._s = extend({}, defaults, op);  // 配置信息

      this._from = o || {};   // 开始点
      this._oriFrom = {};     // 开始点原始数据拷贝
      this._to = [];          // 目标点数组
      
      // 保存一份原始的数据
      for (var prop in this._from) {
        this._oriFrom[prop] = this._from[prop];
      }

      this._queued = false;  // 未加入动画队列
      this._initialized = false;  // 未初始化全局设置
      this._started = false;  // 未开始
      this._dir = 0;  // 动画方向为正向
      this._current = 0;  // 动画开始阶段为 0

      // 混入 EventEmitter 时，需要实现的属性
      this._listeners = {};
    }

    Anime.Easing = Easing;
    Anime.Interpolation = Interpolation;
    Anime.Direction_Forward = 0;
    Anime.Direction_Reverse = 1;

    function init () {
      var s = this._s;

      // 处理缓动属性, 将缓动属性指向特定的缓动函数
      var type = typeof s.easing;
      if (type === 'string') {
        s.easingFn = Easing[normalizeEasingName(s.easing)] || Easing.Default;
      }
      else if (type === 'function') {
        s.easingFn = s.easing;
      }
      else {
        s.easingFn = Easing.Default;
      }

      if (type === 'object') {
        for (var item in s.easing) {
          var easing = s.easing[item];
          s.easing[item] = typeof easing === 'function' ? easing : Easing[normalizeEasingName(easing)] || s.easingFn;
        }
      }
      else {
        s.easing = {};
      }

      // 处理插值属性
      var type = typeof s.interpolation;
      if (type === 'string') {
        s.interpolationFn = Interpolation[normalizeInterpolationName(s.interpolation)] || Interpolation.Default;
      }
      else if (type === 'function') {
        s.interpolationFn = s.interpolation;
      }
      s.interpolation = s.interpolationFn;

      s.duration = s.duration;
      s.delay = s.delay;
      

      // 确定开始时间及动画的开始结束点数据
      if (this._dir === Anime.Direction_Forward) {
        var from = this._oriFrom;
        setNextAnimePhase.call(this, this._current = 0);
      }
      else if (this._dir === Anime.Direction_Reverse) {
        var from = getCapture.call(this, this._to.length);
        setNextAnimePhase.call(this, this._current = this._to.length - 1);
      }

      // 清除 this._from 的当前值
      for (var prop in this._from) {
        delete this._from[prop];
      }

      // 填充开始值
      for (var prop in from) {
        this._from[prop] = from[prop];
      }

      // 处理动画目标值缓存
      if (s.memo) {
        this._last = [];
        setMemoCache.call(this);
      }
    }

    /*
     * 更新动画
     */
    Anime.prototype.update = function (time) {

      // 开始时间还未到
      if (time < this._endTime - this._end.duration) {
        return this;
      }

      var data = {
        current: this._from,
        last: this._last,
        currentPhase: this._current + 1,
        totalPhase: this._to.length,
        currentRepeat: (this._dir === Anime.Direction_Forward ? this._repeat : this._s.repeat - this._repeat) + 1,
        totalRepeat: this._s.repeat,
        dir: this._dir
      };


      if (this._dir === Anime.Direction_Forward) {
        this._progress = (time - this._endTime + this._end.duration) / this._end.duration;
      }
      else if (this._dir === Anime.Direction_Reverse) {
        this._progress = 1 - (time - this._endTime + this._end.duration) / this._end.duration;
      }
      this._progress = Math.min(Math.max(this._progress, 0), 1);

      // 开始
      if (this._started === false) {
        this._started = true;
        this.emit('start', data);
        if (Math.abs(this._progress - 0.5) < 0.5) {
          this.emit('update', data);
        }
      }

      // 中间过程
      for (var item in this._end.to) {
        this._from[item] = calc(this._progress, this._start[item], this._end.to[item], this._end.easing[item], this._end.interpolation);
      }
      this.emit('update', data);

      // 正向结束
      if (this._dir === Anime.Direction_Forward && this._progress >= 1) {
        this.emit('phaseComplete', data);
        // 阶段性结束
        if (this._current < this._to.length - 1) {
          setNextAnimePhase.call(this, ++this._current);
        }
        // 全部结束
        else if (this._current === this._to.length - 1) {
          if (this._repeat++ < this._s.repeat) {
            this.emit('repeat', data);
            init.call(this);
          }
          else {
            this.stop();
            this.emit('complete', data);
          }
        }
      }
      // 反向结束
      else if (this._dir === Anime.Direction_Reverse && this._progress <= 0) {
        this.emit('phaseComplete', data);
        // 阶段性结束
        if (this._current > 0) {
          setNextAnimePhase.call(this, --this._current);
        }
        // 全部结束
        else if (this._current === 0) {
          if (this._repeat-- > 0) {
            this.emit('repeat', data);
            init.call(this);
          }
          else {
            this.stop();
            this.emit('complete', data);
          }
        }
      }

      // 设置动画值缓存
      if (this._s.memo) {
        setMemoCache.call(this);
      }

      return this;
    };

    /*
     * 正向动画
     */
    Anime.prototype.play = function (fromStart) {

      // 如果动画已开始，且动画方向相同，则不执行代码
      // 如果没有结束点，不执行动画
      if (this._dir === Anime.Direction_Forward && this._started && !fromStart ||
        !this._to || this._to.length === 0)
      {
        return this;
      }

      this._dir = Anime.Direction_Forward;

      // 加入动画队列
      if (this._started === false || fromStart) {
        this._repeat = 0;
        init.call(this);
      }
      else {
        this._endTime = now() + this._end.duration * (1 - this._progress);
      }

      addAnime(this);

      return this;
    };

    /**
     * 反转动画
     */
    Anime.prototype.rewind = function (fromEnd) {
      // 如果动画已开始，且动画方向相同，则不执行代码
      // 如果没有结束点，不执行动画
      if (this._dir === Anime.Direction_Reverse && this._started && !fromEnd ||
        !this._to || this._to.length === 0)
      {
        return this;
      }

      this._dir = Anime.Direction_Reverse;

      // 加入动画队列
      if (this._started === false || fromEnd) {
        this._repeat = this._s.repeat;
        init.call(this);
      }
      else {
        this._endTime = now() + this._end.duration * this._progress;
      }

      addAnime(this);

      return this;
    };

    /*
     * 停止动画
     */
    Anime.prototype.stop = function (jumpToEnd) {
      jumpToEnd = jumpToEnd || false;

      this._started = false;

      // 从动画队列中移除
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


    function getCapture (current) {
      var capture = {};
      for (var prop in this._oriFrom) {
        capture[prop] = this._oriFrom[prop];
      }
      for (var i = 0; i < current; i++) {
        var to = this._to[i].to;
        for (var prop in to) {
          capture[prop] = to[prop] instanceof Array ? to[prop][to[prop].length - 1] : to[prop];
        }
      }
      return capture;
    }

    /**
     * 设置下一动画阶段的开始点，结束点，以及开始的时间
     */
    function setNextAnimePhase (current) {
      var s = this._s;
      var lastEnd = this._end,
          stop = this._to[current],
          to = stop.to;

      // 设置结束点属性
      this._end = {};
      this._end.to = {};
      for (var prop in to) {
        if (typeof to[prop] === 'string' ||
            typeof to[prop] === 'number' ||
            to[prop] instanceof Array)
        {
          this._end.to[prop] = stop.to[prop];
          if (this._from[prop] === 'undefined') {
            this._from[prop] = 0;
          }
        }
      }

      // 设置开始点属性
      this._start = getCapture.call(this, current);

      // 处理每个 stop 的 easing 属性
      var easing = stop.easing,
          type = typeof easing;

      this._end.easing = {};

      if (type === 'object') {
        for (var prop in to) {
          var easing2 = easing[prop];
          this._end.easing[prop] = typeof easing2 === 'function' ?
            easing2 : Easing[normalizeEasingName(easing2)] || s.easing[prop] || s.easingFn;
        }
      }
      else if (type === 'string' || type === 'function' || type === 'undefined') {
        for (var prop in to) {
          this._end.easing[prop] = type === 'function' ?
            easing : Easing[normalizeEasingName(easing)] || s.easing[prop] || s.easingFn;
        }
      }

      // 处理每个 stop 的 interpolation 属性
      this._end.interpolation = typeof stop.interpolation === 'function' ?
        stop.interpolation : Interpolation[stop.interpolation] || s.interpolationFn;

      // 处理每个 stop 的 duration 和 delay
      this._end.duration = stop.duration || this._s.duration;

      // 设置开始/结束时间
      if (this._dir === Anime.Direction_Forward) {
        // this._startTime = now() + this._end.delay;
        this._end.delay = stop.delay || (current === 0 ? this._s.delay : 0);
        this._progress = 0;
        this._endTime = now() + this._end.delay + this._end.duration;
      }
      else if (this._dir === Anime.Direction_Reverse) {
        this._end.delay = current === this._to.length - 1 ?
          (this._repeat === s.repeat ? 0 : (this._to[0].delay || 0)) :
          (this._to[current + 1].delay || 0);
        this._progress = 1;
        this._endTime = now() + this._end.delay + this._end.duration;
        // this._startTime = this._endTime - this._end.duration * 2;
      }
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

    function calc (p, b, e, easingFn, interpolationFn) {
      if (e instanceof Array) {
        var series = [b].concat(e);
        var ip = interpolationFn(p, series);
        p = ip.p;
        b = ip.b;
        e = ip.e;
      }
      return easingFn(p) * (e - b) + b;
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
    function calcEasing (easingFn, s, d, t, b, e) {
      return easingFn((t - s) / d) * (e - b) + b;
    }

    /**
     * 根据 interpolationFn，计算在计算动画幀时需要的参数
     */
    function calcInterpolation (interpolationFn, s, d, t, b, e) {
      return interpolationFn((t - s) / d, [b].concat(e));
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