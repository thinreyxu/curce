requirejs.config({
  baseUrl: '../../src/'
});

require(['selector'], function (query) {
    var code = query('#code')[0];
    var selectors = '#div1 > ol[start="2"] li:first-child + li ~ :nth-of-type(2n-1),\n.div2 input[type~="text"][maxlength="3"]:not(:first-child):not([placeholder])';
    var elems = query(selectors);

    code.innerHTML = selectors;

    for (var i = 0; i < elems.length; i++) {
      elems[i].style.background = '#99bfee';
    }
});