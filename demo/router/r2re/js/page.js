require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/router/r2re'], function (R2RE) {
  var r2re = new R2RE();

  r2re.use(['regexp', 'escapeRegExp', 'namedParam', 'splatParam', 'wildcard']);

  var routes = [
    '/:name/*splat/$5',
    '*',
    /\w+\d+/,
    /^stdlib$/
  ];

  for (var i = 0; i < routes.length; i++) {
    var route = routes[i]; 
    console.log(r2re.makeRegExp(route));
  }
});