requirejs.config({
  paths: {
    curce: '../../../../src'
  }
});
require(['curce/ajax', 'curce/url'],
  function (ajax, url) {
    var exampleUrl = 'http://localhost:3000/req';

    var loadUrl = document.getElementById('loadUrl'),
        result = document.getElementById('code');

    var form = document.getElementsByTagName('form')[0],
        inputUrl = document.getElementById('inputUrl'),
        inputTimeout = document.getElementById('inputTimeout'),
        blockEampleUrl = document.getElementById('sampleUrl'),
        btnStart = document.getElementById('btnStart'),
        btnAbort = document.getElementById('btnAbort');

    var xhr;

    inputUrl.value = exampleUrl;
    blockEampleUrl.innerHTML += exampleUrl;

    form.onsubmit = function (e) {
      e = e || window.event;
      e.preventDefault && e.preventDefault();
      e.returnValue = false;
      
      btnStart.disabled = true;
      start();
    };

    btnAbort.onclick = function (e) {
      xhr && xhr.abort();
    };

    function start () {
      var ourl = inputUrl.value || exampleUrl
        , absUrl = url.abs(inputUrl.value || exampleUrl)
        , timeout = parseInt(inputTimeout.value) || 0;

      result.innerHTML = '[loading]';
      xhr = ajax({
        url: ourl,
        method: 'GET',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          'access-time': new Date().toUTCString()
        },
        success: success,
        error: error,
        timeout: timeout
      });

      loadUrl.innerHTML = xhr.url;
    }

    function success (res, xhr) {
      btnStart.disabled = false;
      if ('innerText' in result) {
        result.innerText = res;
      }
      else {
        result.innerHTML = res.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
    }

    function error (err, xhr) {
      btnStart.disabled = false;
      result.innerHTML = '[' + err.message.toUpperCase() + ']: ' + (xhr.status || 0) + ' - ' + (xhr.statusText || '');
    }

  }
);