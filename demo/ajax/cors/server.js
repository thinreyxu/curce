var http = require('http')
  , url = require('url')
  , util = require('util');

http.createServer(function (req, res) {
  var ourl = url.parse(req.url, true)
    , pathname = ourl.pathname
    , qs = ourl.query
    , sleep = parseInt(qs.sleep, 10) || 0
    , headers = [
        ['origin', 'access-control-allow-origin'],
        ['access-control-request-method', 'access-control-allow-methods'],
        ['access-control-request-headers', 'access-control-allow-headers']
      ];

  console.log('=======================');
  console.log(req.headers);

  res.setHeader('access-control-allow-credentials', 'true');
  res.setHeader('access-control-max-age', 60);
  for (var i = 0; i < headers.length; i++) {
    if (headers[i][0] in req.headers) {
      res.setHeader(headers[i][1], req.headers[headers[i][0]]);
    }
  }

  setTimeout(function () {
    switch (pathname) {
      case '/req':
        res.write(util.inspect(req.headers));
        break;
      case '/res':
        res.write(util.inspect(res));
        break;
      default:
        res.write(200);
    }
    res.end();
  }, sleep * 1000);

}).listen('3000', function () {
  console.log('Server is listening at port 3000.');
});