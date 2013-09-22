define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9];

  function filterCallback (item, index, arr) {
    if (!filterCallback.once) {
      filterCallback.once = true;
      equal(this, arr, 'this object should be arr.');
    }
    return item % 2;
  }

  module('filter');
  test('array.filter()', function () {
    filterCallback.once = false;
    var result = array.filter(arr, filterCallback, arr);
    equal(result.length, 5, 'length of the result array should be 5.');
    deepEqual(result, [1,3,5,7,9], 'result should be [1,3,5,7,9].');
  });
  test('.filter()', function () {
    filterCallback.once = false;
    var result = array(arr).filter_(filterCallback, arr).filter_(function (item) {
      return item % 3;
    }).result();
    equal(result.length, 3, 'length of the result array should be 3.');
    deepEqual(result, [1,5,7], 'result should be [1,5,7].');
  });
});