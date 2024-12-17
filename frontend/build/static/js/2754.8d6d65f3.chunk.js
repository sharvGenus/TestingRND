"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[2754],{84601:(e,r,a)=>{a.d(r,{A:()=>o});var i=a(60666);const t=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],d=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],l=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},n=["nothing","",()=>!0],u=function(e,r,a){let i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const t=new Date(e),d=new Date(r),l=new Date(a);return i?l<=t&&t<=d:l<=t&&t>=d},o={allowedColumns:i.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:i.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:i.Yj().required("Required").nullable(),formType:i.Yj().required("Required").nullable(),taskType:i.Yj().required("Required").nullable(),code:i.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:i.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:i.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:i.Yj().required("Required"),title:i.Yj().required("Required").nullable(),office:i.Yj().required("Required").nullable(),masterCode:i.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:i.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:i.Yj().required("Required"),gstNumber:i.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:i.Yj().required("Required"),storePhoto:i.Yj().required("Required"),email:i.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:i.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:i.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:i.Yj().required("Required"),nother:i.Yj().nullable().required("Required"),otherArray:i.YO().min(1,"Please select atleast one field"),areaLevel:i.YO().min(1,"Please select atleast one level."),formTitle:i.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:i.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:i.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:i.Yj().required(" "),telephone:i.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:i.Yj().required("Required"),registeredAddress:i.Yj().required("Required"),quantity:i.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:i.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:i.ai().test(...l()).test(...t).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return i.ai().test(...r?l():n).test(...t).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:i.Yj().required("Required"),state:i.Yj().required("Required"),city:i.Yj().required("Required"),registeredCountry:i.Yj().required("Required"),registeredState:i.Yj().required("Required"),registeredCity:i.Yj().required("Required"),organizationType:i.Yj().nullable().required("Required"),organizationCode:i.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:i.Yj().nullable().required("Required"),organizationLocationId:i.Yj().required("Required"),integrationId:i.Yj().required("Required"),firm:i.Yj().required("Required"),movementType:i.Yj().required("Required"),supplier:i.Yj().required("Required"),masterMaker:i.Yj().required("Required"),projectMasterMaker:i.Yj().required("Required"),lov:i.Yj().required("Required"),date:i.Yj().required("Required"),fromDate:i.Yj().required("Required"),toDate:i.Yj().when("fromDate",{is:e=>!!e,then:i.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:i.Yj().required("Required"),challanNumber:i.Yj().required("Required"),poNumber:i.Yj().required("Required"),workOrderNumber:i.Yj().required("Required"),receivingStore:i.Yj().required("Required"),uom:i.Yj().required("Required"),project:i.Yj().nullable().required("Required"),projectArr:i.YO().of(i.gl()).nullable().required("Required").min(1,"Required"),organizationArr:i.YO().of(i.gl()).nullable().required("Required").min(1,"Required"),accessProject:i.Yj().nullable().required("Required"),rate:i.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:i.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:i.Yj().required("Required"),rangeTo:i.Yj().required("Required"),requiredWithLabel:()=>i.Yj().nullable().required("Required"),requiredWithNonZero:e=>i.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>i.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:i.ai().required("Required"),isSerialize:i.Yj().required("Please select a checkbox"),vehicleNumber:i.Yj().required("Required"),vehicleNumberOptional:i.Yj().nullable(),inventoryNameOptional:i.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:i.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:i.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:i.Yj().required("Required"),eWayBillNumber:i.Yj().required("Required"),eWayBillDate:i.Yj().required("Required"),actualReceiptDate:i.Yj().when("eWayBillDate",{is:e=>!!e,then:i.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:i.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:i.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:i.Yj().nullable().required("Required"),placeOfTransfer:i.Yj().required("Required"),contractorStore:i.Yj().nullable().required("Required"),projectSiteStoreLocation:i.Yj().required("Required"),contractorStoreLocation:i.Yj().nullable().required("Required"),contractorEmployee:i.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>i.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:i.Yj().required("Required"),longDescription:i.Yj().required("Required"),hsnCode:i.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:i.Yj().required("Required"),store:i.Yj().nullable().required("Required"),accessStore:i.Yj().nullable().required("Required"),series:i.Yj().required("Required"),material:i.Yj().required("Required"),materialType:i.Yj().required("Required"),materialCode:i.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:i.Yj().nullable().required("Required"),accessOrganizationId:i.Yj().nullable().required("Required"),company:i.Yj().required("Required"),contractor:i.Yj().nullable().required("Required"),contractorId:i.Yj().required("Required"),fromInstaller:i.Yj().nullable().required("Required"),toInstaller:i.Yj().nullable().required("Required"),fromStoreLocationId:i.Yj().nullable().required("Required"),toStoreLocationId:i.Yj().nullable().required("Required"),storeLocationId:i.Yj().nullable().required("Required"),installerStoreLocationId:i.Yj().nullable().required("Required"),accessStoreLocationId:i.Yj().nullable().required("Required"),fromStore:i.Yj().nullable().required("Required"),toStore:i.Yj().required("Required"),transporterName:i.Yj().required("Required"),customerSiteStoreId:i.Yj().nullable().required("Required"),toCustomerId:i.Yj().nullable().required("Required"),financialYear:i.Yj().required("Required"),user:i.Yj().required("Required"),accessUser:i.Yj().nullable().required("Required"),rightsFor:i.Yj().nullable().required("Required"),gaaLevelId:i.Yj().nullable().required("Required"),networkLevelId:i.Yj().nullable().required("Required"),server:i.Yj().required("Required"),port:i.Yj().required("Required"),encryption:i.Yj().required("Required"),requisitionNumber:i.Yj().nullable().required("Required"),password:i.Yj().required("Required"),transaction:i.Yj().nullable().required("Required"),serviceCenter:i.Yj().nullable().required("Required"),scrapLocation:i.Yj().nullable().required("Required"),effectiveFrom:i.Yj().required("Required"),effectiveTo:i.Yj().required("Required"),displayName:i.Yj().required("Required"),templateName:i.Yj().required("Required"),subject:i.Yj().required("Required"),from:i.Yj().required("Required"),to:i.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:i.Yj().required("Required"),attachmentsWhenIsAuthorized:i.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:i.Yj().nullable().required("Required")}),requestNumber:i.Yj().required("Required"),remarks:i.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:i.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:i.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:i.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>i.Yj().required("Required"),startDateRange:(e,r,a)=>i.Yj().required("Required").test("date-comparison",`${r} must be >= ${a}`,(function(r){return function(e,r){let a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const i=new Date(e),t=new Date(r);return a?i<=t:i>=t}(r,e,!1)})),endDateRange:(e,r,a,t,d,l)=>i.Yj().required("Required").test("date-comparison",`${a} must be <= ${t} and >= ${d}`,(function(a){return u(a,e,r,!l)})),endDateRangeMax:(e,r,a,t,d,l)=>i.Yj().required("Required").test("date-comparison",`${a} must be >= ${t} and >= ${d}`,(function(a){return u(a,e,r,!l)})),month:e=>i.ai().test(...l(e)).test(...d).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,a)=>i.ai().test(...l(r)).test(...d).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${a}`),checkQty:e=>i.ai().test(...l(e)).test(...t).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?i.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):i.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:i.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},72754:(e,r,a)=>{a.r(r),a.d(r,{default:()=>f});var i=a(9950),t=a(12257),d=a(4139),l=a(87233),n=a(67535),u=a(60666),o=a(9449),s=a(28429),c=a(26473),q=a(27081),v=a(71826),m=a(24618),j=a(80733),b=a(96951),g=a(14351),h=a(84601),p=a(29024),R=a(62054),Y=a(33507),y=a(44414);const f=()=>{var e,r,a,f,A,E,L;const w=(0,q.wA)(),{userId:x}=(0,s.g)(),[$,I]=(0,i.useState)(),[S,k]=(0,i.useState)();(0,i.useEffect)((()=>{w((0,p.uiG)())}),[w]);const[P,D]=(0,i.useState)({}),N=(0,i.useCallback)((async()=>{const e=await(0,v.default)("/get-gaanetwork-userId",{method:"GET",query:{userId:x}});var r;if(e.success)return D(null===e||void 0===e||null===(r=e.data)||void 0===r?void 0:r.data);const a=e.error&&e.error.message?e.error.message:e.error;(0,R.A)(a||"Unable to fetch data. Please contact admin",{variant:"error"})}),[x]);(0,i.useEffect)((()=>{x&&N()}),[w,x,N]);const{projectsDropdown:O}=(0,j.Y)(),T=null===O||void 0===O?void 0:O.projectsDropdownObject,z=(0,o.mN)({resolver:(0,c.t)(u.Ik().shape({projectId:h.A.other,hierarchyType:h.A.other,gaaLevelEntryId0:h.A.areaLevel})),defaultValues:{gaaLevelEntryId0:[]},mode:"all"}),{handleSubmit:C,setValue:F,watch:Z}=z,_=Z();(0,i.useEffect)((()=>{F("dateFrom",(new Date).toISOString().slice(0,10))}),[F]);const{user:M}=(0,Y.A)(),[V,G]=(0,i.useState)(null),H=(0,i.useCallback)((async()=>{if(null!==M&&void 0!==M&&M.id){const r=null===M||void 0===M?void 0:M.id;if(r&&"577b8900-b333-42d0-b7fb-347abc3f0b5c"!==r){const a=await(0,v.default)("/get-gaanetwork-userId",{method:"GET",query:{userId:r}});var e;if(null!==a&&void 0!==a&&a.success)return G(null===a||void 0===a||null===(e=a.data)||void 0===e?void 0:e.data);const i=a.error&&a.error.message?a.error.message:a.error;(0,R.A)(i||"Unable to fetch data. Please contact admin",{variant:"error"})}}}),[M]);(0,i.useEffect)((()=>{H()}),[w,H]),(0,i.useEffect)((()=>{$&&w((0,p.aT5)($))}),[w,$]);const{projectAreaLevels:W}=(0,m.L)(),{hierarchyLevelsData:U}=(0,i.useMemo)((()=>({hierarchyLevelsData:(null===W||void 0===W?void 0:W.projectAreaLevelsObject)||[]})),[W]);(0,i.useEffect)((()=>{var e,r,a;let i;F("hierarchyType",null===P||void 0===P?void 0:P.hierarchyType),k(null===P||void 0===P?void 0:P.hierarchyType),F("projectId",null===P||void 0===P?void 0:P.projectId),I(null===P||void 0===P?void 0:P.projectId),F("user",null===P||void 0===P||null===(e=P.user)||void 0===e?void 0:e.name);let t=0;var d;(null===(r=U[0])||void 0===r||r.gaaLevels.map((e=>{"1"!==e.isMapped&&t++})),"network"===(null===P||void 0===P?void 0:P.hierarchyType))?i=null===P||void 0===P||null===(d=P.hierarchy)||void 0===d?void 0:d.slice(t-1):i=null===P||void 0===P?void 0:P.hierarchy;null===(a=i)||void 0===a||a.map(((e,r)=>{const a=`gaaLevelEntryId${r}`,i=null===e||void 0===e?void 0:e.levelEntries;return F(a,i),e}))}),[P,U,F]);const B="network"===(null===V||void 0===V?void 0:V.hierarchyType)?[{id:"network",name:"Network"}]:[{id:"gaa",name:"Gaa"}],Q=(0,s.Zp)(),J=(e,r,a,i,d)=>(0,y.jsx)(t.A,{children:(0,y.jsx)(b.eu,{name:e,label:r,onChange:d,InputLabelProps:{shrink:!0},menus:a,...i&&{required:!0}})}),K=function(e,r,a,i,t){let d=!(arguments.length>5&&void 0!==arguments[5])||arguments[5];return(0,y.jsx)(b.o3,{name:e,disabled:"user"==e,type:a,label:r,InputLabelProps:{shrink:d},...t&&{required:!0},defaultValue:i})},X=null===(e=U[0])||void 0===e?void 0:e.gaaLevels.find((e=>"1"===e.isMapped)),ee=(0,i.useCallback)(((e,r)=>{const a=r-1;return null!==_&&void 0!==_&&_[`gaaLevelEntryId${a}`]?e.gaa_level_entries.filter((e=>{var r;return null===_||void 0===_||null===(r=_[`gaaLevelEntryId${a}`])||void 0===r?void 0:r.includes(null===e||void 0===e?void 0:e.parentId)})):e.gaa_level_entries}),[_]),re=(0,i.useCallback)(((e,r,a,i,t)=>{(a=structuredClone(a))[`gaaLevelEntryId${e}`]=t;let d=e;for(;d<(i?r.length-1:r.length);){var l,n,u;const e=`gaaLevelEntryId${d+1}`,i=`gaaLevelEntryId${d}`,t=r[d+1],o=null!==(l=a)&&void 0!==l&&l[i]&&null!==t&&void 0!==t&&t.gaa_level_entries?null===t||void 0===t||null===(n=t.gaa_level_entries)||void 0===n?void 0:n.filter((e=>{var r,t;return null===(r=a)||void 0===r||null===(t=r[i])||void 0===t?void 0:t.includes(null===e||void 0===e?void 0:e.parentId)})):(null===t||void 0===t?void 0:t.gaa_level_entries)||[],s=Array.isArray(a[e])&&(null===(u=a[e])||void 0===u?void 0:u.filter((e=>o.some((r=>r.id===e)))))||[];F(e,s),a[e]=s,d+=1}}),[F]),ae=(e,r,a,i)=>{var t,d;if(null!==M&&void 0!==M&&M.id&&"577b8900-b333-42d0-b7fb-347abc3f0b5c"===(null===M||void 0===M?void 0:M.id))return!0===i?0!==a&&!(null!==_&&void 0!==_&&null!==(t=_["gaaLevelEntryId"+(a-1)])&&void 0!==t&&t.length):0!==a&&!(null!==_&&void 0!==_&&null!==(d=_[`gaaLevelEntryId${a}`])&&void 0!==d&&d.length);{const a=null===V||void 0===V?void 0:V.levelRank;if(void 0!==a)return!0===i||r===(null===V||void 0===V?void 0:V.levelName)?e<=a:null}};return null===(r=U[0])||void 0===r||r.gaaLevels.map(((e,r)=>{var a;return(0,y.jsx)(d.Ay,{item:!0,md:10,xl:10,children:(0,y.jsx)(b.Yq,{name:`gaaLevelEntryId${r}`,label:e.name,onChange:re.bind(null,r,null===(a=U[0])||void 0===a?void 0:a.gaaLevels,_,!0),menus:ee(e,r),disable:(null===M||void 0===M?void 0:M.id)&&ae(e.name,r,!0)})},e.id)})),(0,y.jsx)(y.Fragment,{children:(0,y.jsx)(b.Op,{methods:z,onSubmit:C((async e=>{e=structuredClone(e);const r=Object.keys(e).filter((r=>r.startsWith("gaaLevelEntryId")&&e[r].length>0)).map((e=>parseInt(e.match(/-?\d+$/)[0])));if(r.length>0){const a=Math.max(...r);e.gaaLevelEntryId=e[`gaaLevelEntryId${a}`]}const{gaaLevelEntryId:a}=e,i=[...(a||[]).map((e=>({id:e,isAccess:a.length>0})))],t={dateForm:e.dateFrom,lovArray:i,roleId:null,projectId:e.projectId,hierarchyType:e.hierarchyType,masterId:"d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7",userId:[x]};try{if((await(0,v.default)("/govern-user-rows",{method:"POST",body:t})).success){const e="GAA & Network Area Updated Successfully!";(0,R.A)(e,{variant:"success",autoHideDuration:1e4}),Q("/gaa-network-area-allocation")}}catch(d){(0,R.A)("An error occurred. Please try again.",{variant:"error"})}})),children:(0,y.jsx)(g.A,{title:(0,y.jsxs)(d.Ay,{container:!0,xl:12,sx:{justifyContent:"space-between",alignItems:"center"},children:[(0,y.jsx)(d.Ay,{item:!0,children:(0,y.jsx)(l.A,{variant:"h4",children:"Edit GAA & Network Area Allocation"})}),(0,y.jsxs)(d.Ay,{item:!0,sx:{display:"flex",gap:2},children:[(0,y.jsx)(n.A,{size:"small",variant:"outlined",color:"primary",onClick:()=>Q("/gaa-network-area-allocation"),children:"Back"}),(0,y.jsx)(n.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Update"})]})]}),sx:{mb:2},children:(0,y.jsx)(y.Fragment,{children:(0,y.jsxs)(d.Ay,{container:!0,spacing:4,children:[(0,y.jsx)(d.Ay,{item:!0,md:3,xl:3,children:K("user","User","text")}),(0,y.jsx)(d.Ay,{item:!0,md:3,xl:3,children:J("projectId","Project",T,!0,(e=>{var r;I(null===e||void 0===e||null===(r=e.target)||void 0===r?void 0:r.value)}))}),(0,y.jsx)(d.Ay,{item:!0,md:3,xl:3,children:J("hierarchyType","Hierarchy Type",B,!0,(e=>{var r,a;"gaa"===(null===V||void 0===V?void 0:V.hierarchyType)&&"network"===(null===P||void 0===P?void 0:P.hierarchyType)&&"gaa"===(null===e||void 0===e||null===(r=e.target)||void 0===r?void 0:r.value)?((0,R.A)("Go to Assign New Area to Give GAA Level Access Rights for this User.",{variant:"error"}),k((e=>e))):k(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value);Object.keys(z.getValues()).forEach((e=>{if(e.startsWith("gaaLevelEntryId")){const r=z.getValues()[e];z.setValue(e,r||[])}}))}))}),(0,y.jsx)(d.Ay,{item:!0,md:3,xl:3,children:K("dateFrom","Applicable Date","date")}),$?"gaa"===S?U&&null!==(a=U[0])&&void 0!==a&&null!==(f=a.gaaLevels)&&void 0!==f&&f.length?null===(A=U[0])||void 0===A?void 0:A.gaaLevels.map(((e,r)=>{var a;return(0,y.jsx)(d.Ay,{item:!0,md:10,xl:10,children:(0,y.jsx)(b.Yq,{name:`gaaLevelEntryId${r}`,label:e.name,onChange:re.bind(null,r,null===(a=U[0])||void 0===a?void 0:a.gaaLevels,_,!0),menus:ee(e,r),disable:(null===M||void 0===M?void 0:M.id)&&ae(e.rank,e.name,r,!0)})},e.id)})):(0,y.jsx)(y.Fragment,{}):"network"===S?(0,y.jsxs)(y.Fragment,{children:[X&&(0,y.jsx)(d.Ay,{item:!0,md:10,xl:10,children:(0,y.jsx)(b.Yq,{name:"gaaLevelEntryId0",label:X.name,menus:X.gaa_level_entries,onChange:re.bind(null,0,U[1].networkLevels,_,!1),disable:"network"===(null===V||void 0===V?void 0:V.hierarchyType)&&(null===V||void 0===V?void 0:V.levelRank)>=1})},X.id),U&&null!==(E=U[1])&&void 0!==E&&null!==(L=E.networkLevels)&&void 0!==L&&L.length?U[1].networkLevels.map(((e,r)=>(0,y.jsx)(d.Ay,{item:!0,md:10,xl:10,children:(0,y.jsx)(b.Yq,{name:`gaaLevelEntryId${r+1}`,label:e.name,menus:ee(e,r+1),onChange:re.bind(null,r+1,U[1].networkLevels,_,!1),disable:(null===M||void 0===M?void 0:M.id)&&ae(e.rank,e.name,r)})},e.id))):(0,y.jsx)(y.Fragment,{})]}):(0,y.jsx)(y.Fragment,{}):(0,y.jsx)(y.Fragment,{})]})})})})})}},24618:(e,r,a)=>{a.d(r,{L:()=>d});var i=a(9950),t=a(27081);const d=()=>{const[e,r]=(0,i.useState)({gaaObject:{},error:"",loading:!0}),[a,d]=(0,i.useState)({gaaProjectsObject:[],error:"",loading:!0}),[l,n]=(0,i.useState)({gaaLevelProjectsObject:[],error:"",loading:!0}),[u,o]=(0,i.useState)({gaaLevelParentsObject:[],error:"",loading:!0}),[s,c]=(0,i.useState)({projectAreaLevelsObject:[],error:"",loading:!1}),[q,v]=(0,i.useState)({gaaHistoryObject:{},error:"",loading:!0}),[m,j]=(0,i.useState)({gaaLevelEntryHistoryObject:{},error:"",loading:!0}),b=(0,t.d4)((e=>e.gaa||{})),g=(0,t.d4)((e=>e.gaaProjects||{})),h=(0,t.d4)((e=>e.gaaLevelProjects||{})),p=(0,t.d4)((e=>e.gaaLevelParents||{})),R=(0,t.d4)((e=>e.projectAreaLevels||{})),Y=(0,t.d4)((e=>e.gaaHistory||{})),y=(0,t.d4)((e=>e.gaaLevelEntryHistory||{}));return(0,i.useEffect)((()=>{r((e=>({...e,...b})))}),[b]),(0,i.useEffect)((()=>{d((e=>({...e,...g})))}),[g]),(0,i.useEffect)((()=>{n((e=>({...e,...h})))}),[h]),(0,i.useEffect)((()=>{o((e=>({...e,...p})))}),[p]),(0,i.useEffect)((()=>{c((e=>({...e,...R})))}),[R]),(0,i.useEffect)((()=>{v((e=>({...e,...Y})))}),[Y]),(0,i.useEffect)((()=>{j((e=>({...e,...y})))}),[y]),{gaa:e,gaaProjects:a,gaaLevelProjects:l,gaaLevelParents:u,projectAreaLevels:s,gaaHistory:q,gaaLevelEntryHistory:m}}},80733:(e,r,a)=>{a.d(r,{Y:()=>d});var i=a(9950),t=a(27081);const d=()=>{const[e,r]=(0,i.useState)({projectsObject:{},error:"",loading:!0}),[a,d]=(0,i.useState)({projectDetailsObject:{},error:"",loading:!0}),[l,n]=(0,i.useState)({projectsDropdownObject:[],error:"",loading:!0}),[u,o]=(0,i.useState)({projectsDropdownObject:[],error:"",loading:!0}),[s,c]=(0,i.useState)({projectsObject:[],error:"",loading:!0}),[q,v]=(0,i.useState)({projectsHistoryObject:{},error:"",loading:!0}),m=(0,t.d4)((e=>e.projects||{})),j=(0,t.d4)((e=>e.projectDetails||{})),b=(0,t.d4)((e=>e.projectsDropdown||[])),g=(0,t.d4)((e=>e.allProjectsDropdown||[])),h=(0,t.d4)((e=>e.projectsForRoleOrUser||[])),p=(0,t.d4)((e=>e.projectsHistory||{}));return(0,i.useEffect)((()=>{r((e=>({...e,...m})))}),[m]),(0,i.useEffect)((()=>{d((e=>({...e,...j})))}),[j]),(0,i.useEffect)((()=>{n((e=>({...e,...b})))}),[b]),(0,i.useEffect)((()=>{o((e=>({...e,...g})))}),[g]),(0,i.useEffect)((()=>{c((e=>({...e,...h})))}),[h]),(0,i.useEffect)((()=>{v((e=>({...e,...p})))}),[p]),{projects:e,projectsDropdown:l,allProjectsDropdown:u,projectsHistory:q,projectsGovernForRoleOrUser:s,projectDetails:a}}}}]);