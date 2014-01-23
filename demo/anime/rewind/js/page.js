requirejs.config({
  baseUrl: '../../../src/'
});
require(['anime/anime'], function (Anime) {
  var boxes = document.getElementsByClassName('box'),
      canvas = document.getElementById('canvas'),
      gd = canvas.getContext('2d'),
      count = boxes.length;

  var play = document.getElementById('play'),
      rewind = document.getElementById('rewind'),
      stop = document.getElementById('stop');

  var cx = 300, cy = 300, r = 50, offset = 2 * Math.PI / count;

  var startAngle = 90;
  var tweens = [], circles = [], n = 0;
  for (var i = 0; i < boxes.length; i++) {
    (function (i) {
      circles[i] = {a: 0, d: startAngle};
      tweens[i] = Anime(circles[i])
        .delay(240 * i)
        .to({a: 100, d: startAngle + 135}, 500, 'easeout')
        .to({d: startAngle + 225}, 1500, 'linear')
        .to({d: startAngle + 495}, 500, 'easeinout')
        .to({d: startAngle + 585}, 1500, 'linear')
        .to({a: 0, d: startAngle + 720}, 500, 'easein')
        .repeat(Infinity)
        .onUpdate(draw)
        .onUpdate(function (ev, data) {
          var current = data.current;
          var alpha = current.a / 100,
              rad = (180 - current.d) * Math.PI/180;

          var coe = 0.6;

          boxes[i].style.left = (Math.cos(rad) * r * coe + cx - boxes[i].offsetWidth / 2 | 0) + 'px';
          boxes[i].style.top = (Math.sin(rad) * r * coe + cy - boxes[i].offsetHeight / 2 | 0) + 'px';
          boxes[i].style.backgroundColor = 'rgba(51,51,51,' + alpha + ')';
        })
        .onRepeat(function onrepeat (ev, data) {
          this.stop();
          if (++n == count) {
            n = 0;
            for (var i = 0; i < tweens.length; i++) {
              data.dir ? tweens[i].rewind() : tweens[i].play();
            }
          }
        });
    })(i);
  }

  function draw ()  {
    gd.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < count; i++) {
      var prop = circles[i],
          alpha = prop.a / 100,
          rad = prop.d * Math.PI/180;

      gd.save();
      gd.beginPath();
      gd.globalAlpha = alpha;
      gd.arc(Math.cos(rad) * r + cx, Math.sin(rad) * r + cy, 5, 0, Math.PI * 2, false);
      gd.fill();
      gd.restore();
      
      gd.save();
      gd.beginPath();
      gd.arc(Math.cos(rad) * r + cx, Math.sin(rad) * r + cy, 3, 0, Math.PI * 2, false);
      gd.fillStyle = '#fff';
      gd.fill();
      gd.restore();
    }
  }

  play.onclick = function () {
    for (var i = 0; i < tweens.length; i++) {
      tweens[i].play();
    }
    // tween.play();
  };

  rewind.onclick = function () {
    for (var i = 0; i < tweens.length; i++) {
      tweens[i].rewind();
    }
    // tween.rewind();
  };

  stop.onclick = function () {
    for (var i = 0; i < tweens.length; i++) {
      tweens[i].stop();
    }
    // tween.stop();
  };
});