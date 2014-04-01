requirejs.config({
  baseUrl: '../../../src/'
});
require(['anime/anime', 'anime/easing'], function (Anime) {
  var box = document.getElementById('box');
  var anmime = Anime({x: 0, y: 0})
        .to({x: 300}, 300, 'linear', 1000)
        .to({y: 300}, 600, 'backOut', 2000)
        .to({x: 0}, 1200, 'quintIn', 3000)
        .to({y: 0}, 1800, 'elasticOut', 4000)
        .repeat(1)
        .onUpdate(function (ev, data) {
          var current = data.current;
          box.style.left = current.x + 'px';
          box.style.top = current.y + 'px';
        })
        .onStart(function (ev, data) {
          console.log('Animate Start.');
        })
        .onRepeat(function (ev, data) {
          console.log('Current Repeat: %d, Total: %d.', data.currentRepeat, data.totalRepeat);
        })
        .onPhaseComplete(function (ev, data) {
          console.log('Current phase: %d, Total: %d.', data.currentPhase, data.totalPhase);
        })
        .onComplete(function (ev, data) {
          console.log('Animate Complete.');
        })
        .play();
});