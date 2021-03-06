requirejs.config({
  paths: {
    curce: '../../../../src'
  }
});
require(['curce/anime/anime', 'curce/anime/easing'], function (Anime) {
  var easingSel = document.getElementById('select_easing'),
      durationSel = document.getElementById('select_duration'),
      redrawBtn = document.getElementById('btn_redraw');
  var easing = easingSel.options[easingSel.selectedIndex].text,
      duration = durationSel.options[durationSel.selectedIndex].text;
  var canvas = document.getElementById('canvas'),
      gd = canvas.getContext('2d'),
      width = canvas.width,
      height = canvas.height;
  var box = document.getElementById('box');
  var x = 100, y = 100;
  var tween = Anime({ x: 0, y: 0 })
        .to({ x: width - 2 * x, y: height - 2 * y })
        .delay(1000)
        .memo()
        .onStart(onStart)
        .onUpdate(onUpdate)
        .onComplete(onComplete);

  draw(canvas, easing, duration);

  redrawBtn.onclick = function () {
    draw(canvas, easing, duration);
  };

  easingSel.onchange = function () {
    easing = this.options[this.selectedIndex].text;
    draw(canvas, easing, duration);
  };

  durationSel.onchange = function () {
    duration = this.options[this.selectedIndex].text;
    draw(canvas, easing, duration);
  };

  function draw (canvas, easing, duration) {
    easing = easing || 'linear';
    duration = duration ? parseInt(duration, 10) : 2000;

    
    box.style.left = x - 20 + 'px';
    box.style.top = height - y + 'px';
    
    gd.clearRect(0, 0, width, height);

    gd.strokeStyle = '#f7f7f7';
    gd.lineWidth = '1';
    // gd.lineCap = 'round';
    gd.lineJoin = 'round';

    // 画格线
    gd.beginPath();
    for (var i = 1; i < width / 10; i++) {
      gd.moveTo(i * 10 + 0.5, 0);
      gd.lineTo(i * 10 + 0.5, height);
    }
    for (var i = 1; i < height / 10; i++) {
      gd.moveTo(0, i * 10 + 0.5);
      gd.lineTo(width, i * 10 + 0.5);
    }
    gd.stroke();
    
    // 画绘图区
    gd.beginPath();
    gd.strokeStyle = '#ccc';
    gd.strokeRect(x - 9.5, y - 9.5, width - 2 * x + 20, height - 2 * y + 20);
    gd.fillStyle = '#fff';
    gd.fillRect(x - 9.5, y - 9.5, width - 2 * x + 20, height - 2 * y + 20);
    
    for (var i = 1; i < (width - 2 * x + 20) / 10 ; i++) {
      for (var j = 1; j < (height - 2 * y + 20) / 10; j++) {
        gd.fillStyle = '#ccc';
        gd.fillRect(i * 10 + x - 10, j * 10 + x - 10, 1, 1);
      }
    }

    // 画文字
    gd.font = 'normal 14px monospace';
    gd.fillStyle = '#428bca';
    gd.fillText(easing + ' ' + duration + 'ms', 20, 40);

    // 动画
    tween.stop()
      .easing({y: easing})
      .duration(duration)
      .play(true);
  }

  function onStart (ev, data) {
    // console.log('start');
  }
  function onUpdate(ev, data) {
    var current = data.current,
        last = data.last[0];

    // console.log('update:', data);

    gd.beginPath();
    gd.strokeStyle = '#f2f2f2';
    gd.lineWidth = '1';
    gd.moveTo(current.x + x + 0.5, height - y + 0.5);
    gd.lineTo(current.x + x + 0.5, height - current.y - y + 0.5);
    gd.stroke();

    gd.beginPath();
    gd.strokeStyle = '#428bca';
    gd.lineWidth = '2';
    gd.moveTo(last.x + x + 0.5, height - last.y - y + 0.5);
    gd.lineTo(current.x + x + 0.5, height - current.y - y + 0.5);
    gd.stroke();

    box.style.top = height - current.y - y + 'px';
  }
  function onComplete(ev, data) {
    // console.log('end');
  }
});