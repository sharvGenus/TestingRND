"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[6857,5406],{64499:(e,r,t)=>{t.d(r,{A:()=>p});var a=t(9950),i=t(65669),d=t(43263),o=t(57191),s=t(95537),n=t(67535),u=t(87233),l=t(44414);p.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const c={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},m={display:"flex",flexDirection:"row",padding:"15px 0"},q={display:"flex",justifyContent:"flex-end",gap:2},j={marginTop:2,display:"flex",fontSize:"14px"};function p(e){let{open:r,handleClose:t,title:p,message:h,closeBtnTitle:b,confirmBtnTitle:v,handleConfirm:g,confirmColor:R}=e;const[f,Y]=(0,a.useState)(null);return(0,a.useEffect)((()=>{Y(null)}),[r]),(0,l.jsx)("div",{children:(0,l.jsx)(i.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:r,closeAfterTransition:!0,slots:{backdrop:d.A},slotProps:{backdrop:{timeout:500}},children:(0,l.jsx)(o.A,{in:r,children:(0,l.jsxs)(s.A,{sx:c,children:[(0,l.jsx)(u.A,{id:"transition-modal-title",variant:"h4",children:p}),(0,l.jsx)(u.A,{id:"transition-modal-title",variant:"h6",sx:m,children:h}),(0,l.jsxs)(s.A,{sx:q,children:[!!t&&(0,l.jsx)(n.A,{onClick:t,size:"small",variant:"outlined",color:"primary",children:b}),!!g&&(0,l.jsx)(n.A,{onClick:g,size:"small",variant:"contained",color:R||"error",children:v})]}),f&&(0,l.jsx)(u.A,{variant:"p",color:"red",sx:j,children:f})]})})})})}},84601:(e,r,t)=>{t.d(r,{A:()=>u});var a=t(60666);const i=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],d=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],o=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},s=["nothing","",()=>!0],n=function(e,r,t){let a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const i=new Date(e),d=new Date(r),o=new Date(t);return a?o<=i&&i<=d:o<=i&&i>=d},u={allowedColumns:a.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:a.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:a.Yj().required("Required").nullable(),formType:a.Yj().required("Required").nullable(),taskType:a.Yj().required("Required").nullable(),code:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:a.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:a.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:a.Yj().required("Required"),title:a.Yj().required("Required").nullable(),office:a.Yj().required("Required").nullable(),masterCode:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:a.Yj().required("Required"),gstNumber:a.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:a.Yj().required("Required"),storePhoto:a.Yj().required("Required"),email:a.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:a.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:a.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:a.Yj().required("Required"),nother:a.Yj().nullable().required("Required"),otherArray:a.YO().min(1,"Please select atleast one field"),areaLevel:a.YO().min(1,"Please select atleast one level."),formTitle:a.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:a.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:a.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:a.Yj().required(" "),telephone:a.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:a.Yj().required("Required"),registeredAddress:a.Yj().required("Required"),quantity:a.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:a.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:a.ai().test(...o()).test(...i).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.ai().test(...r?o():s).test(...i).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:a.Yj().required("Required"),state:a.Yj().required("Required"),city:a.Yj().required("Required"),registeredCountry:a.Yj().required("Required"),registeredState:a.Yj().required("Required"),registeredCity:a.Yj().required("Required"),organizationType:a.Yj().nullable().required("Required"),organizationCode:a.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:a.Yj().nullable().required("Required"),organizationLocationId:a.Yj().required("Required"),integrationId:a.Yj().required("Required"),firm:a.Yj().required("Required"),movementType:a.Yj().required("Required"),supplier:a.Yj().required("Required"),masterMaker:a.Yj().required("Required"),projectMasterMaker:a.Yj().required("Required"),lov:a.Yj().required("Required"),date:a.Yj().required("Required"),fromDate:a.Yj().required("Required"),toDate:a.Yj().when("fromDate",{is:e=>!!e,then:a.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:a.Yj().required("Required"),challanNumber:a.Yj().required("Required"),poNumber:a.Yj().required("Required"),workOrderNumber:a.Yj().required("Required"),receivingStore:a.Yj().required("Required"),uom:a.Yj().required("Required"),project:a.Yj().nullable().required("Required"),projectArr:a.YO().of(a.gl()).nullable().required("Required").min(1,"Required"),organizationArr:a.YO().of(a.gl()).nullable().required("Required").min(1,"Required"),accessProject:a.Yj().nullable().required("Required"),rate:a.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:a.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:a.Yj().required("Required"),rangeTo:a.Yj().required("Required"),requiredWithLabel:()=>a.Yj().nullable().required("Required"),requiredWithNonZero:e=>a.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>a.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:a.ai().required("Required"),isSerialize:a.Yj().required("Please select a checkbox"),vehicleNumber:a.Yj().required("Required"),vehicleNumberOptional:a.Yj().nullable(),inventoryNameOptional:a.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:a.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:a.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:a.Yj().required("Required"),eWayBillNumber:a.Yj().required("Required"),eWayBillDate:a.Yj().required("Required"),actualReceiptDate:a.Yj().when("eWayBillDate",{is:e=>!!e,then:a.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:a.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:a.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:a.Yj().nullable().required("Required"),placeOfTransfer:a.Yj().required("Required"),contractorStore:a.Yj().nullable().required("Required"),projectSiteStoreLocation:a.Yj().required("Required"),contractorStoreLocation:a.Yj().nullable().required("Required"),contractorEmployee:a.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>a.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:a.Yj().required("Required"),longDescription:a.Yj().required("Required"),hsnCode:a.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:a.Yj().required("Required"),store:a.Yj().nullable().required("Required"),accessStore:a.Yj().nullable().required("Required"),series:a.Yj().required("Required"),material:a.Yj().required("Required"),materialType:a.Yj().required("Required"),materialCode:a.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:a.Yj().nullable().required("Required"),accessOrganizationId:a.Yj().nullable().required("Required"),company:a.Yj().required("Required"),contractor:a.Yj().nullable().required("Required"),contractorId:a.Yj().required("Required"),fromInstaller:a.Yj().nullable().required("Required"),toInstaller:a.Yj().nullable().required("Required"),fromStoreLocationId:a.Yj().nullable().required("Required"),toStoreLocationId:a.Yj().nullable().required("Required"),storeLocationId:a.Yj().nullable().required("Required"),installerStoreLocationId:a.Yj().nullable().required("Required"),accessStoreLocationId:a.Yj().nullable().required("Required"),fromStore:a.Yj().nullable().required("Required"),toStore:a.Yj().required("Required"),transporterName:a.Yj().required("Required"),customerSiteStoreId:a.Yj().nullable().required("Required"),toCustomerId:a.Yj().nullable().required("Required"),financialYear:a.Yj().required("Required"),user:a.Yj().required("Required"),accessUser:a.Yj().nullable().required("Required"),rightsFor:a.Yj().nullable().required("Required"),gaaLevelId:a.Yj().nullable().required("Required"),networkLevelId:a.Yj().nullable().required("Required"),server:a.Yj().required("Required"),port:a.Yj().required("Required"),encryption:a.Yj().required("Required"),requisitionNumber:a.Yj().nullable().required("Required"),password:a.Yj().required("Required"),transaction:a.Yj().nullable().required("Required"),serviceCenter:a.Yj().nullable().required("Required"),scrapLocation:a.Yj().nullable().required("Required"),effectiveFrom:a.Yj().required("Required"),effectiveTo:a.Yj().required("Required"),displayName:a.Yj().required("Required"),templateName:a.Yj().required("Required"),subject:a.Yj().required("Required"),from:a.Yj().required("Required"),to:a.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:a.Yj().required("Required"),attachmentsWhenIsAuthorized:a.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:a.Yj().nullable().required("Required")}),requestNumber:a.Yj().required("Required"),remarks:a.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:a.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:a.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:a.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>a.Yj().required("Required"),startDateRange:(e,r,t)=>a.Yj().required("Required").test("date-comparison",`${r} must be >= ${t}`,(function(r){return function(e,r){let t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const a=new Date(e),i=new Date(r);return t?a<=i:a>=i}(r,e,!1)})),endDateRange:(e,r,t,i,d,o)=>a.Yj().required("Required").test("date-comparison",`${t} must be <= ${i} and >= ${d}`,(function(t){return n(t,e,r,!o)})),endDateRangeMax:(e,r,t,i,d,o)=>a.Yj().required("Required").test("date-comparison",`${t} must be >= ${i} and >= ${d}`,(function(t){return n(t,e,r,!o)})),month:e=>a.ai().test(...o(e)).test(...d).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,t)=>a.ai().test(...o(r)).test(...d).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${t}`),checkQty:e=>a.ai().test(...o(e)).test(...i).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?a.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):a.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:a.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},89649:(e,r,t)=>{t.d(r,{A:()=>d});var a=t(9950),i=t(80415);function d(){const[e,r]=(0,a.useState)({pageIndex:i.j7.pageIndex,pageSize:i.j7.pageSize,forceUpdate:!0}),t=(0,a.useCallback)((function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;r((e=>({pageIndex:t,pageSize:a,forceUpdate:!e.forceUpdate})))}),[e]),d=(0,a.useCallback)((()=>{r((e=>({pageIndex:i.j7.pageIndex,pageSize:i.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>r((r=>({...r,pageIndex:e,forceUpdate:!r.forceUpdate}))),setPageSize:e=>r((r=>({pageIndex:i.j7.pageIndex,pageSize:e,forceUpdate:!r.forceUpdate}))),refreshPagination:d,setPaginationsFunctions:t}}},39225:(e,r,t)=>{t.d(r,{A:()=>o});var a=t(41397),i=t.n(a),d=t(9950);const o=e=>{const{isFcMode:r}=e||{},[t,a]=(0,d.useState)(void 0),[o,s]=(0,d.useState)(!1),n=(0,d.useRef)([]),u=(0,d.useCallback)((e=>{const a=n.current;n.current=e,t&&(r||i().isEqual(e,a)||s((e=>!e)))}),[r,t]),l=(0,d.useMemo)((()=>null===t||void 0===t?void 0:t.trim()),[t]);return{searchString:t,searchStringTrimmed:l,forceSearch:o,accessorsRef:n,setSearchString:a,setAccessors:u}}},22438:(e,r,t)=>{t.r(r),t.d(r,{default:()=>I});var a=t(9950),i=t(96583),d=t(27081),o=t(84007),s=t(23882),n=t(80733),u=t(4139),l=t(67535),c=t(60666),m=t(9449),q=t(26473),j=t(71826),p=t(96951),h=t(14351),b=t(84601),v=t(62054),g=t(44414);const R=e=>{const{data:r,view:t,update:i,setRefresh:d,selectedProject:o,setSelectedProject:s,projectData:n,setSelectedProjectMaster:R,projectMastersData:f,refreshPagination:Y}=e,y=(0,m.mN)({resolver:(0,q.t)(c.Ik().shape({projectId:b.A.other,masterId:b.A.other,code:b.A.other,name:b.A.other})),defaultValues:{},mode:"all"}),{handleSubmit:x,setValue:S,clearErrors:A,getValues:M}=y;(0,a.useEffect)((()=>{1===(null===n||void 0===n?void 0:n.length)&&(S("projectId",n[0].id),s(n[0].id))}),[n,s,S]);const k=(0,a.useCallback)((()=>{d();const e=M();y.reset({name:"",projectId:e.projectId,masterId:e.masterId})}),[d,y,M]);(0,a.useEffect)((()=>{var e;r||k(),(t||i)&&(S("projectId",o),e=r,Object.entries(e).forEach((e=>{let[r,t]=e;S(r,t)}))),A()}),[r,i,t,S,A,k,o]);const P=function(e,r,a,d,o){let s=arguments.length>5&&void 0!==arguments[5]&&arguments[5];return(0,g.jsx)(p.eu,{name:e,label:r,InputLabelProps:{shrink:!0},menus:a,onChange:o,...d&&{required:!0},...t||i?{disable:!0}:{},allowClear:s})},I=function(e,r,a,d){let o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return(0,g.jsx)(p.o3,{name:e,type:a,label:r,InputLabelProps:{shrink:o},...d&&{required:!0},...t?{disabled:!0}:i?{disabled:!1}:{}})};return(0,g.jsx)(g.Fragment,{children:(0,g.jsx)(p.Op,{methods:y,onSubmit:x((async e=>{let t;if(t=i?await(0,j.default)("/project-master-maker-lov-update",{method:"PUT",body:e,params:r.id}):await(0,j.default)("/project-master-maker-lov-form",{method:"POST",body:e}),t.success){const e=i?"Project Master Maker LOV updated successfully!":"Project Master Maker LOV added successfully!";(0,v.A)(e,{variant:"success",autoHideDuration:1e4}),d(),Y()}else{var a,o;(0,v.A)((null===(a=t)||void 0===a||null===(o=a.error)||void 0===o?void 0:o.message)||"Operation failed. Please try again.",{variant:"error"})}})),children:(0,g.jsx)(h.A,{title:(t?"View ":i?"Update ":"Add ")+"Project Master LOV",sx:{mb:2},children:(0,g.jsxs)(u.Ay,{container:!0,spacing:4,children:[(0,g.jsx)(u.Ay,{item:!0,md:3,xl:2,children:P("projectId","Project Name",n,!0,(e=>{var r;s(null===e||void 0===e||null===(r=e.target)||void 0===r?void 0:r.value)}))}),(0,g.jsx)(u.Ay,{item:!0,md:3,xl:2,children:P("masterId","Master Name",f,!0,(e=>{var r;R(null===e||void 0===e||null===(r=e.target)||void 0===r?void 0:r.value)}),!0)}),(0,g.jsx)(u.Ay,{item:!0,md:3,xl:2,children:I("name","LOV","text",!0)}),(0,g.jsx)(u.Ay,{item:!0,md:3,xl:2,children:I("code","Code","text",!0)}),(0,g.jsx)(u.Ay,{item:!0,md:3,xl:2,children:I("description","Description","text",!1)}),(0,g.jsx)(u.Ay,{item:!0,md:12,sx:{display:"flex",justifyContent:"flex-end"},children:t?(0,g.jsx)(l.A,{onClick:k,size:"small",variant:"outlined",color:"primary",children:"Back"}):i?(0,g.jsxs)(u.Ay,{item:!0,sx:{display:"flex",gap:"20px"},children:[(0,g.jsx)(l.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Update"}),(0,g.jsx)(l.A,{onClick:k,size:"small",variant:"outlined",color:"primary",children:"Back"})]}):(0,g.jsx)(l.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Save"})})]})})})})};var f=t(60209),Y=t(99635),y=t(89649),x=t(64499),S=t(29024),A=t(39225),M=t(30423),k=t(65920),P=t(52867);const I=()=>{var e;const{paginations:{pageSize:r,pageIndex:t,forceUpdate:u},refreshPagination:l,setPageIndex:c,setPageSize:m}=(0,y.A)(),{searchString:q,setSearchString:p,accessorsRef:h,setAccessors:b,forceSearch:I,searchStringTrimmed:w}=(0,A.A)(),z=(0,d.wA)(),[E,C]=(0,a.useState)(""),[O,L]=(0,a.useState)(""),[$,D]=(0,a.useState)(!1),[N,T]=(0,a.useState)(!1),[_,H]=(0,a.useState)(!1),[B,V]=(0,a.useState)(null),[Z,U]=(0,a.useState)(null),[F,W]=(0,a.useState)(null),[Q,G]=(0,a.useState)(1),[J,K]=(0,a.useState)(null),[X,ee]=(0,a.useState)(!1),[re,te]=(0,a.useState)(!1),[ae,ie]=(0,a.useState)(null);(0,a.useEffect)((()=>{z((0,S.uiG)())}),[z]),(0,a.useEffect)((()=>{null!==B&&void 0!==B&&B.id&&z((0,o.VA)({pageIndex:t,pageSize:r,listType:Q,recordId:null===B||void 0===B?void 0:B.id}))}),[z,t,r,u,Q,B]),(0,a.useEffect)((()=>{z((0,S.ZwA)({selectedProject:E}))}),[z,E]);const{filterObjectForApi:de}=(0,M.bZ)(),oe=(0,k.A)(de),se=(0,k.A)(ae);(0,a.useEffect)((()=>{[[oe,de],[se,ae]].some(P.$H)?l():z((0,o.Gv)({pageIndex:t,pageSize:r,listType:Q,...w&&{searchString:w,accessors:JSON.stringify(h.current)},sortBy:null===ae||void 0===ae?void 0:ae[0],sortOrder:null===ae||void 0===ae?void 0:ae[1],selectedProjectMaster:O,filterObject:de}))}),[z,t,r,Q,O,u,w,ae,h,I,l,oe,de,se]);const{projectsDropdown:ne}=(0,n.Y)(),ue=null===ne||void 0===ne?void 0:ne.projectsDropdownObject,{masterMakerProjects:le}=(0,s.j)(),ce=(null===le||void 0===le||null===(e=le.masterMakerProjectsObject)||void 0===e?void 0:e.rows)||[],{masterMakersLovsList:me,projectMasterMakerLovHistory:qe}=(0,f.k)(),{data:je,count:pe}=(0,a.useMemo)((()=>{var e,r;return{data:(null===(e=me.projectMasterMakersListObject)||void 0===e?void 0:e.rows)||[],count:(null===(r=me.projectMasterMakersListObject)||void 0===r?void 0:r.count)||0,isLoading:me.loading||!1}}),[me]),{historyData:he,historyCounts:be}=(0,a.useMemo)((()=>{var e,r;return{historyData:(null===(e=qe.projectMasterMakerLovHistoryObject)||void 0===e?void 0:e.rows)||[],historyCounts:(null===(r=qe.projectMasterMakerLovHistoryObject)||void 0===r?void 0:r.count)||0,isLoading:qe.loading||!1}}),[qe]),ve=(0,a.useMemo)((()=>[{Header:"Master Name",accessor:"project_master_maker.name"},{Header:"LOV Name",accessor:"name",filterProps:{tableName:"project_master_maker_lovs",getColumn:"name",customAccessor:"name",projectId:E,masterId:O}},{Header:"LOV Code",accessor:"code",filterProps:{tableName:"project_master_maker_lovs",getColumn:"code",customAccessor:"code",projectId:E,masterId:O}},{Header:"Description",accessor:"description",filterProps:{tableName:"project_master_maker_lovs",getColumn:"description",customAccessor:"description",projectId:E,masterId:O}},{Header:"Updated On",accessor:"updatedAt"},{Header:"Updated By",accessor:"updated.name",filterProps:{tableName:"project_master_maker_lovs",getColumn:"updated_by",customAccessor:"updatedBy",projectId:E,masterId:O}},{Header:"Created On",accessor:"createdAt"},{Header:"Created By",accessor:"created.name",filterProps:{tableName:"project_master_maker_lovs",getColumn:"created_by",customAccessor:"createdBy",projectId:E,masterId:O}}]),[E,O]),ge=()=>{ee(!1),te(!1),K(null)};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(R,{refreshPagination:l,selectedProject:E,setSelectedProject:C,selectedProjectMaster:O,setSelectedProjectMaster:L,setRefresh:ge,projectData:ue,projectMastersData:ce,...J&&{data:J},...X&&{view:X,update:!1},...re&&{update:re,view:!1}}),(0,g.jsx)(Y.default,{hideAddButton:!0,data:je,columns:ve,count:pe,setPageIndex:c,setPageSize:m,pageIndex:t,pageSize:r,handleRowDelete:e=>{U(e),D(!0)},handleRowRestore:async e=>{W(e),T(!0)},handleRowUpdate:e=>{C(ue[0].id),L(e.masterId),te(!0),ee(!1),K(e)},handleRowHistory:e=>{V(e),H(!0)},handleRowView:e=>{C(ue[0].id),L(e.masterId),ee(!0),te(!1),K(e)},hideImportButton:!1,listType:Q,setListType:e=>{G(e),ge()},searchConfig:{searchString:q,searchStringTrimmed:w,setSearchString:p,setAccessors:b},sortConfig:{sort:ae,setSort:ie},importConfig:{apiBody:{tableName:"project_master_maker_lovs",projectMasterMakerLov:{projectId:E,masterId:O}}},exportConfig:{tableName:"project_master_maker_lovs",fileName:"project-master-lov",apiQuery:{listType:Q,masterId:O,filterObject:de}}}),(0,g.jsx)(x.A,{open:$,handleClose:()=>D(!1),handleConfirm:async()=>{const e=await(0,j.default)("/delete-project-master-maker-lov",{method:"DELETE",params:Z});var r;e.success?(l(),D(!1)):(0,v.A)(null===e||void 0===e||null===(r=e.error)||void 0===r?void 0:r.message)},title:"Confirm Delete",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,g.jsx)(x.A,{open:N,handleClose:()=>T(!1),handleConfirm:async()=>{const e={...F,isActive:"1"};(await(0,j.default)("/project-master-maker-lov-update",{method:"PUT",body:e,params:e.id})).success&&(l(),T(!1))},title:"Confirm Restore",message:"Are you sure you want to restore?",confirmBtnTitle:"Restore"}),(0,g.jsx)(i.A,{open:_,onClose:()=>H(!1),scroll:"paper",disableEscapeKeyDown:!0,maxWidth:"lg",children:(0,g.jsx)(Y.default,{isHistory:!0,title:null===B||void 0===B?void 0:B.name,data:he,columns:ve,count:be,hideActions:!0,hideSearch:!0,hideAddButton:!0,hideExportButton:!0,setPageIndex:c,setPageSize:m,pageIndex:t,pageSize:r})})]})}},60209:(e,r,t)=>{t.d(r,{k:()=>d});var a=t(9950),i=t(27081);const d=()=>{const[e,r]=(0,a.useState)({projectMasterMakerLovsObject:{},error:"",loading:!0}),[t,d]=(0,a.useState)({projectMasterMakersListObject:[],error:"",loading:!0}),[o,s]=(0,a.useState)({projectMasterMakerLovHistoryObject:{},error:"",loading:!0}),n=(0,i.d4)((e=>e.projectMasterMakerLov||{})),u=(0,i.d4)((e=>e.masterMakersLovsList||{})),l=(0,i.d4)((e=>e.projectMasterMakerLovHistory||{}));return(0,a.useEffect)((()=>{r((e=>({...e,...n})))}),[n]),(0,a.useEffect)((()=>{d((e=>({...e,...u})))}),[u]),(0,a.useEffect)((()=>{s((e=>({...e,...l})))}),[l]),{projectMasterMakerLovs:e,masterMakersLovsList:t,projectMasterMakerLovHistory:o}}},23882:(e,r,t)=>{t.d(r,{j:()=>d});var a=t(9950),i=t(27081);const d=()=>{const[e,r]=(0,a.useState)({projectMasterMakerObject:{},error:"",loading:!0}),[t,d]=(0,a.useState)({masterMakerProjectsObject:[],error:"",loading:!0}),[o,s]=(0,a.useState)({projectMasterMakerHistoryObject:{},error:"",loading:!0}),n=(0,i.d4)((e=>e.projectMasterMaker||{})),u=(0,i.d4)((e=>e.masterMakerProjects||{})),l=(0,i.d4)((e=>e.projectMasterMakerHistory||{}));return(0,a.useEffect)((()=>{r((e=>({...e,...n})))}),[n]),(0,a.useEffect)((()=>{d((e=>({...e,...u})))}),[u]),(0,a.useEffect)((()=>{s((e=>({...e,...l})))}),[l]),{projectMasterMakers:e,masterMakerProjects:t,projectMasterMakerHistory:o}}},80733:(e,r,t)=>{t.d(r,{Y:()=>d});var a=t(9950),i=t(27081);const d=()=>{const[e,r]=(0,a.useState)({projectsObject:{},error:"",loading:!0}),[t,d]=(0,a.useState)({projectDetailsObject:{},error:"",loading:!0}),[o,s]=(0,a.useState)({projectsDropdownObject:[],error:"",loading:!0}),[n,u]=(0,a.useState)({projectsDropdownObject:[],error:"",loading:!0}),[l,c]=(0,a.useState)({projectsObject:[],error:"",loading:!0}),[m,q]=(0,a.useState)({projectsHistoryObject:{},error:"",loading:!0}),j=(0,i.d4)((e=>e.projects||{})),p=(0,i.d4)((e=>e.projectDetails||{})),h=(0,i.d4)((e=>e.projectsDropdown||[])),b=(0,i.d4)((e=>e.allProjectsDropdown||[])),v=(0,i.d4)((e=>e.projectsForRoleOrUser||[])),g=(0,i.d4)((e=>e.projectsHistory||{}));return(0,a.useEffect)((()=>{r((e=>({...e,...j})))}),[j]),(0,a.useEffect)((()=>{d((e=>({...e,...p})))}),[p]),(0,a.useEffect)((()=>{s((e=>({...e,...h})))}),[h]),(0,a.useEffect)((()=>{u((e=>({...e,...b})))}),[b]),(0,a.useEffect)((()=>{c((e=>({...e,...v})))}),[v]),(0,a.useEffect)((()=>{q((e=>({...e,...g})))}),[g]),{projects:e,projectsDropdown:o,allProjectsDropdown:n,projectsHistory:m,projectsGovernForRoleOrUser:l,projectDetails:t}}},13239:(e,r,t)=>{t.d(r,{A:()=>n});var a=t(89379),i=t(9950);const d={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"}}]},name:"check",theme:"outlined"};var o=t(14840),s=function(e,r){return i.createElement(o.A,(0,a.A)((0,a.A)({},e),{},{ref:r,icon:d}))};const n=i.forwardRef(s)},26592:(e,r,t)=>{var a=t(24994);r.A=void 0;var i=a(t(79526)),d=t(44414);r.A=(0,i.default)((0,d.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"}),"DeleteOutline")},36089:(e,r,t)=>{var a=t(24994);r.A=void 0;var i=a(t(79526)),d=t(44414);r.A=(0,i.default)((0,d.jsx)("path",{d:"m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"}),"EditOutlined")}}]);