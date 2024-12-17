"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[7870],{31892:(e,t,r)=>{r.d(t,{A:()=>v});var i=r(9950),o=r(65669),s=r(43263),d=r(57191),c=r(95537),n=r(67535),a=r(27081),l=r(87233),u=r(71826),f=r(44414);v.defaultProps={stopDelete:!1};const p={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},m={display:"flex",flexDirection:"row",padding:"15px 0"},j={display:"flex",justifyContent:"flex-end",gap:2},x={marginTop:2,display:"flex",fontSize:"14px"};function v(e){let{open:t,handleClose:r,deleteInfo:v,dispatchData:g,stopDelete:y,deleteMaterial:h}=e;const A=(0,a.wA)(),[S,O]=i.useState(null);i.useEffect((()=>{O(null)}),[t]);return(0,f.jsx)("div",{children:(0,f.jsx)(o.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:t,closeAfterTransition:!0,slots:{backdrop:s.A},slotProps:{backdrop:{timeout:500}},children:(0,f.jsx)(d.A,{in:t,children:(0,f.jsxs)(c.A,{sx:p,children:[(0,f.jsx)(l.A,{id:"transition-modal-title",variant:"h4",children:null===v||void 0===v?void 0:v.title}),(0,f.jsx)(l.A,{id:"transition-modal-title",variant:"h6",sx:m,children:"Are you sure you want to delete ?"}),(0,f.jsxs)(c.A,{sx:j,children:[(0,f.jsx)(n.A,{onClick:r,size:"small",variant:"outlined",color:"primary",children:"Cancel"}),(0,f.jsx)(n.A,{onClick:y?()=>{h(v)}:async()=>{const e=await(0,u.default)(`${null===v||void 0===v?void 0:v.deleteURL}`,{method:"DELETE",params:null===v||void 0===v?void 0:v.deleteID});var t;e.success?(await A(g),r()):O(null===e||void 0===e||null===(t=e.error)||void 0===t?void 0:t.message)},size:"small",variant:"contained",color:"error",children:"Delete"})]}),S&&(0,f.jsx)(l.A,{variant:"p",color:"red",sx:x,children:S})]})})})})}},97870:(e,t,r)=>{r.r(t),r.d(t,{default:()=>w});var i=r(9950),o=r(27081),s=r(29024),d=r(80415),c=r(12257),n=r(67535),a=r(4139),l=r(60666),u=r(9449),f=r(26473),p=r(43858),m=r(71826),j=r(99144),x=r(80733),v=r(32112),g=r(28073),y=r(96951),h=r(14351),A=r(84601),S=r(44414);const O=e=>{const{onClick:t,data:r,view:d,update:O,refreshPagination:b}=e,C=(0,o.wA)(),[I,w]=(0,i.useState)(""),[D,_]=(0,i.useState)(""),{projectsDropdown:P}=(0,x.Y)(),[H,k]=(0,i.useState)(""),[R,E]=(0,i.useState)(""),N=(0,u.mN)({resolver:(0,f.t)(l.Ik().shape({name:A.A.name,projectId:A.A.project,code:A.A.code,gstNumber:A.A.gstNumber,email:A.A.email,mobileNumber:A.A.mobileNumber,telephone:A.A.telephone,registeredOfficeAddress:A.A.address,registeredOfficePinCode:A.A.pincode,currentOfficeAddress:A.A.address,currentOfficePinCode:A.A.pincode,currentOfficeCountryId:A.A.country,currentOfficeStateId:A.A.state,currentOfficeCityId:A.A.city,registeredOfficeCountryId:A.A.country,registeredOfficeStateId:A.A.state,registeredOfficeCityId:A.A.city})),defaultValues:{},mode:"all"}),{handleSubmit:z,setValue:T}=N,{countriesDropdown:U}=(0,j.o)(),{statesDropdown:L,currentStatesDropdown:B}=(0,g.Y)(),{citiesDropdown:F,currentCitiesDropdown:M}=(0,v.J)();(0,i.useEffect)((()=>{C((0,s.cTJ)()),I&&C((0,s.CYQ)(I)),D&&C((0,s.$lv)(D)),H&&C((0,s.Z3L)(H)),R&&C((0,s.Sps)(R)),C((0,s.uiG)())}),[C,I,D,H,R]),(0,i.useEffect)((()=>{var e,t,i,o,s,c,n,a,l;(d||O)&&(w(null===(e=r.register_office_cities)||void 0===e?void 0:e.state.country.id),k(null===(t=r.current_office_cities)||void 0===t?void 0:t.state.country.id),_(null===(i=r.register_office_cities)||void 0===i?void 0:i.state.id),E(null===(o=r.current_office_cities)||void 0===o?void 0:o.state.id),T("registeredOfficeCountryId",null===(s=r.register_office_cities)||void 0===s?void 0:s.state.country.id),T("registeredOfficeStateId",null===(c=r.register_office_cities)||void 0===c?void 0:c.state.id),T("currentOfficeCountryId",null===(n=r.current_office_cities)||void 0===n?void 0:n.state.country.id),T("currentOfficeStateId",null===(a=r.current_office_cities)||void 0===a?void 0:a.state.id),l=r,Object.entries(l).forEach((e=>{let[t,r]=e;T(t,r)})))}),[r,O,d,T]);const q=null===P||void 0===P?void 0:P.projectsDropdownObject,G=null===U||void 0===U?void 0:U.countriesDropdownObject,V=null===L||void 0===L?void 0:L.statesDropdownObject,Y=null===F||void 0===F?void 0:F.citiesDropdownObject,J=null===B||void 0===B?void 0:B.currentStatesDropdownObject,W=null===M||void 0===M?void 0:M.currentCitiesDropdownObject,$=(e,t)=>{var r;if("registeredOfficeCountryId"===e)w(null===t||void 0===t||null===(r=t.target)||void 0===r?void 0:r.value);else if("currentOfficeCountryId"===e){var i;k(null===t||void 0===t||null===(i=t.target)||void 0===i?void 0:i.value)}},Q=(e,t)=>{var r;if("registeredOfficeStateId"===e)_(null===t||void 0===t||null===(r=t.target)||void 0===r?void 0:r.value);else if("currentOfficeStateId"===e){var i;E(null===t||void 0===t||null===(i=t.target)||void 0===i?void 0:i.value)}},Z=(e,t,r,i,o)=>(0,S.jsx)(y.eu,{name:e,label:t,onChange:i,InputLabelProps:{shrink:!0},menus:r,...o&&{required:!0},...d?{disable:!0}:O?{disable:!1}:{}}),K=function(e,t,r,i){let o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,S.jsx)(y.o3,{name:e,type:r,label:t,InputLabelProps:{shrink:o},...i&&{required:!0},...d?{disabled:!0}:O?{disabled:!1}:{}})},X=(e,t,r)=>(0,S.jsx)(c.A,{spacing:1,children:r?(0,S.jsxs)(n.A,{size:"small",variant:"outlined",htmlFor:"files",color:"primary",required:!0,children:[(0,S.jsx)(p.A,{}),"\xa0",t]}):(0,S.jsx)(n.A,{size:"small",variant:"outlined",htmlFor:"files",color:"primary",children:t})});return(0,S.jsx)(S.Fragment,{children:(0,S.jsx)(y.Op,{methods:N,onSubmit:z((async e=>{let i;e.attachments="attachment.jpg",i=O?await(0,m.default)("/project-site-store-update",{method:"PUT",body:e,params:r.id}):await(0,m.default)("/project-site-store-form",{method:"POST",body:e}),i.success&&(b(),C((0,s.Wmk)()),t())})),children:(0,S.jsxs)(h.A,{title:(d?"View ":O?"Update ":"Add ")+"Project Site Store",children:[(0,S.jsxs)(a.Ay,{container:!0,spacing:4,children:[(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("projectId","Project",q,void 0,!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("name","Name","text",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("code","Code","text",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("integrationId","Integration ID","text")}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("gstNumber","GSTIN","text",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("mobileNumber","Mobile Number","number",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("telephone","Telephone","number")}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("email","Email id","email",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("registeredOfficeAddress","Registered Address","text",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("registeredOfficeCountryId","Registered Country",G,$.bind(void 0,"registeredOfficeCountryId"),!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("registeredOfficeStateId","Registered State",V,Q.bind(void 0,"registeredOfficeStateId"),!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("registeredOfficeCityId","Registered City",Y,void 0,!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("registeredOfficePinCode","Registered Pincode","number",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("currentOfficeAddress","Office Address","text",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("currentOfficeCountryId","Office Country",G,$.bind(void 0,"currentOfficeCountryId"),!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("currentOfficeStateId","Office State",J,Q.bind(void 0,"currentOfficeStateId"),!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:Z("currentOfficeCityId","Office City",W,void 0,!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("currentOfficePinCode","Office Pincode","number",!0)}),(0,S.jsx)(a.Ay,{item:!0,md:3,xl:2,children:K("remarks","Remarks","text",!1)})]}),(0,S.jsxs)(a.Ay,{container:!0,spacing:2,alignItems:"center",sx:{mt:2},children:[(0,S.jsxs)(a.Ay,{item:!0,xs:6,sx:{display:"flex",justifyContent:"flex-start",gap:"20px"},children:[X(0,"Store Photo",!0),X(0,"Attachments",!0)]}),(0,S.jsxs)(a.Ay,{item:!0,xs:6,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,S.jsx)(n.A,{onClick:t,size:"small",variant:"outlined",color:"primary",children:"Back"}),!d&&(0,S.jsx)(n.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:O?"Update":"Save"})]})]})]})})})};var b=r(28040),C=r(99635),I=r(31892);const w=()=>{const[e,t]=(0,i.useState)(d.j7.pageIndex),[r,c]=(0,i.useState)(d.j7.pageSize),n=()=>{t(d.j7.pageIndex),c(d.j7.pageSize)},[a,l]=(0,i.useState)(!1),[u,f]=(0,i.useState)(null),[p,m]=(0,i.useState)(null),[j,x]=(0,i.useState)(!1),[v,g]=(0,i.useState)(!1),y=(0,o.wA)();(0,i.useEffect)((()=>{y((0,s.Wmk)()),y((0,s.J_q)())}),[y]);const{projectSiteStore:h}=(0,b.B)(),{data:A,count:w}=(0,i.useMemo)((()=>{var e,t;return{data:(null===(e=h.projectSiteStoreObject)||void 0===e?void 0:e.rows)||[],count:(null===(t=h.projectSiteStoreObject)||void 0===t?void 0:t.count)||0,isLoading:h.loading||!1}}),[h]),D=(0,i.useMemo)((()=>[{Header:"Name",accessor:"name"},{Header:"Code",accessor:"code"},{Header:"Integration ID",accessor:"integrationId"},{Header:"GSTIN",accessor:"gstNumber"},{Header:"Email Id",accessor:"email"},{Header:"Mobile Number",accessor:"mobileNumber"},{Header:"Telephone Number",accessor:"telephone"},{Header:"Registered Address",accessor:"registeredOfficeAddress"},{Header:"Registered Country",accessor:"register_office_cities.state.country.name"},{Header:"Registered State",accessor:"register_office_cities.state.name"},{Header:"Registered City",accessor:"register_office_cities.name"},{Header:"Registered Pincode",accessor:"registeredOfficePinCode"},{Header:"Office Address",accessor:"currentOfficeAddress"},{Header:"Office Country",accessor:"current_office_cities.state.country.name"},{Header:"Office State",accessor:"current_office_cities.state.name"},{Header:"Office City",accessor:"current_office_cities.name"},{Header:"Office Pincode",accessor:"currentOfficePinCode"},{Header:"Remarks",accessor:"remarks"},{Header:"Updated On",accessor:"updatedAt"},{Header:"Updated By",accessor:"updatedBy"},{Header:"Created On",accessor:"createdAt"},{Header:"Created By",accessor:"createdBy"}]),[]),[_,P]=(0,i.useState)(!1),H=()=>{x(!1),g(!1),P(!_)};return(0,S.jsxs)(S.Fragment,{children:[_?(0,S.jsx)(O,{refreshPagination:n,onClick:H,...p&&{data:p},...j&&{view:j,update:!1},...v&&{update:v,view:!1}}):(0,S.jsx)(C.default,{title:"Project Site Store",data:A,count:w,setPageIndex:t,setPageSize:c,pageIndex:e,pageSize:r,columns:D,onClick:H,handleRowView:e=>{P(!0),x(!0),g(!1),m(e)},handleRowDelete:async e=>{const t={};t.deleteID=e,t.title="Delete Project Site Store",t.deleteURL="/delete-project-site-store",f(t),l(!0)},handleRowUpdate:e=>{P(!0),g(!0),x(!1),m(e)}}),(0,S.jsx)(I.A,{open:a,handleClose:()=>l(!1),deleteInfo:u,dispatchData:()=>{n(),y((0,s.Wmk)())}})]})}},28040:(e,t,r)=>{r.d(t,{B:()=>s});var i=r(9950),o=r(27081);const s=()=>{const[e,t]=(0,i.useState)({projectSiteStoreObject:{},error:"",loading:!0}),[r,s]=(0,i.useState)({projectSiteStoreDropdownObject:[],error:"",loading:!0}),d=(0,o.d4)((e=>e.projectSiteStore||{})),c=(0,o.d4)((e=>e.projectSiteStoreDropdown||[]));return(0,i.useEffect)((()=>{t((e=>({...e,...d})))}),[d]),(0,i.useEffect)((()=>{s((e=>({...e,...c})))}),[c]),{projectSiteStore:e,projectSiteStoreDropdown:r}}},80733:(e,t,r)=>{r.d(t,{Y:()=>s});var i=r(9950),o=r(27081);const s=()=>{const[e,t]=(0,i.useState)({projectsObject:{},error:"",loading:!0}),[r,s]=(0,i.useState)({projectDetailsObject:{},error:"",loading:!0}),[d,c]=(0,i.useState)({projectsDropdownObject:[],error:"",loading:!0}),[n,a]=(0,i.useState)({projectsDropdownObject:[],error:"",loading:!0}),[l,u]=(0,i.useState)({projectsObject:[],error:"",loading:!0}),[f,p]=(0,i.useState)({projectsHistoryObject:{},error:"",loading:!0}),m=(0,o.d4)((e=>e.projects||{})),j=(0,o.d4)((e=>e.projectDetails||{})),x=(0,o.d4)((e=>e.projectsDropdown||[])),v=(0,o.d4)((e=>e.allProjectsDropdown||[])),g=(0,o.d4)((e=>e.projectsForRoleOrUser||[])),y=(0,o.d4)((e=>e.projectsHistory||{}));return(0,i.useEffect)((()=>{t((e=>({...e,...m})))}),[m]),(0,i.useEffect)((()=>{s((e=>({...e,...j})))}),[j]),(0,i.useEffect)((()=>{c((e=>({...e,...x})))}),[x]),(0,i.useEffect)((()=>{a((e=>({...e,...v})))}),[v]),(0,i.useEffect)((()=>{u((e=>({...e,...g})))}),[g]),(0,i.useEffect)((()=>{p((e=>({...e,...y})))}),[y]),{projects:e,projectsDropdown:d,allProjectsDropdown:n,projectsHistory:f,projectsGovernForRoleOrUser:l,projectDetails:r}}},43858:(e,t,r)=>{r.d(t,{A:()=>n});var i=r(89379),o=r(9950);const s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"}}]},name:"paper-clip",theme:"outlined"};var d=r(14840),c=function(e,t){return o.createElement(d.A,(0,i.A)((0,i.A)({},e),{},{ref:t,icon:s}))};const n=o.forwardRef(c)}}]);