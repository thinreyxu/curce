(function (exports) {

  exports.uuid = uuid;

  function uuid (bits) {
    bits = bits || 8;
    
    var id = '';
    for (var i = 0; i < bits; i++) {
      id += Math.floor(Math.random() * 16).toString(16);
    }
    
    return id;
  }

  return exports;
})(window);