require.config({
  paths: {
    curce: '../../../../src'
  }
});

require(['curce/eventemitter', 'curce/inherit'], function (EventEmitter, inherit) {

  var Container = (function () {

    function Container () {
      this._super();
    }

    Container.prototype.add = function (child) {
      this.emit('add', { child: child });
    };

    Container.prototype.remove = function (child) {
      this.emit('remove', { child: child });
    };

    Container = inherit(EventEmitter, Container, Container.prototype);

    EventEmitter.extendHandler(Container.prototype, 'add remove');

    return Container;
  })();

  var container = new Container();

  container.on('add', onChildAdd);
  container.on('remove', onChildRemove);

  container.onAdd({ from: 'onAdd' }, onChildAdd);
  container.onRemove({ from: 'onRemove' }, onChildRemove);

  container.add({ id: '3nd02ndk' });
  container.remove({id: '9i3n8heb' });

  function onChildAdd (ev, data) {
    console.log('Child added from:\t%s,\tthe child: %o', ev.data && ev.data.from, data.child.id);
  }

  function onChildRemove (ev, data) {
    console.log('Child removed from:\t%s,\tthe child: data: %o', ev.data && ev.data.from, data.child.id);
  }
});
