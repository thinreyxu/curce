/*!
 * Sizzle CSS Selector Engine
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
//@ sourceMappingURL=sizzle.min.map
(function(e,t){function n(e){return gt.test(e+"")}function r(){var e,t=[];return e=function(n,r){return t.push(n+=" ")>A.cacheLength&&delete e[t.shift()],e[n]=r}}function o(e){return e[H]=!0,e}function i(e){var t=I.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t=null}}function u(e,t,n,r){var o,i,u,l,a,c,f,p,h,g;if((t?t.ownerDocument||t:O)!==I&&B(t),t=t||I,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(P&&!r){if(o=mt.exec(e))if(u=o[1]){if(9===l){if(i=t.getElementById(u),!i||!i.parentNode)return n;if(i.id===u)return n.push(i),n}else if(t.ownerDocument&&(i=t.ownerDocument.getElementById(u))&&k(t,i)&&i.id===u)return n.push(i),n}else{if(o[2])return _.apply(n,t.getElementsByTagName(e)),n;if((u=o[3])&&F.getElementsByClassName&&t.getElementsByClassName)return _.apply(n,t.getElementsByClassName(u)),n}if(F.qsa&&!M.test(e)){if(f=!0,p=H,h=t,g=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){for(c=s(e),(f=t.getAttribute("id"))?p=f.replace(Nt,"\\$&"):t.setAttribute("id",p),p="[id='"+p+"'] ",a=c.length;a--;)c[a]=p+d(c[a]);h=ht.test(e)&&t.parentNode||t,g=c.join(",")}if(g)try{return _.apply(n,h.querySelectorAll(g)),n}catch(m){}finally{f||t.removeAttribute("id")}}}return x(e.replace(at,"$1"),t,n,r)}function l(e,t){var n=t&&e,r=n&&(~t.sourceIndex||Q)-(~e.sourceIndex||Q);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function a(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function c(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function f(e){return o(function(t){return t=+t,o(function(n,r){for(var o,i=e([],n.length,t),u=i.length;u--;)n[o=i[u]]&&(n[o]=!(r[o]=n[o]))})})}function s(e,t){var n,r,o,i,l,a,c,f=U[e+" "];if(f)return t?0:f.slice(0);for(l=e,a=[],c=A.preFilter;l;){(!n||(r=ct.exec(l)))&&(r&&(l=l.slice(r[0].length)||l),a.push(o=[])),n=!1,(r=ft.exec(l))&&(n=r.shift(),o.push({value:n,type:r[0].replace(at," ")}),l=l.slice(n.length));for(i in A.filter)!(r=pt[i].exec(l))||c[i]&&!(r=c[i](r))||(n=r.shift(),o.push({value:n,type:i,matches:r}),l=l.slice(n.length));if(!n)break}return t?l.length:l?u.error(e):U(e,a).slice(0)}function d(e){for(var t=0,n=e.length,r="";n>t;t++)r+=e[t].value;return r}function p(e,t,n){var r=t.dir,o=n&&"parentNode"===r,i=j++;return t.first?function(t,n,i){for(;t=t[r];)if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,u){var l,a,c,f=z+" "+i;if(u){for(;t=t[r];)if((1===t.nodeType||o)&&e(t,n,u))return!0}else for(;t=t[r];)if(1===t.nodeType||o)if(c=t[H]||(t[H]={}),(a=c[r])&&a[0]===f){if((l=a[1])===!0||l===E)return l===!0}else if(a=c[r]=[f],a[1]=e(t,n,u)||E,a[1]===!0)return!0}}function h(e){return e.length>1?function(t,n,r){for(var o=e.length;o--;)if(!e[o](t,n,r))return!1;return!0}:e[0]}function g(e,t,n,r,o){for(var i,u=[],l=0,a=e.length,c=null!=t;a>l;l++)(i=e[l])&&(!n||n(i,r,o))&&(u.push(i),c&&t.push(l));return u}function m(e,t,n,r,i,u){return r&&!r[H]&&(r=m(r)),i&&!i[H]&&(i=m(i,u)),o(function(o,u,l,a){var c,f,s,d=[],p=[],h=u.length,m=o||N(t||"*",l.nodeType?[l]:l,[]),y=!e||!o&&t?m:g(m,d,e,l,a),v=n?i||(o?e:h||r)?[]:u:y;if(n&&n(y,v,l,a),r)for(c=g(v,p),r(c,[],l,a),f=c.length;f--;)(s=c[f])&&(v[p[f]]=!(y[p[f]]=s));if(o){if(i||e){if(i){for(c=[],f=v.length;f--;)(s=v[f])&&c.push(y[f]=s);i(null,v=[],c,a)}for(f=v.length;f--;)(s=v[f])&&(c=i?tt.call(o,s):d[f])>-1&&(o[c]=!(u[c]=s))}}else v=g(v===u?v.splice(h,v.length):v),i?i(null,u,v,a):_.apply(u,v)})}function y(e){for(var t,n,r,o=e.length,i=A.relative[e[0].type],u=i||A.relative[" "],l=i?1:0,a=p(function(e){return e===t},u,!0),c=p(function(e){return tt.call(t,e)>-1},u,!0),f=[function(e,n,r){return!i&&(r||n!==S)||((t=n).nodeType?a(e,n,r):c(e,n,r))}];o>l;l++)if(n=A.relative[e[l].type])f=[p(h(f),n)];else{if(n=A.filter[e[l].type].apply(null,e[l].matches),n[H]){for(r=++l;o>r&&!A.relative[e[r].type];r++);return m(l>1&&h(f),l>1&&d(e.slice(0,l-1)).replace(at,"$1"),n,r>l&&y(e.slice(l,r)),o>r&&y(e=e.slice(r)),o>r&&d(e))}f.push(n)}return h(f)}function v(e,t){var n=0,r=t.length>0,i=e.length>0,l=function(o,l,a,c,f){var s,d,p,h=[],m=0,y="0",v=o&&[],N=null!=f,x=S,b=o||i&&A.find.TAG("*",f&&l.parentNode||l),C=z+=null==x?1:Math.random()||.1;for(N&&(S=l!==I&&l,E=n);null!=(s=b[y]);y++){if(i&&s){for(d=0;p=e[d++];)if(p(s,l,a)){c.push(s);break}N&&(z=C,E=++n)}r&&((s=!p&&s)&&m--,o&&v.push(s))}if(m+=y,r&&y!==m){for(d=0;p=t[d++];)p(v,h,l,a);if(o){if(m>0)for(;y--;)v[y]||h[y]||(h[y]=Y.call(c));h=g(h)}_.apply(c,h),N&&!o&&h.length>0&&m+t.length>1&&u.uniqueSort(c)}return N&&(z=C,S=x),v};return r?o(l):l}function N(e,t,n){for(var r=0,o=t.length;o>r;r++)u(e,t[r],n);return n}function x(e,t,n,r){var o,i,u,l,a,c=s(e);if(!r&&1===c.length){if(i=c[0]=c[0].slice(0),i.length>2&&"ID"===(u=i[0]).type&&9===t.nodeType&&P&&A.relative[i[1].type]){if(t=(A.find.ID(u.matches[0].replace(bt,Ct),t)||[])[0],!t)return n;e=e.slice(i.shift().value.length)}for(o=pt.needsContext.test(e)?0:i.length;o--&&(u=i[o],!A.relative[l=u.type]);)if((a=A.find[l])&&(r=a(u.matches[0].replace(bt,Ct),ht.test(i[0].type)&&t.parentNode||t))){if(i.splice(o,1),e=r.length&&d(i),!e)return _.apply(n,r),n;break}}return D(e,c)(r,t,!P,n,ht.test(e)),n}function b(){}var C,E,A,T,w,D,S,L,B,I,R,P,M,$,q,k,H="sizzle"+-new Date,O=e.document,F={},z=0,j=0,G=r(),U=r(),V=r(),X=!1,J=function(){return 0},K=typeof t,Q=1<<31,W=[],Y=W.pop,Z=W.push,_=W.push,et=W.slice,tt=W.indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(this[t]===e)return t;return-1},nt="[\\x20\\t\\r\\n\\f]",rt="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ot=rt.replace("w","w#"),it="([*^$|!~]?=)",ut="\\["+nt+"*("+rt+")"+nt+"*(?:"+it+nt+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+ot+")|)|)"+nt+"*\\]",lt=":("+rt+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+ut.replace(3,8)+")*)|.*)\\)|)",at=RegExp("^"+nt+"+|((?:^|[^\\\\])(?:\\\\.)*)"+nt+"+$","g"),ct=RegExp("^"+nt+"*,"+nt+"*"),ft=RegExp("^"+nt+"*([\\x20\\t\\r\\n\\f>+~])"+nt+"*"),st=RegExp(lt),dt=RegExp("^"+ot+"$"),pt={ID:RegExp("^#("+rt+")"),CLASS:RegExp("^\\.("+rt+")"),NAME:RegExp("^\\[name=['\"]?("+rt+")['\"]?\\]"),TAG:RegExp("^("+rt.replace("w","w*")+")"),ATTR:RegExp("^"+ut),PSEUDO:RegExp("^"+lt),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+nt+"*(even|odd|(([+-]|)(\\d*)n|)"+nt+"*(?:([+-]|)"+nt+"*(\\d+)|))"+nt+"*\\)|)","i"),needsContext:RegExp("^"+nt+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+nt+"*((?:-\\d)?\\d*)"+nt+"*\\)|)(?=[^-]|$)","i")},ht=/[\x20\t\r\n\f]*[+~]/,gt=/^[^{]+\{\s*\[native code/,mt=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,yt=/^(?:input|select|textarea|button)$/i,vt=/^h\d$/i,Nt=/'|\\/g,xt=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,bt=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,Ct=function(e,t){var n="0x"+t-65536;return n!==n?t:0>n?String.fromCharCode(n+65536):String.fromCharCode(55296|n>>10,56320|1023&n)};try{_.apply(W=et.call(O.childNodes),O.childNodes),W[O.childNodes.length].nodeType}catch(Et){_={apply:W.length?function(e,t){Z.apply(e,et.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}w=u.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},B=u.setDocument=function(e){var r=e?e.ownerDocument||e:O;return r!==I&&9===r.nodeType&&r.documentElement?(I=r,R=r.documentElement,P=!w(r),F.getElementsByTagName=i(function(e){return e.appendChild(r.createComment("")),!e.getElementsByTagName("*").length}),F.attributes=i(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return"boolean"!==t&&"string"!==t}),F.getElementsByClassName=i(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",e.getElementsByClassName&&e.getElementsByClassName("e").length?(e.lastChild.className="e",2===e.getElementsByClassName("e").length):!1}),F.getByName=i(function(e){e.id=H+0,e.appendChild(I.createElement("a")).setAttribute("name",H),e.appendChild(I.createElement("i")).setAttribute("name",H),R.appendChild(e);var t=r.getElementsByName&&r.getElementsByName(H).length===2+r.getElementsByName(H+0).length;return R.removeChild(e),t}),F.sortDetached=i(function(e){return e.compareDocumentPosition&&1&e.compareDocumentPosition(I.createElement("div"))}),A.attrHandle=i(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==K&&"#"===e.firstChild.getAttribute("href")})?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},F.getByName?(A.find.ID=function(e,t){if(typeof t.getElementById!==K&&P){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},A.filter.ID=function(e){var t=e.replace(bt,Ct);return function(e){return e.getAttribute("id")===t}}):(A.find.ID=function(e,n){if(typeof n.getElementById!==K&&P){var r=n.getElementById(e);return r?r.id===e||typeof r.getAttributeNode!==K&&r.getAttributeNode("id").value===e?[r]:t:[]}},A.filter.ID=function(e){var t=e.replace(bt,Ct);return function(e){var n=typeof e.getAttributeNode!==K&&e.getAttributeNode("id");return n&&n.value===t}}),A.find.TAG=F.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==K?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],o=0,i=t.getElementsByTagName(e);if("*"===e){for(;n=i[o++];)1===n.nodeType&&r.push(n);return r}return i},A.find.NAME=F.getByName&&function(e,n){return typeof n.getElementsByName!==K?n.getElementsByName(name):t},A.find.CLASS=F.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==K&&P?n.getElementsByClassName(e):t},$=[],M=[":focus"],(F.qsa=n(r.querySelectorAll))&&(i(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||M.push("\\["+nt+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||M.push(":checked")}),i(function(e){var t=I.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("i",""),e.querySelectorAll("[i^='']").length&&M.push("[*^$]="+nt+"*(?:\"\"|'')"),e.querySelectorAll(":enabled").length||M.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),M.push(",.*:")})),(F.matchesSelector=n(q=R.webkitMatchesSelector||R.mozMatchesSelector||R.oMatchesSelector||R.msMatchesSelector))&&i(function(e){F.disconnectedMatch=q.call(e,"div"),q.call(e,"[s!='']:x"),$.push("!=",lt)}),M=RegExp(M.join("|")),$=$.length&&RegExp($.join("|")),k=n(R.contains)||R.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},J=R.compareDocumentPosition?function(e,t){if(e===t)return X=!0,0;var n=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return n?1&n||!F.sortDetached&&t.compareDocumentPosition(e)===n?e===r||k(O,e)?-1:t===r||k(O,t)?1:L?tt.call(L,e)-tt.call(L,t):0:4&n?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var n,o=0,i=e.parentNode,u=t.parentNode,a=[e],c=[t];if(e===t)return X=!0,0;if(!i||!u)return e===r?-1:t===r?1:i?-1:u?1:L?tt.call(L,e)-tt.call(L,t):0;if(i===u)return l(e,t);for(n=e;n=n.parentNode;)a.unshift(n);for(n=t;n=n.parentNode;)c.unshift(n);for(;a[o]===c[o];)o++;return o?l(a[o],c[o]):a[o]===O?-1:c[o]===O?1:0},I):I},u.matches=function(e,t){return u(e,null,null,t)},u.matchesSelector=function(e,t){if((e.ownerDocument||e)!==I&&B(e),t=t.replace(xt,"='$1']"),F.matchesSelector&&P&&(!$||!$.test(t))&&!M.test(t))try{var n=q.call(e,t);if(n||F.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(r){}return u(t,I,null,[e]).length>0},u.contains=function(e,t){return(e.ownerDocument||e)!==I&&B(e),k(e,t)},u.attr=function(e,t){var n;return(e.ownerDocument||e)!==I&&B(e),P&&(t=t.toLowerCase()),(n=A.attrHandle[t])?n(e):!P||F.attributes?e.getAttribute(t):((n=e.getAttributeNode(t))||e.getAttribute(t))&&e[t]===!0?t:n&&n.specified?n.value:null},u.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},u.uniqueSort=function(e){var t,n=[],r=0,o=0;if(X=!F.detectDuplicates,L=!F.sortStable&&e.slice(0),e.sort(J),X){for(;t=e[o++];)t===e[o]&&(r=n.push(o));for(;r--;)e.splice(n[r],1)}return e},T=u.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=T(e)}else if(3===o||4===o)return e.nodeValue}else for(;t=e[r];r++)n+=T(t);return n},A=u.selectors={cacheLength:50,createPseudo:o,match:pt,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(bt,Ct),e[3]=(e[4]||e[5]||"").replace(bt,Ct),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||u.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&u.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return pt.CHILD.test(e[0])?null:(e[4]?e[2]=e[4]:n&&st.test(n)&&(t=s(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){return"*"===e?function(){return!0}:(e=e.replace(bt,Ct).toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=G[e+" "];return t||(t=RegExp("(^|"+nt+")"+e+"("+nt+"|$)"))&&G(e,function(e){return t.test(e.className||typeof e.getAttribute!==K&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var o=u.attr(r,e);return null==o?"!="===t:t?(o+="","="===t?o===n:"!="===t?o!==n:"^="===t?n&&0===o.indexOf(n):"*="===t?n&&o.indexOf(n)>-1:"$="===t?n&&o.slice(-n.length)===n:"~="===t?(" "+o+" ").indexOf(n)>-1:"|="===t?o===n||o.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,o){var i="nth"!==e.slice(0,3),u="last"!==e.slice(-4),l="of-type"===t;return 1===r&&0===o?function(e){return!!e.parentNode}:function(t,n,a){var c,f,s,d,p,h,g=i!==u?"nextSibling":"previousSibling",m=t.parentNode,y=l&&t.nodeName.toLowerCase(),v=!a&&!l;if(m){if(i){for(;g;){for(s=t;s=s[g];)if(l?s.nodeName.toLowerCase()===y:1===s.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[u?m.firstChild:m.lastChild],u&&v){for(f=m[H]||(m[H]={}),c=f[e]||[],p=c[0]===z&&c[1],d=c[0]===z&&c[2],s=p&&m.childNodes[p];s=++p&&s&&s[g]||(d=p=0)||h.pop();)if(1===s.nodeType&&++d&&s===t){f[e]=[z,p,d];break}}else if(v&&(c=(t[H]||(t[H]={}))[e])&&c[0]===z)d=c[1];else for(;(s=++p&&s&&s[g]||(d=p=0)||h.pop())&&((l?s.nodeName.toLowerCase()!==y:1!==s.nodeType)||!++d||(v&&((s[H]||(s[H]={}))[e]=[z,d]),s!==t)););return d-=o,d===r||0===d%r&&d/r>=0}}},PSEUDO:function(e,t){var n,r=A.pseudos[e]||A.setFilters[e.toLowerCase()]||u.error("unsupported pseudo: "+e);return r[H]?r(t):r.length>1?(n=[e,e,"",t],A.setFilters.hasOwnProperty(e.toLowerCase())?o(function(e,n){for(var o,i=r(e,t),u=i.length;u--;)o=tt.call(e,i[u]),e[o]=!(n[o]=i[u])}):function(e){return r(e,0,n)}):r}},pseudos:{not:o(function(e){var t=[],n=[],r=D(e.replace(at,"$1"));return r[H]?o(function(e,t,n,o){for(var i,u=r(e,null,o,[]),l=e.length;l--;)(i=u[l])&&(e[l]=!(t[l]=i))}):function(e,o,i){return t[0]=e,r(t,null,i,n),!n.pop()}}),has:o(function(e){return function(t){return u(e,t).length>0}}),contains:o(function(e){return function(t){return(t.textContent||t.innerText||T(t)).indexOf(e)>-1}}),lang:o(function(e){return dt.test(e||"")||u.error("unsupported lang: "+e),e=e.replace(bt,Ct).toLowerCase(),function(t){var n;do if(n=P?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===R},focus:function(e){return e===I.activeElement&&(!I.hasFocus||I.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!A.pseudos.empty(e)},header:function(e){return vt.test(e.nodeName)},input:function(e){return yt.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:f(function(){return[0]}),last:f(function(e,t){return[t-1]}),eq:f(function(e,t,n){return[0>n?n+t:n]}),even:f(function(e,t){for(var n=0;t>n;n+=2)e.push(n);return e}),odd:f(function(e,t){for(var n=1;t>n;n+=2)e.push(n);return e}),lt:f(function(e,t,n){for(var r=0>n?n+t:n;--r>=0;)e.push(r);return e}),gt:f(function(e,t,n){for(var r=0>n?n+t:n;t>++r;)e.push(r);return e})}};for(C in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})A.pseudos[C]=a(C);for(C in{submit:!0,reset:!0})A.pseudos[C]=c(C);D=u.compile=function(e,t){var n,r=[],o=[],i=V[e+" "];if(!i){for(t||(t=s(e)),n=t.length;n--;)i=y(t[n]),i[H]?r.push(i):o.push(i);i=V(e,v(o,r))}return i},A.pseudos.nth=A.pseudos.eq,b.prototype=A.filters=A.pseudos,A.setFilters=new b,F.sortStable=H.split("").sort(J).join("")===H,B(),[0,0].sort(J),F.detectDuplicates=X,"function"==typeof define&&define.amd?define(function(){return u}):e.Sizzle=u})(window);


/*!
 * Curce.js
 * A simple utility functions collection
 * Including Sizzle as selector engine
 */

(function (Sizzle, window) {

  // Todo: What's the use of this constructor
  var Curce = function (obj) {

    if (obj instanceof Curce) { return obj; }
    if (this instanceof Curce === false) { return new Curce(obj); }
  };

  /*!
   *
   * Utilities
   * ---------
   *
   */

  var Util = Curce.Util = {};

  // Type detection utilities
  // ------------------------
  // 

  // type()
  var type = Util.type = function (obj) {

    // var type = typeof obj;

    var type = 'object';
    if (type === 'object') {
      type = Object.prototype.toString.call(obj);
      type = /(?=\b)[a-zA-Z]+(?=\])/.exec(type)[0];
    }

    return type;
  };

  // is()
  var is = Util.is = function (obj, classname) {

    var string = Object.prototype.toString.call(obj);

    if (string === '[object ' + classname + ']') {
      return true;
    }
    else {
      return false;
    }
  };

  // isFunction()
  var isFunction = Util.isFunction = function (fn) {

    return is(fn, 'Function');
  };

  // isArray()
  var isArray = Util.isArray = function (arr) {

    return is(arr, 'Array');
  };

  // isObject()
  var isObject = Util.isObject = function (arr) {

    return is(arr, 'Object');
  };

  // isString()
  var isString = Util.isString = function (str) {

    return is(str, 'String');
  };

  // isNumber()
  var isNumber = Util.isNumber = function (num) {

    return is(num, 'Number');
  };

  // isArguments()
  // var isArguments = Util.isArguments = function (args) {

  //   return is(args, 'Arguments');
  // };

  // isUndefined()
  var isUndefined = Util.isUndefined = function (obj) {

    return is(obj, 'Undefined');
  }

  // isInstanceOf
  var isInstanceOf = Util.isInstanceOf = function (obj, constructor) {

    return obj instanceof constructor;
  }

  var TEXT_NODE = 3,
      ELEMENT_NODE = 1;

  // isNode();
  var isNode = Util.isNode = function (node) {
    // 不能用is()，因为他不构造函数不是Node
    if (typeof Node !== 'undefined' && node instanceof Node && isNumber(node.nodeType)) {
      // for non-ie
      return true;
    }
    else if (typeof ActiveXObject !== 'undefined' && node instanceof ActiveXObject && isNumber(node.nodeType)) {
      // for ie
      return true;
    }
    return false;
  }

  // isElement()
  var isElement = Util.isElement = function (el) {

    return (isNode(el) && el.nodeType === ELEMENT_NODE);
  };

  // isNodeList()
  var isNodeList = Util.isNodeList = function (nodes) {

    return is(nodes, 'NodeList');
  };


  // String utilities
  // ----------------
  // 

  // trim()
  // 去除字符串开头结尾的空白符
  var trim = Util.trim = function (str) {

    if (!isString(str)) { return str; }

    if (str.trim) {
      return str.trim();
    }
    else {
      return str.replace(/^\s+|\s+$/g, '');
    }
  };

  // unifyWhiteSpace()
  // 合并字符串中的多个连续空白符
  var unifyWhiteSpace = Util.unifyWhiteSpace = function (string, replacement) {

    replacement = replacement || ' ';

    return string.replace(/\s+/g, replacement);
  }

  // refine()
  // trim and unifyWhiteSpace
  var refine = Util.refine = function (string) {
    return trim(unifyWhiteSpace(string));
  }


  // Fucntion utilities
  // ------------------
  // 

  // getArgs()
  var getArgs = Util.getArgs = function (args, start, end) {

    if (isNumber(args.length)) {
      start = start || 0;
      end = end || args.length;
      args = Array.prototype.slice.call(args, start, end);
    }
    return args;
  }

  // bind()
  var bind = Util.bind = function (fn, context) {

    var args = getArgs(arguments, 2);

    return function () {
      fn.apply(context, args.concat(getArgs(arguments)));
    };
  };

  // Collection utilities
  // --------------------
  // 

  // each()
  var each = Util.each = function (collection, fn, context) {

    if (!collection || !isFunction(fn)) { return; }

    context = context || collection;

    if (typeof collection.forEach === 'Function') {
      collection.forEach(fn, context);
    }
    else if (typeof collection.length === 'number') {
      for (var i = 0, len = collection.length; i < len; i++) {
        fn.call(context, collection[i], i, collection);
      }
    }
    else {
      for (var item in collection) {
        fn.call(context, collection[item], item, collection);
      }
    }
  };

  // map()
  var map = Util.map = function (collection, fn, context) {

    if (!collection || !isFunction(fn)) { return; }

    context = context || collection;

    var result = [];

    if (isFunction(collection.map)) {
      console.log(1);
      return collection.map(fn, context);
    }
    else if (!isFunction(collection) && typeof collection.length === 'number') {
      console.log(2);
      for (var i = 0, len = collection.length; i < len; i++) {
        result.push(fn.call(context, collection[i], i, collection));
      }
    }
    else {
      console.log(3);
      for (var item in collection) {
        result.push(fn.call(context, collection[item], item, collection));
      }
    }

      console.log(4);
    return result;
  };

  // toArray()
  var toArray = Util.toArray = function (list) {

    if (!list || typeof list.length !== 'number') { return; }

    var arr = [];

    try {
      arr = Array.prototype.slice.call(list);
    }
    catch (ex) {
      for (var i = 0, len = list.length; i < len; i++) {
        if (isElement(list[i])) {
          arr.push(list[i]);
        }
      }
    }

    return arr;
  };

  var values = Util.values = function (object) {

    if (!object) { return; }

    return map(object, function (value, key, object) {
      return value;
    });
  }


  // OOP utilities
  // -------------
  // 

  // mixin()
  // TODO: What's the use of this;
  var mixin = Util.mixin = function (obj) {

    var others = getArgs(arguments, 1),
        len = others.length;

    if (len !== 0) {
      for (var i = 0; i < len; i++) {
        each(others[i], function (value, key, other) {
          obj[key] = value;
        });
      }
    }
    // each(other, function (fn, name) {

    //   if (isFunction(fn)) {
    //     obj[name] = function () {
    //       var args = [toArray[this]];

    //       args.push(arguments);

    //       return fn.apply(other, args);
    //     };
    //   }
    // });
    return obj;
  };


  /*!
   *
   * DOM Utilities
   * -------------
   *
   */
  var DOM = Curce.DOM = {};

  var querySelectorAll = DOM.querySelectorAll = Sizzle;
  var matchesSelector = DOM.matchesSelector = Sizzle.matchesSelector;
  var matches = DOM.matches = Sizzle.matches;


  // prev()
  var prev = DOM.prev = function (el) {

    if (!isElement(el)) { return; }

    var prev = null;

    if (el.previousElementSibling !== undefined) {
      prev = el.previousElementSibling;
    }
    else {
      prev = el.previousSibling;
      while (prev !== null && prev.nodeType !== Node.ELEMENT_NODE) {
        prev = prev.previousSibling;
      }
    }

    return prev;
  };

  // next()
  var next = DOM.next = function (el) {

    if (!isElement(el)) { return; }

    var next = null;

    if (el.nextElementSibling !== undefined) {
      next = el.nextElementSibling;
    }
    else {
      next = el.nextSibling;
      while (next !== null && isElement(next)) {
        next = next.nextSibling;
      }
    }

    return next;
  };

  // getIndex()
  var getIndex = DOM.getIndex = function (el) {

    if (!isElement(el)) { return; }

    var index = 0,
        prev = this.prev(el);

    while (prev !== null) {
      index++;
      prev = DOM.prev(prev);
    }

    return index;
  };

  // firstChild()
  var firstChild = DOM.firstChild = function (parent) {

    if (!isElement(parent)) { return; }

    if (parent.children.length === 0) { return; }

    var first = null;
    if (parent.firstElementChild !== undefined) {
      first = parent.firstElementChild;
    }
    else {
      first = parent.children[0];
    }

    return first;
  };

  // lastChild()
  var lastChild = DOM.lastChild = function (parent) {

    if (!isElement(parent)) { return; }

    var len = parent.children.length;
    if (len === 0) { return; }

    var last = null;
    if (parent.lastElementChild !== undefined) {
      last = parent.lastElementChild;
    }
    else {
      last = parent.children[len-1];
    }

    return last;
  };

  // parent()
  var parent = DOM.parent = function (el) {

    if (!isElement(el)) { return; }

    return el.parentNode;
  };

  // parents()
  var parents = DOM.parents = function (el, selector) {

    if (!isElement(el)) { return; }

    var parent = el.parentNode;

    while (parent !== null && !matchesSelector(parent, selector)) {
      parent = parent.parentNode;
    }

    return parent;
  };

  // closest()
  var closest = DOM.closest = function (el, selector) {

    if (!isElement(el)) { return; }

    var item = el;

    while (item !== null && !matchesSelector(item, selector)) {
      item = item.parentNode;
    }

    return item;
  };

  // contains()
  var contains = DOM.contains = function (ancestor, descendant, equal) {

    if (!isElement(ancestor) || !isElement(descendant)) { return; }

    if (equal && ancestor == descendant) { return true; }

    if (ancestor.contains) {
      return ancestor.contains(descendant);
    }
    else {
      var parent = descendant.parentNode;

      while (parent !== null && parent !== ancestor) {
        parent = parent.parentNode;
      }

      return parent ? true: false;
    }
  };

  // first()
  var first = DOM.first = function (nodeList) {

    if (!this.isNodeList(nodeList)) { return; }

    if (nodeList.length === 0) {
      return null;
    }
    else {
      return nodeList[0];
    }
  };

  // last()
  var last = DOM.last = function (nodeList) {

    if (!this.isNodeList(nodeList)) { return; }

    var len = nodeList.length;
    
    if (len === 0) {
      return null;
    }
    else {
      return nodeList[len-1];
    }
  };

  // createElement()
  var createElement = DOM.createElement = function (tagName, attrs, children) {

    var el;
    
    if (isString(tagName)) {
      el = document.createElement(tagName);
      
      if (attrs) {
        each(attrs, function (value, attr) {
          el.setAttribute(attr, value);
        });
      }

      if (children) {
        el.appendChild(children);
      }
    }
    return el;
  }

  // createText()
  var createText = DOM.createText = function (text) {

    var el = document.createTextNode(text);
    return el;
  }

  // clone()
  var clone = DOM.clone = function (el, deep) {
    
    deep = deep || false;

    if (el.cloneNode) {
      return el.cloneNode(deep);
    }
  }

  // remove()
  var remove = DOM.remove = function (el) {

    if (!isElement(el)) { return; }

    if (el.data) {
      delete el.data;
    }

    if (el.remove) {
      return el.remove();
    }
    else {
      el.parentNode.removeChild(el);
      return el;
    }
  };

  // append()
  var append = DOM.append = function (parent, child) {

    if (!isElement(parent) || !isElement(child)) { return; }

    parent.appendChild(child);
  };

  // prepend()
  var prepend = DOM.prepend = function (parent, child) {

    if (!isElement(parent) || !isElement(child)) { return; }

    if (parent.children.length === 0) {
      parent.appendChild(child);
    }
    else {
      parent.insertBefore(child, parent.children[0]);
    }
  };

  // insertBefore()
  var insertBefore = DOM.insertBefore = function (el, ref) {

    if (!isElement(el) || !isElement(ref)) { return; }

    ref.parentNode.insertBefore(el, ref);
  };

  // insertAfter()
  var insertAfter = DOM.insertAfter = function (el, ref) {

    if (!isElement(el) || !isElement(ref)) { return; }

    ref.parentNode.insertBefore(el, next(ref));
  };

  // getHTML()
  var getHTML = DOM.getHTML = function (el) {

    if (el.innerHTML) {
      return el.innerHTML;
    }
  }

  // setHTML()
  var setHTML = DOM.setHTML = function (el, content) {

    if (!isUndefined(el.innerHTML)) {
      el.innerHTML = content;
      return el;
    }
  }

  // appendHTML()
  var appendHTML = DOM.appendHTML = function (el, content) {

    if (!isUndefined(el.innerHTML)) {
      return (el.innerHTML += content);
    }
  }

  // prependHTML()
  var appendHTML = DOM.appendHTML = function (el, content) {

    if (!isUndefined(el.innerHTML)) {
      return (el.innerHTML = content + el.innerHTML);
    }
  }

  // Class utilities
  // ---------------
  // 

  // addClass()
  // 为添加元素class名
  // @el: ElementNode, 要添加classNames的元素
  // @classNames: string, 以空格隔开的class名
  var addClass = DOM.addClass =  function (el, classNames) {

    if (!_isClassNames(classNames)) {

      return;
    }

    var className, classNamesList;

    // 合并多个空格
    classNames = refine(classNames);
    classNamesList = classNames.split(' ');
    className = refine(el.className);

    for (var i = 0, len = classNamesList.length; i < len; i++) {

      if (!hasClass(el, classNamesList[i])) {

        if (className === '') {

          el.className = classNamesList[i];

        } else {

          className += ' ' + classNamesList[i];

        }
      }
    }
    el.className = className;
  };

  // removeClass()
  // 移除元素的class名
  // @el: ElementNode, 要移除classNames的元素
  // @classNames: String, 以空格隔开的class名
  var removeClass = DOM.removeClass = function (el, classNames) {
    
    if (!_isClassNames(classNames)) {
      
      return;
    }
    
    var className, reClassName;

    classNames = refine(classNames);
    className = refine(el.className);

    reClassName = _createClassNameRE(classNames);
    el.className = refine(className.replace(reClassName, ''));
  };

  // hasClass()
  // 判断元素是否有指定class名
  // return: Boolean
  var hasClass = DOM.hasClass = function (el, className) {

    if (!_isClassName(className)) {
      
      return;
    }

    var reClassName = _createClassNameRE(className);

    if (reClassName.test(el.className)) {

      return true;
    }
    else {

      return false;
    }
  };

  // getClassList()
  // 获取元素的class名数组
  // @el: ElementNode, 要获取class明数组的元素
  // return: Array
  var getClassList = DOM.getClassList = function (el) {

    var className = refine(el.className);

    if (className === '') {

      return [];
    }
    else {

      return className.split(' ');
    }
  };
  
  // getElementsByClassName()
  // 通过class名获取匹配元素
  // @className: String, class名
  // @context: ElementNode, 默认值为"*", 开始获取元素的根节点
  // @tagName: String, 获取的元素的标签名，用于就浏览器加速
  // return: Array
  var getElementsByClassName = DOM.getElementsByClassName = function (className, context, tagName) {

    if (!_isClassName(className)) {

      return;
    }

    var elementsList = [], elements;

    className = refine(className);
    context = context || document;
    tagName = tagName || '*';
    
    if (context.getElementsByClassName) {

      elementsList = context.getElementsByClassName(className);
    }
    else {

      elements = context.getElementsByTagName(tagName);

      for (var i = 0, len = elements.length; i < len; i++) {
        
        if (hasClass(elements[i], className)) {

          elementsList.push(elements[i]);
        }
      }
    }

    return elementsList;
  };

  // _isClassName()
  function _isClassName (string) {

    var reClassName = /^\s*[a-zA-Z][\w-]*\s*$/;

    return reClassName.test(string);
  }

  // _isClassNames()
  function _isClassNames (string) {

    var reClassName = /^(?:(?:\b[a-zA-Z][\w-]*\b)|\s)+$/;

    return reClassName.test(string);
  }

  // _createClassNameRE()
  function _createClassNameRE (classNames) {
    return new RegExp('\\b(' + Array.prototype.join.call(refine(classNames).split(' '), '|') + ')\\b', 'g');
  }


  // Style utilities
  // ---------------
  // 

  var _styleHelpers = {};

  // getStyle
  var getStyle = DOM.getStyle = function (el, attr) {

    var value;
    
    if (window.getComputedStyle) {
      value = (window.getComputedStyle(el, false))[attr];
    }
    else {
      value = el.currentStyle[attr];
    }

    return value;
  };

  // setStyle
  var setStyle = DOM.setStyle = function (el, attr, value) {

    if (isObject(attr)) {
      for (var item in attr) {
        setStyle(el, item, attr[item]);
      }
    }
    else if (isString(attr) && (isNumber(value) || isString(value))) {
      if (attr in _styleHelpers) {
        _styleHelpers[attr](el, attr, value);
      }
      else {
        el.style[attr] = value;
      }
    }
  };

  // opacity helpers
  _styleHelpers['opacity'] = function (obj, attr, value) {
    value = parseFloat(value);
    obj.style.opacity = value;
    obj.style.filter = 'alpha(opacity=' + parseInt(value * 100) + ')';
  };

  // Attributes utilities
  // --------------------
  // 

  // setAttr()
  var setAttr = DOM.addAttr = function (el, attr, value) {
    
    if (!isElement(el)) { return; }

    if (isObject(attr)) {
      for (var item in attr) {
        el.setAttribute(item, attr[item]);
      }
    }
    else if (isString(attr)) {
      if (attr in el) {
        el[attr] = value;
      }
      else {
        el.setAttribute(attr, value);
      }
    }
  }

  // getAttr()
  var getAttr = DOM.getAttr = function (el, attr) {

    if (!isElement(el)) { return; }

    if (attr) {
      return el.getAttribute(attr);
    }
    else {
      return el.attributes;
    }
  }

  // removeAttr()
  var removeAttr = DOM.removeAttr = function (el, attr) {

    if (!isElement(el)) { return; }

    if (el.hasAttribute(attr)) {
      el.removeAttribute(attr);
    }
  }

  // hasAttr()
  var hasAttr = DOM.hasAttr = function (el, attr) {

    if (!isElement(el)) { return; }

    return el.hasAttribute(attr);
  } 

  // ready()
  var ready = DOM.ready = (function () {
    var funcs = [];         // The functions to run when we get an event
    var isReady = false;    // Switches to true when the handler is triggered

    // The event handler invoked when the document becomes ready
    function handler (e) {
      // If we've ready run once, just return
      if (isReady) return;

      // If this was a readystatechange event where the state changed to
      // something other than "complete", then we're not ready yet
      if (e.type === 'readystatechange' && document.readyState !== 'complete') {
        return;
      }

      // Run all registered functions
      // Note that we look up funcs.length each time, in case calling
      // one of these functions causes mor functions to be registered.
      for (var i = 0; i < funcs.length; i++) {
        funcs[i].apply(document, [Curce]);
      }

      // Now set the ready flag to true and forget the functions
      isReady = true;
      funcs = null;
    }

    // Refister the handler for any event we might receive
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', handler, false);
      document.addEventListener('readystatechange', handler, false);
      window.addEventListener('load', handler, false);
    }
    else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', handler);
      window.attachEvent('onload', handler);
    }

    // Return the ready function
    return function onready (fn) {
      if (isReady) {
        fn.apply(document, [Curce]);
      }
      else {
        funcs.push(fn);
      }
    };
  }());


  /*!
   *
   * Event Utilities
   * ---------------
   *
   */

  var Event = Curce.Event = {};

  // delegate_handlers
  var _handlers = {};

  // on()
  var on = Event.on = function (el, eventType, selector, handler) {

    var wrappedHandler;

    if (typeof selector !== 'string') {
      handler = selector;
      selector = '';
    }

    if (selector !== '') {
      wrappedHandler = function (e) {
        // todo: FIXME
        var currentTarget = closest(e.target, selector),
            ret;
        if (contains(el, currentTarget, true)) {
          ret = handler.call(currentTarget, _wrapEvent(e, currentTarget, {delegateTarget: el}));
          if (ret === false) {
            if (e.preventDefault) {
              e.preventDefault();
            }
            return false;
          }
        }
      };
    }
    else {
      wrappedHandler = function (e) {

        var ret = handler.call(el, _wrapEvent(e, el));

        if (ret === false) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          return false;
        }
      };
    }

    _handlers[el + ':' + eventType + ':' + handler] = wrappedHandler;
    _addHandler(el, eventType, wrappedHandler);
  };

  // off()
  var off = Event.off = function (el, eventType, handler) {

    var wrappedHandler = _handlers[el + ':' + eventType + ':' + handler];

    if (wrappedHandler) {
      _removeHandler(el, eventType, wrappedHandler);
      delete _handlers[el + ':' + eventType + ':' + handler];
    }
  };

  // _addHandler()
  function _addHandler(el, eventType, handler) {

    if (el.addEventListener) {
      el.addEventListener(eventType, handler, false);
    }
    else if (el.attachEvent) {
      el.attachEvent('on' + eventType, handler);
    }
    else {
      el['on' + eventType] = handler;
    }
  }

  // _removeHandler()
  function _removeHandler(el, eventType, handler) {

    if (el.removeEventListener) {
      el.removeEventListener(eventType, handler, false);
    }
    else if (window.detachEvent) {
      el.detachEvent('on' + eventType, handler);
    }
    else {
      el['on' + eventType] = null;
    }
  }

  // _wrapEvent()
  function _wrapEvent (e, el, props) {

    e = e || window.event;

    var wrappedEvent = {
      _event: e,
      type: e.type,
      target: e.target || e.srcElement,
      currentTarget: el,
      relatedTarget: e.relatedTarget || e.fromElement ? e.fromElement : e.toElement,
      eventPhase: e.eventPhase || (e.srcElement === el)?2:3,

      // Mouse coordinates
      // FIXME: offsetX, offsetY
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,

      // Key state
      altKey: e.altkey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      charCode: e.keyCode,

      // Event-management functions
      stopPropagation: function () {

        if (this._event.stopPropagation) {
          this._event.stopPropagation();
        }
        else {
          this._event.cancelBubble = true;
        }
      },
      preventDefault: function () {

        if (this._event.preventDefault) {
          this._event.preventDefault();
        }
        else {
          this._event.returnValue = false;
        }
      }
    };

    if (typeof props === 'object') {
      for (var item in props) {
        wrappedEvent[item] = props[item];
      }
    }

    return wrappedEvent;
  }


  /*!
   *
   * Anime Utilities
   * ---------------
   *
   */

  var Anime = Curce.Anime = {};

  var _animation = {};

  // animate
  // TODO: use requestAnimationFrame
  // http://otakustay.com/animation-and-requestanimationframe/
  // var animate = Anime.animate = function (obj, attrs, duration, complete) {

  //   if (typeof _animation[obj] === 'number') {
  //     clearInterval(_animation[obj]);
  //   }

  //   _animation[obj] = setInterval(function () {
  //     var stop = true;
      
  //     for (var attr in attrs) {

  //       var target = parseFloat(attrs[attr]),
  //           curValue = parseFloat(getStyle(obj, attr));

  //           // console.log('animating;',getStyle(obj, attr))
  //       if (attr === 'opacity') {
  //         target = target * 100;
  //         curValue = curValue * 100;
  //       }
                    
  //       if (curValue !== target) {
  //         stop = false;

  //         var speed = (target - curValue) / 6;
  //         if (speed > 0) {
  //           speed = Math.ceil(speed);
  //         }
  //         else {
  //           speed = Math.floor(speed);
  //         }

  //         _reNonNumber.lastIndex = 0;
  //         var unit = _reNonNumber.exec(attrs[attr]);
  //         if (unit !== null) {
  //           unit = unit[0];
  //         } else {
  //           unit = _getDefaultUnit(attr);
  //         }

  //         if (attr === 'opacity') {
  //           setStyle(obj, attr, ((curValue + speed) / 100) + unit);
  //         }
  //         else {
  //           setStyle(obj, attr, (curValue + speed) + unit);
  //           // console.log('animating;',curValue + speed)
  //         }

  //       }
  //     }

  //     if (stop) {
  //       clearInterval(_animation[obj]);
  //       if (complete) {
  //         complete.call(obj);
  //       }
  //       delete _animation[obj];
  //     }
  //   }, 16);
  // };

  // requestAnimationFrame && cancelAnimationFrame
  var _vendorPrefix = ['webkit', 'moz', 'ms', 'o'];
  
  var rAF = window.requestAnimationFrame,
      cAF = window.cancelAnimationFrame;

  (function () {

    var lastTime = 0, startTime = new Date().getTime();

    for (var i = 0, len = _vendorPrefix.length; i < len && !rAF; i++) {
      rAF = window[_vendorPrefix[i] + 'RequestAnimationFrame'];
      cAF = window[_vendorPrefix[i] + 'CancelAnimationFrame'];
    }

    if (!rAF || !cAF) {

      rAF = function (callback) {

        var curTime = new Date().getTime();
        var delay = Math.max(0, 16 - (curTime - lastTime));
        var animeId = setTimeout (function () {
          callback(curTime + delay - startTime);
        }, delay);

        lastTime = curTime + delay;

        return animeId;
      };

      cAF = function (animeId) {
        
        if (isNumber(animeId)) {
          cleatTimeout(animeId);
        }
      }
    }
  })();
  
  Anime.rAF = rAF;
  Anime.cAF = cAF;  

  // createAnime()
  // attrs = {attr, {from: 0, to: 1, easing: 'linear'}}
  var createAnime = Anime.createAnime = function (obj, attrs, duration, complete) {

    if (isNumber(obj.animeId)) {
      cAF(obj.animeId);
    }

    duration = duration || 600;

    var startTime = new Date().getTime();

    function step (timestap) {
      
      var changeInTime = new Date().getTime() - startTime;

      // 如果时间变化超过动画时间
      if (changeInTime >= duration) {
        each(attrs, function (param, attr) {
          setStyle(obj, attr, param['to'] + param['unit']);
        });

        cAF(obj.animeId);
        delete obj.animeId;

        if (isFunction(complete)) {
          complete.call(obj, obj);
        }
      }
      else {
        each(attrs, function (param, attr) {
          var percent = (_easingFuncs[param['easing']])(changeInTime, 0, 1, duration);
          var to = (param['to'] - param['from']) * percent + param['from'];
          setStyle(obj, attr, to + param['unit']);
        });
        obj.animeId = rAF(step);
      }
    }

    // initial attr param
    each (attrs, function (param, attr, attrs) {
      
      if (param['unit'] === undefined) {
        var _reNonNumber = /[^\d\.\-]+/;
        var unit = _reNonNumber.exec(param['to']);
        if (unit !== null) {
          unit = unit[0];
        } else {
          unit = _getDefaultUnit(attr);
        }
        param['unit'] = unit;
      }

      param['to'] = parseFloat(param['to']);

      if (param['from'] === undefined) {
        param['from'] = parseFloat(getStyle(obj, attr));
      } else {
        param['from'] = parseFloat(param['from']);
        setStyle(obj, attr, param['from'] + param['unit']);
      }

      if (param['easing'] === undefined) {
        param['easing'] = 'linear';
      }

    });
    
    obj.animeId = rAF(step);
  }


  var _units = {
    "width height borderWidth left top bottom right margin padding fontSize" : 'px'
  };
  function _getDefaultUnit (attr) {
    
    var reAttr, unit = '';

    reAttr = new RegExp('\\b' + attr + '\\b');

    for (var item in _units) {
      if (item.search(reAttr) !== -1) {
        unit = _units[item];
        break;
      }
    }
    
    return unit;
  }
  // t: change in time, b: begining value, c: change In value, d: duration
  var _easingFuncs = {};

  _easingFuncs['linear'] = function (t, b, c, d) {

    return c*t/d + b;
  };

  _easingFuncs['easeInQuad'] = function (t, b, c, d) {

    t /= d;
    return c*t*t + b;
  };

  _easingFuncs['easeOutQuad'] = function (t, b, c, d) {

    t /= d;
    return -c * t*(t-2) + b;
  };

  _easingFuncs['easeInOutQuad'] = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

  _easingFuncs['easeInCubic'] = function (t, b, c, d) {
    t /= d;
    return c*t*t*t + b;
  };

  _easingFuncs['easeOutCubic'] = function (t, b, c, d) {
    t /= d;
    t--;
    return c*(t*t*t + 1) + b;
  };

  _easingFuncs['easeInOutCubic'] = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
  };

  _easingFuncs['easeInQuart'] = function (t, b, c, d) {
    t /= d;
    return c*t*t*t*t + b;
  };

  _easingFuncs['easeOutQuart'] = function (t, b, c, d) {
    t /= d;
    t--;
    return -c * (t*t*t*t - 1) + b;
  };

  _easingFuncs['easeInOutQuart'] = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t*t + b;
    t -= 2;
    return -c/2 * (t*t*t*t - 2) + b;
  };

  // TODO: Make this be worthy of existence
  var TokenList = (function () {

    var arrayProto = Array.prototype;

    function DOMTokenList (arr) {
      if (isArray(arr)) {
        // arrayProto.splice.call(this, 0, 0, arr);
        Array.call(this, arr);
      }
    }

    DOMTokenList.prototype = {

      constructor: DOMTokenList,

      item: function (key) {

          return this[key];

      },
      add: function (item) {

        if (!this.contains(item)) {

          arrayProto.push.call(this, item);
        }
      },
      remove: function (item) {

        var index = -1;

        if (arrayProto.indexOf) {

          index = arrayProto.indexOf.call(this, item);

        }
        else {

          for (var i = 0, len = this.length; i < len; i++) {

            if (this[i] === item) {

              index = i;
              break;
            }
          }
        }

        if (index !== -1) {

          arrayProto.splice.call(this, index, 1);
        }
      },
      contains: function (item) {

        if (arrayProto.indexOf) {

          return (arrayProto.indexOf.call(this, item) === -1) ? false : true;
        }
        else {

          for (var i = 0, len = this.length; i < len; i++) {

            if (this[i] === item) {

              return true;
            }
          }
          return false;
        }
      }
    }

    return DOMTokenList;
  })();

  /*!
   *
   * Consolite
   * A simple console
   * ----------------
   *
   */
  // 简易console，将内容输出到页面中指定的元素
  var Consolite = Curce.consolite = (function () {
    function CMD (console) {
      this.lineNum = 0;
      this.console = querySelectorAll(console)[0];
    }
    CMD.prototype = {
      constructor: CMD,
      // log()
      log: function () {
        var args = getArgs(arguments),
            item = createElement('p');
        append(this.console, item);
        setHTML(item, ++this.lineNum + ': ' + args.join(' '));
      },
      // clear();
      clear: function () {
        setHTML(this.console, '');
      }
    };
    return CMD;
  })();

  // export to global object 
  window.Curce = Curce;

})(Sizzle, window);