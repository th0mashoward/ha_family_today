"use strict";(()=>{var W=globalThis,Y=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,st=Symbol(),gt=new WeakMap,N=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==st)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Y&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=gt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&gt.set(e,t))}return t}toString(){return this.cssText}},vt=i=>new N(typeof i=="string"?i:i+"",void 0,st),D=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,o,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[n+1],i[0]);return new N(e,i,st)},bt=(i,t)=>{if(Y)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),o=W.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}},ot=Y?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return vt(e)})(i):i;var{is:qt,defineProperty:Jt,getOwnPropertyDescriptor:Xt,getOwnPropertyNames:Zt,getOwnPropertySymbols:Gt,getPrototypeOf:Qt}=Object,V=globalThis,$t=V.trustedTypes,te=$t?$t.emptyScript:"",ee=V.reactiveElementPolyfillSupport,O=(i,t)=>i,it={toAttribute(i,t){switch(t){case Boolean:i=i?te:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},wt=(i,t)=>!qt(i,t),xt={attribute:!0,type:String,converter:it,reflect:!1,useDefault:!1,hasChanged:wt};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=xt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&Jt(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){let{get:o,set:n}=Xt(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:o,set(a){let h=o?.call(this);n?.call(this,a),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??xt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=Qt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Zt(e),...Gt(e)];for(let o of s)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let o of s)e.unshift(ot(o))}else t!==void 0&&e.push(ot(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:it).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let n=s.getPropertyOptions(o),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:it;this._$Em=o;let h=a.fromAttribute(e,n.type);this[o]=h??this._$Ej?.get(o)??h,this._$Em=null}}requestUpdate(t,e,s,o=!1,n){if(t!==void 0){let a=this.constructor;if(o===!1&&(n=this[t]),s??=a.getPropertyOptions(t),!((s.hasChanged??wt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:n},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),n!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,n]of s){let{wrapped:a}=n,h=this[o];a!==!0||this._$AL.has(o)||h===void 0||this.C(o,void 0,n,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[O("elementProperties")]=new Map,$[O("finalized")]=new Map,ee?.({ReactiveElement:$}),(V.reactiveElementVersions??=[]).push("2.1.2");var ht=globalThis,At=i=>i,q=ht.trustedTypes,Et=q?q.createPolicy("lit-html",{createHTML:i=>i}):void 0,Pt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Nt="?"+x,se=`<${Nt}>`,k=document,M=()=>k.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",pt=Array.isArray,oe=i=>pt(i)||typeof i?.[Symbol.iterator]=="function",nt=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,St=/-->/g,kt=/>/g,E=RegExp(`>|${nt}(?:([^\\s"'>=/]+)(${nt}*=${nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,Tt=/"/g,Dt=/^(?:script|style|textarea|title)$/i,ut=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),r=ut(1),ge=ut(2),ve=ut(3),g=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Rt=new WeakMap,S=k.createTreeWalker(k,129);function Ot(i,t){if(!pt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Et!==void 0?Et.createHTML(t):t}var ie=(i,t)=>{let e=i.length-1,s=[],o,n=t===2?"<svg>":t===3?"<math>":"",a=L;for(let h=0;h<e;h++){let l=i[h],u,m,p=-1,_=0;for(;_<l.length&&(a.lastIndex=_,m=a.exec(l),m!==null);)_=a.lastIndex,a===L?m[1]==="!--"?a=St:m[1]!==void 0?a=kt:m[2]!==void 0?(Dt.test(m[2])&&(o=RegExp("</"+m[2],"g")),a=E):m[3]!==void 0&&(a=E):a===E?m[0]===">"?(a=o??L,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?E:m[3]==='"'?Tt:Ct):a===Tt||a===Ct?a=E:a===St||a===kt?a=L:(a=E,o=void 0);let y=a===E&&i[h+1].startsWith("/>")?" ":"";n+=a===L?l+se:p>=0?(s.push(u),l.slice(0,p)+Pt+l.slice(p)+x+y):l+x+(p===-2?h:y)}return[Ot(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class i{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let n=0,a=0,h=t.length-1,l=this.parts,[u,m]=ie(t,e);if(this.el=i.createElement(u,s),S.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=S.nextNode())!==null&&l.length<h;){if(o.nodeType===1){if(o.hasAttributes())for(let p of o.getAttributeNames())if(p.endsWith(Pt)){let _=m[a++],y=o.getAttribute(p).split(x),K=/([.?@])?(.*)/.exec(_);l.push({type:1,index:n,name:K[2],strings:y,ctor:K[1]==="."?rt:K[1]==="?"?lt:K[1]==="@"?ct:T}),o.removeAttribute(p)}else p.startsWith(x)&&(l.push({type:6,index:n}),o.removeAttribute(p));if(Dt.test(o.tagName)){let p=o.textContent.split(x),_=p.length-1;if(_>0){o.textContent=q?q.emptyScript:"";for(let y=0;y<_;y++)o.append(p[y],M()),S.nextNode(),l.push({type:2,index:++n});o.append(p[_],M())}}}else if(o.nodeType===8)if(o.data===Nt)l.push({type:2,index:n});else{let p=-1;for(;(p=o.data.indexOf(x,p+1))!==-1;)l.push({type:7,index:n}),p+=x.length-1}n++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function C(i,t,e=i,s){if(t===g)return t;let o=s!==void 0?e._$Co?.[s]:e._$Cl,n=H(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),n===void 0?o=void 0:(o=new n(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=o:e._$Cl=o),o!==void 0&&(t=C(i,o._$AS(i,t.values),o,s)),t}var at=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??k).importNode(e,!0);S.currentNode=o;let n=S.nextNode(),a=0,h=0,l=s[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new z(n,n.nextSibling,this,t):l.type===1?u=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(u=new dt(n,this,t)),this._$AV.push(u),l=s[++h]}a!==l?.index&&(n=S.nextNode(),a++)}return S.currentNode=k,o}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},z=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),H(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==g&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):oe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(Ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{let n=new at(o,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=Rt.get(t.strings);return e===void 0&&Rt.set(t.strings,e=new U(t)),e}k(t){pt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,o=0;for(let n of t)o===e.length?e.push(s=new i(this.O(M()),this.O(M()),this,this.options)):s=e[o],s._$AI(n),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=At(t).nextSibling;At(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,o){let n=this.strings,a=!1;if(n===void 0)t=C(this,t,e,0),a=!H(t)||t!==this._$AH&&t!==g,a&&(this._$AH=t);else{let h=t,l,u;for(t=n[0],l=0;l<n.length-1;l++)u=C(this,h[s+l],e,l),u===g&&(u=this._$AH[l]),a||=!H(u)||u!==this._$AH[l],u===d?t=d:t!==d&&(t+=(u??"")+n[l+1]),this._$AH[l]=u}a&&!o&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},rt=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},lt=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},ct=class extends T{constructor(t,e,s,o,n){super(t,e,s,o,n),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??d)===g)return;let s=this._$AH,o=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==d&&(s===d||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},dt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var ne=ht.litHtmlPolyfillSupport;ne?.(U,z),(ht.litHtmlVersions??=[]).push("3.3.3");var Lt=(i,t,e)=>{let s=e?.renderBefore??t,o=s._$litPart$;if(o===void 0){let n=e?.renderBefore??null;s._$litPart$=o=new z(t.insertBefore(M(),n),n,void 0,e??{})}return o._$AI(i),o};var mt=globalThis,f=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Lt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return g}};f._$litElement$=!0,f.finalized=!0,mt.litElementHydrateSupport?.({LitElement:f});var ae=mt.litElementPolyfillSupport;ae?.({LitElement:f});(mt.litElementVersions??=[]).push("4.2.2");var J={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},X=i=>(...t)=>({_$litDirective$:i,values:t}),R=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var w=X(class extends R{constructor(i){if(super(i),i.type!==J.ATTRIBUTE||i.name!=="class"||i.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter(t=>i[t]).join(" ")+" "}update(i,[t]){if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(let s in t)t[s]&&!this.nt?.has(s)&&this.st.add(s);return this.render(t)}let e=i.element.classList;for(let s of this.st)s in t||(e.remove(s),this.st.delete(s));for(let s in t){let o=!!t[s];o===this.st.has(s)||this.nt?.has(s)||(o?(e.add(s),this.st.add(s)):(e.remove(s),this.st.delete(s)))}return g}});var Mt="important",re=" !"+Mt,v=X(class extends R{constructor(i){if(super(i),i.type!==J.ATTRIBUTE||i.name!=="style"||i.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let s=i[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let o=t[s];if(o!=null){this.ft.add(s);let n=typeof o=="string"&&o.endsWith(re);s.includes("-")||n?e.setProperty(s,n?o.slice(0,-11):o,n?Mt:""):e[s]=o}}return g}});var A="sensor.family_today_today",zt="sensor.family_today_next_bin_collection",Ht=["#4285f4","#e8710a","#0f9d58","#a142f4","#d93025","#12b5cb","#f9ab00","#e52592"];function G(i,t){if(t?.[i])return t[i];let e=0;for(let s of i)e=e*31+s.charCodeAt(0)>>>0;return Ht[e%Ht.length]}var le={grey:"#9ca3af",gray:"#9ca3af",black:"#6b7280",white:"#e5e7eb",blue:"#3b82f6",green:"#22c55e",brown:"#a16207",red:"#ef4444",yellow:"#eab308",orange:"#f97316",purple:"#a855f7",pink:"#ec4899"},Ft="mdi:delete";function It(i){let t=i?.trim();if(t)return le[t.toLowerCase()]??t}function ft(i,t){if(i.all_day)return"all-day";let e=Date.parse(i.start);return Date.parse(i.end)<=t?"past":e<=t?"now":"upcoming"}function I(i){return i.locale?.language??i.language??"en"}var Bt="family_today",jt="common",ce=`component.${Bt}.${jt}.`,Z=new Map,_t=new Map;function Q(i){if(!i)return;let t=I(i);if(Z.has(t))return;let e=_t.get(t);if(e)return e;let s=i.loadBackendTranslation;if(typeof s!="function")return;let o=s.call(i,jt,Bt).then(n=>{Z.set(t,typeof n=="function"?n:void 0)}).catch(()=>{Z.set(t,void 0)}).finally(()=>{_t.delete(t)});return _t.set(t,o),o}function c(i,t,e){let o=(i?Z.get(I(i)):void 0)??i?.localize;if(typeof o!="function")return e;let n=o(`${ce}${t}`);return typeof n=="string"&&n.trim()?n:e}function Ut(i,t){let s=(i.locale?.time_format??"24")==="12";return new Date(t).toLocaleTimeString(I(i),{hour:"numeric",minute:"2-digit",hour12:s})}function yt(i,t){return t.all_day?"All day":`${Ut(i,t.start)} \u2013 ${Ut(i,t.end)}`}function Kt(i,t){let e=new Date(t.start);if(!t.all_day)return`${F(i,e.getTime())} \xB7 ${yt(i,t)}`;let s=new Date(t.end),o=new Date(s.getFullYear(),s.getMonth(),s.getDate()-1),n=e.getFullYear()===o.getFullYear()&&e.getMonth()===o.getMonth()&&e.getDate()===o.getDate(),a=F(i,e.getTime());return n?`All day \xB7 ${a}`:`All day \xB7 ${a} \u2013 ${F(i,o.getTime())}`}function F(i,t){return new Date(t).toLocaleDateString(I(i),{weekday:"long",day:"numeric",month:"long"})}function b(i,t){let[e,s,o]=t.split("-").map(Number);return new Date(e,s-1,o).toLocaleDateString(I(i),{weekday:"short",day:"numeric",month:"short"})}function Wt(i){let t=Math.max(0,Math.round(i/6e4));if(t<1)return"now";if(t<60)return`in ${t} min`;let e=Math.floor(t/60),s=t%60;return s?`in ${e}h ${s}m`:`in ${e}h`}function P(i){return i==null?"":i<=0?"today":i===1?"tomorrow":`in ${i} days`}function Yt(i){return{type:"custom:family-today-card",layout:"list",show_all_day:!0,show_bins:!0,show_school:!0,show_next_bin:!0,hide_past:!1,...i}}var de=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"list",label:"Chronological list"},{value:"lanes",label:"Lane per person"}]}}},{type:"grid",name:"",schema:[{name:"show_school",selector:{boolean:{}}},{name:"show_bins",selector:{boolean:{}}},{name:"show_next_bin",selector:{boolean:{}}},{name:"show_all_day",selector:{boolean:{}}},{name:"hide_past",selector:{boolean:{}}}]}],he={entity:"Family Today sensor",title:"Title (optional, defaults to today's date)",layout:"Layout",show_school:"Show school day badge",show_bins:"Show bin banners",show_next_bin:"Show next bin collection",show_all_day:"Show all-day events",hide_past:"Hide events that have finished"},tt=class extends f{setConfig(t){this._config=t}render(){return this._config?r`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${de}
        .computeLabel=${t=>he[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:r``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};tt.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-card-editor",tt);var B=class extends f{constructor(){super();this._onKeyDown=e=>{e.key==="Escape"&&(this._selected=null,this._schoolOpen=!1,this._schoolPerson=null)};this._now=Date.now(),this._selected=null,this._schoolOpen=!1,this._schoolPerson=null}setConfig(e){if(e.layout&&!["list","lanes"].includes(e.layout))throw new Error("layout must be 'list' or 'lanes'");this._config=Yt(e)}getCardSize(){let e=this._attrs();return 2+Math.min(e?.agenda.length??0,8)}static getStubConfig(){return{entity:A}}static getConfigElement(){return document.createElement("family-today-card-editor")}connectedCallback(){super.connectedCallback(),this._now=Date.now(),this._timer=window.setInterval(()=>this._now=Date.now(),3e4),window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer),window.removeEventListener("keydown",this._onKeyDown)}_openEvent(e){this._selected=e}_closeEvent(){this._selected=null}_openSchool(e=null){this._schoolPerson=e,this._schoolOpen=!0}_closeSchool(){this._schoolOpen=!1,this._schoolPerson=null}_schoolKey(e,s=null){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openSchool(s))}_eventKey(e,s){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openEvent(s))}_entity(){let e=this.hass?.states??{},s=this._config.entity??A;if(e[s])return{id:s,ent:e[s]};if(!this._config.entity){for(let[o,n]of Object.entries(e))if(o.startsWith("sensor.")&&Array.isArray(n.attributes?.agenda)&&"by_person"in n.attributes)return{id:o,ent:n}}return null}_attrs(){return this._config?this._entity()?.ent.attributes??null:null}_color(e){return G(e,this._config.colors)}_moreInfo(){let e=this._entity()?.id;e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return d;let e=Q(this.hass);e&&e.then(()=>this.requestUpdate());let s=this._entity();if(!s)return r`<ha-card>
        <div class="empty">
          ${c(this.hass,"family_today_sensor_not_found","Family Today sensor not found")}
          (<code>${this._config.entity??A}</code>).
        </div>
      </ha-card>`;let o=s.ent.attributes,n=this._config;return r`
      <ha-card @click=${this._moreInfo}>
        ${this._header(o)} ${this._banners(o)} ${this._next(o)}
        ${n.layout==="lanes"?this._lanes(o):this._list(o)}
      </ha-card>
      ${this._selected?this._eventDialog(this._selected):d}
      ${this._schoolOpen?this._schoolDialog(o):d}
    `}_header(e){let s=F(this.hass,this._now),{title:o,show_school:n}=this._config,h=e.school?.reason??e.break_reason??null??(e.school_day?c(this.hass,"family_today_school_day","School day"):c(this.hass,"family_today_no_school","No school")),l=(e.school_overrides?.length??0)>0?Object.entries(e.school_by_person??{}):[];return r`
      <div class="header">
        <div class="titles">
          <div class="title">${o??s}</div>
          ${o?r`<div class="subtitle">${s}</div>`:d}
        </div>
        ${n?l.length?r`<div class="school-chips">
                ${l.map(([u,m])=>this._schoolChip(u,m))}
              </div>`:r`<span
                class=${w({chip:!0,school:e.school_day})}
                role="button"
                tabindex="0"
                title=${h}
                aria-label=${`${c(this.hass,"family_today_show_details","Show details")}, ${h}`}
                @click=${u=>{u.stopPropagation(),this._openSchool()}}
                @keydown=${this._schoolKey}
              >
                <ha-icon
                  icon=${e.school_day?"mdi:school":"mdi:school-outline"}
                ></ha-icon>
                ${e.school_day?c(this.hass,"family_today_school_day","School day"):c(this.hass,"family_today_no_school","No school")}
                <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
              </span>`:d}
      </div>
    `}_schoolChip(e,s){let o=s.is_school_day?c(this.hass,"family_today_school_day","School day"):s.reason||c(this.hass,"family_today_no_school","No school");return r`<span
      class=${w({chip:!0,school:s.is_school_day})}
      role="button"
      tabindex="0"
      title=${o}
      aria-label=${`${e}: ${o}, ${c(this.hass,"family_today_show_details","Show details")}`}
      @click=${n=>{n.stopPropagation(),this._openSchool(e)}}
      @keydown=${n=>this._schoolKey(n,e)}
    >
      <ha-icon
        icon=${s.is_school_day?"mdi:school":"mdi:school-outline"}
      ></ha-icon>
      ${e} · ${o}
      <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
    </span>`}_banners(e){let{show_bins:s,show_next_bin:o}=this._config,n=[],a=this._calendarNotice(e);if(a&&n.push(a),!s)return n.length?r`<div class="banners">${n}</div>`:d;let h=e.bin_meta??{};if(e.bins_today?.length&&n.push(this._banner("mdi:trash-can",c(this.hass,"family_today_bin_day_today","Bin day today"),this._binChips(e.bins_today,h))),e.bins_tomorrow?.length&&n.push(this._banner("mdi:trash-can-outline",c(this.hass,"family_today_bins_out_tonight","Bins out tonight"),this._binChips(e.bins_tomorrow,h))),!n.length&&o){let l=this.hass.states[this._config.bin_entity??zt];if(l&&/^\d{4}-\d{2}-\d{2}$/.test(l.state)){let u=l.attributes.bins??[],m=l.attributes.bin_meta??h,p=l.attributes.days_until,_=p===1?c(this.hass,"family_today_tomorrow","tomorrow"):p!=null?`in ${p} days`:"";n.push(this._banner("mdi:calendar-clock",`${c(this.hass,"family_today_next_bins","Next bins")} \xB7 ${b(this.hass,l.state)}`,r`${u.length?this._binChips(u,m):d}${_?r`<span class="when">(${_})</span>`:d}`,!0))}}return n.length?r`<div class="banners">${n}</div>`:d}_calendarNotice(e){let o=Object.values(e.calendar_status??{}).filter(l=>l.role==="person").filter(l=>!l.ok);if(!o.length)return null;let n=o.map(l=>this._calendarName(l)),a=n.length>1?`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`:n[0],h=o.some(l=>!l.using_cache);return this._banner("mdi:calendar-alert",h?c(this.hass,"family_today_calendar_unavailable","Calendar unavailable"):c(this.hass,"family_today_showing_saved_events","Showing saved events"),h?`Couldn't refresh ${a}`:`${c(this.hass,"family_today_today_events_from","Today's events from")} ${a} ${c(this.hass,"family_today_from_earlier_refresh","are from an earlier refresh")}`,!0)}_calendarName(e){let s=this.hass.states?.[e.entity_id]?.attributes?.friendly_name;return typeof s=="string"&&s?s:e.person||e.entity_id}_binChips(e,s){return r`${e.map(o=>{let n=s?.[o]??{},a=It(n.colour);return r`<span
        class="bin-chip"
        style=${v(a?{"--bin-color":a}:{})}
        ><ha-icon icon=${n.icon||Ft}></ha-icon>${o}</span
      >`})}`}_banner(e,s,o,n=!1){return r`<div class=${w({banner:!0,muted:n})}>
      <ha-icon icon=${e}></ha-icon>
      <span class="label">${s}</span>
      <span class="text">${o}</span>
    </div>`}_next(e){let s=e.next_event;if(!s)return d;let o=Date.parse(s.start)-this._now;return o<=0?d:r`<div
      class="next"
      role="button"
      tabindex="0"
      aria-label=${`${c(this.hass,"family_today_details_for","Details for")} ${s.summary}`}
      @click=${n=>{n.stopPropagation(),this._openEvent(s)}}
      @keydown=${n=>this._eventKey(n,s)}
    >
      <span class="dot" style=${v({background:this._color(s.person)})}></span>
      <span class="next-text"><strong>${c(this.hass,"family_today_next","Next")}</strong>: ${s.summary}</span>
      <span class="next-when">${Wt(o)}</span>
    </div>`}_visible(e){return this._config.hide_past?e.filter(s=>ft(s,this._now)!=="past"):e}_list(e){let s=this._visible(e.agenda??[]),o=s.filter(a=>a.all_day),n=s.filter(a=>!a.all_day);return s.length?r`
      ${this._config.show_all_day&&o.length?r`<div class="allday">
            ${o.map(a=>r`<span
                class="allday-chip"
                style=${v({"--person-color":this._color(a.person)})}
                role="button"
                tabindex="0"
                aria-label=${`${c(this.hass,"family_today_details_for","Details for")} ${a.summary}`}
                @click=${h=>{h.stopPropagation(),this._openEvent(a)}}
                @keydown=${h=>this._eventKey(h,a)}
                >${a.summary}</span
              >`)}
          </div>`:d}
      <div class="events">${n.map(a=>this._eventRow(a))}</div>
    `:r`<div class="empty">${c(this.hass,"family_today_nothing_scheduled_today","Nothing scheduled today")}</div>`}_lanes(e){let s=e.people?.length?e.people:Object.keys(e.by_person??{});return s.length?r`<div class="lanes">
      ${s.map(o=>{let n=this._visible(e.by_person?.[o]??[]);return r`<div class="lane" style=${v({"--person-color":this._color(o)})}>
          <div class="lane-head"><span class="dot"></span>${o}</div>
          ${n.length?n.map(a=>this._eventRow(a)):r`<div class="lane-empty">${c(this.hass,"family_today_nothing_on","Nothing on")}</div>`}
        </div>`})}
    </div>`:r`<div class="empty">${c(this.hass,"family_today_nothing_scheduled_today","Nothing scheduled today")}</div>`}_eventRow(e){let s=ft(e,this._now);return r`<div
      class=${w({event:!0,past:s==="past",now:s==="now"})}
      style=${v({"--person-color":this._color(e.person)})}
      role="button"
      tabindex="0"
      aria-label=${`${c(this.hass,"family_today_details_for","Details for")} ${e.summary}`}
      @click=${o=>{o.stopPropagation(),this._openEvent(e)}}
      @keydown=${o=>this._eventKey(o,e)}
    >
      <div class="time">${yt(this.hass,e)}</div>
      <div class="body">
        <div class="summary">${e.summary}</div>
        ${e.location?r`<div class="meta"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.location}</div>`:d}
      </div>
    </div>`}_schoolDialog(e){let s=this._schoolPerson,o=(s?e.school_by_person?.[s]:null)??e.school,n=o?.is_school_day??e.school_day,a=o?.reason??e.break_reason??null,h=o?.term??e.term,l=n?c(this.hass,"family_today_school_day","School day"):a||c(this.hass,"family_today_no_school","No school"),u=[s,h].filter(Boolean).join(" \xB7 "),m=(_,y)=>[_?b(this.hass,_):"",y!=null?P(y):""].filter(Boolean).join(" \xB7 "),p=[];return n?(o?.term_end&&p.push(this._detail("mdi:calendar-end",c(this.hass,"family_today_term_ends","Term ends"),m(o.term_end,o.days_until_term_end))),o?.next_break&&o.next_break_start&&(o.days_until_term_end==null||(o.days_until_next_break??1/0)<o.days_until_term_end)&&p.push(this._detail("mdi:beach",c(this.hass,"family_today_next_break","Next break"),`${o.next_break} \xB7 ${m(o.next_break_start,o.days_until_next_break)}`))):o&&(o.back_to_school&&p.push(this._detail("mdi:school",c(this.hass,"family_today_back_to_school","Back to school"),m(o.back_to_school,o.days_until_school))),o.next_term&&o.next_term_start&&o.next_term_start!==o.back_to_school&&p.push(this._detail("mdi:calendar-start",c(this.hass,"family_today_next_term","Next term"),`${o.next_term} \xB7 ${m(o.next_term_start,o.days_until_next_term)}`)),o.term_end&&p.push(this._detail("mdi:calendar-end",c(this.hass,"family_today_term_ends","Term ends"),m(o.term_end,o.days_until_term_end)))),p.length||p.push(r`<div class="detail muted-row">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span>${c(this.hass,"family_today_no_term_dates_configured","No term dates configured.")}</span>
        </div>`),r`<div
      class="overlay"
      @click=${_=>{_.stopPropagation(),this._closeSchool()}}
    >
      <div
        class="dialog school-dialog"
        role="dialog"
        aria-modal="true"
        aria-label=${s?`${s}: ${l}`:l}
        @click=${_=>_.stopPropagation()}
      >
        <div class="dialog-head">
          <div>
            <div class="dialog-title">${l}</div>
            ${u?r`<div class="dialog-sub">${u}</div>`:d}
          </div>
          <button class="close" aria-label=${c(this.hass,"family_today_close","Close")} @click=${this._closeSchool}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">${p}</div>
      </div>
    </div>`}_detail(e,s,o){return r`<div class="detail">
      <ha-icon icon=${e}></ha-icon>
      <span class="detail-label">${s}</span>
      <span class="detail-value">${o}</span>
    </div>`}_eventDialog(e){return r`<div
      class="overlay"
      @click=${s=>{s.stopPropagation(),this._closeEvent()}}
    >
      <div
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-label=${e.summary}
        @click=${s=>s.stopPropagation()}
      >
        <div class="dialog-head">
          <div>
            <div class="dialog-title">${e.summary}</div>
            <div class="dialog-sub">${Kt(this.hass,e)}</div>
          </div>
          <button class="close" aria-label=${c(this.hass,"family_today_close","Close")} @click=${this._closeEvent}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">
          ${e.location?r`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${e.location}</span>
              </div>`:d}
          <div class="detail">
            <span class="dot" style=${v({background:this._color(e.person)})}></span>
            <span>${e.person}</span>
          </div>
          ${e.description?r`<div class="description">${e.description}</div>`:d}
        </div>
      </div>
    </div>`}};B.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0},_selected:{state:!0},_schoolOpen:{state:!0},_schoolPerson:{state:!0}},B.styles=D`
    ha-card { padding: 16px; cursor: pointer; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
    .title { font-size: 1.3em; font-weight: 500; color: var(--primary-text-color); }
    .subtitle { color: var(--secondary-text-color); font-size: 0.9em; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px;
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em; white-space: nowrap;
      cursor: pointer; user-select: none; }
    .chip:hover { filter: brightness(0.96); }
    .chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip .more { --mdc-icon-size: 16px; margin-left: -2px; opacity: 0.6; }
    .school-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
    .school-chips .chip { max-width: 100%; }
    .chip.school { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15); color: var(--primary-color); }
    .banners { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .banner { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-text-color); }
    .banner.muted { background: var(--secondary-background-color); color: var(--secondary-text-color); }
    .banner ha-icon { --mdc-icon-size: 20px; flex: none; }
    .banner .label { font-weight: 500; }
    .banner .text { margin-left: auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: center;
      justify-content: flex-end; gap: 4px 6px; text-align: right; }
    .banner .when { color: var(--secondary-text-color); font-size: 0.9em; white-space: nowrap; }
    .bin-chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px 1px 5px; white-space: nowrap;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); border-radius: 999px;
      background: var(--secondary-background-color); color: var(--primary-text-color); font-size: 0.9em; }
    .bin-chip ha-icon { --mdc-icon-size: 16px; color: var(--bin-color, var(--secondary-text-color)); }
    .next { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; cursor: pointer;
      border-radius: 4px; color: var(--primary-text-color); }
    .next:hover { background: var(--secondary-background-color); }
    .next-when { margin-left: auto; color: var(--secondary-text-color); white-space: nowrap; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--person-color, var(--primary-color)); flex: none; }
    .allday { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .allday-chip { padding: 3px 10px; border-radius: 6px; font-size: 0.9em; cursor: pointer;
      border-left: 4px solid var(--person-color); background: var(--secondary-background-color); color: var(--primary-text-color); }
    .events { display: flex; flex-direction: column; gap: 2px; }
    .event { display: flex; align-items: flex-start; gap: 10px; padding: 8px 8px 8px 10px; cursor: pointer;
      border-left: 4px solid var(--person-color); border-radius: 4px; }
    .event:hover { background: var(--secondary-background-color); }
    .event.past { opacity: 0.45; }
    .event.now { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); }
    .event.now:hover { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18); }
    .time { flex: none; min-width: 7.5em; color: var(--secondary-text-color); font-size: 0.9em; padding-top: 1px; }
    .body { flex: 1; min-width: 0; }
    .summary { color: var(--primary-text-color); overflow-wrap: anywhere; }
    .meta { display: flex; align-items: center; gap: 2px; color: var(--secondary-text-color); font-size: 0.85em; }
    .meta ha-icon { --mdc-icon-size: 14px; }
    .lanes { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .lane { min-width: 0; }
    .lane-head { display: flex; align-items: center; gap: 6px; font-weight: 500; margin-bottom: 6px; color: var(--primary-text-color); }
    .lane .event { flex-direction: column; gap: 0; }
    .lane .time { min-width: 0; }
    .lane-empty { color: var(--secondary-text-color); font-size: 0.9em; padding: 4px 0 4px 14px; }
    .empty { color: var(--secondary-text-color); padding: 12px 0; text-align: center; }
    .overlay { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center;
      justify-content: center; padding: 16px; background: rgba(0, 0, 0, 0.45); }
    .dialog { width: min(420px, 100%); max-height: min(80vh, 560px); overflow: auto; padding: 18px 18px 20px;
      border-radius: 16px; color: var(--primary-text-color); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      background: var(--card-background-color, var(--ha-card-background, #fff)); }
    .dialog-head { display: flex; align-items: flex-start; gap: 12px; }
    .dialog-head > div { flex: 1; min-width: 0; }
    .dialog-title { font-size: 1.15em; font-weight: 500; overflow-wrap: anywhere; }
    .dialog-sub { margin-top: 2px; color: var(--secondary-text-color); font-size: 0.9em; }
    .close { flex: none; display: inline-flex; padding: 2px; border: 0; border-radius: 50%; cursor: pointer;
      background: transparent; color: var(--secondary-text-color); }
    .close:hover { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .close ha-icon { --mdc-icon-size: 22px; }
    .dialog-body { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
    .detail { display: flex; align-items: center; gap: 8px; }
    .detail ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: none; }
    .detail-label { color: var(--secondary-text-color); }
    .detail-value { margin-left: auto; min-width: 0; text-align: right; color: var(--primary-text-color);
      overflow-wrap: anywhere; }
    .muted-row { color: var(--secondary-text-color); }
    .description { padding-top: 12px; line-height: 1.4; overflow-wrap: anywhere; white-space: pre-wrap;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); }
  `;customElements.define("family-today-card",B);var pe=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"show_calendar",selector:{boolean:{}}},{name:"max_breaks",selector:{number:{min:1,max:6,mode:"box"}}}],ue={entity:"Family Today sensor",title:"Title (default: School)",show_calendar:"Show link to the full school calendar",max_breaks:"Upcoming breaks to show"},et=class extends f{setConfig(t){this._config=t}render(){return this._config?r`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${pe}
        .computeLabel=${t=>ue[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:r``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};et.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-school-card-editor",et);var Vt=3,j=class extends f{setConfig(t){let e=t.max_breaks;if(e!=null&&(!Number.isInteger(e)||e<1))throw new Error("max_breaks must be a positive whole number");this._config={type:"custom:family-today-school-card",entity:A,max_breaks:Vt,...t}}getCardSize(){return 4}static getStubConfig(){return{entity:A}}static getConfigElement(){return document.createElement("family-today-school-card-editor")}_schoolCalendar(t){for(let e of Object.values(t.calendar_status??{}))if(e.role==="school")return e.entity_id;return null}_openCalendar(t){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config)return r``;let t=Q(this.hass);t&&t.then(()=>this.requestUpdate());let e=this._config.entity??A,s=this.hass.states[e];if(!s)return r`<ha-card>
        <div class="missing">
          ${c(this.hass,"family_today_school_sensor_not_found","Family Today sensor not found")} (<code>${e}</code>).
        </div>
      </ha-card>`;let o=s.attributes,n=this._entries(o),a=n.length===1,h=this._schoolCalendar(o),l=this._config.title??c(this.hass,"family_today_school_school","School");return r`<ha-card>
      <div class="header">
        <div class="title">${l}</div>
        ${a?r`<div class="header-actions">
              ${this._chip(n[0].status)}
              ${this._config.show_calendar&&h?r`<button class="calendar-btn" @click=${()=>this._openCalendar(h)}>
                    <ha-icon icon="mdi:calendar-outline"></ha-icon>
                    ${c(this.hass,"family_today_school_view_calendar","View full calendar")}
                  </button>`:d}
            </div>`:d}
      </div>
      ${n.length?n.map(u=>this._section(u,!a)):r`<div class="empty">${c(this.hass,"family_today_school_no_school_data_yet","No school data yet.")}</div>`}
    </ha-card>`}_entries(t){let e=t.school_by_person??{},s=Object.keys(e);if((t.school_overrides?.length??0)>0&&s.length)return s.map(n=>({person:n,status:e[n]}));let o=t.school??this._legacyStatus(t);return o?[{person:null,status:o}]:[]}_legacyStatus(t){return t.school_day==null?null:{is_school_day:t.school_day,reason:t.break_reason??null,term:t.term??null,term_start:null,term_end:null,days_until_term_end:null,term_school_days:null,term_school_days_done:null,term_progress:null,next_term:null,next_term_start:null,days_until_next_term:null,next_break:null,next_break_start:null,days_until_next_break:null,back_to_school:null,days_until_school:null,upcoming_breaks:[]}}_section(t,e){let{person:s,status:o}=t,n=s?G(s,this._config.colors):"var(--primary-color)";return r`<section class="section">
      ${e?r`<div class="child-head" style=${v({"--person-color":n})}>
            <span class="dot"></span>
            <span class="child-name">${s}</span>
            ${this._chip(o)}
          </div>`:d}
      ${this._term(o)} ${this._facts(o)} ${this._breaks(o)}
    </section>`}_chip(t){let e=t.is_school_day?c(this.hass,"family_today_school_school_day","School day"):t.reason||c(this.hass,"family_today_school_no_school","No school");return r`<span class=${w({chip:!0,school:t.is_school_day})}>
      <ha-icon
        icon=${t.is_school_day?"mdi:school":"mdi:school-outline"}
      ></ha-icon>
      ${e}
    </span>`}_term(t){if(!t.term)return d;let e=t.term_progress??null,s=t.term_end?`${c(this.hass,"family_today_term_ends","Term ends")} ${b(this.hass,t.term_end)}`:"";return r`<div class="term">
      <div class="term-head">
        <span class="term-name">${t.term}</span>
        ${e!=null?r`<span class="term-pct">${e}%</span>`:d}
      </div>
      ${e!=null?r`<div
            class="bar"
            role="progressbar"
            aria-label=${`${t.term} progress`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${e}
          >
            <div class="bar-fill" style=${v({width:`${e}%`})}></div>
          </div>`:d}
      <div class="term-meta">
        ${t.term_school_days!=null&&t.term_school_days_done!=null?r`<span
              >${t.term_school_days_done} of ${t.term_school_days} school
              days</span
            >`:r`<span></span>`}
        ${s?r`<span
              >${s}${t.days_until_term_end===0?" \xB7 today":""}</span
            >`:d}
      </div>
    </div>`}_facts(t){let e=[];if(!t.is_school_day)if(t.back_to_school){let o=!!t.next_term&&!!t.next_term_start&&t.next_term_start===t.back_to_school?`${t.next_term} starts`:c(this.hass,"family_today_school_back_to_school","Back to school");e.push(this._fact("mdi:school",o,`${b(this.hass,t.back_to_school)} \xB7 ${P(t.days_until_school)}`))}else t.next_term&&t.next_term_start&&e.push(this._fact("mdi:calendar-start",c(this.hass,"family_today_school_next_term","Next term"),`${t.next_term} \xB7 ${b(this.hass,t.next_term_start)} \xB7 ${P(t.days_until_next_term)}`));return e.length?r`<div class="facts">${e}</div>`:d}_fact(t,e,s){return r`<div class="fact">
      <ha-icon icon=${t}></ha-icon>
      <span class="fact-label">${e}</span>
      <span class="fact-value">${s}</span>
    </div>`}_breaks(t){let e=Math.max(1,this._config.max_breaks??Vt),s=(t.upcoming_breaks??[]).slice(0,e);return s.length?r`<div class="breaks">
      <div class="breaks-title">${c(this.hass,"family_today_school_upcoming_breaks","Upcoming breaks")}</div>
      ${s.map(o=>this._breakRow(o))}
    </div>`:r`<div class="empty-breaks">
        ${t.term||t.next_term?c(this.hass,"family_today_school_no_school_breaks_in_calendar_yet","No school breaks in the calendar yet."):c(this.hass,"family_today_school_no_term_dates_configured","No term dates configured.")}
      </div>`}_breakRow(t){let e=t.end&&t.end!==t.start?`${b(this.hass,t.start)} \u2013 ${b(this.hass,t.end)}`:b(this.hass,t.start),s=t.kind==="inset";return r`<div class=${w({break:!0,inset:s})}>
      <ha-icon icon=${s?"mdi:book-open":"mdi:beach"}></ha-icon>
      <span class="break-name">${t.name}</span>
      <span class="break-count">${P(t.days_until)}</span>
      <span class="break-when">${e}</span>
    </div>`}};j.properties={hass:{attribute:!1},_config:{state:!0}},j.styles=D`
    :host { display: block; }
    ha-card { padding: 16px; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
    .title { font-size: 1.3em; font-weight: 500; color: var(--primary-text-color); }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px;
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em;
      white-space: nowrap; }
    .header-actions { display: flex; align-items: center; gap: 8px; }
    .calendar-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); background: transparent;
      color: var(--primary-text-color); font-size: 0.9em; cursor: pointer; }
    .calendar-btn ha-icon { --mdc-icon-size: 18px; }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip.school { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15); color: var(--primary-color); }
    .section { margin-top: 12px; }
    .section + .section { margin-top: 12px; padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); }
    .child-head { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
    .child-name { font-weight: 500; color: var(--primary-text-color); }
    .child-head .chip { margin-left: auto; }
    .dot { width: 10px; height: 10px; border-radius: 50%; flex: none;
      background: var(--person-color, var(--primary-color)); }
    .term-head { display: flex; align-items: baseline; gap: 8px; }
    .term-name { font-weight: 500; color: var(--primary-text-color); }
    .term-pct { margin-left: auto; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .bar { height: 8px; margin-top: 8px; border-radius: 999px; overflow: hidden;
      background: var(--secondary-background-color); }
    .bar-fill { height: 100%; border-radius: inherit; background: var(--primary-color); }
    .term-meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 5px;
      color: var(--secondary-text-color); font-size: 0.85em; }
    .facts { margin-top: 10px; }
    .fact { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); }
    .fact ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: none; }
    .fact-label { color: var(--secondary-text-color); }
    .fact-value { margin-left: auto; min-width: 0; text-align: right; overflow-wrap: anywhere; }
    .breaks { margin-top: 12px; }
    .breaks-title { margin-bottom: 4px; color: var(--secondary-text-color); font-size: 0.8em;
      font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase; }
    .break { display: grid; grid-template-columns: 20px minmax(0, 1fr) auto;
      align-items: center; gap: 2px 8px; padding: 6px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08)); }
    .break:last-child { border-bottom: 0; }
    .break ha-icon { --mdc-icon-size: 18px; color: var(--primary-color); grid-row: 1 / span 2; }
    .break.inset ha-icon { color: var(--warning-color, #f59e0b); }
    .break-name { grid-column: 2; grid-row: 1; font-weight: 500; color: var(--primary-text-color);
      overflow-wrap: anywhere; }
    .break-count { grid-column: 3; grid-row: 1; color: var(--secondary-text-color); font-size: 0.85em;
      white-space: nowrap; }
    .break-when { grid-column: 2; grid-row: 2; color: var(--secondary-text-color); font-size: 0.85em; }
    .empty-breaks { padding: 4px 0; color: var(--secondary-text-color); font-size: 0.9em; }
    .empty, .missing { padding: 12px 0; color: var(--secondary-text-color); text-align: center; }
    .missing code { overflow-wrap: anywhere; }
  `;customElements.define("family-today-school-card",j);window.customCards=window.customCards||[];window.customCards.push({type:"family-today-card",name:"Family Today",description:"Today's family agenda, school day and bin collections in one card.",preview:!1});window.customCards.push({type:"family-today-school-card",name:"Family Today School",description:"Term progress and upcoming breaks, with one section per child.",preview:!1});console.info("%c FAMILY-TODAY-CARD %c 0.2.0","color:#fff;background:#4285f4;font-weight:700","");})();
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
