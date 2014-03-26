(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.event = _exports.event || {};
    _exports.event_DOMEvent = init();
  }

  function init () {

    function Event (_constructor) {
      this._wrappedEvent = true;
      this._constructor = _constructor;
    }

    Event.prototype.initEvent = function (originalEvent, initValues) {
      if (originalEvent) {
        this.originalEvent = originalEvent;
      }

      var exts = [], ext,
          name = this._constructor;
      
      while (name) {
        ext = extensions[name];
        exts.unshift(ext);
        name = ext.inheritance;
      }

      while ((ext = exts.shift())) {
        // 扩展常量
        if (ext.constants) {
          for (var c in ext.constants) {
            this.constructor[c] = ext.constants[c];
          }
        }
        // 扩展实例方法
        if (ext.methods) {
          for (var m in ext.methods) {
            this[m] = ext.methods[m];
          }
        }
        // 执行初始化
        if (ext.initEvent) {
          ext.initEvent.call(this, originalEvent);
        }
      }

      // 填充初始值
      if (initValues) {
        for (var i in initValues) {
          this[i] = initValues[i];
        }
      }

      return this;
    };

    var extensions = {};

    /**
     * [Event description]
     * dictionary EventInit {
     *   boolean bubbles = false;
     *   boolean cancelable = false;
     * };
     */
    extensions.Event = {
      constants: {    
        // PhaseType
        NONE: 0,             // 未分派
        CAPTURING_PHASE: 1,  // 捕获阶段
        AT_TARGET: 2,        // 在事件源
        BUBBLING_PHASE: 3    // 冒泡阶段
      },
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.type = e.type || '';
        this.target = e.target || e.srcElement || null;
        this.currentTarget = e.currentTarget || null;
        this.bubbles = e.bubbles || false;
        this.cancelable = e.cancelable || false;
        this.timeStamp = e.timeStamp || new Date().getTime();
        this.defaultPrevented = e.defaultPrevented || false;
        this.isTrusted = e.isTrusted || false;

        this.propagationStopped = false;
        this.immediatePropagationStopped = false;

      },
      methods: {
        preventDefault: function () {
          if (this.originalEvent) {
            if (this.originalEvent.preventDefault) {
              this.originalEvent.preventDefault();
            }
            else {
              this.originalEvent.returnValue = false;
            }
          }
          this.defaultPrevented = true;
        },

        stopPropagation: function () {
          if (this.originalEvent) {
            if (this.originalEvent.stopPropagation) {
              this.originalEvent.stopPropagation();
            }
            else {
              this.originalEvent.cancelBubble = true;
            }
          }
          this.propagationStopped = true;
        },

        stopImmediatePropagation: function () {
          if (this.originalEvent) {
            if (this.originalEvent.stopImmediatePropagation) {
              this.originalEvent.stopImmediatePropagation();
            }
            else {
              this.originalEvent.cancelBubble = true;
            }
          }
          this.propagationStopped = true;
          this.immediatePropagationStopped = true;
        }
      }
    };

    /**
     * [CustomEvent description]
     * dictionary CustomEventInit {
     *   boolean bubbles = false;
     *   boolean cancelable = false;
     *   any     detail = null;
     * };
     */
    extensions.CustomEvent = {
      inheritance: 'Event',
      initEvent: function (originalEvent) {
        var e = originalEvent || {};    

        for (var item in originalEvent) {
          if (typeof originalEvent[item] !== 'function') {
            this[item] = originalEvent[item];
          }
        }
      }
    };

    /**
     * [MutationEvent description]
     */
    extensions.MutationEvent = {
      inheritance: 'Event',
      constants: {
        MODIFICATION: 1,
        ADDITION: 2,
        REMOVAL: 3
      },
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.relatedNode = e.relatedNode || null;
        this.prevValue = e.prevValue || '';
        this.newValue = e.newValue || '';
        this.attrName = e.attrName || '';
        this.attrChange = e.attrChange || 0;
      }
    };
    

    /**
     * [UIEvent description]
     * dictionary UIEventInit {
     *   boolean       bubbles = false;
     *   boolean       cancelable = false;
     *   AbstractView? view = null;
     *   long          detail = 0;
     * };
     */
    extensions.UIEvent = {
      inheritance: 'Event',
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.detail = e.detail || 0;
        this.view = e.view || null;
      }
    };
    

    /**
     * [FocusEvent description]
     * dictionary FocusEventInit {
     *   boolean       bubbles = false;
     *   boolean       cancelable = false;
     *   AbstractView? view = null;
     *   long          detail = 0;
     *   EventTarget?  relatedTarget = null;
     * };
     */
    extensions.FocusEvent = {
      inheritance: 'UIEvent',
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.relatedTarget = e.relatedTarget || (e.fromElement === e.target ? e.toElement : e.fromElement) || null;
      }
    };


    /**
     * [KeyboardEvent description]
     * dictionary KeyboardEventInit {
     *   boolean       bubbles = false;
     *   boolean       cancelable = false;
     *   AbstractView? view = null;
     *   long          detail = 0;
     *   DOMString     key = "";
     *   unsigned long location = 0;
     *   boolean       ctrlKey = false;
     *   boolean       shiftKey = false;
     *   boolean       altKey = false;
     *   boolean       metaKey = false;
     *   boolean       repeat = false;
     *   unsigned long charCode = 0;
     *   unsigned long keyCode = 0;
     *   unsigned long which = 0;
     * };
     */
    extensions.KeyboardEvent = {
      inheritance: 'UIEvent',
      constants: {
        DOM_KEY_LOCATION_STANDARD: 0x00,
        DOM_KEY_LOCATION_LEFT: 0x01,
        DOM_KEY_LOCATION_RIGHT: 0x02,
        DOM_KEY_LOCATION_NUMPAD: 0x03
      },
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.key = e.key || '';
        this.location = e.location || 0;

        this.ctrlKey = e.ctrlKey || false;
        this.shiftKey = e.shiftKey || false;
        this.altKey = e.altKey || false;
        this.metaKey = e.metaKey || false;

        this.repeat = e.repeat || false;

        // legacy
        this.charCode = e.charCode || 0;
        this.keyCode = e.keyCode || 0;
        this.which = e.which || 0;
      },
      methods: {
        getModifierState: function (key) {
          // TODO: 这是做什么用的？
        }
      }
    };


    /**
     * [InputEvent description]
     */
    extensions.InputEvent = {
      inheritance: 'UIEvent',
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.data = e.data || '';
      }
    };


    /**
     * [CompositionEvent description]
     * dictionary CompositionEventInit {
     *   boolean       bubbles = false;
     *   boolean       cancelable = false;
     *   AbstractView? view = null;
     *   long          detail = 0;
     *   DOMString?    data = null
     * };
     */
    extensions.CompositionEvent = {
      inheritance: 'Event',
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.data = e.data || '';
      }
    };


    /**
     * [MouseEvent description]
     * dictionary MouseEventInit {
     *   boolean        bubbles = false;
     *   boolean        cancelable = false;
     *   AbstractView?  view = null;
     *   long           detail = 0;
     *   long           screenX = 0;
     *   long           screenY = 0;
     *   long           clientX = 0;
     *   long           clientY = 0;
     *   boolean        ctrlKey = false;
     *   boolean        shiftKey = false;
     *   boolean        altKey = false;
     *   boolean        metaKey = false;
     *   unsigned short button = 0;
     *   unsigned short buttons = 0;
     *   EventTarget?   relatedTarget = null;
     * };
     */
    extensions.MouseEvent = {
      inheritance: 'UIEvent',
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.screenX = e.screenX || 0;
        this.screenY = e.screenY || 0;
        this.clientX = e.clientX || 0;
        this.clientY = e.clientY || 0;

        this.ctrlKey = e.ctrlKey || false;
        this.shiftKey = e.shiftKey || false;
        this.altKey = e.altKey || false;
        this.metaKey = e.metaKey || false;

        this.button = e.button || 0;
        this.buttons = e.buttons || 0;
        this.relatedTarget = e.relatedTarget || (e.fromElement === e.target ? e.toElement : e.fromElement) || null;
      },
      methods: {
        getModifierState: function (key) {
          // TODO: 这是做什么用的？
        }
      }
    };


    /**
     * [WheelEvent description]
     * dictionary WheelEventInit {
     *   boolean        bubbles = false;
     *   boolean        cancelable = false;
     *   AbstractView?  view = null;
     *   long           detail = 0;
     *   long           screenX = 0;
     *   long           screenY = 0;
     *   long           clientX = 0;
     *   long           clientY = 0;
     *   boolean        ctrlKey = false;
     *   boolean        shiftKey = false;
     *   boolean        altKey = false;
     *   boolean        metaKey = false;
     *   unsigned short button = 0;
     *   unsigned short buttons = 0;
     *   EventTarget?   relatedTarget = null;
     *   double         deltaX = 0.0;
     *   double         deltaY = 0.0;
     *   double         deltaZ = 0.0;
     *   unsigned long  deltaMode = 0;
     * };
     */
    extensions.WheelEvent = {
      inheritance: 'MouseEvent',
      constants: {
        DOM_DELTA_PIXEL: 0x00,
        DOM_DELTA_LINE: 0x01,
        DOM_DELTA_PAGE: 0x02
      },
      initEvent: function (originalEvent) {
        var e = originalEvent || {};

        this.deltaX = e.deltaX || 0;
        this.deltaY = e.deltaY || 0;
        this.deltaZ = e.deltaZ || 0;
        this.deltaMode = e.deltaMode || 0;

        this.wheelDelta = e.wheelDelta || -40 * e.detail || 0;
      },
      methods: {
        getModifierState: function (key) {
          // TODO: 这是做什么用的？
        }
      }
    };

    var typeNameMap = {
      'mouseover mouseout mouseenter mouseleave mousedown mouseup click dbclick': 'MouseEvent',
      'mousewheel wheel DOMMouseScroll': 'WheelEvent',
      'beforeinput input': 'InputEvent',
      'keydown keyup keypress': 'KeyboardEvent',
      'load unload abort error select resize scroll DOMActive submit reset change': 'UIEvent',
      'blur focus focusin focusout DOMFocusIn DOMFocusOut': 'FocusEvent',
      'compositionstart compositionupdate compositionend': 'CompositionEvent',
      'DOMAttrModified DOMCharacterDataModified DOMNodeInserted DOMNodeInsertedIntoDocument DOMNodeRemoved DOMNodeRemovedFromDocument DOMSubtreeModified': 'MutationEvent'
    };

    var DOMEvent = {};
      
    DOMEvent.createEvent = function (name) {
      if (name in extensions) {
        return new Event(name);
      }
      else {
        for (var types in typeNameMap) {
          if (types.indexOf(name) !== -1) {
            return new Event(typeNameMap[types]);
          }
        }
      }
      return new Event('CustomEvent');
    };

    return DOMEvent;
  }

})(window);