require.config({
  baseUrl: '../../../src/'
});

require(['eventemitter', 'inherit'], function (EventEmitter, inherit) {

  var Container = (function () {

    function Container () {
      this.super();
    }

    Container.prototype.add = function (child) {
      this.emit('add', { child: child });
    };

    Container.prototype.remove = function (child) {
      this.emit('remove', { child: child });
    };

    Container = inherit(EventEmitter, Container, Container.prototype);

    EventEmitter.extend(Container.prototype, ['add', 'remove']);

    return Container;
  })();

  var container = new Container();

  container.on('add', onChildAdd);
  container.on('remove', onChildRemove);

  container.onAdd(onChildAdd, { from: 'onAdd' });
  container.onRemove(onChildRemove, { from: 'onRemove' });

  container.add({ id: '3nd02ndk' });
  container.remove({id: '9i3n8heb' });


  function onChildAdd (ev) {
    console.log('Child added: %o', ev.data);
  }

  function onChildRemove (ev) {
    console.log('Child removed: %o', ev.data);
  }
});