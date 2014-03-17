require.config({
  baseUrl: '../../../src/'
});

require(['eventemitter'], function (EventEmitter) {
  var em = new EventEmitter();

  em.on('connection', onConnection, null, { name: 'contextFromOn'});
  em.on('data', onData, { registerTime: new Date().toLocaleString() });
  em.on('close', onClose, null, { name: 'contextFromOn' });

  var id_1 = 'ids2d593d';
  em.emit('connection', { user: id_1 });
  em.emit('data', { user: id_1 }, {});
  em.emit('close', { user: id_1, closeTime: new Date().toLocaleString() });

  var id_2 = 'id832j0s8';
  em.emit('connection', { emitTime: new Date().toLocaleString() }, { name: 'contextFromEmit' });
  em.emit('data', { user: id_2 }, {});
  em.emit('close', { user: id_2, closeTime: new Date().toLocaleString() });

  // em.enable(false);
  em.off(onConnection);
  em.off('data');
  em.off('close', onClose);


  function onConnection (ev, data) {
    console.group('connection %s', data.user);
      console.log('Context', this);
      console.log('Type', ev.type);
      console.log('Data', ev.data);
    console.groupEnd();
  }

  function onClose (ev, data) {
    console.group('close %s', data.user);
      console.log('Context', this);
      console.log('Type', ev.type);
      console.log('Data', ev.data);
    console.groupEnd();
  }

  function onData (ev, data) {
    console.group('data %s', data.user);
      console.log('Context', this);
      console.log('Type', ev.type);
      console.log('Data', ev.data);
    console.groupEnd();
  }
});
