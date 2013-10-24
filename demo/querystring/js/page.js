require.config({
  baseUrl: '../../src'
});
require(['querystring'], function (qs) {
  console.group('query');
  var query = {
    name: 'thinrey.xu',
    age: 30,
    gender: 'male',
    string: '=%^<>{}:;'
  }
  console.log(query);
  console.log(qs.stringify(query));
  console.log(qs.stringify(query, true));
  console.log(qs.stringify(query, '; ', true));
  console.log(qs.stringify(query, '; ', ': '));
  console.groupEnd();

  console.group('queryArray');
  var queryArray = [
    ['name', 'thinrey.xu'],
    ['age', 30],
    ['gender', 'male'],
    ['string', '=%^<>{}:;']
  ];
  console.log(queryArray);
  console.log(qs.stringify(queryArray));
  console.groupEnd();

  console.group('parse');
  var querystring = 'name: thinrey.xu, age: 30, gender: male, string: =%^<>{}:;'
  console.log(querystring);
  console.log(qs.parse(querystring, ', ', ': '));
  console.log(qs.parseAsArray(querystring, ', ', ': '));
  console.groupEnd();
});