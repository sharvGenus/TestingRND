"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[3752,5406],{89649:(e,t,a)=>{a.d(t,{A:()=>o});var r=a(9950),s=a(80415);function o(){const[e,t]=(0,r.useState)({pageIndex:s.j7.pageIndex,pageSize:s.j7.pageSize,forceUpdate:!0}),a=(0,r.useCallback)((function(){let a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;t((e=>({pageIndex:a,pageSize:r,forceUpdate:!e.forceUpdate})))}),[e]),o=(0,r.useCallback)((()=>{t((e=>({pageIndex:s.j7.pageIndex,pageSize:s.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>t((t=>({...t,pageIndex:e,forceUpdate:!t.forceUpdate}))),setPageSize:e=>t((t=>({pageIndex:s.j7.pageIndex,pageSize:e,forceUpdate:!t.forceUpdate}))),refreshPagination:o,setPaginationsFunctions:a}}},80733:(e,t,a)=>{a.d(t,{Y:()=>o});var r=a(9950),s=a(27081);const o=()=>{const[e,t]=(0,r.useState)({projectsObject:{},error:"",loading:!0}),[a,o]=(0,r.useState)({projectDetailsObject:{},error:"",loading:!0}),[n,d]=(0,r.useState)({projectsDropdownObject:[],error:"",loading:!0}),[i,c]=(0,r.useState)({projectsDropdownObject:[],error:"",loading:!0}),[l,p]=(0,r.useState)({projectsObject:[],error:"",loading:!0}),[u,g]=(0,r.useState)({projectsHistoryObject:{},error:"",loading:!0}),j=(0,s.d4)((e=>e.projects||{})),v=(0,s.d4)((e=>e.projectDetails||{})),x=(0,s.d4)((e=>e.projectsDropdown||[])),f=(0,s.d4)((e=>e.allProjectsDropdown||[])),h=(0,s.d4)((e=>e.projectsForRoleOrUser||[])),m=(0,s.d4)((e=>e.projectsHistory||{}));return(0,r.useEffect)((()=>{t((e=>({...e,...j})))}),[j]),(0,r.useEffect)((()=>{o((e=>({...e,...v})))}),[v]),(0,r.useEffect)((()=>{d((e=>({...e,...x})))}),[x]),(0,r.useEffect)((()=>{c((e=>({...e,...f})))}),[f]),(0,r.useEffect)((()=>{p((e=>({...e,...h})))}),[h]),(0,r.useEffect)((()=>{g((e=>({...e,...m})))}),[m]),{projects:e,projectsDropdown:n,allProjectsDropdown:i,projectsHistory:u,projectsGovernForRoleOrUser:l,projectDetails:a}}},48255:(e,t,a)=>{a.r(t),a.d(t,{default:()=>m});var r=a(4139),s=a(67535),o=a(9449),n=a(14351),d=a(96951),i=a(99635),c=a(80733),l=a(89649),p=a(9950),u=a(27081),g=a(29024),j=a(71826),v=a(44414);let x=!0;const f=[{Header:"Name",accessor:"name"},{Header:"Open",accessor:"open"},{Header:"Assigned",accessor:"assigned"},{Header:"In Progress",accessor:"in_progress"},{Header:"On Hold",accessor:"on_hold"},{Header:"Resolved",accessor:"resolved"},{Header:"Rejected",accessor:"rejected"},{Header:"Closed",accessor:"closed"}],h={rows:[],count:0},m=()=>{var e,t;const a=(0,u.wA)(),{paginations:{pageSize:m,pageIndex:S},setPageIndex:b,setPageSize:A}=(0,l.A)(),[w,I]=(0,p.useState)(!1),[z,y]=(0,p.useState)(h),H=null===(e=(0,c.Y)())||void 0===e||null===(t=e.projectsDropdown)||void 0===t?void 0:t.projectsDropdownObject,k=(0,o.mN)({defaultValues:{},mode:"all"}),{handleSubmit:O,watch:P}=k;(0,p.useEffect)((()=>{a((0,g.uiG)())}),[a]);const D=(0,p.useCallback)((async e=>{I(!0);const t=await(0,j.default)("/ticket-status-report",{method:"GET",query:{pageSize:m,pageIndex:S,projectId:P("projectId"),assignBy:P("assignBy")}});var a,r;null!==t&&void 0!==t&&t.success?y(null===t||void 0===t||null===(a=t.data)||void 0===a?void 0:a.data):toast((null===t||void 0===t||null===(r=t.error)||void 0===r?void 0:r.message)||"Something went wrong",{variant:"error"});I(!1)}),[]);return(0,p.useEffect)((()=>{x||D(P()),x=!1}),[D,S,m]),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n.A,{sx:{mb:2},title:"Ticket Status Wise Report",children:(0,v.jsx)(d.Op,{methods:k,onSubmit:O(D),children:(0,v.jsxs)(r.Ay,{container:!0,spacing:2,children:[(0,v.jsx)(r.Ay,{item:!0,xs:3,children:(0,v.jsx)(d.eu,{name:"projectId",label:"Project",menus:H||[],required:!0})}),(0,v.jsx)(r.Ay,{item:!0,md:3,xl:3,children:(0,v.jsx)(d.o3,{name:"dateFrom",type:"date",label:"Date From",InputLabelProps:{shrink:!0}})}),(0,v.jsx)(r.Ay,{item:!0,md:3,xl:3,children:(0,v.jsx)(d.o3,{name:"dateTo",type:"date",label:"Date To",InputLabelProps:{shrink:!0}})}),(0,v.jsx)(r.Ay,{item:!0,xs:4,children:(0,v.jsx)(d.gk,{name:"assignBy",title:"Ticket Assign By",singleLineRadio:"true",labels:[{name:"Supervisor",value:"supervisor"},{name:"O&M Engineer",value:"installer"}],style:{"& label":{marginTop:"0",width:"33%"},marginTop:"10px !important",padding:"3px 0"},required:!0})}),(0,v.jsx)(r.Ay,{item:!0,xs:12,textAlign:"right",children:(0,v.jsx)(s.A,{type:"submit",size:"small",variant:"contained",disabled:w,children:"Proceed"})})]})})}),(0,v.jsx)(i.default,{title:"Ticket Stats",data:(null===z||void 0===z?void 0:z.rows)||[],count:(null===z||void 0===z?void 0:z.count)||0,columns:f,hideAddButton:!0,hideImportButton:!0,hideExportButton:!0,setPageIndex:b,setPageSize:A,pageIndex:S,pageSize:m,hideActions:!0})]})}},13239:(e,t,a)=>{a.d(t,{A:()=>i});var r=a(89379),s=a(9950);const o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"}}]},name:"check",theme:"outlined"};var n=a(14840),d=function(e,t){return s.createElement(n.A,(0,r.A)((0,r.A)({},e),{},{ref:t,icon:o}))};const i=s.forwardRef(d)},26592:(e,t,a)=>{var r=a(24994);t.A=void 0;var s=r(a(79526)),o=a(44414);t.A=(0,s.default)((0,o.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"}),"DeleteOutline")},36089:(e,t,a)=>{var r=a(24994);t.A=void 0;var s=r(a(79526)),o=a(44414);t.A=(0,s.default)((0,o.jsx)("path",{d:"m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"}),"EditOutlined")}}]);