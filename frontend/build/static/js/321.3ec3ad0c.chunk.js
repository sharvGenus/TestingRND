"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[321],{64499:(e,t,a)=>{a.d(t,{A:()=>f});var o=a(9950),r=a(65669),n=a(43263),i=a(57191),s=a(95537),d=a(67535),c=a(87233),l=a(44414);f.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const u={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},m={display:"flex",flexDirection:"row",padding:"15px 0"},g={display:"flex",justifyContent:"flex-end",gap:2},p={marginTop:2,display:"flex",fontSize:"14px"};function f(e){let{open:t,handleClose:a,title:f,message:b,closeBtnTitle:y,confirmBtnTitle:h,handleConfirm:x,confirmColor:S}=e;const[v,A]=(0,o.useState)(null);return(0,o.useEffect)((()=>{A(null)}),[t]),(0,l.jsx)("div",{children:(0,l.jsx)(r.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:t,closeAfterTransition:!0,slots:{backdrop:n.A},slotProps:{backdrop:{timeout:500}},children:(0,l.jsx)(i.A,{in:t,children:(0,l.jsxs)(s.A,{sx:u,children:[(0,l.jsx)(c.A,{id:"transition-modal-title",variant:"h4",children:f}),(0,l.jsx)(c.A,{id:"transition-modal-title",variant:"h6",sx:m,children:b}),(0,l.jsxs)(s.A,{sx:g,children:[!!a&&(0,l.jsx)(d.A,{onClick:a,size:"small",variant:"outlined",color:"primary",children:y}),!!x&&(0,l.jsx)(d.A,{onClick:x,size:"small",variant:"contained",color:S||"error",children:h})]}),v&&(0,l.jsx)(c.A,{variant:"p",color:"red",sx:p,children:v})]})})})})}},89649:(e,t,a)=>{a.d(t,{A:()=>n});var o=a(9950),r=a(80415);function n(){const[e,t]=(0,o.useState)({pageIndex:r.j7.pageIndex,pageSize:r.j7.pageSize,forceUpdate:!0}),a=(0,o.useCallback)((function(){let a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;t((e=>({pageIndex:a,pageSize:o,forceUpdate:!e.forceUpdate})))}),[e]),n=(0,o.useCallback)((()=>{t((e=>({pageIndex:r.j7.pageIndex,pageSize:r.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>t((t=>({...t,pageIndex:e,forceUpdate:!t.forceUpdate}))),setPageSize:e=>t((t=>({pageIndex:r.j7.pageIndex,pageSize:e,forceUpdate:!t.forceUpdate}))),refreshPagination:n,setPaginationsFunctions:a}}},39225:(e,t,a)=>{a.d(t,{A:()=>i});var o=a(41397),r=a.n(o),n=a(9950);const i=e=>{const{isFcMode:t}=e||{},[a,o]=(0,n.useState)(void 0),[i,s]=(0,n.useState)(!1),d=(0,n.useRef)([]),c=(0,n.useCallback)((e=>{const o=d.current;d.current=e,a&&(t||r().isEqual(e,o)||s((e=>!e)))}),[t,a]),l=(0,n.useMemo)((()=>null===a||void 0===a?void 0:a.trim()),[a]);return{searchString:a,searchStringTrimmed:l,forceSearch:i,accessorsRef:d,setSearchString:o,setAccessors:c}}},88848:(e,t,a)=>{a.d(t,{$:()=>n});var o=a(9950),r=a(27081);const n=()=>{const[e,t]=(0,o.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[a,n]=(0,o.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[i,s]=(0,o.useState)({masterObject:[],error:"",loading:!0}),[d,c]=(0,o.useState)({masterObject:[],error:"",loading:!0}),[l,u]=(0,o.useState)({masterObject:[],error:"",loading:!0}),[m,g]=(0,o.useState)({currencyObject:[],error:"",loading:!0}),[p,f]=(0,o.useState)({gstStatusObject:[],error:"",loading:!0}),[b,y]=(0,o.useState)({paymentTermObject:[],error:"",loading:!0}),[h,x]=(0,o.useState)({incotermsObject:[],error:"",loading:!0}),[S,v]=(0,o.useState)({titleObject:[],error:"",loading:!0}),[A,z]=(0,o.useState)({masterMakerLovHistoryObject:{},error:"",loading:!0}),j=(0,r.d4)((e=>e.masterMakerLov||{})),C=(0,r.d4)((e=>e.masterMakerLovList||{})),O=(0,r.d4)((e=>e.lovsForMasterName||[])),I=(0,r.d4)((e=>e.lovsForMasterNameSecond||[])),T=(0,r.d4)((e=>e.lovsForMasterNameThird||[])),E=(0,r.d4)((e=>e.currency||[])),w=(0,r.d4)((e=>e.gstStatus||[])),k=(0,r.d4)((e=>e.paymentTerm||[])),P=(0,r.d4)((e=>e.incoterms||[])),N=(0,r.d4)((e=>e.title||[])),L=(0,r.d4)((e=>e.masterMakerLovHistory||{}));return(0,o.useEffect)((()=>{t((e=>({...e,...j})))}),[j]),(0,o.useEffect)((()=>{n((e=>({...e,...C})))}),[C]),(0,o.useEffect)((()=>{s((e=>({...e,...O})))}),[O]),(0,o.useEffect)((()=>{c((e=>({...e,...I})))}),[I]),(0,o.useEffect)((()=>{u((e=>({...e,...T})))}),[T]),(0,o.useEffect)((()=>{g((e=>({...e,...E})))}),[E]),(0,o.useEffect)((()=>{f((e=>({...e,...w})))}),[w]),(0,o.useEffect)((()=>{y((e=>({...e,...k})))}),[k]),(0,o.useEffect)((()=>{x((e=>({...e,...P})))}),[P]),(0,o.useEffect)((()=>{v((e=>({...e,...N})))}),[N]),(0,o.useEffect)((()=>{z((e=>({...e,...L})))}),[L]),{masterMakerLovs:e,masterMakerLovsList:a,masterMakerOrgType:i,masterMakerOrgTypeSecond:d,masterMakerOrgTypeThird:l,masterMakerCurrency:m,masterMakerGstStatus:p,masterMakerIncoterms:h,masterMakerPaymentTerm:b,masterMakerLovHistory:A,masterMakerTitle:S}}},40321:(e,t,a)=>{a.r(t),a.d(t,{default:()=>P});var o=a(9950),r=a(28429),n=a(27081),i=a(96583),s=a(88848),d=a(55519),c=a(4139),l=a(67535),u=a(60666),m=a(9449),g=a(26473),p=a(71826),f=a(99144),b=a(28073),y=a(32112),h=a(96951),x=a(14351),S=a(84601),v=a(29024),A=a(52867),z=a(62054),j=a(44414);const C=e=>{const{orgType:t}=(0,r.g)(),[a,i]=(0,o.useState)(""),[C,O]=(0,o.useState)(""),{onClick:I,data:T,view:E,update:w,refreshPagination:k,title:P}=e,N=(0,m.mN)({resolver:(0,g.t)(u.Ik().shape({name:S.A.orgName,code:S.A.code,email:S.A.email,mobileNumber:S.A.mobileNumber,gstNumber:S.A.gstNumber,address:S.A.address,countryId:S.A.country,stateId:S.A.state,cityId:S.A.city,pinCode:S.A.pincode,parentId:S.A.organizationId})),defaultValues:{},mode:"all"}),{handleSubmit:L,setValue:D}=N,H=(0,n.wA)();(0,o.useEffect)((()=>{H((0,v.VOH)("ORGANIZATION TYPE")),H((0,v.cTJ)())}),[H]),(0,o.useEffect)((()=>{a&&H((0,v.CYQ)(a))}),[H,a]),(0,o.useEffect)((()=>{C&&H((0,v.$lv)(C))}),[H,C]);const{masterMakerOrgType:M}=(0,s.$)(),B=((e,t)=>{const a=e&&e.filter((e=>e.name===t));return a&&a.length?a[0].id:null})(null===M||void 0===M?void 0:M.masterObject,t.toUpperCase()),U=null===M||void 0===M?void 0:M.masterObject.filter((e=>e.name===t.toUpperCase()));(0,o.useEffect)((()=>{B&&H((0,v.d8s)(B))}),[H,B]);const{countriesDropdown:R}=(0,f.o)(),{statesDropdown:G}=(0,b.Y)(),{citiesDropdown:F}=(0,y.J)(),{organizationsDropdown:$}=(0,d.G)(),_=(null===$||void 0===$?void 0:$.organizationDropdownObject)||[];(0,o.useEffect)((()=>{var e;(E||w)&&(i(T.cities.state.country.id),O(T.cities.state.id),D("countryId",T.cities.state.country.id),D("stateId",T.cities.state.id),e=T,Object.entries(e).forEach((e=>{let[t,a]=e;D(t,a)})))}),[T,w,E,D]),(0,o.useEffect)((()=>{var e;D("organizationTypeId",null===(e=U[0])||void 0===e?void 0:e.id)}),[U,D]);const V=null===R||void 0===R?void 0:R.countriesDropdownObject,Y=null===G||void 0===G?void 0:G.statesDropdownObject,q=null===F||void 0===F?void 0:F.citiesDropdownObject,J=(e,t,a,o,r,n)=>(0,j.jsx)(h.eu,{name:e,label:t,InputLabelProps:{shrink:!0},menus:a,disable:o,...r&&{onChange:r},...n&&{required:!0},...E?{disable:!0}:w?{disable:!1}:{}}),Z=function(e,t,a,o){let r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,j.jsx)(h.o3,{name:e,type:a,label:t,InputLabelProps:{shrink:r},...o&&{required:!0},...E?{disabled:!0}:w?{disabled:!1}:{}})};return(0,j.jsx)(j.Fragment,{children:(0,j.jsx)(h.Op,{methods:N,onSubmit:L((async e=>{let t;if(t=w?await(0,p.default)("/organization-update",{method:"PUT",body:e,params:T.id}):await(0,p.default)("/organization-form",{method:"POST",body:e}),t.success){const e=w?"Organization updated successfully!":"Organization added successfully!";(0,z.A)(e,{variant:"success",autoHideDuration:1e4}),k(),H((0,v.o4$)({transactionTypeId:B})),I()}else{var a,o;(0,z.A)((null===(a=t)||void 0===a||null===(o=a.error)||void 0===o?void 0:o.message)||"Operation failed. Please try again.",{variant:"error"})}})),children:(0,j.jsxs)(x.A,{title:"Add "+P,children:[(0,j.jsxs)(c.Ay,{container:!0,spacing:4,children:[(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:J("organizationTypeId","Type",U,!0,void 0,!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:J("parentId",t,(0,A.HF)(_),void 0,void 0,!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("integrationId","Integration ID","text")}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("name","Name","text",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("code","Code","text",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("email","Email","text",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("mobileNumber","Mobile Number","number",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("telephone","Telephone","number")}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("gstNumber","GSTIN","text",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("address","Address","text",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:J("countryId","Country",V,void 0,(e=>{var t;O(""),i(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}),!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:J("stateId","State",Y,void 0,(e=>{var t;O(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}),!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:J("cityId","City",q,void 0,(()=>{}),!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("pinCode","Pincode","number",!0)}),(0,j.jsx)(c.Ay,{item:!0,md:3,xl:2,children:Z("remarks","Remarks","text",!1)})]}),(0,j.jsx)(c.Ay,{container:!0,spacing:2,alignItems:"center",sx:{mt:2},children:(0,j.jsxs)(c.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,j.jsx)(l.A,{onClick:I,size:"small",variant:"outlined",color:"primary",children:"Back"}),!E&&(0,j.jsx)(l.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:w?"Update":"Save"})]})})]})})})};var O=a(99635),I=a(64499),T=a(89649),E=a(39225),w=a(30423),k=a(65920);const P=()=>{const{paginations:{pageSize:e,pageIndex:t,forceUpdate:a},refreshPagination:c,setPageIndex:l,setPageSize:u}=(0,T.A)(),{searchString:m,setSearchString:g,accessorsRef:f,setAccessors:b,forceSearch:y,searchStringTrimmed:h}=(0,E.A)(),{orgType:x}=(0,r.g)(),[S,P]=(0,o.useState)(!1),[N,L]=(0,o.useState)(!1),[D,H]=(0,o.useState)(!1),[M,B]=(0,o.useState)(!1),[U,R]=(0,o.useState)(null),[G,F]=(0,o.useState)(null),[$,_]=(0,o.useState)(null),[V,Y]=(0,o.useState)(1),[q,J]=(0,o.useState)(null),[Z,Q]=(0,o.useState)(!1),[K,W]=(0,o.useState)(!1),[X,ee]=(0,o.useState)(null),te=(0,n.wA)();(0,o.useEffect)((()=>{te((0,v.VOH)("ORGANIZATION TYPE"))}),[te]);const{masterMakerOrgType:ae}=(0,s.$)(),oe=((e,t)=>{const a=e&&e.filter((e=>e.name===t));return a&&a.length?a[0].id:null})(null===ae||void 0===ae?void 0:ae.masterObject,x.toUpperCase()),{filterObjectForApi:re}=(0,w.bZ)(),ne=(0,k.A)(re),ie=(0,k.A)(X);(0,o.useEffect)((()=>{oe&&([[ne,re],[ie,X]].some(A.$H)?c():te((0,v.o4$)({pageIndex:t,pageSize:e,transactionTypeId:oe,listType:V,...h&&{searchString:h,accessors:JSON.stringify(f.current)},sortBy:(null===X||void 0===X?void 0:X[0])||"updatedAt",sortOrder:(null===X||void 0===X?void 0:X[1])||"DESC",filterObject:re})))}),[te,t,e,oe,V,h,X,f,y,re,ne,ie,c]),(0,o.useEffect)((()=>{null!==U&&void 0!==U&&U.id&&te((0,v.xlX)({pageIndex:t,pageSize:e,listType:V,recordId:null===U||void 0===U?void 0:U.id}))}),[te,t,e,V,U,a]);const{organizationsLocation:se,organizationHistory:de}=(0,d.G)(),{data:ce}=(0,o.useMemo)((()=>{var e;return{data:!se.loading&&(null===(e=se.organizationLocationObject)||void 0===e?void 0:e.rows)||[],isLoading:se.loading||!1}}),[se]),{historyData:le,historyCounts:ue}=(0,o.useMemo)((()=>{var e,t;return{historyData:!de.loading&&(null===(e=de.organizationHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(t=de.organizationHistoryObject)||void 0===t?void 0:t.count)||0,isLoading:de.loading||!1}}),[de]),me=(0,o.useMemo)((()=>[{Header:x,accessor:"parent.name",filterProps:{tableName:"organizations",getColumn:"name",customAccessor:"contractorName"}},{Header:"Name",accessor:"name",filterProps:{tableName:"organizations",getColumn:"name",customAccessor:"name"}},{Header:"Code",accessor:"code",filterProps:{tableName:"organizations",getColumn:"code",customAccessor:"code"}},{Header:"Integration ID",accessor:"integrationId",filterProps:{tableName:"organizations",getColumn:"integration_id",customAccessor:"integrationId"}},{Header:"Email",accessor:"email",filterProps:{tableName:"organizations",getColumn:"email",customAccessor:"email"}},{Header:"Mobile Number",accessor:"mobileNumber",filterProps:{tableName:"organizations",getColumn:"mobile_number",customAccessor:"mobileNumber"}},{Header:"Telephone",accessor:"telephone",filterProps:{tableName:"organizations",getColumn:"telephone",customAccessor:"telephone"}},{Header:"GSTIN",accessor:"gstNumber",filterProps:{tableName:"organizations",getColumn:"gst_number",customAccessor:"getNumber"}},{Header:"Address",accessor:"address",filterProps:{tableName:"organizations",getColumn:"address",customAccessor:"address"}},{Header:"Country",accessor:"cities.state.country.name",filterProps:{tableName:"countries",getColumn:"name",customAccessor:"countryId"}},{Header:"State",accessor:"cities.state.name",filterProps:{tableName:"states",getColumn:"name",customAccessor:"stateId"}},{Header:"City",accessor:"cities.name",filterProps:{tableName:"cities",getColumn:"name",customAccessor:"cityId"}},{Header:"Pincode",accessor:"pinCode",filterProps:{tableName:"organizations",getColumn:"pincode",customAccessor:"pincode"}},{Header:"Status",accessor:"status",exportAccessor:"isActive"},{Header:"Remarks",accessor:"remarks",filterProps:{tableName:"organizations",getColumn:"remarks",customAccessor:"remarks"}},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"updatedBy"}},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"createdBy"}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Created On",accessor:"createdAt"}]),[x]),ge=()=>{Q(!1),Y(1),J(null),W(!1),L(!N)};return(0,o.useEffect)((()=>{Q(!1),Y(1),J(null),W(!1),L(!1)}),[x]),(0,j.jsxs)(j.Fragment,{children:[N?(0,j.jsx)(C,{refreshPagination:c,onClick:ge,title:x+" Branch Office",...q&&{data:q},...Z&&{view:Z,update:!1},...K&&{update:K,view:!1}}):(0,j.jsx)(O.default,{title:x+" Branch Office",data:ce,count:ce.length,setPageIndex:l,setPageSize:u,pageIndex:t,pageSize:e,columns:me,onClick:ge,handleRowView:e=>{L(!0),Q(!0),W(!1),J(e)},handleRowDelete:e=>{F(e),P(!0)},handleRowUpdate:e=>{L(!0),W(!0),Q(!1),J(e)},handleRowRestore:async e=>{_(e),H(!0)},listType:V,setListType:e=>{Y(e)},handleRowHistory:e=>{R(e),B(!0)},searchConfig:{searchString:m,searchStringTrimmed:h,setSearchString:g,setAccessors:b},sortConfig:{sort:X,setSort:ee},cleanupTrigger:x,exportConfig:{tableName:`${x.toLowerCase()}_branch`,apiQuery:{organizationTypeId:oe,listType:V,filterObject:re}}}),(0,j.jsx)(I.A,{open:S,handleClose:()=>P(!1),handleConfirm:async()=>{const e=await(0,p.default)("/delete-organization",{method:"DELETE",params:G});var t;e.success?(c(),P(!1)):(0,z.A)(null===e||void 0===e||null===(t=e.error)||void 0===t?void 0:t.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,j.jsx)(I.A,{open:D,handleClose:()=>H(!1),handleConfirm:async()=>{const e={...$,isActive:"1"};(await(0,p.default)("/organization-update",{method:"PUT",body:e,params:e.id})).success&&(c(),H(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,j.jsx)(i.A,{open:M,onClose:()=>B(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,j.jsx)(O.default,{isHistory:!0,title:null===U||void 0===U?void 0:U.name,data:le,columns:me,count:ue,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:l,setPageSize:u,pageIndex:t,pageSize:e})})]})}},55519:(e,t,a)=>{a.d(t,{G:()=>n});var o=a(9950),r=a(27081);const n=()=>{const[e,t]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[a,n]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[i,s]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[d,c]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[l,u]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[m,g]=(0,o.useState)({organizationLocationObject:{},error:"",loading:!0}),[p,f]=(0,o.useState)({organizationGetListObject:{},error:"",loading:!0}),[b,y]=(0,o.useState)({organizationDropdownObject:[],error:"",loading:!0}),[h,x]=(0,o.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[S,v]=(0,o.useState)({organizationDropdownSecondObject:[],error:"",loading:!0}),[A,z]=(0,o.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[j,C]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[O,I]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[T,E]=(0,o.useState)({organizationHistoryObject:{},error:"",loading:!0}),w=(0,r.d4)((e=>e.organization||[])),k=(0,r.d4)((e=>e.organizationAllData||[])),P=(0,r.d4)((e=>e.organizationAllDataSecond||[])),N=(0,r.d4)((e=>e.organizationLocationByParent||[])),L=(0,r.d4)((e=>e.organizationLocationByParentSecond||[])),D=(0,r.d4)((e=>e.organizationLocation||[])),H=(0,r.d4)((e=>e.organizationListData||[])),M=(0,r.d4)((e=>e.organizationList||[])),B=(0,r.d4)((e=>e.organizationDropdown||[])),U=(0,r.d4)((e=>e.organizationLocationDropdown||[])),R=(0,r.d4)((e=>e.organizationLocationDropdownSecond||[])),G=(0,r.d4)((e=>e.organizationDropdownSecond||[])),F=(0,r.d4)((e=>e.organizationListSecond||[])),$=(0,r.d4)((e=>e.organizationHistory||[]));return(0,o.useEffect)((()=>{t((e=>({...e,...w})))}),[w]),(0,o.useEffect)((()=>{n((e=>({...e,...k})))}),[k]),(0,o.useEffect)((()=>{s((e=>({...e,...P})))}),[P]),(0,o.useEffect)((()=>{c((e=>({...e,...N})))}),[N]),(0,o.useEffect)((()=>{u((e=>({...e,...L})))}),[L]),(0,o.useEffect)((()=>{g((e=>({...e,...D})))}),[D]),(0,o.useEffect)((()=>{f((e=>({...e,...H})))}),[H]),(0,o.useEffect)((()=>{y((e=>({...e,...B})))}),[B]),(0,o.useEffect)((()=>{x((e=>({...e,...U})))}),[U]),(0,o.useEffect)((()=>{z((e=>({...e,...R})))}),[R]),(0,o.useEffect)((()=>{v((e=>({...e,...G})))}),[G]),(0,o.useEffect)((()=>{C((e=>({...e,...M})))}),[M]),(0,o.useEffect)((()=>{I((e=>({...e,...F})))}),[F]),(0,o.useEffect)((()=>{E((e=>({...e,...$})))}),[$]),{organizations:e,organizationsAllData:a,organizationsAllDataSecond:i,organizationsLocByParent:d,organizationsLocByParentSecond:l,organizationsGetListData:p,organizationsDropdown:b,organizationsDropdownSecond:S,organizationsList:j,organizationsListSecond:O,organizationHistory:T,organizationsLocation:m,organizationsLocationDropdown:h,organizationsLocationDropdownSecond:A}}}}]);