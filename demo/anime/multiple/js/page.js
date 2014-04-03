requirejs.config({
  paths: {
    curce: '../../../../src'
  }
});
require(['curce/anime/anime'], function (Anime) {
  Anime.config({ 
    autoStart: false
  });

  var container = document.getElementById('container');

  var boxes = [], tweens = [];
  var count = 800;

  for (var i = 0; i < count; i++) {
    (function (i) {
      var box = document.createElement('div');
      box.className = 'box';
      box.style.width = '30px';
      box.style.height = '1px';
      box.style.left = 0;
      box.style.top = i * 1 + 'px';
      container.appendChild(box);
      boxes.push(box);

      var tween = new Anime({ left: 0 })
            .to({ left: 600 }, 3000, null, 0)
            .onUpdate(function (ev, data) {
                boxes[i].style.left = data.current.left + 'px';
              })
            .play();
      tweens.push(tween);
    })(i);
  }

  Anime.play();
  setTimeout(function () {
    Anime.stop();
  }, 1000);
});