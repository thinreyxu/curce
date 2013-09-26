define(['array'], function (array) {
  var arr = [1,2,3,4,5,1,2,3,4,5];

  module('indexOf');
  
  test('array.indexOf()', function () {
    var result = array.indexOf(arr, 1);
    equal(result, 0, 'the index of 1 should be 0');

    var result2 = array.indexOf(arr, 1, 1);
    equal(result2, 5, 'the index of 1 form index 1 should be 5');

    var result3 = array.indexOf(arr, 1, -5);
    equal(result3, 5, 'the index of 1 from index -5 should be 5');

    var result4 = array.indexOf(arr, 1, arr.length);
    equal(result4, -1, 'the index of 1 from index ' + arr.length + ' should be -1');

    var result5 = array.indexOf(arr, 6);
    equal(result5, -1, 'the index of 6 should be -1');
  });

  test('.indexOf()', function () {
    var result = array(arr).indexOf(1).result();
    equal(result, 0, 'the index of 1 should be 0');


    var result2 = array(arr).indexOf(1, 1).result();
    equal(result2, 5, 'the index of 1 form 1 should be 5');

    var result3 = array(arr).indexOf(1, -5).result();
    equal(result3, 5, 'the index of 1 from index -5 should be 5');

    var result4 = array(arr).indexOf(1, arr.length).result();
    equal(result4, -1, 'the index of 1 from index ' + arr.length + ' should be -1');

    var result5 = array(arr).indexOf(6).result();
    equal(result5, -1, 'the index of 6 should be -1');
  })
});