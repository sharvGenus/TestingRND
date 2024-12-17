"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[5682],{75682:(e,r,i)=>{i.d(r,{W:()=>b});var t=i(9950),a=i(12257),u=i(4139),d=i(67535),l=i(9449),n=i(60666),o=i(26473),s=i(84601),q=i(96951),c=i(71826),m=i(62054),j=i(44414);const b=e=>{let{setOpen:r,rowData:i,title:b,refreshPagination:R,editPlaceOfSupply:Y,grnTransactionTypeId:p,isPtp:h}=e;const v=(e,r,i,t,u,d)=>(0,j.jsx)(a.A,{spacing:1,children:(0,j.jsx)(q.o3,{name:e,type:i,label:r,placeholder:u,disabled:d,...t&&{required:!0}})}),y=(0,l.mN)({resolver:(0,o.t)(n.Ik().shape({eWayBillNumber:s.A.other,eWayBillDate:s.A.other,...Y&&{placeOfSupply:s.A.other}})),mode:"all"}),{handleSubmit:g,setValue:f}=y,$=!!p;(0,t.useEffect)((()=>{f("eWayBillNumber",i.eWayBillNumber?i.eWayBillNumber:""),f("eWayBillDate",i.eWayBillDate?i.eWayBillDate.split("T")[0]:""),Y&&f("placeOfSupply",i.placeOfSupply?i.placeOfSupply:"")}),[f,i,Y]);return(0,j.jsx)(q.Op,{methods:y,onSubmit:g((async e=>{const t={eWayBillNumber:e.eWayBillNumber,eWayBillDate:e.eWayBillDate,...Y&&{placeOfSupply:e.placeOfSupply}};if($){var a,u,d,l,n,o;const e={projectId:null===i||void 0===i||null===(a=i.stock_ledgers)||void 0===a?void 0:a[0].projectId,requestNumber:null===i||void 0===i||null===(u=i.stock_ledgers)||void 0===u?void 0:u[0].requestNumber,transactionTypeId:p,storeId:null===i||void 0===i?void 0:i.toStoreId},r=await(0,c.default)("/stock-ledger-list",{method:"GET",query:e}),s=null===r||void 0===r||null===(d=r.data)||void 0===d||null===(l=d.data)||void 0===l||null===(n=l.rows)||void 0===n||null===(o=n[0])||void 0===o?void 0:o.stockLedgerDetailId,q=await(0,c.default)("/e-way-bill-update",{method:"PUT",body:t,params:s});if(null===q||void 0===q||!q.success)return void(0,m.A)("There was an error updating the transaction!",{variant:"error"})}else if(h){var s,q,j,b,v,g,f,w,N,S;const e={projectId:null===i||void 0===i||null===(s=i.stock_ledgers)||void 0===s||null===(q=s[0])||void 0===q?void 0:q.other_project_id,requestNumber:null===i||void 0===i||null===(j=i.stock_ledgers)||void 0===j||null===(b=j[0])||void 0===b?void 0:b.referenceDocumentNumber,transactionTypeId:"c384a987-d92c-481f-9223-605dd3d05338",storeId:null===i||void 0===i||null===(v=i.stock_ledgers)||void 0===v||null===(g=v[0])||void 0===g?void 0:g.other_store_id,isCancelled:!1},r=await(0,c.default)("/stock-ledger-list",{method:"GET",query:e}),a=null===r||void 0===r||null===(f=r.data)||void 0===f||null===(w=f.data)||void 0===w||null===(N=w.rows)||void 0===N||null===(S=N[0])||void 0===S?void 0:S.stockLedgerDetailId;if(a){const e=await(0,c.default)("/e-way-bill-update",{method:"PUT",body:t,params:a});if(null===e||void 0===e||!e.success)return void(0,m.A)("There was an error updating the transaction!",{variant:"error"})}}const A=await(0,c.default)("/e-way-bill-update",{method:"PUT",body:t,params:null===i||void 0===i?void 0:i.id});null!==A&&void 0!==A&&A.success?(y.reset(),r(!1),"function"===typeof R&&R()):(0,m.A)("There was an error updating the transaction!",{variant:"error"})})),children:(0,j.jsxs)(u.Ay,{container:!0,spacing:3,sx:{p:2},children:[(0,j.jsxs)(u.Ay,{item:!0,md:12,sx:{fontSize:22,fontWeight:"bold"},children:["Edit ",b," Receipt"]}),(0,j.jsx)(u.Ay,{item:!0,md:12,children:v("eWayBillNumber","E-Way Bill Number","text",!0)}),(0,j.jsx)(u.Ay,{item:!0,md:12,children:v("eWayBillDate","E-Way Bill Date","date",!0)}),Y&&(0,j.jsx)(u.Ay,{item:!0,md:12,children:v("placeOfSupply","Place Of Supply","text",!0)}),(0,j.jsx)(u.Ay,{item:!0,xs:12,sx:{display:"flex",justifyContent:"flex-end",gap:2},children:(0,j.jsx)(d.A,{size:"small",type:"submit",variant:"contained",children:"Submit"})})]})})};b.defaultProps={isPtp:!1}},84601:(e,r,i)=>{i.d(r,{A:()=>o});var t=i(60666);const a=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],u=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],d=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},l=["nothing","",()=>!0],n=function(e,r,i){let t=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const a=new Date(e),u=new Date(r),d=new Date(i);return t?d<=a&&a<=u:d<=a&&a>=u},o={allowedColumns:t.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:t.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:t.Yj().required("Required").nullable(),formType:t.Yj().required("Required").nullable(),taskType:t.Yj().required("Required").nullable(),code:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:t.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:t.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:t.Yj().required("Required"),title:t.Yj().required("Required").nullable(),office:t.Yj().required("Required").nullable(),masterCode:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:t.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:t.Yj().required("Required"),gstNumber:t.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:t.Yj().required("Required"),storePhoto:t.Yj().required("Required"),email:t.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:t.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:t.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:t.Yj().required("Required"),nother:t.Yj().nullable().required("Required"),otherArray:t.YO().min(1,"Please select atleast one field"),areaLevel:t.YO().min(1,"Please select atleast one level."),formTitle:t.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:t.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:t.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:t.Yj().required(" "),telephone:t.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:t.Yj().required("Required"),registeredAddress:t.Yj().required("Required"),quantity:t.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:t.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:t.ai().test(...d()).test(...a).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t.ai().test(...r?d():l).test(...a).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:t.Yj().required("Required"),state:t.Yj().required("Required"),city:t.Yj().required("Required"),registeredCountry:t.Yj().required("Required"),registeredState:t.Yj().required("Required"),registeredCity:t.Yj().required("Required"),organizationType:t.Yj().nullable().required("Required"),organizationCode:t.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:t.Yj().nullable().required("Required"),organizationLocationId:t.Yj().required("Required"),integrationId:t.Yj().required("Required"),firm:t.Yj().required("Required"),movementType:t.Yj().required("Required"),supplier:t.Yj().required("Required"),masterMaker:t.Yj().required("Required"),projectMasterMaker:t.Yj().required("Required"),lov:t.Yj().required("Required"),date:t.Yj().required("Required"),fromDate:t.Yj().required("Required"),toDate:t.Yj().when("fromDate",{is:e=>!!e,then:t.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.fromDate).getTime()}))}),invoiceNumber:t.Yj().required("Required"),challanNumber:t.Yj().required("Required"),poNumber:t.Yj().required("Required"),workOrderNumber:t.Yj().required("Required"),receivingStore:t.Yj().required("Required"),uom:t.Yj().required("Required"),project:t.Yj().nullable().required("Required"),projectArr:t.YO().of(t.gl()).nullable().required("Required").min(1,"Required"),organizationArr:t.YO().of(t.gl()).nullable().required("Required").min(1,"Required"),accessProject:t.Yj().nullable().required("Required"),rate:t.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:t.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:t.Yj().required("Required"),rangeTo:t.Yj().required("Required"),requiredWithLabel:()=>t.Yj().nullable().required("Required"),requiredWithNonZero:e=>t.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>t.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:t.ai().required("Required"),isSerialize:t.Yj().required("Please select a checkbox"),vehicleNumber:t.Yj().required("Required"),vehicleNumberOptional:t.Yj().nullable(),inventoryNameOptional:t.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:t.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:t.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:t.Yj().required("Required"),eWayBillNumber:t.Yj().required("Required"),eWayBillDate:t.Yj().required("Required"),actualReceiptDate:t.Yj().when("eWayBillDate",{is:e=>!!e,then:t.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,r){return new Date(e).getTime()>=new Date(r.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:t.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:t.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:t.Yj().nullable().required("Required"),placeOfTransfer:t.Yj().required("Required"),contractorStore:t.Yj().nullable().required("Required"),projectSiteStoreLocation:t.Yj().required("Required"),contractorStoreLocation:t.Yj().nullable().required("Required"),contractorEmployee:t.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>t.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:t.Yj().required("Required"),longDescription:t.Yj().required("Required"),hsnCode:t.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:t.Yj().required("Required"),store:t.Yj().nullable().required("Required"),accessStore:t.Yj().nullable().required("Required"),series:t.Yj().required("Required"),material:t.Yj().required("Required"),materialType:t.Yj().required("Required"),materialCode:t.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:t.Yj().nullable().required("Required"),accessOrganizationId:t.Yj().nullable().required("Required"),company:t.Yj().required("Required"),contractor:t.Yj().nullable().required("Required"),contractorId:t.Yj().required("Required"),fromInstaller:t.Yj().nullable().required("Required"),toInstaller:t.Yj().nullable().required("Required"),fromStoreLocationId:t.Yj().nullable().required("Required"),toStoreLocationId:t.Yj().nullable().required("Required"),storeLocationId:t.Yj().nullable().required("Required"),installerStoreLocationId:t.Yj().nullable().required("Required"),accessStoreLocationId:t.Yj().nullable().required("Required"),fromStore:t.Yj().nullable().required("Required"),toStore:t.Yj().required("Required"),transporterName:t.Yj().required("Required"),customerSiteStoreId:t.Yj().nullable().required("Required"),toCustomerId:t.Yj().nullable().required("Required"),financialYear:t.Yj().required("Required"),user:t.Yj().required("Required"),accessUser:t.Yj().nullable().required("Required"),rightsFor:t.Yj().nullable().required("Required"),gaaLevelId:t.Yj().nullable().required("Required"),networkLevelId:t.Yj().nullable().required("Required"),server:t.Yj().required("Required"),port:t.Yj().required("Required"),encryption:t.Yj().required("Required"),requisitionNumber:t.Yj().nullable().required("Required"),password:t.Yj().required("Required"),transaction:t.Yj().nullable().required("Required"),serviceCenter:t.Yj().nullable().required("Required"),scrapLocation:t.Yj().nullable().required("Required"),effectiveFrom:t.Yj().required("Required"),effectiveTo:t.Yj().required("Required"),displayName:t.Yj().required("Required"),templateName:t.Yj().required("Required"),subject:t.Yj().required("Required"),from:t.Yj().required("Required"),to:t.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:t.Yj().required("Required"),attachmentsWhenIsAuthorized:t.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:t.Yj().nullable().required("Required")}),requestNumber:t.Yj().required("Required"),remarks:t.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:t.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:t.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:t.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>t.Yj().required("Required"),startDateRange:(e,r,i)=>t.Yj().required("Required").test("date-comparison",`${r} must be >= ${i}`,(function(r){return function(e,r){let i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const t=new Date(e),a=new Date(r);return i?t<=a:t>=a}(r,e,!1)})),endDateRange:(e,r,i,a,u,d)=>t.Yj().required("Required").test("date-comparison",`${i} must be <= ${a} and >= ${u}`,(function(i){return n(i,e,r,!d)})),endDateRangeMax:(e,r,i,a,u,d)=>t.Yj().required("Required").test("date-comparison",`${i} must be >= ${a} and >= ${u}`,(function(i){return n(i,e,r,!d)})),month:e=>t.ai().test(...d(e)).test(...u).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,r,i)=>t.ai().test(...d(r)).test(...u).typeError(`Please enter valid ${r}`).required("Required").max(e,`${r} must be less than equal to ${i}`),checkQty:e=>t.ai().test(...d(e)).test(...a).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return r||r>=0?t.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(r,`Maximum quantity allowed: ${r||0}.`).required("Required"):t.ai().nullable().transform(((e,r)=>/^\s*$/.test(r)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:t.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}}}]);