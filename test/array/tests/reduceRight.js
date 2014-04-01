define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9]
    , step = [];
  function reduceRightCallback (lastResult, item, index, arr) {
    step.push(lastResult);
    return lastResult + item;
  }
  module('reduceRight', {
    setup: function () {
      step = [];
    }
  });
  test('array.reduceRight()', function () {
    // without initValue
    var result = array.reduceRight(arr, reduceRightCallback);
    equal(result, 45, 'result should be 45');
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array should not be modified');
    deepEqual(step, [9,17,24,30,35,39,42,44], 'the result of every reduceRight step should be [9,17,24,30,35,39,42,44]');
  });

  test('array.reduceRight() with initValue', function () {
    // with initValue
    var result = array.reduceRight(arr, reduceRightCallback, 10);
    equal(result, 55, 'result should be 55 when given a init value of 10');
    deepEqual(arr, [1,2,3,4,5,6,7,8,9], 'the original array should not be changed even when a init value was given');
    deepEqual(step, [10,19,27,34,40,45,49,52,54], 'the result of every reduceRight step should be [10,19,27,34,40,45,49,52,54]');
  });

  // test('.reduceRight()', function () {
  //   // without initValue
  //   var result = array(arr).reduceRight(reduceRightCallback);
  //   equal(result.result(), 45, 'result should be 45');
  //   deepEqual(result.value(), [1,2,3,4,5,6,7,8,9], 'the original array should not be modified');
  //   deepEqual(step, [9,17,24,30,35,39,42,44], 'the result of every reduceRight step should be [9,17,24,30,35,39,42,44]');
  // });

  // test('.reduceRight() with initValue', function () {
  //   // with initValue
  //   var result = array(arr).reduceRight(reduceRightCallback, 10);
  //   equal(result.result(), 55, 'result should be 55 when given a init value of 10');
  //   deepEqual(result.value(), [1,2,3,4,5,6,7,8,9], 'the original array should not be changed');
  //   deepEqual(step, [10,19,27,34,40,45,49,52,54], 'the result of every reduceRight step should be [10,19,27,34,40,45,49,52,54]');
  // });
});