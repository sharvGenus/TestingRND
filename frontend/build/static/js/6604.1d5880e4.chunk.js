"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[6604],{3147:(e,o,r)=>{r.d(o,{E:()=>n});var t=r(9950),a=r(27081);const n=()=>{const[e,o]=(0,t.useState)({organizationStoreObject:{},error:"",loading:!0}),[r,n]=(0,t.useState)({organizationStoreObject:{},error:"",loading:!0}),[s,i]=(0,t.useState)({organizationStoreObject:[],error:"",loading:!0}),[d,c]=(0,t.useState)({organizationStoreDropdownObject:{},error:"",loading:!0}),[l,u]=(0,t.useState)({organizationStoreDropdownSecondObject:{},error:"",loading:!0}),[g,p]=(0,t.useState)({orgStoreDropDownObject:{},error:"",loading:!0}),[S,f]=(0,t.useState)({orgViewStoreDropDownObject:{},error:"",loading:!0}),[m,j]=(0,t.useState)({organizationStoresHistoryObject:{},error:"",loading:!0}),x=(0,a.d4)((e=>e.organizationStores||{})),z=(0,a.d4)((e=>e.organizationStoresAllAccess||{})),b=(0,a.d4)((e=>e.organizationStoresSecond||[])),y=(0,a.d4)((e=>e.organizationStoreDropdown||[])),D=(0,a.d4)((e=>e.organizationStoreDropdownSecond||[])),w=(0,a.d4)((e=>e.orgStoreDropDown||[])),v=(0,a.d4)((e=>e.orgViewStoreDropDown||[])),h=(0,a.d4)((e=>e.organizationStoresHistory||[]));return(0,t.useEffect)((()=>{o((e=>({...e,...x})))}),[x]),(0,t.useEffect)((()=>{n((e=>({...e,...z})))}),[z]),(0,t.useEffect)((()=>{i((e=>({...e,...b})))}),[b]),(0,t.useEffect)((()=>{c((e=>({...e,...y})))}),[y]),(0,t.useEffect)((()=>{u((e=>({...e,...D})))}),[D]),(0,t.useEffect)((()=>{p((e=>({...e,...w})))}),[w]),(0,t.useEffect)((()=>{f((e=>({...e,...v})))}),[v]),(0,t.useEffect)((()=>{j((e=>({...e,...h})))}),[h]),{organizationStores:e,organizationStoresSecond:s,organizationStoresDropdown:d,orgStoreDropDown:g,orgViewStoreDropDown:S,organizationStoresHistory:m,organizationStoresAllAccess:r,organizationStoresDropdownSecond:l}}},76604:(e,o,r)=>{r.r(o),r.d(o,{default:()=>D});var t=r(9950),a=r(27081),n=r(4139),s=r(67535),i=r(60666),d=r(9449),c=r(26473),l=r(80733),u=r(88848),g=r(3147),p=r(8008),S=r(96951),f=r(14351),m=r(84601),j=r(29024),x=r(52867),z=r(89649),b=r(99635),y=r(44414);const D=()=>{var e,o;const[r,D]=(0,t.useState)(!1),{paginations:{pageSize:w,pageIndex:v},setPageIndex:h,setPageSize:A}=(0,z.A)(),O=(0,a.wA)(),E=(0,d.mN)({resolver:(0,c.t)(i.Ik().shape({projectId:m.A.project,storeId:m.A.store})),defaultValues:{},mode:"all"}),{handleSubmit:I}=E,{projectsDropdown:k}=(0,l.Y)(),{masterMakerLovs:H}=(0,u.$)(),{organizationStores:P}=(0,g.E)(),N=null===k||void 0===k?void 0:k.projectsDropdownObject,M=null===(e=H.masterMakerLovsObject)||void 0===e?void 0:e.rows,V=null===P||void 0===P||null===(o=P.organizationStoreObject)||void 0===o?void 0:o.rows,{deliveryReports:C}=(0,p.r)(),{data:_,count:R}=(0,t.useMemo)((()=>{var e,o;return{data:(null===(e=C.deliveryReportsObject)||void 0===e?void 0:e.rows)||[],count:(null===(o=C.deliveryReportsObject)||void 0===o?void 0:o.count)||0,isLoading:C.loading||!1}}),[C]),L=(0,t.useMemo)((()=>[{Header:"MIV No",accessor:"referenceDocumentNumber"},{Header:"Date",accessor:"createdAt"},{Header:"Name of Contractors",accessor:"stock_ledgers[2].organization_store.name"},{Header:"E-Way Bill No",accessor:"eWayBillNumber"},{Header:"E-Way Bill Qty",accessor:"eWayBillQty"},{Header:"Total Value of Challan ",accessor:"totalChallanValue"},{Header:"MatMovementType",accessor:"stock_ledgers[1].transaction_type.name"},{Header:"ReferenceDocNo",accessor:"ReferenceDocNo"}]),[]);return(0,t.useEffect)((()=>{O((0,j.uiG)()),O((0,j._G1)())}),[O]),(0,t.useEffect)((()=>{O((0,j.qV$)({organizationType:(0,x.x)(M,"COMPANY")}))}),[O,M]),(0,y.jsx)(y.Fragment,{children:(0,y.jsx)(S.Op,{methods:E,onSubmit:I((async e=>{e.pageSize=w,e.pageIndex=v,delete e.trxnType,O((0,j.ylP)(e)),D(!r)})),children:(0,y.jsxs)(f.A,{title:"Store Dashboard",sx:{mb:2},children:[(0,y.jsxs)(n.Ay,{container:!0,spacing:4,children:[(0,y.jsx)(n.Ay,{item:!0,md:3,xl:2,children:(0,y.jsx)(S.eu,{name:"projectId",label:"Project",InputLabelProps:{shrink:!0},menus:N,required:!0})}),(0,y.jsx)(n.Ay,{item:!0,md:3,xl:2,children:(0,y.jsx)(S.eu,{name:"storeId",label:"Store",InputLabelProps:{shrink:!0},menus:V,required:!0})}),(0,y.jsx)(n.Ay,{container:!0,spacing:2,alignItems:"end",sx:{mt:2},children:(0,y.jsx)(n.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:(0,y.jsx)(s.A,{type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})})]}),r?(0,y.jsx)(b.default,{title:"Store Dashboard Report",data:_,count:R,setPageIndex:h,setPageSize:A,pageIndex:v,pageSize:w,columns:L,hideActions:!0}):null]})})})}}}]);