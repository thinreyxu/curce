define(['array'], function (array) {
  var arr = [1,2,3,4,5,1,2,3,4,5];

  module('lastIndexOf');
  
  test('array.lastIndexOf()', function () {
    var result = array.lastIndexOf(arr, 1);
    equal(result, 5, 'the index of 1 should be 5');

    var result2 = array.lastIndexOf(arr, 1, 1);
    equal(result2, 0, 'the index of 1 form index 1 should be 0');

    var result3 = array.lastIndexOf(arr, 1, -6);
    equal(result3, 0, 'the index of 1 from index -6 should be 0');

    var result4 = array.lastIndexOf(arr, 1, -arr.length - 1);
    equal(result4, -1, 'the index of 1 from index ' + -arr.length - 1 + ' should be -1');

    var result5 = array.lastIndexOf(arr, 6);
    equal(result5, -1, 'the index of 6 should be -1');
  });

  // test('.lastIndexOf()', function () {
  //   var result = array(arr).lastIndexOf(1).result();
  //   equal(result, 5, 'the index of 1 should be 5');


  //   var result2 = array(arr).lastIndexOf(1, 1).result();
  //   equal(result2, 0, 'the index of 1 form 1 should be 0');

  //   var result3 = array(arr).lastIndexOf(1, -6).result();
  //   equal(result3, 0, 'the index of 1 from index -6 should be 0');

  //   var result4 = array(arr).lastIndexOf(1, -arr.length - 1).result();
  //   equal(result4, -1, 'the index of 1 from index ' + -arr.length - 1 + ' should be -1');

  //   var result5 = array(arr).lastIndexOf(6).result();
  //   equal(result5, -1, 'the index of 6 should be -1');
  // })
});