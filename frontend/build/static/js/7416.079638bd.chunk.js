"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[7416],{513:(e,a,t)=>{t.d(a,{A:()=>l,y:()=>d});var o=t(9950),r=t(52351),s=t(44414);const n=(0,o.lazy)((()=>t.e(2480).then(t.bind(t,42480)))),i=(0,o.lazy)((()=>Promise.all([t.e(2509),t.e(2564),t.e(6424),t.e(6457),t.e(6643),t.e(839),t.e(5796)]).then(t.bind(t,95796)))),d=(e,a)=>{const t=structuredClone(e);return Object.entries(t).map((e=>{let[o,r]=e;if(!r)return[o,r];o.includes("-paths")&&(t[o]=void 0,t[o.replace("-paths","")]=[...r,...a.filter((e=>e.key===o)).map((e=>({action:e.action,filePath:e.filePath,fileName:e.fileName,fileData:e.fileData})))])})),t},l=e=>{let{view:a,update:t,setValue:d,tasks:l,setTasks:c,data:u,fileFields:m,disabled:g}=e;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(o.Suspense,{fallback:(0,s.jsx)(s.Fragment,{}),children:!(a||t)&&m.map((e=>(0,s.jsx)(n,{disabled:g,multiple:e.multiple,accept:e.accept,label:e.label,name:e.name,setValue:d},e.name)))}),(0,s.jsx)(o.Suspense,{fallback:r.A,children:(a||t)&&(0,s.jsx)(i,{fileFields:m,setValue:d,tasks:l,setTasks:c,data:u,update:t,view:a})})]})}},64499:(e,a,t)=>{t.d(a,{A:()=>f});var o=t(9950),r=t(65669),s=t(43263),n=t(57191),i=t(95537),d=t(67535),l=t(87233),c=t(44414);f.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const u={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},m={display:"flex",flexDirection:"row",padding:"15px 0"},g={display:"flex",justifyContent:"flex-end",gap:2},p={marginTop:2,display:"flex",fontSize:"14px"};function f(e){let{open:a,handleClose:t,title:f,message:h,closeBtnTitle:v,confirmBtnTitle:y,handleConfirm:b,confirmColor:x}=e;const[A,j]=(0,o.useState)(null);return(0,o.useEffect)((()=>{j(null)}),[a]),(0,c.jsx)("div",{children:(0,c.jsx)(r.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:a,closeAfterTransition:!0,slots:{backdrop:s.A},slotProps:{backdrop:{timeout:500}},children:(0,c.jsx)(n.A,{in:a,children:(0,c.jsxs)(i.A,{sx:u,children:[(0,c.jsx)(l.A,{id:"transition-modal-title",variant:"h4",children:f}),(0,c.jsx)(l.A,{id:"transition-modal-title",variant:"h6",sx:m,children:h}),(0,c.jsxs)(i.A,{sx:g,children:[!!t&&(0,c.jsx)(d.A,{onClick:t,size:"small",variant:"outlined",color:"primary",children:v}),!!b&&(0,c.jsx)(d.A,{onClick:b,size:"small",variant:"contained",color:x||"error",children:y})]}),A&&(0,c.jsx)(l.A,{variant:"p",color:"red",sx:p,children:A})]})})})})}},89649:(e,a,t)=>{t.d(a,{A:()=>s});var o=t(9950),r=t(80415);function s(){const[e,a]=(0,o.useState)({pageIndex:r.j7.pageIndex,pageSize:r.j7.pageSize,forceUpdate:!0}),t=(0,o.useCallback)((function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;a((e=>({pageIndex:t,pageSize:o,forceUpdate:!e.forceUpdate})))}),[e]),s=(0,o.useCallback)((()=>{a((e=>({pageIndex:r.j7.pageIndex,pageSize:r.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>a((a=>({...a,pageIndex:e,forceUpdate:!a.forceUpdate}))),setPageSize:e=>a((a=>({pageIndex:r.j7.pageIndex,pageSize:e,forceUpdate:!a.forceUpdate}))),refreshPagination:s,setPaginationsFunctions:t}}},39225:(e,a,t)=>{t.d(a,{A:()=>n});var o=t(41397),r=t.n(o),s=t(9950);const n=e=>{const{isFcMode:a}=e||{},[t,o]=(0,s.useState)(void 0),[n,i]=(0,s.useState)(!1),d=(0,s.useRef)([]),l=(0,s.useCallback)((e=>{const o=d.current;d.current=e,t&&(a||r().isEqual(e,o)||i((e=>!e)))}),[a,t]),c=(0,s.useMemo)((()=>null===t||void 0===t?void 0:t.trim()),[t]);return{searchString:t,searchStringTrimmed:c,forceSearch:n,accessorsRef:d,setSearchString:o,setAccessors:l}}},88848:(e,a,t)=>{t.d(a,{$:()=>s});var o=t(9950),r=t(27081);const s=()=>{const[e,a]=(0,o.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[t,s]=(0,o.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[n,i]=(0,o.useState)({masterObject:[],error:"",loading:!0}),[d,l]=(0,o.useState)({masterObject:[],error:"",loading:!0}),[c,u]=(0,o.useState)({masterObject:[],error:"",loading:!0}),[m,g]=(0,o.useState)({currencyObject:[],error:"",loading:!0}),[p,f]=(0,o.useState)({gstStatusObject:[],error:"",loading:!0}),[h,v]=(0,o.useState)({paymentTermObject:[],error:"",loading:!0}),[y,b]=(0,o.useState)({incotermsObject:[],error:"",loading:!0}),[x,A]=(0,o.useState)({titleObject:[],error:"",loading:!0}),[j,z]=(0,o.useState)({masterMakerLovHistoryObject:{},error:"",loading:!0}),S=(0,r.d4)((e=>e.masterMakerLov||{})),C=(0,r.d4)((e=>e.masterMakerLovList||{})),w=(0,r.d4)((e=>e.lovsForMasterName||[])),O=(0,r.d4)((e=>e.lovsForMasterNameSecond||[])),k=(0,r.d4)((e=>e.lovsForMasterNameThird||[])),I=(0,r.d4)((e=>e.currency||[])),P=(0,r.d4)((e=>e.gstStatus||[])),T=(0,r.d4)((e=>e.paymentTerm||[])),L=(0,r.d4)((e=>e.incoterms||[])),D=(0,r.d4)((e=>e.title||[])),B=(0,r.d4)((e=>e.masterMakerLovHistory||{}));return(0,o.useEffect)((()=>{a((e=>({...e,...S})))}),[S]),(0,o.useEffect)((()=>{s((e=>({...e,...C})))}),[C]),(0,o.useEffect)((()=>{i((e=>({...e,...w})))}),[w]),(0,o.useEffect)((()=>{l((e=>({...e,...O})))}),[O]),(0,o.useEffect)((()=>{u((e=>({...e,...k})))}),[k]),(0,o.useEffect)((()=>{g((e=>({...e,...I})))}),[I]),(0,o.useEffect)((()=>{f((e=>({...e,...P})))}),[P]),(0,o.useEffect)((()=>{v((e=>({...e,...T})))}),[T]),(0,o.useEffect)((()=>{b((e=>({...e,...L})))}),[L]),(0,o.useEffect)((()=>{A((e=>({...e,...D})))}),[D]),(0,o.useEffect)((()=>{z((e=>({...e,...B})))}),[B]),{masterMakerLovs:e,masterMakerLovsList:t,masterMakerOrgType:n,masterMakerOrgTypeSecond:d,masterMakerOrgTypeThird:c,masterMakerCurrency:m,masterMakerGstStatus:p,masterMakerIncoterms:y,masterMakerPaymentTerm:h,masterMakerLovHistory:j,masterMakerTitle:x}}},55519:(e,a,t)=>{t.d(a,{G:()=>s});var o=t(9950),r=t(27081);const s=()=>{const[e,a]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[t,s]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[n,i]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[d,l]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[c,u]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[m,g]=(0,o.useState)({organizationLocationObject:{},error:"",loading:!0}),[p,f]=(0,o.useState)({organizationGetListObject:{},error:"",loading:!0}),[h,v]=(0,o.useState)({organizationDropdownObject:[],error:"",loading:!0}),[y,b]=(0,o.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[x,A]=(0,o.useState)({organizationDropdownSecondObject:[],error:"",loading:!0}),[j,z]=(0,o.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[S,C]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[w,O]=(0,o.useState)({organizationObject:{},error:"",loading:!0}),[k,I]=(0,o.useState)({organizationHistoryObject:{},error:"",loading:!0}),P=(0,r.d4)((e=>e.organization||[])),T=(0,r.d4)((e=>e.organizationAllData||[])),L=(0,r.d4)((e=>e.organizationAllDataSecond||[])),D=(0,r.d4)((e=>e.organizationLocationByParent||[])),B=(0,r.d4)((e=>e.organizationLocationByParentSecond||[])),N=(0,r.d4)((e=>e.organizationLocation||[])),E=(0,r.d4)((e=>e.organizationListData||[])),H=(0,r.d4)((e=>e.organizationList||[])),U=(0,r.d4)((e=>e.organizationDropdown||[])),M=(0,r.d4)((e=>e.organizationLocationDropdown||[])),V=(0,r.d4)((e=>e.organizationLocationDropdownSecond||[])),_=(0,r.d4)((e=>e.organizationDropdownSecond||[])),F=(0,r.d4)((e=>e.organizationListSecond||[])),R=(0,r.d4)((e=>e.organizationHistory||[]));return(0,o.useEffect)((()=>{a((e=>({...e,...P})))}),[P]),(0,o.useEffect)((()=>{s((e=>({...e,...T})))}),[T]),(0,o.useEffect)((()=>{i((e=>({...e,...L})))}),[L]),(0,o.useEffect)((()=>{l((e=>({...e,...D})))}),[D]),(0,o.useEffect)((()=>{u((e=>({...e,...B})))}),[B]),(0,o.useEffect)((()=>{g((e=>({...e,...N})))}),[N]),(0,o.useEffect)((()=>{f((e=>({...e,...E})))}),[E]),(0,o.useEffect)((()=>{v((e=>({...e,...U})))}),[U]),(0,o.useEffect)((()=>{b((e=>({...e,...M})))}),[M]),(0,o.useEffect)((()=>{z((e=>({...e,...V})))}),[V]),(0,o.useEffect)((()=>{A((e=>({...e,..._})))}),[_]),(0,o.useEffect)((()=>{C((e=>({...e,...H})))}),[H]),(0,o.useEffect)((()=>{O((e=>({...e,...F})))}),[F]),(0,o.useEffect)((()=>{I((e=>({...e,...R})))}),[R]),{organizations:e,organizationsAllData:t,organizationsAllDataSecond:n,organizationsLocByParent:d,organizationsLocByParentSecond:c,organizationsGetListData:p,organizationsDropdown:h,organizationsDropdownSecond:x,organizationsList:S,organizationsListSecond:w,organizationHistory:k,organizationsLocation:m,organizationsLocationDropdown:y,organizationsLocationDropdownSecond:j}}},57416:(e,a,t)=>{t.r(a),t.d(a,{default:()=>$});var o=t(9950),r=t(27081),s=t(96583),n=t(12257),i=t(4139),d=t(67535),l=t(60666),c=t(9449),u=t(26473),m=t(99144),g=t(28073),p=t(32112),f=t(88848),h=t(55519),v=t(46483),y=t(57073),b=t(12678),x=t(4729),A=t(14351),j=t(96951),z=t(84601),S=t(62054),C=t(71826),w=t(52867),O=t(44414);const k=e=>{let{onClose:a,userId:t}=e;const[r,s]=(0,o.useState)([!1,!1]),[m,g]=(0,o.useState)(!1),p=(0,c.mN)({resolver:(0,u.t)(l.Ik().shape({password:z.A.required,confirmPassword:z.A.required})),defaultValues:{},mode:"all"}),{handleSubmit:f}=p,h=e=>{const a=[...r];a[e]=!a[e],s(a)},k=e=>{e.preventDefault()};return(0,O.jsx)(j.Op,{methods:p,onSubmit:f((async e=>{const{password:o,confirmPassword:r}=e;if(o!==r)return void(0,S.A)("Password mismatch",{variant:"error"});g(!0);const s=await(0,C.default)("/update-password-admin",{method:"PUT",body:{newPassword:(0,w.QL)(r),userId:t}});var n,i,d;s.success?((0,S.A)((null===s||void 0===s||null===(n=s.data)||void 0===n||null===(i=n.data)||void 0===i?void 0:i.message)||"Successfully updated password",{variant:"success",autoHideDuration:1e4}),a()):(0,S.A)((null===s||void 0===s||null===(d=s.error)||void 0===d?void 0:d.message)||"Operation failed. Please try again.",{variant:"error"});g(!1)})),children:(0,O.jsx)(A.A,{title:"Change Password",children:(0,O.jsxs)(i.Ay,{container:!0,spacing:1,children:[(0,O.jsx)(i.Ay,{item:!0,xs:12,children:(0,O.jsx)(n.A,{spacing:3,children:(0,O.jsx)(j.o3,{name:"password",type:r[0]?"text":"password",label:"Password",required:!0,InputProps:{endAdornment:(0,O.jsx)(v.A,{position:"end",children:(0,O.jsx)(y.A,{"aria-label":"toggle password visibility",onClick:()=>h(0),onMouseDown:k,edge:"end",color:"secondary",children:r[0]?(0,O.jsx)(b.A,{}):(0,O.jsx)(x.A,{})})})}})})}),(0,O.jsx)(i.Ay,{item:!0,xs:12,children:(0,O.jsx)(n.A,{spacing:3,children:(0,O.jsx)(j.o3,{name:"confirmPassword",type:r[1]?"text":"password",label:"Confirm Password",required:!0,InputProps:{endAdornment:(0,O.jsx)(v.A,{position:"end",children:(0,O.jsx)(y.A,{"aria-label":"toggle password visibility",onClick:()=>h(1),onMouseDown:k,edge:"end",color:"secondary",children:r[1]?(0,O.jsx)(b.A,{}):(0,O.jsx)(x.A,{})})})}})})}),(0,O.jsx)(i.Ay,{item:!0,xs:12,children:(0,O.jsxs)(n.A,{spacing:1,sx:{mt:2},direction:"row",alignItems:"center",justifyContent:"flex-end",children:[(0,O.jsx)(d.A,{disabled:m,size:"small",variant:"outlined",onClick:a,children:"Cancel"}),(0,O.jsx)(d.A,{disabled:m,size:"small",variant:"contained",type:"submit",children:"Save"})]})})]})})})};var I=t(29024),P=t(513),T=t(94826),L=t(33507);const D=[{value:!0,name:"Yes"},{value:!1,name:"No"}],B=[{name:"attachments",label:"Attachments",accept:"*",required:!1,multiple:!0}],N=B.some((e=>"attachments"===e.name&&!0===e.required)),E=6e5,H=e=>{var a,t,v,y;const b=(0,r.wA)(),[x,H]=(0,o.useState)(""),[U,M]=(0,o.useState)(""),[V,_]=(0,o.useState)(""),[F,R]=(0,o.useState)([]),[q,$]=(0,o.useState)(!1),[W,G]=(0,o.useState)(!1),{onClick:Y,data:Q,view:J,update:Z,refreshPagination:K}=e,X=(0,c.mN)({resolver:(0,u.t)(l.Ik().shape({name:z.A.other,code:z.A.code,mobileNumber:z.A.mobileNumber,address:z.A.other,pinCode:z.A.pincode,countryId:z.A.other,stateId:z.A.other,cityId:z.A.other,oraganizationType:z.A.other,oraganizationId:z.A.other,authorizedUser:z.A.requiredWithLabel("Is Authorized"),...!Z&&N&&{attachments:z.A.attachmentsWhenIsAuthorized}})),defaultValues:{},mode:"all"}),[ee,ae]=(0,o.useState)(!1);(0,o.useEffect)((()=>{(async()=>{const e=await(0,C.default)("/get-user-details");var a,t;null!==e&&void 0!==e&&e.success&&("577b8900-b333-42d0-b7fb-347abc3f0b5c"===(null===e||void 0===e||null===(a=e.data)||void 0===a||null===(t=a.data)||void 0===t?void 0:t.id)&&ae(!0))})()}),[ae]);const{handleSubmit:te,setValue:oe,watch:re}=X,{user:se}=(0,L.A)(),ne="SuperUser"===(null===se||void 0===se||null===(a=se.role)||void 0===a?void 0:a.name),ie="420e7b13-25fd-4d23-9959-af1c07c7e94b"===(null===se||void 0===se?void 0:se.oraganizationType),de=re("authorizedUser");(0,o.useEffect)((()=>{oe("authorizedUser",!1),b((0,I.cTJ)()),b((0,I.VOH)("ORGANIZATION TYPE"))}),[b,oe]);const{masterMakerOrgType:le}=(0,f.$)(),ce=null===le||void 0===le?void 0:le.masterObject;(0,o.useEffect)((()=>{x&&b((0,I.d8s)(`${x}?hasAccess=${ie}`))}),[b,x,ie]);const{organizationsDropdown:ue,organizationsLocByParent:me}=(0,h.G)(),ge=null===ue||void 0===ue?void 0:ue.organizationDropdownObject,{countriesDropdown:pe}=(0,m.o)(),{statesDropdown:fe}=(0,g.Y)(),{citiesDropdown:he}=(0,p.J)();(0,o.useEffect)((()=>{var e,a,t,o;(J||Z)&&(b((0,I.VRs)({params:Q.oraganizationType+"/"+Q.oraganizationId,hasAccess:ie})),b((0,I.CYQ)(Q.city.state.country.id)),b((0,I.$lv)(Q.city.state.id)),oe("countryId",Q.city.state.country.id),oe("stateId",Q.city.state.id),oe("oraganizationId",Q.master_maker_lov.id),H(Q.master_maker_lov.id),o=(0,w.x5)(Q,B),Object.entries(o).forEach((e=>{let[a,t]=e;oe(a,t)})),oe("oraganizationTypeValue",null===(e=Q.master_maker_lov)||void 0===e?void 0:e.name),oe("oraganizationIdValue",null===(a=Q.organization)||void 0===a?void 0:a.name),oe("organisationBranchValue",null===(t=Q.organisationBranch)||void 0===t?void 0:t.name))}),[Q,Z,J,oe,b,ie]),(0,o.useEffect)((()=>{U&&(oe("stateId",""),oe("cityId",""))}),[U,oe]),(0,o.useEffect)((()=>{V&&oe("cityId","")}),[V,oe]),(0,o.useEffect)((()=>{oe("dateOfOnboarding",(new Date).toISOString().slice(0,10))}),[oe]);const ve=pe.countriesDropdownObject,ye=null===fe||void 0===fe?void 0:fe.statesDropdownObject,be=null===he||void 0===he?void 0:he.citiesDropdownObject,xe=function(e,a,t,o,r){let s=arguments.length>5&&void 0!==arguments[5]&&arguments[5];return(0,O.jsx)(n.A,{children:(0,O.jsx)(j.eu,{name:e,onChange:r,label:a,InputLabelProps:{shrink:!0},menus:t,...s&&{allowClear:!0},...o&&{required:!0},...J?{disable:!0}:Z?{disable:!1}:{}})})},Ae=function(e,a,t,o){let r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,O.jsx)(n.A,{spacing:1,children:(0,O.jsx)(j.o3,{name:e,type:t,label:a,InputLabelProps:{shrink:r},...o&&{required:!0},...J?{disabled:!0}:Z?{disabled:["oraganizationTypeValue","oraganizationIdValue","organisationBranchValue"].includes(e)}:{}})})},{organizationBranchData:je}=(0,o.useMemo)((()=>{var e;return{organizationBranchData:(null===me||void 0===me||null===(e=me.organizationObject)||void 0===e?void 0:e.rows)||[],isLoading:me.loading||!1}}),[me]);return(0,O.jsxs)(O.Fragment,{children:[W&&(0,O.jsx)(T.A,{}),(0,O.jsx)(j.Op,{methods:X,onSubmit:te((async e=>{G(!0),""===(null===e||void 0===e?void 0:e.organisationBranchId)&&(e.organisationBranchId=null);const a=(0,P.y)(e,F);if(a.authorizedUser="true"===a.authorizedUser,Z&&a.authorizedUser&&N&&(!a.attachments||Array.isArray(a.attachments)&&0===a.attachments.length))return(0,S.A)("Please select attachments for an authorized user",{variant:"error"}),void G(!1);if(!a.authorizedUser){const e=(a.attachments||[]).filter((e=>"string"===typeof e));a.attachments=e.map((e=>({action:"delete",filePath:e})))}let t;if(a.status=Z?"5ba80e90-6e3d-4a22-873f-9a10908d5a06":"de6ae8b5-909a-4ea4-a518-bfad9bdbdd3d",t=Z?await(0,C.default)("/user-update",{method:"PUT",timeoutOverride:E,body:a,params:Q.id}):await(0,C.default)("/user-form",{method:"POST",timeoutOverride:E,body:a}),t.success){const e=Z?"User updated successfully!":"User added successfully!";(0,S.A)(e,{variant:"success",autoHideDuration:1e4}),Y(),K()}else{var o,r;(0,S.A)((null===(o=t)||void 0===o||null===(r=o.error)||void 0===r?void 0:r.message)||"Operation failed. Please try again.",{variant:"error"})}G(!1)})),children:(0,O.jsxs)(A.A,{title:(J?"View ":Z?"Update ":"Add ")+"User",children:[(0,O.jsxs)(i.Ay,{container:!0,spacing:4,children:[(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,sx:{display:!J&&!Z||ne?"block":"none"},children:xe("oraganizationType","Organization Type",ne||ie?ce:[{id:se.master_maker_lov.id,name:se.master_maker_lov.name}],!0,(e=>{var a;H(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value),X.setValue("oraganizationId",""),X.setValue("organisationBranchId","")}))}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,sx:{display:!J&&!Z||ne?"block":"none"},children:xe("oraganizationId","Organization Name",ne||ie?(0,w.HF)(ge):[{id:se.organization.id,name:se.organization.name+" - "+se.organization.code}],!0,(e=>{var a,t;null!==e&&void 0!==e&&null!==(a=e.target)&&void 0!==a&&a.value&&b((0,I.VRs)({params:x+"/"+(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value),hasAccess:ie}))}))}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,sx:{display:!J&&!Z||ne?"block":"none"},children:xe("organisationBranchId","Organization Branch",ne||ie?(0,w.HF)(je):se.organisationBranch?[{id:null===(t=se.organisationBranch)||void 0===t?void 0:t.id,name:(null===(v=se.organisationBranch)||void 0===v?void 0:v.name)+" - "+(null===(y=se.organisationBranch)||void 0===y?void 0:y.code)}]:[],!1,void 0,!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,sx:{display:!J&&!Z||ne?"none":"block"},children:Ae("oraganizationTypeValue","Organization Type","text",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,sx:{display:!J&&!Z||ne?"none":"block"},children:Ae("oraganizationIdValue","Organization Name","text",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,sx:{display:!J&&!Z||ne?"none":"block"},children:Ae("organisationBranchValue","Organization Branch","text",!1)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("name","Name","text",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("code","Code","text",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:(0,O.jsx)(n.A,{spacing:1,children:(0,O.jsx)(j.o3,{allSmall:!0,name:"email",label:"Email",disabled:!!J})})}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("mobileNumber","Mobile Number","number",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("aadharNo","Aadhar Number","number",!1)}),ee&&Z&&(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("deviceId","Device-Id","text",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("address","Address","text",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:xe("countryId","Country",ve,!0,(e=>{var a,t;b((0,I.CYQ)(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)),M(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}))}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:xe("stateId","State",ye,!0,(e=>{var a,t;b((0,I.$lv)(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)),_(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)}))}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:xe("cityId","City",be,!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("pinCode","Pincode","number",!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:2,children:Ae("dateOfOnboarding","Date of Onboarding","date",!1,!0)}),(0,O.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(ze="authorizedUser",Se=D,Ce="Is Authorized",we=()=>{},Oe=!0,(0,O.jsx)(j.gk,{name:ze,labels:Se,title:Ce,mini:!0,onChange:we,...Oe&&{required:!0},...J?{disabled:!0}:Z?{disabled:!1}:{}}))})]}),(0,O.jsxs)(i.Ay,{container:!0,spacing:2,alignItems:"center",sx:{mt:2},children:[(0,O.jsx)(i.Ay,{item:!0,xs:6,sx:{display:"flex",justifyContent:"flex-start",gap:"20px"},children:("true"===de||!0===de)&&(0,O.jsx)(P.A,{fileFields:B,data:Q,view:J,update:Z,tasks:F,setTasks:R,setValue:oe})}),(0,O.jsxs)(i.Ay,{item:!0,xs:6,sx:{display:"flex",justifyContent:"flex-end",gap:"20px"},children:[(0,O.jsx)(d.A,{onClick:Y,size:"small",variant:"outlined",color:"primary",children:"Back"}),Z&&"a89c1591-ed87-40e5-b89b-e409d647e3e5"===(null===se||void 0===se?void 0:se.roleId)&&(0,O.jsx)(d.A,{size:"small",onClick:()=>{$(!0)},variant:"outlined",color:"primary",children:"Change Password"}),!J&&(0,O.jsx)(d.A,{disabled:W,size:"small",type:"submit",variant:"contained",color:"primary",children:Z?"Update":"Save"})]})]})]})}),(0,O.jsx)(s.A,{open:q,onClose:()=>{$(!1)},PaperProps:{sx:{width:"25rem"}},maxWidth:"xl",scroll:"body",children:(0,O.jsx)(k,{userId:null===Q||void 0===Q?void 0:Q.id,onClose:()=>{$(!1)}})})]});var ze,Se,Ce,we,Oe};var U=t(66004),M=t(30423),V=t(99635),_=t(64499),F=t(89649),R=t(39225),q=t(65920);const $=()=>{var e;const{paginations:{pageSize:a,pageIndex:t,forceUpdate:n},refreshPagination:i,setPageIndex:d,setPageSize:l}=(0,F.A)(),{searchString:c,forceSearch:u,accessorsRef:m,setAccessors:g,setSearchString:p,searchStringTrimmed:f}=(0,R.A)(),[h,v]=(0,o.useState)(!1),[y,b]=(0,o.useState)(!1),[x,A]=(0,o.useState)(!1),[j,z]=(0,o.useState)(!1),[k,P]=(0,o.useState)(!1),[T,D]=(0,o.useState)(null),[B,N]=(0,o.useState)(null),[E,$]=(0,o.useState)(null),[W,G]=(0,o.useState)(null),[Y,Q]=(0,o.useState)(1),[J,Z]=(0,o.useState)(1),[K,X]=(0,o.useState)(null),[ee,ae]=(0,o.useState)(!1),[te,oe]=(0,o.useState)(!1),[re,se]=(0,o.useState)(null),ne=(0,r.wA)(),{filterObjectForApi:ie}=(0,M.bZ)(),de=(0,q.A)(ie),le=(0,q.A)(re),{user:ce}=(0,L.A)(),ue="SuperUser"===(null===ce||void 0===ce||null===(e=ce.role)||void 0===e?void 0:e.name),me="420e7b13-25fd-4d23-9959-af1c07c7e94b"===(null===ce||void 0===ce?void 0:ce.oraganizationType);(0,o.useEffect)((()=>{[[de,ie],[le,re]].some(w.$H)?i():ne((0,I.loF)({pageIndex:t,pageSize:a,listType:Y,lockType:J,...f&&{searchString:f,accessors:JSON.stringify(m.current)},sortBy:null===re||void 0===re?void 0:re[0],sortOrder:null===re||void 0===re?void 0:re[1],filterObject:ie,hasAccess:me}))}),[m,ne,Y,J,t,a,f,re,n,u,i,de,ie,le,me]),(0,o.useEffect)((()=>{null!==T&&void 0!==T&&T.id&&ne((0,I.Rdr)({pageIndex:t,pageSize:a,listType:Y,recordId:null===T||void 0===T?void 0:T.id}))}),[ne,t,a,n,Y,T]);const{users:ge,usersHistory:pe}=(0,U.k)(),{data:fe,count:he}=(0,o.useMemo)((()=>{var e,a;return{data:(null===(e=ge.usersObject)||void 0===e?void 0:e.rows)||[],count:(null===(a=ge.usersObject)||void 0===a?void 0:a.count)||0,isLoading:ge.loading||!1}}),[ge]),{historyData:ve,historyCounts:ye}=(0,o.useMemo)((()=>{var e,a;return{historyData:(null===(e=pe.usersHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(a=pe.usersHistoryObject)||void 0===a?void 0:a.count)||0,isLoading:pe.loading||!1}}),[pe]),be=(0,o.useMemo)((()=>[{Header:"Organization Type",accessor:"master_maker_lov.name",filterProps:{tableName:"organizationType",getColumn:"name",customAccessor:"oraganizationTypeId"}},{Header:"Organization Name",accessor:"organization.nameAndCode",exportAccessor:"organization.name",filterProps:{tableName:"organizations",getColumn:"name",customAccessor:"oraganizationId"}},{Header:"Organization Branch",accessor:"organisationBranch.nameAndCode",exportAccessor:"organisationBranch.name",filterProps:{tableName:"organizations",getColumn:"name",customAccessor:"organizationId"}},{Header:"Name",accessor:"name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"name"}},{Header:"WFM Code",accessor:"wfmCode",filterProps:{tableName:"users",getColumn:"wfm_code",customAccessor:"wfmCode"}},{Header:"Code",accessor:"code",filterProps:{tableName:"users",getColumn:"code",customAccessor:"code"}},{Header:"Email",accessor:"email",filterProps:{tableName:"users",getColumn:"email",customAccessor:"email"}},{Header:"Mobile Number",accessor:"mobileNumber",filterProps:{tableName:"users",getColumn:"mobile_number",customAccessor:"mobileNumber"}},{Header:"Address",accessor:"address",filterProps:{tableName:"users",getColumn:"address",customAccessor:"address"}},{Header:"Country",accessor:"city.state.country.name",filterProps:{tableName:"countries",getColumn:"name",customAccessor:"countryId"}},{Header:"State",accessor:"city.state.name",filterProps:{tableName:"states",getColumn:"name",customAccessor:"stateId"}},{Header:"City",accessor:"city.name",filterProps:{tableName:"cities",getColumn:"name",customAccessor:"cityId"}},{Header:"Date Of On Boarding",accessor:"dateOfOnboarding"},{Header:"Status",accessor:"user_status.name",filterProps:{tableName:"users",getColumn:"status",customAccessor:"status"}},{Header:"Pincode",accessor:"pinCode",filterProps:{tableName:"users",getColumn:"pin_code",customAccessor:"pinCode"}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Created On",accessor:"createdAt"},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"users",getColumn:"updated_by",customAccessor:"updatedBy"}},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"users",getColumn:"created_by",customAccessor:"createdBy"}},{Header:"Last Login",accessor:"lastLogin"},{Header:"Source",accessor:"source",filterProps:{tableName:"users",getColumn:"source",customAccessor:"source"}},{Header:"App Version",accessor:"appVersion",filterProps:{tableName:"users",getColumn:"app_version",customAccessor:"appVersion"}},{Header:"User ID",accessor:"id"},{Header:"Organization Type ID",accessor:"oraganizationType"},{Header:"Organization ID",accessor:"oraganizationId"}]),[]),xe=()=>{Q(1),ae(!1),oe(!1),X(null),A(!x)},Ae=e=>{let a=[];return e&&e.length>0&&e.map((e=>{var t,o;let r=structuredClone(e);var s,n;(r.organization={...r.organization,nameAndCode:(null===(t=r.organization)||void 0===t?void 0:t.name)+" - "+(null===(o=r.organization)||void 0===o?void 0:o.code)},r.organisationBranchId&&null!==r.organisationBranchId)&&(r.organisationBranch={...r.organisationBranch,nameAndCode:(null===(s=r.organisationBranch)||void 0===s?void 0:s.name)+" - "+(null===(n=r.organisationBranch)||void 0===n?void 0:n.code)});a.push(r)})),a};return(0,O.jsxs)(O.Fragment,{children:[x?(0,O.jsx)(H,{refreshPagination:i,onClick:xe,...K&&{data:K},...ee&&{view:ee,update:!1},...te&&{update:te,view:!1}}):(0,O.jsx)(V.default,{title:"User Creation",data:Ae(fe),columns:be,count:he,hideType:!0,hideImportButton:!0,setPageIndex:d,setPageSize:l,pageIndex:t,pageSize:a,onClick:xe,handleRowRestore:async e=>{G(e),z(!0)},handleRowDelete:e=>{N(e),v(!0)},handleRowUpdate:e=>{A(!0),oe(!0),ae(!1),X(e)},handleRowHistory:e=>{D(e),P(!0)},handleRowView:e=>{A(!0),ae(!0),oe(!1),X(e)},handleLockToggle:e=>{$(e),b(!0)},showLockIcon:!0,listType:Y,setListType:e=>{Q(e)},lockType:J,setLockType:e=>{Z(e)},searchConfig:{searchString:c,searchStringTrimmed:f,setSearchString:p,setAccessors:g},sortConfig:{sort:re,setSort:se},hideDeleteIcon:!0,hideEditIcon:!ue,hideRestoreIcon:!0,exportConfig:{tableName:"users",apiQuery:{listType:Y,filterObject:ie}}}),(0,O.jsx)(_.A,{open:h,handleClose:()=>v(!1),handleConfirm:async()=>{const e=await(0,C.default)("/delete-user",{method:"DELETE",params:`${B}/c15f716f-5fc7-422c-8ac2-74c688dce2d1`});var a;e.success?(i(),v(!1)):(0,S.A)(null===e||void 0===e||null===(a=e.error)||void 0===a?void 0:a.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,O.jsx)(_.A,{open:j,handleClose:()=>z(!1),handleConfirm:async()=>{const{name:e,mobileNumber:a,address:t,pinCode:o,email:r}=W,s=await(0,C.default)("/user-update",{method:"PUT",body:{name:e,mobileNumber:a,address:t,email:r,pinCode:o,isActive:"1",status:"8e92b381-56ab-4191-af00-12f3c59c09bf"},params:W.id});var n;s.success?(i(),z(!1)):(0,S.A)((null===s||void 0===s||null===(n=s.error)||void 0===n?void 0:n.message)||"Operation failed. Please try again.",{variant:"error"})},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,O.jsx)(_.A,{open:y,handleClose:()=>b(!1),handleConfirm:async()=>{const{name:e,mobileNumber:a,address:t,pinCode:o,email:r}=E,s=await(0,C.default)("/user-update",{method:"PUT",body:{name:e,mobileNumber:a,email:r,address:t,pinCode:o,isLocked:!E.isLocked},params:E.id});var n;s.success?(i(),b(!1)):(0,S.A)((null===s||void 0===s||null===(n=s.error)||void 0===n?void 0:n.message)||"Operation failed. Please try again.",{variant:"error"})},title:"Confirm "+(null!==E&&void 0!==E&&E.isLocked?"Unlock":"Lock"),message:`Are you sure you want to ${null!==E&&void 0!==E&&E.isLocked?"unlock":"lock"} user?`,confirmBtnTitle:"Confirm"}),(0,O.jsx)(s.A,{open:k,onClose:()=>P(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,O.jsx)(V.default,{isHistory:!0,title:null===T||void 0===T?void 0:T.name,data:Ae(ve),columns:be,count:ye,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:d,setPageSize:l,pageIndex:t,pageSize:a})})]})}},66004:(e,a,t)=>{t.d(a,{k:()=>r});var o=t(27081);const r=()=>({users:(0,o.d4)((e=>e.users)),usersByPermission:(0,o.d4)((e=>e.usersByPermission)),usersWithForms:(0,o.d4)((e=>e.usersWithForms)),usersSecond:(0,o.d4)((e=>e.usersSecond)),usersHistory:(0,o.d4)((e=>e.usersHistory)),supervisorUsers:(0,o.d4)((e=>e.supervisorUsers))})}}]);