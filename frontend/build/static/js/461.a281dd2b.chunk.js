"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[461],{64499:(e,r,i)=>{i.d(r,{A:()=>j});var t=i(9950),a=i(65669),d=i(43263),l=i(57191),n=i(95537),u=i(67535),o=i(87233),s=i(44414);j.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const m={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},c={display:"flex",flexDirection:"row",padding:"15px 0"},q={display:"flex",justifyContent:"flex-end",gap:2},p={marginTop:2,display:"flex",fontSize:"14px"};function j(e){let{open:r,handleClose:i,title:j,message:b,closeBtnTitle:h,confirmBtnTitle:v,handleConfirm:R,confirmColor:f}=e;const[Y,g]=(0,t.useState)(null);return(0,t.useEffect)((()=>{g(null)}),[r]),(0,s.jsx)("div",{children:(0,s.jsx)(a.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:r,closeAfterTransition:!0,slots:{backdrop:d.A},slotProps:{backdrop:{timeout:500}},children:(0,s.jsx)(l.A,{in:r,children:(0,s.jsxs)(n.A,{sx:m,children:[(0,s.jsx)(o.A,{id:"transition-modal-title",variant:"h4",children:j}),(0,s.jsx)(o.A,{id:"transition-modal-title",variant:"h6",sx:c,children:b}),(0,s.jsxs)(n.A,{sx:q,children:[!!i&&(0,s.jsx)(u.A,{onClick:i,size:"small",variant:"outlined",color:"primary",children:h}),!!R&&(0,s.jsx)(u.A,{onClick:R,size:"small",variant:"contained",color:f||"error",children:v})]}),Y&&(0,s.jsx)(o.A,{variant:"p",color:"red",sx:p,children:Y})]})})})})}},84601:(e,r,i)=>{i.d(r,{A:()=>o});var t=i(60666);const a=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],d=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],l=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},n=["nothing","",()=>!0],u=function(e,r,i){let t=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const a=new Date(e),d=new Date(r),l=new Date(i);return t?l<=a&&a<=d:l<=a&&a>=d},o={allowedColumns:t.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:t.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:t.Yj().required("Required").nullable(),formType:t.Yj().required("Required").nullable(),taskType:t.Yj().required("Required").nullable(),code:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:t.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:t.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:t.Yj().required("Required"),title:t.Yj().required("Required").nullable(),office:t.Yj().required("Required").nullable(),masterCode:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:t.Yj().required("Required"),gstNumber:t.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:t.Yj().required("Required"),storePhoto:t.Yj().required("Required"),email:t.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:t.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:t.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:t.Yj().required("Required"),nother:t.Yj().nullable().required("Required"),otherArray:t.YO().min(1,"Please select atleast one field"),areaLevel:t.YO().min(1,"Please select atleast one level."),formTitle:t.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:t.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:t.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:t.Yj().required(" "),telephone:t.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:t.Yj().required("Required"),registeredAddress:t.Yj().required("Required"),quantity:t.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:t.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:t.ai().test(...l()).test(...a).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t.ai().test(...r?l():n).test(...a).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:t.Yj().required("Required"),state:t.Yj().required("Required"),city:t.Yj().required("Required"),registeredCountry:t.Yj().required("Required"),registeredState:t.Yj().required("Required"),registeredCity:t.Yj().required("Required"),organizationType:t.Yj().nullable().required("Required"),organizationCode:t.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:t.Yj().nullable().required("Required"),organizationLocationId:t.Yj().required("Required"),integrationId:t.Yj().required("Required"),firm:t.Yj().required("Required"),movementType:t.Yj().required("Required"),supplier:t.Yj().required("Required"),masterMaker:t.Yj().required("Required"),projectMasterMaker:t.Yj().required("Required"),lov:t.Yj().required("Required"),date:t.Yj().required("Required"),fromDate:t.Yj().required("Required"),toDate:t.Yj().when("fromDate",{is:e=>!!e,then:t.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:t.Yj().required("Required"),challanNumber:t.Yj().required("Required"),poNumber:t.Yj().required("Required"),workOrderNumber:t.Yj().required("Required"),receivingStore:t.Yj().required("Required"),uom:t.Yj().required("Required"),project:t.Yj().nullable().required("Required"),projectArr:t.YO().of(t.gl()).nullable().required("Required").min(1,"Required"),organizationArr:t.YO().of(t.gl()).nullable().required("Required").min(1,"Required"),accessProject:t.Yj().nullable().required("Required"),rate:t.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:t.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:t.Yj().required("Required"),rangeTo:t.Yj().required("Required"),requiredWithLabel:()=>t.Yj().nullable().required("Required"),requiredWithNonZero:e=>t.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>t.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:t.ai().required("Required"),isSerialize:t.Yj().required("Please select a checkbox"),vehicleNumber:t.Yj().required("Required"),vehicleNumberOptional:t.Yj().nullable(),inventoryNameOptional:t.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:t.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:t.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:t.Yj().required("Required"),eWayBillNumber:t.Yj().required("Required"),eWayBillDate:t.Yj().required("Required"),actualReceiptDate:t.Yj().when("eWayBillDate",{is:e=>!!e,then:t.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:t.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:t.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:t.Yj().nullable().required("Required"),placeOfTransfer:t.Yj().required("Required"),contractorStore:t.Yj().nullable().required("Required"),projectSiteStoreLocation:t.Yj().required("Required"),contractorStoreLocation:t.Yj().nullable().required("Required"),contractorEmployee:t.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>t.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:t.Yj().required("Required"),longDescription:t.Yj().required("Required"),hsnCode:t.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:t.Yj().required("Required"),store:t.Yj().nullable().required("Required"),accessStore:t.Yj().nullable().required("Required"),series:t.Yj().required("Required"),material:t.Yj().required("Required"),materialType:t.Yj().required("Required"),materialCode:t.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:t.Yj().nullable().required("Required"),accessOrganizationId:t.Yj().nullable().required("Required"),company:t.Yj().required("Required"),contractor:t.Yj().nullable().required("Required"),contractorId:t.Yj().required("Required"),fromInstaller:t.Yj().nullable().required("Required"),toInstaller:t.Yj().nullable().required("Required"),fromStoreLocationId:t.Yj().nullable().required("Required"),toStoreLocationId:t.Yj().nullable().required("Required"),storeLocationId:t.Yj().nullable().required("Required"),installerStoreLocationId:t.Yj().nullable().required("Required"),accessStoreLocationId:t.Yj().nullable().required("Required"),fromStore:t.Yj().nullable().required("Required"),toStore:t.Yj().required("Required"),transporterName:t.Yj().required("Required"),customerSiteStoreId:t.Yj().nullable().required("Required"),toCustomerId:t.Yj().nullable().required("Required"),financialYear:t.Yj().required("Required"),user:t.Yj().required("Required"),accessUser:t.Yj().nullable().required("Required"),rightsFor:t.Yj().nullable().required("Required"),gaaLevelId:t.Yj().nullable().required("Required"),networkLevelId:t.Yj().nullable().required("Required"),server:t.Yj().required("Required"),port:t.Yj().required("Required"),encryption:t.Yj().required("Required"),requisitionNumber:t.Yj().nullable().required("Required"),password:t.Yj().required("Required"),transaction:t.Yj().nullable().required("Required"),serviceCenter:t.Yj().nullable().required("Required"),scrapLocation:t.Yj().nullable().required("Required"),effectiveFrom:t.Yj().required("Required"),effectiveTo:t.Yj().required("Required"),displayName:t.Yj().required("Required"),templateName:t.Yj().required("Required"),subject:t.Yj().required("Required"),from:t.Yj().required("Required"),to:t.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:t.Yj().required("Required"),attachmentsWhenIsAuthorized:t.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:t.Yj().nullable().required("Required")}),requestNumber:t.Yj().required("Required"),remarks:t.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:t.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:t.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:t.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>t.Yj().required("Required"),startDateRange:(e,r,i)=>t.Yj().required("Required").test("date-comparison",`${r} must be >= ${i}`,(function(r){return function(e,r){let i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const t=new Date(e),a=new Date(r);return i?t<=a:t>=a}(r,e,!1)})),endDateRange:(e,r,i,a,d,l)=>t.Yj().required("Required").test("date-comparison",`${i} must be <= ${a} and >= ${d}`,(function(i){return u(i,e,r,!l)})),endDateRangeMax:(e,r,i,a,d,l)=>t.Yj().required("Required").test("date-comparison",`${i} must be >= ${a} and >= ${d}`,(function(i){return u(i,e,r,!l)})),month:e=>t.ai().test(...l(e)).test(...d).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,i)=>t.ai().test(...l(r)).test(...d).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${i}`),checkQty:e=>t.ai().test(...l(e)).test(...a).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?t.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):t.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:t.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},80461:(e,r,i)=>{i.r(r),i.d(r,{default:()=>w});var t=i(9950),a=i(12257),d=i(14857),l=i(2683),n=i(4139),u=i(87233),o=i(67535),s=i(74745),m=i(96583),c=i(60666),q=i(9449),p=i(26473),j=i(27081),b=i(76300),h=i(29024),v=i(96951),R=i(84601),f=i(10447),Y=i(99635),g=i(64499),y=i(71826),x=i(62054),A=i(44414);const M=(e,r,i,t,d,l)=>(0,A.jsx)(a.A,{children:(0,A.jsx)(v.eu,{name:e,placeholder:d,label:r,onChange:l,InputLabelProps:{shrink:!0},menus:i,...t&&{required:!0}})}),S=e=>{const{setMappingArray:r,columnData:i,sourceColumnData:t}=e,a=(0,q.mN)({resolver:(0,p.t)(c.Ik().shape({formAttributeId:R.A.other,mappingColumnId:R.A.other})),defaultValues:{},mode:"all"}),{handleSubmit:d}=a;return(0,A.jsx)(v.Op,{methods:a,onSubmit:d((async e=>{const{formAttributeId:i,mappingColumnId:t}=e,d={formAttributeId:i,mappingColumnId:t};r((e=>[...e,{...d,index:e.length}])),a.reset()})),children:(0,A.jsx)(n.Ay,{container:!0,alignItems:"center",sx:{pl:4,pr:4},children:(0,A.jsxs)(n.Ay,{container:!0,spacing:4,mt:1,mb:3,direction:"row",children:[(0,A.jsx)(n.Ay,{item:!0,md:3,xl:3,children:M("formAttributeId","Select Form Field",i,!0,"Select Form Field")}),(0,A.jsx)(n.Ay,{item:!0,md:3,xl:3,children:M("mappingColumnId","Select Mapping Column",t,!0,"Select Mapping Column")}),(0,A.jsx)(n.Ay,{item:!0,md:3,sx:{mt:4},children:(0,A.jsx)(o.A,{variant:"contained",size:"small",color:"primary",type:"submit",children:"Add"})})]})})})},w=e=>{var r,i,a;let{formHeaderData:w,mappingArrayData:C,formId:N,screen:I,setScreen:$}=e;const k=(0,d.A)(),P=(0,j.wA)(),[z,D]=(0,t.useState)(null),[E,T]=(0,t.useState)([]),[O,Z]=(0,t.useState)([]),[F,L]=(0,t.useState)(""),[V,B]=(0,t.useState)(!1),[H,W]=(0,t.useState)(!1),_=(0,q.mN)({defaultValues:{},mode:"all"}),{handleSubmit:U,setValue:Q}=_;(0,t.useEffect)((()=>(N&&P((0,h.u44)({formId:N,sortBy:"rank",sortOrder:"ASC"})),()=>{P(f.wF.actions.reset())})),[P,N]);const G=(0,t.useCallback)((async()=>{const e=await(0,y.default)("/form-attributes-list",{method:"GET",query:{formId:F,sort:["createdAt","ASC"]}});var r,i;if(e.success)return Z((null===(r=e.data)||void 0===r||null===(i=r.data)||void 0===i?void 0:i.rows)||[]);const t=e.error&&e.error.message?e.error.message:e.error;(0,x.A)(t||"Unable to fetch data. Please contact admin",{variant:"error"})}),[F]);(0,t.useEffect)((()=>{F&&G()}),[P,F,G]),(0,t.useEffect)((()=>{P((0,h.tgI)({sortBy:"updatedAt",sortOrder:"DESC",projectId:null===w||void 0===w?void 0:w.projectId}))}),[P,null===w||void 0===w?void 0:w.projectId]),(0,t.useEffect)((()=>{L(null===w||void 0===w?void 0:w.mappingTableId),T(C.map(((e,r)=>({...e,index:r})))),Q("mappingTableId",null===w||void 0===w?void 0:w.mappingTableId),Q("searchColumns",null===w||void 0===w?void 0:w.searchColumns),Q("selfSearchColumns",null===w||void 0===w?void 0:w.selfSearchColumns)}),[Q]);const{forms:K}=(0,b.I)(),{formAttributes:J}=(0,b.I)(),X=(0,t.useMemo)((()=>{var e;return(null===J||void 0===J||null===(e=J.formAttributesObject)||void 0===e?void 0:e.rows)||[]}),[null===J||void 0===J||null===(r=J.formAttributesObject)||void 0===r?void 0:r.rows]),ee=(0,t.useMemo)((()=>E.filter((e=>null===e||void 0===e?void 0:e.mappingColumnId))),[E]),re=(null===K||void 0===K||null===(i=K.formDataObject)||void 0===i||null===(a=i.rows)||void 0===a?void 0:a.filter((e=>e.isPublished)).map((e=>({id:e.id,name:e.name,tableName:e.tableName}))))||[],ie=[{Header:"Form Field",accessor:e=>{var r;return null===(r=X.find((r=>r.id===e.formAttributeId)))||void 0===r?void 0:r.name}},{Header:"Mapping Column",accessor:e=>{var r;return"function"===typeof(null===O||void 0===O?void 0:O.find)?null===O||void 0===O||null===(r=O.find((r=>r.id===e.mappingColumnId)))||void 0===r?void 0:r.name:""}}],te=(0,q.mN)({resolver:(0,p.t)(c.Ik().shape({oldMeterSN:R.A.other,newMeterSN:R.A.other,oldMeterMake:R.A.other,newMeterMake:R.A.other})),defaultValues:{},mode:"all"}),{setValue:ae}=te,[de,le]=(0,t.useState)(!1);(0,t.useEffect)((()=>{var e,r,i,t,a,d,l;ae("oldMeterSN",null===X||void 0===X||null===(e=X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterSN})))||void 0===e?void 0:e.id),ae("oldMeterMake",null===X||void 0===X||null===(r=X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterMake})))||void 0===r?void 0:r.id),ae("newMeterSN",null===X||void 0===X||null===(i=X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterSN})))||void 0===i||null===(t=i.properties)||void 0===t?void 0:t.oldNewMappingColumn),ae("newMeterMake",null===X||void 0===X||null===(a=X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterMake})))||void 0===a||null===(d=a.properties)||void 0===d?void 0:d.oldNewMappingColumn),(null===X||void 0===X||null===(l=X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterSN})))||void 0===l?void 0:l.id)&&le(!0)}),[ae,X]);return(0,A.jsxs)(l.A,{sx:{maxHeight:"85vh",minHeight:"85vh",overflow:"auto",border:"1px solid",borderRadius:1,borderColor:k.palette.grey.A800,boxShadow:"inherit"},children:[(0,A.jsxs)(v.Op,{methods:_,onSubmit:U((async e=>{e.mappingArray=E,e.formId=N;const r=await(0,y.default)("/form-update-data-mapping",{method:"PUT",body:e});r.success?((0,x.A)(r.data.message,{variant:"success",autoHideDuration:3e3}),$({...I,default:1,dataMapping:0})):(0,x.A)(r.error.message,{variant:"error",autoHideDuration:3e3})})),children:[(0,A.jsxs)(n.Ay,{sx:{position:"absolute",top:0,width:"100%",background:"white",zIndex:10,p:2,pb:0},children:[(0,A.jsx)(n.Ay,{container:!0,children:(0,A.jsxs)(n.Ay,{item:!0,md:12,sx:{display:"flex",justifyContent:"space-between"},children:[(0,A.jsxs)(u.A,{variant:"h4",children:[null===w||void 0===w?void 0:w.name," > Data Mapping"]}),(0,A.jsxs)(n.Ay,{item:!0,sx:{display:"flex",gap:2},children:[(0,A.jsx)(o.A,{onClick:()=>$({...I,default:1,dataMapping:0}),size:"small",variant:"outlined",color:"primary",children:"Back"}),(0,A.jsx)(o.A,{onClick:()=>W(!0),size:"small",variant:"outlined",color:"primary",children:"O&M Mapping"}),(0,A.jsx)(o.A,{size:"small",type:"submit",variant:"contained",color:"primary",children:"Save"})]})]})}),(0,A.jsx)(s.A,{sx:{mt:2}})]}),(0,A.jsxs)(n.Ay,{container:!0,spacing:4,sx:{pl:4,pr:4,pt:2,mt:5},children:[(0,A.jsx)(n.Ay,{item:!0,md:3,xl:3,children:M("mappingTableId","Mapping Table",re,!0,"",(e=>{var r;L(null===(r=e.target)||void 0===r?void 0:r.value)}))}),(0,A.jsx)(n.Ay,{item:!0,md:4,xl:4,children:(0,A.jsx)(v.Yq,{name:"searchColumns",label:"Search Parameters",menus:O,required:!0})}),(0,A.jsx)(n.Ay,{item:!0,md:4,xl:4,children:(0,A.jsx)(v.Yq,{name:"selfSearchColumns",label:"O&M Search Parameters",menus:X,required:!0})})]})]}),(0,A.jsx)(S,{setMappingArray:T,mappingArray:ee,columnData:X,sourceColumnData:O}),(0,A.jsx)(n.Ay,{sx:{width:"95%",pl:4,pr:4,pt:2,mb:4},children:(0,A.jsx)(Y.default,{hidePagination:!0,hideHistoryIcon:!0,hideViewIcon:!0,hideEditIcon:!0,hideHeader:!0,hideEmptyTable:!0,data:ee,columns:ie,count:ee.length,handleRowDelete:async e=>{D(e),B(!0)}})}),(0,A.jsx)(g.A,{open:V,handleClose:()=>B(!1),handleConfirm:()=>{const{index:e}=z,r=structuredClone(E);r[e].mappingColumnId=null,T(r.map(((e,r)=>({...e,index:r})))),B(!1)},title:"Delete Condition",message:"Are you sure you want to delete?",confirmBtnTitle:"Delete"}),(0,A.jsx)(m.A,{open:H,onClose:()=>W(!1),scroll:"paper",disableEscapeKeyDown:!0,children:(0,A.jsx)(v.Op,{methods:te,onSubmit:te.handleSubmit((async e=>{const r=null===X||void 0===X?void 0:X.find((r=>r.id===e.oldMeterSN)),i=null===X||void 0===X?void 0:X.find((r=>r.id===e.oldMeterMake));if(r||i){const l=[];r&&(e.properties={...r.properties,oldNewMappingColumn:e.newMeterSN,oldMeterSN:!0},l.push((0,y.default)("/form-attributes-update",{method:"PUT",body:e,params:e.oldMeterSN}))),i&&(e.properties={...i.properties,oldNewMappingColumn:e.newMeterMake,oldMeterMake:!0},l.push((0,y.default)("/form-attributes-update",{method:"PUT",body:e,params:e.oldMeterMake})));try{const e=await Promise.all(l);if(e.every((e=>e.success))){const e="O&M Mapping Done Successfully!";(0,x.A)(e,{variant:"success",autoHideDuration:5e3}),W(!1),$({...I,default:1,dataMapping:0})}else{var t,a;const r=(null===(t=e.find((e=>!e.success)))||void 0===t||null===(a=t.error)||void 0===a?void 0:a.message)||"Operation failed. Please try again.";(0,x.A)(r,{variant:"error"})}}catch(d){(0,x.A)("An error occurred. Please try again.",{variant:"error"})}}})),children:(0,A.jsxs)(n.Ay,{container:!0,spacing:4,sx:{p:2},children:[(0,A.jsx)(n.Ay,{item:!0,md:12,sx:{fontSize:22,fontWeight:"bold"},children:"O&M Mapping"}),(0,A.jsx)(n.Ay,{item:!0,md:6,xl:6,children:(0,A.jsx)(v.eu,{name:"oldMeterSN",label:"Old Meter Serial Number Field",menus:X,required:!0,disable:de})}),(0,A.jsx)(n.Ay,{item:!0,md:6,xl:6,children:(0,A.jsx)(v.eu,{name:"newMeterSN",label:"New Meter Serial Number Field",menus:X,required:!0,disable:de})}),(0,A.jsx)(n.Ay,{item:!0,md:6,xl:6,children:(0,A.jsx)(v.eu,{name:"oldMeterMake",label:"Old Meter Make Field",menus:X,required:!0,disable:de})}),(0,A.jsx)(n.Ay,{item:!0,md:6,xl:6,children:(0,A.jsx)(v.eu,{name:"newMeterMake",label:"New Meter Make Field",menus:X,required:!0,disable:de})}),(0,A.jsxs)(n.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:2},children:[de&&(0,A.jsx)(o.A,{size:"small",variant:"outlined",color:"error",onClick:()=>(async()=>{const e=null===X||void 0===X?void 0:X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterSN})),r=null===X||void 0===X?void 0:X.find((e=>{var r;return null===(r=e.properties)||void 0===r?void 0:r.oldMeterMake}));if(e||r){const d=[];if(e){const r={...e.properties};delete r.oldNewMappingColumn,delete r.oldMeterSN;const i={...e,properties:r};d.push((0,y.default)("/form-attributes-update",{method:"PUT",body:i,params:e.id}))}if(r){const e={...r.properties};delete e.oldNewMappingColumn,delete e.oldMeterMake;const i={...r,properties:e};d.push((0,y.default)("/form-attributes-update",{method:"PUT",body:i,params:r.id}))}try{const e=await Promise.all(d);if(e.every((e=>e.success))){const e="O&M Mapping Reset Successfully!";(0,x.A)(e,{variant:"success",autoHideDuration:5e3}),W(!1),$({...I,default:1,dataMapping:0})}else{var i,t;const r=(null===(i=e.find((e=>!e.success)))||void 0===i||null===(t=i.error)||void 0===t?void 0:t.message)||"Operation failed. Please try again.";(0,x.A)(r,{variant:"error"})}}catch(a){(0,x.A)("An error occurred. Please try again.",{variant:"error"})}}})(),children:"Reset"}),(0,A.jsx)(o.A,{size:"small",variant:"outlined",onClick:()=>{W(!1),te.reset()},children:"Cancel"}),!de&&(0,A.jsx)(o.A,{size:"small",type:"submit",variant:"contained",children:"Save"})]})]})})})]})}}}]);