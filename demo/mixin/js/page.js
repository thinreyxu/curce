require.config({
  baseUrl: '../../src/'
});

require(['mixin'], function (mixin) {

  var Creature = (function () {

    return {
      say: function () {
        console.log('Hello ' + this.name);
      },
      jump: function () {
        console.log('I jumped %s meters high.', (Math.random() * 10).toFixed(2));
      },
      swim: function () {
        console.log('Sorry, I cannot swim.')
      }
    };

  })();

  function Person (name, age) {
    this.name = name;
    this.age = age;
  }

  mixin(Person.prototype, Creature, ['say', 'jump']);

  var person = new Person('thinreyxu', 25);
  person.say();
  person.jump();
  try {
    person.swim();
  }
  catch (err) {
    console.log('Person does not have method swim()');
  }
});