(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.classlist = init();
  }

  function init () {

    var classListSupport = 'classList' in document.body;

    function ClassList () {}

    // 添加空格分割的 class name
    ClassList.add = classListSupport ?
    function add (el, classNames) {
      split(classNames).forEach(function (className) {
        el.classList.add(className);
      });
    } :
    function add (el, classNames) {
      var classList = split(classNames),
          elClassName = el.className;

      for (var i = 0; i < classList.length; i++)
        if (elClassName.search(makeRE(classList[i])) === -1)
          elClassName += ' ' + classList[i];

      el.className = elClassName.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    };

    // 移除空格分割的 class name
    ClassList.remove = classListSupport ?
    function remove (el, classNames) {
      split(classNames).forEach(function (className) {
        el.classList.remove(className);
      });
    } :
    function remove (el, classNames) {
      var classList = split(classNames),
          elClassName = el.className;

      for (var i = 0; i < classList.length; i++)
        elClassName = elClassName.replace(makeRE(classList[i]), ' ');

      el.className = elClassName.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    };

    // 切换空格分割的 class name
    ClassList.toggle = classListSupport ?
    function toggle (el, classNames, onoff) {
      var result = [];

      if (typeof onoff === 'boolean') {
        onoff ? this.add(el, classNames) : this.remove(el, classNames);
        for (var i = 0; i < classNames.length; i++) {
          result.push(onoff);
        }
      }
      else {
        split(classNames).forEach(function (className) {
          result.push(el.classList.toggle(className));
        });
      }

      return result;
    } :
    function toggle (el, classNames, onoff) {
      var classList = split(classNames),
          elClassName = el.className,
          resElClassName = elClassName,
          result = [], re;

      if (typeof onoff === 'boolean') {
        onoff ? this.add(el, classNames) : this.remove(el, classNames);
        for (var i = 0; i < classNames.length; i++) {
          result.push(onoff);
        }
      }
      else {
        for (var i = 0; i < classList.length; i++) {
          re = makeRE(classList[i]);
          // 添加
          if (elClassName.search(re) === -1) {
            resElClassName += ' ' + classList[i];
            result.push(true);
          }
          // 移除
          else {
            resElClassName = resElClassName.replace(re, ' ');
            result.push(false);
          }
        }
        el.className = resElClassName.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
      }

      return result;
    };

    // 检测是否包含指定的 class name
    ClassList.contains = classListSupport ?
    function contains (el, classNames) {
      var result = [];
      split(classNames).forEach(function (className) {
        result.push(el.classList.contains(className));
      });
      return result;
    } :
    function contains (el, classNames) {
      var classList = split(classNames),
          elClassName = el.className,
          result = [];

      for (var i = 0; i < classList.length; i++) {
        result.push(elClassName.search(makeRE(classList[i])) !== -1);
      }

      return result;
    };


    function split (classNames) {
      return classNames ? classNames.match(/\S+/g) : [];
    }

    function makeRE (classname) {
      return new RegExp('(?:^|\\s+)' + classname + '(?:\\s+|$)', 'g');
    }


    return ClassList;
  }
})(window);
