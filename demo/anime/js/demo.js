window.onload = function () {
  var easingSel = document.getElementById('select_easing'),
      durationSel = document.getElementById('select_duration'),
      redrawBtn = document.getElementById('btn_redraw');
  var easing = easingSel.options[easingSel.selectedIndex].text,
      duration = durationSel.options[durationSel.selectedIndex].text;
  var canvas = document.getElementById('canvas'),
      width = canvas.width,
      height = canvas.height;
  var x = 100, y = 100;
  var tween = Anime({
        begin: {x: 0, y: 0},
        end: {x: width - 2 * x, y: height - 2 * y},
        delay: 1000
      });

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

    var box = document.getElementById('box');
    var gd = canvas.getContext('2d');
    var lastPoint = null;
    
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
    gd.fillStyle = '#333';
    gd.font = '14px serif';
    gd.fillText(easing + ' ' + duration + 'ms', 20, 40);

    // 动画
    tween.stop()
      .easing({y: easing})
      .duration(duration)
      .off()
      .onStart(function (current) {
        // console.clear();
        console.log('start');
        lastPoint = {x: current.x, y: current.y};
      })
      .onUpdate(function (current) {
        console.log('update:', this._current);

        gd.beginPath();
        gd.strokeStyle = '#f2f2f2';
        gd.lineWidth = '1';
        gd.moveTo(current.x + x + 0.5, height - y + 0.5);
        gd.lineTo(current.x + x + 0.5, height - current.y - y + 0.5);
        gd.stroke();

        gd.beginPath();
        gd.strokeStyle = '#0d9';
        gd.lineWidth = '2';
        gd.moveTo(lastPoint.x + x + 0.5, height - lastPoint.y - y + 0.5);
        gd.lineTo(current.x + x + 0.5, height - current.y - y + 0.5);
        gd.stroke();
        lastPoint = {x: current.x, y: current.y};

        box.style.top = height - current.y - y + 'px';
      })
      .onComplete(function (current) {
        console.log('end');
      })
      .start();
  }
};