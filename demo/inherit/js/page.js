require.config({
  baseUrl: '../../src/'
});

require(['inherit'], function (inherit) {
  
  function Person (name, age) {
    this.name = name;
    this.age = age;
  }

  Person.prototype.say = function () {
    console.log('My name is %s and I\'m %d y.o..', this.name, this.age);
  };


  function Worker (name, age, job) {
    this._super(name, age);
    this.job = job;
  }

  Worker.prototype.say = function () {
    this._super();
    console.log('My job is %s.', this.job);
  };

  Worker.prototype.quit = function () {
    console.log('I quit my job (%s).', this.job);
  };

  Worker = inherit(Person, Worker, Worker.prototype);

  var worker = new Worker('thinreyxu', 26, 'f2e');

  worker.say();
  worker.quit();
  console.log('worker instanceof Person:', worker instanceof Person);
  console.log(worker);
});