requirejs.config({
  baseUrl: '../../src/'
});
require(['url'], function (url) {
  var taOrigin = document.getElementById('taOrigin'),
      taResult = document.getElementById('taResult'),
      btnConvert = document.getElementById('btnConvert');

  btnConvert.onclick = function () {
    var textOrigin = taOrigin.value,
        oriUrls = textOrigin.split('\n'),
        resUrls = [];
    
    for (var i = 0; i < oriUrls.length; i++) {
      resUrls.push(url.abs(oriUrls[i]));
    }

    taResult.value = resUrls.join('\n');
  }
});