function getByClass (classname, obj, tag) {
  var tmp, result = [], re_classname;

  obj = obj || document;
  tag = tag || '*';

  if (obj.getElementsByClassName) {
    tmp = obj.getElementsByClassName(classname);

    for (var i = 0, len = tmp.length; i < len; i++) {
      result.push(tmp[i]);
    }
  }
  else {

    re_classname = new RegExp('(^|\\s)' + classname + '(\\s|$)');

    tmp = obj.getElementsByTagName(tag);

    for (var i = 0, len = tmp.length; i < len; i++) {
      if (re_classname.test(tmp[i].className)) {
        result.push(tmp[i]);
      }
    }
  }

  return result;
}

function hasClass (obj, classname) {
  var re_classname = new RegExp('(^|\\s)' + classname + '(\\s|$)');

  if (obj.className.search(re_classname) !== -1) {
    return true;
  }

  return false;
}

function addClass (obj, classname) {
  var re_classname = new RegExp('(^|\\s)' + classname + '(\\s|$)');

  if(obj.className.search(re_classname) === -1) {
    if (obj.className.search(/\S/) === -1) {
      obj.className = classname;
    }
    else {
      obj.className += ' ' + classname;
    }
  }
}

function removeClass (obj, classname) {
  var re_classname = new RegExp('(^|\\s)' + classname + '(\\s|$)', 'g');

  obj.className = obj.className.replace(re_classname, ' ').replace(/^\s+|\s+$/, '');
}

function getPosition (obj) {
  var l = 0, t = 0;

  if (obj !== document.documentElement && !obj.parentNode) {
    return;
  }
  
  while (obj) {
    l += obj.offsetLeft;
    t += obj.offsetTop;
    obj = obj.offsetParent;
  }

  return {
    left: l,
    top: t
  };
}