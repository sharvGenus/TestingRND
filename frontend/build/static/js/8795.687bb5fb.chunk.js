"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[8795,5406],{513:(e,r,t)=>{t.d(r,{A:()=>l,y:()=>d});var a=t(9950),i=t(52351),o=t(44414);const n=(0,a.lazy)((()=>t.e(2480).then(t.bind(t,42480)))),s=(0,a.lazy)((()=>Promise.all([t.e(2509),t.e(2564),t.e(6424),t.e(6457),t.e(6643),t.e(839),t.e(5796)]).then(t.bind(t,95796)))),d=(e,r)=>{const t=structuredClone(e);return Object.entries(t).map((e=>{let[a,i]=e;if(!i)return[a,i];a.includes("-paths")&&(t[a]=void 0,t[a.replace("-paths","")]=[...i,...r.filter((e=>e.key===a)).map((e=>({action:e.action,filePath:e.filePath,fileName:e.fileName,fileData:e.fileData})))])})),t},l=e=>{let{view:r,update:t,setValue:d,tasks:l,setTasks:u,data:c,fileFields:m,disabled:g}=e;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.Suspense,{fallback:(0,o.jsx)(o.Fragment,{}),children:!(r||t)&&m.map((e=>(0,o.jsx)(n,{disabled:g,multiple:e.multiple,accept:e.accept,label:e.label,name:e.name,setValue:d},e.name)))}),(0,o.jsx)(a.Suspense,{fallback:i.A,children:(r||t)&&(0,o.jsx)(s,{fileFields:m,setValue:d,tasks:l,setTasks:u,data:c,update:t,view:r})})]})}},64499:(e,r,t)=>{t.d(r,{A:()=>q});var a=t(9950),i=t(65669),o=t(43263),n=t(57191),s=t(95537),d=t(67535),l=t(87233),u=t(44414);q.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const c={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},m={display:"flex",flexDirection:"row",padding:"15px 0"},g={display:"flex",justifyContent:"flex-end",gap:2},p={marginTop:2,display:"flex",fontSize:"14px"};function q(e){let{open:r,handleClose:t,title:q,message:j,closeBtnTitle:f,confirmBtnTitle:b,handleConfirm:h,confirmColor:S}=e;const[v,y]=(0,a.useState)(null);return(0,a.useEffect)((()=>{y(null)}),[r]),(0,u.jsx)("div",{children:(0,u.jsx)(i.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:r,closeAfterTransition:!0,slots:{backdrop:o.A},slotProps:{backdrop:{timeout:500}},children:(0,u.jsx)(n.A,{in:r,children:(0,u.jsxs)(s.A,{sx:c,children:[(0,u.jsx)(l.A,{id:"transition-modal-title",variant:"h4",children:q}),(0,u.jsx)(l.A,{id:"transition-modal-title",variant:"h6",sx:m,children:j}),(0,u.jsxs)(s.A,{sx:g,children:[!!t&&(0,u.jsx)(d.A,{onClick:t,size:"small",variant:"outlined",color:"primary",children:f}),!!h&&(0,u.jsx)(d.A,{onClick:h,size:"small",variant:"contained",color:S||"error",children:b})]}),v&&(0,u.jsx)(l.A,{variant:"p",color:"red",sx:p,children:v})]})})})})}},84601:(e,r,t)=>{t.d(r,{A:()=>l});var a=t(60666);const i=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],o=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],n=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},s=["nothing","",()=>!0],d=function(e,r,t){let a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const i=new Date(e),o=new Date(r),n=new Date(t);return a?n<=i&&i<=o:n<=i&&i>=o},l={allowedColumns:a.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:a.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:a.Yj().required("Required").nullable(),formType:a.Yj().required("Required").nullable(),taskType:a.Yj().required("Required").nullable(),code:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:a.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:a.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:a.Yj().required("Required"),title:a.Yj().required("Required").nullable(),office:a.Yj().required("Required").nullable(),masterCode:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:a.Yj().required("Required"),gstNumber:a.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:a.Yj().required("Required"),storePhoto:a.Yj().required("Required"),email:a.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:a.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:a.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:a.Yj().required("Required"),nother:a.Yj().nullable().required("Required"),otherArray:a.YO().min(1,"Please select atleast one field"),areaLevel:a.YO().min(1,"Please select atleast one level."),formTitle:a.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:a.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:a.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:a.Yj().required(" "),telephone:a.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:a.Yj().required("Required"),registeredAddress:a.Yj().required("Required"),quantity:a.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:a.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:a.ai().test(...n()).test(...i).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.ai().test(...r?n():s).test(...i).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:a.Yj().required("Required"),state:a.Yj().required("Required"),city:a.Yj().required("Required"),registeredCountry:a.Yj().required("Required"),registeredState:a.Yj().required("Required"),registeredCity:a.Yj().required("Required"),organizationType:a.Yj().nullable().required("Required"),organizationCode:a.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:a.Yj().nullable().required("Required"),organizationLocationId:a.Yj().required("Required"),integrationId:a.Yj().required("Required"),firm:a.Yj().required("Required"),movementType:a.Yj().required("Required"),supplier:a.Yj().required("Required"),masterMaker:a.Yj().required("Required"),projectMasterMaker:a.Yj().required("Required"),lov:a.Yj().required("Required"),date:a.Yj().required("Required"),fromDate:a.Yj().required("Required"),toDate:a.Yj().when("fromDate",{is:e=>!!e,then:a.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:a.Yj().required("Required"),challanNumber:a.Yj().required("Required"),poNumber:a.Yj().required("Required"),workOrderNumber:a.Yj().required("Required"),receivingStore:a.Yj().required("Required"),uom:a.Yj().required("Required"),project:a.Yj().nullable().required("Required"),projectArr:a.YO().of(a.gl()).nullable().required("Required").min(1,"Required"),organizationArr:a.YO().of(a.gl()).nullable().required("Required").min(1,"Required"),accessProject:a.Yj().nullable().required("Required"),rate:a.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:a.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:a.Yj().required("Required"),rangeTo:a.Yj().required("Required"),requiredWithLabel:()=>a.Yj().nullable().required("Required"),requiredWithNonZero:e=>a.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>a.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:a.ai().required("Required"),isSerialize:a.Yj().required("Please select a checkbox"),vehicleNumber:a.Yj().required("Required"),vehicleNumberOptional:a.Yj().nullable(),inventoryNameOptional:a.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:a.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:a.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:a.Yj().required("Required"),eWayBillNumber:a.Yj().required("Required"),eWayBillDate:a.Yj().required("Required"),actualReceiptDate:a.Yj().when("eWayBillDate",{is:e=>!!e,then:a.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:a.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:a.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:a.Yj().nullable().required("Required"),placeOfTransfer:a.Yj().required("Required"),contractorStore:a.Yj().nullable().required("Required"),projectSiteStoreLocation:a.Yj().required("Required"),contractorStoreLocation:a.Yj().nullable().required("Required"),contractorEmployee:a.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>a.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:a.Yj().required("Required"),longDescription:a.Yj().required("Required"),hsnCode:a.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:a.Yj().required("Required"),store:a.Yj().nullable().required("Required"),accessStore:a.Yj().nullable().required("Required"),series:a.Yj().required("Required"),material:a.Yj().required("Required"),materialType:a.Yj().required("Required"),materialCode:a.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:a.Yj().nullable().required("Required"),accessOrganizationId:a.Yj().nullable().required("Required"),company:a.Yj().required("Required"),contractor:a.Yj().nullable().required("Required"),contractorId:a.Yj().required("Required"),fromInstaller:a.Yj().nullable().required("Required"),toInstaller:a.Yj().nullable().required("Required"),fromStoreLocationId:a.Yj().nullable().required("Required"),toStoreLocationId:a.Yj().nullable().required("Required"),storeLocationId:a.Yj().nullable().required("Required"),installerStoreLocationId:a.Yj().nullable().required("Required"),accessStoreLocationId:a.Yj().nullable().required("Required"),fromStore:a.Yj().nullable().required("Required"),toStore:a.Yj().required("Required"),transporterName:a.Yj().required("Required"),customerSiteStoreId:a.Yj().nullable().required("Required"),toCustomerId:a.Yj().nullable().required("Required"),financialYear:a.Yj().required("Required"),user:a.Yj().required("Required"),accessUser:a.Yj().nullable().required("Required"),rightsFor:a.Yj().nullable().required("Required"),gaaLevelId:a.Yj().nullable().required("Required"),networkLevelId:a.Yj().nullable().required("Required"),server:a.Yj().required("Required"),port:a.Yj().required("Required"),encryption:a.Yj().required("Required"),requisitionNumber:a.Yj().nullable().required("Required"),password:a.Yj().required("Required"),transaction:a.Yj().nullable().required("Required"),serviceCenter:a.Yj().nullable().required("Required"),scrapLocation:a.Yj().nullable().required("Required"),effectiveFrom:a.Yj().required("Required"),effectiveTo:a.Yj().required("Required"),displayName:a.Yj().required("Required"),templateName:a.Yj().required("Required"),subject:a.Yj().required("Required"),from:a.Yj().required("Required"),to:a.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:a.Yj().required("Required"),attachmentsWhenIsAuthorized:a.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:a.Yj().nullable().required("Required")}),requestNumber:a.Yj().required("Required"),remarks:a.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:a.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:a.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:a.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>a.Yj().required("Required"),startDateRange:(e,r,t)=>a.Yj().required("Required").test("date-comparison",`${r} must be >= ${t}`,(function(r){return function(e,r){let t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const a=new Date(e),i=new Date(r);return t?a<=i:a>=i}(r,e,!1)})),endDateRange:(e,r,t,i,o,n)=>a.Yj().required("Required").test("date-comparison",`${t} must be <= ${i} and >= ${o}`,(function(t){return d(t,e,r,!n)})),endDateRangeMax:(e,r,t,i,o,n)=>a.Yj().required("Required").test("date-comparison",`${t} must be >= ${i} and >= ${o}`,(function(t){return d(t,e,r,!n)})),month:e=>a.ai().test(...n(e)).test(...o).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,t)=>a.ai().test(...n(r)).test(...o).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${t}`),checkQty:e=>a.ai().test(...n(e)).test(...i).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?a.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):a.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:a.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},89649:(e,r,t)=>{t.d(r,{A:()=>o});var a=t(9950),i=t(80415);function o(){const[e,r]=(0,a.useState)({pageIndex:i.j7.pageIndex,pageSize:i.j7.pageSize,forceUpdate:!0}),t=(0,a.useCallback)((function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;r((e=>({pageIndex:t,pageSize:a,forceUpdate:!e.forceUpdate})))}),[e]),o=(0,a.useCallback)((()=>{r((e=>({pageIndex:i.j7.pageIndex,pageSize:i.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>r((r=>({...r,pageIndex:e,forceUpdate:!r.forceUpdate}))),setPageSize:e=>r((r=>({pageIndex:i.j7.pageIndex,pageSize:e,forceUpdate:!r.forceUpdate}))),refreshPagination:o,setPaginationsFunctions:t}}},39225:(e,r,t)=>{t.d(r,{A:()=>n});var a=t(41397),i=t.n(a),o=t(9950);const n=e=>{const{isFcMode:r}=e||{},[t,a]=(0,o.useState)(void 0),[n,s]=(0,o.useState)(!1),d=(0,o.useRef)([]),l=(0,o.useCallback)((e=>{const a=d.current;d.current=e,t&&(r||i().isEqual(e,a)||s((e=>!e)))}),[r,t]),u=(0,o.useMemo)((()=>null===t||void 0===t?void 0:t.trim()),[t]);return{searchString:t,searchStringTrimmed:u,forceSearch:n,accessorsRef:d,setSearchString:a,setAccessors:l}}},88848:(e,r,t)=>{t.d(r,{$:()=>o});var a=t(9950),i=t(27081);const o=()=>{const[e,r]=(0,a.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[t,o]=(0,a.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[n,s]=(0,a.useState)({masterObject:[],error:"",loading:!0}),[d,l]=(0,a.useState)({masterObject:[],error:"",loading:!0}),[u,c]=(0,a.useState)({masterObject:[],error:"",loading:!0}),[m,g]=(0,a.useState)({currencyObject:[],error:"",loading:!0}),[p,q]=(0,a.useState)({gstStatusObject:[],error:"",loading:!0}),[j,f]=(0,a.useState)({paymentTermObject:[],error:"",loading:!0}),[b,h]=(0,a.useState)({incotermsObject:[],error:"",loading:!0}),[S,v]=(0,a.useState)({titleObject:[],error:"",loading:!0}),[y,R]=(0,a.useState)({masterMakerLovHistoryObject:{},error:"",loading:!0}),z=(0,i.d4)((e=>e.masterMakerLov||{})),A=(0,i.d4)((e=>e.masterMakerLovList||{})),Y=(0,i.d4)((e=>e.lovsForMasterName||[])),x=(0,i.d4)((e=>e.lovsForMasterNameSecond||[])),O=(0,i.d4)((e=>e.lovsForMasterNameThird||[])),w=(0,i.d4)((e=>e.currency||[])),E=(0,i.d4)((e=>e.gstStatus||[])),L=(0,i.d4)((e=>e.paymentTerm||[])),D=(0,i.d4)((e=>e.incoterms||[])),I=(0,i.d4)((e=>e.title||[])),T=(0,i.d4)((e=>e.masterMakerLovHistory||{}));return(0,a.useEffect)((()=>{r((e=>({...e,...z})))}),[z]),(0,a.useEffect)((()=>{o((e=>({...e,...A})))}),[A]),(0,a.useEffect)((()=>{s((e=>({...e,...Y})))}),[Y]),(0,a.useEffect)((()=>{l((e=>({...e,...x})))}),[x]),(0,a.useEffect)((()=>{c((e=>({...e,...O})))}),[O]),(0,a.useEffect)((()=>{g((e=>({...e,...w})))}),[w]),(0,a.useEffect)((()=>{q((e=>({...e,...E})))}),[E]),(0,a.useEffect)((()=>{f((e=>({...e,...L})))}),[L]),(0,a.useEffect)((()=>{h((e=>({...e,...D})))}),[D]),(0,a.useEffect)((()=>{v((e=>({...e,...I})))}),[I]),(0,a.useEffect)((()=>{R((e=>({...e,...T})))}),[T]),{masterMakerLovs:e,masterMakerLovsList:t,masterMakerOrgType:n,masterMakerOrgTypeSecond:d,masterMakerOrgTypeThird:u,masterMakerCurrency:m,masterMakerGstStatus:p,masterMakerIncoterms:b,masterMakerPaymentTerm:j,masterMakerLovHistory:y,masterMakerTitle:S}}},6900:(e,r,t)=>{t.r(r),t.d(r,{default:()=>_});var a=t(9950),i=t(27081),o=t(28429),n=t(96583),s=t(88848),d=t(59254),l=t(4139),u=t(87233),c=t(67535),m=t(60666),g=t(9449),p=t(26473),q=t(80733),j=t(3147),f=t(29024),b=t(55519),h=t(71826),S=t(96951),v=t(14351),y=t(84601),R=t(62054),z=t(52867),A=t(513),Y=t(94826),x=t(44414);const O=(0,d.Ay)(l.Ay)((e=>{let{theme:r}=e;return{marginTop:r.spacing(6),alignItems:"end"}})),w=(0,d.Ay)(l.Ay)({display:"flex",justifyContent:"flex-start",gap:"20px",position:"absolute"}),E=(0,d.Ay)(l.Ay)({display:"flex",justifyContent:"flex-end",gap:"20px"}),L=[{name:"storePhoto",label:"Store Photo",accept:"image/png, image/gif, image/jpeg",required:!1,multiple:!1},{name:"attachments",label:"Attachments",accept:"*",required:!1,multiple:!0}],D=6e5,I=e=>{var r,t;const{onClick:n,data:d,view:I,update:T,refreshPagination:P,organizationTypeId:C}=e,{orgType:k}=(0,o.g)(),N=(0,i.wA)(),[$,H]=(0,a.useState)([]),[M,_]=(0,a.useState)(null),[F,V]=(0,a.useState)(!1),U=(0,g.mN)({resolver:(0,p.t)(m.Ik().shape({name:y.A.orgName,code:y.A.code,organizationType:y.A.organizationType,organizationStoreId:y.A.organizationStoreId,projectId:y.A.project,isRestricted:y.A.other,...!T&&(null===(r=L.find((e=>"attachments"===e.name)))||void 0===r?void 0:r.required)&&{attachments:y.A.requiredWithLabel("Attachments")},...!T&&(null===(t=L.find((e=>"storePhoto"===e.name)))||void 0===t?void 0:t.required)&&{storePhoto:y.A.requiredWithLabel("Store Photo")}})),defaultValues:{},mode:"all"}),{handleSubmit:Z,setValue:B}=U,{projectsDropdown:G}=(0,q.Y)(),{organizationStores:W}=(0,j.E)(),{masterMakerOrgType:Q,masterMakerOrgTypeSecond:J}=(0,s.$)(),K=null===G||void 0===G?void 0:G.projectsDropdownObject,X=Q.masterObject,ee=null===W||void 0===W?void 0:W.organizationStoreObject.rows,re=J.masterObject,{organizationsDropdown:te,organizationsLocationDropdown:ae}=(0,b.G)(),[ie,oe]=(0,a.useState)(),{orgData:ne}=(0,a.useMemo)((()=>{var e;return{orgData:(null===te||void 0===te?void 0:te.organizationDropdownObject)||[],count:(null===te||void 0===te||null===(e=te.organizationDropdownObject)||void 0===e?void 0:e.count)||0,isLoading:te.loading||!1}}),[te]),{orgLocationData:se}=(0,a.useMemo)((()=>{var e;return{orgLocationData:(null===ae||void 0===ae?void 0:ae.organizationLocationDropdownObject)||[],count:(null===ae||void 0===ae||null===(e=ae.organizationLocationDropdownObject)||void 0===e?void 0:e.count)||0,isLoading:ae.loading||!1}}),[ae]);(0,a.useEffect)((()=>{C&&(N((0,f.d8s)(C)),N((0,f.Ywh)(C)))}),[N,C]),(0,a.useEffect)((()=>{ne&&se&&oe([...ne,...se])}),[ne,se]),(0,a.useEffect)((()=>{C&&B("organizationType",C)}),[C,B]),(0,a.useEffect)((()=>{N((0,f.uiG)()),N((0,f.VOH)("ORGANIZATION TYPE")),N((0,f.rHZ)("STORE LOCATION"))}),[N]),(0,a.useEffect)((()=>{N((0,f.qV$)({organizationType:C}))}),[N,C]),(0,a.useEffect)((()=>{B("isRestricted",!1),B("isFaulty",!1),B("isScrap",!1),B("isInstalled",!1),B("forInstaller",!1),B("isOld",!1);var e;(I||T)&&(e=(0,z.x5)(d,L),Object.entries(e).forEach((e=>{let[r,t]=e;"projectId"===r&&B("projectId",t),"organization_store"===r?(B("organizationId",t.organization.id),_(t.organization.id)):B(r,t)})))}),[d,T,I,B]);const de=[{value:!0,name:"Yes"},{value:!1,name:"No"}],le=function(e,r,t){let a=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return(0,x.jsx)(S.gk,{name:e,labels:r,title:t,disabled:I||a,defaultValue:!1,required:!0})};return(0,x.jsxs)(x.Fragment,{children:[F&&(0,x.jsx)(Y.A,{}),(0,x.jsx)(S.Op,{methods:U,onSubmit:Z((async e=>{let r;V(!0);const t=(0,A.y)(e,$);if(r=T?await(0,h.default)("/organization-store-location-update",{method:"PUT",timeoutOverride:D,body:t,params:d.id}):await(0,h.default)("/organization-store-location-create",{method:"POST",timeoutOverride:D,body:t}),r.success){const e=T?"Store location updated successfully!":"Store location created successfully!";(0,R.A)(e,{variant:"success",autoHideDuration:1e4}),P(),n()}else{var a;(0,R.A)((null===(a=r.error)||void 0===a?void 0:a.message)||"Operation failed. Please try again.",{variant:"error"})}V(!1)})),children:(0,x.jsxs)(v.A,{title:`${I?"View":T?"Update":"Add"} ${k} Store Location`,children:[(0,x.jsxs)(l.Ay,{container:!0,spacing:4,children:[(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.eu,{InputLabelProps:{shrink:!0},disable:!0,name:"organizationType",label:"Organization Type",menus:X||[],required:!0})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.eu,{InputLabelProps:{shrink:!0},disable:I,name:"projectId",label:"Project",menus:K||[],required:!0})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.eu,{InputLabelProps:{shrink:!0},disable:I,name:"organizationId",label:"Organization",menus:(0,z.HF)(structuredClone(ie)),onChange:e=>{var r,t;null!==e&&void 0!==e&&null!==(r=e.target)&&void 0!==r&&r.value&&_(null===e||void 0===e||null===(t=e.target)||void 0===t?void 0:t.value)},required:!0})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.eu,{InputLabelProps:{shrink:!0},disable:I,name:"organizationStoreId",label:"Organization Store",menus:null===ee||void 0===ee?void 0:ee.filter((e=>e.organizationId===M)),required:!0})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.eu,{InputLabelProps:{shrink:!0},disable:I,name:"name",label:"Name",menus:(e=>{let r=[];return e&&e.length&&e.map((e=>{r.push({id:e.name,name:e.name,code:e.code})})),r})(re||[]),onChange:e=>{var r,t,a;null!==e&&void 0!==e&&e.target&&null!==e&&void 0!==e&&null!==(r=e.target)&&void 0!==r&&r.row&&B("code",null===e||void 0===e||null===(t=e.target)||void 0===t||null===(a=t.row)||void 0===a?void 0:a.code)},required:!0})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.o3,{InputLabelProps:{shrink:!0},disable:I,name:"code",label:"Code",type:"text",disabled:!0,required:!0})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.o3,{InputLabelProps:{shrink:!0},disable:I,name:"integrationId",label:"Integration ID",type:"text"})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:(0,x.jsx)(S.o3,{InputLabelProps:{shrink:!0},disable:I,name:"remarks",label:"Remarks",type:"text"})}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:le("isRestricted",de,"Restricted")}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:le("isFaulty",de,"Faulty",!0)}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:le("isScrap",de,"Scrap",!0)}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:le("isInstalled",de,"Installed",!0)}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:le("forInstaller",de,"Installer",!0)}),(0,x.jsx)(l.Ay,{item:!0,md:3,xl:2,children:le("isOld",de,"Old",!0)}),(0,x.jsx)(l.Ay,{item:!0,xs:12,mt:-2,mb:-2,children:(0,x.jsx)(u.A,{sx:{fontSize:12,color:"red"},children:'Note: If you select "Restricted = Yes", Total Stock will not be included for this location in "Approver Dashboard".'})})]}),(0,x.jsxs)(O,{container:!0,mt:2,spacing:2,children:[(0,x.jsx)(w,{item:!0,xs:6,children:(0,x.jsx)(A.A,{fileFields:L,data:d,view:I,update:T,tasks:$,setTasks:H,setValue:B})}),(0,x.jsxs)(E,{item:!0,xs:12,children:[(0,x.jsx)(c.A,{onClick:n,size:"small",variant:"outlined",color:"primary",children:"Back"}),!I&&(0,x.jsx)(c.A,{disabled:F,size:"small",type:"submit",variant:"contained",color:"primary",children:T?"Update":"Save"})]})]})]})})]})};var T=t(12952),P=t(99635),C=t(89649),k=t(60845),N=t(64499),$=t(39225),H=t(30423),M=t(65920);const _=()=>{const{paginations:{pageSize:e,pageIndex:r,forceUpdate:t},refreshPagination:d,setPageIndex:l,setPageSize:u}=(0,C.A)(),{searchString:c,setSearchString:m,accessorsRef:g,setAccessors:p,forceSearch:q,searchStringTrimmed:j}=(0,$.A)(),{orgType:b}=(0,o.g)(),[S,v]=(0,a.useState)(!1),[y,A]=(0,a.useState)(!1),[Y,O]=(0,a.useState)(!1),[w,E]=(0,a.useState)(!1),[L,D]=(0,a.useState)(null),[_,F]=(0,a.useState)(null),[V,U]=(0,a.useState)(null),[Z,B]=(0,a.useState)(1),[G,W]=(0,a.useState)(null),[Q,J]=(0,a.useState)(!1),[K,X]=(0,a.useState)(!1),[ee,re]=(0,a.useState)(null),te=(0,i.wA)(),{companyStoreLocations:ae,firmStoreLocations:ie,organizationStoreLocationsHistory:oe}=(0,T.V)(),{masterMakerOrgType:{masterObject:ne}}=(0,s.$)();(0,a.useEffect)((()=>{te((0,f.VOH)("ORGANIZATION TYPE"))}),[te]);const se=((e,r)=>{const t=e&&e.filter((e=>e.name===r));return t&&t.length?t[0].id:null})(ne,b.toUpperCase()),{filterObjectForApi:de}=(0,H.bZ)(),le=(0,M.A)(de),ue=(0,M.A)(ee);(0,a.useEffect)((()=>{if(!se)return;if([[le,de],[ue,ee]].some(z.$H))return void d();const t={pageIndex:r,pageSize:e,organizationType:se,listType:Z,...j&&{searchString:j,accessors:JSON.stringify(g.current)},sortBy:(null===ee||void 0===ee?void 0:ee[0])||"updatedAt",sortOrder:(null===ee||void 0===ee?void 0:ee[1])||"DESC",filterObject:de};"CONTRACTOR"===b.toUpperCase()?te((0,k.c1)(t)):"COMPANY"===b.toUpperCase()&&te((0,k.Ru)(t))}),[te,r,e,t,se,b,Z,j,ee,g,q,d,le,de,ue]),(0,a.useEffect)((()=>{null!==L&&void 0!==L&&L.id&&te((0,k.nh)({pageIndex:r,pageSize:e,listType:Z,recordId:null===L||void 0===L?void 0:L.id}))}),[te,r,e,Z,L,t]);const ce="CONTRACTOR"===b.toUpperCase()?ie:ae,{data:me,count:ge}=(0,a.useMemo)((()=>{var e,r,t,a,i,o;return"CONTRACTOR"===b.toUpperCase()?{data:(null===ce||void 0===ce||null===(e=ce.firmStoreLocationsObject)||void 0===e?void 0:e.rows)||[],count:(null===ce||void 0===ce||null===(r=ce.firmStoreLocationsObject)||void 0===r?void 0:r.count)||0,isLoading:(null===ce||void 0===ce||null===(t=ce.firmStoreLocationsObject)||void 0===t?void 0:t.loading)||!1}:{data:(null===ce||void 0===ce||null===(a=ce.companyStoreLocationsObject)||void 0===a?void 0:a.rows)||[],count:(null===ce||void 0===ce||null===(i=ce.companyStoreLocationsObject)||void 0===i?void 0:i.count)||0,isLoading:(null===ce||void 0===ce||null===(o=ce.companyStoreLocationsObject)||void 0===o?void 0:o.loading)||!1}}),[ce,b]),{historyData:pe,historyCounts:qe}=(0,a.useMemo)((()=>{var e,r;return{historyData:(null===(e=oe.organizationStoreLocationsHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(r=oe.organizationStoreLocationsHistoryObject)||void 0===r?void 0:r.count)||0,isLoading:oe.loading||!1}}),[oe]),je=(0,a.useMemo)((()=>[{Header:"Type",accessor:"master_maker_lov.name"},{Header:"Store Name",accessor:"organization_store.name",filterProps:{tableName:"organizations",getColumn:"name",customAccessor:"storeName"}},{Header:"Code",accessor:"code",filterProps:{tableName:"organization_store_locations",getColumn:"code",customAccessor:"code"}},{Header:"Name",accessor:"name",filterProps:{tableName:"organization_store_locations",getColumn:"name",customAccessor:"name"}},{Header:"Integration ID",accessor:"integrationId",filterProps:{tableName:"organization_store_locations",getColumn:"integration_id",customAccessor:"integrationId"}},{Header:"Is Restricted",accessor:"restricted",exportAccessor:"isRestricted",filterProps:{tableName:"organization_store_locations",getColumn:"is_restricted",customAccessor:"isRestricted"}},{Header:"Is Faulty",accessor:"faulty",exportAccessor:"isFaulty",filterProps:{tableName:"organization_store_locations",getColumn:"is_faulty",customAccessor:"isFaulty"}},{Header:"Is Scrap",accessor:"scrap",exportAccessor:"isScrap",filterProps:{tableName:"organization_store_locations",getColumn:"is_scrap",customAccessor:"isScrap"}},{Header:"Is Installed",accessor:"installed",exportAccessor:"isInstalled",filterProps:{tableName:"organization_store_locations",getColumn:"is_installed",customAccessor:"isInstalled"}},{Header:"For Installer",accessor:"installer",exportAccessor:"forInstaller",filterProps:{tableName:"organization_store_locations",getColumn:"for_installer",customAccessor:"forInstaller"}},{Header:"Is Old",accessor:"old",exportAccessor:"isOld",filterProps:{tableName:"organization_store_locations",getColumn:"is_old",customAccessor:"isOld"}},{Header:"Remarks",accessor:"remarks",filterProps:{tableName:"organization_store_locations",getColumn:"remarks",customAccessor:"remarks"}},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"updatedBy"}},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"users",getColumn:"name",customAccessor:"createdBy"}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Created On",accessor:"createdAt"}]),[]),fe=()=>{J(!1),B(1),W(null),X(!1),A(!y)};(0,a.useEffect)((()=>{J(!1),B(1),W(null),X(!1),A(!1)}),[b]);const be=e=>{let r=[];return e&&e.length>0&&e.map((e=>{r.push({...e,restricted:e.isRestricted?"True":"False",faulty:e.isFaulty?"True":"False",scrap:e.isScrap?"True":"False",installed:e.isInstalled?"True":"False",installer:e.forInstaller?"True":"False",old:e.isOld?"True":"False"})})),r};return(0,x.jsxs)(x.Fragment,{children:[y?(0,x.jsx)(I,{refreshPagination:d,onClick:fe,organizationTypeId:se,...G&&{data:G},...Q&&{view:Q,update:!1},...K&&{update:K,view:!1}}):(0,x.jsx)(P.default,{title:`${b} Store Location`,data:be(me),columns:je,count:ge,setPageIndex:l,setPageSize:u,pageIndex:r,pageSize:e,onClick:fe,handleRowDelete:e=>{F(e),v(!0)},handleRowUpdate:e=>{A(!0),X(!0),J(!1),W(e)},handleRowView:e=>{A(!0),J(!0),X(!1),W(e)},handleRowRestore:async e=>{U(e),O(!0)},listType:Z,setListType:e=>{B(e)},handleRowHistory:e=>{D(e),E(!0)},searchConfig:{searchString:c,searchStringTrimmed:j,setSearchString:m,setAccessors:p},sortConfig:{sort:ee,setSort:re},cleanupTrigger:b,exportConfig:{tableName:`${null===b||void 0===b?void 0:b.toLowerCase()}_store_locations`,apiQuery:{organizationType:se,listType:Z,filterObject:de}}}),(0,x.jsx)(N.A,{open:S,handleClose:()=>v(!1),handleConfirm:async()=>{const e=await(0,h.default)("/organization-store-location-delete",{method:"DELETE",params:_});var r;e.success?(d(),v(!1)):(0,R.A)(null===e||void 0===e||null===(r=e.error)||void 0===r?void 0:r.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,x.jsx)(N.A,{open:Y,handleClose:()=>O(!1),handleConfirm:async()=>{const e={...V,isActive:"1"};(await(0,h.default)("/organization-store-location-update",{method:"PUT",body:e,params:e.id})).success&&(d(),O(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,x.jsx)(n.A,{open:w,onClose:()=>E(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,x.jsx)(P.default,{isHistory:!0,title:null===L||void 0===L?void 0:L.name,data:be(pe),columns:je,count:qe,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:l,setPageSize:u,pageIndex:r,pageSize:e})})]})}},12952:(e,r,t)=>{t.d(r,{V:()=>o});var a=t(9950),i=t(27081);const o=()=>{const[e,r]=(0,a.useState)({companyStoreLocationsObject:{},error:"",loading:!0}),t=(0,i.d4)((e=>e.companyStoreLocations||{}));(0,a.useEffect)((()=>{r((e=>({...e,...t})))}),[t]);const[o,n]=(0,a.useState)({firmStoreLocationsObject:{},error:"",loading:!0}),s=(0,i.d4)((e=>e.firmStoreLocations||{}));(0,a.useEffect)((()=>{n((e=>({...e,...s})))}),[s]);const[d,l]=(0,a.useState)({organizationStoreLocationsHistoryObject:{},error:"",loading:!0}),u=(0,i.d4)((e=>e.organizationStoreLocationsHistory||[]));return(0,a.useEffect)((()=>{l((e=>({...e,...u})))}),[u]),{companyStoreLocations:e,firmStoreLocations:o,organizationStoreLocationsHistory:d}}},3147:(e,r,t)=>{t.d(r,{E:()=>o});var a=t(9950),i=t(27081);const o=()=>{const[e,r]=(0,a.useState)({organizationStoreObject:{},error:"",loading:!0}),[t,o]=(0,a.useState)({organizationStoreObject:{},error:"",loading:!0}),[n,s]=(0,a.useState)({organizationStoreObject:[],error:"",loading:!0}),[d,l]=(0,a.useState)({organizationStoreDropdownObject:{},error:"",loading:!0}),[u,c]=(0,a.useState)({organizationStoreDropdownSecondObject:{},error:"",loading:!0}),[m,g]=(0,a.useState)({orgStoreDropDownObject:{},error:"",loading:!0}),[p,q]=(0,a.useState)({orgViewStoreDropDownObject:{},error:"",loading:!0}),[j,f]=(0,a.useState)({organizationStoresHistoryObject:{},error:"",loading:!0}),b=(0,i.d4)((e=>e.organizationStores||{})),h=(0,i.d4)((e=>e.organizationStoresAllAccess||{})),S=(0,i.d4)((e=>e.organizationStoresSecond||[])),v=(0,i.d4)((e=>e.organizationStoreDropdown||[])),y=(0,i.d4)((e=>e.organizationStoreDropdownSecond||[])),R=(0,i.d4)((e=>e.orgStoreDropDown||[])),z=(0,i.d4)((e=>e.orgViewStoreDropDown||[])),A=(0,i.d4)((e=>e.organizationStoresHistory||[]));return(0,a.useEffect)((()=>{r((e=>({...e,...b})))}),[b]),(0,a.useEffect)((()=>{o((e=>({...e,...h})))}),[h]),(0,a.useEffect)((()=>{s((e=>({...e,...S})))}),[S]),(0,a.useEffect)((()=>{l((e=>({...e,...v})))}),[v]),(0,a.useEffect)((()=>{c((e=>({...e,...y})))}),[y]),(0,a.useEffect)((()=>{g((e=>({...e,...R})))}),[R]),(0,a.useEffect)((()=>{q((e=>({...e,...z})))}),[z]),(0,a.useEffect)((()=>{f((e=>({...e,...A})))}),[A]),{organizationStores:e,organizationStoresSecond:n,organizationStoresDropdown:d,orgStoreDropDown:m,orgViewStoreDropDown:p,organizationStoresHistory:j,organizationStoresAllAccess:t,organizationStoresDropdownSecond:u}}},55519:(e,r,t)=>{t.d(r,{G:()=>o});var a=t(9950),i=t(27081);const o=()=>{const[e,r]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[t,o]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[n,s]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[d,l]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[u,c]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[m,g]=(0,a.useState)({organizationLocationObject:{},error:"",loading:!0}),[p,q]=(0,a.useState)({organizationGetListObject:{},error:"",loading:!0}),[j,f]=(0,a.useState)({organizationDropdownObject:[],error:"",loading:!0}),[b,h]=(0,a.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[S,v]=(0,a.useState)({organizationDropdownSecondObject:[],error:"",loading:!0}),[y,R]=(0,a.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[z,A]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[Y,x]=(0,a.useState)({organizationObject:{},error:"",loading:!0}),[O,w]=(0,a.useState)({organizationHistoryObject:{},error:"",loading:!0}),E=(0,i.d4)((e=>e.organization||[])),L=(0,i.d4)((e=>e.organizationAllData||[])),D=(0,i.d4)((e=>e.organizationAllDataSecond||[])),I=(0,i.d4)((e=>e.organizationLocationByParent||[])),T=(0,i.d4)((e=>e.organizationLocationByParentSecond||[])),P=(0,i.d4)((e=>e.organizationLocation||[])),C=(0,i.d4)((e=>e.organizationListData||[])),k=(0,i.d4)((e=>e.organizationList||[])),N=(0,i.d4)((e=>e.organizationDropdown||[])),$=(0,i.d4)((e=>e.organizationLocationDropdown||[])),H=(0,i.d4)((e=>e.organizationLocationDropdownSecond||[])),M=(0,i.d4)((e=>e.organizationDropdownSecond||[])),_=(0,i.d4)((e=>e.organizationListSecond||[])),F=(0,i.d4)((e=>e.organizationHistory||[]));return(0,a.useEffect)((()=>{r((e=>({...e,...E})))}),[E]),(0,a.useEffect)((()=>{o((e=>({...e,...L})))}),[L]),(0,a.useEffect)((()=>{s((e=>({...e,...D})))}),[D]),(0,a.useEffect)((()=>{l((e=>({...e,...I})))}),[I]),(0,a.useEffect)((()=>{c((e=>({...e,...T})))}),[T]),(0,a.useEffect)((()=>{g((e=>({...e,...P})))}),[P]),(0,a.useEffect)((()=>{q((e=>({...e,...C})))}),[C]),(0,a.useEffect)((()=>{f((e=>({...e,...N})))}),[N]),(0,a.useEffect)((()=>{h((e=>({...e,...$})))}),[$]),(0,a.useEffect)((()=>{R((e=>({...e,...H})))}),[H]),(0,a.useEffect)((()=>{v((e=>({...e,...M})))}),[M]),(0,a.useEffect)((()=>{A((e=>({...e,...k})))}),[k]),(0,a.useEffect)((()=>{x((e=>({...e,..._})))}),[_]),(0,a.useEffect)((()=>{w((e=>({...e,...F})))}),[F]),{organizations:e,organizationsAllData:t,organizationsAllDataSecond:n,organizationsLocByParent:d,organizationsLocByParentSecond:u,organizationsGetListData:p,organizationsDropdown:j,organizationsDropdownSecond:S,organizationsList:z,organizationsListSecond:Y,organizationHistory:O,organizationsLocation:m,organizationsLocationDropdown:b,organizationsLocationDropdownSecond:y}}},80733:(e,r,t)=>{t.d(r,{Y:()=>o});var a=t(9950),i=t(27081);const o=()=>{const[e,r]=(0,a.useState)({projectsObject:{},error:"",loading:!0}),[t,o]=(0,a.useState)({projectDetailsObject:{},error:"",loading:!0}),[n,s]=(0,a.useState)({projectsDropdownObject:[],error:"",loading:!0}),[d,l]=(0,a.useState)({projectsDropdownObject:[],error:"",loading:!0}),[u,c]=(0,a.useState)({projectsObject:[],error:"",loading:!0}),[m,g]=(0,a.useState)({projectsHistoryObject:{},error:"",loading:!0}),p=(0,i.d4)((e=>e.projects||{})),q=(0,i.d4)((e=>e.projectDetails||{})),j=(0,i.d4)((e=>e.projectsDropdown||[])),f=(0,i.d4)((e=>e.allProjectsDropdown||[])),b=(0,i.d4)((e=>e.projectsForRoleOrUser||[])),h=(0,i.d4)((e=>e.projectsHistory||{}));return(0,a.useEffect)((()=>{r((e=>({...e,...p})))}),[p]),(0,a.useEffect)((()=>{o((e=>({...e,...q})))}),[q]),(0,a.useEffect)((()=>{s((e=>({...e,...j})))}),[j]),(0,a.useEffect)((()=>{l((e=>({...e,...f})))}),[f]),(0,a.useEffect)((()=>{c((e=>({...e,...b})))}),[b]),(0,a.useEffect)((()=>{g((e=>({...e,...h})))}),[h]),{projects:e,projectsDropdown:n,allProjectsDropdown:d,projectsHistory:m,projectsGovernForRoleOrUser:u,projectDetails:t}}},13239:(e,r,t)=>{t.d(r,{A:()=>d});var a=t(89379),i=t(9950);const o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"}}]},name:"check",theme:"outlined"};var n=t(14840),s=function(e,r){return i.createElement(n.A,(0,a.A)((0,a.A)({},e),{},{ref:r,icon:o}))};const d=i.forwardRef(s)},26592:(e,r,t)=>{var a=t(24994);r.A=void 0;var i=a(t(79526)),o=t(44414);r.A=(0,i.default)((0,o.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"}),"DeleteOutline")},36089:(e,r,t)=>{var a=t(24994);r.A=void 0;var i=a(t(79526)),o=t(44414);r.A=(0,i.default)((0,o.jsx)("path",{d:"m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"}),"EditOutlined")}}]);