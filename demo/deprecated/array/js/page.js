require.config({
  baseUrl: '../../../src'
});

require(['deprecated/array'], function (array) {
  var arr = [1,2,3,4,5,6,7,8,9,0];

  console.group('array.filter()');
    console.log('result:', array.filter(arr, filterCallback, arr));
  console.groupEnd();

  console.group('array().filter()');
    console.log('result:', array(arr).filter(filterCallback, arr));
  console.groupEnd();

  function filterCallback (item, index, arr) {
    console.log(this, item, index, arr);
    return item % 2;
  }

});