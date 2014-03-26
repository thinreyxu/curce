define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9];

  function mapCallback (item, index, arr) {
    if (!mapCallback.once) {
      mapCallback.once = true;
      equal(this, arr, 'this object should be arr.');
    }
    return item * 2;
  }

  module('map');
  test('array.map()', function () {
    mapCallback.once = false;
    var result = array.map(arr, mapCallback, arr);
    equal(result.length, 9, 'length of the result array should be 9.');
    deepEqual(result, [2,4,6,8,10,12,14,16,18], 'result should be [2,4,6,8,10,12,14,16,18].');
  });
  // test('.map()', function () {
  //   mapCallback.once = false;
  //   var result = array(arr).map_(mapCallback, arr).map_(function (item) {
  //     return item % 3;
  //   }).result();
  //   equal(result.length, 9, 'length of the result array should be 9.');
  //   deepEqual(result, [2,1,0,2,1,0,2,1,0], 'result should be [2,1,0,2,1,0,2,1,0].');
  // });
});