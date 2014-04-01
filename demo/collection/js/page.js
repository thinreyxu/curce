require.config({
  baseUrl: '../../src/'
});

require(['collection'], function (Collection) {
  var collection = new Collection();
  var item = { name: 'unknown' };
  
  collection.add(item);
  console.log('size: %d', collection.size());
  console.log();
  
  collection.add(item);
  console.log('size: %d', collection.size());
  
  collection.remove(item);
  console.log('size: %d', collection.size());
  
  collection.add(item);
  console.log('size: %d', collection.size());
  
  collection.empty();
  console.log('size: %d', collection.size());


});