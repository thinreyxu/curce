require.config({
  baseUrl: '../../../src/'
});

require(['eventemitter', 'mixin'], function (EventEmitter, mixin) {

  var Container = (function () {

    var em = new EventEmitter();

    function Container () {
      EventEmitter.call(this);
    }

    Container.prototype.add = function (child) {
      this.emit('add', { child: child });
    };

    Container.prototype.remove = function (child) {
      this.emit('remove', { child: child });
    };

    mixin(Container.prototype, EventEmitter.prototype);
    EventEmitter.extendHandler(Container.prototype, ['add', 'remove']);
    
    return Container;
  })();


  var container = new Container();

  container.on('add', onChildAdd);
  container.on('remove', onChildRemove);

  container.onAdd(onChildAdd, { from: 'onAdd' });
  container.onRemove(onChildRemove, { from: 'onRemove' });

  container.add({ id: '3nd02ndk' });
  container.remove({id: '9i3n8heb' });


  function onChildAdd (ev, data) {
    console.log('Child added: %o', data.child);
  }

  function onChildRemove (ev, data) {
    console.log('Child removed: %o', data.child);
  }
});
