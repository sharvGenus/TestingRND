"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[3474],{53474:(e,t,r)=>{r.r(t),r.d(t,{default:()=>j});var a=r(9950),o=r(27081),s=r(95537),n=r(4139),i=r(67535),d=r(28429),u=r(26473),l=r(9449),c=r(60666),m=r(29024),p=r(80415),v=r(88848),f=r(96951),S=r(14351),h=r(99635),y=r(52867),I=r(71826),x=r(62054),g=r(47501),b=r(52351),A=r(44414);const j=()=>{const[e,t]=(0,a.useState)(null),[r,j]=(0,a.useState)([]),[q,C]=(0,a.useState)(!1),[T,N]=(0,a.useState)(null),[R,O]=(0,a.useState)(p.j7.pageIndex),[M,k]=(0,a.useState)(p.j7.pageSize),[w,F]=(0,a.useState)(!1),z=(0,d.Zp)(),L=(0,l.mN)({resolver:(0,u.t)(c.Ik().shape({})),defaultValues:{},mode:"all"}),P=(0,o.wA)();(0,a.useEffect)((()=>{P((0,m._G1)()),P((0,m.uiG)())}),[P]);const{masterMakerLovs:Q}=(0,v.$)(),D=(e,t)=>{const r=e&&e.filter((e=>e.name===t));return r&&r.length?r[0].id:void 0},E=Q.masterMakerLovsObject.rows,H=D(E,"CANCELMRF"),$=D(E,"MRF"),_=D(E,"COMPANY"),G=D(E,"CONTRACTOR");(0,a.useEffect)((()=>{_&&P((0,m.qV$)({organizationType:_}))}),[P,_]),(0,a.useEffect)((()=>{G&&P((0,m.QEJ)({organizationType:G}))}),[P,G]);const{handleSubmit:J}=L,V=(0,a.useMemo)((()=>[{Header:"Name",accessor:"material.name"},{Header:"Code",accessor:"material.code"},{Header:"Requested Quantity",accessor:"requestedQuantity"},{Header:"UOM",accessor:"uom.name"}]),[]);return(0,a.useEffect)((()=>{var t,r;e&&(j(e),P((0,m.J9T)({project:null===(t=e[0])||void 0===t?void 0:t.projectId,store:null===(r=e[0])||void 0===r?void 0:r.fromStoreId})))}),[P,e]),(0,A.jsxs)(A.Fragment,{children:[w&&(0,A.jsx)(b.A,{}),(0,A.jsx)(f.Op,{methods:L,onSubmit:J((async()=>{var e,t,a;F(!0);const o=(()=>{const e=[],t=[];return r.map((e=>{t.push(e.id)})),r.map((r=>{e.push({requestIds:t,requestName:"MRF",transactionTypeId:H,requestNumber:r.referenceDocumentNumber,requestTransactionTypeId:$,requestOrganizationId:T,requestStoreId:r.toStoreId,projectId:r.projectId,fromStoreId:r.fromStoreId,fromStoreLocationId:r.fromStoreLocationId,toStoreId:r.toStoreId,toStoreLocationId:r.toStoreLocationId,materialId:r.materialId,uomId:r.uomId,requestedQuantity:r.requestedQuantity,approvedQuantity:r.approvedQuantity||0,rate:r.rate||0,value:r.value||0,tax:r.tax||0,serialNumbers:r.serialNumbers,vehicleNumber:r.vehicleNumber,remarks:r.remarks})})),{payload:(0,y.cF)(e)}})(),s=await(0,I.default)("/cancel-request-create",{method:"POST",body:o,timeoutOverride:12e4});var n;if(!s.success)return(0,x.A)((null===s||void 0===s||null===(n=s.error)||void 0===n?void 0:n.message)||"Operation failed. Please try again!",{variant:"error"}),void F(!1);const i=null!==(e=null===(t=s.data)||void 0===t?void 0:t.data)&&void 0!==e?e:{},d=i.referenceDocumentNumber||(null===(a=i[0])||void 0===a?void 0:a.referenceDocumentNumber);(0,x.A)(d?`Request cancelled with reference number: ${d}`:"Request cancelled successfully!",{variant:"success",autoHideDuration:1e4}),F(!1),z("/stock-ledger")})),children:(0,A.jsxs)(S.A,{title:"Cancel MRF (Material Requisition Form)",sx:{mb:2},children:[(0,A.jsx)(g.A,{type:"request",transactionType:"MRF",disableAll:!(null===e||void 0===e||!e.length),setReqData:t,showToStoreDropdown:!0,showFromStoreAddress:!0,showToStoreAddress:!0,fromStoreType:"COMPANY",toStoreType:"CONTRACTOR",fromStoreLabel:"Company Store",toStoreLabel:"Contractor Store",setToOrganizationId:N}),(null===e||void 0===e?void 0:e.length)&&(0,A.jsxs)(s.A,{sx:{mt:4},children:[(0,A.jsx)(h.default,{title:"Cancel MRF",hideHeader:!0,hidePagination:!0,data:r,count:r.length,columns:V,hideActions:!0,setPageIndex:O,setPageSize:k,pageIndex:R,pageSize:M,sx:{mt:4}}),(0,A.jsx)(n.Ay,{item:!0,md:12,xl:2,sx:{mt:4},children:(0,A.jsxs)(n.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,A.jsx)(i.A,{onClick:()=>{C(!q),j([]),z("/cancel-mrf")},size:"small",variant:"outlined",color:"primary",children:"Back"}),(0,A.jsx)(i.A,{disabled:w,size:"small",type:"submit",variant:"contained",color:"primary",children:"Reverse"})]})})]})]})})]})}}}]);