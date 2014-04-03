require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/fn'], function (fn) {
  
  function Person (name, age) {
    this.name = name;
    this.age = age;
  }

  Person.prototype.introduce = function (greetings) {
    console.log('I\'m %s, %d years old. %s', this.name, this.age, greetings);
  };

  // 使用原生的 bind
  if (Function.prototype.bind) {
    var objA = {};
    var A = Person.bind(objA);
    var a = new A('erix', 25);

    a.introduce('Hello everyone.');
    console.log(objA);                // empty object
    console.log(a instanceof Person); // true
    console.log(a instanceof A);      // true
  }

  // 使用 fn 的 bind
  var objB = {};
  var B = fn.bind(Person, objB);
  var b = new B('erix', 25);

  b.introduce('Hello everyone.');
  console.log(objB);                // empty object
  console.log(b instanceof Person); // true
  console.log(b instanceof B);      // true

  // 使用 fn 的 bind，但不实例化对象
  var objC = {};
  var C = fn.bind(Person, objC);
  var c = C('erix', 25);

  try {
    c.introduce('Hello everyone.');   // Error
  }
  catch (err) {
    console.log(err.message);
  }
  console.log(objC);                // { name: 'erix', age: 25 }
  console.log(c instanceof Person); // false
  console.log(c instanceof C);      // false

});