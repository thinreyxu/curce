(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.classlist = init();
  }

  function init () {

    var classListSupport = document.body.hasOwnProperty('classList');

    // 添加空格分割的 class name
    var add = classListSupport ?
    function add (el, classNames) {
      [].forEach.call(split(classNames), function (className) {
        el.classList.add(className);
      });
    } :
    function add (el, classNames) {
      var classList = split(classNames)
        , elClassName = el.className
        , elClassList = split(elClassName);

      for (var i = 0; i < classList.length; i++)
        if (elClassName.search(makeRE(classList[i])) === -1)
          elClassList.push(classList[i]);

      el.className = elClassList.join(' ');
    };

    // 移除空格分割的 class name
    var remove = classListSupport ?
    function remove (el, classNames) {
      [].forEach.call(split(classNames), function (className) {
        el.classList.remove(className);
      });
    } :
    function remove (el, classNames) {
      var classList = split(classNames)
        , elClassName = el.className
        , elClassList = split(elClassName);

      for (var i = 0; i < classList.length; i++)
        if (elClassName.search(makeRE(classList[i])) !== -1)
          elClassList.splice(i--, 1);

      el.className = elClassList.join(' ');
    };

    // 切换空格分割的 class name
    var toggle = classListSupport ?
    function toggle (el, classNames) {
      var result = [];
      [].forEach.call(split(classNames), function (className) {
        result.push(el.classList.toggle(className));
      });
      return result;
    } :
    function toggle (el, classNames) {
      var classList = split(classNames)
        , elClassName = el.className
        , elClassList = split(elClassName)
        , result = [];

      for (var i = 0; i < classList.length; i++) {
        if (elClassName.search(makeRE(classList[i])) === -1) {
          elClassList.push(classList[i]);
          result.push(true);
        }
        else {
          elClassList.splice(i--, 1);
          result.push(false);
        }
      }
      el.className = elClassList.join(' ');

      return result;
    };

    // 检测是否包含指定的 class name
    var contains = classListSupport ?
    function contains (el, classNames) {
      var result = [];
      [].forEach.call(split(classNames), function (className) {
        result.push(el.classList.contains(className));
      });
      return result;
    } :
    function contains (el, classNames) {
      var classList = split(classNames)
        , elClassName = el.className
        , result = [];

      for (var i = 0; i < classList.length; i++) {
        result.push(elClassName.search(makeRE(classList[i])) !== -1);
      }

      return result;
    };
    

    var methods = [add, remove, toggle, contains];

    function split (classNames) {
      classNames = classNames.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
      return classNames ? classNames.split(' ') : [];
    }

    function makeRE (classname) {
      return new RegExp('(?:^|\\s)' + classname + '(?:\\s|$)');
    }

    function ClassList (el) {
      if (this instanceof ClassList === false) {
        return new ClassList(el);
      }
      this._wrapped = el;
    }

    for (var i = 0; i < methods.length; i++) {
      ClassList[methods[i].name] = methods[i];
      !function (i) {
        ClassList.prototype[methods[i].name] = function () {
          return methods[i].apply(this._wrapped, [this._wrapped].concat([].slice.call(arguments)));
        }
      }(i);
    }

    return ClassList;
  }
})(window);
