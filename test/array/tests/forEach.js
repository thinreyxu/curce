define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9]
    , step = []
    , result = [];

  function forEachCallback (item, index, theArr) {
    if (!forEachCallback.once) {
      forEachCallback.once = true;
      equal(this, arr, 'this object should be the original array');
      equal(theArr, arr, 'the arr argument should be the original array');
    }
    result.push(item * 2);
    step.push(item);
  }

  module('forEach', {
    setup: function () {
      forEachCallback.once = false;
      step = [];
      result = [];
    }
  });

  test('array.forEach()', function () {
    array.forEach(arr, forEachCallback, arr);
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array must not be changed');
    deepEqual(result, [2,4,6,8,10,12,14,16,18], 'the result should be [2,4,6,8,10,12,14,16,18]');
    deepEqual(step, [1,2,3,4,5,6,7,8,9], 'the item arguments from each step should be 1,2,3,4,5,6,7,8,9');
  });

  test('.forEach()', function () {
    array(arr).forEach(forEachCallback, arr);
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array must not be changed');
    deepEqual(result, [2,4,6,8,10,12,14,16,18], 'the result should be [2,4,6,8,10,12,14,16,18]');
    deepEqual(step, [1,2,3,4,5,6,7,8,9], 'the item arguments from each step should be 1,2,3,4,5,6,7,8,9');
  });

});