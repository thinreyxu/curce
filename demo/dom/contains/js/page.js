require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/dom'], function (dom) {
  console.log(dom.contains(document.documentElement, document.body));  // true
});