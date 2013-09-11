requirejs.config({
  baseUrl: '../../src/'
});
require(['Uuid'], function (Uuid) {
  var times = 100000, bit = 8;

  test_uuid(36, bit, times);
  test_uuid(32, bit, times);
  test_uuid32(bit, times);

  test_uuid(32, bit*bit, times);
  test_uuid32(bit*bit, times);


  function test_uuid (radix, bit, times) {
    console.group('uuid(): radix[%d], bit[%d], times[%d]', radix, bit, times);
    console.log('e.g.1:', Uuid.uuid(bit, radix));
    console.log('e.g.2:', Uuid.uuid(bit, radix));
    console.log('e.g.3:', Uuid.uuid(bit, radix));
    console.log('e.g.4:', Uuid.uuid(bit, radix));
    console.log('e.g.5:', Uuid.uuid(bit, radix));
    console.time('total costs');
    for (var i = 0; i < times; i++) {
      Uuid.uuid(bit, radix);
    }
    console.timeEnd('total costs');
    console.groupEnd();
  }

  function test_uuid32 (bit, times) {
    console.group('uuid32(): radix[32], bit[%d], times[%d]', bit, times);
    console.log('e.g.1:', Uuid.uuid32(bit));
    console.log('e.g.2:', Uuid.uuid32(bit));
    console.log('e.g.3:', Uuid.uuid32(bit));
    console.log('e.g.4:', Uuid.uuid32(bit));
    console.log('e.g.5:', Uuid.uuid32(bit));
    console.time('total costs');
    for (var i = 0; i < times; i++) {
      Uuid.uuid32(bit);
    }
    console.timeEnd('total costs');
    console.groupEnd();
  }
});