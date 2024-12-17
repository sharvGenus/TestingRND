"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[1377],{51377:(e,t,a)=>{a.r(t),a.d(t,{default:()=>C});var r=a(9950),s=a(96583),o=a(27081),d=a(80733),i=a(4139),l=a(67535),n=a(60666),c=a(9449),u=a(26473),m=a(71826),p=a(96951),h=a(14351),v=a(84601),y=a(62054),g=a(44414);const f=e=>{const{data:t,view:a,update:s,setRefresh:o,refreshPagination:d,setSelectedProject:f,setSelectedMeterType:j,projectData:A,meterTypeData:S}=e,x=(0,c.mN)({resolver:(0,u.t)(n.Ik().shape({projectId:v.A.other,meterTypeId:v.A.other,name:v.A.name})),defaultValues:{},mode:"all"}),{handleSubmit:b,setValue:I,clearErrors:k,getValues:w}=x,T=(0,r.useCallback)((()=>{o();const e=w();x.reset({name:"",projectId:e.projectId,meterTypeId:e.meterTypeId})}),[o,x,w]);(0,r.useEffect)((()=>{var e,r,o;(a||s)&&(I("projectId",null===t||void 0===t||null===(e=t.project)||void 0===e?void 0:e.id),I("meterTypeId",null===t||void 0===t||null===(r=t.meterType)||void 0===r?void 0:r.id),o=t,Object.entries(o).forEach((e=>{let[t,a]=e;I(t,a)})));k()}),[t,s,a,I,k,T]);const C=(e,t,r,o,d)=>(0,g.jsx)(p.eu,{name:e,label:t,InputLabelProps:{shrink:!0},menus:r,onChange:d,...o&&{required:!0},...a||s?{disable:!0}:{}});return(0,g.jsx)(g.Fragment,{children:(0,g.jsx)(p.Op,{methods:x,onSubmit:b((async e=>{let a;if(a=s?await(0,m.default)("/qa-master-maker-update",{method:"PUT",body:e,params:t.id}):await(0,m.default)("/qa-master-maker-form",{method:"POST",body:e}),a.success){const e=s?"QA Master Maker updated successfully!":"QA Master Maker added successfully!";(0,y.A)(e,{variant:"success",autoHideDuration:1e4}),d(),T()}else{var r,o;(0,y.A)((null===(r=a)||void 0===r||null===(o=r.error)||void 0===o?void 0:o.message)||"Operation failed. Please try again.",{variant:"error"})}})),children:(0,g.jsx)(h.A,{title:(a?"View ":s?"Update ":"Add ")+"QA Master",sx:{mb:2},children:(0,g.jsxs)(i.Ay,{container:!0,spacing:4,children:[(0,g.jsx)(i.Ay,{item:!0,md:3,xl:2,children:C("projectId","Project Name",A,!0,(e=>{var t;f(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}))}),(0,g.jsx)(i.Ay,{item:!0,md:3,xl:2,children:C("meterTypeId","Meter Type",S||[],!0,(e=>{var t;j(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}))}),(0,g.jsx)(i.Ay,{item:!0,md:3,xl:2,children:function(e,t,r,o){let d=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,g.jsx)(p.o3,{name:e,type:r,label:t,InputLabelProps:{shrink:d},...o&&{required:!0},...a?{disabled:!0}:s?{disabled:!1}:{}})}("name","Master Name","text",!0)}),(0,g.jsx)(i.Ay,{item:!0,md:12,xl:6,sx:{mt:4,textAlign:"right"},children:a?(0,g.jsx)(l.A,{onClick:T,size:"small",variant:"outlined",color:"primary",children:"Back"}):s?(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(l.A,{style:{marginRight:20},size:"small",type:"submit",variant:"contained",color:"primary",children:"Update"}),(0,g.jsx)(l.A,{onClick:T,size:"small",variant:"outlined",color:"primary",children:"Back"})]}):(0,g.jsx)(l.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Save"})})]})})})})};var j=a(66450),A=a(99635),S=a(89649),x=a(64499),b=a(29024),I=a(39225),k=a(30423),w=a(65920),T=a(52867);const C=()=>{const{paginations:{pageSize:e,pageIndex:t,forceUpdate:a},refreshPagination:i,setPageIndex:l,setPageSize:n}=(0,S.A)(),{searchString:c,setSearchString:u,accessorsRef:p,setAccessors:h,forceSearch:v,searchStringTrimmed:C}=(0,I.A)(),M=(0,o.wA)(),[P,q]=(0,r.useState)(""),[D,O]=(0,r.useState)(""),[_,z]=(0,r.useState)(!1),[H,B]=(0,r.useState)(!1),[E,R]=(0,r.useState)(!1),[N,U]=(0,r.useState)([]),[L,Q]=(0,r.useState)(null),[V,F]=(0,r.useState)(null),[G,J]=(0,r.useState)(null),[K,W]=(0,r.useState)(1),[Y,Z]=(0,r.useState)(null),[$,X]=(0,r.useState)(!1),[ee,te]=(0,r.useState)(!1),[ae,re]=(0,r.useState)(null);(0,r.useEffect)((()=>{M((0,b.uiG)())}),[M]),(0,r.useEffect)((()=>{null!==L&&void 0!==L&&L.id&&M((0,b.zc_)({pageIndex:t,pageSize:e,listType:K,recordId:null===L||void 0===L?void 0:L.id}))}),[M,t,e,a,K,L]);const{filterObjectForApi:se}=(0,k.bZ)(),oe=(0,w.A)(se),de=(0,w.A)(ae),ie=(0,r.useCallback)((async e=>{const t=await(0,m.default)("/master-maker-lovs-list",{method:"GET",query:{masterId:e,forDropdown:"1"}});var a,r;if(t.success)return null===t||void 0===t||null===(a=t.data)||void 0===a||null===(r=a.data)||void 0===r?void 0:r.rows;const s=t.error&&t.error.message?t.error.message:t.error;s&&(0,y.A)(s)}),[]),le=(0,r.useCallback)((async()=>{let e=await ie("0eba82dc-29af-4694-b943-af7d86fc686f");U(e)}),[ie]);(0,r.useEffect)((()=>{[[oe,se],[de,ae]].some(T.$H)?i():(le(),P&&D&&M((0,b.caL)({pageIndex:t,pageSize:e,listType:K,projectId:P,meterTypeId:D,...C&&{searchString:C,accessors:JSON.stringify(p.current)},sortBy:null===ae||void 0===ae?void 0:ae[0],sortOrder:null===ae||void 0===ae?void 0:ae[1],filterObject:se})))}),[M,t,e,K,P,D,a,C,ae,p,v,i,oe,se,de,le]);const{projectsDropdown:ne}=(0,d.Y)(),ce=null===ne||void 0===ne?void 0:ne.projectsDropdownObject,{masterMakerQAs:ue,qaMasterMakerHistory:me}=(0,j.m)(),{data:pe,count:he}=(0,r.useMemo)((()=>{var e,t;return{data:(null===(e=ue.qaMasterMakerObject)||void 0===e?void 0:e.rows)||[],count:(null===(t=ue.qaMasterMakerObject)||void 0===t?void 0:t.count)||0,isLoading:ue.loading||!1}}),[ue]),{historyData:ve,historyCounts:ye}=(0,r.useMemo)((()=>{var e,t;return{historyData:(null===(e=me.qaMasterMakerHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(t=me.qaMasterMakerHistoryObject)||void 0===t?void 0:t.count)||0,isLoading:me.loading||!1}}),[me]),ge=(0,r.useMemo)((()=>[{Header:"Master ID",accessor:"id",filterProps:{tableName:"qa_master_makers",getColumn:"id",customAccessor:"masterId",projectId:P}},{Header:"Master Name",accessor:"name",filterProps:{tableName:"qa_master_makers",getColumn:"name",customAccessor:"name",projectId:P}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"qa_master_makers",getColumn:"updated_by",customAccessor:"updatedBy",projectId:P}},{Header:"Created On",accessor:"createdAt"},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"qa_master_makers",getColumn:"created_by",customAccessor:"createdBy",projectId:P}}]),[P]),fe=()=>{X(!1),te(!1),Z(null)};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(f,{refreshPagination:i,selectedProject:P,setSelectedProject:q,setRefresh:fe,projectData:ce,meterTypeData:N||[],setSelectedMeterType:O,...Y&&{data:Y},...$&&{view:$,update:!1},...ee&&{update:ee,view:!1}}),P&&D&&(0,g.jsx)(A.default,{hideAddButton:!0,data:pe,columns:ge,count:he,setPageIndex:l,setPageSize:n,pageIndex:t,pageSize:e,handleRowDelete:e=>{F(e),z(!0)},handleRowRestore:async e=>{J(e),B(!0)},handleRowUpdate:e=>{te(!0),X(!1),Z(e)},handleRowHistory:e=>{Q(e),R(!0)},handleRowView:e=>{X(!0),te(!1),Z(e)},listType:K,setListType:e=>{W(e),fe()},searchConfig:{searchString:c,searchStringTrimmed:C,setSearchString:u,setAccessors:h},sortConfig:{sort:ae,setSort:re},exportConfig:{tableName:"qa_master_makers",fileName:"qa-master",apiQuery:{listType:K,projectId:P,meterTypeId:D,filterObject:se}}}),(0,g.jsx)(x.A,{open:_,handleClose:()=>z(!1),handleConfirm:async()=>{const e=await(0,m.default)("/delete-qa-master-maker",{method:"DELETE",params:V});var t;e.success?(i(),z(!1)):(0,y.A)(null===e||void 0===e||null===(t=e.error)||void 0===t?void 0:t.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,g.jsx)(x.A,{open:H,handleClose:()=>B(!1),handleConfirm:async()=>{const e={...G,isActive:"1"};(await(0,m.default)("/qa-master-maker-update",{method:"PUT",body:e,params:e.id})).success&&(i(),B(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,g.jsx)(s.A,{open:E,onClose:()=>R(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,g.jsx)(A.default,{isHistory:!0,title:null===L||void 0===L?void 0:L.name,data:ve,columns:ge,count:ye,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:l,setPageSize:n,pageIndex:t,pageSize:e})})]})}}}]);