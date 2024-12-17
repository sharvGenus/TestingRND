"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[4235,5406],{64499:(e,r,i)=>{i.d(r,{A:()=>R});var t=i(9950),a=i(65669),d=i(43263),u=i(57191),n=i(95537),l=i(67535),o=i(87233),s=i(44414);R.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const q={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},c={display:"flex",flexDirection:"row",padding:"15px 0"},m={display:"flex",justifyContent:"flex-end",gap:2},j={marginTop:2,display:"flex",fontSize:"14px"};function R(e){let{open:r,handleClose:i,title:R,message:p,closeBtnTitle:b,confirmBtnTitle:Y,handleConfirm:h,confirmColor:g}=e;const[f,v]=(0,t.useState)(null);return(0,t.useEffect)((()=>{v(null)}),[r]),(0,s.jsx)("div",{children:(0,s.jsx)(a.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:r,closeAfterTransition:!0,slots:{backdrop:d.A},slotProps:{backdrop:{timeout:500}},children:(0,s.jsx)(u.A,{in:r,children:(0,s.jsxs)(n.A,{sx:q,children:[(0,s.jsx)(o.A,{id:"transition-modal-title",variant:"h4",children:R}),(0,s.jsx)(o.A,{id:"transition-modal-title",variant:"h6",sx:c,children:p}),(0,s.jsxs)(n.A,{sx:m,children:[!!i&&(0,s.jsx)(l.A,{onClick:i,size:"small",variant:"outlined",color:"primary",children:b}),!!h&&(0,s.jsx)(l.A,{onClick:h,size:"small",variant:"contained",color:g||"error",children:Y})]}),f&&(0,s.jsx)(o.A,{variant:"p",color:"red",sx:j,children:f})]})})})})}},84601:(e,r,i)=>{i.d(r,{A:()=>o});var t=i(60666);const a=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],d=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],u=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},n=["nothing","",()=>!0],l=function(e,r,i){let t=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const a=new Date(e),d=new Date(r),u=new Date(i);return t?u<=a&&a<=d:u<=a&&a>=d},o={allowedColumns:t.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:t.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:t.Yj().required("Required").nullable(),formType:t.Yj().required("Required").nullable(),taskType:t.Yj().required("Required").nullable(),code:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:t.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:t.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:t.Yj().required("Required"),title:t.Yj().required("Required").nullable(),office:t.Yj().required("Required").nullable(),masterCode:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:t.Yj().required("Required"),gstNumber:t.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:t.Yj().required("Required"),storePhoto:t.Yj().required("Required"),email:t.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:t.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:t.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:t.Yj().required("Required"),nother:t.Yj().nullable().required("Required"),otherArray:t.YO().min(1,"Please select atleast one field"),areaLevel:t.YO().min(1,"Please select atleast one level."),formTitle:t.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:t.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:t.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:t.Yj().required(" "),telephone:t.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:t.Yj().required("Required"),registeredAddress:t.Yj().required("Required"),quantity:t.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:t.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:t.ai().test(...u()).test(...a).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t.ai().test(...r?u():n).test(...a).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:t.Yj().required("Required"),state:t.Yj().required("Required"),city:t.Yj().required("Required"),registeredCountry:t.Yj().required("Required"),registeredState:t.Yj().required("Required"),registeredCity:t.Yj().required("Required"),organizationType:t.Yj().nullable().required("Required"),organizationCode:t.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:t.Yj().nullable().required("Required"),organizationLocationId:t.Yj().required("Required"),integrationId:t.Yj().required("Required"),firm:t.Yj().required("Required"),movementType:t.Yj().required("Required"),supplier:t.Yj().required("Required"),masterMaker:t.Yj().required("Required"),projectMasterMaker:t.Yj().required("Required"),lov:t.Yj().required("Required"),date:t.Yj().required("Required"),fromDate:t.Yj().required("Required"),toDate:t.Yj().when("fromDate",{is:e=>!!e,then:t.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:t.Yj().required("Required"),challanNumber:t.Yj().required("Required"),poNumber:t.Yj().required("Required"),workOrderNumber:t.Yj().required("Required"),receivingStore:t.Yj().required("Required"),uom:t.Yj().required("Required"),project:t.Yj().nullable().required("Required"),projectArr:t.YO().of(t.gl()).nullable().required("Required").min(1,"Required"),organizationArr:t.YO().of(t.gl()).nullable().required("Required").min(1,"Required"),accessProject:t.Yj().nullable().required("Required"),rate:t.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:t.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:t.Yj().required("Required"),rangeTo:t.Yj().required("Required"),requiredWithLabel:()=>t.Yj().nullable().required("Required"),requiredWithNonZero:e=>t.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>t.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:t.ai().required("Required"),isSerialize:t.Yj().required("Please select a checkbox"),vehicleNumber:t.Yj().required("Required"),vehicleNumberOptional:t.Yj().nullable(),inventoryNameOptional:t.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:t.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:t.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:t.Yj().required("Required"),eWayBillNumber:t.Yj().required("Required"),eWayBillDate:t.Yj().required("Required"),actualReceiptDate:t.Yj().when("eWayBillDate",{is:e=>!!e,then:t.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:t.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:t.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:t.Yj().nullable().required("Required"),placeOfTransfer:t.Yj().required("Required"),contractorStore:t.Yj().nullable().required("Required"),projectSiteStoreLocation:t.Yj().required("Required"),contractorStoreLocation:t.Yj().nullable().required("Required"),contractorEmployee:t.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>t.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:t.Yj().required("Required"),longDescription:t.Yj().required("Required"),hsnCode:t.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:t.Yj().required("Required"),store:t.Yj().nullable().required("Required"),accessStore:t.Yj().nullable().required("Required"),series:t.Yj().required("Required"),material:t.Yj().required("Required"),materialType:t.Yj().required("Required"),materialCode:t.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:t.Yj().nullable().required("Required"),accessOrganizationId:t.Yj().nullable().required("Required"),company:t.Yj().required("Required"),contractor:t.Yj().nullable().required("Required"),contractorId:t.Yj().required("Required"),fromInstaller:t.Yj().nullable().required("Required"),toInstaller:t.Yj().nullable().required("Required"),fromStoreLocationId:t.Yj().nullable().required("Required"),toStoreLocationId:t.Yj().nullable().required("Required"),storeLocationId:t.Yj().nullable().required("Required"),installerStoreLocationId:t.Yj().nullable().required("Required"),accessStoreLocationId:t.Yj().nullable().required("Required"),fromStore:t.Yj().nullable().required("Required"),toStore:t.Yj().required("Required"),transporterName:t.Yj().required("Required"),customerSiteStoreId:t.Yj().nullable().required("Required"),toCustomerId:t.Yj().nullable().required("Required"),financialYear:t.Yj().required("Required"),user:t.Yj().required("Required"),accessUser:t.Yj().nullable().required("Required"),rightsFor:t.Yj().nullable().required("Required"),gaaLevelId:t.Yj().nullable().required("Required"),networkLevelId:t.Yj().nullable().required("Required"),server:t.Yj().required("Required"),port:t.Yj().required("Required"),encryption:t.Yj().required("Required"),requisitionNumber:t.Yj().nullable().required("Required"),password:t.Yj().required("Required"),transaction:t.Yj().nullable().required("Required"),serviceCenter:t.Yj().nullable().required("Required"),scrapLocation:t.Yj().nullable().required("Required"),effectiveFrom:t.Yj().required("Required"),effectiveTo:t.Yj().required("Required"),displayName:t.Yj().required("Required"),templateName:t.Yj().required("Required"),subject:t.Yj().required("Required"),from:t.Yj().required("Required"),to:t.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:t.Yj().required("Required"),attachmentsWhenIsAuthorized:t.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:t.Yj().nullable().required("Required")}),requestNumber:t.Yj().required("Required"),remarks:t.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:t.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:t.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:t.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>t.Yj().required("Required"),startDateRange:(e,r,i)=>t.Yj().required("Required").test("date-comparison",`${r} must be >= ${i}`,(function(r){return function(e,r){let i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const t=new Date(e),a=new Date(r);return i?t<=a:t>=a}(r,e,!1)})),endDateRange:(e,r,i,a,d,u)=>t.Yj().required("Required").test("date-comparison",`${i} must be <= ${a} and >= ${d}`,(function(i){return l(i,e,r,!u)})),endDateRangeMax:(e,r,i,a,d,u)=>t.Yj().required("Required").test("date-comparison",`${i} must be >= ${a} and >= ${d}`,(function(i){return l(i,e,r,!u)})),month:e=>t.ai().test(...u(e)).test(...d).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,i)=>t.ai().test(...u(r)).test(...d).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${i}`),checkQty:e=>t.ai().test(...u(e)).test(...a).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?t.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):t.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:t.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},89649:(e,r,i)=>{i.d(r,{A:()=>d});var t=i(9950),a=i(80415);function d(){const[e,r]=(0,t.useState)({pageIndex:a.j7.pageIndex,pageSize:a.j7.pageSize,forceUpdate:!0}),i=(0,t.useCallback)((function(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.pageIndex,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.pageSize;r((e=>({pageIndex:i,pageSize:t,forceUpdate:!e.forceUpdate})))}),[e]),d=(0,t.useCallback)((()=>{r((e=>({pageIndex:a.j7.pageIndex,pageSize:a.j7.pageSize,forceUpdate:!e.forceUpdate})))}),[]);return{paginations:e,setPageIndex:e=>r((r=>({...r,pageIndex:e,forceUpdate:!r.forceUpdate}))),setPageSize:e=>r((r=>({pageIndex:a.j7.pageIndex,pageSize:e,forceUpdate:!r.forceUpdate}))),refreshPagination:d,setPaginationsFunctions:i}}},39225:(e,r,i)=>{i.d(r,{A:()=>u});var t=i(41397),a=i.n(t),d=i(9950);const u=e=>{const{isFcMode:r}=e||{},[i,t]=(0,d.useState)(void 0),[u,n]=(0,d.useState)(!1),l=(0,d.useRef)([]),o=(0,d.useCallback)((e=>{const t=l.current;l.current=e,i&&(r||a().isEqual(e,t)||n((e=>!e)))}),[r,i]),s=(0,d.useMemo)((()=>null===i||void 0===i?void 0:i.trim()),[i]);return{searchString:i,searchStringTrimmed:s,forceSearch:u,accessorsRef:l,setSearchString:t,setAccessors:o}}},80733:(e,r,i)=>{i.d(r,{Y:()=>d});var t=i(9950),a=i(27081);const d=()=>{const[e,r]=(0,t.useState)({projectsObject:{},error:"",loading:!0}),[i,d]=(0,t.useState)({projectDetailsObject:{},error:"",loading:!0}),[u,n]=(0,t.useState)({projectsDropdownObject:[],error:"",loading:!0}),[l,o]=(0,t.useState)({projectsDropdownObject:[],error:"",loading:!0}),[s,q]=(0,t.useState)({projectsObject:[],error:"",loading:!0}),[c,m]=(0,t.useState)({projectsHistoryObject:{},error:"",loading:!0}),j=(0,a.d4)((e=>e.projects||{})),R=(0,a.d4)((e=>e.projectDetails||{})),p=(0,a.d4)((e=>e.projectsDropdown||[])),b=(0,a.d4)((e=>e.allProjectsDropdown||[])),Y=(0,a.d4)((e=>e.projectsForRoleOrUser||[])),h=(0,a.d4)((e=>e.projectsHistory||{}));return(0,t.useEffect)((()=>{r((e=>({...e,...j})))}),[j]),(0,t.useEffect)((()=>{d((e=>({...e,...R})))}),[R]),(0,t.useEffect)((()=>{n((e=>({...e,...p})))}),[p]),(0,t.useEffect)((()=>{o((e=>({...e,...b})))}),[b]),(0,t.useEffect)((()=>{q((e=>({...e,...Y})))}),[Y]),(0,t.useEffect)((()=>{m((e=>({...e,...h})))}),[h]),{projects:e,projectsDropdown:u,allProjectsDropdown:l,projectsHistory:c,projectsGovernForRoleOrUser:s,projectDetails:i}}},66450:(e,r,i)=>{i.d(r,{m:()=>d});var t=i(9950),a=i(27081);const d=()=>{const[e,r]=(0,t.useState)({qaMasterMakerObject:{},error:"",loading:!0}),[i,d]=(0,t.useState)({qaMasterMakerHistoryObject:{},error:"",loading:!0}),u=(0,a.d4)((e=>e.qaMasterMaker||{})),n=(0,a.d4)((e=>e.qaMasterMakerHistory||{}));return(0,t.useEffect)((()=>{r((e=>({...e,...u})))}),[u]),(0,t.useEffect)((()=>{d((e=>({...e,...n})))}),[n]),{masterMakerQAs:e,qaMasterMakerHistory:i}}},13239:(e,r,i)=>{i.d(r,{A:()=>l});var t=i(89379),a=i(9950);const d={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"}}]},name:"check",theme:"outlined"};var u=i(14840),n=function(e,r){return a.createElement(u.A,(0,t.A)((0,t.A)({},e),{},{ref:r,icon:d}))};const l=a.forwardRef(n)},26592:(e,r,i)=>{var t=i(24994);r.A=void 0;var a=t(i(79526)),d=i(44414);r.A=(0,a.default)((0,d.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"}),"DeleteOutline")},36089:(e,r,i)=>{var t=i(24994);r.A=void 0;var a=t(i(79526)),d=i(44414);r.A=(0,a.default)((0,d.jsx)("path",{d:"m14.06 9.02.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"}),"EditOutlined")}}]);