requirejs.config({
  baseUrl: '../../src/'
});

require(['cookie'], function (cookie) {
  var currentCookie = document.getElementById('currentCookie')
    , currentCookieList = currentCookie.children[0]
    , sampleCookie = document.getElementById('sampleCookie')
    , sampleCookieList = sampleCookie.children[1]
    , btnClearAll = document.getElementById('btnClearAll')
    , btnAddCookie = document.getElementById('btnAddCookie')
    , inputName = document.getElementById('inputName')
    , inputValue = document.getElementById('inputValue')
    , inputExpires = document.getElementById('inputExpires')
    , inputPath = document.getElementById('inputPath')
    , inputDomain = document.getElementById('inputDomain')
    , inputSecure = document.getElementById('inputSecure');
  
  !function init () {
    // 添加样例cookie
    addSampleCookie();
    // 显示当前cookie
    showCookie();
    // 点击×删除cookie
    currentCookie.onclick = deleteCookie;
    // 点击“Clear all”，清除所有cookie
    btnClearAll.onclick = function () {
      cookie.clear();
    };
    // 初始化添加cookie的表单
    initAddCookieForm();
  }();

  function initAddCookieForm () {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);
    inputExpires.value = date.toLocaleString();

    var pathname = location.pathname
      , index = pathname.lastIndexOf('/')
      , path = index === 0 ? pathname : pathname.substring(0, index);
    inputPath.value = path;

    inputDomain.value = location.host;

    btnAddCookie.onclick = addCookie;
  }

  function addCookie (e) {
    var rTrimspace = /^\s+|\s+$/g
      , name = inputName.value.replace(rTrimspace, '')
      , value = inputValue.value.replace(rTrimspace, '')
      , expires = inputExpires.value.replace(rTrimspace, '')
      , path = inputPath.value.replace(rTrimspace, '')
      , domain = inputDomain.value.replace(rTrimspace, '')
      , secure = inputSecure.checked;

    if (!name) {
      inputName.parentNode.parentNode.className = 'form-group has-error';
      setTimeout(function () {
        inputName.parentNode.parentNode.className = 'form-group';
      }, 2000);
    }
    if (!value) {
      inputValue.parentNode.parentNode.className = 'form-group has-error';
      setTimeout(function () {
        inputValue.parentNode.parentNode.className = 'form-group';
      }, 2000);
    }

    if (name && value) {
      cookie.setItem(name, value, expires, path, domain, secure);
    }
  }

  function deleteCookie (e) {
    var target, item, cookieName;
    e = e || window.event;
    target = e.target;
    if (target.className === 'close') {
      item = target.parentNode;
      cookieName = item.getAttribute('data-cookieName');
      cookie.removeItem(cookieName);
    }
  }

  function showCookie () {
    var cookies = cookie.getItems();
    
    currentCookieList.innerHTML = '';
    for (var i in cookies) {
      currentCookieList.appendChild(createCookieItem(i, cookies[i]));
    }
    
    setTimeout(function () {
      showCookie(); 
    }, 500);
  }

  function createCookieItem (name, value) {
    var item = document.createElement('li');
    item.innerHTML = '<i class="close">&times;</i>' +
      '<strong class="text-primary">' + name + '</strong>: ' +
      '<span class="text-muted">' + value + '</span>';
    item.setAttribute('data-cookieName', name);
    item.className = 'list-group-item';
    return item;
  }

  function addSampleCookie () {
    var sample = [
      ['name', 'thineryxu', '2013/10/01', '/', location.host],
      ['sex', 'male', new Date().getTime() + 10000],
      ['age', '25', new Date().getTime() + 60000],
      ['toBeRemoved', 'true']
    ];
    for (var i = 0; i < sample.length; i++) {
      cookie.setItem.apply(cookie, sample[i]);
      sampleCookieList.appendChild(createSampleCookie(sample[i]));
    }
  }

  function createSampleCookie (data) {
    var item = document.createElement('tr'), cell;
    for (var i = 0; i < 6; i++) {
      cell = document.createElement('td');
      if (i === 2) {
        cell.innerHTML = data[i] ? new Date(data[i]).toLocaleString() : '<small class="text-muted">session</small>';
      }
      else if (i === 3) {
        var pathname = location.pathname
          , index = pathname.lastIndexOf('/')
          , path = index === 0 ? pathname : pathname.substring(0, index);
        cell.innerHTML = data[i] ||
        '<small class="text-muted">' + path + '</small>';
      }
      else if (i === 4) {
        cell.innerHTML = data[i] || '<small class="text-muted">' + location.host + '</small>';
      }
      else {
        cell.innerHTML = data[i] || '<small class="text-muted">not set</small>';
      }
      item.appendChild(cell);
    }
    return item;
  }
});