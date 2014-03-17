// v0.1.0
(function (_exports) {
  if (window.define) {
    define(init);
  }
  else {
    _exports = _exports.curce || (_exports.curce = {});
    _exports.query = init();
  }

  function init () {
    var selectors = {
          ID:         '#([\\w-]+)',
          CLASS:      '\\.([\\w-]+)',
          TAG:       '([a-zA-Z]+)',
          UNIVERSAL:  '(\\*)',
          ATTRIBUTE:  '\\[([\\w-]+)(?:([~|^$*=]=?)((?:"[^"]+")|(?:[^"]+)))?\\]',
          PSEUDO:     ':([\\w-]+)(?:\\(.*?\\))?'                    
        };

    function query (selectors, context) {
      context = context || document;

      var result = [], tmpResult;
      var tokenGroup = tokenize(selectors);

      for (var i = 0; i < tokenGroup.length; i++) {
        tmpResult = querySelector(tokenGroup[i], [context]);
        result = merge(result, tmpResult);
      }

      return result;
    }

    function querySelector (selector, context) {
      var result, tmpResult;

      for (var i = 0; i < selector.length && context.length > 0; i++) {
        var sequence = selector[i],
            combinator = sequence.combinator,
            tokens = sequence.tokens;
        var firstType = tokens[0].type,
            firstName = tokens[0].name;

        result = [];

        switch (combinator) {
          // 后继
          case ' ':
            if (firstType === 'ID') {
              tmpResult = document.getElementById(firstName);
              while (tmpResult) {
                for (var j = 0; j < context.length; j++) {
                  if (tmpResult === context[j]) {
                    result.push(context[j]);
                    break;
                  }
                }
                tmpResult = tmpResult.parentNode;
              }
              result = filter(result, tokens.slice(1));
            }
            else if (firstType === 'CLASS') {
              for (var j = 0; j < context.length; j++) {
                result = result.concat(getByClass(firstName, context[j]));
              }
              result = filter(result, tokens.slice(1));
            }
            else if (firstType === 'TAG' || firstType === 'UNIVERSAL') {
              for (var j = 0; j < context.length; j++) {
                result = result.concat(getByTagName(firstName, context[j]));
              }
              result = filter(result, tokens.slice(1));
            }
            else {
              for (var j = 0; j < context.length; j++) {
                result = result.concat(getByTagName('*', context[j]))
              }
              result = filter(result, tokens);
            }
            break;

          // 孩子
          case '>':
            for (var j = 0; j < context.length; j++) {
              result = result.concat(children(context[j]));
            }
            result = filter(result, tokens);
            break;

          // 紧邻的兄弟
          case '+':
            for (var j = 0; j < context.length; j++) {
              tmpResult = next(context[j]);
              if (tmpResult.length > 0) {
                result.push(tmpResult[0]);
              }
            }
            result = filter(result, tokens);
            break;

          // 兄弟
          case '~':
            for (var j = 0; j < context.length; j++) {
              result = result.concat(next(context[j]));
            }
            result = filter(result, tokens);
            break;
          
          // 开始 '@'
          default:
            if (firstType === 'ID') {
              var el = document.getElementById(firstName);
              if (context[0] === document || contains(context[0], el)) {
                result = [el];
                result = filter(result, tokens.slice(1));
              }
            }
            else if (firstType === 'CLASS') {
              result = getByClass(firstName, context[0]);
              result = filter(result, tokens.slice(1));
            }
            else if (firstType === 'TAG' || firstType === 'UNIVERSAL') {
              result = getByTagName(firstName, context[0]);
              result = filter(result, tokens.slice(1));
            }
            else if (firstType === 'PSEUDO' && pseudoSelector.indexOf(firstName) !== -1) {
              switch (firstName) {
                case 'root':
                  if (context[0] === document) {
                    result = [document.documentElement];
                  }
                  break;
                case 'target':
                  var el = document.getElementById(location.hash);
                  if (el && (context[0] === document || contains(context[0], el))) {
                    result = [el];
                  }
                  break;
              }
              result = filter(result, tokens.slice(1));
            }
            else {
              result = getByTagName('*', document);
              result = filter(result, tokens);
            }
            break;
        }

        context = result;
      }

      return result;
    }

    var pseudoSelector = 'root target';

    // Filters related 
    var filters = {
      'ID': function (el, token) {
        return el.id === token.name;
      },
      'CLASS': function (el, token) {
        return new RegExp('(^|\s)' + token.name + '(\s|^)').test(el.className);
      },
      'TAG': function (el, token) {
        return token.name.toLowerCase() === el.tagName.toLowerCase();
      },
      'UNIVERSAL': function (el, token) {
        return true;
      },
      'ATTRIBUTE': function (el, token) {
        var attr = el.getAttribute(token.name);

        if (token.opr) {
          switch (token.opr) {
            case '=':
              return attr === token.value;
            case '~=':
              if (token.value.search(/\W/) !== -1) {
                return false;
              }
              else {
                return new RegExp('\\b' + token.value + '\\b').test(attr);
              }
            case '|=':
              if (token.value.search(/\W/) !== -1) {
                return false;
              }
              else {
                return new RegExp('^' + token.value + '\\b').test(attr);
              }
            case '^=':
              return new RegExp('^' + token.value).test(attr);
            case '$=':
              return new RegExp(token.value + '$').test(attr);
            case '*=':
              return attr.indexOf(token.value) !== -1;
          }
        }
        else {
          return !!attr;
        }
      },
      'PSEUDO': function (el, token) {
        switch (token.name) {
          case 'first-child':
            return isRoot(el) || el.parentNode.children[0] === el;
          case 'last-child':
            return isRoot(el) || el.parentNode.children[el.parentNode.children.length - 1] === el;
          case 'first-of-type':
            if (isRoot(el)) {
              return true;
            }
            for (var i = 0, els = el.parentNode.children, len = els.length; i < len; i++) {
              if (els[i].tagName === el.tagName) {
                if (els[i] === el) {
                  return true;
                }
                else {
                  return false;
                }
              }
            }
          case 'last-of-type':
            if (isRoot(el)) {
              return true;
            }
            for (var els = el.parentNode.children, i = els.length - 1; i >= 0; i--) {
              if (els[i].tagName === el.tagName) {
                if (els[i] === el) {
                  return true;
                }
                else {
                  return false;
                }
              }
            }
            return false;
          case 'nth-child':
            var els = el.parentNode.children, index = -1;
            for (var i = 0, len = els.length; i < len; i++) {
              if (els[i] === el) {
                index = i;
                break;
              }
            }

            if (token.value === 'odd') {
              return (index + 1) % 2 === 1;
            }
            else if (token.value === 'even') {
              return (index + 1) % 2 === 0;
            }
            else {
              var reg = /([+-]?\d*)?([n])?([+-]\d+)?/;
              var found = reg.exec(token.value);

              var a = found[1],
                  n = found[2],
                  b = found[3];

              // 纯数字
              if (token.value === found[1]) {
                return parseInt(found[1]) === index + 1;
              }

              // 如果没有'n'，应该报错
              if (n !== 'n') {
                return false;
              }

              // 处理 a 和 b
              if (!b) {
                b = '0';
              }

              if (!a) {
                a = '1';
              }
              else if (a === '+' || a === '-') {
                a = a + '1';
              }
              
              var m = ((index + 1) - parseInt(b)) / parseInt(a);
              return m === parseInt(m) && m >= 0;
            }
          case 'nth-of-type':
            var els = el.parentNode.children, index = -1;
            for (var i = 0, len = els.length; i < len; i++) {
              if (els[i].tagName === el.tagName) {
                index++;
                if (els[i] === el) {
                  break;
                }
              }
            }

            if (token.value === 'odd') {
              return (index + 1) % 2 === 1;
            }
            else if (token.value === 'even') {
              return (index + 1) % 2 === 0;
            }
            else {
              var reg = /([+-]?\d*)?([n])?([+-]\d+)?/;
              var found = reg.exec(token.value);

              var a = found[1],
                  n = found[2],
                  b = found[3];

              // 纯数字
              if (token.value === found[1]) {
                return parseInt(found[1]) === index + 1;
              }

              // 如果没有'n'，应该报错
              if (n !== 'n') {
                return false;
              }

              // 处理 a 和 b
              if (!b) {
                b = '0';
              }

              if (!a) {
                a = '1';
              }
              else if (a === '+' || a === '-') {
                a = a + '1';
              }
              
              var m = ((index + 1) - parseInt(b)) / parseInt(a);
              return m === parseInt(m) && m >= 0;
            }
          case 'only-child':
            return el.parentNode.children.length === 1;
          case 'only-of-type':
            var n = 0;
            for (var i = 0, len = els.length; i < len; i++) {
              if (els[i].tagName === el.tagName && ++n > 1) {
                  break;
              }
            }
            return n === 1;
          case 'root':
            return el === document.documentElement;
          case 'target':
            return el.id === location.hash;
          case 'not':
            var matched = query(token.value);
            for (var i = 0; i < matched.length; i++) {
              if (el === matched[i]) {
                return false;
              }
            }
            return true;
          case 'empty':
            return el.children.length === 0;
          case 'enabled':
            return !el.disabled;
          case 'disabled':
            return !!el.disabled;
          case 'checked':
            return !!el.checked;
          case 'lang':
            return el.getAttribute('lang') === token.value;
        }
      }
    };

    function contains (parent, child, equal) {
      equal = equal || false;

      if (equal && parent === child) {
        return true;
      }

      while(children.parentNode) {
        if (parent === children.parentNode) {
          return true;
        }
        child = child.parentNode;
      }
      return false;
    }

    function getSelectorFilter (type) {

      return filters[type];
    }

    function filter (context, tokens) {
      var result = [];

      for (var i = 0; i < context.length; i++) {
        var el = context[i], qualified = true;

        for (var j = 0; j < tokens.length; j++) {
          var filterSelector = getSelectorFilter(tokens[j].type);
          if (filterSelector(el, tokens[j]) === false) {
            qualified = false;
            break;
          }
        }

        if (qualified) {
          result.push(context[i]);
        }
      }

      return result;
    }

    function getByClass (classname, context) {
      context = context || document;

      var result = [], tmpResult;
      var re_classname = new RegExp('(^|\s)' + classname + '(\s|$)');

      if (context.getElementsByClass) {
        tmpResult = context.getElementsByClass(classname);
        for (var i = 0, len = tmpResult.length; i < len; i++) {
          result.push(tmpResult[i]);
        }
      }
      else {
        tmpResult = context.getElementsByTagName('*');
        for (var i = 0, len = tmpResult.length; i < len; i++) {
          if (re_classname.test(tmpResult[i].className)) {
            result.push(tmpResult[i]);
          }
        }
      }

      return result;
    }

    function getByTagName (tagname, context) {
      context = context || document;

      var result = [], tmpResult;

      tmpResult = context.getElementsByTagName(tagname);
      for (var i = 0, len = tmpResult.length; i < len; i++) {
        result.push(tmpResult[i]);
      }

      return result;
    }

    function next (el) {
      var result = [];

      while(el.nextSibling) {
        if (el.nextSibling.nodeType === 1) {
          result.push(el.nextSibling);
        }
        el = el.nextSibling;
      }
      return result;
    }

    function children (el) {
      var result = [], tmpResult;

      tmpResult = el.children;
      for (var i = 0, len = tmpResult.length; i < len; i++) {
        result.push(tmpResult[i]);
      }

      return result;
    }

    function isRoot (el) {
      return el === document.documentElement;
    }

    function merge () {
      if (arguments.length < 0) {
        return [];
      }

      var result = [], tmpResult = [], arr, find;
      
      for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        arr = arguments[i];
        tmpResult = [];

        for (var j = 0, jlen = arr.length; j < jlen; j++) {
          find = false;

          for (var k = 0, klen = result.length; k < klen; k++) {
            if (result[k] === arr[j]) {
              find = true;
            }
          }

          if (find === false) {
            tmpResult.push(arr[j]);
          }
        }

        if (tmpResult.length > 0) {
          result = result.concat(tmpResult);
        }
      }

      return result;
    }

    // 从一组 selector 中匹配所有 simple selector，并返回一组 token
    // @param   {selectors}：选择器字符串
    // @return  {tokenGroup}：处理后的 token
    function tokenize (selectors) {
      var tokenGroup = [], group, selector, sequence;
      
      // 对查询组内每个selector
      group = selectors.split(',');
      for (var i = 0; selector = group[i]; i++) {
        // 处理查询字符串
        selector = selector.replace(/^\s+|\s+$/g, '');          // 去除首尾空格
        selector = selector.replace(/\s+/g, ' ');               // 合并连续的空格
        selector = selector.replace(/\s*([>+~](?![^\(\)]*?\)))\s*/g, '$1');    // 去除combinator左右的空格（combinator包括" ",">","+","~"四种）
        selector = selector.replace(/([>+~ ](?![^\(\)]*?\)))(?!=)/g, ';$1');   // 在combinator前面添加";"，以便使用";"切分字符串
        selector = '@' + selector;                              // 在字符串开头添加"@"

        // 对每个sequence of selectors进行选择器匹配，将结果添加到结果集
        tokenGroup[i] = []; // 初始化第i个结果集
        sequence = selector.split(';');  // 用";"拆分字符串，即根据combinator拆分字符串
        for (var j = 0; j < sequence.length; j++) {
          tokenGroup[i].push({'tokens': tokenizeSequenceOfSelectors(sequence[j].substring(1)), 'combinator': sequence[j].charAt(0)});
        }
      }

      return tokenGroup;
    };

    // 从 sequence of selectors 中匹配出每一个 simple selector，并返回相应的 tokens
    // @param   {sequence}：sequence of simple selectors
    // @return  {tokens}：处理后的 token
    function tokenizeSequenceOfSelectors (sequence) {
      var tokens = [], token, index = 0;

      while (sequence.length) {
        token = tokenizeFirstSimpleSelector(sequence);
        token.index = index;
        tokens.push(token);

        index += token.match.length;
        sequence = sequence.substring(token.match.length);
      }

      return tokens;
    }

    // 从 sequence of selectors 中匹配出第一个 simple selector，并返回相应的 token
    // @param   {sequence}：sequence of simple selectors
    // @return  {tokens}：处理后的 token
    function tokenizeFirstSimpleSelector (sequence) {
      var found = null,
          token = null,
          reg;

      for (var type in selectors) {
        reg = new RegExp('^' + selectors[type]);
        if (found = reg.exec(sequence)) {
          if (type === "PSEUDO") {
            found = matchPseudo(sequence, reg);
          }
          break;
        }
      }

      if (found) {
        switch (type) {
          case 'ID':
          case 'CLASS':
          case 'TAG':
          case 'UNIVERSAL':
            token = {
              name: found[1]
            };
            break;
          case 'ATTRIBUTE':
            token = {
              name: found[1]
            };
            found[2] && (token.opr = found[2]);
            found[3] && (token.value = found[3].replace(/^"|"$/g, ''));
            break;
          case 'PSEUDO':
            token = {
              name: found[1]
            };
            found[2] && (token.value = found[2]);
            break;
        }

        if (token) {
          token.type = type;
          token.match = found[0];
        }
      }

      return token;
    }

    // 专门用于匹配带括号的伪类选择器
    // @param   {pseudo}：以伪类选择器开头的 sequence of simple selectors
    // @param   {reg}：用于匹配伪类的正则表达式对象
    // @return  {found}：匹配结果
    function matchPseudo (pseudo, reg) {
      reg = reg || new RegExp('^:([\\w-]+)(?:\\(.*?\\))?');
      
      var reg2 = new RegExp('^.*?\\)');
      var found = reg.exec(pseudo),
          match = found && found[0];

      if (found && match.indexOf(')') !== -1) {
        while (match.match(/\(/g).length !== match.match(/\)/g).length) {
          match += reg2.exec(pseudo.substring(match.length))[0];
        }
        
        found[0] = match;
        found[2] = match.substring(found[1].length + 2, match.length - 1); // found第三项为伪类括号里面的内容
      }

      return found;
    }

    return query;
  }
})(window);