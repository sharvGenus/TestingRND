(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[7396],{97969:(e,t,n)=>{"use strict";n.d(t,{m:()=>l});var i=n(62345),s=n(59254);const r={padding:"10px",fontSize:"22px",marginRight:"7px",animation:"rotate 4s linear infinite","@keyframes rotate":{from:{transform:"rotate(0deg)"},to:{transform:"rotate(360deg)"}}},l=(0,s.Ay)(i.A)((e=>{let{theme:t,color:n}=e;return{...r,color:n||t.palette.text.primary}}))},27423:(e,t,n)=>{"use strict";n.d(t,{A:()=>w});var i=n(9950),s=n(95537),r=n(53065),l=n(70146),o=n(89379);const a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"}}]},name:"edit",theme:"outlined"};var d=n(14840),c=function(e,t){return i.createElement(d.A,(0,o.A)((0,o.A)({},e),{},{ref:t,icon:a}))};const h=i.forwardRef(c);var x=n(65669),u=n(67535),m=n(90531),g=n(62054),f=n(44414);const p=(0,l.A)(h)({padding:"10px",fontSize:"22px",marginRight:"7px"}),y=(0,l.A)(s.A)({display:"flex",justifyContent:"center",cursor:"pointer"});function j(e){let{isOpen:t,onClose:n,setSegments:s}=e;const[r,l]=(0,i.useState)("");return(0,f.jsx)(x.A,{open:t,onClose:n,style:{display:"flex",alignItems:"center",justifyContent:"center"},children:(0,f.jsxs)("div",{style:{padding:"20px",backgroundColor:"white"},children:[(0,f.jsx)("div",{style:{height:"250px",overflowX:"hidden"},children:(0,f.jsx)(m.A,{rowsMin:10,placeholder:"Enter serial numbers here...",value:r,onChange:e=>l(e.target.value),style:{width:"500px",height:"230px",overflowY:"auto"}})}),(0,f.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"10px"},children:[(0,f.jsx)(u.A,{onClick:n,children:"Cancel"}),(0,f.jsx)(u.A,{variant:"contained",color:"primary",onClick:()=>{const e=r.split("\n").filter((e=>""!==e.trim())),t=[...new Set(e)];e.length===t.length?(s(t),n()):(0,g.A)("Duplicate serial numbers found. Kindly remove them.",{variant:"error"})},children:"Save"})]})]})})}const w=e=>{let{segments:t,setSegments:n,forDevolution:s=!1}=e;const[l,o]=(0,i.useState)(!1);return(0,f.jsx)(f.Fragment,{children:(0,f.jsxs)(y,{children:[(0,f.jsx)(j,{isOpen:l,onClose:()=>o(!1),setSegments:async e=>{try{if(!s&&e.length!==t.length)throw new Error(`Input contains ${e.length>t.length?"more":"less"} serial numbers than the quantity used`);n(e)}catch(r){i=null===r||void 0===r?void 0:r.message,(0,g.A)(i||"Something went wrong",{variant:"error"})}var i}}),(0,f.jsx)(r.A,{title:"Import from input",placement:"bottom",children:(0,f.jsx)(p,{onClick:()=>o(!0)})})]})})}},95615:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>A});var i=n(57560),s=n(65669),r=n(95537),l=n(87233),o=n(4139),a=n(67535),d=n(9950),c=n(25411),h=n(9912),x=n(61977),u=n(87125),m=n(22759),g=n(27423),f=n(86366),p=n(14351),y=n(62054),j=n(44414);const w={cursor:"pointer",fontSize:24},A=e=>{let{open:t,onClose:n,serialNumberData:A,showCheckboxes:C,onSave:b,selectedSerials:v,maxQuantity:k=0,noDisable:S}=e;const[N,W]=(0,d.useState)([]),V=Number(k);(0,d.useEffect)((()=>{v&&W(v)}),[v]);const D=(0,d.useMemo)((()=>A||[]),[A]),F=(e,t)=>e&&N.length+1>V?((0,y.A)("Cannot select more serial numbers than the used quantity",{variant:"info"}),!1):(W(e?e=>e.concat(t):e=>e.filter((e=>e!==t))),!0),E=!S&&N.length!==V,[z,I]=(0,d.useState)([]),L=(0,d.useCallback)((function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"File";e.some((e=>!D.includes(e)))?(0,y.A)(`${t} contains serial number(s) which are not in the store`,{variant:"error"}):W(e)}),[D]);return(0,d.useEffect)((()=>{I(Array(parseInt(V)).fill(""))}),[V,I]),(0,j.jsx)(s.A,{open:t,onClose:n,"aria-labelledby":"modal-modal-title",children:(0,j.jsxs)(p.A,{sx:{width:C?1e3:500},modal:!0,darkTitle:!0,content:!1,children:[(0,j.jsxs)(r.A,{display:"flex",mt:"1rem",mx:"2.4rem",children:[(0,j.jsx)(l.A,{variant:"h3",mt:"5px",children:"Serial Numbers"}),C&&(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(x.A,{segments:z,setSegments:L}),(0,j.jsx)(g.A,{segments:z,setSegments:e=>{L(e,"Input")}})]}),(0,j.jsx)(r.A,{position:"absolute",top:"15px",right:"21px",children:(0,j.jsx)(i.A,{onClick:n,style:w})})]}),(0,j.jsxs)(o.Ay,{container:!0,spacing:2,style:{display:"grid",gridTemplateColumns:"auto auto"},children:[(0,j.jsx)(o.Ay,{item:!0,xs:6,mx:5,mt:1,mb:C?1:2,style:{height:450,display:"flex",flexDirection:"column"},children:(0,j.jsxs)(u.K3,{style:{flex:1,display:"flex",flexDirection:"column"},children:[(0,j.jsxs)(r.A,{display:"flex",style:{height:48},children:[(0,j.jsx)(u.A3,{width:"20%",children:"S.No."}),(0,j.jsx)(u.A3,{width:C?"60%":"80%",children:"Serial Number"}),C&&(0,j.jsx)(u.A3,{width:"20%",children:(0,j.jsx)(m.PY,{blueBackground:!0,checked:N.length===D.length||!!N.length&&"indeterminate",onChecked:e=>e&&D.length>V?((0,y.A)(`Only the first ${V} serial numbers will be selected`,{variant:"info"}),W(D.slice(0,V)),"indeterminate"):e?(W(D),!0):(W([]),!0)})})]}),(0,j.jsx)(r.A,{style:{flex:1,display:"flex"},children:(0,j.jsx)(c.Ay,{children:e=>{let{height:t,width:n}=e;return(0,j.jsx)(h.Y1,{height:t,width:n,itemCount:D.length,itemSize:48,itemData:{originalData:D,showCheckboxes:C,selectedSerials:N,handleCheckboxChange:F},overscanCount:5,children:m.Ay})}})})]})}),C&&(0,j.jsx)(o.Ay,{item:!0,xs:6,mx:5,mt:1,mb:C?1:2,style:{height:450,display:"flex",flexDirection:"column"},children:(0,j.jsxs)(u.K3,{style:{flex:1,display:"flex",flexDirection:"column"},children:[(0,j.jsxs)(r.A,{display:"flex",style:{height:48},children:[(0,j.jsx)(u.A3,{width:"20%",children:"S.No."}),(0,j.jsx)(u.A3,{width:C?"60%":"80%",children:"Selected Serial Numbers"}),(0,j.jsx)(u.A3,{width:"20%"})]}),(0,j.jsxs)(r.A,{style:{flex:1,display:"flex"},children:[N&&N.length>0&&(0,j.jsx)(c.Ay,{children:e=>{let{height:t,width:n}=e;return(0,j.jsx)(h.Y1,{height:t,width:n,itemCount:N.length,itemSize:48,itemData:{selectedSerials:N,showCheckboxes:C,handleCheckboxChange:F},overscanCount:5,children:f.Ay})}}),N&&0===N.length&&(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(u.VW,{width:"20%"}),(0,j.jsx)(u.VW,{width:C?"60%":"80%",children:"No serial numbers selected"}),(0,j.jsx)(u.VW,{width:"20%"})]})]})]})})]}),C&&(0,j.jsx)(o.Ay,{item:!0,xs:12,sx:{textAlign:"center"},mb:2,children:(0,j.jsx)(a.A,{disabled:E,variant:"contained",onClick:()=>{b(N,D.filter((e=>!N.includes(e)))),n()},children:"Add"})})]})})}},86366:(e,t,n)=>{"use strict";n.d(t,{Ay:()=>c,DR:()=>d,wj:()=>a});var i=n(96319),s=n(9950),r=n(87125),l=n(44414);const o=(0,s.memo)((e=>{let{index:t,style:n,data:s}=e;const{showCheckboxes:o,selectedSerials:a,handleCheckboxChange:d}=s,c=a[t];return(0,l.jsxs)(r.tf,{index:t,style:n,children:[(0,l.jsx)(r.VW,{width:"20%",children:t+1}),(0,l.jsx)(r.VW,{width:o?"60%":"80%",children:c}),o&&(0,l.jsx)(r.VW,{width:"20%",children:(0,l.jsx)(i.A,{style:{cursor:"pointer"},onClick:()=>{d(!1,c)}})})]},t)})),a=(0,s.memo)((e=>{let{index:t,style:n,data:s}=e;const{showCheckboxes:o,selectedSerials:a,handleCheckboxChange:d}=s,c=a[t];return(0,l.jsxs)(r.tf,{index:t,style:n,children:[(0,l.jsx)(r.VW,{width:"20%",children:t+1}),(0,l.jsx)(r.VW,{width:o?"60%":"80%",children:c.oldSerialNo}),o&&(0,l.jsx)(r.VW,{width:"20%",children:(0,l.jsx)(i.A,{style:{cursor:"pointer"},onClick:()=>{d(!1,c)}})})]},t)})),d=(0,s.memo)((e=>{let{index:t,style:n,data:i}=e;const{showCheckboxes:s,rejectedSerials:o}=i,a=o[t];return(0,l.jsxs)(r.tf,{index:t,style:n,children:[(0,l.jsx)(r.VW,{width:"20%",children:t+1}),(0,l.jsx)(r.VW,{width:s?"60%":"80%",children:a.oldSerialNo})]},t)})),c=o},87125:(e,t,n)=>{"use strict";n.d(t,{A3:()=>l,K3:()=>r,VW:()=>a,tf:()=>o});var i=n(59254),s=n(86898);const r=(0,i.Ay)(s.A)({display:"flex",flexDirection:"column",width:415,overflowY:"auto"}),l=(0,i.Ay)(s.A)({width:e=>e.width||"20%",paddingTop:12,paddingBottom:12,textAlign:"center",backgroundColor:"#1677ff",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}),o=(0,i.Ay)(s.A)((e=>{let{index:t}=e;return{display:"flex",backgroundColor:t%2===0?"#f2f2f2":"transparent",border:"1px solid #ddd","&:hover":{backgroundColor:"#ddd"}}})),a=(0,i.Ay)(s.A)({padding:"8px",display:"flex",alignItems:"center",justifyContent:"center"})},61977:(e,t,n)=>{"use strict";n.d(t,{A:()=>y});var i=n(9950),s=n(55271),r=n(95537),l=n(53065),o=n(70146),a=n(9313),d=n(62054),c=n(97969),h=n(44414);const x="SerialNumbers",u=(0,o.A)(a.A)({padding:"10px",fontSize:"22px",marginRight:"7px"}),m=(0,o.A)(r.A)({display:"flex",justifyContent:"center",cursor:"pointer"}),g=(0,o.A)("input")({display:"none",cursor:"pointer"}),f=(0,o.A)("label")({verticalAlign:"middle",marginLeft:"10px",cursor:"pointer"}),p=["dif","xlt","xltx","fods","ots","html","slk","xlsm","ods","xls","csv","xlsx"],y=e=>{let{segments:t,setSegments:n,forDevolution:r=!1}=e;const[o,a]=(0,i.useState)(!1),y=e=>{(0,d.A)(e||"Something went wrong",{variant:"error"}),a(!1)};return(0,h.jsx)(h.Fragment,{children:(0,h.jsx)(m,{children:(0,h.jsxs)(l.A,{title:"Import from file",placement:"bottom",children:[(0,h.jsx)(f,{htmlFor:"myFile",children:o?(0,h.jsx)(c.m,{className:"rotate"}):(0,h.jsx)(u,{})}),(0,h.jsx)(g,{type:"file",id:"myFile",disabled:o,onChange:async e=>{var i,l;const o=null===e||void 0===e||null===(i=e.target)||void 0===i||null===(l=i.files)||void 0===l?void 0:l[0];o||y("Something went wrong while picking the file!");const d=o.name.split(".").pop();if(!p.includes(d))return void y("File type not supported");a(!0);const c=new FileReader;c.onload=e=>{try{const i=new Uint8Array(e.target.result),l=s.LF(i,{type:"array"}),[d]=l.SheetNames,c=l.Sheets[d],h=s.Wp.sheet_to_json(c,{header:1,raw:!1});if(!h)throw new Error("Something went wrong while parsing the file");const u=h[0].indexOf(x),m=-1!==u,g="text/plain"===o.type&&!m;if(!m&&!g)throw new Error(`Column for serial numbers not found. Looking for column name "${x}"`);const f=g?0:1,p=h.length,y=g?0:u,j=h.slice(f,p).map((e=>e[y])).filter((e=>void 0!==e&&""!==e.trim())),w=[...new Set(j)];if(j.length!==w.length)throw new Error("Duplicate serial numbers found. Kindly remove them.");if(!r&&w.length!==t.length)throw new Error(`File contains ${w.length>t.length?"more":"less"} serial numbers than the quantity used`);n(w),a(!1)}catch(i){y(null===i||void 0===i?void 0:i.message)}},c.readAsArrayBuffer(o)}})]})})})}},22759:(e,t,n)=>{"use strict";n.d(t,{Ay:()=>h,PY:()=>a,ru:()=>c});var i=n(51496),s=n(9950),r=n(87125),l=n(44414);const o={"&.MuiCheckbox-root":{color:"white"},"&.MuiCheckbox-root:hover":{backgroundColor:"rgba(245, 245, 245, 0.4)"}},a=e=>{let{checked:t,onChecked:n,blueBackground:r}=e;const[a,d]=(0,s.useState)(!1);return(0,s.useEffect)((()=>{d(t)}),[t]),(0,l.jsx)(i.A,{checked:!!a,indeterminate:"indeterminate"===a,onChange:e=>{const t=n(e.target.checked);t&&d("indeterminate"===t?t:e.target.checked)},sx:r?o:{},margin:"auto"})},d=(0,s.memo)((e=>{let{index:t,style:n,data:i}=e;const{originalData:s,showCheckboxes:o,selectedSerials:d,handleCheckboxChange:c}=i,h=s[t];return(0,l.jsxs)(r.tf,{index:t,style:n,children:[(0,l.jsx)(r.VW,{width:"20%",children:t+1}),(0,l.jsx)(r.VW,{width:o?"60%":"80%",children:h}),o&&(0,l.jsx)(r.VW,{width:"20%",children:(0,l.jsx)(a,{checked:d.includes(h),onChecked:e=>c(e,h)})})]},t)})),c=(0,s.memo)((e=>{let{index:t,style:n,data:i}=e;const{originalData:s,showCheckboxes:o,selectedSerials:d,handleCheckboxChange:c}=i,h=s[t];return(0,l.jsxs)(r.tf,{index:t,style:n,children:[(0,l.jsx)(r.VW,{width:"20%",children:t+1}),(0,l.jsx)(r.VW,{width:o?"60%":"80%",children:h.oldSerialNo}),o&&(0,l.jsx)(r.VW,{width:"20%",children:(0,l.jsx)(a,{checked:(e=>{var t;return null!==e&&void 0!==e&&null!==(t=e[0])&&void 0!==t&&t.oldSerialNo?e.map((e=>e.oldSerialNo)):e})(d).includes(h.oldSerialNo),onChecked:e=>c(e,h)})})]},t)})),h=d},86898:(e,t,n)=>{"use strict";n.d(t,{A:()=>l});var i=n(44501),s=n(12639);const r=(0,n(1763).A)("MuiBox",["root"]),l=(0,s.A)({defaultClassName:r.root,generateClassName:i.A.generate})},83686:()=>{}}]);