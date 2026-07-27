var n,l$1,u$2,i$1,r$1,o$1,e$1,f$2,c$1,a$1,s$1,h$1,p$1,v$1,d$1={},w$1=[],_=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,g$1=Array.isArray;function m$1(n,l){for(var u in l)n[u]=l[u];return n}function b(n){n&&n.parentNode&&n.parentNode.removeChild(n);}function k$1(l,u,t){var i,r,o,e={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:e[o]=u[o];if(arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps) void 0===e[o]&&(e[o]=l.defaultProps[o]);return x(l,e,i,r,null)}function x(n,t,i,r,o){var e={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==o?++u$2:o,__i:-1,__u:0};return null==o&&null!=l$1.vnode&&l$1.vnode(e),e}function S(n){return n.children}function C$1(n,l){this.props=n,this.context=l;}function $(n,l){if(null==l)return n.__?$(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?$(n):null}function I(n){if(n.__P&&n.__d){var u=n.__v,t=u.__e,i=[],r=[],o=m$1({},u);o.__v=u.__v+1,l$1.vnode&&l$1.vnode(o),q(n.__P,o,u,n.__n,n.__P.namespaceURI,32&u.__u?[t]:null,i,null==t?$(u):t,!!(32&u.__u),r),o.__v=u.__v,o.__.__k[o.__i]=o,D$1(i,o,r),u.__e=u.__=null,o.__e!=t&&P(o);}}function P(n){if(null!=(n=n.__)&&null!=n.__c)return n.__e=n.__c.base=null,n.__k.some(function(l){if(null!=l&&null!=l.__e)return n.__e=n.__c.base=l.__e}),P(n)}function A$1(n){(!n.__d&&(n.__d=true)&&i$1.push(n)&&!H.__r++||r$1!=l$1.debounceRendering)&&((r$1=l$1.debounceRendering)||o$1)(H);}function H(){try{for(var n,l=1;i$1.length;)i$1.length>l&&i$1.sort(e$1),n=i$1.shift(),l=i$1.length,I(n);}finally{i$1.length=H.__r=0;}}function L(n,l,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,_,g,m=t&&t.__k||w$1,b=l.length;for(f=T$1(u,l,m,f,b),s=0;s<b;s++)null!=(p=u.__k[s])&&(h=-1!=p.__i&&m[p.__i]||d$1,p.__i=s,_=q(n,p,h,i,r,o,e,f,c,a),v=p.__e,p.ref&&h.ref!=p.ref&&(h.ref&&J(h.ref,null,p),a.push(p.ref,p.__c||v,p)),null==y&&null!=v&&(y=v),(g=!!(4&p.__u))||h.__k===p.__k?(f=j$1(p,f,n,g),g&&h.__e&&(h.__e=null)):"function"==typeof p.type&&void 0!==_?f=_:v&&(f=v.nextSibling),p.__u&=-7);return u.__e=y,f}function T$1(n,l,u,t,i){var r,o,e,f,c,a=u.length,s=a,h=0;for(n.__k=new Array(i),r=0;r<i;r++)null!=(o=l[r])&&"boolean"!=typeof o&&"function"!=typeof o?("string"==typeof o||"number"==typeof o||"bigint"==typeof o||o.constructor==String?o=n.__k[r]=x(null,o,null,null,null):g$1(o)?o=n.__k[r]=x(S,{children:o},null,null,null):void 0===o.constructor&&o.__b>0?o=n.__k[r]=x(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):n.__k[r]=o,f=r+h,o.__=n,o.__b=n.__b+1,e=null,-1!=(c=o.__i=O(o,u,f,s))&&(s--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>a?h--:i<a&&h++),"function"!=typeof o.type&&(o.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,o.__u|=4))):n.__k[r]=null;if(s)for(r=0;r<a;r++)null!=(e=u[r])&&0==(2&e.__u)&&(e.__e==t&&(t=$(e)),K(e,e));return t}function j$1(n,l,u,t){var i,r;if("function"==typeof n.type){for(i=n.__k,r=0;i&&r<i.length;r++)i[r]&&(i[r].__=n,l=j$1(i[r],l,u,t));return l}n.__e!=l&&(t&&(l&&n.type&&!l.parentNode&&(l=$(n)),u.insertBefore(n.__e,l||null)),l=n.__e);do{l=l&&l.nextSibling;}while(null!=l&&8==l.nodeType);return l}function O(n,l,u,t){var i,r,o,e=n.key,f=n.type,c=l[u],a=null!=c&&0==(2&c.__u);if(null===c&&null==e||a&&e==c.key&&f==c.type)return u;if(t>(a?1:0))for(i=u-1,r=u+1;i>=0||r<l.length;)if(null!=(c=l[o=i>=0?i--:r++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return o;return  -1}function z$1(n,l,u){"-"==l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||_.test(l)?u:u+"px";}function N(n,l,u,t,i){var r,o;n:if("style"==l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||z$1(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||z$1(n.style,l,u[l]);}else if("o"==l[0]&&"n"==l[1])r=l!=(l=l.replace(s$1,"$1")),o=l.toLowerCase(),l=o in n||"onFocusOut"==l||"onFocusIn"==l?o.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t?u[a$1]=t[a$1]:(u[a$1]=h$1,n.addEventListener(l,r?v$1:p$1,r)):n.removeEventListener(l,r?v$1:p$1,r);else {if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||false===u&&"-"!=l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u));}}function V(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u[c$1])u[c$1]=h$1++;else if(u[c$1]<t[a$1])return;return t(l$1.event?l$1.event(u):u)}}}function q(n,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,d,_,k,x,M,$,I,P,A,H,T,j=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),o=[f=u.__e=t.__e]),(s=l$1.__b)&&s(u);n:if("function"==typeof j){h=e.length;try{if(x=u.props,M=j.prototype&&j.prototype.render,$=(s=j.contextType)&&i[s.__c],I=s?$?$.props.value:s.__:i,t.__c?k=(p=u.__c=t.__c).__=p.__E:(M?u.__c=p=new j(x,I):(u.__c=p=new C$1(x,I),p.constructor=j,p.render=Q),$&&$.sub(p),p.state||(p.state={}),p.__n=i,v=p.__d=!0,p.__h=[],p._sb=[]),M&&null==p.__s&&(p.__s=p.state),M&&null!=j.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=m$1({},p.__s)),m$1(p.__s,j.getDerivedStateFromProps(x,p.__s))),y=p.props,d=p.state,p.__v=u,v)M&&null==j.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),M&&null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else {if(M&&null==j.getDerivedStateFromProps&&x!==y&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(x,I),u.__v==t.__v||!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(x,p.__s,I)){u.__v!=t.__v&&(p.props=x,p.state=p.__s,p.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u);}),w$1.push.apply(p.__h,p._sb),p._sb=[],p.__h.length&&e.push(p);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(x,p.__s,I),M&&null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(y,d,_);});}if(p.context=I,p.props=x,p.__P=n,p.__e=!1,P=l$1.__r,A=0,M)p.state=p.__s,p.__d=!1,P&&P(u),s=p.render(p.props,p.state,p.context),w$1.push.apply(p.__h,p._sb),p._sb=[];else do{p.__d=!1,P&&P(u),s=p.render(p.props,p.state,p.context),p.state=p.__s;}while(p.__d&&++A<25);p.state=p.__s,null!=p.getChildContext&&(i=m$1(m$1({},i),p.getChildContext())),M&&!v&&null!=p.getSnapshotBeforeUpdate&&(_=p.getSnapshotBeforeUpdate(y,d)),H=null!=s&&s.type===S&&null==s.key?E(s.props.children):s,f=L(n,g$1(H)?H:[H],u,t,i,r,o,e,f,c,a),p.base=u.__e,u.__u&=-161,p.__h.length&&e.push(p),k&&(p.__E=p.__=null);}catch(n){if(e.length=h,u.__v=null,c||null!=o){if(n.then){for(u.__u|=c?160:128;f&&8==f.nodeType&&f.nextSibling;)f=f.nextSibling;null!=o&&(o[o.indexOf(f)]=null),u.__e=f;}else if(null!=o)for(T=o.length;T--;)b(o[T]);}else u.__e=t.__e;null==u.__k&&(u.__k=t.__k||[]),n.then||B$1(u),l$1.__e(n,u,t);}}else null==o&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=G(t.__e,u,t,i,r,o,e,c,a);return (s=l$1.diffed)&&s(u),128&u.__u?void 0:f}function B$1(n){n&&(n.__c&&(n.__c.__e=true),n.__k&&n.__k.some(B$1));}function D$1(n,u,t){for(var i=0;i<t.length;i++)J(t[i],t[++i],t[++i]);l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function E(n){return "object"!=typeof n||null==n||n.__b>0?n:g$1(n)?n.map(E):void 0!==n.constructor?null:m$1({},n)}function G(u,t,i,r,o,e,f,c,a){var s,h,p,v,y,w,_,m=i.props||d$1,k=t.props,x=t.type;if("svg"==x?o="http://www.w3.org/2000/svg":"math"==x?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=e)for(s=0;s<e.length;s++)if((y=e[s])&&"setAttribute"in y==!!x&&(x?y.localName==x:3==y.nodeType)){u=y,e[s]=null;break}if(null==u){if(null==x)return document.createTextNode(k);u=document.createElementNS(o,x,k.is&&k),c&&(l$1.__m&&l$1.__m(t,e),c=false),e=null;}if(null==x)m===k||c&&u.data==k||(u.data=k);else {if(e="textarea"==x&&null!=k.defaultValue?null:e&&n.call(u.childNodes),!c&&null!=e)for(m={},s=0;s<u.attributes.length;s++)m[(y=u.attributes[s]).name]=y.value;for(s in m)y=m[s],"dangerouslySetInnerHTML"==s?p=y:"children"==s||s in k||"value"==s&&"defaultValue"in k||"checked"==s&&"defaultChecked"in k||N(u,s,null,y,o);for(s in k)y=k[s],"children"==s?v=y:"dangerouslySetInnerHTML"==s?h=y:"value"==s?w=y:"checked"==s?_=y:c&&"function"!=typeof y||m[s]===y||N(u,s,y,m[s],o);if(h)c||p&&(h.__html==p.__html||h.__html==u.innerHTML)||(u.innerHTML=h.__html),t.__k=[];else if(p&&(u.innerHTML=""),L("template"==t.type?u.content:u,g$1(v)?v:[v],t,i,r,"foreignObject"==x?"http://www.w3.org/1999/xhtml":o,e,f,e?e[0]:i.__k&&$(i,0),c,a),null!=e)for(s=e.length;s--;)b(e[s]);c&&"textarea"!=x||(s="value","progress"==x&&null==w?u.removeAttribute("value"):null!=w&&(w!==u[s]||"progress"==x&&!w||"option"==x&&w!=m[s])&&N(u,s,w,m[s],o),s="checked",null!=_&&_!=u[s]&&N(u,s,_,m[s],o));}return u}function J(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u));}else n.current=u;}catch(n){l$1.__e(n,t);}}function K(n,u,t){var i,r;if(l$1.unmount&&l$1.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||J(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(n){l$1.__e(n,u);}i.base=i.__P=i.__n=null;}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&K(i[r],u,t||"function"!=typeof n.type);t||b(n.__e),n.__c=n.__=n.__e=void 0;}function Q(n,l,u){return this.constructor(n,u)}function R(u,t,i){var r,o,e,f;t==document&&(t=document.documentElement),l$1.__&&l$1.__(u,t),o=(r="function"=="undefined")?null:t.__k,e=[],f=[],q(t,u=(t).__k=k$1(S,null,[u]),o||d$1,d$1,t.namespaceURI,o?null:t.firstChild?n.call(t.childNodes):null,e,o?o.__e:t.firstChild,r,f),D$1(e,u,f),u.props.children=null;}n=w$1.slice,l$1={__e:function(n,l,u,t){for(var i,r,o;l=l.__;)if((i=l.__c)&&!i.__)try{if((r=i.constructor)&&null!=r.getDerivedStateFromError&&(i.setState(r.getDerivedStateFromError(n)),o=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),o=i.__d),o)return i.__E=i}catch(l){n=l;}throw n}},u$2=0,C$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=m$1({},this.state),"function"==typeof n&&(n=n(m$1({},u),this.props)),n&&m$1(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),A$1(this));},C$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=true,n&&this.__h.push(n),A$1(this));},C$1.prototype.render=S,i$1=[],o$1="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,e$1=function(n,l){return n.__v.__b-l.__v.__b},H.__r=0,f$2=Math.random().toString(8),c$1="__d"+f$2,a$1="__a"+f$2,s$1=/(PointerCapture)$|Capture$/i,h$1=0,p$1=V(false),v$1=V(true);

var f$1=0;function u$1(e,t,n,o,i,u){t||(t={});var a,c,p=t;if("ref"in p)for(c in p={},t)"ref"==c?a=t[c]:p[c]=t[c];var l={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--f$1,__i:-1,__u:0,__source:i,__self:u};if("function"==typeof e&&(a=e.defaultProps))for(c in a) void 0===p[c]&&(p[c]=a[c]);return l$1.vnode&&l$1.vnode(l),l}

var t,r,u,i,o=0,f=[],c=l$1,e=c.__b,a=c.__r,v=c.diffed,l=c.__c,m=c.unmount,p=c.__;function s(n,t){c.__h&&c.__h(r,n,o||t),o=0;var u=r.__H||(r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d(n){return o=1,y(D,n)}function y(n,u,i){var o=s(t++,2);if(o.t=n,!o.__c&&(o.__=[D(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r,!r.__f)){var f=function(n,t,r){if(!o.__c.__H)return  true;var u=false,i=o.__c.props!==n;if(o.__c.__H.__.some(function(n){if(n.__N){u=true;var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=true);}}),c){var f=c.call(this,n,t,r);return u?f||i:f}return !u||i};r.__f=true;var c=r.shouldComponentUpdate,e=r.componentWillUpdate;r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r.shouldComponentUpdate=f;}return o.__N||o.__}function h(n,u){var i=s(t++,3);!c.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r.__H.__h.push(i));}function A(n){return o=5,T(function(){return {current:n}},[])}function T(n,r){var u=s(t++,7);return C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function g(){var n=s(t++,11);if(!n.__){for(var u=r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++;}return n.__}function j(){for(var n;n=f.shift();){var t=n.__H;if(n.__P&&t)try{t.__h.some(z),t.__h.some(B),t.__h=[];}catch(r){t.__h=[],c.__e(r,n.__v);}}}c.__b=function(n){r=null,e&&e(n);},c.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),p&&p(n,t);},c.__r=function(n){a&&a(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0;})):(i.__h.some(z),i.__h.some(B),i.__h=[],t=0)),u=r;},c.diffed=function(n){v&&v(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f.push(t)&&i===c.requestAnimationFrame||((i=c.requestAnimationFrame)||w)(j)),t.__H.__.some(function(n){n.u&&(n.__H=n.u,n.u=void 0);})),u=r=null;},c.__c=function(n,t){t.some(function(n){try{n.__h.some(z),n.__h=n.__h.filter(function(n){return !n.__||B(n)});}catch(r){t.some(function(n){n.__h&&(n.__h=[]);}),t=[],c.__e(r,n.__v);}}),l&&l(n,t);},c.unmount=function(n){m&&m(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.some(function(n){try{z(n);}catch(n){t=n;}}),r.__H=void 0,t&&c.__e(t,r.__v));};var k="function"==typeof requestAnimationFrame;function w(n){var t,r=function(){clearTimeout(u),k&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,35);k&&(t=requestAnimationFrame(r));}function z(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t;}function B(n){var t=r;n.__c=n.__(),r=t;}function C(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D(n,t){return "function"==typeof t?t(n):t}

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

class AbstractBaseController {
    constructor(container, name) {
        this.container = container;
        this.name = name;
        this.container.classList.add(`${this.name}--controller`);
    }
    attach(elm) {
        elm.appendChild(this.container);
    }
    detach(elm) {
        try {
            elm.removeChild(this.container);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    getContainer() {
        return this.container;
    }
    getName() {
        return this.name;
    }
}

class ApiExampleController extends AbstractBaseController {
    constructor(env, shield = null) {
        super(document.createElement("div"), "api-example");
        this.env = env;
        this.shield = shield;
        this.preElm = document.createElement('pre');
        this.codeElm = document.createElement('code');
        this.examplesElm = document.createElement('ul');
        this.examples = [
            ['GitHub Action', gitHubActionExample, document.createElement('li')],
            ['Curl', curlExample, document.createElement('li')],
            ['JS', jsExample, document.createElement('li')],
            ['PHP', phpExample, document.createElement('li')],
        ];
        this.container.appendChild(this.examplesElm);
        for (const example of this.examples) {
            this.examplesElm.appendChild(example[2]);
            example[2].textContent = example[0];
            example[2].addEventListener('click', () => this.selectExample(example));
        }
        this.selectExample(this.examples[0]);
        this.container.appendChild(this.preElm);
        this.preElm.appendChild(this.codeElm);
    }
    selectExample(example) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        for (const ex of this.examples) {
            ex[2].classList.remove('selected');
        }
        this.codeElm.textContent = example[1](this.env, (_b = (_a = this.shield) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : 'Shielded.dev', (_d = (_c = this.shield) === null || _c === void 0 ? void 0 : _c.Text) !== null && _d !== void 0 ? _d : 'Rocks', (_f = (_e = this.shield) === null || _e === void 0 ? void 0 : _e.Color) !== null && _f !== void 0 ? _f : '0011aa', (_h = (_g = this.shield) === null || _g === void 0 ? void 0 : _g.Secret) !== null && _h !== void 0 ? _h : '<secret>');
        example[2].classList.add('selected');
    }
}
function curlExample(env, title, text, color, token) {
    return `curl -X "POST" "https://${env.ApiHost}" \\
	-H 'Authorization: token ${addslashes_single_quotes(token)}' \\
	-H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \\
	--data-urlencode 'title=${addslashes_single_quotes(title)}' \\
	--data-urlencode 'text=${addslashes_single_quotes(text)}' \\
	--data-urlencode 'color=${addslashes_single_quotes(color)}'`;
}
function addslashes_single_quotes(str) {
    return `${str}`.replace(/\\/g, '\\$&').replace(/'/g, "\\'");
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
		${JSON.stringify('Authorization: token ' + token)},
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
		'Authorization': ${JSON.stringify('token ' + token)},
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

const shieldKeyPattern = /^[a-z0-9-]{3,64}$/;
const apiExamples = [
    ["GitHub Action", gitHubActionExample],
    ["Curl", curlExample],
    ["JS", jsExample],
    ["PHP", phpExample],
];
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
    R(u$1(DashboardApp, { env: env }), elm);
}
function DashboardApp({ env }) {
    const [page, setPage] = d(currentPage());
    h(() => {
        const updatePage = () => setPage(currentPage());
        window.addEventListener("hashchange", updatePage);
        return () => window.removeEventListener("hashchange", updatePage);
    }, []);
    return u$1(S, { children: [u$1(DashboardNavigation, { page: page }), page === "user" ? u$1(S, { children: [u$1("h3", { children: "User tokens" }), u$1("div", { class: "dashboard--controller", children: u$1(APITokens, {}) })] }) : u$1(S, { children: [u$1("h3", { children: "Dashboard" }), u$1("div", { class: "dashboard--controller", children: u$1(Shields, { env: env }) })] })] });
}
function DashboardNavigation({ page }) {
    return u$1("nav", { class: "dashboard-navigation", "aria-label": "Dashboard navigation", children: [u$1("a", { href: "#/dashboard", "aria-current": page === "dashboard" ? "page" : undefined, children: "Shields" }), u$1("a", { href: "#/user", "aria-current": page === "user" ? "page" : undefined, children: "User tokens" })] });
}
function Shields({ env }) {
    const api = A(new ShieldsApi()).current;
    const [shields, setShields] = d(null);
    const [error, setError] = d("");
    h(() => {
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
    return u$1(S, { children: [u$1("button", { type: "button", class: "add-button primary", onClick: createShield, children: [u$1("span", { class: "icon", children: "\u2795" }), "New shield"] }), error !== "" && u$1("p", { children: error }), shields === null && error === "" && u$1("p", { children: "Loading shields\u2026" }), shields !== null && shields.map((shield) => u$1(ShieldForm, { shield: shield, env: env, onSave: saveShield, onDelete: deleteShield }, shield.ShieldID)), shields !== null && shields.length === 0 && u$1("h4", { class: "no-shields", children: "No shields yet. Click the button to get started." })] });
}
function ShieldForm({ shield, env, onSave, onDelete }) {
    const [draft, setDraft] = d(shield);
    const draftRef = A(draft);
    const saveTimeout = A(null);
    const saveInFlight = A(false);
    const pendingSave = A(null);
    const [imageTick, setImageTick] = d(Date.now());
    const [example, setExample] = d(apiExamples[0]);
    const [markdownCopied, setMarkdownCopied] = d(false);
    const [secretCopied, setSecretCopied] = d(false);
    const [secretVisible, setSecretVisible] = d(false);
    h(() => () => {
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
    const selectedExample = example[1](env, draft.Title, draft.Text, draft.Color, draft.Secret);
    const shieldKeyInvalid = draft.ShieldKey !== undefined && draft.ShieldKey !== "" && !shieldKeyPattern.test(draft.ShieldKey);
    const shieldKeyErrorID = `shield-${draft.ShieldID}-key-error`;
    const markdownInputID = `shield-${draft.ShieldID}-markdown`;
    const secretInputID = `shield-${draft.ShieldID}-secret`;
    return u$1("form", { class: "shield--controller", onInput: handleInput, children: [u$1("section", { class: "name-input", children: [u$1(Input, { label: "Shield Name", name: "Name", value: draft.Name }), u$1(Input, { label: "Shield key", name: "ShieldKey", value: draft.ShieldKey || "", pattern: "[a-z0-9\\\\-]{3,64}", title: "Optional: 3-64 lowercase letters, digits, or hyphens", placeholder: "e.g. production-status", autoComplete: "off", spellcheck: false, "aria-invalid": shieldKeyInvalid, "aria-describedby": shieldKeyInvalid ? shieldKeyErrorID : undefined }), shieldKeyInvalid && u$1("p", { id: shieldKeyErrorID, class: "input-error", role: "alert", children: "Shield key must be 3-64 lowercase letters, digits, or hyphens." })] }), u$1("section", { class: "shield-container", children: u$1("img", { src: `https://${env.ImgHost}/s/${draft.PublicID}?break=${imageTick}`, alt: `${draft.Title}: ${draft.Text}` }) }), u$1("section", { class: "main-inputs", children: [u$1(Input, { label: "Title", name: "Title", value: draft.Title }), u$1(Input, { label: "Text", name: "Text", value: draft.Text }), u$1(Input, { label: "Color", name: "Color", value: `#${draft.Color.replace(/^#/, "")}`, type: "color", title: "Must be a hex color code" })] }), u$1("details", { class: "api-example", children: [u$1("summary", { children: "API Call Examples" }), u$1("div", { class: "api-example--controller", children: [u$1("ul", { children: apiExamples.map((item) => u$1("li", { class: item[0] === example[0] ? "selected" : "", onClick: () => setExample(item), children: item[0] }, item[0])) }), u$1("pre", { children: u$1("code", { children: selectedExample }) })] })] }), u$1("section", { class: "button-container", children: u$1("button", { type: "button", class: "danger", onClick: deleteShield, children: [u$1("span", { class: "icon", children: "\u274C" }), "Delete"] }) }), u$1("section", { class: "fancy-inputs", children: [u$1("label", { for: markdownInputID, children: "Markdown" }), u$1("div", { class: "markdown-input--controller", children: [u$1("input", { id: markdownInputID, value: markdown, readOnly: true, onClick: (event) => event.currentTarget.select() }), u$1("button", { type: "button", onClick: () => copy(markdown, setMarkdownCopied), children: markdownCopied ? "Copied!" : "Copy" })] }), u$1("label", { for: secretInputID, children: "This shield's API token" }), u$1("div", { class: "secret-input--controller", children: [u$1("input", { id: secretInputID, type: secretVisible ? "text" : "password", value: draft.Secret, readOnly: true, onClick: (event) => event.currentTarget.select() }), u$1("button", { type: "button", onClick: () => copy(draft.Secret, setSecretCopied), children: secretCopied ? "Copied!" : "Copy" }), u$1("button", { type: "button", onClick: () => setSecretVisible(!secretVisible), children: secretVisible ? "Hide" : "Reveal" })] })] })] });
}
function Input({ label, ...attributes }) {
    const generatedID = g();
    const id = attributes.id || generatedID;
    return u$1("div", { class: "input-container", children: [u$1("label", { for: id, children: label }), u$1("input", { ...attributes, id: id })] });
}
function APITokens() {
    const api = A(new UserAPITokensApi()).current;
    const [tokens, setTokens] = d(null);
    const [description, setDescription] = d("");
    const [createdToken, setCreatedToken] = d("");
    const [copied, setCopied] = d(false);
    const [error, setError] = d("");
    const [creating, setCreating] = d(false);
    h(() => {
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
    return u$1("section", { class: "api-tokens--controller", children: [u$1("h3", { children: "User API tokens" }), u$1("p", { children: "Create a token to update or create any of your shields through the API." }), u$1("form", { onSubmit: createToken, children: [u$1("label", { for: "api-token-description", children: "Description" }), u$1("input", { id: "api-token-description", name: "description", value: description, onInput: (event) => setDescription(event.currentTarget.value), required: true, maxLength: 255, placeholder: "e.g. production deploy job" }), u$1("button", { type: "submit", class: "primary", disabled: creating, children: "Create token" })] }), error !== "" && u$1("p", { children: error }), createdToken !== "" && u$1("div", { class: "created-api-token", children: [u$1("p", { children: "Copy this token now. It will not be shown again." }), u$1("label", { for: "created-api-token", children: "New API token" }), u$1("input", { id: "created-api-token", value: createdToken, readOnly: true, onClick: (event) => event.currentTarget.select() }), u$1("button", { type: "button", onClick: () => copy(createdToken, setCopied), children: copied ? "Copied!" : "Copy" })] }), u$1("div", { children: [u$1("h4", { children: "Active tokens" }), tokens === null && error === "" && u$1("p", { children: "Loading API tokens\u2026" }), tokens !== null && tokens.length === 0 && u$1("p", { children: "No API tokens yet." }), tokens !== null && tokens.length > 0 && u$1("table", { children: [u$1("thead", { children: u$1("tr", { children: [u$1("th", { children: "Description" }), u$1("th", { children: "Created" }), u$1("th", { children: "Last used" }), u$1("th", {})] }) }), u$1("tbody", { children: tokens.map((token) => u$1("tr", { children: [u$1("td", { children: token.Description }), u$1("td", { children: formatTimestamp(token.Created) }), u$1("td", { children: token.LastUsed === null ? "Never" : formatTimestamp(token.LastUsed) }), u$1("td", { children: u$1("button", { type: "button", class: "danger", onClick: () => revokeToken(token), children: "Revoke" }) })] }, token.APITokenID)) })] })] })] });
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

async function Home(apiExampleElm) {
    const envApi = new EnvApi();
    const env = await envApi.getEnv();
    const apiExample = new ApiExampleController(env);
    apiExample.attach(apiExampleElm);
}

export { Dashboard, Home };
