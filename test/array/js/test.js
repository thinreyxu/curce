require.config({
  map: {
    '*': {
      'array': '../../src/array.js'
    }
  }
});

require(['require', 'array', 'console'], function (require, array) {
  var tests = [
    'tests/filter',
    'tests/map',
    'tests/compact',
    'tests/reduce',
    'tests/reduceRight',
    'tests/forEach',
    'tests/forEachRight',
    'tests/indexOf',
    'tests/lastIndexOf'
  ];
  require(tests);
});