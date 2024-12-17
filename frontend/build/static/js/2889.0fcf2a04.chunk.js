"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[2889],{12889:(e,t,a)=>{a.r(t),a.d(t,{default:()=>P});var s=a(9950),r=a(27081),o=a(96583),n=a(42623),i=a(4139),d=a(67535),l=a(60666),c=a(9449),u=a(26473),m=a(71826),p=a(96951),h=a(14351),g=a(84601),f=a(62054),y=a(44414);const v=e=>{const{onClick:t,data:a,view:o,update:v,refreshPagination:x}=e,A=(0,c.mN)({resolver:(0,u.t)(l.Ik().shape({masterId:g.A.masterId,name:g.A.name,remarks:g.A.remarks})),defaultValues:{},mode:"all"}),{handleSubmit:S,setValue:k}=A;(0,s.useEffect)((()=>{var e;(o||v)&&(e=a,Object.entries(e).forEach((e=>{let[t,a]=e;k(t,a)})))}),[a,v,o,k]);const b=(0,r.wA)(),j=function(e,t,a,s){let r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,y.jsx)(p.o3,{name:e,type:a,label:t,InputLabelProps:{shrink:r},...s&&{required:!0},...o?{disabled:!0}:v?{disabled:!1}:{}})};return(0,y.jsx)(y.Fragment,{children:(0,y.jsx)(p.Op,{methods:A,onSubmit:S((async e=>{let s;if(s=v?await(0,m.default)("/master-maker-update",{method:"PUT",body:e,params:a.id}):await(0,m.default)("/master-maker-form",{method:"POST",body:e}),s.success){const e=v?"Master Maker updated successfully!":"Master Maker added successfully!";(0,f.A)(e,{variant:"success",autoHideDuration:1e4}),x(),b((0,n.b)()),t()}else{var r,o;(0,f.A)((null===(r=s)||void 0===r||null===(o=r.error)||void 0===o?void 0:o.message)||"Operation failed. Please try again.",{variant:"error"})}})),children:(0,y.jsxs)(h.A,{title:(o?"View ":v?"Update ":"Add ")+"Master",children:[(0,y.jsxs)(i.Ay,{container:!0,spacing:4,children:[(0,y.jsx)(i.Ay,{item:!0,md:3,xl:2,children:j("name","Name","text",!0)}),(0,y.jsx)(i.Ay,{item:!0,md:3,xl:2,children:j("remarks","Remarks","text",!1)})]}),(0,y.jsx)(i.Ay,{container:!0,spacing:2,alignItems:"center",sx:{mt:2},children:(0,y.jsxs)(i.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,y.jsx)(d.A,{onClick:t,size:"small",variant:"outlined",color:"primary",children:"Back"}),!o&&(0,y.jsx)(d.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:v?"Update":"Save"})]})})]})})})};var x=a(66369),A=a(99635),S=a(64499),k=a(89649),b=a(39225),j=a(52867),C=a(30423),w=a(65920);const P=()=>{const{paginations:{pageSize:e,pageIndex:t,forceUpdate:a},refreshPagination:i,setPageIndex:d,setPageSize:l}=(0,k.A)(),{searchString:c,setSearchString:u,accessorsRef:p,setAccessors:h,forceSearch:g,searchStringTrimmed:P}=(0,b.A)(),[M,I]=(0,s.useState)(!1),[O,H]=(0,s.useState)(!1),[T,R]=(0,s.useState)(!1),[z,B]=(0,s.useState)(!1),[D,E]=(0,s.useState)(null),[N,U]=(0,s.useState)(null),[_,L]=(0,s.useState)(null),[V,F]=(0,s.useState)(1),[q,J]=(0,s.useState)(null),[K,Q]=(0,s.useState)(!1),[W,Z]=(0,s.useState)(!1),[$,G]=(0,s.useState)(null),X=(0,r.wA)(),{filterObjectForApi:Y}=(0,C.bZ)(),ee=(0,w.A)(Y),te=(0,w.A)($);(0,s.useEffect)((()=>{[[ee,Y],[te,$]].some(j.$H)?i():X((0,n.b)({pageIndex:t,pageSize:e,listType:V,...P&&{searchString:P,accessors:JSON.stringify(p.current)},sortBy:(null===$||void 0===$?void 0:$[0])||"updatedAt",sortOrder:(null===$||void 0===$?void 0:$[1])||"DESC",filterObject:Y}))}),[p,X,V,t,e,P,$,a,g,i,ee,Y,te]),(0,s.useEffect)((()=>{null!==D&&void 0!==D&&D.id&&X((0,n.x)({pageIndex:t,pageSize:e,listType:V,recordId:null===D||void 0===D?void 0:D.id}))}),[X,t,e,V,D,a]);const{masterMakers:ae,masterMakerHistory:se}=(0,x.y)(),{data:re,count:oe}=(0,s.useMemo)((()=>{var e,t;return{data:(null===(e=ae.masterMakerObject)||void 0===e?void 0:e.rows)||[],count:(null===(t=ae.masterMakerObject)||void 0===t?void 0:t.count)||0,isLoading:ae.loading||!1}}),[ae]),{historyData:ne,historyCounts:ie}=(0,s.useMemo)((()=>{var e,t;return{historyData:(null===(e=se.masterMakerHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(t=se.masterMakerHistoryObject)||void 0===t?void 0:t.count)||0,isLoading:se.loading||!1}}),[se]),de=(0,s.useMemo)((()=>[{Header:"Master ID",accessor:"id",filterProps:{tableName:"master_makers",getColumn:"id",customAccessor:"masterId"}},{Header:"Name",accessor:"name",filterProps:{tableName:"master_makers",getColumn:"name",customAccessor:"name"}},{Header:"Remarks",accessor:"remarks",filterProps:{tableName:"master_makers",getColumn:"remarks",customAccessor:"remarks"}},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"updatedBy"}},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"createdBy"}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Created On",accessor:"createdAt"}]),[]),le=()=>{Q(!1),F(1),J(null),Z(!1),H(!O)};return(0,y.jsxs)(y.Fragment,{children:[O?(0,y.jsx)(v,{refreshPagination:i,onClick:le,...q&&{data:q},...K&&{view:K,update:!1},...W&&{update:W,view:!1}}):(0,y.jsx)(A.default,{title:"Master Maker",data:re,columns:de,count:oe,setPageIndex:d,setPageSize:l,pageIndex:t,pageSize:e,onClick:le,handleRowView:e=>{H(!0),Q(!0),Z(!1),J(e)},handleRowDelete:e=>{U(e),I(!0)},handleRowUpdate:e=>{H(!0),Z(!0),Q(!1),J(e)},handleRowRestore:async e=>{L(e),R(!0)},listType:V,setListType:e=>{F(e)},handleRowHistory:e=>{E(e),B(!0)},searchConfig:{searchString:c,searchStringTrimmed:P,setSearchString:u,setAccessors:h},sortConfig:{sort:$,setSort:G},exportConfig:{tableName:"master_makers",apiQuery:{listType:V,filterObject:Y}}}),(0,y.jsx)(S.A,{open:M,handleClose:()=>I(!1),handleConfirm:async()=>{const e=await(0,m.default)("/delete-master-maker",{method:"DELETE",params:N});var t;e.success?(i(),I(!1)):(0,f.A)(null===e||void 0===e||null===(t=e.error)||void 0===t?void 0:t.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,y.jsx)(S.A,{open:T,handleClose:()=>R(!1),handleConfirm:async()=>{const e={..._,isActive:"1"};(await(0,m.default)("/master-maker-update",{method:"PUT",body:e,params:e.id})).success&&(i(),R(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,y.jsx)(o.A,{open:z,onClose:()=>B(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,y.jsx)(A.default,{isHistory:!0,title:null===D||void 0===D?void 0:D.name,data:ne,columns:de,count:ie,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:d,setPageSize:l,pageIndex:t,pageSize:e})})]})}}}]);