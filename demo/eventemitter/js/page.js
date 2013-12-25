require.config({
  baseUrl: '../../src/'
});

require(['eventemitter'], function (EventEmitter) {
  var em = EventEmitter.create();

  em.on('connection', onConnection);

  em.emit('connection', { time: new Date().toLocaleString() }, { name: 'context' });

  // em.enable(false);

  em.off(onConnection);

  em.emit('connection');

  function onConnection (data) {
    console.log('connection');
  }
});