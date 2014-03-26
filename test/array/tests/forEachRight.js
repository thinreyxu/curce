define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9]
    , step = []
    , result = [];

  function forEachRightCallback (item, index, theArr) {
    if (!forEachRightCallback.once) {
      forEachRightCallback.once = true;
      equal(this, arr, 'this object should be the original array');
      equal(theArr, arr, 'the arr argument should be the original array');
    }
    result.push(item * 2);
    step.push(item);
  }

  module('forEachRight', {
    setup: function () {
      forEachRightCallback.once = false;
      step = [];
      result = [];
    }
  });

  test('array.forEachRight()', function () {
    array.forEachRight(arr, forEachRightCallback, arr);
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array must not be changed');
    deepEqual(result, [18,16,14,12,10,8,6,4,2], 'the result should be [18,16,14,12,10,8,6,4,2]');
    deepEqual(step, [9,8,7,6,5,4,3,2,1], 'the item arguments from each step should be 9,8,7,6,5,4,3,2,1');
  });

  // test('.forEachRight()', function () {
  //   array(arr).forEachRight(forEachRightCallback, arr);
  //   deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array must not be changed');
  //   deepEqual(result, [18,16,14,12,10,8,6,4,2], 'the result should be [18,16,14,12,10,8,6,4,2]');
  //   deepEqual(step, [9,8,7,6,5,4,3,2,1], 'the item arguments from each step should be 9,8,7,6,5,4,3,2,1');
  // });

});