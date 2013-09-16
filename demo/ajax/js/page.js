requirejs.config({
  baseUrl: '../../src',
});
require(['ajax', 'url'],
  function (ajax, url) {
    var exampleUrl = '../../src/ajax.js',
        absUrl = url.abs(exampleUrl);

    var loadUrl = document.getElementById('loadUrl'),
        result = document.getElementById('code');

    var form = document.getElementsByTagName('form')[0],
        inputUrl = document.getElementById('inputUrl'),
        inputTimeout = document.getElementById('inputTimeout'),
        blockEampleUrl = document.getElementById('sampleUrl'),
        btnStart = document.getElementById('btnStart'),
        btnAbort = document.getElementById('btnAbort');

    var xhr;

    inputUrl.value = absUrl;
    blockEampleUrl.innerHTML += absUrl;

    form.onsubmit = function () {
      return false;
    }

    btnStart.onclick = function () {
      btnStart.disabled = true;
      start();
    }

    btnAbort.onclick = function () {
      xhr.abort();
    }


    function start () {
      var absUrl = url.abs(inputUrl.value || exampleUrl),
          timeout = parseInt(inputTimeout.value) || 0;

      result.innerHTML = '[loading]';
      xhr = ajax({
        url: absUrl,
        method: 'GET',
        data: {
          id: 'curce'
        },
        success: success,
        error: error,
        timeout: timeout
      });

      loadUrl.innerHTML = xhr.url;
    }

    function success (res, xhr) {
      btnStart.disabled = false;
      // console.log(xhr.status);
      result.innerHTML = res.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function error (err, xhr) {
      btnStart.disabled = false;
      result.innerHTML = '[' + err.message.toUpperCase() + ']: ' + xhr.status + ' - ' + xhr.statusText;
      // console.error(err.message, xhr.status);
    }

  }
);