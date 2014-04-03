require.config({
  baseUrl: 'js/'
});

require(['curce/ajax'], function (ajax) {
  var btn_send = document.getElementById('send');
  btn_send.onclick = function () {
    var timeout = Math.floor(document.getElementById('timeout').value);
    ajax({
      method: 'get',
      url: '/',
      data: {
        timeout: timeout
      },
      timeout: timeout,
      error: function (err, xhr) {
        alert(err.message);
      },
      success: function (res, xhr) {
        alert(res);
      }
    });
  };
});
