"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[970],{60970:(e,t,a)=>{a.r(t),a.d(t,{default:()=>b});var r=a(9950),o=a(95537),n=a(4139),s=a(67535),i=a(60666),d=a(9449),l=a(26473),c=a(28429),u=a(80415),m=a(96951),v=a(14351),h=a(99635),p=a(71826),g=a(62054),y=a(47501),I=a(52351),x=a(44414);const b=()=>{const[e,t]=(0,r.useState)([]),[a,b]=(0,r.useState)(!1),[f,S]=(0,r.useState)(u.j7.pageIndex),[j,A]=(0,r.useState)(u.j7.pageSize),[P,k]=(0,r.useState)(null),[T,N]=(0,r.useState)(!1),q=(0,c.Zp)(),C=(0,d.mN)({resolver:(0,l.t)(i.Ik().shape()),defaultValues:{},mode:"all"}),w="d4b6ec03-9614-4ed1-ad27-b08b1afed817",{handleSubmit:z}=C,L=(0,r.useMemo)((()=>[{Header:"Name",accessor:"material.name"},{Header:"Code",accessor:"material.code"},{Header:"Quantity",accessor:"quantity"},{Header:"UOM",accessor:"uom.name"}]),[]),O=e=>{if(e&&e.length>0){return e.map((e=>e.serialNumber))}return[]},_=e=>{let t=[];return e&&e.length>0&&e.map((e=>t.push(e.id))),t};(0,r.useEffect)((()=>{null!==P&&void 0!==P&&P.length&&t(P)}),[P]);const D=e.map((e=>({...e,quantity:Math.abs(e.quantity)})));return(0,x.jsxs)(x.Fragment,{children:[T&&(0,x.jsx)(I.A,{}),(0,x.jsx)(m.Op,{methods:C,onSubmit:z((async t=>{var a,r,o;N(!0);const n=(()=>{var t,a;const r=[];return e.map((e=>{r.push({transactionTypeId:w,projectId:e.projectId,requestNumber:e.referenceDocumentNumber,organizationId:null===e||void 0===e?void 0:e.organizationId,storeId:e.storeId,storeLocationId:e.storeLocationId,otherProjectId:null===e||void 0===e?void 0:e.otherProjectId,otherStoreId:null===e||void 0===e?void 0:e.otherStoreId,otherStoreLocationId:null===e||void 0===e?void 0:e.otherStoreLocationId,materialId:e.materialId,uomId:e.uomId,quantity:e.quantity<0?-e.quantity:e.quantity,rate:e.rate,value:e.value,tax:e.tax,serialNumber:O(e.material_serial_numbers)})})),{transactionTypeId:w,stoIds:_(e),stoLedgerDetailId:null===e||void 0===e||null===(t=e[0])||void 0===t||null===(a=t.stock_ledger_detail)||void 0===a?void 0:a.id,stock_ledgers:r}})(),s=await(0,p.default)("/cancel-sto-transaction-create",{method:"POST",body:n});var i;if(!s.success)return(0,g.A)((null===s||void 0===s||null===(i=s.error)||void 0===i?void 0:i.message)||"Operation failed. Please try again!",{variant:"error"}),void N(!1);const d=null!==(a=null===(r=s.data)||void 0===r?void 0:r.data)&&void 0!==a?a:{},l=d.referenceDocumentNumber||(null===(o=d[0])||void 0===o?void 0:o.referenceDocumentNumber);(0,g.A)(l?`Transaction cancelled with reference number: ${l}`:"Transaction cancelled successfully!",{variant:"success",autoHideDuration:1e4}),N(!1),q("/stock-ledger")})),children:(0,x.jsxs)(v.A,{title:"Cancel PTP(Project To Project)",sx:{mb:2},children:[(0,x.jsx)(y.A,{type:"stockLedger",transactionType:"PTP",fromStoreLabel:"Company Store",fromStoreType:"COMPANY",showFromStoreAddress:!0,disableAll:!(null===P||void 0===P||!P.length),setReqData:k,getNegativeOnly:!0}),P&&P.length>0&&(0,x.jsxs)(o.A,{sx:{mt:4},children:[(0,x.jsx)(h.default,{title:"Cancel STO",hideHeader:!0,hidePagination:!0,data:D,count:e.length,columns:L,hideActions:!0,setPageIndex:S,setPageSize:A,pageIndex:f,pageSize:j}),(0,x.jsx)(n.Ay,{item:!0,md:12,xl:2,sx:{mt:4},children:(0,x.jsxs)(n.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,x.jsx)(s.A,{onClick:()=>{b(!a),t([]),k(void 0),q("/stock-ledger")},size:"small",variant:"outlined",color:"primary",children:"Back"}),(0,x.jsx)(s.A,{disabled:T,size:"small",type:"submit",variant:"contained",color:"primary",children:"Reverse"})]})})]})]})})]})}}}]);