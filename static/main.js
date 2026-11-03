var n,t$1,i$1,u$1,f$2,e$1,o$2,l$1,c$1,a$2,h$1=Symbol.for("pv"),p$1={},v$1=[],y$1=/^m(i|n|o|s|text|space)$/,w$1=Array.isArray,d$1=v$1.slice,_$1=Object.assign;function g$1(n){n&&n.parentNode&&n.remove();}function m$1(r,i,u,f,e){var o={type:r,props:i,key:u,ref:f,__k:null,__:null,__b:0,__e:null,__c:null,constructor:h$1,__v:e||++t$1,__i:-1,__u:0};return !e&&n.vnode&&n.vnode(o),o}function M(n){return n.children}function x(n,t){this.props=n,this.context=t,this.__g=0;}function S(n,t){if(null==t)return n.__&&S(n.__,n.__i+1);for(var r;t<n.__k.length;t++)if((r=n.__k[t])&&r.__e)return r.__e;return "function"!=typeof n.type||n.props.__P?null:S(n)}function C$1(n){if((n=n.__)&&n.__c&&!n.props.__P)return n.__e=null,n.__k.some(function(t){return t&&(n.__e=t.__e)}),C$1(n)}function j(t){(8&t.__g||(t.__g|=8,i$1.push(t),f$2++))&&u$1==n.debounceRendering||((u$1=n.debounceRendering)||queueMicrotask)(L);}function L(){var t,r,o,l,c,a,s,p,v;try{for(r=1;i$1.length;)i$1.length>r&&i$1.sort(e$1),t=i$1.shift(),r=i$1.length,8&t.__g&&(l=void 0,c=void 0,a=(c=(o=t).__v).__e,s=[],p=[],(v=o.__P)&&((l=_$1({constructor:h$1},c)).__v=c.__v+1,n.vnode&&n.vnode(l),V(v,l,c,o.__n,v.namespaceURI,32&c.__u?[a]:null,s,a||S(c),32&c.__u,p),l.__v=c.__v,l.__.__k[l.__i]=l,D$1(s,l,p),c.__=c.__e=null,l.__e!=a&&C$1(l)));}finally{(f$2=i$1.length)&&(u$1||queueMicrotask)(L);}}function H(n,t,r,i,u,f,e,o,l,c,a){var s,h,y,w,d,_,g=i.__k||v$1,k=t.length;for(l=I(r,t,g,l,k),s=0;s<k;s++)null!=(y=r.__k[s])&&(h=~y.__i&&g[y.__i]||p$1,y.__i=s,_=V(n,y,h,u,f,e,o,l,c,a),w=y.__e,(h.ref!=y.ref||8&h.__u)&&(h.ref&&F(h.ref,null,y,h),y.ref&&a.push(y.ref,y.__c||w,y)),d=d||w,4&y.__u?(l=q(y,l,n,!h.__v),h.__e&&(h.__e=null)):"function"==typeof y.type&&void 0!==_?l=_:w&&(l=w.nextSibling),y.__u&=-21);return r.__e=d,l}function I(n,t,r,i,u){var f,e,o,l,c,a,s,p,v,y=r.length,d=y,_=0,g=0,k=n.__k=Array(u);for(f=0;f<u;f++)null!=(e=t[f])&&"boolean"!=typeof e&&"function"!=typeof e?("object"!=typeof e||e.constructor===String?e=k[f]=m$1(null,e):w$1(e)?e=k[f]=m$1(M,{children:e}):e.constructor===h$1&&e.__b?e=k[f]=m$1(e.type,e.props,e.key,e.ref,e.__v):k[f]=e,l=f+_,e.__=n,e.__b=n.__b+1,o=null,~(c=e.__i=O(e,r,l,d))&&(d--,(o=r[c])&&(o.__u|=2)),o&&o.__v?(e.__u|=16,c==l-1?_--:c==l+1?_++:c!=l&&(c>l?_--:_++,g=1)):(~c||(u>y?_--:u<y&&_++),"function"!=typeof e.type&&(e.__u|=4))):k[f]=null;if(g){for(a=[],s=[],f=0;f<u;f++)if((e=k[f])&&16&e.__u){for(_=0,p=a.length;_<p;)a[v=_+p>>1]<e.__i?_=v+1:p=v;a[_]=e.__i,s[f]=_+1;}for(_=a.length;f--;)s[f]&&(s[f]==_?_--:k[f].__u|=4);}if(d)for(f=0;f<y;f++)!(o=r[f])||2&o.__u||(o.__e==i&&(i=S(o)),G$1(o,o));return i}function q(n,t,r,i){var u,f,e,o;if("function"==typeof n.type){if(n.props.__P)return t;if(u=n.__k)for(f=0;f<u.length;f++)u[f]&&(u[f].__=n,t=q(u[f],t,r,false));return t}for(t&&!t.parentNode&&(t=S(n))&&!t.parentNode&&(t=null),e=n.__e,o=t;o&&8==o.nodeType;)o=o.nextSibling;for(e!=o&&(!i&&r.moveBefore&&e.parentNode?r.moveBefore(e,t):r.insertBefore(e,t||null)),t=e;(t=t&&t.nextSibling)&&8==t.nodeType&&!t.data.startsWith("$s"););return t}function O(n,t,r,i){var u,f=n.key,e=n.type,o=t[r],l=o&&!(2&o.__u);if(null===o&&null==f||l&&f==o.key&&e==o.type)return r;if(i>(l?1:0)){for(u=r-1;u>=0;u--)if((o=t[u])&&!(2&o.__u)&&f==o.key&&e==o.type)return u;for(u=r+1;u<t.length;u++)if((o=t[u])&&!(2&o.__u)&&f==o.key&&e==o.type)return u}return  -1}function P$1(n,t,r){null==r&&(r=""),"-"==t[0]?n.setProperty(t,r):n[t]=r;}function T$1(n,t,r,i,u){var f,e;if("style"==t)if("string"==typeof r)n.style.cssText=r;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(t in i)r&&t in r||P$1(n.style,t);if(r)for(t in r)i&&r[t]==i[t]||P$1(n.style,t,r[t]);}else if("o"==t[0]&&"n"==t[1])(n.__e||(n.__e={}))[t]=r,r&&i||(e=a$2[t]||(a$2[t]=N(t)),(n.__a||(n.__a={}))[t]=c$1,f=t!=(t=t.replace(l$1,"$1")),(t=t.slice(2))[0]<"a"&&(t=t.toLowerCase()),r?n.addEventListener(t,e,f):n.removeEventListener(t,e,f));else {if("http://www.w3.org/2000/svg"==u)t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=t&&"height"!=t&&"href"!=t&&"list"!=t&&"form"!=t&&"tabIndex"!=t&&"download"!=t&&"rowSpan"!=t&&"colSpan"!=t&&"role"!=t&&"popover"!=t&&t in n)try{return void(n[t]=null==r?"":r)}catch(n){}if("function"==typeof r)return;null==r||false===r&&"-"!=t[4]?n.removeAttribute(t):n.setAttribute(t,"popover"==t&&1==r?"":r);}}function N(t){return function(r){var i=this.__e;if(i){if(i=i[t],null==r[o$2])r[o$2]=c$1++;else if(r[o$2]<this.__a[t])return;return i(n.event?n.event(r):r)}}}function V(t,r,i,u,f,e,o,l,c,a){var s,p,y,d,k,b,m,$,C,j,L,I,q,A,O,P,T,N,V=r.type;if(r.constructor!==h$1)return null;128&i.__u&&(c=32&i.__u,s=i.__c.__z)&&(r.__u|=c,p=e=[],8==s.nodeType?l=z$1(s,e):e.push(s),l=e[0]||l),(s=n.__b)&&s(r);n:if("function"==typeof V){y=o.length;try{if($=r.props,C=(s=V.prototype)&&s.render,j=(s=V.contextType)&&u[s.__c],L=s?j?j.props.value:s.__:u,(d=i.__c)?(r.__c=d,2&d.__g&&(d.__g|=1)):(C?r.__c=d=new V($,L):(r.__c=d=new x($,L),d.constructor=V,d.render=J),j&&j.sub(d),d.state||(d.state={}),d.__n=u,d.__g|=8,d.__h=[],d.__k=[]),C&&(d.__s||(d.__s=d.state),V.getDerivedStateFromProps&&(d.__s==d.state&&(d.__s=_$1({},d.__s)),_$1(d.__s,V.getDerivedStateFromProps($,d.__s)))),k=d.props,b=d.state,d.__v=r,i.__c){if($!==k&&C&&!V.getDerivedStateFromProps&&d.componentWillReceiveProps&&d.componentWillReceiveProps($,L),r.__v==i.__v&&!(8&d.__g)||!(4&d.__g)&&d.shouldComponentUpdate&&!1===d.shouldComponentUpdate($,d.__s,L)){r.__v!=i.__v&&(d.props=$,d.state=d.__s,d.__g&=-9),r.__e=i.__e,r.__k=i.__k,r.__k.some(function(n){n&&(n.__=r);}),v$1.push.apply(d.__h,d.__k),d.__k=[],d.__h.length&&o.push(d),l=S(i);break n}d.componentWillUpdate&&d.componentWillUpdate($,d.__s,L),C&&d.componentDidUpdate&&d.__h.push(function(){d.componentDidUpdate(k,b,m);});}else C&&!V.getDerivedStateFromProps&&d.componentWillMount&&d.componentWillMount(),C&&d.componentDidMount&&d.__h.push(d.componentDidMount);if(d.context=L,d.props=$,d.__P=t,d.__g&=-5,I=n.__r,q=0,C)d.state=d.__s,d.__g&=-9,I&&I(r),s=d.render(d.props,d.state,d.context),v$1.push.apply(d.__h,d.__k),d.__k=[];else do{d.__g&=-9,I&&I(r),s=d.render(d.props,d.state,d.context),d.state=d.__s;}while(8&d.__g&&++q<25);d.state=d.__s,d.getChildContext&&(u=_$1({},u,d.getChildContext())),C&&i.__c&&d.getSnapshotBeforeUpdate&&(m=d.getSnapshotBeforeUpdate(k,b)),A=s&&s.type===M&&null==s.key?s.props.children:s,$.__P&&(s=l,f=(t=$.__P).namespaceURI,c=e=null,i.props&&i.props.__P!=t&&(i.__k.some(function(n){n&&G$1(n,n);}),i.__k=null),l=i.__k?S(i,0):null),l=H(t,w$1(A)?A:[A],r,i,u,f,e,o,l,c,a),$.__P&&(r.__e=null,l=s),r.__u&=-161,p&&p.some(g$1),d.__h.length&&o.push(d),1&d.__g&&(d.__g&=-4);}catch(t){if(o.length=y,r.__v=null,c||e)if(t.then){if(O=0,r.__u|=128|c,e){for(~(T=e.indexOf(l||void 0))||(T=e.length);(N=e[T-1])&&8==N.nodeType;)T--;for(;T<e.length;T++)if(N=e[T])if(e[T]=null,8==N.nodeType){if(N.data.startsWith("$s"))O++||(P=N);else if(O&&N.data.startsWith("/$s")&&!--O)break}else if(!O)break}if(!P){for(;l&&8==l.nodeType&&l.nextSibling;)l=l.nextSibling;P=l;}(s=z$1(P=r.__c.__z||(r.__c.__z=P)))?(r.__e=P,l=s):r.__e=l,l=l&&l.nextSibling;}else e&&e.some(g$1);else r.__e=i.__e;r.__k||(r.__k=i.__k||[]),t.then||B$1(r),n.__e(t,r,i);}}else l=r.__e=E$1(i.__e,r,i,u,f,e,o,c,a,t);return (s=n.diffed)&&s(r),l}function z$1(n,t){if(n&&8==n.nodeType&&n.data.startsWith("$s"))for(var r=1;n=n.nextSibling;){if(8==n.nodeType)if(n.data.startsWith("$s"))r++;else if(n.data.startsWith("/$s")&&!--r)return n;t&&t.push(n);}}function B$1(n){n&&(n.__c&&(n.__c.__g|=4),n.__k&&n.__k.some(B$1));}function D$1(t,r,i){for(var u=0;u<i.length;)F(i[u++],i[u++],i[u++]);n.__c&&n.__c(r,t),t.some(function(r){try{t=r.__h,r.__h=[],t.some(function(n){n.call(r);});}catch(t){n.__e(t,r.__v);}});}function E$1(t,r,i,u,f,e,o,l,c,a){var s,h,v,_,k,b,m,$,M,x=i.props||p$1,C=r.props,j=r.type;if("svg"==j?f="http://www.w3.org/2000/svg":"math"==j?f="http://www.w3.org/1998/Math/MathML":f||(f="http://www.w3.org/1999/xhtml"),e)for(s=0;s<e.length;s++)if((k=e[s])&&(j?k.localName==j:3==k.nodeType)){t=k,e[s]=null;break}if(!t){if($=a.ownerDocument||document,!j)return $.createTextNode(C);t=$.createElementNS(f,j,C.is&&C),l&&(n.__m&&n.__m(r,e),l=false),e=null;}if(j){if(a="template"==j?t.content:t,e="textarea"==j&&null!=C.defaultValue?null:e&&d$1.call(a.childNodes),!l&&e)for(x={},s=0;s<t.attributes.length;s++)x[(k=t.attributes[s]).name]=k.value;for(s in x)k=x[s],"dangerouslySetInnerHTML"==s?v=k:"children"==s||s in C||"value"==s&&"defaultValue"in C||"checked"==s&&"defaultChecked"in C||T$1(t,s,null,k,f);for(s in M=1&i.__u,C)k=C[s],"children"==s?_=k:"dangerouslySetInnerHTML"==s?h=k:"value"==s?b=k:"checked"==s?m=k:l&&"function"!=typeof k||!(x[s]!==k||M&&null!=k)||T$1(t,s,k,x[s],f);h?(l||v&&(h.__html==v.__html||h.__html==t.innerHTML)||(t.innerHTML=h.__html),r.__k=[]):(v&&(t.textContent=""),("foreignObject"==j||"http://www.w3.org/1998/Math/MathML"==f&&y$1.test(j))&&(f="http://www.w3.org/1999/xhtml"),H(a,w$1(_)?_:[_],r,i,u,f,e,o,e?e[0]:i.__k&&S(i,0),l,c),e&&e.some(g$1)),l&&"textarea"!=j||(s="value","progress"==j&&null==b?t.removeAttribute(s):null==b||b===t[s]&&("progress"!=j||b)||T$1(t,s,b,x[s],f),s="checked",null!=m&&m!=t[s]&&T$1(t,s,m,x[s],f));}else x===C||l&&t.data==C||(t.data=C);return t}function F(t,r,i,u){try{"function"==typeof t?r?r.__x=t(r)||1:u&&(u=u.__c||u.__e)&&(r=u.__x)&&(u.__x=null,"function"==typeof r?r():t(null)):t.current=r;}catch(t){n.__e(t,i);}}function G$1(t,r,i){var u,f,e,o;if(n.unmount&&n.unmount(t),!(u=t.ref)||u.current&&u.current!=t.__e||F(u,null,r,t),u=t.__c){if(u.componentWillUnmount)try{u.componentWillUnmount();}catch(t){n.__e(t,r);}u.__P=u.__n=null;}if(u=t.__k)for(o=0;o<u.length;o++)u[o]&&G$1(u[o],r,"function"!=typeof t.type||i&&!t.props.__P);!i&&(u=t.__c)&&(u=u.__z)&&(f=z$1(u,e=[]))&&(u==t.__e&&e.some(g$1),g$1(f),g$1(u)),(u=t.__e)&&(i||g$1(u),u.__e&&(u.__e=null)),t.__e=t.__c=t.__=null;}function J(n,t,r){return this.constructor(n,r)}function K(t,r){var i,u,f,e;n.__&&n.__(t,r),9==r.nodeType&&(r=r.documentElement),u=(i=t&&32&t.__u)?null:r.__k,r.__k=m$1(M,{children:[t]}),f=[],e=[],V(r,r.__k,u||p$1,p$1,r.namespaceURI,u?null:r.firstChild?d$1.call(r.childNodes):null,f,u?u.__e:r.firstChild,i,e),D$1(f,r.__k,e),r.__k.props.children=null;}n={__e:function(n,t,r,i){for(var u,e,o;t=t.__;)if((u=t.__c)&&!(1&u.__g)){u.__g|=4;try{if((o=(e=u.constructor)&&e.getDerivedStateFromError)&&u.setState(e.getDerivedStateFromError(n)),u.componentDidCatch&&(u.componentDidCatch(n,i||{}),o=1),o&&8&u.__g)return void(u.__g|=2)}catch(t){n=t;}}throw f$2=0,n}},t$1=0,x.prototype.setState=function(n,t){var r=this.__s;r&&r!=this.state||(r=this.__s=_$1({},this.state)),"function"==typeof n&&(n=n(_$1({},r),this.props)),n&&(_$1(r,n),this.__v&&(t&&this.__k.push(t),j(this)));},x.prototype.forceUpdate=function(n){this.__v&&(this.__g|=4,n&&this.__h.push(n),j(this));},x.prototype.render=M,i$1=[],f$2=0,e$1=function(n,t){return n.__v.__b-t.__v.__b},o$2=Symbol(),l$1=/(PointerCapture)$|Capture$/i,c$1=0,a$2={};

var f$1=Symbol.for("pv"),o$1=0;function a$1(t,e,n$1,u,a,i){e||(e={});var c,l,p=e;if("ref"in p&&"function"!=typeof t)for(l in p={},e)"ref"==l?c=e[l]:p[l]=e[l];var s={type:t,props:p,key:n$1,ref:c,__k:null,__:null,__b:0,__e:null,__c:null,constructor:f$1,__v:--o$1,__i:-1,__u:0};return n.vnode&&n.vnode(s),s}

var t,r,u,i,o=Object.is,f=0,c=[],e=[],a=n,v=a.__b,l=a.__r,m=a.diffed,h=a.__c,s=a.unmount,p=a.__;function y(n,t){a.__h&&a.__h(r,n,f||t),f=0;var u=r.__H||(r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d(n){return f=1,_(G,n)}function _(n,u,i){var f=y(t++,2);if(f.t=n,!f.__c&&(f.__=[G(void 0,u),function(n){var t=f.__N?f.__N[0]:f.__[0],r=f.t(t,n);o(t,r)||(f.__N=[r,f.__[1]],f.__c.setState({}));}],f.__c=r,!r.__f)){r.__f=true;var c=r.shouldComponentUpdate;r.shouldComponentUpdate=function(n,t,r){var u=this.__H;if(!u)return  true;var i=false,f=this.props!=n;if(u.__.some(function(n){n.__N&&(i=true,o(n.__[0],n.__N[0])||(f=true));}),c){var e=c.call(this,n,t,r);return i?e||f:e}return !i||f};}return f.__}function A(n,u){var i=y(t++,3);!a.__s&&E(i.__H,u)&&(i.__P=true,i.__=n,i.u=u,r.__H.__h.push(i));}function T(n){return f=5,w(function(){return {current:n}},[])}function w(n,r){var u=y(t++,7);return E(u.__H,r)&&(u.__=n(),u.__H=r),u.__}function P(){var n=y(t++,11);if(!n.__){for(var u=r.__v;!u.__m&&u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++;}return n.__}function g(){var n;do{for(;n=e.shift();)try{C(n);}catch(t){a.__e(t,{__:(n=n.__P)&&n.__v});}for(;n=c.shift();){var t=n.__H;if(n.__P&&t)try{t.__h.some(C),t.__h.some(D),t.__h=[];}catch(r){t.__h=[],a.__e(r,n.__v);}}}while(e.length)}a.__b=function(n){r=null,v&&v(n);},a.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),p&&p(n,t);},a.__r=function(n){l&&l(n),t=0;var i=(r=n.__c).__H;i&&(u==r?r.__h=[]:(i.__h.some(C),i.__h.some(D),t=0),i.__h=[],i.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0;})),u=r;},a.diffed=function(n){m&&m(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&B(c.push(t)),t.__H.__.some(function(n){n.u&&(n.__H=n.u);})),u=r=null;},a.__c=function(n,t){t.some(function(n){try{n.__h.some(C),n.__h=n.__h.filter(function(n){return !n.__||D(n)});}catch(t){n.__h=[function(){throw t}];}}),h&&h(n,t);},a.unmount=function(n){s&&s(n);var t,r,u=n.__c;u&&u.__H&&(u.__H.__.some(function(u){try{if(u.__P&&u.__c){if(void 0===r){for(r=n.__;r&&(!r.__c||!r.__c.__P);)r=r.__;r=r&&r.__c;}u.__P=r,B(e.push(u));}else C(u);}catch(n){t=n;}}),u.__H=void 0,t&&a.__e(t,u.__v));};var k="function"==typeof requestAnimationFrame;function z(n){var t,r=function(){clearTimeout(u),k&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,35);k&&(t=requestAnimationFrame(r));}function B(n){1!=n&&i==a.requestAnimationFrame||((i=a.requestAnimationFrame)||z)(g);}function C(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t;}function D(n){var t=r;n.__c=n.__(),r=t;}function E(n,t){return !n||n.length!=t.length||t.some(function(t,r){return !o(t,n[r])})}function G(n,t){return "function"==typeof t?t(n):t}

function isRequestError(e) {
    return e.ctx && e.event;
}
async function doRequest(endpoint, method = 'GET', body = null, mods = () => { }) {
    const text = await doRawRequest(endpoint, method, body, mods);
    return new Promise((resolve) => {
        const data = JSON.parse(text);
        resolve(data);
    });
}
function doRawRequest(endpoint, method = 'GET', body = null, mods = () => { }) {
    const request = new XMLHttpRequest();
    request.open(method, `/${endpoint}`, true);
    mods(request);
    return new Promise((resolve, reject) => {
        request.addEventListener('load', function (e) {
            if (this.status >= 200 && this.status < 400) {
                resolve(this.responseText);
            }
            else {
                reject({ ctx: this, event: e });
            }
        });
        request.withCredentials = true;
        request.addEventListener('error', function (e) {
            reject({ ctx: this, event: e });
        });
        if (body) {
            request.send(body);
        }
        else {
            request.send();
        }
    });
}

class AuthedApi {
    async isAuthed() {
        try {
            await doRequest('api/authed', 'GET', null);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}

class EnvApi {
    getEnv() {
        return doRequest('env', 'GET', null);
    }
}

class ShieldsApi {
    getShields() {
        return doRequest('api/shields', 'GET', null);
    }
    saveShield(n) {
        if (n.ShieldID) {
            return doRequest(`api/shield/${n.ShieldID}`, 'PUT', JSON.stringify(n));
        }
        else {
            return doRequest('api/shields', 'POST', JSON.stringify(n));
        }
    }
    deleteShield(n) {
        return doRawRequest(`api/shield/${n.ShieldID}`, 'DELETE', JSON.stringify(n));
    }
}

class UserAPITokensApi {
    getTokens() {
        return doRequest('api/user/tokens', 'GET', null);
    }
    createToken(description) {
        return doRequest('api/user/tokens', 'POST', JSON.stringify({ Description: description }));
    }
    deleteToken(token) {
        return doRawRequest(`api/user/tokens/${token.APITokenID}`, 'DELETE', null);
    }
}

const apiExamples = [
    ["GitHub Action", gitHubActionExample],
    ["Curl", curlExample],
    ["JS", jsExample],
    ["PHP", phpExample],
];
function ApiExamples({ env, title = "Shielded.dev", text = "Rocks", color = "0011aa", token = "<secret>" }) {
    const [selectedExample, setSelectedExample] = d(apiExamples[0]);
    const example = selectedExample[1](env, title, text, color, token);
    return a$1("div", { class: "api-example--controller", children: [a$1("ul", { "aria-label": "API example format", children: apiExamples.map((item) => a$1("li", { children: a$1("button", { type: "button", "aria-pressed": item[0] === selectedExample[0], onClick: () => setSelectedExample(item), children: item[0] }) }, item[0])) }), a$1("pre", { children: a$1("code", { children: example }) })] });
}
function mountApiExamples(elm, env) {
    K(a$1(ApiExamples, { env: env }), elm);
}
function curlExample(env, title, text, color, token) {
    return `curl -X "POST" "https://${env.ApiHost}" \\
	-H 'Authorization: token ${addslashesSingleQuotes(token)}' \\
	-H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \\
	--data-urlencode 'title=${addslashesSingleQuotes(title)}' \\
	--data-urlencode 'text=${addslashesSingleQuotes(text)}' \\
	--data-urlencode 'color=${addslashesSingleQuotes(color)}'`;
}
function addslashesSingleQuotes(value) {
    return `${value}`.replace(/\\/g, "\\$&").replace(/'/g, "\\'");
}
function phpExample(env, title, text, color, token) {
    return `<?php

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_URL            => 'https://${env.ApiHost}',
	CURLOPT_POST           => true,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_POSTFIELDS     => [
		'title' => ${JSON.stringify(title)},
		'text'  => ${JSON.stringify(text)},
		'color' => ${JSON.stringify(color)},
	],
	CURLOPT_HTTPHEADER     => [
		${JSON.stringify("Authorization: token " + token)},
	],
]);

curl_exec($ch);
if( curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200 ) {
	//ok
}`;
}
function jsExample(env, title, text, color, token) {
    return `const params = new URLSearchParams();

params.append('title', ${JSON.stringify(title)});
params.append('text', ${JSON.stringify(text)});
params.append('color', ${JSON.stringify(color)});

fetch('https://${env.ApiHost}', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': ${JSON.stringify("token " + token)},
	},
	body: params
})
.then((result) => {
	console.log('Success:', result);
})
.catch((error) => {
	console.error('Error:', error);
});`;
}
function gitHubActionExample(_, title, text, color, token) {
    return `name: Update Shield
on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Update Shielded.dev Badge
        uses: shieldeddotdev/shielded-action@v1
        with:
          # The token should be stored as a repository secret
          shielded-token: ${JSON.stringify(token)}
          title: ${JSON.stringify(title)}
          text: ${JSON.stringify(text)}
          color: ${JSON.stringify(color)}`;
}

function CopyableInput({ label, value, id: suppliedID }) {
    const generatedID = P();
    const id = suppliedID || generatedID;
    const [copied, setCopied] = d(false);
    A(() => setCopied(false), [value]);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
        }
        catch (error) {
            console.error(error);
        }
    };
    return a$1(M, { children: [a$1("label", { for: id, children: label }), a$1("div", { class: "markdown-input--controller", children: [a$1("input", { id: id, value: value, readOnly: true, onClick: (event) => event.currentTarget.select() }), a$1("button", { type: "button", onClick: copy, children: copied ? "Copied!" : "Copy" })] })] });
}

function Input({ label, ...attributes }) {
    const generatedID = P();
    const id = attributes.id || generatedID;
    return a$1("div", { class: "input-container", children: [a$1("label", { for: id, children: label }), a$1("input", { ...attributes, id: id })] });
}

const shieldKeyPattern = /^[a-z0-9-]{3,64}$/;
async function Dashboard(elm) {
    if (elm === null) {
        return;
    }
    const authApi = new AuthedApi();
    if (!await authApi.isAuthed()) {
        window.location.href = "/";
        return;
    }
    const env = await (new EnvApi()).getEnv();
    K(a$1(DashboardApp, { env: env }), elm);
}
function DashboardApp({ env }) {
    const [page, setPage] = d(currentPage());
    A(() => {
        const updatePage = () => setPage(currentPage());
        window.addEventListener("hashchange", updatePage);
        return () => window.removeEventListener("hashchange", updatePage);
    }, []);
    return a$1(M, { children: [a$1(DashboardNavigation, { page: page }), page === "user" ? a$1(M, { children: [a$1("h3", { children: "User tokens" }), a$1("div", { class: "dashboard--controller", children: a$1(APITokens, {}) })] }) : a$1(M, { children: [a$1("h3", { children: "Dashboard" }), a$1("div", { class: "dashboard--controller", children: a$1(Shields, { env: env }) })] })] });
}
function DashboardNavigation({ page }) {
    return a$1("nav", { class: "dashboard-navigation", "aria-label": "Dashboard navigation", children: [a$1("a", { href: "#/dashboard", "aria-current": page === "dashboard" ? "page" : undefined, children: "Shields" }), a$1("a", { href: "#/user", "aria-current": page === "user" ? "page" : undefined, children: "User tokens" })] });
}
function Shields({ env }) {
    const api = T(new ShieldsApi()).current;
    const [shields, setShields] = d(null);
    const [error, setError] = d("");
    A(() => {
        void api.getShields()
            .then(setShields)
            .catch((requestError) => setError(errorMessage(requestError)));
    }, [api]);
    const createShield = async () => {
        setError("");
        try {
            const shield = await api.saveShield({
                Name: "New Shield",
                Title: "New",
                Color: "00AA55",
                Text: "Shield",
            });
            setShields((current) => [...(current || []), shield]);
            setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
        }
        catch (requestError) {
            setError(errorMessage(requestError));
        }
    };
    const saveShield = async (shield) => {
        setError("");
        try {
            const savedShield = await api.saveShield(shield);
            setShields((current) => (current || []).map((item) => item.ShieldID === savedShield.ShieldID ? savedShield : item));
        }
        catch (requestError) {
            setError(errorMessage(requestError));
            throw requestError;
        }
    };
    const deleteShield = async (shield) => {
        setError("");
        try {
            await api.deleteShield(shield);
            setShields((current) => (current || []).filter((item) => item.ShieldID !== shield.ShieldID));
        }
        catch (requestError) {
            setError(errorMessage(requestError));
        }
    };
    return a$1(M, { children: [a$1("button", { type: "button", class: "add-button primary", onClick: createShield, children: [a$1("span", { class: "icon", children: "\u2795" }), "New shield"] }), error !== "" && a$1("p", { children: error }), shields === null && error === "" && a$1("p", { children: "Loading shields\u2026" }), shields !== null && shields.map((shield) => a$1(ShieldForm, { shield: shield, env: env, onSave: saveShield, onDelete: deleteShield }, shield.ShieldID)), shields !== null && shields.length === 0 && a$1("h4", { class: "no-shields", children: "No shields yet. Click the button to get started." })] });
}
function ShieldForm({ shield, env, onSave, onDelete }) {
    const [draft, setDraft] = d(shield);
    const draftRef = T(draft);
    const saveTimeout = T(null);
    const saveInFlight = T(false);
    const pendingSave = T(null);
    const [imageTick, setImageTick] = d(Date.now());
    const [secretCopied, setSecretCopied] = d(false);
    const [secretVisible, setSecretVisible] = d(false);
    A(() => () => {
        if (saveTimeout.current !== null) {
            clearTimeout(saveTimeout.current);
        }
        pendingSave.current = null;
    }, []);
    const flushSave = () => {
        if (saveInFlight.current || pendingSave.current === null) {
            saveTimeout.current = null;
            return;
        }
        const next = pendingSave.current;
        pendingSave.current = null;
        saveTimeout.current = null;
        saveInFlight.current = true;
        void onSave(next)
            .then(() => setImageTick(Date.now()))
            .catch(() => undefined)
            .finally(() => {
            saveInFlight.current = false;
            if (pendingSave.current !== null && saveTimeout.current === null) {
                flushSave();
            }
        });
    };
    const queueSave = (next) => {
        if (saveTimeout.current !== null) {
            clearTimeout(saveTimeout.current);
            saveTimeout.current = null;
        }
        if (next.ShieldKey !== undefined && next.ShieldKey !== "" && !shieldKeyPattern.test(next.ShieldKey)) {
            pendingSave.current = null;
            return;
        }
        pendingSave.current = next;
        saveTimeout.current = setTimeout(flushSave, 500);
    };
    const handleInput = (event) => {
        const input = event.target;
        let next;
        switch (input.name) {
            case "Name":
            case "ShieldKey":
            case "Title":
            case "Text":
                next = { ...draftRef.current, [input.name]: input.value };
                break;
            case "Color":
                next = { ...draftRef.current, Color: input.value.replace(/^#/, "") };
                break;
            default:
                return;
        }
        draftRef.current = next;
        setDraft(next);
        queueSave(next);
    };
    const deleteShield = async () => {
        if (!confirm("Are you sure you want to delete this shield?")) {
            return;
        }
        if (saveTimeout.current !== null) {
            clearTimeout(saveTimeout.current);
        }
        await onDelete(draftRef.current);
    };
    const markdown = `![${draft.Name}](https://${env.ImgHost}/s/${draft.PublicID})`;
    const shieldKeyInvalid = draft.ShieldKey !== undefined && draft.ShieldKey !== "" && !shieldKeyPattern.test(draft.ShieldKey);
    const shieldKeyErrorID = `shield-${draft.ShieldID}-key-error`;
    const secretInputID = `shield-${draft.ShieldID}-secret`;
    return a$1("form", { class: "shield--controller", onInput: handleInput, children: [a$1("section", { class: "name-input", children: [a$1(Input, { label: "Shield Name", name: "Name", value: draft.Name }), a$1(Input, { label: "Shield key", name: "ShieldKey", value: draft.ShieldKey || "", pattern: "[a-z0-9\\\\-]{3,64}", title: "Optional: 3-64 lowercase letters, digits, or hyphens", placeholder: "e.g. production-status", autoComplete: "off", spellcheck: false, "aria-invalid": shieldKeyInvalid, "aria-describedby": shieldKeyInvalid ? shieldKeyErrorID : undefined }), shieldKeyInvalid && a$1("p", { id: shieldKeyErrorID, class: "input-error", role: "alert", children: "Shield key must be 3-64 lowercase letters, digits, or hyphens." })] }), a$1("section", { class: "shield-container", children: a$1("img", { src: `https://${env.ImgHost}/s/${draft.PublicID}?break=${imageTick}`, alt: `${draft.Title}: ${draft.Text}` }) }), a$1("section", { class: "main-inputs", children: [a$1(Input, { label: "Title", name: "Title", value: draft.Title }), a$1(Input, { label: "Text", name: "Text", value: draft.Text }), a$1(Input, { label: "Color", name: "Color", value: `#${draft.Color.replace(/^#/, "")}`, type: "color", title: "Must be a hex color code" })] }), a$1("details", { class: "api-example", children: [a$1("summary", { children: "API Call Examples" }), a$1(ApiExamples, { env: env, title: draft.Title, text: draft.Text, color: draft.Color, token: draft.Secret })] }), a$1("section", { class: "button-container", children: a$1("button", { type: "button", class: "danger", onClick: deleteShield, children: [a$1("span", { class: "icon", children: "\u274C" }), "Delete"] }) }), a$1("section", { class: "fancy-inputs", children: [a$1(CopyableInput, { label: "Markdown", value: markdown }), a$1("label", { for: secretInputID, children: "This shield's API token" }), a$1("div", { class: "secret-input--controller", children: [a$1("input", { id: secretInputID, ...(secretVisible ? { type: "text" } : { type: "password" }), value: draft.Secret, readOnly: true, onClick: (event) => event.currentTarget.select() }), a$1("button", { type: "button", onClick: () => copy(draft.Secret, setSecretCopied), children: secretCopied ? "Copied!" : "Copy" }), a$1("button", { type: "button", onClick: () => setSecretVisible(!secretVisible), children: secretVisible ? "Hide" : "Reveal" })] })] })] });
}
function APITokens() {
    const api = T(new UserAPITokensApi()).current;
    const [tokens, setTokens] = d(null);
    const [description, setDescription] = d("");
    const [createdToken, setCreatedToken] = d("");
    const [copied, setCopied] = d(false);
    const [error, setError] = d("");
    const [creating, setCreating] = d(false);
    A(() => {
        void api.getTokens()
            .then(setTokens)
            .catch((requestError) => setError(errorMessage(requestError)));
    }, [api]);
    const createToken = async (event) => {
        event.preventDefault();
        const trimmedDescription = description.trim();
        if (trimmedDescription === "") {
            setError("Description is required.");
            return;
        }
        setCreating(true);
        setError("");
        try {
            const token = await api.createToken(trimmedDescription);
            setTokens((current) => [token, ...(current || [])]);
            setCreatedToken(token.Token);
            setDescription("");
            setCopied(false);
        }
        catch (requestError) {
            setError(errorMessage(requestError));
        }
        finally {
            setCreating(false);
        }
    };
    const revokeToken = async (token) => {
        if (!confirm(`Revoke the token “${token.Description}”? This cannot be undone.`)) {
            return;
        }
        setError("");
        try {
            await api.deleteToken(token);
            setTokens((current) => (current || []).filter((item) => item.APITokenID !== token.APITokenID));
        }
        catch (requestError) {
            setError(errorMessage(requestError));
        }
    };
    return a$1("section", { class: "api-tokens--controller", children: [a$1("h3", { children: "User API tokens" }), a$1("p", { children: "Create a token to update or create any of your shields through the API." }), a$1("form", { onSubmit: createToken, children: [a$1("label", { for: "api-token-description", children: "Description" }), a$1("input", { id: "api-token-description", name: "description", value: description, onInput: (event) => setDescription(event.currentTarget.value), required: true, maxLength: 255, placeholder: "e.g. production deploy job" }), a$1("button", { type: "submit", class: "primary", disabled: creating, children: "Create token" })] }), error !== "" && a$1("p", { children: error }), createdToken !== "" && a$1("div", { class: "created-api-token", children: [a$1("p", { children: "Copy this token now. It will not be shown again." }), a$1("label", { for: "created-api-token", children: "New API token" }), a$1("input", { id: "created-api-token", value: createdToken, readOnly: true, onClick: (event) => event.currentTarget.select() }), a$1("button", { type: "button", onClick: () => copy(createdToken, setCopied), children: copied ? "Copied!" : "Copy" })] }), a$1("div", { children: [a$1("h4", { children: "Active tokens" }), tokens === null && error === "" && a$1("p", { children: "Loading API tokens\u2026" }), tokens !== null && tokens.length === 0 && a$1("p", { children: "No API tokens yet." }), tokens !== null && tokens.length > 0 && a$1("table", { children: [a$1("thead", { children: a$1("tr", { children: [a$1("th", { children: "Description" }), a$1("th", { children: "Created" }), a$1("th", { children: "Last used" }), a$1("th", {})] }) }), a$1("tbody", { children: tokens.map((token) => a$1("tr", { children: [a$1("td", { children: token.Description }), a$1("td", { children: formatTimestamp(token.Created) }), a$1("td", { children: token.LastUsed === null ? "Never" : formatTimestamp(token.LastUsed) }), a$1("td", { children: a$1("button", { type: "button", class: "danger", onClick: () => revokeToken(token), children: "Revoke" }) })] }, token.APITokenID)) })] })] })] });
}
function currentPage() {
    return window.location.hash === "#/user" ? "user" : "dashboard";
}
function errorMessage(error) {
    return isRequestError(error) ? error.ctx.responseText : "Unable to complete that request.";
}
function formatTimestamp(value) {
    return new Date(value).toLocaleString();
}
async function copy(value, setCopied) {
    try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
    }
    catch (error) {
        console.error(error);
    }
}

const defaultOptions = {
    title: "Build",
    text: "passing",
    color: "#00aa55",
};
function StaticBadgeGenerator({ env }) {
    const [options, setOptions] = d(defaultOptions);
    const [previewOptions, setPreviewOptions] = d(defaultOptions);
    A(() => {
        const updateTimeout = window.setTimeout(() => setPreviewOptions(options), 400);
        return () => window.clearTimeout(updateTimeout);
    }, [options]);
    const badgeURL = staticBadgeURL(env, options);
    const previewURL = staticBadgeURL(env, previewOptions);
    const markdown = `![${markdownAlt(options.title)}](${badgeURL})`;
    return a$1("div", { class: "static-badge-generator--controller", children: [a$1("form", { onSubmit: (event) => event.preventDefault(), children: a$1("section", { class: "main-inputs", children: [a$1(Input, { label: "Title", name: "title", value: options.title, onInput: (event) => setOptions((current) => ({ ...current, title: event.currentTarget.value })) }), a$1(Input, { label: "Text", name: "text", value: options.text, onInput: (event) => setOptions((current) => ({ ...current, text: event.currentTarget.value })) }), a$1(Input, { label: "Color", name: "color", type: "color", value: options.color, title: "Must be a hex color code", onInput: (event) => setOptions((current) => ({ ...current, color: event.currentTarget.value })) })] }) }), a$1("section", { class: "shield-container", children: a$1("img", { src: previewURL, alt: [options.title, options.text].filter(Boolean).join(": ") || "Static badge" }) }), a$1("section", { class: "fancy-inputs", children: a$1(CopyableInput, { label: "Markdown", value: markdown }) })] });
}
function mountStaticBadgeGenerator(elm, env) {
    K(a$1(StaticBadgeGenerator, { env: env }), elm);
}
function staticBadgeURL(env, options) {
    const params = new URLSearchParams({
        title: options.title,
        text: options.text,
        color: options.color.replace(/^#/, ""),
    });
    return `https://${env.ImgHost}/s?${params}`;
}
function markdownAlt(title) {
    return (title || "Badge").replace(/[\\[\]]/g, "\\$&");
}

async function Home(apiExampleElm, staticBadgeGeneratorElm) {
    const envApi = new EnvApi();
    const env = await envApi.getEnv();
    mountApiExamples(apiExampleElm, env);
    mountStaticBadgeGenerator(staticBadgeGeneratorElm, env);
}

export { Dashboard, Home };
