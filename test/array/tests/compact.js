define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9];

  module('compact');
  test('array.compact()', function () {
    var result = array.compact(arr, [2,4,6,8]);
    equal(result.length, 5, 'length of the result array should be 5.');
    deepEqual(result, [1,3,5,7,9], 'result should be [1,3,5,7,9].');
  });
  // test('.compact()', function () {
  //   delete arr[0];
  //   var result = array(arr).compact_([2,4,6,8]).result();
  //   equal(result.length, 4, 'length of the result array should be 4.');
  //   deepEqual(result, [3,5,7,9], 'result should be [3,5,7,9].');
  // });
});