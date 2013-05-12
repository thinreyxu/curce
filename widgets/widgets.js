
window.Curce = window.Curce || {};

(function (exports) {
  var ui = exports.ui = exports.ui || {};
  var w = exports.w = exports.w || {};

  w.widgets = widgets;
  w.getDataset = getDataset;
  w.convertType = convertType;
  w.initSettings = initSettings;

  // widgets factory
  function widgets (w_name, w_protos) {

    var Widget = w_protos['Constructor'] || Constructor;

    function Constructor (el, options) {
      // 解决继承问题
      if (arguments.length === 0) {
        return;
      }

      // 解决以函数方式调用的问题
      if (this instanceof Constructor === false) {
        return new Constructor(el, options);
      }

      // 生成设置
      this.settings = initSettings(w_protos['defaults'], getDataset(el), options, w_protos['refinement']);

      // 调用初始化函数
      w_protos['init'].call(this, el, options);
    }

    // 扩展原型
    for (var item in w_protos) {
      if (item === 'defaults' || item === 'constructor') {
        continue;
      }

      Widget.prototype[item] = w_protos[item];
    }

    // 输出至ui
    ui[w_name] = Widget;

  }

  // 根据标签属性和传入JSON生成配置对象
  // 优先级从高到低依次是options, attributes, defaults
  function initSettings (defaults, attributes, options, refinement) {
    var settings;

    // 计算设置
    settings = priorExtend(defaults, attributes, options);

    // 处理设置
    for (var item in defaults) {
      // 转换为指定类型
      if (typeof settings[item] !== typeof defaults[item]) {
        settings[item] = convertType(settings[item], typeof defaults[item]);
      }
      // 调用refinement函数处理设置为合法值
      if (refinement) {
        settings[item] = refinement(item, settings[item]);
      }
    }

    return settings;
  }

  // 优先级扩展，以第一个参数为蓝本，参数优先级由低到高
  function priorExtend () {
    var args = Array.prototype.slice.call(arguments);
    var obj = {};

    for (var item in args[0]) {
      for (var i = args.length - 1; i >= 0; i--) {
        if (args[i] !== undefined && args[i][item] !== undefined) {
          obj[item] = args[i][item];
          break;
        }
      }
    }

    return obj;
  }

  // 将data-attributes变成指定的类型
  function convertType (value, type) {

    var result;

    switch (type) {
      case 'number':
        result = parseFloat(value);
        break;
      case 'boolean':
        result = (value === 'true');
        break;
      case 'string':
        result = value;
        break;
      case 'object':
        result = eval('(' + value + ')');
        break;
    }

    return result;
  }

  // 根据获取keys获取el的dataset
  function getDataset (el, keys) {

    var dataset = {}, filteredDataset,
        attrs, attr;

    var re_data = /^data-/;

    // 获取dataset
    if (el.dataset) {
      dataset = el.dataset;
    }
    else {
      attrs = el.attributes;
      for (var i = 0, len = attrs.length; i < len; i++) {
        attr = attrs[i];
        if (re_data.test(attr.name) === true) {
          dataset[attr.name.substring(5)] = attr.value;
        }
      }
    }

    // 根据keys过滤dataset
    if (keys) {
      filteredDataset = {};
      for (var i = 0, len = keys.length; i < len; i++) {
        filteredDataset[keys[i]] = dataset[keys[i]];
      }
      dataset = filteredDataset;
    }

    return dataset;
  }

  // 将dataset转变成指定类型
})(window.Curce);