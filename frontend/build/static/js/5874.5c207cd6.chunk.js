"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[5874],{85874:(e,t,a)=>{a.r(t),a.d(t,{default:()=>S});var r=a(9950),n=a(27081),o=a(95537),i=a(4139),l=a(67535),s=a(60666),d=a(9449),u=a(26473),c=a(28429),m=a(29024),v=a(80415),h=a(88848),p=a(96951),g=a(14351),f=a(99635),x=a(71826),I=a(62054),y=a(47501),b=a(52351),N=a(44414);const S=()=>{const[e,t]=(0,r.useState)(null),[a,S]=(0,r.useState)([]),[j,A]=(0,r.useState)(!1),[C,k]=(0,r.useState)(v.j7.pageIndex),[L,R]=(0,r.useState)(v.j7.pageSize),[M,T]=(0,r.useState)(!1),w=(0,c.Zp)(),q=(0,d.mN)({resolver:(0,u.t)(s.Ik().shape()),defaultValues:{},mode:"all"}),O=(0,n.wA)();(0,r.useEffect)((()=>{O((0,m._G1)())}),[O]);const{masterMakerLovs:_}=(0,h.$)(),z=((e,t)=>{const a=e&&e.filter((e=>e.name===t));return a&&a.length?a[0].id:null})(_.masterMakerLovsObject.rows,"CANCELMRN"),{handleSubmit:D}=q,E=(0,r.useMemo)((()=>[{Header:"Name",accessor:"material.name"},{Header:"Code",accessor:"material.code"},{Header:"Quantity",accessor:"quantity"},{Header:"UOM",accessor:"uom.name"}]),[]),H=e=>{if(e&&e.length>0){return e.map((e=>e.serialNumber))}return[]},P=e=>{let t=[];return e&&e.length>0&&e.map((e=>t.push(e.id))),t},$=a.map((e=>({...e,quantity:Math.abs(e.quantity)})));return(0,r.useEffect)((()=>{null!==e&&void 0!==e&&e.length&&S(e)}),[e]),(0,N.jsxs)(N.Fragment,{children:[M&&(0,N.jsx)(b.A,{}),(0,N.jsx)(p.Op,{methods:q,onSubmit:D((async()=>{var e,t,r,n;T(!0);const o=(()=>{var e,t;const r=[];return a.map((e=>{r.push({transactionTypeId:z,projectId:null===e||void 0===e?void 0:e.projectId,requestNumber:null===e||void 0===e?void 0:e.referenceDocumentNumber,organizationId:null===e||void 0===e?void 0:e.organizationId,storeId:null===e||void 0===e?void 0:e.storeId,storeLocationId:null===e||void 0===e?void 0:e.storeLocationId,otherStoreId:null===e||void 0===e?void 0:e.otherStoreId,otherStoreLocationId:null===e||void 0===e?void 0:e.otherStoreLocationId,materialId:e.materialId,uomId:e.uomId,quantity:e.quantity<0?-e.quantity:e.quantity,rate:e.rate,value:e.value,tax:e.tax,serialNumber:H(e.material_serial_numbers)})})),{transactionTypeId:z,mrnLedgerIds:[...P(a)],mrnLedgerDetailId:null===(e=a[0])||void 0===e||null===(t=e.stock_ledger_detail)||void 0===t?void 0:t.id,stock_ledgers:r}})(),i=await(0,x.default)("/cancel-mrn",{method:"POST",body:o,timeoutOverride:12e4});var l;if(!i.success)return(0,I.A)((null===i||void 0===i||null===(l=i.error)||void 0===l?void 0:l.message)||"Operation failed. Please try again!",{variant:"error"}),void T(!1);const s=null!==(e=null===(t=i.data)||void 0===t?void 0:t.data)&&void 0!==e?e:{},d=s.referenceDocumentNumber||(null===(r=s[0])||void 0===r?void 0:r.referenceDocumentNumber),u=null===i||void 0===i||null===(n=i.data)||void 0===n?void 0:n.referenceDocNo;(0,I.A)(d?`Transaction cancelled with reference number: ${d}`:u&&`Transaction cancelled with reference numbers ${u.CANCELMRN} and ${u.CANCELRETURNMRN}`||"Transaction cancelled successfully!",{variant:"success",autoHideDuration:1e4}),T(!1),w("/stock-ledger")})),children:(0,N.jsxs)(g.A,{title:"Cancel MRN(Material Return Note)",sx:{mb:2},children:[(0,N.jsx)(y.A,{type:"stockLedger",transactionType:"MRN",fromStoreLabel:"Contractor Store",fromStoreType:"CONTRACTOR",showFromStoreAddress:!0,disableAll:!(null===e||void 0===e||!e.length),setReqData:t,setProjectId:()=>{}}),e&&e.length>0&&(0,N.jsxs)(o.A,{sx:{mt:4},children:[(0,N.jsx)(f.default,{title:"Cancel MRN",hideHeader:!0,hidePagination:!0,data:$,count:a.length,columns:E,hideActions:!0,setPageIndex:k,setPageSize:R,pageIndex:C,pageSize:L}),(0,N.jsx)(i.Ay,{item:!0,md:12,xl:2,sx:{mt:4},children:(0,N.jsxs)(i.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,N.jsx)(l.A,{onClick:()=>{A(!j),S([]),t(null),w("/cancel-mrn")},size:"small",variant:"outlined",color:"primary",children:"Back"}),(0,N.jsx)(l.A,{disabled:M,size:"small",type:"submit",variant:"contained",color:"primary",children:"Reverse"})]})})]})]})})]})}}}]);