define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9]
    , step = [];
  function reduceCallback (lastResult, item, index, arr) {
    step.push(lastResult);
    return lastResult + item;
  }
  module('reduce', {
    setup: function () {
      step = [];
    }
  });
  test('array.reduce()', function () {
    // without initValue
    var result = array.reduce(arr, reduceCallback);
    equal(result, 45, 'result should be 45');
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array should not be modified');
    deepEqual(step, [1,3,6,10,15,21,28,36], 'the result of every reduce step should be [1,3,6,10,15,21,28,36]');
  });

  test('array.reduce() with initValue', function () {
    // with initValue
    var result2 = array.reduce(arr, reduceCallback, 10);
    equal(result2, 55, 'result should be 55 when given a init value of 10');
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array should not be changed even when a init value was given')
    deepEqual(step, [10,11,13,16,20,25,31,38,46], 'the result of every reduce step should be [10,11,13,16,20,25,31,38,46]');
  });

  test('.reduce()', function () {
    // without initValue
    var result = array(arr).reduce(reduceCallback);
    equal(result.result(), 45, 'result should be 45');
    deepEqual(result.value(), [1,2,3,4,5,6,7,8,9], 'the original array should not be modified');
    deepEqual(step, [1,3,6,10,15,21,28,36], 'the result of every reduce step should be [1,3,6,10,15,21,28,36]');
  });

  test('.reduce() with initValue', function () {
    // with initValue
    var result2 = array(arr).reduce(reduceCallback, 10);
    equal(result2.result(), 55, 'result should be 55 when given a init value of 10');
    deepEqual(result2.value(), [1,2,3,4,5,6,7,8,9], 'the original array should not be changed');
    deepEqual(step, [10,11,13,16,20,25,31,38,46], 'the result of every reduce step should be [10,11,13,16,20,25,31,38,46]');
  });
});