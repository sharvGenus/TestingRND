"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[8106],{28106:(e,t,a)=>{a.r(t),a.d(t,{default:()=>k});var r=a(9950),o=a(27081),s=a(95537),n=a(4139),i=a(67535),d=a(60666),l=a(9449),c=a(26473),u=a(28429),m=a(29024),v=a(80415),p=a(88848),g=a(96951),h=a(14351),S=a(99635),f=a(71826),I=a(62054),x=a(47501),y=a(52351),b=a(44414);const k=()=>{const[e,t]=(0,r.useState)([]),[a,k]=(0,r.useState)(!1),[j,A]=(0,r.useState)(v.j7.pageIndex),[_,O]=(0,r.useState)(v.j7.pageSize),[N,T]=(0,r.useState)(!1),[C,L]=(0,r.useState)(!1),w=(0,u.Zp)(),q=(0,l.mN)({resolver:(0,c.t)(d.Ik().shape({})),defaultValues:{},mode:"all"}),z=(0,o.wA)();(0,r.useEffect)((()=>{z((0,m._G1)()),z((0,m.uiG)())}),[z]);const{masterMakerLovs:P}=(0,p.$)(),D=(e,t)=>{const a=e&&e.filter((e=>e.name===t));return a&&a.length?a[0].id:void 0},H=P.masterMakerLovsObject.rows,M=D(H,"CANCELSTO"),E=D(H,"COMPANY");(0,r.useEffect)((()=>{E&&z((0,m.qV$)({organizationType:E}))}),[z,E]);const{handleSubmit:G}=q,$=(0,r.useMemo)((()=>[{Header:"Name",accessor:"material.name"},{Header:"Code",accessor:"material.code"},{Header:"Quantity",accessor:"quantity"},{Header:"UOM",accessor:"uom.name"}]),[]),F=e=>{if(e&&e.length>0){return e.map((e=>e.serialNumber))}return[]},J=e=>{let t=[];return e&&e.length>0&&e.map((e=>t.push(e.id))),t};return(0,r.useEffect)((()=>{if(null===N||void 0===N||!N.length)return;let e=JSON.parse(JSON.stringify(N));e.map((e=>{e.quantity=0-e.quantity})),t(e)}),[N]),(0,b.jsxs)(b.Fragment,{children:[C&&(0,b.jsx)(y.A,{}),(0,b.jsx)(g.Op,{methods:q,onSubmit:G((async()=>{var t,a,r;L(!0);const o=(()=>{var t,a,r,o;const s=[];e.map((e=>{s.push({transactionTypeId:M,projectId:e.projectId,requestNumber:e.referenceDocumentNumber,organizationId:null===e||void 0===e?void 0:e.organizationId,storeId:e.storeId,storeLocationId:e.storeLocationId,otherStoreId:null===e||void 0===e?void 0:e.otherStoreId,otherStoreLocationId:null===e||void 0===e?void 0:e.otherStoreLocationId,materialId:e.materialId,uomId:e.uomId,quantity:e.quantity,rate:e.rate,value:e.value,tax:e.tax,serialNumber:F(e.material_serial_numbers)})}));const n={transactionTypeId:M,stoIds:J(e),stoLedgerDetailId:null===e||void 0===e||null===(t=e[0])||void 0===t||null===(a=t.stock_ledger_detail)||void 0===a?void 0:a.id,stock_ledgers:s};return e&&e[0]&&e[0].stock_ledger_detail&&e[0].stock_ledger_detail.toStoreId&&null!==e[0].stock_ledger_detail.toStoreId&&(n.stoGrnStoreId=null===(r=e[0])||void 0===r||null===(o=r.stock_ledger_detail)||void 0===o?void 0:o.toStoreId),n})(),s=await(0,f.default)("/cancel-sto-transaction-create",{method:"POST",body:o,timeoutOverride:12e4});var n;if(!s.success)return(0,I.A)((null===s||void 0===s||null===(n=s.error)||void 0===n?void 0:n.message)||"Operation failed. Please try again!",{variant:"error"}),void L(!1);const i=null!==(t=null===(a=s.data)||void 0===a?void 0:a.data)&&void 0!==t?t:{},d=i.referenceDocumentNumber||(null===(r=i[0])||void 0===r?void 0:r.referenceDocumentNumber);(0,I.A)(d?`Transaction cancelled with reference number: ${d}`:"Transaction cancelled successfully!",{variant:"success",autoHideDuration:1e4}),L(!1),w("/stock-ledger")})),children:(0,b.jsxs)(h.A,{title:"Cancel STO(Stock Transfer Order)",sx:{mb:2,pb:2},children:[(0,b.jsx)(x.A,{type:"stockLedger",transactionType:"STO",fromStoreLabel:"Company Store",fromStoreType:"COMPANY",showFromStoreAddress:!0,disableAll:!(null===N||void 0===N||!N.length),setReqData:T}),e&&e.length>0&&(0,b.jsxs)(s.A,{sx:{mt:3},children:[(0,b.jsx)(S.default,{title:"Cancel STO",hideHeader:!0,hidePagination:!0,data:e,count:e.length,columns:$,hideActions:!0,setPageIndex:A,setPageSize:O,pageIndex:j,pageSize:_}),(0,b.jsx)(n.Ay,{item:!0,md:12,xl:2,sx:{mt:4},children:(0,b.jsxs)(n.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,b.jsx)(i.A,{onClick:()=>{k(!a),t([]),w("/cancel-sto")},size:"small",variant:"outlined",color:"primary",children:"Back"}),(0,b.jsx)(i.A,{disabled:C,size:"small",type:"submit",variant:"contained",color:"primary",children:"Reverse"})]})})]})]})})]})}}}]);