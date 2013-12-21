requirejs.config({
  baseUrl: '../../../src/'
});
require(['anime'], function (anime) {
  var box = document.getElementById('box');
  var anmime = anime({x: 0, y: 0})
        .to({x: 300}, 300, 'linear', 1000)
        .to({y: 300}, 600, 'backOut', 2000)
        .to({x: 0}, 1200, 'quintIn', 3000)
        .to({y: 0}, 1800, 'elasticOut', 4000)
        .onUpdate(function (props) {
          box.style.left = props.x + 'px';
          box.style.top = props.y + 'px';
        })
        .start();
});