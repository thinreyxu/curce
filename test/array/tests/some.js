define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9];

  function someCallback (item, index, theArr) {
    if (!someCallback.once) {
      someCallback.once = true;
      equal(this, arr, 'this object should be the original array');
      equal(theArr, arr, 'the arr argument should be the original array');
    }
    return item > 10;
  }

  function someCallback2 (item, index, theArr) {
    return typeof item !== 'number';
  }

  module('some', {
    setup: function () {
      someCallback.once = false;
    }
  });

  test('array.some()', function () {
    var result = array.some(arr, someCallback, arr);
    equal(result, false, 'none in the array is greater than 10');

    var result2 = array.some(arr, someCallback2);
    equal(result2, false, 'none in the array is not a number');
  });

  test('.some()', function () {
    var result = array(arr).some(someCallback, arr).result();
    equal(result, false, 'none in the array is greater than 10');

    var result2 = array(arr).some(someCallback2).result();
    equal(result2, false, 'none in the array is not a number');
  });
});