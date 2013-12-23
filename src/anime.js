(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.anime = init();
  }

  function init () {
    var _animes = [];
    var _animeStarted = false;
    var _animeId;
    
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

    function _calcProgress (ef, s, d, t, b, e) {
      var r = (t - s) / d;
      return ef(r) * (e - b) + b;
    }

    function _startAnime () {
      if (_animeStarted === false) {
        _animeStarted = true;
        _updateAnime();
      }
    }

    function _stopAnime () {
      if (_animes.length > 0) {
        _animes.splice(0, _animes.length);
      }
      _animeStarted = false;
      _cancelAnimationFrame(_animeId);
    }

    function _updateAnime () {
      _animeId = _requestAnimationFrame(_updateAnime);
      // console.log('_updateAnime: _animateStarted = true');
      for (var i = 0; i < _animes.length; i++) {
        _animes[i].update(_now());
      }
    }

    function _addAnime (anime) {
      if (!anime._queued) {
        anime._queued = true;
        _animes.push(anime);
        if (_animes.length !== 0) {
          _startAnime();
        }
      }
    }

    function _removeAnime (anime) {
      for (var i = 0; i < _animes.length; i++) {
        if (_animes[i] === anime) {
          _animes[i]._queued = false;
          _animes.splice(i, 1);
          if (_animes.length === 0) {
            _stopAnime();
          }
        }
      }
    }

    // 动画对象
    // param: o, options
    function Anime (obj, options) {

      if (this instanceof Anime === false) {
        return new Anime(obj, options);
      }

      var o = options || {};

      this._queued = false;

      this._from = obj || {};
      this._oriFrom = {};
      this._to = [];
      
      // 保存一份原始的数据
      for (var prop in this._from) {
        this._oriFrom[prop] = this._from[prop];
      }

      this._duration = o.duration || 1000;
      this._easing = o.easing || {};
      this._delay = o.delay || 0;
      this._started = false;
      this._current = 0;

      this._events = {
        start: [],
        complete: [],
        update: []
      };

      if (o.onStart) this._events.start.push(o.onStart);
      if (o.onComplete) this._events.complete.push(o.onComplete);
      if (o.onUpdate) this._events.updata.push(o.onUpdate);
    }

    // 更新动画
    Anime.prototype.update = function (time) {
      var elapse = time - this._startTime;

      if (elapse < 0) {
        return this;
      }

      if (this._started === false) {
        this._started = true;
        _trigger.call(this, 'start', this._from);
        _trigger.call(this, 'update', this._from, this._current, this._to.length);
      }

      if (elapse >= this._end.duration) {
        // 设置属性
        for (var item in this._end.to) {
          this._from[item] = this._end.to[item];
        }

        _trigger.call(this, 'update', this._from, this._current, this._to.length);
        _trigger.call(this, 'progress', this._from, this._current, this._to.length);

        // 阶段性结束
        if (this._current < this._to.length - 1) {
          _setNextAnimePhase.call(this, ++this._current);
        }
        // 全部结束
        else if (this._current === this._to.length - 1) {
          this.stop();
          _trigger.call(this, 'complete', this._from, this._current, this._to.length);
        }
      }
      else {
        for (var item in this._end.to) {
          this._from[item] = _calcProgress(this._end.easing[item], this._startTime, this._end.duration, time, this._start[item], this._end.to[item]);
        }
        _trigger.call(this, 'update', this._from, this._current, this._to.length);
      }
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
      for (var prop in this._from) {
        delete this._from[prop];
      }
      for (var prop in this._oriFrom) {
        this._from[prop] = this._oriFrom[prop];
      }

      // 确定开始时间
      _setNextAnimePhase.call(this, this._current = 0);

      _addAnime(this);

      return this;
    };

    // 停止动画
    Anime.prototype.stop = function () {
      this._started = false;
      delete this._start;
      delete this._end;
      delete this._current;
      _removeAnime(this);
      return this;
    };

    Anime.prototype.to = function (to, duration, easing, delay) {
      var stop = { to: to, duration: duration, easing: easing, delay: delay };
      this._to.push(stop);
      return this;
    };

    Anime.prototype.delay = function (delay) {
      if (this._started === false) {
        this._delay = delay;
      }
      return this;
    };

    Anime.prototype.easing = function (easing) {
      if (this._started === false) {
        this._easing = easing;
      }
      return this;
    };

    Anime.prototype.duration = function (duration) {
      if (this._started === false) {
        this._duration = duration;
      }
      return this;
    };

    Anime.prototype.onStart = function (fn) {
      if (this._started === false) {
        this._events.start.push(fn);
      }
      return this;
    };

    Anime.prototype.onUpdate = function (fn) {
      if (this._started === false) {
        this._events.update.push(fn);
      }
      return this;
    };

    Anime.prototype.onComplete = function (fn) {
      if (this._started === false) {
        this._events.complete.push(fn);
      }
      return this;
    };

    Anime.prototype.on = function (eventType, fn) {
      if (this._started === false) {
        this._events[eventType] = this._events[eventType] || [];
        this._events[eventType].push(fn);
      }
      return this;
    };

    Anime.prototype.off = function (eventType, fn) {
      if (this._started === false) {
        if (typeof eventType === 'undefined') {
          for (var type in this._events) {
            this._events[type] = [];
          }
        }
        else if (typeof eventType === 'string' && this._events[eventType] && this._events[eventType].length != 0) {
          if (fn) {
            for (var i = 0; i < this._events.length; i++) {
              if (this._events[eventType][i] === fn) {
                this._events[eventType].splice(i, 1);
                i--;
              }
            }
          }
          else {
            this._events[eventType] = [];
          }
        }
        else if (typeof eventType === 'function') {
          fn = eventType;
          for (var type in this._events) {
            for (var i = 0; i < this._events[type].length; i++) {
              if (this._events[type][i] === fn) {
                this._events[type].splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      return this;
    };

    function _trigger (eventType) {
      var data = Array.prototype.slice.call(arguments, 1);
      if (this._events[eventType] && this._events[eventType].length) {
        for (var i = 0; i < this._events[eventType].length; i++) {
          this._events[eventType][i].apply(this, data);
        }
      }
      if (typeof this['on' + eventType] === 'function') {
        this['on' + eventType].apply(this, data);
      }
    }

    function _setNextAnimePhase (current) {
      var lastEnd = this._end,
          stop = this._to[current],
          to = stop.to;

      // 设置结束点属性
      this._end = {};
      this._end.to = {};
      for (var prop in to) {
        this._end.to[prop] = stop.to[prop];
        if (this._from[prop] === 'undefined') {
          this._from[prop] = 0;
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
      this._end.delay = stop.delay || 0;

      // 设置开始时间
      this._startTime = _now() + this._end.delay;

      console.group('current');
      console.log(this._start);
      console.log(this._end);
      console.log(this._startTime)
      console.groupEnd();
    }

    return Anime;
  }
  
  // 获取当前时间
  function _now () {
    if (window.performance && window.performance.now) {
      return window.performance.now();
    }
    else {
      return new Date().getTime();
    }
  }

  function _requestAnimationFrame (fn) {
    _requestAnimationFrame = window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.msRequestAnimationFrame ||
                             function (fn) {
                                return setTimeout(fn, 16);
                             };

    _requestAnimationFrame(fn);
  }

  function _cancelAnimationFrame (id) {
    _cancelAnimationFrame = window.cancelAnimationFrame ||
                            window.webkitCancelAnimationFrame ||
                            window.mozCancelAnimationFrame ||
                            window.msCancelAnimationFrame ||
                            window.clearTimeout;

    _cancelAnimationFrame(id);
  }
})(window);