requirejs.config({
  baseUrl: '../../src/'
});

require(['cookie'], function (cookie) {
  var currentCookie = document.getElementById('currentCookie')
    , currentCookieList = currentCookie.children[0]
    , sampleCookie = document.getElementById('sampleCookie')
    , sampleCookieList = sampleCookie.children[1]
    , btnAddCookie = document.getElementById('btnAddCookie')
    , btnRemoveCookie = document.getElementById('btnRemoveCookie')
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
    // 初始化添加cookie的表单
    initCookieForm();
  }();

  function initCookieForm () {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);
    inputExpires.value = date.toLocaleString();

    var pathname = location.pathname
      , index = pathname.lastIndexOf('/')
      , path = index === 0 ? pathname : pathname.substring(0, index);
    inputPath.value = path;

    inputDomain.value = location.host;

    btnAddCookie.onclick = addCookie;
    btnRemoveCookie.onclick = removeCookie;
  }

  function addCookie (e) {
    var rTrimspace = /^\s+|\s+$/g
      , name = inputName.value.replace(rTrimspace, '')
      , value = inputValue.value.replace(rTrimspace, '')
      , expires = inputExpires.value.replace(rTrimspace, '')
      , path = inputPath.value.replace(rTrimspace, '')
      , domain = inputDomain.value.replace(rTrimspace, '')
      , secure = inputSecure.checked;

    if (checkName() && checkValue()) {
      if (!isNaN(Number(expires))) {
        expires = Math.floor(Number(expires));
      }
      cookie.setItem(name, value, expires, path, domain, secure);
    }
  }

  function removeCookie (e) {
    var rTrimspace = /^\s+|\s+$/g
      , name = inputName.value.replace(rTrimspace, '')
      , path = inputPath.value.replace(rTrimspace, '')
      , domain = inputDomain.value.replace(rTrimspace, '')
      , secure = inputSecure.checked;

    if (checkName()) {
      cookie.removeItem(name, path, domain, secure);
    }
  }

  function checkName () {
    var name = inputName.value.replace(/^\s+|\s+$/g, '');
    if (!name) {
      inputName.parentNode.parentNode.className = 'form-group has-error';
      setTimeout(function () {
        inputName.parentNode.parentNode.className = 'form-group';
      }, 2000);
      return false;
    }
    return true;
  }

  function checkValue() {
    var value = inputValue.value.replace(/^\s+|\s+$/g, '');
    if (!value) {
      inputValue.parentNode.parentNode.className = 'form-group has-error';
      setTimeout(function () {
        inputValue.parentNode.parentNode.className = 'form-group';
      }, 2000);
      return false;
    }
    return true;
  }

  function showCookie () {
    var cookies = cookie.getItems();

    currentCookieList.innerHTML = '';
    for (var i in cookies) {
      currentCookieList.appendChild(createCookieItem(i, cookies[i]));
    }
    // console.log(cookies);
    setTimeout(function () {
      showCookie(); 
    }, 500);
  }

  function createCookieItem (name, value) {
    var item = document.createElement('li');
    item.innerHTML = '<strong class="text-primary">' + name +
      '</strong>: <span class="text-muted">' + value + '</span>';
    item.setAttribute('data-cookieName', name);
    item.className = 'list-group-item';
    return item;
  }

  function addSampleCookie () {
    var sample = [
      ['name', 'thineryxu', '2013/10/01', '/', location.host],
      ['sex', 'male', 10],
      ['age', '25', 60],
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
        var date;
        if (data[i] !== undefined) {
          switch (data[i].constructor) {
            case Number:
              date = new Date(new Date().getTime() + data[i] * 1000);
              break;
            case String:
              date = new Date(data[i]);
              break;
            case Date:
              date = data[i];
              break;
          }
        }
        cell.innerHTML = data[i] ? date.toLocaleString() : '<small class="text-muted">session</small>';
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