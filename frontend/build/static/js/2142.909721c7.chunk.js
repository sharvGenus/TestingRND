(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[2142],{35791:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>p});var s=n(14857),r=n(46589),o=n(12257),i=n(95537),c=n(87233),a=n(4139),l=n(14341),u=n(67535),m=n(62419);const d=n.p+"static/media/coming-soon.69b99428ab9e22eca0ba.png";var h=n(14351),x=n(44414);const g=e=>{let{count:t,label:n}=e;const a=(0,s.A)(),l=(0,r.A)(a.breakpoints.down("sm"));return(0,x.jsx)(h.A,{content:!1,sx:{width:{xs:60,sm:80}},children:(0,x.jsxs)(o.A,{justifyContent:"center",alignItems:"center",children:[(0,x.jsx)(i.A,{sx:{py:1.75},children:(0,x.jsx)(c.A,{variant:l?"h4":"h2",children:t})}),(0,x.jsx)(i.A,{sx:{p:.5,bgcolor:"secondary.lighter",width:"100%"},children:(0,x.jsx)(c.A,{align:"center",variant:"subtitle2",children:n})})]})})};const p=function(){const e=new Date;e.setSeconds(e.getSeconds()+172800-55800);const{seconds:t,minutes:n,hours:s,days:r}=(0,m.useTimer)({expiryTimestamp:e});return(0,x.jsx)(x.Fragment,{children:(0,x.jsxs)(a.Ay,{container:!0,spacing:4,direction:"column",alignItems:"center",justifyContent:"center",sx:{minHeight:"100vh",py:2},children:[(0,x.jsx)(a.Ay,{item:!0,xs:12,children:(0,x.jsx)(i.A,{sx:{height:{xs:310,sm:420},width:{xs:360,sm:"auto"}},children:(0,x.jsx)("img",{src:d,alt:"mantis",style:{height:"100%",width:"100%"}})})}),(0,x.jsx)(a.Ay,{item:!0,xs:12,children:(0,x.jsxs)(o.A,{spacing:1,justifyContent:"center",alignItems:"center",sx:{mt:-2},children:[(0,x.jsx)(c.A,{align:"center",variant:"h1",children:"Coming Soon"}),(0,x.jsx)(c.A,{align:"center",color:"textSecondary",children:"Something new is on its way"})]})}),(0,x.jsx)(a.Ay,{item:!0,xs:12,sx:{width:{xs:"95%",md:"40%"}},children:(0,x.jsxs)(o.A,{direction:"row",alignItems:"center",justifyContent:"center",spacing:{xs:1,sm:2},children:[(0,x.jsx)(g,{count:r,label:"day"}),(0,x.jsx)(c.A,{variant:"h1",children:" : "}),(0,x.jsx)(g,{count:s,label:"hour"}),(0,x.jsx)(c.A,{variant:"h1",children:" : "}),(0,x.jsx)(g,{count:n,label:"min"}),(0,x.jsx)(c.A,{variant:"h1",children:" : "}),(0,x.jsx)(g,{count:t,label:"sec"})]})}),(0,x.jsx)(a.Ay,{item:!0,xs:12,sx:{width:{xs:380,md:"40%",lg:"30%"}},children:(0,x.jsxs)(o.A,{spacing:2,sx:{mt:2},children:[(0,x.jsx)(c.A,{align:"center",color:"textSecondary",children:"Be the first to be notified when Mantis launches."}),(0,x.jsxs)(o.A,{direction:"row",spacing:1,children:[(0,x.jsx)(l.A,{fullWidth:!0,placeholder:"Email Address"}),(0,x.jsx)(u.A,{variant:"contained",sx:{width:"50%"},children:"Notify Me"})]})]})})]})})}},62419:function(e,t,n){var s;"undefined"!=typeof self&&self,e.exports=(s=n(9950),(()=>{"use strict";var e={156:e=>{e.exports=s}},t={};function n(s){var r=t[s];if(void 0!==r)return r.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,n),o.exports}n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{n.r(r),n.d(r,{default:()=>m,useStopwatch:()=>l,useTime:()=>u,useTimer:()=>a});var e=n(156);class t{static expiryTimestamp(e){const t=new Date(e).getTime()>0;return t||console.warn("react-timer-hook: { useTimer } Invalid expiryTimestamp settings",e),t}static onExpire(e){const t=e&&"function"==typeof e;return e&&!t&&console.warn("react-timer-hook: { useTimer } Invalid onExpire settings function",e),t}}class s{static getTimeFromSeconds(e){const t=Math.ceil(e),n=Math.floor(t/86400),s=Math.floor(t%86400/3600),r=Math.floor(t%3600/60);return{totalSeconds:t,seconds:Math.floor(t%60),minutes:r,hours:s,days:n}}static getSecondsFromExpiry(e,t){const n=e-(new Date).getTime();if(n>0){const e=n/1e3;return t?Math.round(e):e}return 0}static getSecondsFromPrevTime(e,t){const n=(new Date).getTime()-e;if(n>0){const e=n/1e3;return t?Math.round(e):e}return 0}static getSecondsFromTimeNow(){const e=new Date;return e.getTime()/1e3-60*e.getTimezoneOffset()}static getFormattedTimeFromSeconds(e,t){const{seconds:n,minutes:r,hours:o}=s.getTimeFromSeconds(e);let i="",c=o;return"12-hour"===t&&(i=o>=12?"pm":"am",c=o%12),{seconds:n,minutes:r,hours:c,ampm:i}}}function o(t,n){const s=(0,e.useRef)();(0,e.useEffect)((()=>{s.current=t})),(0,e.useEffect)((()=>{if(!n)return()=>{};const e=setInterval((()=>{s.current&&s.current()}),n);return()=>clearInterval(e)}),[n])}const i=1e3;function c(e){if(!t.expiryTimestamp(e))return null;const n=s.getSecondsFromExpiry(e),r=Math.floor(1e3*(n-Math.floor(n)));return r>0?r:i}function a(){let{expiryTimestamp:n,onExpire:r,autoStart:a=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const[l,u]=(0,e.useState)(n),[m,d]=(0,e.useState)(s.getSecondsFromExpiry(l)),[h,x]=(0,e.useState)(a),[g,p]=(0,e.useState)(a),[f,S]=(0,e.useState)(c(l)),y=(0,e.useCallback)((()=>{t.onExpire(r)&&r(),x(!1),S(null)}),[r]),T=(0,e.useCallback)((()=>{x(!1)}),[]),j=(0,e.useCallback)((function(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];S(c(e)),p(t),x(t),u(e),d(s.getSecondsFromExpiry(e))}),[]),v=(0,e.useCallback)((()=>{const e=new Date;e.setMilliseconds(e.getMilliseconds()+1e3*m),j(e)}),[m,j]),w=(0,e.useCallback)((()=>{g?(d(s.getSecondsFromExpiry(l)),x(!0)):v()}),[l,g,v]);return o((()=>{f!==i&&S(i);const e=s.getSecondsFromExpiry(l);d(e),e<=0&&y()}),h?f:null),{...s.getTimeFromSeconds(m),start:w,pause:T,resume:v,restart:j,isRunning:h}}function l(){let{autoStart:t,offsetTimestamp:n}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const[r,i]=(0,e.useState)(s.getSecondsFromExpiry(n,!0)||0),[c,a]=(0,e.useState)(new Date),[l,u]=(0,e.useState)(r+s.getSecondsFromPrevTime(c||0,!0)),[m,d]=(0,e.useState)(t);o((()=>{u(r+s.getSecondsFromPrevTime(c,!0))}),m?1e3:null);const h=(0,e.useCallback)((()=>{const e=new Date;a(e),d(!0),u(r+s.getSecondsFromPrevTime(e,!0))}),[r]),x=(0,e.useCallback)((()=>{i(l),d(!1)}),[l]),g=(0,e.useCallback)((function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];const n=s.getSecondsFromExpiry(e,!0)||0,r=new Date;a(r),i(n),d(t),u(n+s.getSecondsFromPrevTime(r,!0))}),[]);return{...s.getTimeFromSeconds(l),start:h,pause:x,reset:g,isRunning:m}}function u(){let{format:t}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const[n,r]=(0,e.useState)(s.getSecondsFromTimeNow());return o((()=>{r(s.getSecondsFromTimeNow())}),1e3),{...s.getFormattedTimeFromSeconds(n,t)}}function m(t){if((0,e.useEffect)((()=>{console.warn("react-timer-hook: default export useTimer is deprecated, use named exports { useTimer, useStopwatch, useTime } instead")}),[]),t.expiryTimestamp){const e=a(t);return{...e,startTimer:e.start,stopTimer:e.pause,resetTimer:()=>{}}}const n=l(t);return{...n,startTimer:n.start,stopTimer:n.pause,resetTimer:n.reset}}})(),r})())}}]);