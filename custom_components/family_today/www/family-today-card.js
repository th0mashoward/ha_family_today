"use strict";(()=>{var O=globalThis,L=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),ct=new WeakMap,C=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(L&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=ct.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ct.set(e,t))}return t}toString(){return this.cssText}},dt=o=>new C(typeof o=="string"?o:o+"",void 0,V),Y=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,n)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new C(e,o,V)},ht=(o,t)=>{if(L)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=O.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},q=L?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return dt(e)})(o):o;var{is:Nt,defineProperty:Ot,getOwnPropertyDescriptor:Lt,getOwnPropertyNames:Ft,getOwnPropertySymbols:zt,getPrototypeOf:It}=Object,F=globalThis,pt=F.trustedTypes,jt=pt?pt.emptyScript:"",Bt=F.reactiveElementPolyfillSupport,T=(o,t)=>o,J={toAttribute(o,t){switch(t){case Boolean:o=o?jt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},mt=(o,t)=>!Nt(o,t),ut={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:mt};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ut){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ot(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=Lt(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){let c=i?.call(this);n?.call(this,r),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ut}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=It(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,s=[...Ft(e),...zt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(q(i))}else t!==void 0&&e.push(q(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:J).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:J;this._$Em=i;let c=r.fromAttribute(e,n.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let r=this.constructor;if(i===!1&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??mt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:r}=n,c=this[i];r!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,n,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[T("elementProperties")]=new Map,y[T("finalized")]=new Map,Bt?.({ReactiveElement:y}),(F.reactiveElementVersions??=[]).push("2.1.2");var st=globalThis,ft=o=>o,z=st.trustedTypes,gt=z?z.createPolicy("lit-html",{createHTML:o=>o}):void 0,xt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+v,Kt=`<${wt}>`,x=document,P=()=>x.createComment(""),D=o=>o===null||typeof o!="object"&&typeof o!="function",it=Array.isArray,Wt=o=>it(o)||typeof o?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,yt=/-->/g,_t=/>/g,$=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,$t=/"/g,At=/^(?:script|style|textarea|title)$/i,ot=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),d=ot(1),se=ot(2),ie=ot(3),m=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),bt=new WeakMap,b=x.createTreeWalker(x,129);function Et(o,t){if(!it(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return gt!==void 0?gt.createHTML(t):t}var Vt=(o,t)=>{let e=o.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",r=k;for(let c=0;c<e;c++){let a=o[c],p,u,h=-1,g=0;for(;g<a.length&&(r.lastIndex=g,u=r.exec(a),u!==null);)g=r.lastIndex,r===k?u[1]==="!--"?r=yt:u[1]!==void 0?r=_t:u[2]!==void 0?(At.test(u[2])&&(i=RegExp("</"+u[2],"g")),r=$):u[3]!==void 0&&(r=$):r===$?u[0]===">"?(r=i??k,h=-1):u[1]===void 0?h=-2:(h=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?$:u[3]==='"'?$t:vt):r===$t||r===vt?r=$:r===yt||r===_t?r=k:(r=$,i=void 0);let _=r===$&&o[c+1].startsWith("/>")?" ":"";n+=r===k?a+Kt:h>=0?(s.push(p),a.slice(0,h)+xt+a.slice(h)+v+_):a+v+(h===-2?c:_)}return[Et(o,n+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},R=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0,c=t.length-1,a=this.parts,[p,u]=Vt(t,e);if(this.el=o.createElement(p,s),b.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=b.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(xt)){let g=u[r++],_=i.getAttribute(h).split(v),N=/([.?@])?(.*)/.exec(g);a.push({type:1,index:n,name:N[2],strings:_,ctor:N[1]==="."?Q:N[1]==="?"?X:N[1]==="@"?tt:A}),i.removeAttribute(h)}else h.startsWith(v)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(At.test(i.tagName)){let h=i.textContent.split(v),g=h.length-1;if(g>0){i.textContent=z?z.emptyScript:"";for(let _=0;_<g;_++)i.append(h[_],P()),b.nextNode(),a.push({type:2,index:++n});i.append(h[g],P())}}}else if(i.nodeType===8)if(i.data===wt)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(v,h+1))!==-1;)a.push({type:7,index:n}),h+=v.length-1}n++}}static createElement(t,e){let s=x.createElement("template");return s.innerHTML=t,s}};function w(o,t,e=o,s){if(t===m)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=D(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=w(o,i._$AS(o,t.values),i,s)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??x).importNode(e,!0);b.currentNode=i;let n=b.nextNode(),r=0,c=0,a=s[0];for(;a!==void 0;){if(r===a.index){let p;a.type===2?p=new M(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new et(n,this,t)),this._$AV.push(p),a=s[++c]}r!==a?.index&&(n=b.nextNode(),r++)}return b.currentNode=x,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),D(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==m&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=R.createElement(Et(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new G(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=bt.get(t.strings);return e===void 0&&bt.set(t.strings,e=new R(t)),e}k(t){it(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new o(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ft(t).nextSibling;ft(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=l}_$AI(t,e=this,s,i){let n=this.strings,r=!1;if(n===void 0)t=w(this,t,e,0),r=!D(t)||t!==this._$AH&&t!==m,r&&(this._$AH=t);else{let c=t,a,p;for(t=n[0],a=0;a<n.length-1;a++)p=w(this,c[s+a],e,a),p===m&&(p=this._$AH[a]),r||=!D(p)||p!==this._$AH[a],p===l?t=l:t!==l&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}r&&!i&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Q=class extends A{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},X=class extends A{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},tt=class extends A{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??l)===m)return;let s=this._$AH,i=t===l&&s!==l||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==l&&(s===l||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},et=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Yt=st.litHtmlPolyfillSupport;Yt?.(R,M),(st.litHtmlVersions??=[]).push("3.3.3");var St=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new M(t.insertBefore(P(),n),n,void 0,e??{})}return i._$AI(o),i};var nt=globalThis,f=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=St(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return m}};f._$litElement$=!0,f.finalized=!0,nt.litElementHydrateSupport?.({LitElement:f});var qt=nt.litElementPolyfillSupport;qt?.({LitElement:f});(nt.litElementVersions??=[]).push("4.2.2");var I={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},j=o=>(...t)=>({_$litDirective$:o,values:t}),E=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var B=j(class extends E{constructor(o){if(super(o),o.type!==I.ATTRIBUTE||o.name!=="class"||o.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(o){return" "+Object.keys(o).filter(t=>o[t]).join(" ")+" "}update(o,[t]){if(this.st===void 0){this.st=new Set,o.strings!==void 0&&(this.nt=new Set(o.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(let s in t)t[s]&&!this.nt?.has(s)&&this.st.add(s);return this.render(t)}let e=o.element.classList;for(let s of this.st)s in t||(e.remove(s),this.st.delete(s));for(let s in t){let i=!!t[s];i===this.st.has(s)||this.nt?.has(s)||(i?(e.add(s),this.st.add(s)):(e.remove(s),this.st.delete(s)))}return m}});var Ct="important",Jt=" !"+Ct,S=j(class extends E{constructor(o){if(super(o),o.type!==I.ATTRIBUTE||o.name!=="style"||o.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((t,e)=>{let s=o[e];return s==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(o,[t]){let{style:e}=o.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let s of this.ft)t[s]==null&&(this.ft.delete(s),s.includes("-")?e.removeProperty(s):e[s]=null);for(let s in t){let i=t[s];if(i!=null){this.ft.add(s);let n=typeof i=="string"&&i.endsWith(Jt);s.includes("-")||n?e.setProperty(s,n?i.slice(0,-11):i,n?Ct:""):e[s]=i}}return m}});var K="sensor.family_today_today",Pt="sensor.family_today_next_bin_collection",Tt=["#4285f4","#e8710a","#0f9d58","#a142f4","#d93025","#12b5cb","#f9ab00","#e52592"];function Dt(o,t){if(t?.[o])return t[o];let e=0;for(let s of o)e=e*31+s.charCodeAt(0)>>>0;return Tt[e%Tt.length]}function rt(o,t){if(o.all_day)return"all-day";let e=Date.parse(o.start);return Date.parse(o.end)<=t?"past":e<=t?"now":"upcoming"}function at(o){return o.locale?.language||o.language||"en"}function kt(o,t){let e=o.locale?.time_format,s=e==="12"?!0:e==="24"?!1:void 0;return new Date(t).toLocaleTimeString(at(o),{hour:"numeric",minute:"2-digit",hour12:s})}function lt(o,t){return t.all_day?"All day":`${kt(o,t.start)} \u2013 ${kt(o,t.end)}`}function Rt(o,t){let e=new Date(t.start);if(!t.all_day)return`${U(o,e.getTime())} \xB7 ${lt(o,t)}`;let s=new Date(t.end),i=new Date(s.getFullYear(),s.getMonth(),s.getDate()-1),n=e.getFullYear()===i.getFullYear()&&e.getMonth()===i.getMonth()&&e.getDate()===i.getDate(),r=U(o,e.getTime());return n?`All day \xB7 ${r}`:`All day \xB7 ${r} \u2013 ${U(o,i.getTime())}`}function U(o,t){return new Date(t).toLocaleDateString(at(o),{weekday:"long",day:"numeric",month:"long"})}function Mt(o,t){let[e,s,i]=t.split("-").map(Number);return new Date(e,s-1,i).toLocaleDateString(at(o),{weekday:"short",day:"numeric",month:"short"})}function Ut(o){let t=Math.max(0,Math.round(o/6e4));if(t<1)return"now";if(t<60)return`in ${t} min`;let e=Math.floor(t/60),s=t%60;return s?`in ${e}h ${s}m`:`in ${e}h`}function Ht(o){return{type:"custom:family-today-card",layout:"list",show_all_day:!0,show_bins:!0,show_school:!0,show_next_bin:!0,hide_past:!1,...o}}var Zt=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"list",label:"Chronological list"},{value:"lanes",label:"Lane per person"}]}}},{type:"grid",name:"",schema:[{name:"show_school",selector:{boolean:{}}},{name:"show_bins",selector:{boolean:{}}},{name:"show_next_bin",selector:{boolean:{}}},{name:"show_all_day",selector:{boolean:{}}},{name:"hide_past",selector:{boolean:{}}}]}],Gt={entity:"Family Today sensor",title:"Title (optional, defaults to today's date)",layout:"Layout",show_school:"Show school day badge",show_bins:"Show bin banners",show_next_bin:"Show next bin collection",show_all_day:"Show all-day events",hide_past:"Hide events that have finished"},W=class extends f{setConfig(t){this._config=t}render(){return this._config?d`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Zt}
        .computeLabel=${t=>Gt[t.name]??t.name}
        @value-changed=${this._changed}
      ></ha-form>
    `:d``}_changed(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};W.properties={hass:{attribute:!1},_config:{state:!0}};customElements.define("family-today-card-editor",W);var H=class extends f{constructor(){super();this._onKeyDown=e=>{e.key==="Escape"&&this._selected&&(this._selected=null)};this._now=Date.now(),this._selected=null}setConfig(e){if(e.layout&&!["list","lanes"].includes(e.layout))throw new Error("layout must be 'list' or 'lanes'");this._config=Ht(e)}getCardSize(){let e=this._attrs();return 2+Math.min(e?.agenda.length??0,8)}static getStubConfig(){return{entity:K}}static getConfigElement(){return document.createElement("family-today-card-editor")}connectedCallback(){super.connectedCallback(),this._now=Date.now(),this._timer=window.setInterval(()=>this._now=Date.now(),3e4),window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&window.clearInterval(this._timer),window.removeEventListener("keydown",this._onKeyDown)}_openEvent(e){this._selected=e}_closeEvent(){this._selected=null}_eventKey(e,s){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._openEvent(s))}_entity(){let e=this.hass?.states??{},s=this._config.entity??K;if(e[s])return{id:s,ent:e[s]};if(!this._config.entity){for(let[i,n]of Object.entries(e))if(i.startsWith("sensor.")&&Array.isArray(n.attributes?.agenda)&&"by_person"in n.attributes)return{id:i,ent:n}}return null}_attrs(){return this._config?this._entity()?.ent.attributes??null:null}_color(e){return Dt(e,this._config.colors)}_moreInfo(){let e=this._entity()?.id;e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return l;let e=this._entity();if(!e)return d`<ha-card>
        <div class="empty">
          Family Today sensor not found
          (<code>${this._config.entity??K}</code>).
        </div>
      </ha-card>`;let s=e.ent.attributes,i=this._config;return d`
      <ha-card @click=${this._moreInfo}>
        ${this._header(s)} ${this._banners(s)} ${this._next(s)}
        ${i.layout==="lanes"?this._lanes(s):this._list(s)}
      </ha-card>
      ${this._selected?this._eventDialog(this._selected):l}
    `}_header(e){let s=U(this.hass,this._now),{title:i,show_school:n}=this._config;return d`
      <div class="header">
        <div class="titles">
          <div class="title">${i??s}</div>
          ${i?d`<div class="subtitle">${s}</div>`:l}
        </div>
        ${n?d`<span class=${B({chip:!0,school:e.school_day})}>
              <ha-icon icon=${e.school_day?"mdi:school":"mdi:school-outline"}></ha-icon>
              ${e.school_day?"School day":"No school"}
            </span>`:l}
      </div>
    `}_banners(e){let{show_bins:s,show_next_bin:i}=this._config;if(!s)return l;let n=[];if(e.bins_today?.length&&n.push(this._banner("mdi:trash-can","Bin day today",e.bins_today.join(", "))),e.bins_tomorrow?.length&&n.push(this._banner("mdi:trash-can-outline","Bins out tonight",e.bins_tomorrow.join(", "))),!n.length&&i){let r=this.hass.states[this._config.bin_entity??Pt];if(r&&/^\d{4}-\d{2}-\d{2}$/.test(r.state)){let c=r.attributes.bins?.join(", ")??"",a=r.attributes.days_until,p=a===1?"tomorrow":a!=null?`in ${a} days`:"";n.push(this._banner("mdi:calendar-clock",`Next bins \xB7 ${Mt(this.hass,r.state)}`,[c,p&&`(${p})`].filter(Boolean).join(" "),!0))}}return n.length?d`<div class="banners">${n}</div>`:l}_banner(e,s,i,n=!1){return d`<div class=${B({banner:!0,muted:n})}>
      <ha-icon icon=${e}></ha-icon>
      <span class="label">${s}</span>
      <span class="text">${i}</span>
    </div>`}_next(e){let s=e.next_event;if(!s)return l;let i=Date.parse(s.start)-this._now;return i<=0?l:d`<div
      class="next"
      role="button"
      tabindex="0"
      aria-label=${`Details for ${s.summary}`}
      @click=${n=>{n.stopPropagation(),this._openEvent(s)}}
      @keydown=${n=>this._eventKey(n,s)}
    >
      <span class="dot" style=${S({background:this._color(s.person)})}></span>
      <span class="next-text"><strong>Next:</strong> ${s.summary}</span>
      <span class="next-when">${Ut(i)}</span>
    </div>`}_visible(e){return this._config.hide_past?e.filter(s=>rt(s,this._now)!=="past"):e}_list(e){let s=this._visible(e.agenda??[]),i=s.filter(r=>r.all_day),n=s.filter(r=>!r.all_day);return s.length?d`
      ${this._config.show_all_day&&i.length?d`<div class="allday">
            ${i.map(r=>d`<span
                class="allday-chip"
                style=${S({"--person-color":this._color(r.person)})}
                role="button"
                tabindex="0"
                aria-label=${`Details for ${r.summary}`}
                @click=${c=>{c.stopPropagation(),this._openEvent(r)}}
                @keydown=${c=>this._eventKey(c,r)}
                >${r.summary}</span
              >`)}
          </div>`:l}
      <div class="events">${n.map(r=>this._eventRow(r))}</div>
    `:d`<div class="empty">Nothing scheduled today</div>`}_lanes(e){let s=e.people?.length?e.people:Object.keys(e.by_person??{});return s.length?d`<div class="lanes">
      ${s.map(i=>{let n=this._visible(e.by_person?.[i]??[]);return d`<div class="lane" style=${S({"--person-color":this._color(i)})}>
          <div class="lane-head"><span class="dot"></span>${i}</div>
          ${n.length?n.map(r=>this._eventRow(r)):d`<div class="lane-empty">Nothing on</div>`}
        </div>`})}
    </div>`:d`<div class="empty">Nothing scheduled today</div>`}_eventRow(e){let s=rt(e,this._now);return d`<div
      class=${B({event:!0,past:s==="past",now:s==="now"})}
      style=${S({"--person-color":this._color(e.person)})}
      role="button"
      tabindex="0"
      aria-label=${`Details for ${e.summary}`}
      @click=${i=>{i.stopPropagation(),this._openEvent(e)}}
      @keydown=${i=>this._eventKey(i,e)}
    >
      <div class="time">${lt(this.hass,e)}</div>
      <div class="body">
        <div class="summary">${e.summary}</div>
        ${e.location?d`<div class="meta"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.location}</div>`:l}
      </div>
    </div>`}_eventDialog(e){return d`<div
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
            <div class="dialog-sub">${Rt(this.hass,e)}</div>
          </div>
          <button class="close" aria-label="Close" @click=${this._closeEvent}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">
          ${e.location?d`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${e.location}</span>
              </div>`:l}
          <div class="detail">
            <span class="dot" style=${S({background:this._color(e.person)})}></span>
            <span>${e.person}</span>
          </div>
          ${e.description?d`<div class="description">${e.description}</div>`:l}
        </div>
      </div>
    </div>`}};H.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0},_selected:{state:!0}},H.styles=Y`
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
    .description { padding-top: 12px; line-height: 1.4; overflow-wrap: anywhere; white-space: pre-wrap;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); }
  `;customElements.define("family-today-card",H);window.customCards=window.customCards||[];window.customCards.push({type:"family-today-card",name:"Family Today",description:"Today's family agenda, school day and bin collections in one card.",preview:!1});console.info("%c FAMILY-TODAY-CARD %c 0.1.0","color:#fff;background:#4285f4;font-weight:700","");})();
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
