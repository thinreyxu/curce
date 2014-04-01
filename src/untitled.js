/*
Visual representation of the approach:

--------
   --------
      --------
         --------
            --------
               --------
                  --------
                     --------
                        --------
                           --------
                              --------
                                 --------
                                    --------
                                       --------
                                          --------

==================================================

[=] - real scrollable height (h)
[-] - "pages";  total height of all (n) pages is (th) = (ph) * (n)

The overlap between pages is (cj) and is the distance the scrollbar
will jump when we adjust the scroll position during page switch.

To keep things smooth, we need to minimize both (n) and (cj).
Setting (ph) at 1/100 of (h) is a good start.
*/


var th = 1000000000;            // virtual height               th = 1,000,000,000                      总内容高（）               十亿
var h =  1000000;               // real scrollable height       h = 1,000,000                           滚动区域高（#content）     一百万
var ph = h / 100;               // page height                  ph = 1,000,000 / 100 = 10,000           页高                      一万
var n = Math.ceil(th / ph);     // number of pages              n = 1,000,000,000 / 10,000 = 100,000    页数                      十万
var vp = 400;                   // viewport height
var rh = 50;                    // row height
var cj = (th - h) / (n - 1);    // "jumpiness" coefficient      cj = (1,000,000,000 - 1,000,000) / (100,000 - 1) = 9990.099901    页间重叠区域高度

var page = 0;                   // current page                 当前页码
var offset=0;                   // current page offset          当前页的位移
var prevScrollTop = 0;

var rows = {};                  // cached row nodes

var viewport, content;


$(function() {
    viewport = $("#viewport");
    content = $("#content");
    
    viewport.css("height",vp);
    content.css("height",h);
    
    viewport.scroll(onScroll);
    viewport.trigger("scroll");
});

function onScroll() {
    var scrollTop = viewport.scrollTop();
    
    // prevScrollTop 在 onNearScroll() 和 onJump() 中会的得到更新
    if (Math.abs(scrollTop-prevScrollTop) > vp) {
        // 翻页
        onJump();
    }
    else {
        // 滚动
        onNearScroll();
    }
    
    renderViewport();
    
    logDebugInfo();
}

function onNearScroll() {
    var scrollTop = viewport.scrollTop();
    
    // next page
    if (scrollTop + offset > (page+1)*ph) {
        page++;
        offset = Math.round(page * cj);
        viewport.scrollTop(prevScrollTop = scrollTop - cj);
        removeAllRows();
    }
    // prev page
    else if (scrollTop + offset < page*ph) {
        page--;
        offset = Math.round(page * cj);
        viewport.scrollTop(prevScrollTop = scrollTop + cj);
        removeAllRows();
    }
    else {
        prevScrollTop = scrollTop;
    }
}

function onJump() {
    var scrollTop = viewport.scrollTop();
    page = Math.floor(scrollTop * ((th-vp) / (h-vp)) * (1/ph));
    offset = Math.round(page * cj);
    prevScrollTop = scrollTop;
    
    removeAllRows();
}

function removeAllRows() {
    for (var i in rows) {
        rows[i].remove();
        delete rows[i];
    }
}

function renderViewport() {
    // calculate the viewport + buffer
    var y = viewport.scrollTop() + offset,
        buffer = vp,
        top = Math.floor((y-buffer)/rh),
        bottom = Math.ceil((y+vp+buffer)/rh);
    
    top = Math.max(0,top);
    bottom = Math.min(th/rh,bottom);
    
    // remove rows no longer in the viewport
    for (var i in rows) {
        if (i < top || i > bottom) {
            rows[i].remove();
            delete rows[i];
        }
    }
    
    // add new rows
    for (var i=top; i<=bottom; i++) {
        if (!rows[i])
            rows[i] = renderRow(i);
    }
}

function renderRow(row) {
    return $("<div class='row' />")
        .css({
            top: row*rh - offset,
            height: rh
        })
        .text("row " + (row+1))
        .appendTo(content);
}

function logDebugInfo() {
    var dbg = $("#debug");
    dbg.empty();
    dbg.append("n = " + n + "<br>");
    dbg.append("ph = " + ph + "<br>");
    dbg.append("cj = " + cj + "<br>");
    dbg.append("<hr>");
    dbg.append("page = " + page + "<br>");
    dbg.append("offset = " + offset + "<br>");
    dbg.append("virtual y = " + (prevScrollTop + offset) + "<br>");
    dbg.append("real y = " + prevScrollTop + "<br>");
    dbg.append("rows in the DOM = " + $(".row").length + "<br>");
}
