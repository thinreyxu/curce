requirejs.config({
  baseUrl: '../../../src/'
});
require(['anime'], function (Anime) {
  var box = document.getElementById('box');
  var play = document.getElementById('play'),
      rewind = document.getElementById('rewind'),
      stop = document.getElementById('stop');

  var tween = Anime({x: 0, y: 0})
        .to({x: [300, 200, 100, 400, 600, 500, 300]}, 3000, 'linear', 1000)
        .to({y: 300}, 3000, 'quintOut', 1000)
        .repeat(Infinity)
        .onUpdate(function (ev, data) {
          var current = data.current;
          box.style.left = current.x + 'px';
          box.style.top = current.y + 'px';
        })
        .onStart(function (ev, data) {
          console.log('Anime Start: %o', data.current);
        })
        .onRepeat(function (ev, data) {
          console.log('Anime Repeat: Current Repeat: %s, Total: %s.', data.currentRepeat, data.totalRepeat);
        })
        .onPhaseComplete(function (ev, data) {
          console.log('Anime Phase Complete: Current phase: %d, Total: %d.', data.currentPhase, data.totalPhase);
        })
        .onComplete(function (ev, data) {
          console.log('Anime Complete.');
          console.log(this);
        });

  var tween2 = new Anime({
        r: Math.random() * 256|0,
        g: Math.random() * 256|0,
        b: Math.random() * 256|0
      })
      .to({
        r: [Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0],
        g: [Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0],
        b: [Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0,Math.random() * 256|0]
      })
      .duration(1000)
      .easing('quintout')
      .onUpdate(function (ev, data) {
        var current = data.current;
        box.style.backgroundColor = 'rgb(' + (current.r | 0) + ', ' + (current.g | 0) + ', ' + (current.b | 0) + ')';
      });

  box.onmouseover = function () {
    tween2.play();
  };

  box.onmouseout = function () {
    tween2.rewind();
  };

  play.onclick = function () {
    tween.play();
  };

  rewind.onclick = function () {
    tween.rewind();
  };

  stop.onclick = function () {
    tween.stop();
  };
});