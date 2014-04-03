require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/url'], function (url) {
  var btnParse = document.getElementById('btnParse'),
      btnStringify = document.getElementById('btnStringify'),
      taString = document.getElementById('taString'),
      taObject = document.getElementById('taObject'),
      inputParseQuery = document.getElementById('inputParseQuery');

  btnParse.onclick = function () {
    var surl, ourl, sourl;

    if ((surl = taString.value.replace(/^\s+|\s+$/g)) !== '') {
      try {
        ourl = url.parse(surl, inputParseQuery.checked);
        sourl = JSON.stringify(ourl, propFilter, '  ');
        taObject.value = sourl;
      }
      catch (err) {
        console.log(err);
        showError(taString);
      }
    }
  };

  btnStringify.onclick = function () {
    var sourl, ourl, surl;

    if ((sourl = taObject.value.replace(/^\s+|\s+$/g)) !== '') {
      try {
        ourl = JSON.parse(sourl || null);
        surl = url.stringify(ourl);
        taString.value = surl;
      }
      catch (err) {
        console.log(err);
        showError(taObject);
      }
    }
  };

  function showError (el) {
    el.parentNode.className = 'col-sm-5 has-error';
    setTimeout(function () {
      el.parentNode.className = 'col-sm-5';
    }, 2000);
  }

  function propFilter (name, value) {
    if (value === undefined) {
      return '';
    }
    return value;
  }
});