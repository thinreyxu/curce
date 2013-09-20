(function (_exports) {
  if (window.define) {
    define(['array'], init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.classlist = init(_exports.array);
  }

  function init (array) {
    var add, remove, toggle, contains
      , methods;

    if (document && 'classList' in document.documentElement) {
      // 添加空格分割的 class name
      add = function add (el, classNames) {
        var classList = split(classNames);
        array.forEach(classList, function (className) {
          el.classList.add(className);
        });
      };

      // 移除空格分割的 class name
      remove = function remove (el, classNames) {
        var classList = split(classNames);
        array.forEach(classList, function (className) {
          el.classList.remove(className);
        });
      };

      // 切换空格分割的 class name
      toggle = function toggle (el, classNames) {
        var result, classList = split(classNames);
        array.forEachRight(classList, function (className) {
          result = el.classList.toggle(classList[i]);
        });
        return result;
      };

      // 检测是否包含指定的 class name
      contains = function contains (el, classNames) {
        var result, classList = split(classNames);
        array.forEachRight(classList, function (className) {
          result = el.classList.contains(classList[i]);
        });
        return result;
      };
    }
    else {
      add = function add (el, classNames) {
        var classList = split(classNames)
          , elClassList = split(el.className);

        array.forEach(classList, function (className) {
          if (array.indexOf(elClassList, className) === -1) {
            elClassList.push(className);
          }
        });
        el.className = elClassList.join(' ');
      };

      remove = function remove (el, classNames) {
        var classList = split(classNames)
          , elClassList = split(el.className)
          , index;

        array.forEach(classList, function (className) {
          if ((index = array.indexOf(elClassList, className)) !== -1) {
            elClassList.splice(index, 1);
          }
        });
        el.className = elClassList.join(' ');
      };

      toggle = function toggle (el, classNames) {
        var classList = split(classNames)
          , elClassList = split(el.className)
          , index
          , result;

        array.forEachRight(classList, function (className) {
          if ((index = array.indexOf(elClassList, className)) === -1) {
            result = elClassList.push(className);
          }
          else {
            result = elClassList.splice(index, 1);
          }
        });
        el.className = elClassList.join(' ');

        return result;
      };

      contains = function contains (el, classNames) {
        var classList = split(classNames)
          , elClassList = split(el.className)
          , result;

        array.forEachRight(classList, function (className) {
          result = (array.indexOf(elClassList, className) !== -1);
        });
        el.className = elClassList.join(' ');

        return result;
      };
    }

    methods = [add, remove, toggle, contains];

    function split (classNames) {
      classNames = classNames.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
      return classNames ? classNames.split(' ') : [];
    }

    function ClassList (el) {
      if (el instanceof ClassList) {
        return el;
      }
      if (this instanceof ClassList === false) {
        return new ClassList(el);
      }
      this._wrapped = el;
    }

    for (var i = 0; i < methods.length; i++) {
      ClassList[methods[i].name] = methods[i];
      ClassList.prototype[methods[i].name] = function () {
        return methods[i].apply(this_wrapped, [this._wrapped].concat(arguments));
      }
    }

    return ClassList;
  }
})(window);