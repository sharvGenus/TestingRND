"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[864,5406],{14846:(e,t,r)=>{r.d(t,{w:()=>g});var a=r(95537),s=r(53065),n=r(37223),o=r(49985),i=r(11066),c=r(36089),d=r(56334),l=r(58281),u=r(59254),m=r(93951),p=r(44414);const v=(0,u.Ay)("div")((e=>{let{margin:t}=e;return{background:"none",border:"none",padding:"3px",margin:t||"-3px",minWidth:"1px"}}));const g=e=>{let{updateReceipt:t,uploadAttachments:r,viewSerialNumbers:u,openPreview:g,initiatePrint:h,initiateDownload:f,noMargins:x,disablePrint:S,disableDownload:j,editButton:A,uploadButton:b=!1,disableUpload:k}=e;return(0,p.jsxs)(a.A,{display:"flex",children:[u&&(0,p.jsx)(s.A,{title:b?"View Old Serial Numbers":"Print Serial Numbers",placement:"bottom",children:(0,p.jsx)(v,{margin:"-7px",children:(0,p.jsx)(m.A,{onClick:()=>u(),children:(0,p.jsx)(l.A,{})})})}),!x&&(0,p.jsx)(a.A,{sx:{display:"inline-block",width:"7px"}}),A&&(0,p.jsx)(s.A,{title:"Edit E-Way Bill Details",placement:"bottom",children:(0,p.jsx)(v,{...u&&{margin:"-7px"},children:(0,p.jsx)(m.A,{onClick:()=>t(),children:(0,p.jsx)(c.A,{})})})}),b&&(0,p.jsx)(s.A,{title:"Upload Attachments",placement:"bottom",children:(0,p.jsx)(v,{...u&&{margin:"-7px"},children:(0,p.jsx)(m.A,{onClick:()=>r(),disabled:k,children:(0,p.jsx)(d.A,{})})})}),!x&&(0,p.jsx)(a.A,{sx:{display:"inline-block",width:"7px"}}),(0,p.jsx)(s.A,{title:"Preview",placement:"bottom",children:(0,p.jsx)(v,{...u&&{margin:"-7px"},children:(0,p.jsx)(m.A,{onClick:()=>g(),children:(0,p.jsx)(o.A,{})})})}),!x&&(0,p.jsx)(a.A,{sx:{display:"inline-block",width:"7px"}}),(0,p.jsx)(s.A,{title:"Print",placement:"bottom",children:(0,p.jsx)("span",{children:(0,p.jsx)(v,{...u&&{margin:"-7px"},children:(0,p.jsx)(m.A,{onClick:()=>h(),disabled:S,children:(0,p.jsx)(i.A,{})})})})}),!x&&(0,p.jsx)(a.A,{sx:{display:"inline-block",width:"7px"}}),(0,p.jsx)(s.A,{title:"Download",placement:"bottom",children:(0,p.jsx)("span",{children:(0,p.jsx)(v,{...u&&{margin:"-7px"},children:(0,p.jsx)(m.A,{onClick:()=>f(),disabled:j,children:(0,p.jsx)(n.A,{})})})})})]})};g.defaultProps={noMargins:!1}},93951:(e,t,r)=>{r.d(t,{A:()=>n});const{IconButton:a,styled:s}=r(505),n=s(a)((e=>{let{theme:t}=e;return{padding:t.spacing(.5),"& .MuiSvgIcon-root":{fontSize:"20px",color:"#3c3c3c"},"&:disabled .MuiSvgIcon-root":{color:"gray"},"&:hover":{backgroundColor:"#E6F4FF"}}}))},89649:(e,t,r)=>{r.d(t,{A:()=>n});var a=r(9950),s=r(80415);function n(){const[e,t]=(0,a.useState)({pageIndex:s.j7.pageIndex,pageSize:s.j7.pageSize,forceUpdate:!0}),r=(0,a.useCallback)((function(){let r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;t((e=>({pageIndex:r,pageSize:a,forceUpdate:!e.forceUpdate})))}),[e]),n=(0,a.useCallback)((()=>{t((e=>({pageIndex:s.j7.pageIndex,pageSize:s.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>t((t=>({...t,pageIndex:e,forceUpdate:!t.forceUpdate}))),setPageSize:e=>t((t=>({pageIndex:s.j7.pageIndex,pageSize:e,forceUpdate:!t.forceUpdate}))),refreshPagination:n,setPaginationsFunctions:r}}},39225:(e,t,r)=>{r.d(t,{A:()=>o});var a=r(41397),s=r.n(a),n=r(9950);const o=e=>{const{isFcMode:t}=e||{},[r,a]=(0,n.useState)(void 0),[o,i]=(0,n.useState)(!1),c=(0,n.useRef)([]),d=(0,n.useCallback)((e=>{const a=c.current;c.current=e,r&&(t||s().isEqual(e,a)||i((e=>!e)))}),[t,r]),l=(0,n.useMemo)((()=>null===r||void 0===r?void 0:r.trim()),[r]);return{searchString:r,searchStringTrimmed:l,forceSearch:o,accessorsRef:c,setSearchString:a,setAccessors:d}}},88848:(e,t,r)=>{r.d(t,{$:()=>n});var a=r(9950),s=r(27081);const n=()=>{const[e,t]=(0,a.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[r,n]=(0,a.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[o,i]=(0,a.useState)({masterObject:[],error:"",loading:!0}),[c,d]=(0,a.useState)({masterObject:[],error:"",loading:!0}),[l,u]=(0,a.useState)({masterObject:[],error:"",loading:!0}),[m,p]=(0,a.useState)({currencyObject:[],error:"",loading:!0}),[v,g]=(0,a.useState)({gstStatusObject:[],error:"",loading:!0}),[h,f]=(0,a.useState)({paymentTermObject:[],error:"",loading:!0}),[x,S]=(0,a.useState)({incotermsObject:[],error:"",loading:!0}),[j,A]=(0,a.useState)({titleObject:[],error:"",loading:!0}),[b,k]=(0,a.useState)({masterMakerLovHistoryObject:{},error:"",loading:!0}),y=(0,s.d4)((e=>e.masterMakerLov||{})),M=(0,s.d4)((e=>e.masterMakerLovList||{})),H=(0,s.d4)((e=>e.lovsForMasterName||[])),I=(0,s.d4)((e=>e.lovsForMasterNameSecond||[])),z=(0,s.d4)((e=>e.lovsForMasterNameThird||[])),w=(0,s.d4)((e=>e.currency||[])),O=(0,s.d4)((e=>e.gstStatus||[])),C=(0,s.d4)((e=>e.paymentTerm||[])),E=(0,s.d4)((e=>e.incoterms||[])),D=(0,s.d4)((e=>e.title||[])),T=(0,s.d4)((e=>e.masterMakerLovHistory||{}));return(0,a.useEffect)((()=>{t((e=>({...e,...y})))}),[y]),(0,a.useEffect)((()=>{n((e=>({...e,...M})))}),[M]),(0,a.useEffect)((()=>{i((e=>({...e,...H})))}),[H]),(0,a.useEffect)((()=>{d((e=>({...e,...I})))}),[I]),(0,a.useEffect)((()=>{u((e=>({...e,...z})))}),[z]),(0,a.useEffect)((()=>{p((e=>({...e,...w})))}),[w]),(0,a.useEffect)((()=>{g((e=>({...e,...O})))}),[O]),(0,a.useEffect)((()=>{f((e=>({...e,...C})))}),[C]),(0,a.useEffect)((()=>{S((e=>({...e,...E})))}),[E]),(0,a.useEffect)((()=>{A((e=>({...e,...D})))}),[D]),(0,a.useEffect)((()=>{k((e=>({...e,...T})))}),[T]),{masterMakerLovs:e,masterMakerLovsList:r,masterMakerOrgType:o,masterMakerOrgTypeSecond:c,masterMakerOrgTypeThird:l,masterMakerCurrency:m,masterMakerGstStatus:v,masterMakerIncoterms:x,masterMakerPaymentTerm:h,masterMakerLovHistory:b,masterMakerTitle:j}}},56187:(e,t,r)=>{r.r(t),r.d(t,{default:()=>x});var a=r(9950),s=r(27081),n=r(28429),o=r(46091),i=r(29024),c=r(52867),d=r(99635),l=r(89649),u=r(14846),m=r(3252),p=r(39225),v=r(88848),g=r(44414);const h=(0,m.A)((0,a.lazy)((()=>r.e(8820).then(r.bind(r,46439))))),f=[{Header:"Actions",accessor:"actionButtons"},{Header:"Receipt Number",accessor:"referenceDocumentNumber"},{Header:"Project",accessor:"project.name"},{Header:"Company",accessor:"from_store.organization.name"},{Header:"Company Store",accessor:"from_store.name"},{Header:"Contractor",accessor:"to_store.organization.name"},{Header:"Contractor Store",accessor:"to_store.name"},{Header:"Status",accessor:"receiptStatus"},{Header:"Contractor Employee",accessor:"contractor_employee.name"},{Header:"Work Order Number",accessor:"poNumber"},{Header:"Created Date",accessor:"createdAt"},{Header:"Updated Date",accessor:"updatedAt"},{Header:"Remarks",accessor:"remarks"}],x=()=>{var e,t;const r=(0,s.wA)(),{transactionId:m}=(0,n.g)(),[x,S]=(0,a.useState)("closed"),[j,A]=(0,a.useState)(null),[b,k]=(0,a.useState)(null),{paginations:{pageSize:y,pageIndex:M},setPageIndex:H,setPageSize:I}=(0,l.A)(),{searchString:z,setSearchString:w,accessorsRef:O,setAccessors:C,forceSearch:E,searchStringTrimmed:D}=(0,p.A)(),{transactionRequest:T}=(0,o.b)(),{masterMakerOrgType:N}=(0,v.$)(),P=null===N||void 0===N?void 0:N.masterObject,{data:L,count:F}=(0,a.useMemo)((()=>{var e,t,r;return{data:(null===T||void 0===T||null===(e=T.requestDetails)||void 0===e||null===(t=e.rows)||void 0===t?void 0:t.map(((e,t)=>({...e,serialNumber:(M*y-y+t+1).toString(),actionButtons:(0,g.jsx)(u.w,{openPreview:()=>q(t),initiatePrint:()=>B(t),initiateDownload:()=>V(t),noMargins:!0})}))))||[],count:null===T||void 0===T||null===(r=T.requestDetails)||void 0===r?void 0:r.count,isLoading:null===T||void 0===T?void 0:T.loading,error:null===T||void 0===T?void 0:T.error}}),[T,M,y]),R=(0,c.x)(P,"MRF"),U=null===L||void 0===L||null===(e=L[j])||void 0===e?void 0:e.referenceDocumentNumber;(0,a.useEffect)((()=>{r((0,i.VOH)("TRANSACTION TYPE"))}),[r]),(0,a.useEffect)((()=>{R&&r((0,i.exE)({pageIndex:M,pageSize:y,transactionTypeId:R,...D&&{searchString:D,accessors:JSON.stringify(O.current)},sortBy:(null===b||void 0===b?void 0:b[0])||"createdAt",sortOrder:(null===b||void 0===b?void 0:b[1])||"DESC"}))}),[r,m,M,y,R,D,b,O,E]);const q=e=>{S("view"),A(e)},V=e=>{S("download"),A(e)},B=e=>{S("print"),A(e)},_=(e=>{const t=[],r={};return e.map((e=>{const t={name:(e={...e,receiptStatus:(0,c.Uq)(e)}).material.name,code:e.material.code,hsnCode:e.material.hsnCode,uom:e.uom.name,quantity:e.requestedQuantity,remarks:e.remarks};r[e.referenceDocumentNumber+e.transactionTypeId+(0,c.rd)(e)]&&r[e.referenceDocumentNumber+e.transactionTypeId+(0,c.rd)(e)].materialData?r[e.referenceDocumentNumber+e.transactionTypeId+(0,c.rd)(e)].materialData.push(t):(e.materialData=[],e.materialData=[t],r[e.referenceDocumentNumber+e.transactionTypeId+(0,c.rd)(e)]=e)})),Object.keys(r).forEach((e=>{t.push(r[e])})),t})(L);return(0,g.jsxs)(g.Fragment,{children:["closed"!==x&&(0,g.jsx)(h,{fetchFromRoute:"/mrf-receipt",apiQuery:{referenceDocumentNumber:U,transactionTypeId:null===L||void 0===L||null===(t=L[j])||void 0===t?void 0:t.transactionTypeId,toStoreId:(0,c.rd)(null===L||void 0===L?void 0:L[j])},previewAction:x,onClose:()=>{S("hidden"),A(null)},fileNameForDownload:U}),(0,g.jsx)(d.default,{title:"MRF Receipt",setPageIndex:H,setPageSize:I,pageIndex:M,pageSize:y,columns:f,data:R?_:[],count:R?F:0,hideAddButton:!0,hideActions:!0,searchConfig:{searchString:z,searchStringTrimmed:D,setSearchString:w,setAccessors:C},sortConfig:{sort:b,setSort:k},exportConfig:{tableName:"mrf_receipt",apiQuery:{transactionTypeId:R}}})]})}},46091:(e,t,r)=>{r.d(t,{b:()=>n});var a=r(9950),s=r(27081);const n=()=>{const[e,t]=(0,a.useState)({requestDetails:{},error:"",loading:!0}),r=(0,s.d4)((e=>e.requestList||{}));return(0,a.useEffect)((()=>{t((e=>({...e,...r})))}),[r]),{transactionRequest:e}}},13239:(e,t,r)=>{r.d(t,{A:()=>c});var a=r(89379),s=r(9950);const n={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"}}]},name:"check",theme:"outlined"};var o=r(14840),i=function(e,t){return s.createElement(o.A,(0,a.A)((0,a.A)({},e),{},{ref:t,icon:n}))};const c=s.forwardRef(i)},26592:(e,t,r)=>{var a=r(24994);t.A=void 0;var s=a(r(79526)),n=r(44414);t.A=(0,s.default)((0,n.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"}),"DeleteOutline")},36089:(e,t,r)=>{var a=r(24994);t.A=void 0;var s=a(r(79526)),n=r(44414);t.A=(0,s.default)((0,n.jsx)("path",{d:"m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"}),"EditOutlined")},56334:(e,t,r)=>{var a=r(24994);t.A=void 0;var s=a(r(79526)),n=r(44414);t.A=(0,s.default)((0,n.jsx)("path",{d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5z"}),"FileUploadOutlined")},58281:(e,t,r)=>{var a=r(24994);t.A=void 0;var s=a(r(79526)),n=r(44414);t.A=(0,s.default)((0,n.jsx)("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2m0 16H5V7h14zm-7-8.5c1.84 0 3.48.96 4.34 2.5-.86 1.54-2.5 2.5-4.34 2.5s-3.48-.96-4.34-2.5c.86-1.54 2.5-2.5 4.34-2.5M12 9c-2.73 0-5.06 1.66-6 4 .94 2.34 3.27 4 6 4s5.06-1.66 6-4c-.94-2.34-3.27-4-6-4m0 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5"}),"PreviewOutlined")},11066:(e,t,r)=>{var a=r(24994);t.A=void 0;var s=a(r(79526)),n=r(44414);t.A=(0,s.default)([(0,n.jsx)("path",{d:"M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3M8 5h8v3H8zm8 12v2H8v-4h8zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4z"},"0"),(0,n.jsx)("circle",{cx:"18",cy:"11.5",r:"1"},"1")],"PrintOutlined")}}]);