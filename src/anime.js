(function (_exports) {
  if (window.define) {
    define(['mixin', 'eventemitter'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.anime = init(_exports.mixin, _exports.EventEmitter);
  }

  function init (mixin, EventEmitter) {
    var animes = [];
    var animeStarted = false;
    var animeId;

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
        if (animes.length !== 0) {
          startAnime();
        }
      }
    }

    function removeAnime (anime) {
      for (var i = 0; i < animes.length; i++) {
        if (animes[i] === anime) {
          animes[i]._queued = false;
          animes.splice(i, 1);
          if (animes.length === 0) {
            stopAnime();
          }
        }
      }
    }

    // 动画对象
    // param: o, options
    function Anime (o, op) {

      if (this instanceof Anime === false) {
        return new Anime(o, op);
      }

      op = op || {};

      this._queued = false;

      this._from = o || {};
      this._oriFrom = {};
      this._to = [];
      
      // 保存一份原始的数据
      for (var prop in this._from) {
        this._oriFrom[prop] = this._from[prop];
      }

      this._duration = op.duration || 1000;
      this._easing = op.easing || {};
      this._delay = op.delay || 0;
      this._interpolation = typeof op.interpolation === 'function' ?
        op.interpolation : INTERPOLATION_FUNCS.linear;
      this._memo = op.memo || false;
      this._memoDepth = op.memoDepth || 1;

      this._started = false;
      this._current = 0;

      // 混入 EventEmitter 时，需要实现的属性
      this.listeners = {};
    }

    // 更新动画
    Anime.prototype.update = function (time) {
      var elapse = time - this._startTime;

      if (elapse < 0) {
        return this;
      }

      var data = {
        props: this._from,
        current: this._current,
        phases: this._to.length
      };
      if (this._memo !== false) {
        data.last = this._last;
      }

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
        this.emit('progress', data);

        // 阶段性结束
        if (this._current < this._to.length - 1) {
          setNextAnimePhase.call(this, ++this._current);
        }
        // 全部结束
        else if (this._current === this._to.length - 1) {
          this.stop();
          this.emit('complete', data);
        }
      }
      // 动画幀
      else {
        for (var item in this._end.to) {
          var end = this._end.to[item];
          if (end instanceof Array) {
            var interpolationFn = this._interpolation;
            var ip = calcInterpolation(interpolationFn, this._startTime, this._end.duration, time, this._start[item], end);
            this._from[item] = calcProgress(this._end.easing[item], ip.s, ip.d, ip.t, ip.b, ip.e);
          }
          else {
            this._from[item] = calcProgress(this._end.easing[item], this._startTime, this._end.duration, time, this._start[item], this._end.to[item]);
          }
        }
        this.emit('update', data);
      }

      // 设置动画值缓存
      setMemoCache.call(this);

      return this;
    };

    // 开始动画
    Anime.prototype.start = function () {

      // 如果没有结束点，不执行动画
      if (!this._to || this._to.length === 0) {
        return;
      }

      // 处理缓动属性, 将缓动属性指向特定的欢动函数
      var et = typeof this._easing;
      if (et === 'string') {
        this._def = EASING_FUNCS[this._easing];
      }
      else if (et === 'function') {
        this._def = this._easing;
      }
      else {
        this._def = EASING_FUNCS.linear;
      }

      if (et === 'object') {
        for (var item in this._easing) {
          var easing = this._easing[item];
          this._easing[item] = typeof easing === 'function' ? easing : EASING_FUNCS[easing] || this._def;
        }
      }
      else {
        this._easing = {};
      }

      // 使用保存的原始数据填充 this._from
      // for (var prop in this._from) {
      //   delete this._from[prop];
      // }
      for (var prop in this._oriFrom) {
        this._from[prop] = this._oriFrom[prop];
      }

      if (this._memo !== false) {
        this._last = [];
        setMemoCache.call(this);
      }

      // 确定开始时间及动画的开始结束点数据
      setNextAnimePhase.call(this, this._current = 0);

      addAnime(this);

      return this;
    };

    // 停止动画
    Anime.prototype.stop = function () {
      this._started = false;
      delete this._start;
      delete this._end;
      delete this._current;
      removeAnime(this);
      return this;
    };

    Anime.prototype.to = function (to, duration, easing, delay) {
      var stop = { to: to, duration: duration, easing: easing, delay: delay };
      this._to.push(stop);
      return this;
    };

    // property set functions
    var props = {
      'delay': ['delay', 0],
      'easing': ['easing', 'linear'],
      'duration': ['duration', 1000],
      'memo': ['memo', false, 'memoDepth', 1]
    };

    for (var name in props) {
      (function (name, prop) {
        Anime.prototype[name] = function () {
          if (this._started === false) {
            for (var i = 0; i < prop.length; i += 2) {
              this['_' + prop[i]] = arguments[i] !== undefined ? arguments[i] : prop[i + 1];
            }
          }
          return this;
        };
      })(name, props[name]);
    }

    // 添加事件支持
    mixin(Anime.prototype, EventEmitter.prototype);
    EventEmitter.extend(Anime.prototype, ['start', 'update', 'complete']);


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
     * 设置下一动画阶段的开始，结束值，以及开始的时间
     */
    function setNextAnimePhase (current) {
      var lastEnd = this._end,
          stop = this._to[current],
          to = stop.to;

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

      this._end.easing = {}

      if (type === 'object') {
        for (var prop in to) {
          if (to.hasOwnProperty(prop)) {
            var easing2 = easing[prop];
            this._end.easing[prop] = typeof easing2 === 'function' ? easing2
              : EASING_FUNCS[easing2] || this._easing[prop] || this._def;
          }
        }
      }
      else if (type === 'string' || type === 'function' || type === 'undefined') {
        for (var prop in to) {
          this._end.easing[prop] = type === 'function' ? easing
            : EASING_FUNCS[easing] || this._easing[prop] || this._def;
        }
      }

      // 处理每个 stop 的 duration 和 delay
      this._end.duration = stop.duration || this._duration;
      this._end.delay = stop.delay || (current === 0 ? this._delay : 0);

      // 设置开始时间
      this._startTime = now() + this._end.delay;
    }

    /**
     * 设置动画幀的缓存值
     */
    function setMemoCache () {
      var cache = {};
      if (this._memo == true) {
        for (var prop in this._from) {
          cache[prop] = this._from[prop];
        }
      }
      else if (typeof this._memo === 'object' && this._memo instanceof Array) {
        for (var i = 0; i < this._memo.length; i++) {
          var prop = this._memo[i];
          cache[prop] = this._from[prop];
        }
      }
      this._last.unshift(cache);
      if (this._last.length > this._memoDepth) {
        this._last.pop();
      }
    }

    /**
     * 根据 easingFn，计算动画幀的值
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

    // easing functions
    // s: start time, d: duration, t: current time, 
    // b: begin value, e: end value, r: ratio
    var EASING_FUNCS = {
      // 一次
      linear: function (r) {
        return r;
      },
      // 二次
      quadIn: function (r) {
        return r * r;
      },
      quadOut: function (r) {
        return r * (2 - r);
      },
      quadInOut: function (r) {
        if (r <= 0.5) {
          return 2 * r * r;
        }
        else {
          return (2 * r * (2 - r) - 1);
        }
      },
      // 三次
      cubicIn: function (r) {
        return Math.pow(r, 3);
      },
      cubicOut: function (r) {
        return (Math.pow(r - 1, 3) + 1);
      },
      cubicInOut: function (r) {
        if (r <= 0.5) {
          return Math.pow(r, 3) * 4;
        }
        else {
          return (Math.pow(r - 1, 3) * 4 + 1);
        }
      },
      // 四次
      quartIn: function (r) {
        return Math.pow(r, 4);
      },
      quartOut: function (r) {
        return (1 - Math.pow(r - 1, 4));
      },
      quartInOut: function (r) {
        if (r <= 0.5) {
          return Math.pow(r, 4) * 8;
        }
        else {
          return (1 - Math.pow(r - 1, 4) * 8);
        }
      },
      // 五次
      quintIn: function (r) {
        return Math.pow(r, 5);
      },
      quintOut: function (r) {
        return (Math.pow(r - 1, 5) + 1);
      },
      quintInOut: function (r) {
        if (r <= 0.5) {
          return Math.pow(r, 5) * 16;
        }
        else {
          return (Math.pow(r - 1, 5) * 16 + 1);
        }
      },
      // 三角函数
      sineIn: function (r) {
        return (1 - Math.cos(Math.PI / 2 * r));
      },
      sineOut: function (r) {
        return Math.sin(Math.PI / 2 * r);
      },
      sineInOut: function (r) {
        return (1 - Math.cos(Math.PI * r)) / 2;
      },
      // 指数/对数
      expoIn: function (r) {
        if (r === 0) {
          return 0;
        }
        else {
          return Math.pow(1024, r - 1);
        }
      },
      expoOut: function (r) {
        if (r === 1) {
          return 1;
        }
        else {
          return (1 - Math.pow(1024, -r));
        }
      },
      expoInOut: function (r) {
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
      circIn: function (r) {
        return ( 1 - Math.sqrt(1 - r * r));
      },
      circOut: function (r) {
        return Math.sqrt(r * (2 - r));
      },
      circInOut: function (r) {
        if (r <= 0.5) {
          return (0.5 - Math.sqrt(0.25 - r * r));
        }
        else {
          return (Math.sqrt((r - 0.5) * (1.5 - r)) + 0.5);
        }
      },
      // 弹性
      elasticIn: function (r) {
        if (r === 0) {
          return 0;
        }
        else {
          return Math.pow(1024, r - 1) * Math.sin(9 / 2 * Math.PI * r);
        }
      },
      elasticOut: function (r) {
        if (r === 1) {
          return 1;
        }
        else {
          return (1 - Math.pow(1024, -r) * Math.cos(9 / 2 * Math.PI * r));
        }
      },
      elasticInOut: function (r) {
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
      backIn: function (r) {
        var k = 2;

        return Math.pow(r, 2) * ((1 + k) * r - k);
      },
      backOut: function (r) {
        var k = 2;

        return (Math.pow(r - 1, 2) * ((k + 1) * r - 1) + 1);
      },
      backInOut: function (r) {
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
      bounceIn: function (r) {
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
      bounceOut: function (r) {
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
      bounceInOut: function (r) {
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

    // interpolation functions
    var INTERPOLATION_FUNCS = {
      'linear': function (r, series) {
        var i = r * (series.length - 1), index = Math.floor(i), time = i - index;
        return {
          index: index,
          time: time
        };
      }
    };

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
                                return setTimeout(fn, 16);
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