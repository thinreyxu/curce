/*
  anime(起点，终点，时间，缓动，延迟)
*/

(function (exports) {

  exports.Anime = Anime;

  var _animes = [];
  var _animeStarted = false;
  var _animeId;
  // easing functions
  // s: start time, d: duration, t: current time, 
  // b: begin value, e: end value, r: ratio
  var _easingFuncs = {
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
        return b;
      }
      else {
        return Math.pow(1024, r - 1);
      }
    },
    expoOut: function (r) {
      if (r === 1) {
        return e;
      }
      else {
        return (1 - Math.pow(1024, -r));
      }
    },
    expoInOut: function (r) {
      if (r === 0) {
        return b;
      }
      else if (r === 1) {
        return e;
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
        return b;
      }
      else {
        return Math.pow(1024, r - 1) * Math.sin(9 / 2 * Math.PI * r);
      }
    },
    elasticOut: function (r) {
      if (r === 1) {
        return e;
      }
      else {
        return (1 - Math.pow(1024, -r) * Math.cos(9 / 2 * Math.PI * r));
      }
    },
    elasticInOut: function (r) {
      if (r === 0) {
        return b;
      }
      if (r === 1) {
        return e;
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
        return e;
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
        return e;
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
  }

  function _calcProgress (easing, s, d, t, b, e) {
    var r = (t - s) / d,
        fn = _easingFuncs[easing];
    return fn(r) * (e - b) + b;
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
  function Anime (o) {

    if (this instanceof Anime === false) {
      return new Anime(o);
    }

    o = o || {};

    this._queued = false;

    this._begin = o.begin;
    this._end = o.end;
    this._duration = o.duration || 1000;
    this._easing = o.easing || {};
    this._delay = o.delay || 0;
    this._started = false;
    this._current = {};

    this._events = {
      start: [],
      complete: [],
      update: []
    };

    o.onStart && this._events.start.push(o.onStart);
    o.onComplete && this._events.complete.push(o.onComplete);
    o.onUpdate && this._events.updata.push(o.onUpdate);
  }

  // 更新动画
  Anime.prototype.update = function (time) {
    var elapse = time - this._startTime;

    if (elapse < 0) {
      return this;
    }

    if (this._started === false) {
      _trigger.call(this, 'start');
      _trigger.call(this, 'update');
      this._started = true;
    }

    if (elapse >= this._duration) {
      for (var item in this._current) {
        this._current[item] = this._end[item];
      }
      _trigger.call(this, 'update');
      this.stop();
      _trigger.call(this, 'complete');
    }
    else {
      for (var item in this._current) {
        this._current[item] = _calcProgress(this._easing[item], this._startTime, this._duration, time, this._begin[item], this._end[item]);
      }
      _trigger.call(this, 'update');
    }
    return this;
  };

  // 开始动画
  Anime.prototype.start = function () {
    if (this._begin !== undefined && this._end !== undefined) {
      this._startTime = _now() + this._delay;

      for (var item in this._begin) {
        this._current[item] = this._begin[item];
      }

      if (typeof this._easing === 'object') {
        for (var item in this._begin) {
          this._easing[item] = this._easing[item] || 'linear';
        }
      }
      else if (typeof this._easing === 'string') {
        var easing = this._easing;
        this._easing = {};
        for (var item in this._begin) {
          this._easing[item] = easing;
        }
      }

      _addAnime(this);
    }
    return this;
  };

  // 停止动画
  Anime.prototype.stop = function () {
    this._started = false;
    _removeAnime(this);
    return this;
  };

  Anime.prototype.begin = function (begin) {
    this._begin = this._begin || {};
    for (var item in begin) {
      this._begin[item] = begin[item];
    }
    return this;
  };

  Anime.prototype.end = function (end) {
    this._end = this._end || {};
    for (var item in end) {
      this._end[item] = end[item];
    }
    return this;
  }

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
    if (this._events[eventType] && this._events[eventType].length) {
      for (var i = 0; i < this._events[eventType].length; i++) {
        this._events[eventType][i].call(this, this._current);
      }
    }
    if (typeof this['on' + eventType] === 'function') {
      this['on' + eventType].call(this, this._current);
    }
  };

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

  return exports;
})(window);