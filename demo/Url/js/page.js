requirejs.config({
  baseUrl: '../../src/'
});
require(['Url'], function (Url) {
  var taOrigin = document.getElementById('taOrigin'),
      taResult = document.getElementById('taResult'),
      btnConvert = document.getElementById('btnConvert');

  btnConvert.onclick = function () {
    var textOrigin = taOrigin.value,
        oriUrls = textOrigin.split('\n'),
        resUrls = [];
    
    for (var i = 0; i < oriUrls.length; i++) {
      resUrls.push(Url.abs(oriUrls[i]));
    }

    taResult.value = resUrls.join('\n');
  }
});