require.config({
  baseUrl: '../../../src/'
});

require(['anime'], function (anime) {

  var canvas = document.getElementById('canvas'),
      W = canvas.width,
      H = canvas.height;

  var gd = canvas.getContext('2d');

  gd.fillStyle = '#f2f2f2';
  for (var i = 1; i < W/10; i++) {
    for (var j = 1; j < H/10; j++) {
      gd.fillRect(i * 10, j * 10, 1, 1);
    }
  }

  var center = { x: W / 2, y: H / 2 };
  var rh = 200, rv = 200;

  var duration = 1000;

  var o = { x: center.x + rh, y: center.y },
      stop = { x: [center.x, center.x - rh],
              y: [center.y - rv, center.y] };

  var tween1 = anime(o)
        .to(stop)
        .easing({ x: 'circInOut', y: 'linear' })
        .duration(duration * 2)
        .memo()
        .onStart(onStart)
        .onUpdate(onUpdate);

  var tween2 = anime({ x: center.x + rh, y: center.y })
        .to({x: center.x, y: center.y - rv}, duration, { x: 'circIn' })
        .to({x: center.x - rh, y: center.y}, duration, { x: 'circOut' })
        .to({x: center.x, y: center.y + rv}, duration, { x: 'circIn' })
        .to({x: center.x + rh, y: center.y}, duration, { x: 'circOut' })
        .memo()
        .onStart(onStart)
        .onUpdate(onUpdate);

  var r = 0, toAngle = -360 * 5;
  var tween3 = anime({ angle: 0 })
        .to({ angle: toAngle })
        .duration(duration)
        .delay(duration * 4)
        .memo()
        .onUpdate(function (ev, data) {

          var current = data.current,
              last = data.last[0];

          gd.save();

          gd.lineWidth = (toAngle - current.angle) / toAngle * 5 + 1;

          gd.beginPath();
          gd.arc(center.x - rh / 2, center.y, r+= 0.5, d2a(last.angle), d2a(current.angle), true);
          gd.stroke();
          
          gd.beginPath();
          gd.arc(center.x + rh / 2, center.y, r+= 0.5, d2a(-last.angle + 180), d2a(-current.angle + 180), false);
          gd.stroke();
          
          last.angle = current.angle;

          gd.restore();
        });

  var a = 30;
  var tween4 = anime({ angle: a })
        .to({ angle: -a })
        .duration(duration)
        .delay(duration * 5)
        .memo()
        .onUpdate(function (ev, data) {
          var current = data.current,
              last = data.last[0];
          gd.save();

          gd.beginPath();
          gd.lineWidth = (a - Math.abs(current.angle)) / a * 5 + 2;
          gd.arc(center.x, center.y + rv * 1 / 4, 80, d2a(last.angle + 90), d2a(current.angle + 90), true);
          gd.stroke();
          last.angle = current.angle;
          
          gd.restore();
        });

  tween1.start();
  tween2.start();
  tween3.start();
  tween4.start();

  function onStart () {
    gd.strokeStyle = '#666';
  }

  function onUpdate (ev, data) {
    var current = data.current,
        last = data.last[0];

    if (last.x !== current.x || last.y !== current.y) {
      gd.save();
      gd.beginPath();
      gd.lineWidth = (center.y + rv - current.y) / (rv * 2) * 3 + 2;
      gd.moveTo(last.x, last.y);
      gd.lineTo(current.x, current.y);
      gd.stroke();
      gd.restore();
    }
  }

  function d2a (degree) {
    return degree * Math.PI / 180;
  }

});