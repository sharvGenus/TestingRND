"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[2109,2480],{42480:(e,r,t)=>{t.r(r),t.d(r,{default:()=>g});var i=t(43858),a=t(72179),n=t(12257),o=t(67535),d=t(95537),u=t(14341),l=t(9950),s=t(9449),c=t(62054),q=t(44414);const m=e=>{var r=e[0].name||e[0].fileName;return r=r.length>10?`${r.slice(0,7)}...${r.slice(-9)}`:r,1===e.length?r:`${r} (+${e.length-1} other)`},j={display:"flex",justifyContent:"center",alignItems:"center",border:"1px solid #1677FF",color:"#1677FF",borderRadius:5,padding:"5px 10px",width:123,cursor:"pointer"},p={margin:"auto 0 auto 10px",cursor:"pointer",color:"rgb(51, 126, 232)"},b={width:"100%","& .MuiFormHelperText-root":{marginLeft:"1px",marginTop:"7px",marginBottom:"10px"},"& .MuiInputBase-root":{display:"none"}},g=e=>{let{label:r,name:t,accept:g,value:R,setValue:Y,multiple:h=!1,required:f=!1,...v}=e;const{control:y}=(0,s.xW)(),[x,z]=(0,l.useState)(null);(0,l.useEffect)((()=>{R&&z(R)}),[R]);const S=()=>{z(null),Y(t,"")},A=(e,r)=>{const i=r.target.files;z(i);const a=Object.values(i).map((e=>new Promise(((r,t)=>{const i=new FileReader;i.onloadend=()=>r({action:"create",fileName:e.name,fileData:i.result}),i.onerror=t,i.readAsDataURL(e)}))));return Promise.all(a).then((e=>{Y(`${t}-paths`,e)})).catch((e=>{S(),(0,c.A)(e.message||"Something wrong happend while picking the file(s)",{variant:"error"})})),e(r)};return y?(0,q.jsx)(s.xI,{name:t,control:y,render:e=>{let{field:{onChange:o,...l},fieldState:{error:s}}=e;return(0,q.jsx)(n.A,{spacing:1,mt:1,children:(0,q.jsxs)(d.A,{children:[(0,q.jsxs)(d.A,{display:"flex",children:[(0,q.jsx)("label",{htmlFor:`${t}-file`,children:(0,q.jsxs)("div",{style:j,children:[(0,q.jsx)(i.A,{}),"\xa0",r,f&&" *"]})}),x&&x.length>0&&(0,q.jsx)(a.A,{onClick:S,style:p})]}),(0,q.jsx)(u.A,{...l,id:`${t}-file`,name:t,helperText:(null===s||void 0===s?void 0:s.message)||x&&x.length>0&&m(x),error:!!s,sx:b,onChange:A.bind(void 0,o),inputProps:{multiple:h,accept:g},type:"file",...v})]})})}}):(0,q.jsx)(n.A,{spacing:1,children:f?(0,q.jsxs)(o.A,{size:"small",variant:"outlined",htmlFor:"files",color:"primary",required:!0,children:[(0,q.jsx)(i.A,{}),"\xa0",r]}):(0,q.jsx)(o.A,{size:"small",variant:"outlined",htmlFor:"files",color:"primary",children:r})})}},84601:(e,r,t)=>{t.d(r,{A:()=>l});var i=t(60666);const a=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],n=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],o=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},d=["nothing","",()=>!0],u=function(e,r,t){let i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const a=new Date(e),n=new Date(r),o=new Date(t);return i?o<=a&&a<=n:o<=a&&a>=n},l={allowedColumns:i.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:i.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:i.Yj().required("Required").nullable(),formType:i.Yj().required("Required").nullable(),taskType:i.Yj().required("Required").nullable(),code:i.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:i.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:i.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:i.Yj().required("Required"),title:i.Yj().required("Required").nullable(),office:i.Yj().required("Required").nullable(),masterCode:i.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:i.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:i.Yj().required("Required"),gstNumber:i.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:i.Yj().required("Required"),storePhoto:i.Yj().required("Required"),email:i.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:i.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:i.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:i.Yj().required("Required"),nother:i.Yj().nullable().required("Required"),otherArray:i.YO().min(1,"Please select atleast one field"),areaLevel:i.YO().min(1,"Please select atleast one level."),formTitle:i.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:i.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:i.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:i.Yj().required(" "),telephone:i.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:i.Yj().required("Required"),registeredAddress:i.Yj().required("Required"),quantity:i.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:i.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:i.ai().test(...o()).test(...a).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return i.ai().test(...r?o():d).test(...a).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:i.Yj().required("Required"),state:i.Yj().required("Required"),city:i.Yj().required("Required"),registeredCountry:i.Yj().required("Required"),registeredState:i.Yj().required("Required"),registeredCity:i.Yj().required("Required"),organizationType:i.Yj().nullable().required("Required"),organizationCode:i.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:i.Yj().nullable().required("Required"),organizationLocationId:i.Yj().required("Required"),integrationId:i.Yj().required("Required"),firm:i.Yj().required("Required"),movementType:i.Yj().required("Required"),supplier:i.Yj().required("Required"),masterMaker:i.Yj().required("Required"),projectMasterMaker:i.Yj().required("Required"),lov:i.Yj().required("Required"),date:i.Yj().required("Required"),fromDate:i.Yj().required("Required"),toDate:i.Yj().when("fromDate",{is:e=>!!e,then:i.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:i.Yj().required("Required"),challanNumber:i.Yj().required("Required"),poNumber:i.Yj().required("Required"),workOrderNumber:i.Yj().required("Required"),receivingStore:i.Yj().required("Required"),uom:i.Yj().required("Required"),project:i.Yj().nullable().required("Required"),projectArr:i.YO().of(i.gl()).nullable().required("Required").min(1,"Required"),organizationArr:i.YO().of(i.gl()).nullable().required("Required").min(1,"Required"),accessProject:i.Yj().nullable().required("Required"),rate:i.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:i.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:i.Yj().required("Required"),rangeTo:i.Yj().required("Required"),requiredWithLabel:()=>i.Yj().nullable().required("Required"),requiredWithNonZero:e=>i.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>i.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:i.ai().required("Required"),isSerialize:i.Yj().required("Please select a checkbox"),vehicleNumber:i.Yj().required("Required"),vehicleNumberOptional:i.Yj().nullable(),inventoryNameOptional:i.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:i.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:i.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:i.Yj().required("Required"),eWayBillNumber:i.Yj().required("Required"),eWayBillDate:i.Yj().required("Required"),actualReceiptDate:i.Yj().when("eWayBillDate",{is:e=>!!e,then:i.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:i.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:i.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:i.Yj().nullable().required("Required"),placeOfTransfer:i.Yj().required("Required"),contractorStore:i.Yj().nullable().required("Required"),projectSiteStoreLocation:i.Yj().required("Required"),contractorStoreLocation:i.Yj().nullable().required("Required"),contractorEmployee:i.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>i.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:i.Yj().required("Required"),longDescription:i.Yj().required("Required"),hsnCode:i.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:i.Yj().required("Required"),store:i.Yj().nullable().required("Required"),accessStore:i.Yj().nullable().required("Required"),series:i.Yj().required("Required"),material:i.Yj().required("Required"),materialType:i.Yj().required("Required"),materialCode:i.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:i.Yj().nullable().required("Required"),accessOrganizationId:i.Yj().nullable().required("Required"),company:i.Yj().required("Required"),contractor:i.Yj().nullable().required("Required"),contractorId:i.Yj().required("Required"),fromInstaller:i.Yj().nullable().required("Required"),toInstaller:i.Yj().nullable().required("Required"),fromStoreLocationId:i.Yj().nullable().required("Required"),toStoreLocationId:i.Yj().nullable().required("Required"),storeLocationId:i.Yj().nullable().required("Required"),installerStoreLocationId:i.Yj().nullable().required("Required"),accessStoreLocationId:i.Yj().nullable().required("Required"),fromStore:i.Yj().nullable().required("Required"),toStore:i.Yj().required("Required"),transporterName:i.Yj().required("Required"),customerSiteStoreId:i.Yj().nullable().required("Required"),toCustomerId:i.Yj().nullable().required("Required"),financialYear:i.Yj().required("Required"),user:i.Yj().required("Required"),accessUser:i.Yj().nullable().required("Required"),rightsFor:i.Yj().nullable().required("Required"),gaaLevelId:i.Yj().nullable().required("Required"),networkLevelId:i.Yj().nullable().required("Required"),server:i.Yj().required("Required"),port:i.Yj().required("Required"),encryption:i.Yj().required("Required"),requisitionNumber:i.Yj().nullable().required("Required"),password:i.Yj().required("Required"),transaction:i.Yj().nullable().required("Required"),serviceCenter:i.Yj().nullable().required("Required"),scrapLocation:i.Yj().nullable().required("Required"),effectiveFrom:i.Yj().required("Required"),effectiveTo:i.Yj().required("Required"),displayName:i.Yj().required("Required"),templateName:i.Yj().required("Required"),subject:i.Yj().required("Required"),from:i.Yj().required("Required"),to:i.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:i.Yj().required("Required"),attachmentsWhenIsAuthorized:i.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:i.Yj().nullable().required("Required")}),requestNumber:i.Yj().required("Required"),remarks:i.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:i.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:i.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:i.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>i.Yj().required("Required"),startDateRange:(e,r,t)=>i.Yj().required("Required").test("date-comparison",`${r} must be >= ${t}`,(function(r){return function(e,r){let t=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const i=new Date(e),a=new Date(r);return t?i<=a:i>=a}(r,e,!1)})),endDateRange:(e,r,t,a,n,o)=>i.Yj().required("Required").test("date-comparison",`${t} must be <= ${a} and >= ${n}`,(function(t){return u(t,e,r,!o)})),endDateRangeMax:(e,r,t,a,n,o)=>i.Yj().required("Required").test("date-comparison",`${t} must be >= ${a} and >= ${n}`,(function(t){return u(t,e,r,!o)})),month:e=>i.ai().test(...o(e)).test(...n).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,t)=>i.ai().test(...o(r)).test(...n).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${t}`),checkQty:e=>i.ai().test(...o(e)).test(...a).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?i.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):i.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:i.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},92109:(e,r,t)=>{t.r(r),t.d(r,{default:()=>h});var i=t(9950),a=t(27081),n=t(4139),o=t(67535),d=t(60666),u=t(9449),l=t(26473),s=t(96951),c=t(14351),q=t(84601),m=t(29024),j=t(52867),p=t(88848),b=t(80733),g=t(55519),R=t(42480),Y=t(44414);const h=()=>{var e;const r=(0,a.wA)(),t=(0,u.mN)({resolver:(0,l.t)(d.Ik().shape({projectId:q.A.project,organizationId:q.A.organizationId,limitQuantity:q.A.quantity})),defaultValues:{},mode:"all"}),{handleSubmit:h}=t,{projectsDropdown:f}=(0,b.Y)(),{masterMakerLovs:v}=(0,p.$)(),{organizationsDropdown:y}=(0,g.G)(),x=null===f||void 0===f?void 0:f.projectsDropdownObject,z=null===(e=v.masterMakerLovsObject)||void 0===e?void 0:e.rows,S=null===y||void 0===y?void 0:y.organizationDropdownObject;(0,i.useEffect)((()=>{r((0,m.uiG)()),r((0,m._G1)())}),[r]),(0,i.useEffect)((()=>{r((0,m.d8s)((0,j.x)(z,"CONTRACTOR")))}),[r,z]);return(0,Y.jsx)(Y.Fragment,{children:(0,Y.jsx)(s.Op,{methods:t,onSubmit:h((async()=>{})),children:(0,Y.jsx)(c.A,{title:"Contractor Report",sx:{mb:2},children:(0,Y.jsxs)(n.Ay,{container:!0,spacing:4,children:[(0,Y.jsx)(n.Ay,{item:!0,md:3,xl:2,children:(0,Y.jsx)(s.eu,{name:"projectId",label:"Project",InputLabelProps:{shrink:!0},menus:x,required:!0})}),(0,Y.jsx)(n.Ay,{item:!0,md:3,xl:2,children:(0,Y.jsx)(s.eu,{name:"organizationId",label:"Contractor Name",InputLabelProps:{shrink:!0},menus:(0,j.HF)(S),required:!0})}),(0,Y.jsx)(n.Ay,{item:!0,md:3,xl:2,children:(0,Y.jsx)(s.o3,{name:"limitQuantity",label:"Limit Quantity",type:"number",InputLabelProps:{shrink:!0},required:!0})}),(0,Y.jsx)(n.Ay,{item:!0,md:3,xl:2,children:(0,Y.jsx)(s.o3,{name:"remarks",label:"Remarks",type:"text",InputLabelProps:{shrink:!0}})}),(0,Y.jsxs)(n.Ay,{container:!0,spacing:2,alignItems:"end",sx:{mt:2,ml:2},children:[(0,Y.jsx)(n.Ay,{item:!0,md:6,xs:6,sx:{display:"flex",justifyContent:"flex-start",gap:"20px"},children:(0,Y.jsx)(R.default,{name:"attachments",label:"Attachments"})}),(0,Y.jsx)(n.Ay,{item:!0,md:6,xs:6,sx:{display:"flex",justifyContent:"flex-end",gap:"20px",mb:"15px"},children:(0,Y.jsx)(o.A,{type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})]})]})})})})}},88848:(e,r,t)=>{t.d(r,{$:()=>n});var i=t(9950),a=t(27081);const n=()=>{const[e,r]=(0,i.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[t,n]=(0,i.useState)({masterMakerLovsObject:{},error:"",loading:!0}),[o,d]=(0,i.useState)({masterObject:[],error:"",loading:!0}),[u,l]=(0,i.useState)({masterObject:[],error:"",loading:!0}),[s,c]=(0,i.useState)({masterObject:[],error:"",loading:!0}),[q,m]=(0,i.useState)({currencyObject:[],error:"",loading:!0}),[j,p]=(0,i.useState)({gstStatusObject:[],error:"",loading:!0}),[b,g]=(0,i.useState)({paymentTermObject:[],error:"",loading:!0}),[R,Y]=(0,i.useState)({incotermsObject:[],error:"",loading:!0}),[h,f]=(0,i.useState)({titleObject:[],error:"",loading:!0}),[v,y]=(0,i.useState)({masterMakerLovHistoryObject:{},error:"",loading:!0}),x=(0,a.d4)((e=>e.masterMakerLov||{})),z=(0,a.d4)((e=>e.masterMakerLovList||{})),S=(0,a.d4)((e=>e.lovsForMasterName||[])),A=(0,a.d4)((e=>e.lovsForMasterNameSecond||[])),E=(0,a.d4)((e=>e.lovsForMasterNameThird||[])),w=(0,a.d4)((e=>e.currency||[])),L=(0,a.d4)((e=>e.gstStatus||[])),$=(0,a.d4)((e=>e.paymentTerm||[])),O=(0,a.d4)((e=>e.incoterms||[])),D=(0,a.d4)((e=>e.title||[])),k=(0,a.d4)((e=>e.masterMakerLovHistory||{}));return(0,i.useEffect)((()=>{r((e=>({...e,...x})))}),[x]),(0,i.useEffect)((()=>{n((e=>({...e,...z})))}),[z]),(0,i.useEffect)((()=>{d((e=>({...e,...S})))}),[S]),(0,i.useEffect)((()=>{l((e=>({...e,...A})))}),[A]),(0,i.useEffect)((()=>{c((e=>({...e,...E})))}),[E]),(0,i.useEffect)((()=>{m((e=>({...e,...w})))}),[w]),(0,i.useEffect)((()=>{p((e=>({...e,...L})))}),[L]),(0,i.useEffect)((()=>{g((e=>({...e,...$})))}),[$]),(0,i.useEffect)((()=>{Y((e=>({...e,...O})))}),[O]),(0,i.useEffect)((()=>{f((e=>({...e,...D})))}),[D]),(0,i.useEffect)((()=>{y((e=>({...e,...k})))}),[k]),{masterMakerLovs:e,masterMakerLovsList:t,masterMakerOrgType:o,masterMakerOrgTypeSecond:u,masterMakerOrgTypeThird:s,masterMakerCurrency:q,masterMakerGstStatus:j,masterMakerIncoterms:R,masterMakerPaymentTerm:b,masterMakerLovHistory:v,masterMakerTitle:h}}},55519:(e,r,t)=>{t.d(r,{G:()=>n});var i=t(9950),a=t(27081);const n=()=>{const[e,r]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[t,n]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[o,d]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[u,l]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[s,c]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[q,m]=(0,i.useState)({organizationLocationObject:{},error:"",loading:!0}),[j,p]=(0,i.useState)({organizationGetListObject:{},error:"",loading:!0}),[b,g]=(0,i.useState)({organizationDropdownObject:[],error:"",loading:!0}),[R,Y]=(0,i.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[h,f]=(0,i.useState)({organizationDropdownSecondObject:[],error:"",loading:!0}),[v,y]=(0,i.useState)({organizationLocationDropdownObject:[],error:"",loading:!0}),[x,z]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[S,A]=(0,i.useState)({organizationObject:{},error:"",loading:!0}),[E,w]=(0,i.useState)({organizationHistoryObject:{},error:"",loading:!0}),L=(0,a.d4)((e=>e.organization||[])),$=(0,a.d4)((e=>e.organizationAllData||[])),O=(0,a.d4)((e=>e.organizationAllDataSecond||[])),D=(0,a.d4)((e=>e.organizationLocationByParent||[])),k=(0,a.d4)((e=>e.organizationLocationByParentSecond||[])),P=(0,a.d4)((e=>e.organizationLocation||[])),M=(0,a.d4)((e=>e.organizationListData||[])),N=(0,a.d4)((e=>e.organizationList||[])),I=(0,a.d4)((e=>e.organizationDropdown||[])),T=(0,a.d4)((e=>e.organizationLocationDropdown||[])),C=(0,a.d4)((e=>e.organizationLocationDropdownSecond||[])),F=(0,a.d4)((e=>e.organizationDropdownSecond||[])),Z=(0,a.d4)((e=>e.organizationListSecond||[])),H=(0,a.d4)((e=>e.organizationHistory||[]));return(0,i.useEffect)((()=>{r((e=>({...e,...L})))}),[L]),(0,i.useEffect)((()=>{n((e=>({...e,...$})))}),[$]),(0,i.useEffect)((()=>{d((e=>({...e,...O})))}),[O]),(0,i.useEffect)((()=>{l((e=>({...e,...D})))}),[D]),(0,i.useEffect)((()=>{c((e=>({...e,...k})))}),[k]),(0,i.useEffect)((()=>{m((e=>({...e,...P})))}),[P]),(0,i.useEffect)((()=>{p((e=>({...e,...M})))}),[M]),(0,i.useEffect)((()=>{g((e=>({...e,...I})))}),[I]),(0,i.useEffect)((()=>{Y((e=>({...e,...T})))}),[T]),(0,i.useEffect)((()=>{y((e=>({...e,...C})))}),[C]),(0,i.useEffect)((()=>{f((e=>({...e,...F})))}),[F]),(0,i.useEffect)((()=>{z((e=>({...e,...N})))}),[N]),(0,i.useEffect)((()=>{A((e=>({...e,...Z})))}),[Z]),(0,i.useEffect)((()=>{w((e=>({...e,...H})))}),[H]),{organizations:e,organizationsAllData:t,organizationsAllDataSecond:o,organizationsLocByParent:u,organizationsLocByParentSecond:s,organizationsGetListData:j,organizationsDropdown:b,organizationsDropdownSecond:h,organizationsList:x,organizationsListSecond:S,organizationHistory:E,organizationsLocation:q,organizationsLocationDropdown:R,organizationsLocationDropdownSecond:v}}},80733:(e,r,t)=>{t.d(r,{Y:()=>n});var i=t(9950),a=t(27081);const n=()=>{const[e,r]=(0,i.useState)({projectsObject:{},error:"",loading:!0}),[t,n]=(0,i.useState)({projectDetailsObject:{},error:"",loading:!0}),[o,d]=(0,i.useState)({projectsDropdownObject:[],error:"",loading:!0}),[u,l]=(0,i.useState)({projectsDropdownObject:[],error:"",loading:!0}),[s,c]=(0,i.useState)({projectsObject:[],error:"",loading:!0}),[q,m]=(0,i.useState)({projectsHistoryObject:{},error:"",loading:!0}),j=(0,a.d4)((e=>e.projects||{})),p=(0,a.d4)((e=>e.projectDetails||{})),b=(0,a.d4)((e=>e.projectsDropdown||[])),g=(0,a.d4)((e=>e.allProjectsDropdown||[])),R=(0,a.d4)((e=>e.projectsForRoleOrUser||[])),Y=(0,a.d4)((e=>e.projectsHistory||{}));return(0,i.useEffect)((()=>{r((e=>({...e,...j})))}),[j]),(0,i.useEffect)((()=>{n((e=>({...e,...p})))}),[p]),(0,i.useEffect)((()=>{d((e=>({...e,...b})))}),[b]),(0,i.useEffect)((()=>{l((e=>({...e,...g})))}),[g]),(0,i.useEffect)((()=>{c((e=>({...e,...R})))}),[R]),(0,i.useEffect)((()=>{m((e=>({...e,...Y})))}),[Y]),{projects:e,projectsDropdown:o,allProjectsDropdown:u,projectsHistory:q,projectsGovernForRoleOrUser:s,projectDetails:t}}},43858:(e,r,t)=>{t.d(r,{A:()=>u});var i=t(89379),a=t(9950);const n={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"}}]},name:"paper-clip",theme:"outlined"};var o=t(14840),d=function(e,r){return a.createElement(o.A,(0,i.A)((0,i.A)({},e),{},{ref:r,icon:n}))};const u=a.forwardRef(d)},72179:(e,r,t)=>{var i=t(24994);r.A=void 0;var a=i(t(79526)),n=t(44414);r.A=(0,a.default)((0,n.jsx)("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"}),"CancelOutlined")}}]);