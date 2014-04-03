(function (_exports) {
  if (typeof define === 'function' && define.amd) {
    define(['curce/querystring', 'curce/extend', 'curce/string', 'curce/object'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.dom = init(_exports.querystring, _exports.extend, _exports.string, object);
  }

  function init (qs, extend, string, object) {

    function DOM () {}

    // DOM.contains()
    DOM.contains = document.compareDocumentPosition ?
    function (container, contained, equal) {
      if (!container || !contained) {
        return false;
      }
      var result = container.compareDocumentPosition(contained);
      if (equal && result === 0 || (result & 16) === 16) {
        return true;
      }
      return false;
    } :
    function (container, contained, equal) {
      if (!container || !contained) {
        return false;
      }
      contained = !equal ? contained.parentNode : contained;
      while (contained) {
        if (contained === container) {
          return true;
        }
        contained = contained.parentNode;
      }
      return false;
    };

    // DOM.style

    // 1. setStyle(body, 'height', '200px')
    // 2. setStyle(body, {'height':'200px', 'width':'200px'})
    // 3. setStyle(body, 'height:200px;width:200px;')
    DOM.setStyle = function (el, prop, value) {
      var props;
      if (typeof prop === 'string') {
        if (prop.indexOf(':') === -1) {
          props = {};
          props[prop] = value;
        }
        else {
          var cssText = prop
            .replace(/^\s+|\s+$/g, '')  // 去除首位空格
            .replace(/;$/, '')  // 去除末尾‘;’
            .replace(/(:|;)\s+/g, '$1');  // 去除‘:’后的空格
          props = qs.parse(cssText, ';', ':');
        }
      }
      else if (typeof prop === 'object') {
        props = prop;
      }

      if (el.style.setProperty) {
        object.forEach(props, function (prop, name) {
          el.style.setProperty(name, prop);
        });
      }
      else {
        // 合并现有 cssText 和要设置的样式
        props = extend(this.getInlineStyle(el), props);
        el.style.cssText = qs.stringify(props, ';', ':');
      }
    };

    DOM.getStyle = function (el, prop) {
      var style = el.currentStyle || getComputedStyle(el, false);
      return prop ? style[prop] : style;
    };

    DOM.getInlineStyle = function (el) {
      var cssText = el.style.cssText
        .replace(/^\s+|\s+$/g, '')  // 去除首位空格
        .replace(/;$/, '')  // 去除末尾‘;’
        .replace(/:\s+/g, ':');  // 去除‘:’后的空格
      
      return qs.parse(cssText, ';', ':');
    };

    return DOM;
  }
})(window);