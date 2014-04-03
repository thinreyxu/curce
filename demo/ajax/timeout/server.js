var http = require('http');
var url = require('url');
var util = require('util');
var fs = require('fs');
var mime = require('mime');

http.createServer(function (req, res) {

  util.log(req.url);

  var ourl = url.parse(req.url, true);
  var filename = ourl.pathname.replace(/^\//, '');
  var qs = ourl.query;
  var timeout = 0;

  if (qs && qs.timeout) {
    timeout = Math.floor(qs.timeout) + 1000;
  }

  setTimeout(function () {
    if (filename) {
      fs.readFile(filename, function (err, file) {
        if (err) {
          return res.end(util.inspect(err));
        }  
        res.setHeader('content-type', mime.lookup(filename));
        res.end(file);
      });
    }
    else {
      res.end(util.inspect(qs));
    }
  }, timeout);

}).listen('3000');

console.log('server is listening at port 3000.');
