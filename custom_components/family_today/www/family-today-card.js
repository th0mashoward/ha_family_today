"use strict";(()=>{var F=globalThis,z=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),ut=new WeakMap,P=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ut.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ut.set(e,t))}return t}toString(){return this.cssText}},mt=i=>new P(typeof i=="string"?i:i+"",void 0,Z),G=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,o,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[a+1],i[0]);return new P(e,i,Z)},_t=(i,t)=>{if(z)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),o=F.litNonce;o!==void 0&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}},Q=z?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return mt(e)})(i):i;var{is:Ft,defineProperty:zt,getOwnPropertyDescriptor:jt,getOwnPropertyNames:Kt,getOwnPropertySymbols:Wt,getPrototypeOf:Yt}=Object,j=globalThis,yt=j.trustedTypes,Vt=yt?yt.emptyScript:"",qt=j.reactiveElementPolyfillSupport,D=(i,t)=>i,X={toAttribute(i,t){switch(t){case Boolean:i=i?Vt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},gt=(i,t)=>!Ft(i,t),ft={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:gt};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ft){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),o=this.getPropertyDescriptor(t,s,e);o!==void 0&&zt(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){let{get:o,set:a}=jt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:o,set(n){let d=o?.call(this);a?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ft}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,s=[...Kt(e),...Wt(e)];for(let o of s)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,o]of e)this.elementProperties.set(s,o)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let o=this._$Eu(e,s);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let o of s)e.unshift(Q(o))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:X).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(t,e){let s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let a=s.getPropertyOptions(o),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:X;this._$Em=o;let d=n.fromAttribute(e,a.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(t,e,s,o=!1,a){if(t!==void 0){let n=this.constructor;if(o===!1&&(a=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??gt)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:a},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),a!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[o,a]of s){let{wrapped:n}=a,d=this[o];n!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,a,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[D("elementProperties")]=new Map,$[D("finalized")]=new Map,qt?.({ReactiveElement:$}),(j.reactiveElementVersions??=[]).push("2.1.2");var nt=globalThis,vt=i=>i,K=nt.trustedTypes,$t=K?K.createPolicy("lit-html",{createHTML:i=>i}):void 0,St="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+b,Jt=`<${Ct}>`,S=document,O=()=>S.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",rt=Array.isArray,Zt=i=>rt(i)||typeof i?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bt=/-->/g,xt=/>/g,A=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),wt=/'/g,At=/"/g,kt=/^(?:script|style|textarea|title)$/i,lt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),l=lt(1),de=lt(2),he=lt(3),f=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Et=new WeakMap,E=S.createTreeWalker(S,129);function Tt(i,t){if(!rt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(t):t}var Gt=(i,t)=>{let e=i.length-1,s=[],o,a=t===2?"<svg>":t===3?"<math>":"",n=N;for(let d=0;d<e;d++){let r=i[d],p,u,h=-1,m=0;for(;m<r.length&&(n.lastIndex=m,u=n.exec(r),u!==null);)m=n.lastIndex,n===N?u[1]==="!--"?n=bt:u[1]!==void 0?n=xt:u[2]!==void 0?(kt.test(u[2])&&(o=RegExp("</"+u[2],"g")),n=A):u[3]!==void 0&&(n=A):n===A?u[0]===">"?(n=o??N,h=-1):u[1]===void 0?h=-2:(h=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?A:u[3]==='"'?At:wt):n===At||n===wt?n=A:n===bt||n===xt?n=N:(n=A,o=void 0);let y=n===A&&i[d+1].startsWith("/>")?" ":"";a+=n===N?r+Jt:h>=0?(s.push(p),r.slice(0,h)+St+r.slice(h)+b+y):r+b+(h===-2?d:y)}return[Tt(i,a+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},M=class i{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let a=0,n=0,d=t.length-1,r=this.parts,[p,u]=Gt(t,e);if(this.el=i.createElement(p,s),E.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=E.nextNode())!==null&&r.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(St)){let m=u[n++],y=o.getAttribute(h).split(b),I=/([.?@])?(.*)/.exec(m);r.push({type:1,index:a,name:I[2],strings:y,ctor:I[1]==="."?st:I[1]==="?"?ot:I[1]==="@"?it:k}),o.removeAttribute(h)}else h.startsWith(b)&&(r.push({type:6,index:a}),o.removeAttribute(h));if(kt.test(o.tagName)){let h=o.textContent.split(b),m=h.length-1;if(m>0){o.textContent=K?K.emptyScript:"";for(let y=0;y<m;y++)o.append(h[y],O()),E.nextNode(),r.push({type:2,index:++a});o.append(h[m],O())}}}else if(o.nodeType===8)if(o.data===Ct)r.push({type:2,index:a});else{let h=-1;for(;(h=o.data.indexOf(b,h+1))!==-1;)r.push({type:7,index:a}),h+=b.length-1}a++}}static createElement(t,e){let s=S.createElement("template");return s.innerHTML=t,s}};function C(i,t,e=i,s){if(t===f)return t;let o=s!==void 0?e._$Co?.[s]:e._$Cl,a=H(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),a===void 0?o=void 0:(o=new a(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=o:e._$Cl=o),o!==void 0&&(t=C(i,o._$AS(i,t.values),o,s)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??S).importNode(e,!0);E.currentNode=o;let a=E.nextNode(),n=0,d=0,r=s[0];for(;r!==void 0;){if(n===r.index){let p;r.type===2?p=new L(a,a.nextSibling,this,t):r.type===1?p=new r.ctor(a,r.name,r.strings,this,t):r.type===6&&(p=new at(a,this,t)),this._$AV.push(p),r=s[++d]}n!==r?.index&&(a=E.nextNode(),n++)}return E.currentNode=S,o}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},L=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),H(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==f&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=M.createElement(Tt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{let a=new et(o,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=Et.get(t.strings);return e===void 0&&Et.set(t.strings,e=new M(t)),e}k(t){rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,o=0;for(let a of t)o===e.length?e.push(s=new i(this.O(O()),this.O(O()),this,this.options)):s=e[o],s._$AI(a),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=vt(t).nextSibling;vt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,o){let a=this.strings,n=!1;if(a===void 0)t=C(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==f,n&&(this._$AH=t);else{let d=t,r,p;for(t=a[0],r=0;r<a.length-1;r++)p=C(this,d[s+r],e,r),p===f&&(p=this._$AH[r]),n||=!H(p)||p!==this._$AH[r],p===c?t=c:t!==c&&(t+=(p??"")+a[r+1]),this._$AH[r]=p}n&&!o&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},ot=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},it=class extends k{constructor(t,e,s,o,a){super(t,e,s,o,a),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??c)===f)return;let s=this._$AH,o=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==c&&(s===c||o);o&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},at=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var Qt=nt.litHtmlPolyfillSupport;Qt?.(M,L),(nt.litHtmlVersions??=[]).push("3.3.3");var Rt=(i,t,e)=>{let s=e?.renderBefore??t,o=s._$litPart$;if(o===void 0){let a=e?.renderBefore??null;s._$litPart$=o=new L(t.insertBefore(O(),a),a,void 0,e??{})}return o._$AI(i),o};var ct=globalThis,_=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return f}};_._$litElement$=!0,_.finalized=!0,ct.litElementHydrateSupport?.({LitElement:_});var Xt=ct.litElementPolyfillSupport;Xt?.({LitElement:_});(ct.litElementVersions??=[]).push("4.2.2");var W={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Y=i=>(...t)=>({_$litDirective$:i,values:t}),T=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var x=Y(class extends T{constructor(i){if(super(i),i.type!==W.ATTRIBUTE||i.name!=="class"||i.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter(t=>i[t]).join(" ")+" "}update(i,[t]){if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(let s in t)t[s]&&!this.nt?.has(s)&&this.st.add(s);return this.render(t)}let e=i.element.classList;for(let s of this.st)s in t||(e.remove(s),this.st.delete(s));for(let s in t){let o=!!t[s];o===this.st.has(s)||this.nt?.has(s)||(o?(e.add(s),this.st.add(s)):(e.remove(s),this.st.delete(s)))}return f}});var Pt="important",te=" !"+Pt,g=Y(class extends T{constructor(i){if(super(i),i.type!==W.ATTRIBUTE||i.name!=="style"||i.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(i){return Object.keys(i).reduce((t,e)=>{let s=i[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(i,[t]){let{style:e}=i.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let o=t[s];if(o!=null){this.ft.add(s);let a=typeof o=="string"&&o.endsWith(te);s.includes("-")||a?e.setProperty(s,a?o.slice(0,-11):o,a?Pt:""):e[s]=o}}return f}});var w="sensor.family_today_today",Ot="sensor.family_today_next_bin_collection",Dt=["#4285f4","#e8710a","#0f9d58","#a142f4","#d93025","#12b5cb","#f9ab00","#e52592"];function Ht(i,t){if(t?.[i])return t[i];let e=0;for(let s of i)e=e*31+s.charCodeAt(0)>>>0;return Dt[e%Dt.length]}var ee={grey:"#9ca3af",gray:"#9ca3af",black:"#6b7280",white:"#e5e7eb",blue:"#3b82f6",green:"#22c55e",brown:"#a16207",red:"#ef4444",yellow:"#eab308",orange:"#f97316",purple:"#a855f7",pink:"#ec4899"},Mt="mdi:delete";function Lt(i){let t=i?.trim();if(t)return ee[t.toLowerCase()]??t}function dt(i,t){if(i.all_day)return"all-day";let e=Date.parse(i.start);return Date.parse(i.end)<=t?"past":e<=t?"now":"upcoming"}function ht(i){return i.locale?.language??i.language??"en"}function Nt(i,t){let s=(i.locale?.time_format??"24")==="12";return new Date(t).toLocaleTimeString(ht(i),{hour:"numeric",minute:"2-digit",hour12:s})}function pt(i,t){return t.all_day?"All day":`${Nt(i,t.start)} \u2013 ${Nt(i,t.end)}`}function Ut(i,t){let e=new Date(t.start);if(!t.all_day)return`${U(i,e.getTime())} \xB7 ${pt(i,t)}`;let s=new Date(t.end),o=new Date(s.getFullYear(),s.getMonth(),s.getDate()-1),a=e.getFullYear()===o.getFullYear()&&e.getMonth()===o.getMonth()&&e.getDate()===o.getDate(),n=U(i,e.getTime());return a?`All day \xB7 ${n}`:`All day \xB7 ${n} \u2013 ${U(i,o.getTime())}`}function U(i,t){return new Date(t).toLocaleDateString(ht(i),{weekday:"long",day:"numeric",month:"long"})}function v(i,t){let[e,s,o]=t.split("-").map(Number);return new Date(e,s-1,o).toLocaleDateString(ht(i),{weekday:"short",day:"numeric",month:"short"})}function Bt(i){let t=Math.max(0,Math.round(i/6e4));if(t<1)return"now";if(t<60)return`in ${t} min`;let e=Math.floor(t/60),s=t%60;return s?`in ${e}h ${s}m`:`in ${e}h`}function R(i){return i==null?"":i<=0?"today":i===1?"tomorrow":`in ${i} days`}function It(i){return{type:"custom:family-today-card",layout:"list",show_all_day:!0,show_bins:!0,show_school:!0,show_next_bin:!0,hide_past:!1,...i}}var se=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"list",label:"Chronological list"},{value:"lanes",label:"Lane per person"}]}}},{type:"grid",name:"",schema:[{name:"show_school",selector:{boolean:{}}},{name:"show_bins",selector:{boolean:{}}},{name:"show_next_bin",selector:{boolean:{}}},{name:"show_all_day",selector:{boolean:{}}},{name:"hide_past",selector:{boolean:{}}}]}],oe={entity:"Family Today sensor",title:"Title (optional, defaults to today's date)",layout:"Layout",show_school:"Show school day badge",show_bins:"Show bin banners",show_next_bin:"Show next bin collection",show_all_day:"Show all-day events",hide_past:"Hide events that have finished"},V=class extends _{setConfig(t){this._config=t}render(){return this._config?l`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${se}
        .computeLabel=${t=>oe[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:l``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};V.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-card-editor",V);var B=class extends _{constructor(){super();this._onKeyDown=e=>{e.key==="Escape"&&(this._selected=null,this._schoolOpen=!1,this._schoolPerson=null)};this._now=Date.now(),this._selected=null,this._schoolOpen=!1,this._schoolPerson=null}setConfig(e){if(e.layout&&!["list","lanes"].includes(e.layout))throw new Error("layout must be 'list' or 'lanes'");this._config=It(e)}getCardSize(){let e=this._attrs();return 2+Math.min(e?.agenda.length??0,8)}static getStubConfig(){return{entity:w}}static getConfigElement(){return document.createElement("family-today-card-editor")}connectedCallback(){super.connectedCallback(),this._now=Date.now(),this._timer=window.setInterval(()=>this._now=Date.now(),3e4),window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer),window.removeEventListener("keydown",this._onKeyDown)}_openEvent(e){this._selected=e}_closeEvent(){this._selected=null}_openSchool(e=null){this._schoolPerson=e,this._schoolOpen=!0}_closeSchool(){this._schoolOpen=!1,this._schoolPerson=null}_schoolKey(e,s=null){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openSchool(s))}_eventKey(e,s){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openEvent(s))}_entity(){let e=this.hass?.states??{},s=this._config.entity??w;if(e[s])return{id:s,ent:e[s]};if(!this._config.entity){for(let[o,a]of Object.entries(e))if(o.startsWith("sensor.")&&Array.isArray(a.attributes?.agenda)&&"by_person"in a.attributes)return{id:o,ent:a}}return null}_attrs(){return this._config?this._entity()?.ent.attributes??null:null}_color(e){return Ht(e,this._config.colors)}_moreInfo(){let e=this._entity()?.id;e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return c;let e=this._entity();if(!e)return l`<ha-card>
        <div class="empty">
          ${this.hass.translate("ui.card.family_today.sensor_not_found")??"Family Today sensor not found"}
          (<code>${this._config.entity??w}</code>).
        </div>
      </ha-card>`;let s=e.ent.attributes,o=this._config;return l`
      <ha-card @click=${this._moreInfo}>
        ${this._header(s)} ${this._banners(s)} ${this._next(s)}
        ${o.layout==="lanes"?this._lanes(s):this._list(s)}
      </ha-card>
      ${this._selected?this._eventDialog(this._selected):c}
      ${this._schoolOpen?this._schoolDialog(s):c}
    `}_header(e){let s=U(this.hass,this._now),{title:o,show_school:a}=this._config,d=e.school?.reason??e.break_reason??null??(e.school_day?this.hass.translate("ui.card.family_today.school_day"):this.hass.translate("ui.card.family_today.no_school")),r=(e.school_overrides?.length??0)>0?Object.entries(e.school_by_person??{}):[];return l`
      <div class="header">
        <div class="titles">
          <div class="title">${o??s}</div>
          ${o?l`<div class="subtitle">${s}</div>`:c}
        </div>
        ${a?r.length?l`<div class="school-chips">
                ${r.map(([p,u])=>this._schoolChip(p,u))}
              </div>`:l`<span
                class=${x({chip:!0,school:e.school_day})}
                role="button"
                tabindex="0"
                title=${d}
                aria-label=${`${this.hass.translate("ui.card.family_today.show_details")??"Show details"}, ${d}`}
                @click=${p=>{p.stopPropagation(),this._openSchool()}}
                @keydown=${this._schoolKey}
              >
                <ha-icon
                  icon=${e.school_day?"mdi:school":"mdi:school-outline"}
                ></ha-icon>
                ${e.school_day?this.hass.translate("ui.card.family_today.school_day"):this.hass.translate("ui.card.family_today.no_school")}
                <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
              </span>`:c}
      </div>
    `}_schoolChip(e,s){let o=s.is_school_day?this.hass.translate("ui.card.family_today.school_day"):s.reason||this.hass.translate("ui.card.family_today.no_school");return l`<span
      class=${x({chip:!0,school:s.is_school_day})}
      role="button"
      tabindex="0"
      title=${o}
      aria-label=${`${e}: ${o}, ${this.hass.translate("ui.card.family_today.show_details")??"Show details"}`}
      @click=${a=>{a.stopPropagation(),this._openSchool(e)}}
      @keydown=${a=>this._schoolKey(a,e)}
    >
      <ha-icon
        icon=${s.is_school_day?"mdi:school":"mdi:school-outline"}
      ></ha-icon>
      ${e} · ${o}
      <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
    </span>`}_banners(e){let{show_bins:s,show_next_bin:o}=this._config,a=[],n=this._calendarNotice(e);if(n&&a.push(n),!s)return a.length?l`<div class="banners">${a}</div>`:c;let d=e.bin_meta??{};if(e.bins_today?.length&&a.push(this._banner("mdi:trash-can",this.hass.translate("ui.card.family_today.bin_day_today")??"Bin day today",this._binChips(e.bins_today,d))),e.bins_tomorrow?.length&&a.push(this._banner("mdi:trash-can-outline",this.hass.translate("ui.card.family_today.bins_out_tonight")??"Bins out tonight",this._binChips(e.bins_tomorrow,d))),!a.length&&o){let r=this.hass.states[this._config.bin_entity??Ot];if(r&&/^\d{4}-\d{2}-\d{2}$/.test(r.state)){let p=r.attributes.bins??[],u=r.attributes.bin_meta??d,h=r.attributes.days_until,m=h===1?this.hass.translate("ui.card.family_today.tomorrow")??"tomorrow":h!=null?`in ${h} days`:"";a.push(this._banner("mdi:calendar-clock",`${this.hass.translate("ui.card.family_today.next_bins")??"Next bins"} \xB7 ${v(this.hass,r.state)}`,l`${p.length?this._binChips(p,u):c}${m?l`<span class="when">(${m})</span>`:c}`,!0))}}return a.length?l`<div class="banners">${a}</div>`:c}_calendarNotice(e){let o=Object.values(e.calendar_status??{}).filter(r=>r.role==="person").filter(r=>!r.ok);if(!o.length)return null;let a=o.map(r=>this._calendarName(r)),n=a.length>1?`${a.slice(0,-1).join(", ")} and ${a[a.length-1]}`:a[0],d=o.some(r=>!r.using_cache);return this._banner("mdi:calendar-alert",d?this.hass.translate("ui.card.family_today.calendar_unavailable")??"Calendar unavailable":this.hass.translate("ui.card.family_today.showing_saved_events")??"Showing saved events",d?`Couldn't refresh ${n}`:`${this.hass.translate("ui.card.family_today.today_events_from")??"Today's events from"} ${n} ${this.hass.translate("ui.card.family_today.from_earlier_refresh")??"are from an earlier refresh"}`,!0)}_calendarName(e){let s=this.hass.states?.[e.entity_id]?.attributes?.friendly_name;return typeof s=="string"&&s?s:e.person||e.entity_id}_binChips(e,s){return l`${e.map(o=>{let a=s?.[o]??{},n=Lt(a.colour);return l`<span
        class="bin-chip"
        style=${g(n?{"--bin-color":n}:{})}
        ><ha-icon icon=${a.icon||Mt}></ha-icon>${o}</span
      >`})}`}_banner(e,s,o,a=!1){return l`<div class=${x({banner:!0,muted:a})}>
      <ha-icon icon=${e}></ha-icon>
      <span class="label">${s}</span>
      <span class="text">${o}</span>
    </div>`}_next(e){let s=e.next_event;if(!s)return c;let o=Date.parse(s.start)-this._now;return o<=0?c:l`<div
      class="next"
      role="button"
      tabindex="0"
      aria-label=${`${this.hass.translate("ui.card.family_today.details_for")??"Details for"} ${s.summary}`}
      @click=${a=>{a.stopPropagation(),this._openEvent(s)}}
      @keydown=${a=>this._eventKey(a,s)}
    >
      <span class="dot" style=${g({background:this._color(s.person)})}></span>
      <span class="next-text"><strong>${this.hass.translate("ui.card.family_today.next")??"Next"}</strong>: ${s.summary}</span>
      <span class="next-when">${Bt(o)}</span>
    </div>`}_visible(e){return this._config.hide_past?e.filter(s=>dt(s,this._now)!=="past"):e}_list(e){let s=this._visible(e.agenda??[]),o=s.filter(n=>n.all_day),a=s.filter(n=>!n.all_day);return s.length?l`
      ${this._config.show_all_day&&o.length?l`<div class="allday">
            ${o.map(n=>l`<span
                class="allday-chip"
                style=${g({"--person-color":this._color(n.person)})}
                role="button"
                tabindex="0"
                aria-label=${`${this.hass.translate("ui.card.family_today.details_for")??"Details for"} ${n.summary}`}
                @click=${d=>{d.stopPropagation(),this._openEvent(n)}}
                @keydown=${d=>this._eventKey(d,n)}
                >${n.summary}</span
              >`)}
          </div>`:c}
      <div class="events">${a.map(n=>this._eventRow(n))}</div>
    `:l`<div class="empty">${this.hass.translate("ui.card.family_today.nothing_scheduled_today")??"Nothing scheduled today"}</div>`}_lanes(e){let s=e.people?.length?e.people:Object.keys(e.by_person??{});return s.length?l`<div class="lanes">
      ${s.map(o=>{let a=this._visible(e.by_person?.[o]??[]);return l`<div class="lane" style=${g({"--person-color":this._color(o)})}>
          <div class="lane-head"><span class="dot"></span>${o}</div>
          ${a.length?a.map(n=>this._eventRow(n)):l`<div class="lane-empty">${this.hass.translate("ui.card.family_today.nothing_on")??"Nothing on"}</div>`}
        </div>`})}
    </div>`:l`<div class="empty">${this.hass.translate("ui.card.family_today.nothing_scheduled_today")??"Nothing scheduled today"}</div>`}_eventRow(e){let s=dt(e,this._now);return l`<div
      class=${x({event:!0,past:s==="past",now:s==="now"})}
      style=${g({"--person-color":this._color(e.person)})}
      role="button"
      tabindex="0"
      aria-label=${`${this.hass.translate("ui.card.family_today.details_for")??"Details for"} ${e.summary}`}
      @click=${o=>{o.stopPropagation(),this._openEvent(e)}}
      @keydown=${o=>this._eventKey(o,e)}
    >
      <div class="time">${pt(this.hass,e)}</div>
      <div class="body">
        <div class="summary">${e.summary}</div>
        ${e.location?l`<div class="meta"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.location}</div>`:c}
      </div>
    </div>`}_schoolDialog(e){let s=this._schoolPerson,o=(s?e.school_by_person?.[s]:null)??e.school,a=o?.is_school_day??e.school_day,n=o?.reason??e.break_reason??null,d=o?.term??e.term,r=a?this.hass.translate("ui.card.family_today.school_day"):n||this.hass.translate("ui.card.family_today.no_school"),p=[s,d].filter(Boolean).join(" \xB7 "),u=(m,y)=>[m?v(this.hass,m):"",y!=null?R(y):""].filter(Boolean).join(" \xB7 "),h=[];return a?(o?.term_end&&h.push(this._detail("mdi:calendar-end",this.hass.translate("ui.card.family_today.term_ends")??"Term ends",u(o.term_end,o.days_until_term_end))),o?.next_break&&o.next_break_start&&(o.days_until_term_end==null||(o.days_until_next_break??1/0)<o.days_until_term_end)&&h.push(this._detail("mdi:beach",this.hass.translate("ui.card.family_today.next_break")??"Next break",`${o.next_break} \xB7 ${u(o.next_break_start,o.days_until_next_break)}`))):o&&(o.back_to_school&&h.push(this._detail("mdi:school",this.hass.translate("ui.card.family_today.back_to_school")??"Back to school",u(o.back_to_school,o.days_until_school))),o.next_term&&o.next_term_start&&o.next_term_start!==o.back_to_school&&h.push(this._detail("mdi:calendar-start",this.hass.translate("ui.card.family_today.next_term")??"Next term",`${o.next_term} \xB7 ${u(o.next_term_start,o.days_until_next_term)}`)),o.term_end&&h.push(this._detail("mdi:calendar-end",this.hass.translate("ui.card.family_today.term_ends")??"Term ends",u(o.term_end,o.days_until_term_end)))),h.length||h.push(l`<div class="detail muted-row">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span>${this.hass.translate("ui.card.family_today.no_term_dates_configured")??"No term dates configured."}</span>
        </div>`),l`<div
      class="overlay"
      @click=${m=>{m.stopPropagation(),this._closeSchool()}}
    >
      <div
        class="dialog school-dialog"
        role="dialog"
        aria-modal="true"
        aria-label=${s?`${s}: ${r}`:r}
        @click=${m=>m.stopPropagation()}
      >
        <div class="dialog-head">
          <div>
            <div class="dialog-title">${r}</div>
            ${p?l`<div class="dialog-sub">${p}</div>`:c}
          </div>
          <button class="close" aria-label=${this.hass.translate("ui.card.family_today.close")??"Close"} @click=${this._closeSchool}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">${h}</div>
      </div>
    </div>`}_detail(e,s,o){return l`<div class="detail">
      <ha-icon icon=${e}></ha-icon>
      <span class="detail-label">${s}</span>
      <span class="detail-value">${o}</span>
    </div>`}_eventDialog(e){return l`<div
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
            <div class="dialog-sub">${Ut(this.hass,e)}</div>
          </div>
          <button class="close" aria-label=${this.hass.translate("ui.card.family_today.close")??"Close"} @click=${this._closeEvent}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">
          ${e.location?l`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${e.location}</span>
              </div>`:c}
          <div class="detail">
            <span class="dot" style=${g({background:this._color(e.person)})}></span>
            <span>${e.person}</span>
          </div>
          ${e.description?l`<div class="description">${e.description}</div>`:c}
        </div>
      </div>
    </div>`}};B.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0},_selected:{state:!0},_schoolOpen:{state:!0},_schoolPerson:{state:!0}},B.styles=G`
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
  `;customElements.define("family-today-card",B);var ie=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"max_breaks",selector:{number:{min:1,max:6,mode:"box"}}}],ae={entity:"Family Today sensor",title:"Title (default: School)",max_breaks:"Upcoming breaks to show"},q=class extends _{setConfig(t){this._config=t}render(){return this._config?l`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ie}
        .computeLabel=${t=>ae[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:l``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};q.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-school-card-editor",q);var J=class extends _{setConfig(t){let e=t.max_breaks;if(e!=null&&(!Number.isInteger(e)||e<1))throw new Error("max_breaks must be a positive whole number");this._config={type:"custom:family-today-school-card",entity:w,max_breaks:t.max_breaks??3,...t}}getCardSize(){return 4}static getStubConfig(){return{entity:w}}static getConfigElement(){return document.createElement("family-today-school-card-editor")}render(){if(!this.hass||!this._config)return c;let t=this._config.entity??w,e=this.hass.states[t];if(!e)return l`<ha-card>
        <div class="missing">
          ${this.hass.translate("ui.card.family_today_school.sensor_not_found")??"Family Today sensor not found"} (<code>${t}</code>).
        </div>
      </ha-card>`;let s=e.attributes,o=this._entries(s),a=o.length===1,n=this._config.title??this.hass.translate("ui.card.family_today_school.school")??"School";return l`<ha-card>
      <div class="header">
        <div class="title">${n}</div>
        ${a?this._chip(o[0].status):c}
      </div>
      ${o.length?o.map(d=>this._section(d,!a)):l`<div class="empty">${this.hass.translate("ui.card.family_today_school.no_school_data_yet")??"No school data yet."}</div>`}
    </ha-card>`}_entries(t){let e=t.school_by_person??{},s=Object.keys(e);if((t.school_overrides?.length??0)>0&&s.length)return s.map(a=>({person:a,status:e[a]}));let o=t.school??this._legacyStatus(t);return o?[{person:null,status:o}]:[]}_legacyStatus(t){return t.school_day==null?null:{is_school_day:t.school_day,reason:t.break_reason??null,term:t.term??null,term_start:null,term_end:null,days_until_term_end:null,term_school_days:null,term_school_days_done:null,term_progress:null,next_term:null,next_term_start:null,days_until_next_term:null,next_break:null,next_break_start:null,days_until_next_break:null,back_to_school:null,days_until_school:null,upcoming_breaks:[]}}_section(t,e){let{person:s,status:o}=t,a=s?this._color(s):"var(--primary-color)";return l`<section class="section">
      ${e?l`<div class="child-head" style=${g({"--person-color":a})}>
            <span class="dot"></span>
            <span class="child-name">${s}</span>
            ${this._chip(o)}
          </div>`:c}
      ${this._term(o)} ${this._facts(o)} ${this._breaks(o)}
    </section>`}_color(t){return this.hass.themes?.effective?.colors?.primary||"var(--primary-color)"}_chip(t){let e=t.is_school_day?this.hass.translate("ui.card.family_today_school.school_day")??"School day":t.reason||(this.hass.translate("ui.card.family_today_school.no_school")??"No school");return l`<span class=${x({chip:!0,school:t.is_school_day})}>
      <ha-icon
        icon=${t.is_school_day?"mdi:school":"mdi:school-outline"}
      ></ha-icon>
      ${e}
    </span>`}_term(t){if(!t.term)return c;let e=t.term_progress??null,s=t.term_end?`${this.hass.translate("ui.card.family_today.term_ends")??"Term ends"} ${v(this.hass,t.term_end)}`:"";return l`<div class="term">
      <div class="term-head">
        <span class="term-name">${t.term}</span>
        ${e!=null?l`<span class="term-pct">${e}%</span>`:c}
      </div>
      ${e!=null?l`<div
            class="bar"
            role="progressbar"
            aria-label=${`${t.term} progress`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${e}
          >
            <div class="bar-fill" style=${g({width:`${e}%`})}></div>
          </div>`:c}
      <div class="term-meta">
        ${t.term_school_days!=null&&t.term_school_days_done!=null?l`<span
              >${t.term_school_days_done} of ${t.term_school_days} school days</span
            >`:c}
        ${s?l`<span>${s}${t.days_until_term_end===0?" \xB7 today":""}</span>`:c}
      </div>
    </div>`}_facts(t){let e=[];if(!t.is_school_day)if(t.back_to_school){let o=!!t.next_term&&!!t.next_term_start&&t.next_term_start===t.back_to_school?`${t.next_term} starts`:this.hass.translate("ui.card.family_today_school.back_to_school")??"Back to school";e.push(this._fact("mdi:school",o,`${v(this.hass,t.back_to_school)} \xB7 ${R(t.days_until_school)}`))}else t.next_term&&t.next_term_start&&e.push(this._fact("mdi:calendar-start",this.hass.translate("ui.card.family_today_school.next_term")??"Next term",`${t.next_term} \xB7 ${v(this.hass,t.next_term_start)} \xB7 ${R(t.days_until_next_term)}`));return e.length?l`<div class="facts">${e}</div>`:c}_fact(t,e,s){return l`<div class="fact">
      <ha-icon icon=${t}></ha-icon>
      <span class="fact-label">${e}</span>
      <span class="fact-value">${s}</span>
    </div>`}_breaks(t){let e=Math.max(1,this._config.max_breaks??3),s=(t.upcoming_breaks??[]).slice(0,e);return s.length?l`<div class="breaks">
      <div class="breaks-title">${this.hass.translate("ui.card.family_today_school.upcoming_breaks")??"Upcoming breaks"}</div>
      ${s.map(o=>this._breakRow(o))}
    </div>`:l`<div class="empty-breaks">
        ${t.term||t.next_term?this.hass.translate("ui.card.family_today_school.no_school_breaks_in_calendar_yet")??"No school breaks in the calendar yet.":this.hass.translate("ui.card.family_today_school.no_term_dates_configured")??"No term dates configured."}
      </div>`}_breakRow(t){let e=t.end&&t.end!==t.start?`${v(this.hass,t.start)} \u2013 ${v(this.hass,t.end)}`:v(this.hass,t.start),s=t.kind==="inset";return l`<div class=${x({break:!0,inset:s})}>
      <ha-icon icon=${s?"mdi:book-open":"mdi:beach"}></ha-icon>
      <span class="break-name">${t.name}</span>
      <span class="break-count">${R(t.days_until)}</span>
      <span class="break-when">${e}</span>
    </div>`}};J.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-school-card",J);window.customCards=window.customCards||[];window.customCards.push({type:"family-today-card",name:"Family Today",description:"Today's family agenda, school day and bin collections in one card.",preview:!1});window.customCards.push({type:"family-today-school-card",name:"Family Today School",description:"Term progress and upcoming breaks, with one section per child.",preview:!1});console.info("%c FAMILY-TODAY-CARD %c 0.2.0","color:#fff;background:#4285f4;font-weight:700","");})();
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
