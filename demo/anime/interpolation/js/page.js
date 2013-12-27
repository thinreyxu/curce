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

  var o = { x: center.x + rh, y: center.y, last: { x: center.x + rh, y: center.y} },
      stop = { x: [center.x, center.x - rh],
              y: [center.y - rv, center.y] };

  var tween1 = anime(o)
        .to(stop)
        .easing({ x: 'circInOut', y: 'linear' })
        .duration(duration * 2)
        .onStart(onStart)
        .onUpdate(onUpdate);

  var tween2 = anime({ x: center.x + rh, y: center.y, last: { x: center.x + rh, y: center.y} })
        .to({x: center.x, y: center.y - rv}, duration, { x: 'circIn' })
        .to({x: center.x - rh, y: center.y}, duration, { x: 'circOut' })
        .to({x: center.x, y: center.y + rv}, duration, { x: 'circIn' })
        .to({x: center.x + rh, y: center.y}, duration, { x: 'circOut' })
        .onStart(onStart)
        .onUpdate(onUpdate);

  var r = 0, toAngle = -360 * 5;
  var tween3 = anime({ angle: 0, last: { angle: 0 } })
        .to({ angle: toAngle })
        .duration(duration)
        .delay(duration * 4)
        .onUpdate(function (props) {
          gd.save();

          gd.lineWidth = (toAngle - props.angle) / toAngle * 5 + 1;

          gd.beginPath();
          gd.arc(center.x - rh / 2, center.y, r+= 0.5, d2a(props.last.angle), d2a(props.angle), true);
          gd.stroke();
          
          gd.beginPath();
          gd.arc(center.x + rh / 2, center.y, r+= 0.5, d2a(-props.last.angle + 180), d2a(-props.angle + 180), false);
          gd.stroke();
          
          props.last.angle = props.angle;

          gd.restore();
        });

  var a = 30;
  var tween4 = anime({ angle: a, last: { angle: a } })
        .to({ angle: -a })
        .duration(duration)
        .delay(duration * 5)
        .onUpdate(function (props) {
          gd.save();

          gd.beginPath();
          gd.lineWidth = (a - Math.abs(props.angle)) / a * 5 + 2;
          gd.arc(center.x, center.y + rv * 1 / 4, 80, d2a(props.last.angle + 90), d2a(props.angle + 90), true);
          gd.stroke();
          props.last.angle = props.angle;
          
          gd.restore();
        });

  tween1.start();
  tween2.start();
  tween3.start();
  tween4.start();

  function onStart (props) {
    gd.strokeStyle = '#666';
  }

  function onUpdate (props) {
    if (props.last.x !== props.x || props.last.y !== props.y) {
      gd.save();
      gd.beginPath();
      gd.lineWidth = (center.y + rv - props.y) / (rv * 2) * 3 + 2;
      gd.moveTo(props.last.x, props.last.y);
      gd.lineTo(props.x, props.y);
      gd.stroke();
      props.last.x = props.x;
      props.last.y = props.y;
      gd.restore();
    }
  }

  function d2a (degree) {
    return degree * Math.PI / 180;
  }

});