require.config({
  map: {
    '*': {
      'array': '../../src/array.js'
    }
  }
});

require(['require', 'array', 'console'], function (array) {
  var tests = [
    'tests/filter',
    'tests/map',
    'tests/compact'
  ];
  require(tests);
});