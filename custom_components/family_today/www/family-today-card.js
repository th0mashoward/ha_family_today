"use strict";(()=>{var K=globalThis,W=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),_t=new WeakMap,N=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(W&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=_t.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&_t.set(e,t))}return t}toString(){return this.cssText}},yt=i=>new N(typeof i=="string"?i:i+"",void 0,Q),D=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,o,a)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[a+1],i[0]);return new N(e,i,Q)},ft=(i,t)=>{if(W)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),o=K.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}},tt=W?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return yt(e)})(i):i;var{is:jt,defineProperty:Kt,getOwnPropertyDescriptor:Wt,getOwnPropertyNames:Yt,getOwnPropertySymbols:Vt,getPrototypeOf:qt}=Object,Y=globalThis,gt=Y.trustedTypes,Jt=gt?gt.emptyScript:"",Zt=Y.reactiveElementPolyfillSupport,O=(i,t)=>i,et={toAttribute(i,t){switch(t){case Boolean:i=i?Jt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},bt=(i,t)=>!jt(i,t),vt={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:bt};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&Kt(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){let{get:o,set:a}=Wt(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){let h=o?.call(this);a?.call(this,r),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vt}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let t=qt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let e=this.properties,s=[...Yt(e),...Vt(e)];for(let o of s)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let o of s)e.unshift(tt(o))}else t!==void 0&&e.push(tt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ft(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:et).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(t,e){let s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let a=s.getPropertyOptions(o),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:et;this._$Em=o;let h=r.fromAttribute(e,a.type);this[o]=h??this._$Ej?.get(o)??h,this._$Em=null}}requestUpdate(t,e,s,o=!1,a){if(t!==void 0){let r=this.constructor;if(o===!1&&(a=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??bt)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:a},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),a!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,a]of s){let{wrapped:r}=a,h=this[o];r!==!0||this._$AL.has(o)||h===void 0||this.C(o,void 0,a,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[O("elementProperties")]=new Map,$[O("finalized")]=new Map,Zt?.({ReactiveElement:$}),(Y.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,$t=i=>i,V=lt.trustedTypes,xt=V?V.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ct="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+x,Xt=`<${Tt}>`,k=document,M=()=>k.createComment(""),L=i=>i===null||typeof i!="object"&&typeof i!="function",ct=Array.isArray,Gt=i=>ct(i)||typeof i?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,At=/>/g,E=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Et=/'/g,St=/"/g,Rt=/^(?:script|style|textarea|title)$/i,dt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),n=dt(1),pe=dt(2),ue=dt(3),g=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),kt=new WeakMap,S=k.createTreeWalker(k,129);function Pt(i,t){if(!ct(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return xt!==void 0?xt.createHTML(t):t}var Qt=(i,t)=>{let e=i.length-1,s=[],o,a=t===2?"<svg>":t===3?"<math>":"",r=H;for(let h=0;h<e;h++){let l=i[h],u,m,p=-1,_=0;for(;_<l.length&&(r.lastIndex=_,m=r.exec(l),m!==null);)_=r.lastIndex,r===H?m[1]==="!--"?r=wt:m[1]!==void 0?r=At:m[2]!==void 0?(Rt.test(m[2])&&(o=RegExp("</"+m[2],"g")),r=E):m[3]!==void 0&&(r=E):r===E?m[0]===">"?(r=o??H,p=-1):m[1]===void 0?p=-2:(p=r.lastIndex-m[2].length,u=m[1],r=m[3]===void 0?E:m[3]==='"'?St:Et):r===St||r===Et?r=E:r===wt||r===At?r=H:(r=E,o=void 0);let f=r===E&&i[h+1].startsWith("/>")?" ":"";a+=r===H?l+Xt:p>=0?(s.push(u),l.slice(0,p)+Ct+l.slice(p)+x+f):l+x+(p===-2?h:f)}return[Pt(i,a+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class i{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let a=0,r=0,h=t.length-1,l=this.parts,[u,m]=Qt(t,e);if(this.el=i.createElement(u,s),S.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=S.nextNode())!==null&&l.length<h;){if(o.nodeType===1){if(o.hasAttributes())for(let p of o.getAttributeNames())if(p.endsWith(Ct)){let _=m[r++],f=o.getAttribute(p).split(x),j=/([.?@])?(.*)/.exec(_);l.push({type:1,index:a,name:j[2],strings:f,ctor:j[1]==="."?it:j[1]==="?"?at:j[1]==="@"?rt:T}),o.removeAttribute(p)}else p.startsWith(x)&&(l.push({type:6,index:a}),o.removeAttribute(p));if(Rt.test(o.tagName)){let p=o.textContent.split(x),_=p.length-1;if(_>0){o.textContent=V?V.emptyScript:"";for(let f=0;f<_;f++)o.append(p[f],M()),S.nextNode(),l.push({type:2,index:++a});o.append(p[_],M())}}}else if(o.nodeType===8)if(o.data===Tt)l.push({type:2,index:a});else{let p=-1;for(;(p=o.data.indexOf(x,p+1))!==-1;)l.push({type:7,index:a}),p+=x.length-1}a++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function C(i,t,e=i,s){if(t===g)return t;let o=s!==void 0?e._$Co?.[s]:e._$Cl,a=L(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),a===void 0?o=void 0:(o=new a(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=o:e._$Cl=o),o!==void 0&&(t=C(i,o._$AS(i,t.values),o,s)),t}var ot=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??k).importNode(e,!0);S.currentNode=o;let a=S.nextNode(),r=0,h=0,l=s[0];for(;l!==void 0;){if(r===l.index){let u;l.type===2?u=new z(a,a.nextSibling,this,t):l.type===1?u=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(u=new nt(a,this,t)),this._$AV.push(u),l=s[++h]}r!==l?.index&&(a=S.nextNode(),r++)}return S.currentNode=k,o}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},z=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),L(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==g&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(Pt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{let a=new ot(o,this),r=a.u(this.options);a.p(e),this.T(r),this._$AH=a}}_$AC(t){let e=kt.get(t.strings);return e===void 0&&kt.set(t.strings,e=new U(t)),e}k(t){ct(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,o=0;for(let a of t)o===e.length?e.push(s=new i(this.O(M()),this.O(M()),this,this.options)):s=e[o],s._$AI(a),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=$t(t).nextSibling;$t(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,o){let a=this.strings,r=!1;if(a===void 0)t=C(this,t,e,0),r=!L(t)||t!==this._$AH&&t!==g,r&&(this._$AH=t);else{let h=t,l,u;for(t=a[0],l=0;l<a.length-1;l++)u=C(this,h[s+l],e,l),u===g&&(u=this._$AH[l]),r||=!L(u)||u!==this._$AH[l],u===d?t=d:t!==d&&(t+=(u??"")+a[l+1]),this._$AH[l]=u}r&&!o&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},it=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},at=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},rt=class extends T{constructor(t,e,s,o,a){super(t,e,s,o,a),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??d)===g)return;let s=this._$AH,o=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==d&&(s===d||o);o&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var te=lt.litHtmlPolyfillSupport;te?.(U,z),(lt.litHtmlVersions??=[]).push("3.3.3");var Nt=(i,t,e)=>{let s=e?.renderBefore??t,o=s._$litPart$;if(o===void 0){let a=e?.renderBefore??null;s._$litPart$=o=new z(t.insertBefore(M(),a),a,void 0,e??{})}return o._$AI(i),o};var ht=globalThis,y=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return g}};y._$litElement$=!0,y.finalized=!0,ht.litElementHydrateSupport?.({LitElement:y});var ee=ht.litElementPolyfillSupport;ee?.({LitElement:y});(ht.litElementVersions??=[]).push("4.2.2");var q={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},J=i=>(...t)=>({_$litDirective$:i,values:t}),R=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var w=J(class extends R{constructor(i){if(super(i),i.type!==q.ATTRIBUTE||i.name!=="class"||i.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter(t=>i[t]).join(" ")+" "}update(i,[t]){if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(let s in t)t[s]&&!this.nt?.has(s)&&this.st.add(s);return this.render(t)}let e=i.element.classList;for(let s of this.st)s in t||(e.remove(s),this.st.delete(s));for(let s in t){let o=!!t[s];o===this.st.has(s)||this.nt?.has(s)||(o?(e.add(s),this.st.add(s)):(e.remove(s),this.st.delete(s)))}return g}});var Dt="important",se=" !"+Dt,v=J(class extends R{constructor(i){if(super(i),i.type!==q.ATTRIBUTE||i.name!=="style"||i.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let s=i[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let o=t[s];if(o!=null){this.ft.add(s);let a=typeof o=="string"&&o.endsWith(se);s.includes("-")||a?e.setProperty(s,a?o.slice(0,-11):o,a?Dt:""):e[s]=o}}return g}});var A="sensor.family_today_today",Mt="sensor.family_today_next_bin_collection",Ot=["#4285f4","#e8710a","#0f9d58","#a142f4","#d93025","#12b5cb","#f9ab00","#e52592"];function Z(i,t){if(t?.[i])return t[i];let e=0;for(let s of i)e=e*31+s.charCodeAt(0)>>>0;return Ot[e%Ot.length]}var oe={grey:"#9ca3af",gray:"#9ca3af",black:"#6b7280",white:"#e5e7eb",blue:"#3b82f6",green:"#22c55e",brown:"#a16207",red:"#ef4444",yellow:"#eab308",orange:"#f97316",purple:"#a855f7",pink:"#ec4899"},Lt="mdi:delete";function Ut(i){let t=i?.trim();if(t)return oe[t.toLowerCase()]??t}function pt(i,t){if(i.all_day)return"all-day";let e=Date.parse(i.start);return Date.parse(i.end)<=t?"past":e<=t?"now":"upcoming"}function ut(i){return i.locale?.language??i.language??"en"}function c(i,t,e){let s=i?.localize;if(typeof s!="function")return e;let o=s(t);return typeof o=="string"&&o.trim()?o:e}function Ht(i,t){let s=(i.locale?.time_format??"24")==="12";return new Date(t).toLocaleTimeString(ut(i),{hour:"numeric",minute:"2-digit",hour12:s})}function mt(i,t){return t.all_day?"All day":`${Ht(i,t.start)} \u2013 ${Ht(i,t.end)}`}function zt(i,t){let e=new Date(t.start);if(!t.all_day)return`${F(i,e.getTime())} \xB7 ${mt(i,t)}`;let s=new Date(t.end),o=new Date(s.getFullYear(),s.getMonth(),s.getDate()-1),a=e.getFullYear()===o.getFullYear()&&e.getMonth()===o.getMonth()&&e.getDate()===o.getDate(),r=F(i,e.getTime());return a?`All day \xB7 ${r}`:`All day \xB7 ${r} \u2013 ${F(i,o.getTime())}`}function F(i,t){return new Date(t).toLocaleDateString(ut(i),{weekday:"long",day:"numeric",month:"long"})}function b(i,t){let[e,s,o]=t.split("-").map(Number);return new Date(e,s-1,o).toLocaleDateString(ut(i),{weekday:"short",day:"numeric",month:"short"})}function Ft(i){let t=Math.max(0,Math.round(i/6e4));if(t<1)return"now";if(t<60)return`in ${t} min`;let e=Math.floor(t/60),s=t%60;return s?`in ${e}h ${s}m`:`in ${e}h`}function P(i){return i==null?"":i<=0?"today":i===1?"tomorrow":`in ${i} days`}function Bt(i){return{type:"custom:family-today-card",layout:"list",show_all_day:!0,show_bins:!0,show_school:!0,show_next_bin:!0,hide_past:!1,...i}}var ie=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"list",label:"Chronological list"},{value:"lanes",label:"Lane per person"}]}}},{type:"grid",name:"",schema:[{name:"show_school",selector:{boolean:{}}},{name:"show_bins",selector:{boolean:{}}},{name:"show_next_bin",selector:{boolean:{}}},{name:"show_all_day",selector:{boolean:{}}},{name:"hide_past",selector:{boolean:{}}}]}],ae={entity:"Family Today sensor",title:"Title (optional, defaults to today's date)",layout:"Layout",show_school:"Show school day badge",show_bins:"Show bin banners",show_next_bin:"Show next bin collection",show_all_day:"Show all-day events",hide_past:"Hide events that have finished"},X=class extends y{setConfig(t){this._config=t}render(){return this._config?n`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ie}
        .computeLabel=${t=>ae[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:n``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};X.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-card-editor",X);var B=class extends y{constructor(){super();this._onKeyDown=e=>{e.key==="Escape"&&(this._selected=null,this._schoolOpen=!1,this._schoolPerson=null)};this._now=Date.now(),this._selected=null,this._schoolOpen=!1,this._schoolPerson=null}setConfig(e){if(e.layout&&!["list","lanes"].includes(e.layout))throw new Error("layout must be 'list' or 'lanes'");this._config=Bt(e)}getCardSize(){let e=this._attrs();return 2+Math.min(e?.agenda.length??0,8)}static getStubConfig(){return{entity:A}}static getConfigElement(){return document.createElement("family-today-card-editor")}connectedCallback(){super.connectedCallback(),this._now=Date.now(),this._timer=window.setInterval(()=>this._now=Date.now(),3e4),window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer),window.removeEventListener("keydown",this._onKeyDown)}_openEvent(e){this._selected=e}_closeEvent(){this._selected=null}_openSchool(e=null){this._schoolPerson=e,this._schoolOpen=!0}_closeSchool(){this._schoolOpen=!1,this._schoolPerson=null}_schoolKey(e,s=null){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openSchool(s))}_eventKey(e,s){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openEvent(s))}_entity(){let e=this.hass?.states??{},s=this._config.entity??A;if(e[s])return{id:s,ent:e[s]};if(!this._config.entity){for(let[o,a]of Object.entries(e))if(o.startsWith("sensor.")&&Array.isArray(a.attributes?.agenda)&&"by_person"in a.attributes)return{id:o,ent:a}}return null}_attrs(){return this._config?this._entity()?.ent.attributes??null:null}_color(e){return Z(e,this._config.colors)}_moreInfo(){let e=this._entity()?.id;e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return d;let e=this._entity();if(!e)return n`<ha-card>
        <div class="empty">
          ${c(this.hass,"ui.card.family_today.sensor_not_found","Family Today sensor not found")}
          (<code>${this._config.entity??A}</code>).
        </div>
      </ha-card>`;let s=e.ent.attributes,o=this._config;return n`
      <ha-card @click=${this._moreInfo}>
        ${this._header(s)} ${this._banners(s)} ${this._next(s)}
        ${o.layout==="lanes"?this._lanes(s):this._list(s)}
      </ha-card>
      ${this._selected?this._eventDialog(this._selected):d}
      ${this._schoolOpen?this._schoolDialog(s):d}
    `}_header(e){let s=F(this.hass,this._now),{title:o,show_school:a}=this._config,h=e.school?.reason??e.break_reason??null??(e.school_day?c(this.hass,"ui.card.family_today.school_day","School day"):c(this.hass,"ui.card.family_today.no_school","No school")),l=(e.school_overrides?.length??0)>0?Object.entries(e.school_by_person??{}):[];return n`
      <div class="header">
        <div class="titles">
          <div class="title">${o??s}</div>
          ${o?n`<div class="subtitle">${s}</div>`:d}
        </div>
        ${a?l.length?n`<div class="school-chips">
                ${l.map(([u,m])=>this._schoolChip(u,m))}
              </div>`:n`<span
                class=${w({chip:!0,school:e.school_day})}
                role="button"
                tabindex="0"
                title=${h}
                aria-label=${`${c(this.hass,"ui.card.family_today.show_details","Show details")}, ${h}`}
                @click=${u=>{u.stopPropagation(),this._openSchool()}}
                @keydown=${this._schoolKey}
              >
                <ha-icon
                  icon=${e.school_day?"mdi:school":"mdi:school-outline"}
                ></ha-icon>
                ${e.school_day?c(this.hass,"ui.card.family_today.school_day","School day"):c(this.hass,"ui.card.family_today.no_school","No school")}
                <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
              </span>`:d}
      </div>
    `}_schoolChip(e,s){let o=s.is_school_day?c(this.hass,"ui.card.family_today.school_day","School day"):s.reason||c(this.hass,"ui.card.family_today.no_school","No school");return n`<span
      class=${w({chip:!0,school:s.is_school_day})}
      role="button"
      tabindex="0"
      title=${o}
      aria-label=${`${e}: ${o}, ${c(this.hass,"ui.card.family_today.show_details","Show details")}`}
      @click=${a=>{a.stopPropagation(),this._openSchool(e)}}
      @keydown=${a=>this._schoolKey(a,e)}
    >
      <ha-icon
        icon=${s.is_school_day?"mdi:school":"mdi:school-outline"}
      ></ha-icon>
      ${e} · ${o}
      <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
    </span>`}_banners(e){let{show_bins:s,show_next_bin:o}=this._config,a=[],r=this._calendarNotice(e);if(r&&a.push(r),!s)return a.length?n`<div class="banners">${a}</div>`:d;let h=e.bin_meta??{};if(e.bins_today?.length&&a.push(this._banner("mdi:trash-can",c(this.hass,"ui.card.family_today.bin_day_today","Bin day today"),this._binChips(e.bins_today,h))),e.bins_tomorrow?.length&&a.push(this._banner("mdi:trash-can-outline",c(this.hass,"ui.card.family_today.bins_out_tonight","Bins out tonight"),this._binChips(e.bins_tomorrow,h))),!a.length&&o){let l=this.hass.states[this._config.bin_entity??Mt];if(l&&/^\d{4}-\d{2}-\d{2}$/.test(l.state)){let u=l.attributes.bins??[],m=l.attributes.bin_meta??h,p=l.attributes.days_until,_=p===1?c(this.hass,"ui.card.family_today.tomorrow","tomorrow"):p!=null?`in ${p} days`:"";a.push(this._banner("mdi:calendar-clock",`${c(this.hass,"ui.card.family_today.next_bins","Next bins")} \xB7 ${b(this.hass,l.state)}`,n`${u.length?this._binChips(u,m):d}${_?n`<span class="when">(${_})</span>`:d}`,!0))}}return a.length?n`<div class="banners">${a}</div>`:d}_calendarNotice(e){let o=Object.values(e.calendar_status??{}).filter(l=>l.role==="person").filter(l=>!l.ok);if(!o.length)return null;let a=o.map(l=>this._calendarName(l)),r=a.length>1?`${a.slice(0,-1).join(", ")} and ${a[a.length-1]}`:a[0],h=o.some(l=>!l.using_cache);return this._banner("mdi:calendar-alert",h?c(this.hass,"ui.card.family_today.calendar_unavailable","Calendar unavailable"):c(this.hass,"ui.card.family_today.showing_saved_events","Showing saved events"),h?`Couldn't refresh ${r}`:`${c(this.hass,"ui.card.family_today.today_events_from","Today's events from")} ${r} ${c(this.hass,"ui.card.family_today.from_earlier_refresh","are from an earlier refresh")}`,!0)}_calendarName(e){let s=this.hass.states?.[e.entity_id]?.attributes?.friendly_name;return typeof s=="string"&&s?s:e.person||e.entity_id}_binChips(e,s){return n`${e.map(o=>{let a=s?.[o]??{},r=Ut(a.colour);return n`<span
        class="bin-chip"
        style=${v(r?{"--bin-color":r}:{})}
        ><ha-icon icon=${a.icon||Lt}></ha-icon>${o}</span
      >`})}`}_banner(e,s,o,a=!1){return n`<div class=${w({banner:!0,muted:a})}>
      <ha-icon icon=${e}></ha-icon>
      <span class="label">${s}</span>
      <span class="text">${o}</span>
    </div>`}_next(e){let s=e.next_event;if(!s)return d;let o=Date.parse(s.start)-this._now;return o<=0?d:n`<div
      class="next"
      role="button"
      tabindex="0"
      aria-label=${`${c(this.hass,"ui.card.family_today.details_for","Details for")} ${s.summary}`}
      @click=${a=>{a.stopPropagation(),this._openEvent(s)}}
      @keydown=${a=>this._eventKey(a,s)}
    >
      <span class="dot" style=${v({background:this._color(s.person)})}></span>
      <span class="next-text"><strong>${c(this.hass,"ui.card.family_today.next","Next")}</strong>: ${s.summary}</span>
      <span class="next-when">${Ft(o)}</span>
    </div>`}_visible(e){return this._config.hide_past?e.filter(s=>pt(s,this._now)!=="past"):e}_list(e){let s=this._visible(e.agenda??[]),o=s.filter(r=>r.all_day),a=s.filter(r=>!r.all_day);return s.length?n`
      ${this._config.show_all_day&&o.length?n`<div class="allday">
            ${o.map(r=>n`<span
                class="allday-chip"
                style=${v({"--person-color":this._color(r.person)})}
                role="button"
                tabindex="0"
                aria-label=${`${c(this.hass,"ui.card.family_today.details_for","Details for")} ${r.summary}`}
                @click=${h=>{h.stopPropagation(),this._openEvent(r)}}
                @keydown=${h=>this._eventKey(h,r)}
                >${r.summary}</span
              >`)}
          </div>`:d}
      <div class="events">${a.map(r=>this._eventRow(r))}</div>
    `:n`<div class="empty">${c(this.hass,"ui.card.family_today.nothing_scheduled_today","Nothing scheduled today")}</div>`}_lanes(e){let s=e.people?.length?e.people:Object.keys(e.by_person??{});return s.length?n`<div class="lanes">
      ${s.map(o=>{let a=this._visible(e.by_person?.[o]??[]);return n`<div class="lane" style=${v({"--person-color":this._color(o)})}>
          <div class="lane-head"><span class="dot"></span>${o}</div>
          ${a.length?a.map(r=>this._eventRow(r)):n`<div class="lane-empty">${c(this.hass,"ui.card.family_today.nothing_on","Nothing on")}</div>`}
        </div>`})}
    </div>`:n`<div class="empty">${c(this.hass,"ui.card.family_today.nothing_scheduled_today","Nothing scheduled today")}</div>`}_eventRow(e){let s=pt(e,this._now);return n`<div
      class=${w({event:!0,past:s==="past",now:s==="now"})}
      style=${v({"--person-color":this._color(e.person)})}
      role="button"
      tabindex="0"
      aria-label=${`${c(this.hass,"ui.card.family_today.details_for","Details for")} ${e.summary}`}
      @click=${o=>{o.stopPropagation(),this._openEvent(e)}}
      @keydown=${o=>this._eventKey(o,e)}
    >
      <div class="time">${mt(this.hass,e)}</div>
      <div class="body">
        <div class="summary">${e.summary}</div>
        ${e.location?n`<div class="meta"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.location}</div>`:d}
      </div>
    </div>`}_schoolDialog(e){let s=this._schoolPerson,o=(s?e.school_by_person?.[s]:null)??e.school,a=o?.is_school_day??e.school_day,r=o?.reason??e.break_reason??null,h=o?.term??e.term,l=a?c(this.hass,"ui.card.family_today.school_day","School day"):r||c(this.hass,"ui.card.family_today.no_school","No school"),u=[s,h].filter(Boolean).join(" \xB7 "),m=(_,f)=>[_?b(this.hass,_):"",f!=null?P(f):""].filter(Boolean).join(" \xB7 "),p=[];return a?(o?.term_end&&p.push(this._detail("mdi:calendar-end",c(this.hass,"ui.card.family_today.term_ends","Term ends"),m(o.term_end,o.days_until_term_end))),o?.next_break&&o.next_break_start&&(o.days_until_term_end==null||(o.days_until_next_break??1/0)<o.days_until_term_end)&&p.push(this._detail("mdi:beach",c(this.hass,"ui.card.family_today.next_break","Next break"),`${o.next_break} \xB7 ${m(o.next_break_start,o.days_until_next_break)}`))):o&&(o.back_to_school&&p.push(this._detail("mdi:school",c(this.hass,"ui.card.family_today.back_to_school","Back to school"),m(o.back_to_school,o.days_until_school))),o.next_term&&o.next_term_start&&o.next_term_start!==o.back_to_school&&p.push(this._detail("mdi:calendar-start",c(this.hass,"ui.card.family_today.next_term","Next term"),`${o.next_term} \xB7 ${m(o.next_term_start,o.days_until_next_term)}`)),o.term_end&&p.push(this._detail("mdi:calendar-end",c(this.hass,"ui.card.family_today.term_ends","Term ends"),m(o.term_end,o.days_until_term_end)))),p.length||p.push(n`<div class="detail muted-row">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span>${c(this.hass,"ui.card.family_today.no_term_dates_configured","No term dates configured.")}</span>
        </div>`),n`<div
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
            ${u?n`<div class="dialog-sub">${u}</div>`:d}
          </div>
          <button class="close" aria-label=${c(this.hass,"ui.card.family_today.close","Close")} @click=${this._closeSchool}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">${p}</div>
      </div>
    </div>`}_detail(e,s,o){return n`<div class="detail">
      <ha-icon icon=${e}></ha-icon>
      <span class="detail-label">${s}</span>
      <span class="detail-value">${o}</span>
    </div>`}_eventDialog(e){return n`<div
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
            <div class="dialog-sub">${zt(this.hass,e)}</div>
          </div>
          <button class="close" aria-label=${c(this.hass,"ui.card.family_today.close","Close")} @click=${this._closeEvent}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">
          ${e.location?n`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${e.location}</span>
              </div>`:d}
          <div class="detail">
            <span class="dot" style=${v({background:this._color(e.person)})}></span>
            <span>${e.person}</span>
          </div>
          ${e.description?n`<div class="description">${e.description}</div>`:d}
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
  `;customElements.define("family-today-card",B);var re=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"max_breaks",selector:{number:{min:1,max:6,mode:"box"}}}],ne={entity:"Family Today sensor",title:"Title (default: School)",max_breaks:"Upcoming breaks to show"},G=class extends y{setConfig(t){this._config=t}render(){return this._config?n`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${re}
        .computeLabel=${t=>ne[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:n``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};G.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-school-card-editor",G);var It=3,I=class extends y{setConfig(t){let e=t.max_breaks;if(e!=null&&(!Number.isInteger(e)||e<1))throw new Error("max_breaks must be a positive whole number");this._config={type:"custom:family-today-school-card",entity:A,max_breaks:It,...t}}getCardSize(){return 4}static getStubConfig(){return{entity:A}}static getConfigElement(){return document.createElement("family-today-school-card-editor")}render(){if(!this.hass||!this._config)return n``;let t=this._config.entity??A,e=this.hass.states[t];if(!e)return n`<ha-card>
        <div class="missing">
          ${c(this.hass,"ui.card.family_today_school.sensor_not_found","Family Today sensor not found")} (<code>${t}</code>).
        </div>
      </ha-card>`;let s=e.attributes,o=this._entries(s),a=o.length===1,r=this._config.title??c(this.hass,"ui.card.family_today_school.school","School");return n`<ha-card>
      <div class="header">
        <div class="title">${r}</div>
        ${a?this._chip(o[0].status):d}
      </div>
      ${o.length?o.map(h=>this._section(h,!a)):n`<div class="empty">${c(this.hass,"ui.card.family_today_school.no_school_data_yet","No school data yet.")}</div>`}
    </ha-card>`}_entries(t){let e=t.school_by_person??{},s=Object.keys(e);if((t.school_overrides?.length??0)>0&&s.length)return s.map(a=>({person:a,status:e[a]}));let o=t.school??this._legacyStatus(t);return o?[{person:null,status:o}]:[]}_legacyStatus(t){return t.school_day==null?null:{is_school_day:t.school_day,reason:t.break_reason??null,term:t.term??null,term_start:null,term_end:null,days_until_term_end:null,term_school_days:null,term_school_days_done:null,term_progress:null,next_term:null,next_term_start:null,days_until_next_term:null,next_break:null,next_break_start:null,days_until_next_break:null,back_to_school:null,days_until_school:null,upcoming_breaks:[]}}_section(t,e){let{person:s,status:o}=t,a=s?Z(s,this._config.colors):"var(--primary-color)";return n`<section class="section">
      ${e?n`<div class="child-head" style=${v({"--person-color":a})}>
            <span class="dot"></span>
            <span class="child-name">${s}</span>
            ${this._chip(o)}
          </div>`:d}
      ${this._term(o)} ${this._facts(o)} ${this._breaks(o)}
    </section>`}_chip(t){let e=t.is_school_day?c(this.hass,"ui.card.family_today_school.school_day","School day"):t.reason||c(this.hass,"ui.card.family_today_school.no_school","No school");return n`<span class=${w({chip:!0,school:t.is_school_day})}>
      <ha-icon
        icon=${t.is_school_day?"mdi:school":"mdi:school-outline"}
      ></ha-icon>
      ${e}
    </span>`}_term(t){if(!t.term)return d;let e=t.term_progress??null,s=t.term_end?`${c(this.hass,"ui.card.family_today.term_ends","Term ends")} ${b(this.hass,t.term_end)}`:"";return n`<div class="term">
      <div class="term-head">
        <span class="term-name">${t.term}</span>
        ${e!=null?n`<span class="term-pct">${e}%</span>`:d}
      </div>
      ${e!=null?n`<div
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
        ${t.term_school_days!=null&&t.term_school_days_done!=null?n`<span
              >${t.term_school_days_done} of ${t.term_school_days} school
              days</span
            >`:n`<span></span>`}
        ${s?n`<span
              >${s}${t.days_until_term_end===0?" \xB7 today":""}</span
            >`:d}
      </div>
    </div>`}_facts(t){let e=[];if(!t.is_school_day)if(t.back_to_school){let o=!!t.next_term&&!!t.next_term_start&&t.next_term_start===t.back_to_school?`${t.next_term} starts`:c(this.hass,"ui.card.family_today_school.back_to_school","Back to school");e.push(this._fact("mdi:school",o,`${b(this.hass,t.back_to_school)} \xB7 ${P(t.days_until_school)}`))}else t.next_term&&t.next_term_start&&e.push(this._fact("mdi:calendar-start",c(this.hass,"ui.card.family_today_school.next_term","Next term"),`${t.next_term} \xB7 ${b(this.hass,t.next_term_start)} \xB7 ${P(t.days_until_next_term)}`));return e.length?n`<div class="facts">${e}</div>`:d}_fact(t,e,s){return n`<div class="fact">
      <ha-icon icon=${t}></ha-icon>
      <span class="fact-label">${e}</span>
      <span class="fact-value">${s}</span>
    </div>`}_breaks(t){let e=Math.max(1,this._config.max_breaks??It),s=(t.upcoming_breaks??[]).slice(0,e);return s.length?n`<div class="breaks">
      <div class="breaks-title">${c(this.hass,"ui.card.family_today_school.upcoming_breaks","Upcoming breaks")}</div>
      ${s.map(o=>this._breakRow(o))}
    </div>`:n`<div class="empty-breaks">
        ${t.term||t.next_term?c(this.hass,"ui.card.family_today_school.no_school_breaks_in_calendar_yet","No school breaks in the calendar yet."):c(this.hass,"ui.card.family_today_school.no_term_dates_configured","No term dates configured.")}
      </div>`}_breakRow(t){let e=t.end&&t.end!==t.start?`${b(this.hass,t.start)} \u2013 ${b(this.hass,t.end)}`:b(this.hass,t.start),s=t.kind==="inset";return n`<div class=${w({break:!0,inset:s})}>
      <ha-icon icon=${s?"mdi:book-open":"mdi:beach"}></ha-icon>
      <span class="break-name">${t.name}</span>
      <span class="break-count">${P(t.days_until)}</span>
      <span class="break-when">${e}</span>
    </div>`}};I.properties={hass:{attribute:!1},_config:{state:!0}},I.styles=D`
    :host { display: block; }
    ha-card { padding: 16px; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .title { font-size: 1.3em; font-weight: 500; color: var(--primary-text-color); }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px;
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em;
      white-space: nowrap; }
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
  `;customElements.define("family-today-school-card",I);window.customCards=window.customCards||[];window.customCards.push({type:"family-today-card",name:"Family Today",description:"Today's family agenda, school day and bin collections in one card.",preview:!1});window.customCards.push({type:"family-today-school-card",name:"Family Today School",description:"Term progress and upcoming breaks, with one section per child.",preview:!1});console.info("%c FAMILY-TODAY-CARD %c 0.2.0","color:#fff;background:#4285f4;font-weight:700","");})();
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
