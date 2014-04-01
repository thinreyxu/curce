/**
 * Inspired by John Resig's 'Simple JavaScript Inheritance'.
 * See: http://ejohn.org/blog/simple-javascript-inheritance/
 */

(function (_exports) {
  if (typeof define !== 'undefined' && define.amd) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.inherit = init();
  }

  function init () {
    
    function inherit (SuperClass, constructor, instanceMethods, classMethods) {
      
      // 处理三个参数的情形： 
      // inherit(SuperClass, instanceMethods, classMethods);
      if (typeof constuctor === 'object') {
        classMethods = instanceMethods;
        instanceMethods = constructor;
        constructor = undefined;
      }
      else if (arguments.length === 2 && typeof constructor === 'function') {
        classMethods = constructor;
        instanceMethods = constructor.prototype;
      }

      // 创建子类
      function SubClass () {
        // 继承父级的属性
        this._super = function () {
          SuperClass.apply(this, arguments);
        };
        // 执行子类的实际构造方法
        if (typeof constructor === 'function') {
          constructor.apply(this, arguments);
        }
      }

      // 建立原型对象，继承父类的实例方法
      function Proto () {}
      var superProto =  Proto.prototype = SuperClass.prototype;
      SubClass.prototype = new Proto();

      // 添加子类的实例方法
      for (var name in instanceMethods) {

        var method = instanceMethods[name];

        // 处理方法体中调用父类同名方法的重载的方法
        if (typeof method === 'function' &&
          typeof superProto[name] === 'function' &&
          /this\._super/.test(method))
        {

          (function (name, method) {
            SubClass.prototype[name] = function () {
              var _super = this._super;
              this._super = superProto[name];
              var ret = method.apply(this, arguments);
              this._super = _super;
              return ret;
            };
          })(name, method);
        }
        // 处理非重载方法
        else {
          SubClass.prototype[name] = method;
        }
      }

      // 修复子类原型上的 Constructor
      SubClass.prototype.constructor = SubClass;

      // 建立指向父类的引用
      SubClass.prototype.superClass = SuperClass;

      // 添加子类的类方法
      for (var item in classMethods) {
        SubClass[item] = classMethods[item];
      }

      // 返回子类
      return SubClass;
    }

    return inherit;
  }

})(window);