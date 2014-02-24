require.config({
  baseUrl: '../../../src/'
});

require(['router/Router'], function (HashRouter) {

  console = typeof console !== 'undefined' ? console : {};
  var consoleMethods = ['log'];
  for (var i = 0; i < consoleMethods.length; i++) {
    console[consoleMethods] = console[consoleMethods] || function () {
      alert(Array.prototype.slice.call(arguments).toString());
    };
  }

  var router = new HashRouter({
    silence: false,
    root: 'host/'
  });

  router.route('/', function () {
    console.log('root');
  });

  router.route('/:name', function (name) {
    console.log(name);
  });

  router.route('/:cate/:id', function (cate, id) {
    console.log(cate, id);
  });

  router.route('/search*path', function (path) {
    console.log(path);
  });

  // router.route('*', function () {
  //   console.log(arguments);
  // });

  router.on('error', function (ev, err) {
    if (err.code === 404) {
      console.log('404, page not found.', err.fragment);
    }
  });

  router.onRoute(function (ev, data) {
    console.log('onroute:', data);
  });

  router.start();

  var links = getSelfLinks();
  for (var i = 0; i < links.length; i++) {
    links[i].onclick = onClick;
  }

  function onClick (ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    router.navigate(target.getAttribute('href').replace(/^\w+\:\/\//, '/'));

    if (ev.preventDefault) ev.preventDefault();
    else if ('returnValue' in ev) ev.returnValue = false;
    return false;
  }


  function getSelfLinks () {
    var result = [];
    var links = document.links;
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.getAttribute('data-target') === 'self') {
        result.push(link);
      }
    }
    return result;
  }

});