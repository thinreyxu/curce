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
      this.emit({ type: 'add', child: child });
    };

    Container.prototype.remove = function (child) {
      this.emit({ type: 'remove', child: child });
    };

    mixin(Container.prototype, EventEmitter.prototype);
    EventEmitter.extendHandler(Container.prototype, ['add', 'remove']);
    
    return Container;
  })();


  var container = new Container();

  container.on('add', onChildAdd);
  container.on('remove', onChildRemove);

  container.onAdd({ from: 'onAdd' }, onChildAdd);
  container.onRemove({ from: 'onRemove' }, onChildRemove);

  container.add({ id: '3nd02ndk' });
  container.remove({ id: '9i3n8heb' });


  function onChildAdd (ev) {
    console.log('Child added: %o', ev.child);
  }

  function onChildRemove (ev) {
    console.log('Child removed: %o', ev.child);
  }
});
