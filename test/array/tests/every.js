define(['array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9];

  function everyCallback (item, index, theArr) {
    if (!everyCallback.once) {
      everyCallback.once = true;
      equal(this, arr, 'this object should be the original array');
      equal(theArr, arr, 'the arr argument should be the original array');
    }
    return item % 2;
  }

  function everyCallback2 (item, index, theArr) {
    return typeof item === 'number';
  }

  module('every', {
    setup: function () {
      everyCallback.once = false;
    }
  });

  test('array.every()', function () {
    var result = array.every(arr, everyCallback, arr);
    equal(result, false, 'not every item in the array is odd');

    var result2 = array.every(arr, everyCallback2);
    equal(result2, true, 'every item in the array is a number');
  });

  // test('.every()', function () {
  //   var result = array(arr).every(everyCallback, arr).result();
  //   equal(result, false, 'not every item in the array is odd');

  //   var result2 = array(arr).every(everyCallback2).result();
  //   equal(result2, true, 'every item in the array is a number');
  // });
});