"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[3811],{23811:(e,t,a)=>{a.r(t),a.d(t,{default:()=>L});var r=a(9950),n=a(96583),d=a(27081),l=a(29024),s=a(80733),o=a(55851),i=a(12257),c=a(4139),u=a(67535),v=a(60666),p=a(9449),m=a(26473),b=a(71826),y=a(96951),h=a(14351),f=a(84601),g=a(62054),j=a(44414);const x=e=>{const t=(0,d.wA)(),{data:a,view:n,update:s,setRefresh:x,selectedParent:I,selectedProject:A,setSelectedProject:S,setSelectedParent:P,setSelectedUrbanId:E,refreshPagination:C,setSelectedParentId:w,projectData:H,user:L}=e,D=(0,p.mN)({resolver:(0,m.t)(v.Ik().shape({name:f.A.other,code:f.A.other,urbanHierarchyId:f.A.other,projectId:f.A.other,approvalStatus:f.A.other})),defaultValues:{},mode:"all"}),N="577b8900-b333-42d0-b7fb-347abc3f0b5c"===(null===L||void 0===L?void 0:L.id)||"57436bed-c176-4625-96af-aaeec88cdc90"===(null===L||void 0===L?void 0:L.id)?[{name:"Approved",id:"Approved"},{name:"Unapproved",id:"Unapproved"}]:[{name:"Unapproved",id:"Unapproved"}],{handleSubmit:O,setValue:U,getValues:k,clearErrors:B}=D,T=(0,r.useCallback)((()=>{x();const e=k();D.reset({name:"",code:"",projectId:e.projectId,urbanHierarchyId:e.urbanHierarchyId,approvalStatus:""})}),[x,D,k]);(0,r.useEffect)((()=>{var e,t;(a||T(),n||s)&&(U("urbanHierarchyId",a.urbanHierarchyId),U("projectId",null===a||void 0===a||null===(e=a.urban_hierarchy)||void 0===e?void 0:e.projectId),U("approvalStatus",null===a||void 0===a?void 0:a.approvalStatus),t=a,Object.entries(t).forEach((e=>{let[t,a]=e;U(t,a)})));B()}),[a,s,n,U,T,B]),(0,r.useEffect)((()=>{if(A){const e="577b8900-b333-42d0-b7fb-347abc3f0b5c"===(null===L||void 0===L?void 0:L.id)||"57436bed-c176-4625-96af-aaeec88cdc90"===(null===L||void 0===L?void 0:L.id)?"":null===L||void 0===L?void 0:L.id;t((0,l.nqG)({projectId:A,userId:e}))}}),[t,A,null===L||void 0===L?void 0:L.id]);const{urbanProjects:z}=(0,o.H)(),{urbanData:R}=(0,r.useMemo)((()=>{var e;return{urbanData:(null===z||void 0===z||null===(e=z.urbanProjectsObject)||void 0===e?void 0:e.rows)||[]}}),[z]),{urbanLevelParents:_}=(0,o.H)(),{urbanLevelParentsData:V}=(0,r.useMemo)((()=>{var e,t;return{urbanLevelParentsData:(null===(e=_.urbanLevelParentsObject)||void 0===e||null===(t=e.rows)||void 0===t?void 0:t.map((e=>({id:e.id,name:`${e.name} - ${e.id}`}))))||[],isLoading:_.loading||!1}}),[_]),M=(e,t,a,r,d,l)=>(0,j.jsx)(i.A,{children:(0,j.jsx)(y.eu,{name:e,label:t,onChange:r,InputLabelProps:{shrink:!0},menus:a,...d&&{required:!0},...n||s?{disable:l}:{}})}),F=function(e,t,a,r){let d=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,j.jsx)(i.A,{spacing:1,children:(0,j.jsx)(y.o3,{name:e,type:a,label:t,InputLabelProps:{shrink:d},...r&&{required:!0},...n?{disabled:!0}:s?{disabled:!1}:{}})})};return(0,j.jsx)(j.Fragment,{children:(0,j.jsx)(y.Op,{methods:D,onSubmit:O((async e=>{if(I){let n;if(n=s?await(0,b.default)("/urban-level-entry-update",{method:"PUT",body:e,params:a.id}):await(0,b.default)("/urban-level-entry-form",{method:"POST",body:e}),n.success){const e=s?"Level Entry updated successfully!":"Level Entry added successfully!";(0,g.A)(e,{variant:"success",autoHideDuration:1e4}),x(),C()}else{var t,r;(0,g.A)((null===(t=n)||void 0===t||null===(r=t.error)||void 0===r?void 0:r.message)||"Operation failed. Please try again.",{variant:"error"})}}else(0,g.A)("Please use Rural level entry form for mapping column.",{variant:"warning"})})),children:(0,j.jsxs)(h.A,{title:(n?"View ":s?"Update ":"Add ")+"Urban Level Entry",sx:{mb:2},children:[(0,j.jsxs)(c.Ay,{container:!0,spacing:4,alignItems:"center",children:[(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:M("projectId","Project Name",H,(e=>{var t;S(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}),!0,!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:M("urbanHierarchyId","Level Name",R,(e=>{var a;E(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value);const r=R.find((t=>{var a;return t.rank+1==(null===(a=e.target)||void 0===a?void 0:a.rank)}));P(null===r||void 0===r?void 0:r.name),w(null===r||void 0===r?void 0:r.id),t((0,l.cYH)({listType:1,urbanId:null===r||void 0===r?void 0:r.id}))}),!0,!0)}),I&&(0,j.jsx)(c.Ay,{item:!0,md:6,xl:4,children:M("parentId",`Select ${I}`,V,!0,!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:M("approvalStatus","Select Status",N,(e=>{var t;U("approvalStatus",null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}),!0,"577b8900-b333-42d0-b7fb-347abc3f0b5c"!==(null===L||void 0===L?void 0:L.id)&&"57436bed-c176-4625-96af-aaeec88cdc90"!==(null===L||void 0===L?void 0:L.id))}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:F("name","Entry Name","text",!0,!1)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:F("code","Entry Code","text",!0,!1)})]}),(0,j.jsx)(c.Ay,{container:!0,spacing:2,alignItems:"end",sx:{mt:1},children:(0,j.jsx)(c.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:n?(0,j.jsx)(u.A,{onClick:T,size:"small",variant:"outlined",color:"primary",children:"Back"}):s?(0,j.jsxs)(c.Ay,{item:!0,sx:{display:"flex",gap:"20px"},children:[(0,j.jsx)(u.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Update"}),(0,j.jsx)(u.A,{onClick:T,size:"small",variant:"outlined",color:"primary",children:"Back"})]}):(0,j.jsx)(c.Ay,{item:!0,sx:{display:"flex",gap:"20px"},children:(0,j.jsx)(u.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Save"})})})})]})})})};var I=a(99635),A=a(64499),S=a(89649),P=a(39225),E=a(30423),C=a(65920),w=a(52867),H=a(33507);const L=()=>{const{paginations:{pageSize:e,pageIndex:t,forceUpdate:a},refreshPagination:i,setPageIndex:c,setPageSize:u}=(0,S.A)(),v=(0,d.wA)(),[p,m]=(0,r.useState)(""),[y,h]=(0,r.useState)(""),[f,L]=(0,r.useState)(!1),[D,N]=(0,r.useState)(!1),[O,U]=(0,r.useState)(!1),[k,B]=(0,r.useState)(null),[T,z]=(0,r.useState)(null),[R,_]=(0,r.useState)(null),[V,M]=(0,r.useState)(1),[F,$]=(0,r.useState)(null),[q,G]=(0,r.useState)(!1),[K,W]=(0,r.useState)(!1),[Y,J]=(0,r.useState)(null),[Q,Z]=(0,r.useState)(),[X,ee]=(0,r.useState)(null),{user:te}=(0,H.A)(),{searchString:ae,forceSearch:re,accessorsRef:ne,setAccessors:de,setSearchString:le,searchStringTrimmed:se}=(0,P.A)();(0,r.useEffect)((()=>{v((0,l.uiG)())}),[v]),(0,r.useEffect)((()=>{null!==k&&void 0!==k&&k.id&&v((0,l.NWK)({pageIndex:t,pageSize:e,listType:V,recordId:null===k||void 0===k?void 0:k.id}))}),[v,t,e,a,V,k]);const{filterObjectForApi:oe}=(0,E.bZ)(),ie=(0,C.A)(oe),ce=(0,C.A)(Y);(0,r.useEffect)((()=>{[[ie,oe],[ce,Y]].some(w.$H)?i():p&&v((0,l.Vrs)({pageIndex:t,pageSize:e,listType:V,urbanId:p,...se&&{searchString:se,accessors:JSON.stringify(ne.current)},sortBy:null===Y||void 0===Y?void 0:Y[0],sortOrder:null===Y||void 0===Y?void 0:Y[1],filterObject:oe}))}),[v,t,e,V,p,a,Y,se,ne,re,ie,oe,ce,i]);const{projectsDropdown:ue}=(0,s.Y)(),ve=null===ue||void 0===ue?void 0:ue.projectsDropdownObject,{urbanLevelProjects:pe,urbanLevelEntryHistory:me}=(0,o.H)(),{urbanLevelData:be,urbanCount:ye}=(0,r.useMemo)((()=>{var e,t;return{urbanLevelData:(null===(e=pe.urbanLevelProjectsObject)||void 0===e?void 0:e.rows)||[],urbanCount:(null===(t=pe.urbanLevelProjectsObject)||void 0===t?void 0:t.count)||0,isLoading:pe.loading||!1}}),[pe]),{historyLevelEntryData:he,historyLevelEntryCounts:fe}=(0,r.useMemo)((()=>{var e,t;return{historyLevelEntryData:(null===(e=me.urbanLevelEntryHistoryObject)||void 0===e?void 0:e.rows)||[],historyLevelEntryCounts:(null===(t=me.urbanLevelEntryHistoryObject)||void 0===t?void 0:t.count)||0,isLoading:me.loading||!1}}),[me]),ge=(0,r.useMemo)((()=>[{Header:"Entry ID",accessor:"id",filterProps:{tableName:"urbanEntry",getColumn:"id",customAccessor:"id",projectId:X,levelId:p}},{Header:"Entry Name",accessor:"name",filterProps:{tableName:"urbanEntry",getColumn:"name",customAccessor:"name",projectId:X,levelId:p}},{Header:"Entry Code",accessor:"code",filterProps:{tableName:"urbanEntry",getColumn:"code",customAccessor:"code",projectId:X,levelId:p}},{Header:"Parent ID",accessor:e=>{var t;return null===(t=e.parent)||void 0===t?void 0:t.id},exportAccessor:"parent.id",filterProps:{tableName:"urbanEntry",getColumn:"parent_id",customAccessor:"parentId",projectId:X,levelId:p}},{Header:"Parent Name",accessor:e=>{var t;return null===(t=e.parent)||void 0===t?void 0:t.name},exportAccessor:"parent.name",filterProps:{tableName:"urbanEntry",getColumn:"name",customAccessor:"parentName",projectId:X,levelId:y}},{Header:"Status",accessor:"approvalStatus",exportAccessor:"approval_status",filterProps:{tableName:"urbanEntry",getColumn:"approval_status",customAccessor:"approvalStatus",projectId:X,levelId:p}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"urbanEntry",getColumn:"updated_by",customAccessor:"updatedBy",projectId:X,levelId:p}},{Header:"Created On",accessor:"createdAt"},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"urbanEntry",getColumn:"created_by",customAccessor:"createdBy",projectId:X,levelId:p}}]),[p,X,y]),je=()=>{G(!1),W(!1),$(null)};return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(x,{refreshPagination:i,selectedProject:X,setSelectedProject:ee,setSelectedUrbanId:m,selectedParentId:y,selectedUrbanId:p,setRefresh:je,selectedParent:Q,setSelectedParent:Z,setSelectedParentId:h,projectData:ve,user:te,...F&&{data:F},...q&&{view:q,update:!1},...K&&{update:K,view:!1}}),p&&(0,j.jsx)(I.default,{hideAddButton:!0,hideImportButton:!1,data:be,columns:ge,count:ye,setPageIndex:c,setPageSize:u,pageIndex:t,pageSize:e,handleRowRestore:async e=>{_(e),N(!0)},handleRowDelete:async e=>{z(e),L(!0)},handleRowUpdate:e=>{W(!0),G(!1),$(e)},handleRowHistory:e=>{B(e),U(!0)},handleRowView:e=>{G(!0),W(!1),$(e)},listType:V,setListType:e=>{M(e),je()},sortConfig:{sort:Y,setSort:J},searchConfig:{searchString:ae,searchStringTrimmed:se,setSearchString:le,setAccessors:de},importConfig:{apiBody:{projectId:X,levelId:p,parentId:y,tableName:"urban_level_entries"}},setSelectedParentId:h,exportConfig:{tableName:"urban_level_entries",fileName:"urban-level-entry",apiQuery:{listType:V,urbanId:p,filterObject:oe}},disableDeleteIcon:"577b8900-b333-42d0-b7fb-347abc3f0b5c"!==(null===te||void 0===te?void 0:te.id)&&"57436bed-c176-4625-96af-aaeec88cdc90"!==(null===te||void 0===te?void 0:te.id),componentFrom:"urban-level-entry"}),(0,j.jsx)(A.A,{open:f,handleClose:()=>L(!1),handleConfirm:async()=>{const e=await(0,b.default)("/delete-urban-level-entry",{method:"DELETE",params:T});var t;e.success?(i(),L(!1)):(0,g.A)(null===e||void 0===e||null===(t=e.error)||void 0===t?void 0:t.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,j.jsx)(A.A,{open:D,handleClose:()=>N(!1),handleConfirm:async()=>{const e={...R,isActive:"1"};(await(0,b.default)("/urban-level-entry-update",{method:"PUT",body:e,params:e.id})).success&&(i(),N(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,j.jsx)(n.A,{open:O,onClose:()=>U(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,j.jsx)(I.default,{isHistory:!0,title:null===k||void 0===k?void 0:k.name,data:he,columns:ge,count:fe,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:c,setPageSize:u,pageIndex:t,pageSize:e})})]})}}}]);