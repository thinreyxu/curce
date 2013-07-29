/*
  anime(起点，终点，时间，缓动，延迟)
*/

(function (exports) {

  exports.anime = anime;

  var _animes = [];
  var _animeStarted = false;
  var _animeId;
  // easing functions
  // s: start time, d: duration, t: current time, 
  // b: begin value, e: end value, r: ratio
  var _easingFuncs = {
    // 一次
    linear: function (s, d, t, b, e) {
      return (t - s) / d * (e - b) + b;
    },
    // 二次
    easeInQuad: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return r * r * (e - b) + b;
    },
    easeOutQuad: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return r * (2 - r) * (e - b) + b;
    },
    easeInOutQuad: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r <= 0.5) {
        return 2 * r * r * (e - b) + b;
      }
      else {
        return (2 * r * (2 - r) - 1) * (e - b) + b;
      }
    },
    // 三次
    easeInCubic: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return Math.pow(r, 3) * (e - b) + b;
    },
    easeOutCubic: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return (Math.pow(r - 1, 3) + 1) * (e - b) + b;
    },
    easeInOutCubic: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r <= 0.5) {
        return Math.pow(r, 3) * 4 * (e - b) + b;
      }
      else {
        return (Math.pow(r - 1, 3) * 4 + 1) * (e - b) + b;
      }
    },
    // 四次
    easeInQuart: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return Math.pow(r, 4) * (e - b) + b;
    },
    easeOutQuart: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return (1 - Math.pow(r - 1, 4)) * (e - b) + b;
    },
    easeInOutQuart: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r <= 0.5) {
        return Math.pow(r, 4) * 8 * (e - b) + b;
      }
      else {
        return (1 - Math.pow(r - 1, 4) * 8) * (e - b) + b;
      }
    },
    // 五次
    easeInQuint: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return Math.pow(r, 5) * (e - b) + b;
    },
    easeOutQuint: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return (Math.pow(r - 1, 5) + 1) * (e - b) + b;
    },
    easeInOutQuint: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r <= 0.5) {
        return Math.pow(r, 5) * 16 * (e - b) + b;
      }
      else {
        return (Math.pow(r - 1, 5) * 16 + 1) * (e - b) + b;
      }
    },
    // 三角函数
    easeInSine: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return (1 - Math.cos(Math.PI / 2 * r)) * (e - b) + b;
    },
    easeOutSine: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return Math.sin(Math.PI / 2 * r) * (e - b) + b;
    },
    easeInOutSine: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return (1 - Math.cos(Math.PI * r)) / 2 * (e - b) + b;
    },
    // 指数/对数
    easeInExpo: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r === 0) {
        return b;
      }
      else {
        return Math.pow(1024, r - 1) * (e - b) + b;
      }
    },
    easeOutExpo: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r === 1) {
        return e;
      }
      else {
        return (1 - Math.pow(1024, -r)) * (e - b) + b;
      }
    },
    easeInOutExpo: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r === 0) {
        return b;
      }
      else if (r === 1) {
        return e;
      }
      
      if (r <= 0.5) {
        return Math.pow(1024, 2 * r - 1) / 2 * (e - b) + b;
      }
      else {
        return (1 - Math.pow(1024, 1 - 2 * r) / 2) * (e - b) + b;
      }
    },
    // circular
    easeInCirc: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return ( 1 - Math.sqrt(1 - r * r)) * (e - b) + b;
    },
    easeOutCirc: function (s, d, t, b, e) {
      var r = (t - s) / d;
      return Math.sqrt(r * (2 - r)) * (e - b) + b;
    },
    easeInOutCirc: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r <= 0.5) {
        return (0.5 - Math.sqrt(0.25 - r * r)) * (e - b) + b;
      }
      else {
        return (Math.sqrt((r - 0.5) * (1.5 - r)) + 0.5) * (e - b) + b;
      }
    },
    // elastic
    easeInElastic: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r === 0) {
        return b;
      }
      else {
        return Math.pow(1024, r - 1) * Math.sin(9 / 2 * Math.PI * r * r) * (e - b) + b;
      }
    },
    easeOutElastic: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r === 1) {
        return e;
      }
      else {
        return (1 - Math.pow(1024, -r) * Math.cos(9 / 2 * Math.PI * r)) * (e - b) + b;
      }
    },
    easeInOutElastic: function (s, d, t, b, e) {
      var r = (t - s) / d;
      if (r === 0) {
        return b;
      }
      if (r === 1) {
        return e;
      }
      if (r < 0.5) {
        return Math.pow(1024, r * 2 - 1) * Math.sin(9 * Math.PI * r) / 2 * (e - b) + b;
      }
      else {
        return (1 - Math.pow(1024, 1 - 2 * r) * Math.sin(9 * Math.PI * r) / 2) * (e - b) + b;
      }
    },
    // back
    easeInBack: function (s, d, t, b, e) {
      var r = (t - s) / d;
      var k = 2;

      return r * r * ((1 + k) * r - k) * (e - b) + b;
    },
    easeOutBack: function (s, d, t, b, e) {
      var r = (t - s) / d;
      var k = 2;

      return (Math.pow(r - 1, 2) * ((k + 1) * r - 1) + 1) * (e - b) + b;
    },
    easeInOutBack: function (s, d, t, b, e) {
      var r = (t - s) / d;
      var k = 2;

      if (r <= 0.5) {
        return 2 * r * r * (2 * (k + 1) * r - k) * (e - b) + b;
      }
      else {
        return (2 * Math.pow(r - 1, 2) * (2 * (k + 1) * r - k - 2) + 1) * (e - b) + b;
      }
    },
    // bounce
    // 设 g = 10，四次弹跳时，求得 k ～= 0.397913141;
    // t1 = Math.sqrt(2/g) ~= 0.4472135955
    // t2 = k * t1 = 0.17795216648; 2 * t2 = 0.35590433296
    // t3 = k * t2 = 0.07080950551; 2 * t3 = 0.14161901102
    // t4 = k * t3 = 0.02817603275; 2 * t4 = 0.05635206550
    easeInBounce: function (s, d, t, b, e) {
      var r = (t - s) / d;
      var t1 = 0.4472135955;
      var t2 = 0.17795216648;
      var t3 = 0.07080950551;
      var t4 = 0.02817603275;

      if (r === 1) {
        return e;
      }
      if (r <= 2 * t4) {
        return 5 * (Math.pow(t4, 2) - Math.pow(r - t4, 2)) * (e - b) + b;
      }
      else if (r > 2 * t4 && r <= 2 * (t4 + t3)) {
        return 5 * (Math.pow(t3, 2) - Math.pow(r - 2 * t4 - t3, 2)) * (e - b) + b;
      }
      else if (r > 2 * (t4 + t3) && r <= 2 * (t4 + t3 + t2)) {
        return 5 * (Math.pow(t2, 2) - Math.pow(r - 2 * (t4 + t3) - t2, 2)) * (e - b) + b;
      }
      else {
        return (1 - 5 * Math.pow(r - 1, 2)) * (e - b) + b;
      }
    },
    easeOutBounce: function (s, d, t, b, e) {
      var r = (t - s) / d;
      var t1 = 0.4472135955;
      var t2 = 0.17795216648;
      var t3 = 0.07080950551;
      var t4 = 0.02817603275;

      if (r === 1) {
        return e;
      }
      if (r <= t1) {
        return 5 * r * r * (e - b) + b;
      }
      else if (r > t1 && r <= 2 * t2 + t1) {
        return (5 * Math.pow(r - t1 - t2, 2) - 5 * Math.pow(t2, 2) + 1) * (e - b) + b;
      }
      else if (r > 2 * t2 + t1 && r <= 2 * (t3 + t2) + t1) {
        return (5 * Math.pow(r - t1 - 2 * t2 - t3, 2) - 5 * Math.pow(t3, 2) + 1) * (e - b) + b;
      }
      else {
        return (5 * Math.pow(r - t1 - 2 * t2 - 2 * t3 - t4, 2) - 5 * Math.pow(t4, 2) + 1) * (e - b) + b;
      }
    },
    easeInOutBounce: function (s, d, t, b, e) {
      var r = (t - s) / d;
      var t1 = 0.4472135955;
      var t2 = 0.17795216648;
      var t3 = 0.07080950551;
      var t4 = 0.02817603275;

      if (r <= t4) {
        return 5 * (Math.pow(t4, 2) - Math.pow(2 * r - t4, 2)) / 2 * (e - b) + b;
      }
      else if (r > t4 && r <= t4 + t3) {
        return 5 * (Math.pow(t3, 2) - Math.pow(2 * r - 2 * t4 - t3, 2)) / 2 * (e - b) + b;
      }
      else if (r > t4 + t3 && r <= t4 + t3 + t2) {
        return 5 * (Math.pow(t2, 2) - Math.pow(2 * r - 2 * (t4 + t3) - t2, 2)) / 2 * (e - b) + b;
      }
      else if (r > t4 + t3 + t2 && r <= 0.5) {
        return (1 - 5 * Math.pow(2 * r - 1, 2)) / 2 * (e - b) + b;
      }
      else if (r > 0.5 && r <= 0.5 + t1/2) {
        return (5 * Math.pow(2 * r - 1, 2) + 1) / 2 * (e - b) + b;
      }
      else if (r > 0.5 + t1/2 && r <= 0.5 + t2 + t1/2) {
        return (5 * Math.pow(2 * r - 1 - t1 - t2, 2)/2 - 5 * Math.pow(t2, 2)/2 + 1) * (e - b) + b;
      }
      else if (r > 0.5 + t2 + t1/2 && r <= 0.5 + t3 + t2 + t1/2) {
        return (5 * Math.pow(2 * r - 1 - t1 - 2 * t2 - t3, 2)/2 - 5 * Math.pow(t3, 2)/2 + 1) * (e - b) + b;
      }
      else {
        return (5 * Math.pow(2 * r - 1 - t1 - 2 * t2 - 2 * t3 - t4, 2)/2 - 5 * Math.pow(t4, 2)/2 + 1) * (e - b) + b;
      }
    }
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
    // _cancelAnimationFrame(_animeId);
  }

  function _updateAnime () {
    if (_animeStarted) {
      var now = _now();
      for (var i = 0; i < _animes.length; i++) {
        _animes[i].update(now);
      }
      _animeId = _requestAnimationFrame(_updateAnime);
    }
    console.log('_updateAnime');
  }

  function _addAnime (anime) {
    if (!anime._queued) {
      anime._queued = true;
      _animes.push(anime);
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

  // 获取当前时间
  function _now () {
    if (window.performance && window.performance.now) {
      return window.performance.now();
    }
    else {
      return new Date().getTime();
    }
  }

  // 动画对象
  // param: o, options
  function anime (o) {

    if (this instanceof anime === false) {
      return new anime(o);
    }

    this._queued = false;

    this._begin = o.begin;
    this._end = o.end;
    this._duration = o.duration || 1000;
    this._easing = o.easing || {};
    this._delay = o.delay || 0;
    this._started = false;
    this._current = {};

    this._onstart = o.onstart;
    this._oncomplete = o.oncomplete;
    this._onupdate = o.onupdate;

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
  }

  // 更新动画
  anime.prototype.update = function (time) {
    var elapse = time - this._startTime;

    if (elapse < 0) {
      return this;
    }

    if (this._started === false) {
      this._onstart && this._onstart.call(this, this._current);
      this._started = true;
    }

    if (elapse >= this._duration) {
      for (var item in this._current) {
        this._current[item] = this._end[item];
      }
      this._onupdate && this._onupdate.call(this, this._current);
      this.stop();
      this._oncomplete && this._oncomplete.call(this, this._current);
    }
    else {
      for (var item in this._current) {
        var easingFunc = _easingFuncs[this._easing[item]];
        this._current[item] = easingFunc(this._startTime, this._duration, time, this._begin[item], this._end[item]);
      }
      this._onupdate && this._onupdate.call(this, this._current);
    }
    return this;
  };

  // 开始动画
  anime.prototype.start = function () {
    this._startTime = _now() + this._delay;
    _addAnime(this);
    _startAnime();
    return this;
  };

  // 停止动画
  anime.prototype.stop = function () {
    _removeAnime(this);
    this._started = false;
    return this;
  };

  anime.prototype.delay = function (delay) {
    this._delay = delay;
    return this;
  };

  anime.prototype.easing = function (easing) {
    this._easing = easing;
    return this;
  };

  anime.prototype.duration = function (duration) {
    this._duration = duration;
    return this;
  };

  anime.prototype.onstart = function (fn) {
    this._onstart = fn;
    return this;
  };

  anime.prototype.onupdate = function (fn) {
    this._onupdate = fn;
    return this;
  };

  anime.prototype.oncomplete = function (fn) {
    this._oncomplete = fn;
    return this;
  };

  function _requestAnimationFrame (fn) {
    _requestAnimationFrame = /*window.requestAnimationFrame || 
                             window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.msRequestAnimationFrame ||*/
                             function (fn) {
                                return setTimeout(fn, 16);
                             };

    _requestAnimationFrame(fn);
  }

  function _cancelAnimationFrame (id) {
    _cancelAnimationFrame = /*window.cancelAnimationFrame ||
                            window.webkitCancelAnimationFrame ||
                            window.mozCancelAnimationFrame ||
                            window.msCancelAnimationFrame ||*/
                            window.clearTimeout;

    _cancelAnimationFrame(id);
  }


})(window);