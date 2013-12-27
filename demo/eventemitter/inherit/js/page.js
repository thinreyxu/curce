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

    return Container;
  })();


  console.log(Container);

  var container = new Container();

  console.log(container);

  container.on('add', onChildAdd);
  container.on('remove', onChildRemove);

  container.add({ id: '3nd02ndk' });
  container.remove({id: '9i3n8heb' });


  function onChildAdd (ev) {
    console.log('Child added: %o', ev.data.child);
  }

  function onChildRemove (ev) {
    console.log('Child removed: %o', ev.data.child);
  }
});