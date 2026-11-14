"use strict";(()=>{var k=globalThis,D=k.ShadowRoot&&(k.ShadyCSS===void 0||k.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),at=new WeakMap,S=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(D&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=at.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&at.set(e,t))}return t}toString(){return this.cssText}},lt=n=>new S(typeof n=="string"?n:n+"",void 0,V),q=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[o+1],n[0]);return new S(e,n,V)},ct=(n,t)=>{if(D)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=k.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Y=D?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return lt(e)})(n):n;var{is:Ot,defineProperty:kt,getOwnPropertyDescriptor:Dt,getOwnPropertyNames:Lt,getOwnPropertySymbols:It,getPrototypeOf:jt}=Object,L=globalThis,ht=L.trustedTypes,zt=ht?ht.emptyScript:"",Bt=L.reactiveElementPolyfillSupport,C=(n,t)=>n,K={toAttribute(n,t){switch(t){case Boolean:n=n?zt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},pt=(n,t)=>!Ot(n,t),dt={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:pt};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=dt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&kt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Dt(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let h=i?.call(this);o?.call(this,r),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??dt}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=jt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,s=[...Lt(e),...It(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Y(i))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:K).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:K;this._$Em=i;let h=r.fromAttribute(e,o.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let r=this.constructor;if(i===!1&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??pt)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),o!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:r}=o,h=this[i];r!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,o,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[C("elementProperties")]=new Map,y[C("finalized")]=new Map,Bt?.({ReactiveElement:y}),(L.reactiveElementVersions??=[]).push("2.1.2");var et=globalThis,ut=n=>n,I=et.trustedTypes,mt=I?I.createPolicy("lit-html",{createHTML:n=>n}):void 0,vt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,bt="?"+$,Ft=`<${bt}>`,x=document,P=()=>x.createComment(""),R=n=>n===null||typeof n!="object"&&typeof n!="function",st=Array.isArray,Wt=n=>st(n)||typeof n?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ft=/-->/g,_t=/>/g,v=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,gt=/"/g,xt=/^(?:script|style|textarea|title)$/i,it=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),d=it(1),ee=it(2),se=it(3),m=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),$t=new WeakMap,b=x.createTreeWalker(x,129);function At(n,t){if(!st(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return mt!==void 0?mt.createHTML(t):t}var Vt=(n,t)=>{let e=n.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",r=T;for(let h=0;h<e;h++){let a=n[h],p,u,c=-1,_=0;for(;_<a.length&&(r.lastIndex=_,u=r.exec(a),u!==null);)_=r.lastIndex,r===T?u[1]==="!--"?r=ft:u[1]!==void 0?r=_t:u[2]!==void 0?(xt.test(u[2])&&(i=RegExp("</"+u[2],"g")),r=v):u[3]!==void 0&&(r=v):r===v?u[0]===">"?(r=i??T,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?v:u[3]==='"'?gt:yt):r===gt||r===yt?r=v:r===ft||r===_t?r=T:(r=v,i=void 0);let g=r===v&&n[h+1].startsWith("/>")?" ":"";o+=r===T?a+Ft:c>=0?(s.push(p),a.slice(0,c)+vt+a.slice(c)+$+g):a+$+(c===-2?h:g)}return[At(n,o+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0,h=t.length-1,a=this.parts,[p,u]=Vt(t,e);if(this.el=n.createElement(p,s),b.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=b.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(vt)){let _=u[r++],g=i.getAttribute(c).split($),O=/([.?@])?(.*)/.exec(_);a.push({type:1,index:o,name:O[2],strings:g,ctor:O[1]==="."?G:O[1]==="?"?Q:O[1]==="@"?X:w}),i.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:o}),i.removeAttribute(c));if(xt.test(i.tagName)){let c=i.textContent.split($),_=c.length-1;if(_>0){i.textContent=I?I.emptyScript:"";for(let g=0;g<_;g++)i.append(c[g],P()),b.nextNode(),a.push({type:2,index:++o});i.append(c[_],P())}}}else if(i.nodeType===8)if(i.data===bt)a.push({type:2,index:o});else{let c=-1;for(;(c=i.data.indexOf($,c+1))!==-1;)a.push({type:7,index:o}),c+=$.length-1}o++}}static createElement(t,e){let s=x.createElement("template");return s.innerHTML=t,s}};function A(n,t,e=n,s){if(t===m)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=R(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=A(n,i._$AS(n,t.values),i,s)),t}var Z=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??x).importNode(e,!0);b.currentNode=i;let o=b.nextNode(),r=0,h=0,a=s[0];for(;a!==void 0;){if(r===a.index){let p;a.type===2?p=new H(o,o.nextSibling,this,t):a.type===1?p=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(p=new tt(o,this,t)),this._$AV.push(p),a=s[++h]}r!==a?.index&&(o=b.nextNode(),r++)}return b.currentNode=x,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},H=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),R(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==m&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(At(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new Z(i,this),r=o.u(this.options);o.p(e),this.T(r),this._$AH=o}}_$AC(t){let e=$t.get(t.strings);return e===void 0&&$t.set(t.strings,e=new U(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new n(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ut(t).nextSibling;ut(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(t,e=this,s,i){let o=this.strings,r=!1;if(o===void 0)t=A(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==m,r&&(this._$AH=t);else{let h=t,a,p;for(t=o[0],a=0;a<o.length-1;a++)p=A(this,h[s+a],e,a),p===m&&(p=this._$AH[a]),r||=!R(p)||p!==this._$AH[a],p===l?t=l:t!==l&&(t+=(p??"")+o[a+1]),this._$AH[a]=p}r&&!i&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},G=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},Q=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},X=class extends w{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??l)===m)return;let s=this._$AH,i=t===l&&s!==l||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==l&&(s===l||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},tt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var qt=et.litHtmlPolyfillSupport;qt?.(U,H),(et.litHtmlVersions??=[]).push("3.3.3");var wt=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new H(t.insertBefore(P(),o),o,void 0,e??{})}return i._$AI(n),i};var nt=globalThis,f=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return m}};f._$litElement$=!0,f.finalized=!0,nt.litElementHydrateSupport?.({LitElement:f});var Yt=nt.litElementPolyfillSupport;Yt?.({LitElement:f});(nt.litElementVersions??=[]).push("4.2.2");var j={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},z=n=>(...t)=>({_$litDirective$:n,values:t}),E=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var B=z(class extends E{constructor(n){if(super(n),n.type!==j.ATTRIBUTE||n.name!=="class"||n.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(n){return" "+Object.keys(n).filter(t=>n[t]).join(" ")+" "}update(n,[t]){if(this.st===void 0){this.st=new Set,n.strings!==void 0&&(this.nt=new Set(n.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(let s in t)t[s]&&!this.nt?.has(s)&&this.st.add(s);return this.render(t)}let e=n.element.classList;for(let s of this.st)s in t||(e.remove(s),this.st.delete(s));for(let s in t){let i=!!t[s];i===this.st.has(s)||this.nt?.has(s)||(i?(e.add(s),this.st.add(s)):(e.remove(s),this.st.delete(s)))}return m}});var Et="important",Kt=" !"+Et,M=z(class extends E{constructor(n){if(super(n),n.type!==j.ATTRIBUTE||n.name!=="style"||n.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(n){return Object.keys(n).reduce((t,e)=>{let s=n[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(n,[t]){let{style:e}=n.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let i=t[s];if(i!=null){this.ft.add(s);let o=typeof i=="string"&&i.endsWith(Kt);s.includes("-")||o?e.setProperty(s,o?i.slice(0,-11):i,o?Et:""):e[s]=i}}return m}});var F="sensor.family_today_today",Tt="sensor.family_today_next_bin_collection",St=["#4285f4","#e8710a","#0f9d58","#a142f4","#d93025","#12b5cb","#f9ab00","#e52592"];function Pt(n,t){if(t?.[n])return t[n];let e=0;for(let s of n)e=e*31+s.charCodeAt(0)>>>0;return St[e%St.length]}function ot(n,t){if(n.all_day)return"all-day";let e=Date.parse(n.start);return Date.parse(n.end)<=t?"past":e<=t?"now":"upcoming"}function rt(n){return n.locale?.language||n.language||"en"}function Ct(n,t){let e=n.locale?.time_format,s=e==="12"?!0:e==="24"?!1:void 0;return new Date(t).toLocaleTimeString(rt(n),{hour:"numeric",minute:"2-digit",hour12:s})}function Rt(n,t){return t.all_day?"All day":`${Ct(n,t.start)} \u2013 ${Ct(n,t.end)}`}function Ut(n,t){return new Date(t).toLocaleDateString(rt(n),{weekday:"long",day:"numeric",month:"long"})}function Ht(n,t){let[e,s,i]=t.split("-").map(Number);return new Date(e,s-1,i).toLocaleDateString(rt(n),{weekday:"short",day:"numeric",month:"short"})}function Mt(n){let t=Math.max(0,Math.round(n/6e4));if(t<1)return"now";if(t<60)return`in ${t} min`;let e=Math.floor(t/60),s=t%60;return s?`in ${e}h ${s}m`:`in ${e}h`}function Nt(n){return{type:"custom:family-today-card",layout:"list",show_all_day:!0,show_bins:!0,show_school:!0,show_next_bin:!0,hide_past:!1,...n}}var Jt=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"list",label:"Chronological list"},{value:"lanes",label:"Lane per person"}]}}},{type:"grid",name:"",schema:[{name:"show_school",selector:{boolean:{}}},{name:"show_bins",selector:{boolean:{}}},{name:"show_next_bin",selector:{boolean:{}}},{name:"show_all_day",selector:{boolean:{}}},{name:"hide_past",selector:{boolean:{}}}]}],Zt={entity:"Family Today sensor",title:"Title (optional, defaults to today's date)",layout:"Layout",show_school:"Show school day badge",show_bins:"Show bin banners",show_next_bin:"Show next bin collection",show_all_day:"Show all-day events",hide_past:"Hide events that have finished"},W=class extends f{setConfig(t){this._config=t}render(){return this._config?d`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Jt}
        .computeLabel=${t=>Zt[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:d``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};W.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-card-editor",W);var N=class extends f{constructor(){super(),this._now=Date.now()}setConfig(t){if(t.layout&&!["list","lanes"].includes(t.layout))throw new Error("layout must be 'list' or 'lanes'");this._config=Nt(t)}getCardSize(){let t=this._attrs();return 2+Math.min(t?.agenda.length??0,8)}static getStubConfig(){return{entity:F}}static getConfigElement(){return document.createElement("family-today-card-editor")}connectedCallback(){super.connectedCallback(),this._now=Date.now(),this._timer=window.setInterval(()=>this._now=Date.now(),3e4)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer)}_entity(){let t=this.hass?.states??{},e=this._config.entity??F;if(t[e])return{id:e,ent:t[e]};if(!this._config.entity){for(let[s,i]of Object.entries(t))if(s.startsWith("sensor.")&&Array.isArray(i.attributes?.agenda)&&"by_person"in i.attributes)return{id:s,ent:i}}return null}_attrs(){return this._config?this._entity()?.ent.attributes??null:null}_color(t){return Pt(t,this._config.colors)}_moreInfo(){let t=this._entity()?.id;t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return l;let t=this._entity();if(!t)return d`<ha-card>
        <div class="empty">
          Family Today sensor not found
          (<code>${this._config.entity??F}</code>).
        </div>
      </ha-card>`;let e=t.ent.attributes,s=this._config;return d`
      <ha-card @click=${this._moreInfo}>
        ${this._header(e)} ${this._banners(e)} ${this._next(e)}
        ${s.layout==="lanes"?this._lanes(e):this._list(e)}
      </ha-card>
    `}_header(t){let e=Ut(this.hass,this._now),{title:s,show_school:i}=this._config;return d`
      <div class="header">
        <div class="titles">
          <div class="title">${s??e}</div>
          ${s?d`<div class="subtitle">${e}</div>`:l}
        </div>
        ${i?d`<span class=${B({chip:!0,school:t.school_day})}>
              <ha-icon icon=${t.school_day?"mdi:school":"mdi:school-outline"}></ha-icon>
              ${t.school_day?"School day":"No school"}
            </span>`:l}
      </div>
    `}_banners(t){let{show_bins:e,show_next_bin:s}=this._config;if(!e)return l;let i=[];if(t.bins_today?.length&&i.push(this._banner("mdi:trash-can","Bin day today",t.bins_today.join(", "))),t.bins_tomorrow?.length&&i.push(this._banner("mdi:trash-can-outline","Bins out tonight",t.bins_tomorrow.join(", "))),!i.length&&s){let o=this.hass.states[this._config.bin_entity??Tt];if(o&&/^\d{4}-\d{2}-\d{2}$/.test(o.state)){let r=o.attributes.bins?.join(", ")??"",h=o.attributes.days_until,a=h===1?"tomorrow":h!=null?`in ${h} days`:"";i.push(this._banner("mdi:calendar-clock",`Next bins \xB7 ${Ht(this.hass,o.state)}`,[r,a&&`(${a})`].filter(Boolean).join(" "),!0))}}return i.length?d`<div class="banners">${i}</div>`:l}_banner(t,e,s,i=!1){return d`<div class=${B({banner:!0,muted:i})}>
      <ha-icon icon=${t}></ha-icon>
      <span class="label">${e}</span>
      <span class="text">${s}</span>
    </div>`}_next(t){let e=t.next_event;if(!e)return l;let s=Date.parse(e.start)-this._now;return s<=0?l:d`<div class="next">
      <span class="dot" style=${M({background:this._color(e.person)})}></span>
      <span class="next-text"><strong>Next:</strong> ${e.summary}</span>
      <span class="next-when">${Mt(s)}</span>
    </div>`}_visible(t){return this._config.hide_past?t.filter(e=>ot(e,this._now)!=="past"):t}_list(t){let e=this._visible(t.agenda??[]),s=e.filter(o=>o.all_day),i=e.filter(o=>!o.all_day);return e.length?d`
      ${this._config.show_all_day&&s.length?d`<div class="allday">
            ${s.map(o=>d`<span
                class="allday-chip"
                style=${M({"--person-color":this._color(o.person)})}
                >${o.summary}</span
              >`)}
          </div>`:l}
      <div class="events">${i.map(o=>this._eventRow(o,!0))}</div>
    `:d`<div class="empty">Nothing scheduled today</div>`}_lanes(t){let e=t.people?.length?t.people:Object.keys(t.by_person??{});return e.length?d`<div class="lanes">
      ${e.map(s=>{let i=this._visible(t.by_person?.[s]??[]);return d`<div class="lane" style=${M({"--person-color":this._color(s)})}>
          <div class="lane-head"><span class="dot"></span>${s}</div>
          ${i.length?i.map(o=>this._eventRow(o,!1)):d`<div class="lane-empty">Nothing on</div>`}
        </div>`})}
    </div>`:d`<div class="empty">Nothing scheduled today</div>`}_eventRow(t,e){let s=ot(t,this._now);return d`<div
      class=${B({event:!0,past:s==="past",now:s==="now"})}
      style=${M({"--person-color":this._color(t.person)})}
    >
      <div class="time">${Rt(this.hass,t)}</div>
      <div class="body">
        <div class="summary">${t.summary}</div>
        ${t.location?d`<div class="meta"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${t.location}</div>`:l}
      </div>
      ${e?d`<span class="person">${t.person}</span>`:l}
    </div>`}};N.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}},N.styles=q`
    ha-card { padding: 16px; cursor: pointer; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
    .title { font-size: 1.3em; font-weight: 500; color: var(--primary-text-color); }
    .subtitle { color: var(--secondary-text-color); font-size: 0.9em; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px;
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em; white-space: nowrap; }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip.school { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15); color: var(--primary-color); }
    .banners { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .banner { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-text-color); }
    .banner.muted { background: var(--secondary-background-color); color: var(--secondary-text-color); }
    .banner ha-icon { --mdc-icon-size: 20px; flex: none; }
    .banner .label { font-weight: 500; }
    .banner .text { margin-left: auto; text-align: right; }
    .next { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: var(--primary-text-color); }
    .next-when { margin-left: auto; color: var(--secondary-text-color); white-space: nowrap; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--person-color, var(--primary-color)); flex: none; }
    .allday { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .allday-chip { padding: 3px 10px; border-radius: 6px; font-size: 0.9em;
      border-left: 4px solid var(--person-color); background: var(--secondary-background-color); color: var(--primary-text-color); }
    .events { display: flex; flex-direction: column; gap: 2px; }
    .event { display: flex; align-items: flex-start; gap: 10px; padding: 8px 8px 8px 10px;
      border-left: 4px solid var(--person-color); border-radius: 4px; }
    .event.past { opacity: 0.45; }
    .event.now { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); }
    .time { flex: none; min-width: 7.5em; color: var(--secondary-text-color); font-size: 0.9em; padding-top: 1px; }
    .body { flex: 1; min-width: 0; }
    .summary { color: var(--primary-text-color); overflow-wrap: anywhere; }
    .meta { display: flex; align-items: center; gap: 2px; color: var(--secondary-text-color); font-size: 0.85em; }
    .meta ha-icon { --mdc-icon-size: 14px; }
    .person { flex: none; font-size: 0.8em; padding: 2px 8px; border-radius: 999px; color: #fff; background: var(--person-color); }
    .lanes { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .lane { min-width: 0; }
    .lane-head { display: flex; align-items: center; gap: 6px; font-weight: 500; margin-bottom: 6px; color: var(--primary-text-color); }
    .lane .event { flex-direction: column; gap: 0; }
    .lane .time { min-width: 0; }
    .lane-empty { color: var(--secondary-text-color); font-size: 0.9em; padding: 4px 0 4px 14px; }
    .empty { color: var(--secondary-text-color); padding: 12px 0; text-align: center; }
  `;customElements.define("family-today-card",N);window.customCards=window.customCards||[];window.customCards.push({type:"family-today-card",name:"Family Today",description:"Today's family agenda, school day and bin collections in one card.",preview:!1});console.info("%c FAMILY-TODAY-CARD %c 0.1.0","color:#fff;background:#4285f4;font-weight:700","");})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
