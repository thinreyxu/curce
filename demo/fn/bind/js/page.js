require.config({
  baseUrl: '../../../src/'
});

require(['fn'], function (fn) {
  
  function Person (name, age) {
    this.name = name;
    this.age = age;
  }

  Person.prototype.introduce = function (greetings) {
    console.log('I\'m %s, %d years old. %s', this.name, this.age, greetings);
  };

  var objA = {};
  var A = Person.bind(objA);
  var a = new A('erix', 25);

  a.introduce('Hello everyone.');
  console.log(objA);
  console.log(a instanceof Person);
  console.log(a instanceof A);

  var objB = {};
  var B = fn.bind(Person, objB);
  var b = new B('erix', 25);

  b.introduce('Hello everyone.');
  console.log(objB);
  console.log(b instanceof Person);
  console.log(b instanceof B);
});