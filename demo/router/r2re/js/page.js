require.config({
  baseUrl: '../../../src/'
});

require(['router/r2re'], function (R2RE) {
  var r2re = new R2RE();

  r2re.use(['regexp', 'name', 'splat']);

  var route = '/:name/*splat/$5';

  console.log(r2re.makeRegExp(route));
});