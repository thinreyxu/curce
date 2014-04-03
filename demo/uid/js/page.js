requirejs.config({
  paths: {
    curce: '../../../src'
  }
});
require(['curce/uid'], function (uid) {
  var times = 100000, bit = 8;

  test_uid(36, bit, times);
  test_uid(32, bit, times);

  test_uid(32, bit*bit, times);


  function test_uid (radix, bit, times) {
    console.group('uid(): radix[%d], bit[%d], times[%d]', radix, bit, times);
    console.log('e.g.1:', uid(bit, radix));
    console.log('e.g.2:', uid(bit, radix));
    console.log('e.g.3:', uid(bit, radix));
    console.log('e.g.4:', uid(bit, radix));
    console.log('e.g.5:', uid(bit, radix));
    console.time('total costs');
    for (var i = 0; i < times; i++) {
      uid(bit, radix);
    }
    console.timeEnd('total costs');
    console.groupEnd();
  }
});