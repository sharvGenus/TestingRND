"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[8085],{88085:(e,t,a)=>{a.r(t),a.d(t,{default:()=>b});var r=a(9950),o=a(95537),n=a(4139),s=a(67535),d=a(60666),i=a(9449),l=a(26473),c=a(28429),u=a(80415),m=a(96951),v=a(14351),h=a(99635),p=a(71826),g=a(62054),I=a(47501),f=a(52351),x=a(44414);const b=()=>{const[e,t]=(0,r.useState)([]),[a,b]=(0,r.useState)(!1),[y,S]=(0,r.useState)(u.j7.pageIndex),[j,A]=(0,r.useState)(u.j7.pageSize),[P,N]=(0,r.useState)(null),[k,T]=(0,r.useState)(!1),C=(0,c.Zp)(),q=(0,i.mN)({resolver:(0,l.t)(d.Ik().shape()),defaultValues:{},mode:"all"}),w="73df529f-9008-4917-ab2b-088b9222fa68",{handleSubmit:z}=q,D=(0,r.useMemo)((()=>[{Header:"Name",accessor:"material.name"},{Header:"Code",accessor:"material.code"},{Header:"Quantity",accessor:"quantity"},{Header:"UOM",accessor:"uom.name"}]),[]),L=e=>{if(e&&e.length>0){return e.map((e=>e.serialNumber))}return[]},R=e=>{let t=[];return e&&e.length>0&&e.map((e=>t.push(e.id))),t};(0,r.useEffect)((()=>{null!==P&&void 0!==P&&P.length&&t(P)}),[P]);const _=e.map((e=>({...e,quantity:Math.abs(e.quantity)})));return(0,x.jsxs)(x.Fragment,{children:[k&&(0,x.jsx)(f.A,{}),(0,x.jsx)(m.Op,{methods:q,onSubmit:z((async t=>{var a,r,o;T(!0);const n=(()=>{var t,a,r;const o=[];return e.map((e=>{o.push({transactionTypeId:w,projectId:e.projectId,requestNumber:e.referenceDocumentNumber,stoRefDocNo:e.requestNumber,organizationId:null===e||void 0===e?void 0:e.organizationId,storeId:null===e||void 0===e?void 0:e.storeId,storeLocationId:null===e||void 0===e?void 0:e.storeLocationId,otherProjectId:null===e||void 0===e?void 0:e.otherProjectId,otherStoreId:null===e||void 0===e?void 0:e.otherStoreId,otherStoreLocationId:null===e||void 0===e?void 0:e.otherStoreLocationId,materialId:e.materialId,uomId:e.uomId,quantity:-e.quantity,rate:e.rate,value:e.value,tax:e.tax,serialNumber:L(e.material_serial_numbers)})})),{transactionTypeId:w,transactionCreatedAt:null===(t=e[0])||void 0===t?void 0:t.createdAt,stoGrnIds:R(e),stoGrnLedgerDetailId:null===e||void 0===e||null===(a=e[0])||void 0===a||null===(r=a.stock_ledger_detail)||void 0===r?void 0:r.id,stock_ledgers:o}})(),s=await(0,p.default)("/cancel-sto-grn-transaction-create",{method:"POST",body:n});var d;if(!s.success)return(0,g.A)((null===s||void 0===s||null===(d=s.error)||void 0===d?void 0:d.message)||"Operation failed. Please try again!",{variant:"error"}),void T(!1);const i=null!==(a=null===(r=s.data)||void 0===r?void 0:r.data)&&void 0!==a?a:{},l=i.referenceDocumentNumber||(null===(o=i[0])||void 0===o?void 0:o.referenceDocumentNumber);(0,g.A)(l?`Transaction cancelled with reference number: ${l}`:"Transaction cancelled successfully!",{variant:"success",autoHideDuration:1e4}),T(!1),C("/stock-ledger")})),children:(0,x.jsxs)(v.A,{title:"Cancel PTPGRN(Project To Project GRN)",sx:{mb:2},children:[(0,x.jsx)(I.A,{type:"stockLedger",transactionType:"PTPGRN",fromStoreLabel:"Company Store",fromStoreType:"COMPANY",showFromStoreAddress:!0,setFromStoreId:()=>{},disableAll:!(null===P||void 0===P||!P.length),setReqData:N}),P&&P.length>0&&(0,x.jsxs)(o.A,{sx:{mt:4},children:[(0,x.jsx)(h.default,{title:"Cancel PTPGRN",hideHeader:!0,hidePagination:!0,data:_,count:e.length,columns:D,hideActions:!0,setPageIndex:S,setPageSize:A,pageIndex:y,pageSize:j}),(0,x.jsx)(n.Ay,{item:!0,md:12,xl:2,sx:{mt:4},children:(0,x.jsxs)(n.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,x.jsx)(s.A,{onClick:()=>{b(!a),t([]),N(void 0),C("/cancel-ptp")},size:"small",variant:"outlined",color:"primary",children:"Back"}),(0,x.jsx)(s.A,{disabled:k,size:"small",type:"submit",variant:"contained",color:"primary",children:"Reverse"})]})})]})]})})]})}}}]);