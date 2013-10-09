require.config({
  baseUrl: '../../../src/'
});

require(['dom'], function (dom) {
  console.log(dom.contains(document.documentElement, document.body));
  console.log(dom.contains(document.documentElement, document.body));
  console.log(dom.contains(document.documentElement, document.body));
});