/**
 * Anime
 * Thinrey Xu, https://github.com/thinreyxu
 * Inspired by sole/tween.js, https://github.com/sole/tween.js
 */

(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['mixin', 'extend', 'eventemitter', 'anime/queue'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.Anime = init(_exports.mixin, _exports.extend, _exports.EventEmitter, _exports.AnimeQueue);
  }

  function init (mixin, extend, EventEmitter, AnimeQueue) {

    var animes = new AnimeQueue();
    var animeStarted = false;
    var animeId;
    var s = {
      autoStart: true
    };

    // 缓动函数
    var Easing = { Linear: function (r) { return r; } };
    Easing.Default = Easing.Linear;
    Anime.extendEasing = function (name, easing) {
      if (typeof name === 'object') {
        var easings = name;
        for (name in easings) Easing[name] = easings[name];
      }
      else if (typeof name === 'string') {
        Easing[name] = easing;
      }
    };

    // 插值函数
    var Interpolation = {
      Linear: function (r, series) {
        var i = r * (series.length - 1), index = Math.floor(i), p = i - index;
        if (r === 0 || r === 1) return series[index];
        else return (series[index + 1] - series[index]) * p + series[index];
      }
    };

    // 默认插值
    Interpolation.Default = Interpolation.Linear;
    Anime.extendInterpolation = function (name, interpolation) {
      if (typeof name === 'object') {
        var interpolations = name;
        for (name in interpolations) Interpolation[name] = interpolations[name];
      }
      else if (typeof name === 'string') {
        Easing[name] = interpolation;
      }
    };


    /**
     * 动画全局函数
     */
    Anime.play = startAnime;
    function startAnime () {
      if (animeStarted === false) {
        animeStarted = true;
        (function update() {
          updateAnime();
          animeId = requestAnimationFrame(update);
        })();
      }
    }

    Anime.stop = stopAnime;
    function stopAnime (clearQueue) {
      if (clearQueue) {
        animes.stop();
      }
      animeStarted = false;
      cancelAnimationFrame(animeId);
    }

    Anime.update = updateAnime;
    function updateAnime () {
      animes.update(now());
    }

    Anime.config = configAnime;
    function configAnime (op) {
      extend(s, op);
    }

    function addAnime (anime) {
      if (!anime._queued) {
        anime._queued = true;
        animes.add(anime);
        if (animes.size() === 1 && s.autoStart) {
          startAnime();
        }
      }
    }

    function removeAnime (anime) {
      anime._queued = false;
      animes.remove(anime);
      if (animes.size() === 0) {
        stopAnime();
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

      this._queued = false;       // 未加入动画队列
      this._initialized = false;  // 未初始化全局设置
      this._started = false;      // 未开始
      this._dir = 0;              // 动画方向为正向
      this._current = 0;          // 动画开始阶段为 0
      this._repeat = 0;           // 动画重复次数
      this._progress = 0;         // 动画进程

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
        setFrom.call(this, this._oriFrom);
        setNextPhase.call(this, this._current = 0);
      }
      else if (this._dir === Anime.Direction_Reverse) {
        setFrom.call(this, getCapture.call(this, this._to.length));
        setNextPhase.call(this, this._current = this._to.length - 1);
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
        currentRepeat: this._s.repeat === Infinity ? Infinity : (this._dir === Anime.Direction_Forward ? this._repeat : this._s.repeat - this._repeat) + 1,
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
          setNextPhase.call(this, ++this._current);
        }
        // 全部结束
        else if (this._current === this._to.length - 1) {
          if (this._s.repeat === Infinity || this._repeat < this._s.repeat) {
            this._s.repeat !== Infinity && this._repeat++;
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
          setNextPhase.call(this, --this._current);
        }
        // 全部结束
        else if (this._current === 0) {
          if (this._s.repeat === Infinity || this._repeat > 0) {
            this._s.repeat !== Infinity && this._repeat--;
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

      if (!this._progress && !this._repeat && !this._current ||
        this._progress === 1 && this._repeat === this._s.repeat && this._current === this._to.length - 1 ||
        fromStart)
      {

        this._repeat = 0;
        init.call(this);
      }
      else {
        this._endTime = now() + this._end.duration * (1 - this._progress);
      }

      // 加入动画队列
      addAnime(this);

      return this;
    };

    /*
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

      if (!this._progress && !this._repeat && !this._current ||
        this._progress === 1 && this._repeat === this._s.repeat && this._current === this._to.length - 1 ||
        fromEnd)
      {
        this._repeat = this._s.repeat;
        init.call(this);
      }
      else {
        this._endTime = now() + this._end.duration * this._progress;
      }

      // 加入动画队列
      addAnime(this);

      return this;
    };

    /*
     * 停止动画
     */
    Anime.prototype.stop = function (jumpToEnd, dir) {
      jumpToEnd = jumpToEnd || false;
      dir = typeof dir !== 'undefined' ? dir : this._dir;

      if (jumpToEnd && this._queued) {
          this._dir = dir;
        if (dir === Anime.Direction_Forward) {
          this._current = this._to.length - 1;
          this._progress = 1;
          this._repeat = this._s.repeat;
          var stop = getCapture.call(this, this._to.length);
        }
        else if (dir === Anime.Direction_Reverse) {
          this._current = 0;
          this._progress = 0;
          this._repeat = 0;
          var stop = getCapture.call(this, 0);
        }
        setNextPhase.call(this, this._current);
        setFrom.call(this, stop);
        this.update(this._endTime = now());
      }

      // 从动画队列中移除
      removeAnime(this);

      this._started = false;

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

    Anime.prototype.from = function (from) {
      for (var prop in this._oriFrom) {
        delete this._oriFrom[prop];
      }
      for (var prop in from) {
        this._oriFrom[prop] = from[prop];
      }
      return this;
    };

    Anime.prototype.splice = function (index, count) {
      this._to.splice.apply(this._to, arguments);
      return this;
    };

    Anime.prototype.size = function () {

      return this._to.length;
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
    function setNextPhase (current) {
      var s = this._s;
      var lastEnd = this._end,
          stop = this._to[current];

      // 设置开始/结束点属性
      this._end = {};

      // 1.处理每个 stop 的 easing 属性
      var easing = stop.easing,
          type = typeof easing;

      this._end.easing = {};

      if (type === 'object' && easing !== null) {
        for (var prop in stop.to) {
          var easing2 = easing[prop];
          this._end.easing[prop] = typeof easing2 === 'function' ?
            easing2 : Easing[normalizeEasingName(easing2)] || s.easing[prop] || s.easingFn;
        }
      }
      else {
        for (var prop in stop.to) {
          this._end.easing[prop] = type === 'function' ?
            easing : Easing[normalizeEasingName(easing)] || s.easing[prop] || s.easingFn;
        }
      }

      // 2.处理每个 stop 的 interpolation 属性
      this._end.interpolation = typeof stop.interpolation === 'function' ?
        stop.interpolation : Interpolation[stop.interpolation] || s.interpolationFn;

      // 3.处理每个 stop 的 duration 和 delay
      this._end.duration = stop.duration || this._s.duration;

      this._start = {};
      this._end.to = {};

      if (this._dir === Anime.Direction_Forward) {
        for (var prop in stop.to) {
          this._start[prop] = this._from[prop] || 0;
          this._end.to[prop] = stop.to[prop];
        }
        this._end.delay = stop.delay || (current === 0 ? this._s.delay : 0);
        this._progress = 0;
        this._endTime = now() + this._end.delay + this._end.duration;
      }
      else if (this._dir === Anime.Direction_Reverse) {
        this._start = getCapture.call(this, current);
        for (var prop in stop.to) {
          this._end.to[prop] = stop.to[prop];
        }
        this._end.delay = current === this._to.length - 1 ?
          (this._repeat === s.repeat ? 0 : (this._to[0].delay || 0)) :
          (this._to[current + 1].delay || 0);
        s.repeat === Infinity && (this._repeat = 0);  // bitter code
        this._progress = 1;
        this._endTime = now() + this._end.delay + this._end.duration;
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

    function setFrom (from) {
      // 清除 this._from 的当前值
      for (var prop in this._from) {
        delete this._from[prop];
      }
      // 填充开始值
      for (var prop in from) {
        this._from[prop] = from[prop];
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
      p = easingFn(p);
      return e instanceof Array ? interpolationFn(p, [b].concat(e)) : p * (e - b) + b;
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
    requestAnimationFrame = /*window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.msRequestAnimationFrame ||*/
                             function (fn) {
                                return setTimeout(fn, 1000/60);
                             };

    requestAnimationFrame(fn);
  }

  function cancelAnimationFrame (id) {
    cancelAnimationFrame = /*window.cancelAnimationFrame ||
                            window.webkitCancelAnimationFrame ||
                            window.mozCancelAnimationFrame ||
                            window.msCancelAnimationFrame ||*/
                            window.clearTimeout;

    cancelAnimationFrame(id);
  }
})(window);