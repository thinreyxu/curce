requirejs.config({
  baseUrl: '../../src/'
})

require(['jsonp'], function (jsonp) {
  var URL = 'http://www.wookmark.com/api/json',

      nav = document.getElementById('nav'),
      navItems = nav.getElementsByTagName('a'),
      content = document.getElementById('content'),
      contentWrapper = document.getElementById('content-wrapper'),
      loading = document.getElementById('loading'),
      note = document.getElementById('note'),
      noteCloseBtn = document.getElementById('note-close'),
      item_tmpl = document.getElementById('item-template').innerHTML,

      itemBorder = 1,
      itemContentWidth = 180,
      itemPaddingWidth = 0,
      itemWidth = itemBorder * 2 + itemPaddingWidth * 2 + itemContentWidth,
      minItemContentHeight = 400,

      columnGap = 19,
      columnWidth = itemWidth + columnGap * 2,
      columns,

      minColumnCount = 1,
      maxColumnCount = 6,

      pageGap = 50,

      page = 0,
      itemID = 0,
      noMoreContent = false,

      param,

      lastResizeTime,
      resizeTimer,
      resizeThrottle = 1000,

      loadingFreezed = false,
      lastScrollTop = 0,
      loadingScrollThrottle = 100,
      lowestLoadingPos,

      unloadedImages = [],

      request,

      transitionSupport = isStyleFeatureSupported('transition'),
      transitionEndEvent = transitionSupport.vendorID ? transitionSupport.vendorID + 'TransitionEnd' : 'transitionEnd';


  init();

  function init () {
    var hash = location.hash;

    initNav(hash);
    initContent(hash);
    window.onresize = onResize;
    window.onscroll = onScroll;

    initNote();
  }

  function initNav (hash) {
    for (var i = 0, len = navItems.length; i < len; i++) {
      navItems[i].onclick = function () {
        var href = this.getAttribute('href');
        location.hash = href;
        initContent(href);
        setNav(href);
        return false;
      };
    }
    setNav(hash);
  }

  function setNav (hash) {
    var foundItem, defaultItem, href;

    // console.log(hash);

    for (var i = 0, len = navItems.length; i < len; i++) {
      href = navItems[i].getAttribute('href');
      // console.log(href);
      if (href === hash) {
        foundItem = navItems[i];
      }
      if (href === '#popular') {
        defaultItem = navItems[i];
      }
      removeClass(navItems[i], 'on');
    }
    foundItem = foundItem || defaultItem;
    addClass(foundItem, 'on');
  }

  function initContent(hase) {
    lastResizeTime = new Date().getTime();
    loadingFreezed = false;
    itemID = 0;
    page = 0;

    request && request.abort();

    switch (hase) {
      case '#architecture':
        param = {
          data: {
            type: 'search',
            term: 'architecture',
            page: page++
          }
        };
        break;

      case '#interior_design':
        param = {
          data: {
            type: 'search',
            term: 'interior design',
            page: page++
          }
        };
        break;

      case '#recent':
        param = {
          path: '/recent',
          data: {
            page: page++
          }
        };
        break;

      case '#popular':
      default:
        param = {
          path: '/popular',
          data: {
            page: page++
          }
        };
        break;
    }

    addColumns();
    getData(onDataLoadingStart, onData, onError);
  }


  function onDataLoadingStart (options) {
    loadingFreezed = true;
    showLoading('Loading Images ...');
  }

  function onData (data) {
    var items = createItems(data);

    addItems(items, onItemsAdd);
  }

  function onError (err) {
    noMoreContent = true;
    showLoading(err.message);
    setTimeout(function () {
      hideLoading();
    }, 2000);
  }

  function onItemsAdd () {
    loadImages();
    loadingFreezed = false;

    // 加载的内容无法填满一屏，继续加载新内容
    if (isDataLoadingNeeded()) {
      getData(onDataLoadingStart, onData, onError);
    }
    else {
      hideLoading();
    }
  }

  function onResize (e) {
    var now = new Date().getTime();

    if (now - lastResizeTime >= Math.max(resizeThrottle - 100, 0)) {
      lastResizeTime = now;
    }
    else {
      clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(function () {
      var oldColumnCount,
          newColumnCount;

      oldColumnCount = contentWrapper.children.length;
      newColumnCount = calcColumnCount();

      if (oldColumnCount !== newColumnCount) {
        reflow();
      }
      else if (isDataLoadingNeeded()) {
        getData(onDataLoadingStart, onData, onError);
      }
    }, 100);
  }

  function onScroll (e) {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 有内容 且 不在加载内容的期间 则读取新内容
    if (!noMoreContent && !loadingFreezed) {

      // 向下滚动 并且 贴近内容底端
      if (scrollTop > lastScrollTop && isDataLoadingNeeded()) {
        getData(onDataLoadingStart, onData, onError);
      }

      lastScrollTop = scrollTop;
    }

    // 加载图片
    loadImages();
  }

  function isDataLoadingNeeded () {
    var viewportBottom, shortestColumn;

    shortestColumn = getShortestColumn();
    lowestLoadingPos = getPosition(shortestColumn).top + shortestColumn.offsetHeight;
    viewportBottom = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop);
    
    if (lowestLoadingPos < viewportBottom) {
      return true;
    }

    return false;
  }

  function getData (start, done, fail) {
    var url;

    url = URL + (param.path || '');

    param.data.page += 1;

    start && start.call(null);

    request = jsonp({
      url: url,
      data: param.data,
      cbname: 'callback',
      success: function (res) {
        var err;
        if (res.length) {
          done && done.call(this, res);
        }
        else {
          err = new Error('No More Images');
          fail && fail.call(this, err);
        }
        request = undefined;
      },
      error: function (err) {
        fail && fail.call(this, err);
        request = undefined;
      }
    });
    // setTimeout(function () {request && request.abort();}, 500);
  }

  function calcColumnCount () {
    var pageWidth = document.documentElement.clientWidth,
        columnCount = Math.floor((pageWidth - pageGap * 2) / columnWidth);

    columnCount = Math.min(Math.max(columnCount, minColumnCount), maxColumnCount);

    return columnCount;
  }

  function addColumns () {
    var column, columnCount;

    columns = [];
    columnCount = calcColumnCount();

    // contentWrapper.innerHTML = '';
    // 在 IE10 中使用 innerHTML 清除内容，如果事先保存了子元素的引用，
    // 清除后只有子元素本身还保存着，子元素的子元素却不存在了
    // 所以改用 removeChild()
    while (contentWrapper.children.length) {
      contentWrapper.removeChild(contentWrapper.children[0]);
    }

    for (var i = 0; i < columnCount; i++) {
      column = document.createElement('ul');
      column.className = 'column';
      column.style.width = itemWidth + 'px';
      column.style.margin = '0 ' + columnGap + 'px';

      contentWrapper.appendChild(column);
      contentWrapper.style.width = columnWidth * columnCount + 'px';
      contentWrapper.style.margin = '0 ' + - columnGap + 'px';

      content.style.width = columnWidth * columnCount - columnGap * 2 + 'px';

      columns.push(column);
    }
  }

  function getShortestColumn () {
    var column,
        minHeight = Number.MAX_VALUE;
    
    for (var i = 0, len = columns.length; i < len; i++) {
      if (columns[i].clientHeight < minHeight) {
        column = columns[i];
        minHeight = column.clientHeight;
      }
    }

    return column;
  }

  function reflow () {
    var items;

    items = getByClass('item', contentWrapper);
    items.sorted = false;

    addColumns();
    addItems(items, onItemsAdd);
  }

  function loadImages () {
    var viewportTop = document.body.scrollTop || document.documentElement.scrollTop,
        viewportBottom = document.documentElement.clinetHeight + viewportTop,
        unloadedImage,
        pos;

    if (unloadedImages.length) {
      for (var i = 0; i < unloadedImages.length; i++) {
        unloadedImage = unloadedImages[i];
        if (unloadedImage.top === undefined) {
          pos = getPosition(unloadedImage.image);
          unloadedImage.top = pos && pos.top;
        }
        if (unloadedImage.top > viewportBottom || unloadedImage.top + unloadedImage.height < viewportTop) {
          continue;
        }
        else {
          unloadedImage.image.onload = function (e) {
            addClass(this, 'img-showed');
            this.removeAttribute('data-src');
            this.onload = null;
          }
          unloadedImage.image.setAttribute('src', unloadedImage.image.getAttribute('data-src'));
          unloadedImages.splice(i, 1);
          i--
        }
      }
    }
  }

  function addItems (items, done) {

    var columns = contentWrapper.children,
        count = items.length,
        shortestColumn,
        item;

    if (items.length) {
      // 依据itemid从小到大排序
      if (!items.sorted) {
        items.sort(function (item1, item2) {
          var id1 = parseInt(item1.getAttribute('data-itemid'), 10),
              id2 = parseInt(item2.getAttribute('data-itemid'), 10);
          return id1 - id2;
        })
      }

      // 将items插入到columns中，每次选择最短的column
      item = items.shift();


      shortestColumn = getShortestColumn();
      removeClass(item, 'item-showed');
      shortestColumn.appendChild(item);
      
      (function (item) {
        setTimeout(function () {
          var imgWrapper = getByClass('img-wrapper', item)[0],
              img = imgWrapper.getElementsByTagName('img')[0];
          if (!img.getAttribute('src')) {
            unloadedImages.push({image: img, height: imgWrapper.offsetHeight});
          }
          addClass(item, 'item-showed');
          if (items.length === 0) {
            done && done.call(null);
          }
          else {
            addItems(items, done);
          }
        }, 0);
      })(item)
    }
  }

  function createItems (data) {
    var items = [], item;

    for (var i = 0; i < data.length; i++) {
      item = createItem(data[i]);
      items.push(item);
    }

    items.sorted = true;

    return items;
  }

  function createItem (data) {
    var container = document.createElement('div'),
        tmpl = item_tmpl,
        slots = tmpl.match(/\{\{[a-zA-Z]\w*\}\}/g);

    data.height = minItemContentHeight > 0 ?
      Math.min(Math.round(itemContentWidth / data.width * data.height), minItemContentHeight) :
      Math.round(itemContentWidth / data.width * data.height);
    data.width = itemContentWidth;
    data.itemID = itemID++;

    for (var i = 0; i < slots.length; i++) {
      var name = slots[i].slice(2, -2);
      tmpl = tmpl.replace(slots[i], (data[name] !== undefined ? data[name] : ''));
    }

    container.innerHTML = tmpl;

    return container.children[0];
  }

  function showLoading (msg) {
    loading.children[0].innerHTML = msg;
    addClass(loading, 'loading-showed');
  }

  function hideLoading () {
    removeClass(loading, 'loading-showed');
  }

  function initNote (msg) {
    noteCloseBtn.onclick = function (e) {
      hidePrompt();
    }
  }

  function hidePrompt () {
    if (transitionSupport.support) {
      note.addEventListener(transitionEndEvent, function (e) {
        note.style.display ='none';
        note.removeEventListener(transitionEndEvent, arguments.callee);
      }, false);

      note.style.height = '0';
      note.style.opacity = 0;
      note.style.padding = '0';
      note.style.margin = '0';
      note.style.filter = 'alpha(opacity=0)';
    }
    else {
      note.style.display ='none';
    }
  }

  function isStyleFeatureSupported (feature) {
    var vendors = ['webkit', 'moz', 'ms'],
        len = vendors.length,
        el = document.createElement('div'),
        cappedFeature = feature.charAt(0).toUpperCase() + feature.substring(1);

    while (len--) {
      if ((vendors[len] + cappedFeature) in el.style) {
        return {
          support: true,
          feature: cappedFeature,
          vendorID: vendors[len]
        }
      }
    }

    if (feature in el.style) {
      return {
        support: true,
        feature: feature,
        vendorID: ''
      }
    }

    return {
      support: false,
      feature: feature,
      vendorID: ''
    };
  }
});