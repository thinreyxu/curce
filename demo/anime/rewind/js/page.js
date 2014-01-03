requirejs.config({
  baseUrl: '../../../src/'
});
require(['anime'], function (anime) {
  var box = document.getElementById('box');
  var tween = anime({x: 0, y: 0})
        .to({x: [300, 200, 100, 400, 600, 500, 300]}, 3000, 'linear', 1000)
        .to({y: 300}, 3000, 'quintOut', 1000)
        .repeat(1)
        .onUpdate(function (ev, data) {
          var current = data.current;
          box.style.left = current.x + 'px';
          box.style.top = current.y + 'px';
        })
        .onStart(function (ev, data) {
          console.log('Anime Start: %o', data.current);
        })
        .onRepeat(function (ev, data) {
          console.log('Anime Repeat: Current Repeat: %d, Total: %d.', data.currentRepeat, data.totalRepeat);
        })
        .onPhaseComplete(function (ev, data) {
          console.log('Anime Phase Complete: Current phase: %d, Total: %d.', data.currentPhase, data.totalPhase);
        })
        .onComplete(function (ev, data) {
          console.log('Anime Complete.');
        });

  var play = document.getElementById('play'),
      rewind = document.getElementById('rewind');

  play.onclick = function () {
    tween.play();
  };

  rewind.onclick = function () {
    tween.rewind();
  };
});