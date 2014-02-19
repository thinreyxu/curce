require.config({
  baseUrl: '../../../src/'
});

require(['router/HashRouter'], function (HashRouter) {
  var router = new HashRouter();
  router.route('/:name', function (name) {
    console.log(arguments);
  });
  router.start();

  // router.navigate('/thinreyxu');
});