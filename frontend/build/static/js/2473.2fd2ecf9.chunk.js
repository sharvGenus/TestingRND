"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[2473],{62473:(e,t,r)=>{r.r(t),r.d(t,{default:()=>O});var a=r(9950),s=r(96583),o=r(27081),n=r(29024),i=r(80733),d=r(12257),l=r(4139),c=r(67535),u=r(60666),p=r(9449),m=r(26473),h=r(71826),v=r(96951),g=r(14351),j=r(84601),f=r(62054),y=r(44414);const x=e=>{const{data:t,view:r,update:s,setRefresh:o,setSelectedProject:n,projectData:i,refreshPagination:x}=e,A=(0,p.mN)({resolver:(0,m.t)(u.Ik().shape({name:j.A.other,code:j.A.other,rank:j.A.other,projectId:j.A.project})),defaultValues:{},mode:"all"}),{handleSubmit:w,setValue:S,clearErrors:k,getValues:b}=A,C=(0,a.useCallback)((()=>{o();const e=b();A.reset({name:"",projectId:e.projectId})}),[o,A,b]);(0,a.useEffect)((()=>{var e;t||C(),(r||s)&&(S("projectId",t.project.id),e=t,Object.entries(e).forEach((e=>{let[t,r]=e;S(t,r)}))),k()}),[t,s,r,S,k,C]);const I=function(e,t,a,o){let n=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,y.jsx)(d.A,{spacing:1,children:(0,y.jsx)(v.o3,{name:e,type:a,label:t,InputLabelProps:{shrink:n},...o&&{required:!0},...r?{disabled:!0}:s?{disabled:!1}:{}})})};return(0,y.jsx)(y.Fragment,{children:(0,y.jsx)(v.Op,{methods:A,onSubmit:w((async e=>{let r;if(e.levelType="network",r=s?await(0,h.default)("/network-hierarchies-update",{method:"PUT",body:e,params:t.id}):await(0,h.default)("/network-hierarchies-form",{method:"POST",body:e}),r.success){const e=s?"Level updated successfully!":"Level added successfully!";(0,f.A)(e,{variant:"success",autoHideDuration:1e4}),o(),x()}else{var a,n;(0,f.A)((null===(a=r)||void 0===a||null===(n=a.error)||void 0===n?void 0:n.message)||"Operation failed. Please try again.",{variant:"error"})}})),children:(0,y.jsx)(g.A,{title:(r?"View ":s?"Update ":"Add ")+"Network Level",sx:{mb:2},children:(0,y.jsxs)(l.Ay,{container:!0,spacing:4,children:[(0,y.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(P="projectId",L="Project Name",O=i,T=e=>{var t;n(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)},H=!0,(0,y.jsx)(d.A,{children:(0,y.jsx)(v.eu,{name:P,label:L,onChange:T,InputLabelProps:{shrink:!0},menus:O,...H&&{required:!0},...r||s?{disable:!0}:{}})}))}),(0,y.jsx)(l.Ay,{item:!0,md:3,xl:2,children:I("name","Level Name","text",!0)}),(0,y.jsx)(l.Ay,{item:!0,md:3,xl:2,children:I("code","Level Code","text",!0)}),(0,y.jsx)(l.Ay,{item:!0,md:3,xl:2,children:I("rank","Rank","number",!0)}),(0,y.jsx)(l.Ay,{container:!0,spacing:2,alignItems:"end",sx:{mt:1},children:(0,y.jsx)(l.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:r?(0,y.jsx)(c.A,{onClick:C,size:"small",variant:"outlined",color:"primary",children:"Back"}):s?(0,y.jsxs)(l.Ay,{item:!0,sx:{display:"flex",gap:"20px"},children:[(0,y.jsx)(c.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Update"}),(0,y.jsx)(c.A,{onClick:C,size:"small",variant:"outlined",color:"primary",children:"Back"})]}):(0,y.jsx)(l.Ay,{item:!0,sx:{display:"flex",gap:"20px"},children:(0,y.jsx)(c.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Save"})})})})]})})})});var P,L,O,T,H};var A=r(87991),w=r(99635),S=r(64499),k=r(89649),b=r(39225),C=r(30423),I=r(65920),P=r(52867);const L=["rank","ASC"],O=()=>{const{paginations:{pageSize:e,pageIndex:t,forceUpdate:r},refreshPagination:d,setPageIndex:l,setPageSize:c}=(0,k.A)(),u=(0,o.wA)(),[p,m]=(0,a.useState)(""),[v,g]=(0,a.useState)(!1),[j,O]=(0,a.useState)(!1),[T,H]=(0,a.useState)(!1),[N,B]=(0,a.useState)(null),[D,R]=(0,a.useState)(null),[z,E]=(0,a.useState)(null),[U,V]=(0,a.useState)(1),[_,M]=(0,a.useState)(null),[F,q]=(0,a.useState)(!1),[G,J]=(0,a.useState)(!1),[K,Q]=(0,a.useState)(L),{searchString:W,setSearchString:Y,accessorsRef:Z,setAccessors:$,forceSearch:X,searchStringTrimmed:ee}=(0,b.A)();(0,a.useEffect)((()=>{u((0,n.uiG)())}),[u]),(0,a.useEffect)((()=>{null!==N&&void 0!==N&&N.id&&u((0,n.VMt)({pageIndex:t,pageSize:e,listType:U,recordId:null===N||void 0===N?void 0:N.id}))}),[u,t,e,r,U,N]);const{filterObjectForApi:te}=(0,C.bZ)(),re=(0,I.A)(te),ae=(0,I.A)(K);(0,a.useEffect)((()=>{[[re,te],[ae,K]].some(P.$H)?d():p&&u((0,n.BsN)({pageIndex:t,pageSize:e,listType:U,projectId:p,...ee&&{searchString:ee,accessors:JSON.stringify(Z.current)},sortBy:null===K||void 0===K?void 0:K[0],sortOrder:null===K||void 0===K?void 0:K[1],filterObject:te}))}),[u,t,e,U,p,r,ee,K,Z,X,re,te,ae,d]);const{projectsDropdown:se}=(0,i.Y)(),oe=null===se||void 0===se?void 0:se.projectsDropdownObject,{networkProjects:ne,networkHistory:ie}=(0,A.f)(),{data:de,count:le}=(0,a.useMemo)((()=>{var e,t;return{data:(null===(e=ne.networkProjectsObject)||void 0===e?void 0:e.rows)||[],count:(null===(t=ne.networkProjectsObject)||void 0===t?void 0:t.count)||0,isLoading:ne.loading||!1}}),[ne]),{historyData:ce,historyCounts:ue}=(0,a.useMemo)((()=>{var e,t;return{historyData:(null===(e=ie.networkHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(t=ie.networkHistoryObject)||void 0===t?void 0:t.count)||0,isLoading:ie.loading||!1}}),[ie]),pe=(0,a.useMemo)((()=>[{Header:"Level ID",accessor:"id",filterProps:{tableName:"networkLevel",getColumn:"id",customAccessor:"id",projectId:p}},{Header:"Level Name",accessor:"name",filterProps:{tableName:"networkLevel",getColumn:"name",customAccessor:"name",projectId:p}},{Header:"Level Code",accessor:"code",filterProps:{tableName:"networkLevel",getColumn:"code",customAccessor:"code",projectId:p}},{Header:"Rank",accessor:"rank",filterProps:{tableName:"networkLevel",getColumn:"rank",customAccessor:"rank",projectId:p}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"networkLevel",getColumn:"updated_by",customAccessor:"updatedBy",projectId:p}},{Header:"Created On",accessor:"createdAt"},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"networkLevel",getColumn:"created_by",customAccessor:"createdBy",projectId:p}}]),[p]),me=()=>{q(!1),J(!1),M(null)};return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(x,{refreshPagination:d,selectedProject:p,setSelectedProject:m,setRefresh:me,projectData:oe,..._&&{data:_},...F&&{view:F,update:!1},...G&&{update:G,view:!1}}),p&&(0,y.jsx)(w.default,{hideDeleteIcon:!0,hideRestoreIcon:!0,hideAddButton:!0,hideType:!0,hideSearch:!0,hideImportButton:!0,data:de,columns:pe,count:le,setPageIndex:l,setPageSize:c,pageIndex:t,pageSize:e,handleRowRestore:async e=>{E(e),O(!0)},handleRowDelete:e=>{R(e),g(!0)},handleRowUpdate:e=>{"gaa"!==e.levelType?(J(!0),q(!1),M(e)):(0,f.A)("Update action is not allowed for GAA mapping level.",{variant:"warning"})},handleRowHistory:e=>{B(e),H(!0)},handleRowView:e=>{q(!0),J(!1),M(e)},listType:U,setListType:e=>{V(e),me()},searchConfig:{searchString:W,searchStringTrimmed:ee,setSearchString:Y,setAccessors:$},sortConfig:{sort:K,setSort:Q,defaultSort:L},exportConfig:{tableName:"network_hierarchies",fileName:"network-level",apiQuery:{listType:U,projectId:p,filterObject:te}}}),(0,y.jsx)(S.A,{open:v,handleClose:()=>g(!1),handleConfirm:async()=>{const e=await(0,h.default)("/delete-network-hierarchies",{method:"DELETE",params:D});var t;e.success?(d(),g(!1)):(0,f.A)(null===e||void 0===e||null===(t=e.error)||void 0===t?void 0:t.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,y.jsx)(S.A,{open:j,handleClose:()=>O(!1),handleConfirm:async()=>{const e={...z,isActive:"1"};(await(0,h.default)("/network-hierarchies-update",{method:"PUT",body:e,params:e.id})).success&&(d(),O(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,y.jsx)(s.A,{open:T,onClose:()=>H(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,y.jsx)(w.default,{isHistory:!0,title:null===N||void 0===N?void 0:N.name,data:ce,columns:pe,count:ue,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:l,setPageSize:c,pageIndex:t,pageSize:e})})]})}}}]);