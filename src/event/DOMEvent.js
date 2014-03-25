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

    Event.prototype.initEvent = function (originalEvent, data) {
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

      while (ext = exts.shift()) {
        if (ext.constants) {
          for (var item in ext.constants) {
            this.constructor[item] = ext.constants[item];
          }
        }
        if (ext.methods) {
          for (var item in ext.methods) {
            this[item] = ext.methods[item];
          }
        }
        if (ext.initEvent) {
          ext.initEvent.call(this, originalEvent, data);
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.type = e.type || d.type || '';
        this.target = e.target || e.srcElement || d.target || null;
        this.currentTarget = e.currentTarget || d.currentTarget || null;
        this.bubbles = e.bubbles || d.bubbles || false;
        this.cancelable = e.cancelable || d.cancelable || false;
        this.timeStamp = e.timeStamp || d.timeStamp || new Date().getTime();
        this.defaultPrevented = e.defaultPrevented || d.defaultPrevented || false;
        this.isTrusted = e.isTrusted || d.isTrusted || false;

        this.propagationStopped = d.propagationStopped || false;
        this.immediatePropagationStopped = d.immediatePropagationStopped || false;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};    

        this.detail = d.detail || null;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.relatedNode = e.relatedNode || d.relatedNode || null;
        this.prevValue = e.prevValue || d.prevValue || '';
        this.newValue = e.newValue || d.newValue || '';
        this.attrName = e.attrName || d.attrName || '';
        this.attrChange = e.attrChange || d.attrChange || 0;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.detail = e.detail || d.detail || 0;
        this.view = e.view || d.view || null;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.relatedTarget = e.relatedTarget || (e.fromElement === e.target ? e.toElement : e.fromElement) || d.relatedTarget || null;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.key = e.key || d.key || '';
        this.location = e.location || d.location || 0;

        this.ctrlKey = e.ctrlKey || d.ctrlKey || false;
        this.shiftKey = e.shiftKey || d.shiftKey || false;
        this.altKey = e.altKey || d.altKey || false;
        this.metaKey = e.metaKey || d.metaKey || false;

        this.repeat = e.repeat || d.repeat || false;

        // legacy
        this.charCode = e.charCode || d.charCode || 0;
        this.keyCode = e.keyCode || d.keyCode || 0;
        this.which = e.which || d.which || 0;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.data = e.data || d.data || '';
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.data = e.data || d.data || '';
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.screenX = e.screenX || d.screenX || 0;
        this.screenY = e.screenY || d.screenY || 0;
        this.clientX = e.clientX || d.clientX || 0;
        this.clientY = e.clientY || d.clientY || 0;

        this.ctrlKey = e.ctrlKey || d.ctrlKey || false;
        this.shiftKey = e.shiftKey || d.shiftKey || false;
        this.altKey = e.altKey || d.altKey || false;
        this.metaKey = e.metaKey || d.metaKey || false;

        this.button = e.button || d.button || 0;
        this.buttons = e.buttons || d.buttons || 0;
        this.relatedTarget = e.relatedTarget || (e.fromElement === e.target ? e.toElement : e.fromElement) || d.relatedTarget || null;
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
      initEvent: function (originalEvent, data) {
        var e = originalEvent || {}, d = data || {};

        this.deltaX = e.deltaX || d.deltaX || 0;
        this.deltaY = e.deltaY || d.deltaY || 0;
        this.deltaZ = e.deltaZ || d.deltaZ || 0;
        this.deltaMode = e.deltaMode || d.deltaMode || 0;

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
    };

    return DOMEvent;
  }

})(window);