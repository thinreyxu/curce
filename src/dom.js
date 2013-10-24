(function (_exports) {
  if (window.define) {
    define(['querystring', 'extend'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.dom = init(_exports.querystring, _exports.extend);
  }

  function init (qs, extend) {
    function Dom () {};

    // Dom.contains()
    if (document.compareDocumentPosition) {
      Dom.contains = function (container, contained, equal) {
        var result = container.compareDocumentPosition(contained);
        if (equal && result === 0 || (result & 16) === 16) {
          return true;
        }
        return false;
      }
    }
    else {
      Dom.contains = function (container, contained, equal) {
        contained = equal ? contained.parentNode : contained;
        while (contained) {
          if (contained === container) {
            return true;
          }
          contained = contained.parentNode;
        }
        return false;
      }
    }

    // Dom.style
    // camelize
    function camelize (str) {
      return str.replace(/-([a-zA-Z])/g, function ($0, char) {
        return char.toUpperCase();
      });
    }
    // hyphenize
    function hyphenize (str) {
      return str.replace(/([A-Z])/g, '-$1');
    }

    // 1. setStyle(body, 'height', '200px')
    // 2. setStyle(body, {'height':'200px', 'width':'200px'})
    // 3. setStyle(body, 'height:200px;width:200px;')
    Dom.setStyle = function (el, prop, value) {
      if (typeof prop === 'string') {
        if (prop.indexOf(':') === -1) {
          var props = {};
          props[prop] = value;
        }
        else {
          var cssText = prop
            .replace(/^\s+|\s+$/g, '')  // 去除首位空格
            .replace(/;$/, '')  // 去除末尾‘;’
            .replace(/:\s+/g, ':');  // 去除‘:’后的空格
          var props = qs.parse(cssText, ';', ':')
        }
      }
      else if (typeof prop === 'object') {
        var props = prop;
      }
      // 合并现有 cssText 和要设置的样式
      if (el.style.setProperty) {
        for (var prop in props) {
          el.style.setProperty(hyphenize(prop), props[prop]);
        }
      }
      else {
        for (var prop in props) {
          var cameledProp = camelize(prop);
          el.style[camelize(prop)] = props[prop];
        }
      }
    }

    Dom.getStyle = function (el, prop) {
      var style = el.currentStyle || getComputedStyle(el, false);
      return prop ? style[prop] : style;
    };

    Dom.getInlineStyle = function (el) {
      var cssText = el.style.cssText
        .replace(/^\s+|\s+$/g, '')  // 去除首位空格
        .replace(/;$/, '')  // 去除末尾‘;’
        .replace(/:\s+/g, ':');  // 去除‘:’后的空格
      
      return qs.parse(cssText, ';', ':');
    };

    return Dom;
  }
})(window);