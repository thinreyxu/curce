(function (_exports) {
  if (window.define) {
    define(['event/event'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    init(_exports.event);
  }

  function init (event) {
    ////////////////////////////////////
    // processor: DOMContentLoaded    //
    // alias: ready                   //
    ////////////////////////////////////
    var ready = false;
    var readyTest = false;
    var readyListeners = [];
    var script, head;
    var processor = {
      beforeAdd: function (listener) {
        if (ready) {
          listener.handler.call(listener.context || listener.el, listener.ev || {}, listener.data);
        }
        else {
          readyListeners.push(listener);  
        }
        return false;
      }
    };

    event.extendProcessor('ready DOMContentLoaded', processor);

    if (!readyTest) {
      readyTest = true;
      if (document.readyState === 'complete') {
        readyHandler();
      }
      else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', readyHandler, false);
        window.addEventListener('load', readyHandler, false);
      }
      else {
        document.attachEvent('onreadystatechange', readyHandler);
        window.attachEvent('onload', readyHandler);
        script = document.createElement('script');
        head = document.getElementsByTagName('head')[0];
        script.defer = true;
        script.onreadystatechange = readyHandler;
        head.appendChild(script);
      }
    }

    function readyHandler () {
      if (!ready && (document.addEventListener ||
      event.type === 'load' || script && script.readyState === 'complete' || document.readyState === 'complete'))
      {
        ready = true;

        var listener;
        while((listener = readyListeners.shift())) {
          listener.handler.call(listener.context || listener.el, listener.ev || {}, listener.data);
        }
        
        if (document.removeEventListener) {
          document.removeEventListener('DOMContentLoaded', readyHandler, false);
          window.removeEventListener('load', readyHandler, false);
        }
        if (document.detachEvent) {
          document.detachEvent('onreadystatechange', readyHandler);
          window.detachEvent('onload', readyHandler);
        }
        if (script) {
          head.removeChild(script);
        }
      }
    }
  }
})(window);