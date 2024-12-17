"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[3991],{64499:(e,i,d)=>{d.d(i,{A:()=>q});var a=d(9950),r=d(65669),n=d(43263),t=d(57191),l=d(95537),o=d(67535),u=d(87233),c=d(44414);q.defaultProps={title:"Confirm Action",message:"Are you sure to perform this action",closeBtnTitle:"Cancel",confirmBtnTitle:"Ok"};const b={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:350,bgcolor:"background.paper",borderRadius:"10px",p:3},s={display:"flex",flexDirection:"row",padding:"15px 0"},m={display:"flex",justifyContent:"flex-end",gap:2},f={marginTop:2,display:"flex",fontSize:"14px"};function q(e){let{open:i,handleClose:d,title:q,message:C,closeBtnTitle:j,confirmBtnTitle:R,handleConfirm:p,confirmColor:Y}=e;const[h,v]=(0,a.useState)(null);return(0,a.useEffect)((()=>{v(null)}),[i]),(0,c.jsx)("div",{children:(0,c.jsx)(r.A,{"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",open:i,closeAfterTransition:!0,slots:{backdrop:n.A},slotProps:{backdrop:{timeout:500}},children:(0,c.jsx)(t.A,{in:i,children:(0,c.jsxs)(l.A,{sx:b,children:[(0,c.jsx)(u.A,{id:"transition-modal-title",variant:"h4",children:q}),(0,c.jsx)(u.A,{id:"transition-modal-title",variant:"h6",sx:s,children:C}),(0,c.jsxs)(l.A,{sx:m,children:[!!d&&(0,c.jsx)(o.A,{onClick:d,size:"small",variant:"outlined",color:"primary",children:j}),!!p&&(0,c.jsx)(o.A,{onClick:p,size:"small",variant:"contained",color:Y||"error",children:R})]}),h&&(0,c.jsx)(u.A,{variant:"p",color:"red",sx:f,children:h})]})})})})}},26059:(e,i,d)=>{d.d(i,{Q:()=>a});const a=[{id:"f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee",tableIdCell:"a1bfc8a2-9674-4940-bb43-19b6f600e674",name:"GAA Level Entry",columns:[{id:"b3bfc8a2-9674-4940-bb43-19b6f600e674",name:"Level ID",isColumn:!1,isCondition:!1},{id:"b3bfc8a2-9674-4940-bb43-19b6f600e674",name:"Level Name",table:"d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7",cell:"8d3e6d07-8f5b-4942-afab-6b5be6594a89",idCell:"498f5b52-5b51-4c7e-a16d-113bcc47fc4e",isColumn:!1,isCondition:!0,conditionFunction:e=>[{column:"194f5b52-5b51-4c7e-a16d-113bcc47fc4e",operation:"et",value:e}]},{id:"b8c68440-19de-4908-8362-d0d41b0c89a4",name:"Entry Name",isColumn:!0,isCondition:!1},{id:"b1bfc8a2-9674-4940-bb43-19b6f600e674",name:"Entry Code",isColumn:!0,isCondition:!1},{id:"a1bfc8a2-9674-4940-bb43-19b6f600e674",name:"Entry ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"a1bfc8a2-9674-4940-bb43-19b6f600e674",name:"Entry Name",table:"f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee",cell:"b8c68440-19de-4908-8362-d0d41b0c89a4",idCell:"a1bfc8a2-9674-4940-bb43-19b6f600e674",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"b3bfc8a2-9674-4940-bb43-19b6f600e672",name:"Parent ID",isColumn:!1,isDep:!0,isCondition:!1}]},{id:"efc06b18-43f9-4040-b09c-b15667de74b1",tableIdCell:"132b867c-eda3-44ce-8c2a-d04dc03ab3e7",name:"Network Level Entry",columns:[{id:"337b367c-eda3-44ce-8c2a-d04dc03ab3e7",name:"Level ID",isColumn:!1,isCondition:!1},{id:"337b367c-eda3-44ce-8c2a-d04dc03ab3e7",name:"Level Name",table:"d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7",cell:"8d3e6d07-8f5b-4942-afab-6b5be6594a89",idCell:"498f5b52-5b51-4c7e-a16d-113bcc47fc4e",isColumn:!1,isCondition:!0,conditionFunction:e=>[{column:"194f5b52-5b51-4c7e-a16d-113bcc47fc4e",operation:"et",value:e}]},{id:"34607538-5f8f-4c59-81d7-d0638613ac45",name:"Entry Name",isColumn:!0,isCondition:!1},{id:"137b867c-eda3-44ce-8c2a-d04dc03ab3e7",name:"Entry Code",isColumn:!0,isCondition:!1},{id:"132b867c-eda3-44ce-8c2a-d04dc03ab3e7",name:"Entry ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"132b867c-eda3-44ce-8c2a-d04dc03ab3e7",name:"Entry Name",table:"f38ec129-0b3f-4e9d-b1b3-cf0ea21688ee",cell:"34607538-5f8f-4c59-81d7-d0638613ac45",idCell:"132b867c-eda3-44ce-8c2a-d04dc03ab3e7",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"337b367c-eda3-44ce-8c2a-d04dc03ab3e8",name:"Parent ID",isColumn:!1,isDep:!0,isCondition:!1}]},{id:"3a094270-e052-41f1-821a-236442b98303",tableIdCell:"1d61f0d9-ce90-47dd-a469-d428b11fcb1d",name:"Global Master Maker",columns:[{id:"95622402-6212-4e80-8bb2-63589bc014e9",name:"Master Name",isColumn:!0,isCondition:!1},{id:"1d61f0d9-ce90-47dd-a469-d428b11fcb1d",name:"Master ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"1d61f0d9-ce90-47dd-a469-d428b11fcb1d",name:"Master Name",table:"3a094270-e052-41f1-821a-236442b98303",cell:"95622402-6212-4e80-8bb2-63589bc014e9",idCell:"1d61f0d9-ce90-47dd-a469-d428b11fcb1d",isColumn:!1,isCondition:!0,conditionFunction:()=>[]}]},{id:"553e753f-1bce-476e-939f-1fd98d9daafd",tableIdCell:"be91d676-9aff-4890-827f-7ba886bf04d8",name:"Global Master LOV",columns:[{id:"29ea6177-c9ea-4449-9691-eff82800f7bf",name:"Master ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"29ea6177-c9ea-4449-9691-eff82800f7bf",name:"Master Name",table:"3a094270-e052-41f1-821a-236442b98303",cell:"95622402-6212-4e80-8bb2-63589bc014e9",idCell:"1d61f0d9-ce90-47dd-a469-d428b11fcb1d",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"be91d676-9aff-4890-827f-7ba886bf04d8",name:"LOV ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"be91d676-9aff-4890-827f-7ba886bf04d8",name:"LOV Name",table:"553e753f-1bce-476e-939f-1fd98d9daafd",cell:"eb84241e-35bb-4b5a-948d-6b8ce55b5c24",idCell:"be91d676-9aff-4890-827f-7ba886bf04d8",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"eb84241e-35bb-4b5a-948d-6b8ce55b5c24",name:"LOV Name",isColumn:!0,isCondition:!1}]},{id:"180a68c1-ea90-4af6-a98b-60544a4f9284",tableIdCell:"1e7bd0dd-0724-40f4-9395-8ff5394cd7e3",name:"Project Master Maker",columns:[{id:"1eabd0dd-0724-40f4-9395-8ff5394cd7e3",name:"Master Name",isColumn:!0,isCondition:!1},{id:"12abd0dd-0724-40f4-9395-8ff5394cd7e3",name:"Project ID",isColumn:!1,isCondition:!1},{id:"1e7bd0dd-0724-40f4-9395-8ff5394cd7e3",name:"Master ID",isColumn:!1,isCondition:!1},{id:"1e7bd0dd-0724-40f4-9395-8ff5394cd7e3",name:"Master Name",table:"180a68c1-ea90-4af6-a98b-60544a4f9284",cell:"1eabd0dd-0724-40f4-9395-8ff5394cd7e3",idCell:"1e7bd0dd-0724-40f4-9395-8ff5394cd7e3",isColumn:!1,isCondition:!0,conditionFunction:e=>[{column:"12abd0dd-0724-40f4-9395-8ff5394cd7e3",operation:"et",value:e}]}]},{id:"3f7a5e93-612f-4ea9-b1b3-0288d2bb863d",tableIdCell:"6eabd0dd-0724-40f4-9395-8ff5394cd7f3",name:"Project Master LOV",columns:[{id:"6eabd0dd-0724-40f4-9395-8ff5394cd7e3",name:"LOV Name",isColumn:!0,isCondition:!1},{id:"437b367c-eda3-44ce-8c2a-d04dc03ab3e6",name:"Master ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"437b367c-eda3-44ce-8c2a-d04dc03ab3e6",name:"Master Name",table:"180a68c1-ea90-4af6-a98b-60544a4f9284",cell:"1eabd0dd-0724-40f4-9395-8ff5394cd7e3",idCell:"1e7bd0dd-0724-40f4-9395-8ff5394cd7e3",isColumn:!1,isCondition:!0,conditionFunction:e=>[{column:"12abd0dd-0724-40f4-9395-8ff5394cd7e3",operation:"et",value:e}]},{id:"6eabd0dd-0724-40f4-9395-8ff5394cd7f3",name:"LOV ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"6eabd0dd-0724-40f4-9395-8ff5394cd7f3",name:"LOV Name",table:"3f7a5e93-612f-4ea9-b1b3-0288d2bb863d",cell:"6eabd0dd-0724-40f4-9395-8ff5394cd7e3",idCell:"6eabd0dd-0724-40f4-9395-8ff5394cd7f3",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"e7abd0dd-0724-40f4-9395-8ff5394cd7e3",name:"LOV Code",isColumn:!0,isCondition:!1}]},{id:"8109792c-c6f6-4b54-9e84-fff897900149",tableIdCell:"09282f60-5ed3-4a34-8768-fac57ce8d240",name:"QA Master Maker",columns:[{id:"b4ea9335-fafa-4adc-8479-d60d29b16dc4",name:"Master Name",isColumn:!0,isCondition:!1},{id:"b456d348-4c30-429f-b999-73ccbbd630fe",name:"Project ID",isColumn:!1,isCondition:!1},{id:"09282f60-5ed3-4a34-8768-fac57ce8d240",name:"Master ID",isColumn:!1,isCondition:!1},{id:"09282f60-5ed3-4a34-8768-fac57ce8d240",name:"Master Name",table:"8109792c-c6f6-4b54-9e84-fff897900149",cell:"b4ea9335-fafa-4adc-8479-d60d29b16dc4",idCell:"09282f60-5ed3-4a34-8768-fac57ce8d240",isColumn:!1,isCondition:!0,conditionFunction:e=>[{column:"b456d348-4c30-429f-b999-73ccbbd630fe",operation:"et",value:e}]},{id:"294ae2f6-fdd6-4886-bc8a-6d4c67358744",name:"Meter Type ID",isColumn:!1,isCondition:!1},{id:"294ae2f6-fdd6-4886-bc8a-6d4c67358744",name:"Meter Type Name",table:"553e753f-1bce-476e-939f-1fd98d9daafd",cell:"eb84241e-35bb-4b5a-948d-6b8ce55b5c24",idCell:"be91d676-9aff-4890-827f-7ba886bf04d8",isColumn:!1,isCondition:!0,conditionFunction:()=>[{column:"29ea6177-c9ea-4449-9691-eff82800f7bf",operation:"et",value:"0eba82dc-29af-4694-b943-af7d86fc686f"}]}]},{id:"44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",tableIdCell:"2b40d6b3-8009-49de-9277-2a6e39cb1397",name:"QA Master LOV",columns:[{id:"9d30bfc7-ff0b-4d7a-9e8f-6e58fa21d849",name:"Major Contributor Name",isColumn:!0,isCondition:!1},{id:"8e64a78e-8183-4d1d-8552-800022acde5f",name:"Master ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"8e64a78e-8183-4d1d-8552-800022acde5f",name:"Master Name",table:"8109792c-c6f6-4b54-9e84-fff897900149",cell:"b4ea9335-fafa-4adc-8479-d60d29b16dc4",idCell:"09282f60-5ed3-4a34-8768-fac57ce8d240",isColumn:!1,isCondition:!0,conditionFunction:e=>[{column:"b456d348-4c30-429f-b999-73ccbbd630fe",operation:"et",value:e}]},{id:"2b40d6b3-8009-49de-9277-2a6e39cb1397",name:"Major Contributor ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"2b40d6b3-8009-49de-9277-2a6e39cb1397",name:"Major Contributor Name",table:"44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",cell:"9d30bfc7-ff0b-4d7a-9e8f-6e58fa21d849",idCell:"2b40d6b3-8009-49de-9277-2a6e39cb1397",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"cbb9584d-9fc6-46e0-95c2-a061f491705d",name:"Major Contributor Code",isColumn:!0,isCondition:!1},{id:"50757854-92b9-450f-b0e9-e360980e72f2",name:"Priority",isColumn:!0,isCondition:!1},{id:"0602328e-288a-4e46-931f-c2a83594f5e7",name:"Defect",isColumn:!0,isCondition:!1}]},{id:"4236c773-cb7e-4f33-821c-32338daa49dc",tableIdCell:"77bd1cbb-fa7d-454b-b359-4ceae1eb4291",name:"Users",columns:[{id:"cb14d5bc-d42e-4e78-8c3b-699308e034b2",name:"User Name",isColumn:!0,isCondition:!1},{id:"77bd1cbb-fa7d-454b-b359-4ceae1eb4291",name:"User ID",isColumn:!1,isCondition:!1},{id:"77bd1cbb-fa7d-454b-b359-4ceae1eb4291",name:"User Name",table:"4236c773-cb7e-4f33-821c-32338daa49dc",cell:"cb14d5bc-d42e-4e78-8c3b-699308e034b2",idCell:"77bd1cbb-fa7d-454b-b359-4ceae1eb4291",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"2d5c62cf-32ec-40dc-af0d-4b0b0a7c7e5a",name:"Organization Type ID",isColumn:!1,isCondition:!1},{id:"a0d8e590-5c28-4454-858e-7a91ab7cd2fa",name:"Organization Name ID",isColumn:!1,isDep:!0,isCondition:!1}]},{id:"4993b4e1-fe3a-4c84-9206-cddb3aee1dae",tableIdCell:"0d3fa265-d395-4a09-9d30-772c6d0ae45a",name:"Organization",columns:[{id:"7b5cee77-ecbe-4f53-bcb1-a97b4a940bcb",name:"Organization Name",isColumn:!0,isCondition:!1},{id:"0d3fa265-d395-4a09-9d30-772c6d0ae45c",name:"Organization Type ID",isColumn:!1,isDep:!0,isCondition:!1},{id:"0d3fa265-d395-4a09-9d30-772c6d0ae45c",name:"Organization Type",table:"553e753f-1bce-476e-939f-1fd98d9daafd",cell:"eb84241e-35bb-4b5a-948d-6b8ce55b5c24",idCell:"be91d676-9aff-4890-827f-7ba886bf04d8",isColumn:!1,isCondition:!1,conditionFunction:()=>[{column:"29ea6177-c9ea-4449-9691-eff82800f7bf",operation:"et",value:"b2cb6cc5-7fba-410c-8ac0-294df90829f4"}]},{id:"0d3fa265-d395-4a09-9d30-772c6d0ae45a",name:"Organization ID",table:"4993b4e1-fe3a-4c84-9206-cddb3aee1dae",cell:"7b5cee77-ecbe-4f53-bcb1-a97b4a940bcb",idCell:"0d3fa265-d395-4a09-9d30-772c6d0ae45a",isColumn:!1,isCondition:!1,conditionFunction:()=>[]}]},{id:"2bfda55d-d007-4c75-b696-5ee05ef1ec66",tableIdCell:"",name:"Serialize Material",columns:[{id:"11411549-19df-48e2-8073-bdeb064e99d4",name:"Material ID",isColumn:!1,isCondition:!1},{id:"11411549-19df-48e2-8073-bdeb064e99d4",name:"Material Name",table:"f3d13141-3cba-489d-9987-5f72a3e345c4",cell:"1af33948-9a71-414c-b59f-03fb4813fa8a",idCell:"5b7dbdef-abac-4710-8214-8f3abb501696",isColumn:!1,isCondition:!0,conditionFunction:()=>[]},{id:"11bfad18-e3df-42b4-b2b5-295b245ac85b",name:"Serial Number",isColumn:!0,isDep:!0,isCondition:!1},{id:"aca8818c-ecd2-4615-8a0c-99980c078678",name:"Parent ID",isDep:!0,isColumn:!1,isCondition:!1}]}]},84601:(e,i,d)=>{d.d(i,{A:()=>u});var a=d(60666);const r=["is-decimal-up-to-3-places","Must have up to 3 decimal places",e=>!e||/^\d+(\.\d{1,3})?$/.test(e.toString())],n=["is-decimal-up-to-2-places","Must have up to 2 decimal places",e=>!e||/^\d+(\.\d{1,2})?$/.test(e.toString())],t=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;return["is-non-zero",`${e||"Quantity"} should be greater than zero`,e=>e>0]},l=["nothing","",()=>!0],o=function(e,i,d){let a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];const r=new Date(e),n=new Date(i),t=new Date(d);return a?t<=r&&r<=n:t<=r&&r>=n},u={allowedColumns:a.ai().typeError("Value must be a number").min(1,"Value must be between 1 and 5").max(5,"Value must be between 1 and 5").required(""),name:a.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid name").required("Required"),form:a.Yj().required("Required").nullable(),formType:a.Yj().required("Required").nullable(),taskType:a.Yj().required("Required").nullable(),code:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required").nullable(),inventoryName:a.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid name").required("Required"),particulars:a.Yj().matches(/^[A-Za-z0-9\-_'\s(),./]+$/,"Please enter valid particulars").required("Required"),orgName:a.Yj().required("Required"),title:a.Yj().required("Required").nullable(),office:a.Yj().required("Required").nullable(),masterCode:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),projectName:a.Yj().matches(/^(?!0\d).*$/,"Leading zero values are not allowed").required("Required"),type:a.Yj().required("Required"),gstNumber:a.Yj().matches(/^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,"Please enter valid GST number").required("Required").nullable(),attachments:a.Yj().required("Required"),storePhoto:a.Yj().required("Required"),email:a.Yj().matches(/^[a-zA-Z0-9._]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter valid email").required("Required").nullable(),mobileNumber:a.Yj().matches("^((\\+91)?|91)?[6789]\\d{9}$","Please enter valid mobile number").required("Required"),mobileNumberOptional:a.Yj().nullable().test("isValidOrEmpty","Please enter a valid mobile number",(function(e){return!e||/^((\+91)?|91)?[6789]\d{9}$/.test(e)})),other:a.Yj().required("Required"),nother:a.Yj().nullable().required("Required"),otherArray:a.YO().min(1,"Please select atleast one field"),areaLevel:a.YO().min(1,"Please select atleast one level."),formTitle:a.Yj().matches(/^[A-Za-z ]*$/,"Only A-Z letters allowed.").required("Required"),attributeTitle:a.Yj().required(" ").matches(/^[A-Z].*$/,"First letter must be capital"),dbColumn:a.Yj().matches(/^(?!.*__)[a-z_]{1,20}$/,"Only use small letters and underscore. (Max length 20)").required(""),required:a.Yj().required(" "),telephone:a.Yj().matches(/\b(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{10})\b/,"Enter valid telephone number").nullable(),address:a.Yj().required("Required"),registeredAddress:a.Yj().required("Required"),quantity:a.ai().typeError("Please enter valid quantity").required("Required"),billingQuantity:a.ai().typeError("Please enter valid billing quantity").required("Required"),trxnQuantity:a.ai().test(...t()).test(...r).typeError("Please enter valid quantity").required("Required"),maxQuantity:function(e){let i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.ai().test(...i?t():l).test(...r).required("Required").typeError("Please enter a valid Quantity").max(e,`Maximum quantity allowed: ${e||0}.`)},country:a.Yj().required("Required"),state:a.Yj().required("Required"),city:a.Yj().required("Required"),registeredCountry:a.Yj().required("Required"),registeredState:a.Yj().required("Required"),registeredCity:a.Yj().required("Required"),organizationType:a.Yj().nullable().required("Required"),organizationCode:a.ai().typeError("Value must be a valid integer").required("Required").integer("Value must be an integer").max("2147483647","Value exceeds maximum allowed"),organizationStoreId:a.Yj().nullable().required("Required"),organizationLocationId:a.Yj().required("Required"),integrationId:a.Yj().required("Required"),firm:a.Yj().required("Required"),movementType:a.Yj().required("Required"),supplier:a.Yj().required("Required"),masterMaker:a.Yj().required("Required"),projectMasterMaker:a.Yj().required("Required"),lov:a.Yj().required("Required"),date:a.Yj().required("Required"),fromDate:a.Yj().required("Required"),toDate:a.Yj().when("fromDate",{is:e=>!!e,then:a.Yj().test("isGreaterThanFromDate","To Date cannot be less than From date",(function(e,i){return new Date(e).getTime()>=new Date(i.parent.fromDate).getTime()}))}),invoiceNumber:a.Yj().required("Required"),challanNumber:a.Yj().required("Required"),poNumber:a.Yj().required("Required"),workOrderNumber:a.Yj().required("Required"),receivingStore:a.Yj().required("Required"),uom:a.Yj().required("Required"),project:a.Yj().nullable().required("Required"),projectArr:a.YO().of(a.gl()).nullable().required("Required").min(1,"Required"),organizationArr:a.YO().of(a.gl()).nullable().required("Required").min(1,"Required"),accessProject:a.Yj().nullable().required("Required"),rate:a.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid rate").required("Required"),tax:a.Yj().matches(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/,"Enter valid tax").required("Required"),rangeFrom:a.Yj().required("Required"),rangeTo:a.Yj().required("Required"),requiredWithLabel:()=>a.Yj().nullable().required("Required"),requiredWithNonZero:e=>a.ai().required("Required").min(1,`${e} must be greater than zero`).typeError(`${e} must be a number`),endRange:e=>a.ai().required("Required").min(e,"End Range must be greater than start range").typeError("End Range must be a number"),value:a.ai().required("Required"),isSerialize:a.Yj().required("Please select a checkbox"),vehicleNumber:a.Yj().required("Required"),vehicleNumberOptional:a.Yj().nullable(),inventoryNameOptional:a.Yj().nullable().test("isValidOrEmpty","Please enter valid name",(function(e){return!e||/^[A-Za-z0-9\-_'\s(),./]+$/.test(e)})),aadharNumber:a.Yj().matches(/^\d{12}$/,"Please enter valid aadhar number"),panNumber:a.Yj().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"Please enter valid PAN Number"),lrNumber:a.Yj().required("Required"),eWayBillNumber:a.Yj().required("Required"),eWayBillDate:a.Yj().required("Required"),actualReceiptDate:a.Yj().when("eWayBillDate",{is:e=>!!e,then:a.Yj().test("isGreaterThanEWayBillDate","Actual receipt date cannot be less than e-way bill date",(function(e,i){return new Date(e).getTime()>=new Date(i.parent.eWayBillDate).getTime()}))}).required("Required"),pincode:a.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),registeredPincode:a.Yj().min(6,"Enter valid pincode").max(6,"Enter valid pincode").required("Required"),projectSiteStore:a.Yj().nullable().required("Required"),placeOfTransfer:a.Yj().required("Required"),contractorStore:a.Yj().nullable().required("Required"),projectSiteStoreLocation:a.Yj().required("Required"),contractorStoreLocation:a.Yj().nullable().required("Required"),contractorEmployee:a.Yj().required("Required"),alphanumericWithAlphabetRequired:e=>a.Yj().matches(/^[^\s]*$/,`Enter Valid ${e}`).required("Required"),description:a.Yj().required("Required"),longDescription:a.Yj().required("Required"),hsnCode:a.Yj().min(6,"Enter valid HSN Code").max(8,"Enter valid HSN Code").required("Required"),isSerialNumber:a.Yj().required("Required"),store:a.Yj().nullable().required("Required"),accessStore:a.Yj().nullable().required("Required"),series:a.Yj().required("Required"),material:a.Yj().required("Required"),materialType:a.Yj().required("Required"),materialCode:a.Yj().required("Required").matches(/^\S+$/,"Should not contain any space").matches(/[0-9]/,"Should contain at least one number").matches(/^(?!0\d).*$/,"Leading zero values are not allowed"),organizationId:a.Yj().nullable().required("Required"),accessOrganizationId:a.Yj().nullable().required("Required"),company:a.Yj().required("Required"),contractor:a.Yj().nullable().required("Required"),contractorId:a.Yj().required("Required"),fromInstaller:a.Yj().nullable().required("Required"),toInstaller:a.Yj().nullable().required("Required"),fromStoreLocationId:a.Yj().nullable().required("Required"),toStoreLocationId:a.Yj().nullable().required("Required"),storeLocationId:a.Yj().nullable().required("Required"),installerStoreLocationId:a.Yj().nullable().required("Required"),accessStoreLocationId:a.Yj().nullable().required("Required"),fromStore:a.Yj().nullable().required("Required"),toStore:a.Yj().required("Required"),transporterName:a.Yj().required("Required"),customerSiteStoreId:a.Yj().nullable().required("Required"),toCustomerId:a.Yj().nullable().required("Required"),financialYear:a.Yj().required("Required"),user:a.Yj().required("Required"),accessUser:a.Yj().nullable().required("Required"),rightsFor:a.Yj().nullable().required("Required"),gaaLevelId:a.Yj().nullable().required("Required"),networkLevelId:a.Yj().nullable().required("Required"),server:a.Yj().required("Required"),port:a.Yj().required("Required"),encryption:a.Yj().required("Required"),requisitionNumber:a.Yj().nullable().required("Required"),password:a.Yj().required("Required"),transaction:a.Yj().nullable().required("Required"),serviceCenter:a.Yj().nullable().required("Required"),scrapLocation:a.Yj().nullable().required("Required"),effectiveFrom:a.Yj().required("Required"),effectiveTo:a.Yj().required("Required"),displayName:a.Yj().required("Required"),templateName:a.Yj().required("Required"),subject:a.Yj().required("Required"),from:a.Yj().required("Required"),to:a.YO().min(1,"Provide at least one Receiver Email"),supervisorNumber:a.Yj().required("Required"),attachmentsWhenIsAuthorized:a.Yj().nullable().when("authorizedUser",{is:e=>"true"===e||!0===e,then:a.Yj().nullable().required("Required")}),requestNumber:a.Yj().required("Required"),remarks:a.Yj().test("isLength","Length should not be more then 256 characters",(e=>!e||(null===e||void 0===e?void 0:e.length)<=256)).nullable(),bankName:a.Yj().matches(/^[A-Za-z ]*$/,"Please enter valid bank name").required("Required"),ifscCode:a.Yj().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/,"Please enter a valid IFSC code").required("IFSC code is required"),accountNumber:a.Yj().matches(/^[0-9]{1,}$/,"Please enter a valid account number").required("Required"),endDate:()=>a.Yj().required("Required"),startDateRange:(e,i,d)=>a.Yj().required("Required").test("date-comparison",`${i} must be >= ${d}`,(function(i){return function(e,i){let d=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const a=new Date(e),r=new Date(i);return d?a<=r:a>=r}(i,e,!1)})),endDateRange:(e,i,d,r,n,t)=>a.Yj().required("Required").test("date-comparison",`${d} must be <= ${r} and >= ${n}`,(function(d){return o(d,e,i,!t)})),endDateRangeMax:(e,i,d,r,n,t)=>a.Yj().required("Required").test("date-comparison",`${d} must be >= ${r} and >= ${n}`,(function(d){return o(d,e,i,!t)})),month:e=>a.ai().test(...t(e)).test(...n).typeError(`Please enter valid ${e}`).required("Required"),endMonthRange:(e,i,d)=>a.ai().test(...t(i)).test(...n).typeError(`Please enter valid ${i}`).required("Required").max(e,`${i} must be less than equal to ${d}`),checkQty:e=>a.ai().test(...t(e)).test(...r).typeError(`Please enter valid ${e}`).required("Required"),checkForInteger:function(e){let i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return i||i>=0?a.ai().nullable().transform(((e,i)=>/^\s*$/.test(i)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).max(i,`Maximum quantity allowed: ${i||0}.`).required("Required"):a.ai().nullable().transform(((e,i)=>/^\s*$/.test(i)?null:e)).integer(`${e} must be an integer`).required("Required").typeError(`${e} must be an integer`).min(1,`${e} must be greater than 0`).required("Required")},priority:a.ai().typeError("Must be a number").integer("Must be an integer").min(0,"Must be a non-negative number").required("Required")}},15999:(e,i,d)=>{d.d(i,{A:()=>R});var a=d(9950),r=d(80678),n=d(41787),t=d(81831),l=d(72145),o=d(12257),u=d(87233),c=d(14341),b=d(94641),s=d(9449),m=d(43974),f=d(30545),q=d(19673),C=d(22580),j=d(44414);const R=e=>{let{name:i,label:d,onChange:R,disabled:p,required:Y=!1,...h}=e;const{control:v}=(0,s.xW)(),{errorMessage:y,timeFormat:g,pickerType:D,minDate:I,maxDate:M,setInsideErrors:x}=h,A=e=>(0,m.A)(new Date(e).getTime()-198e5,"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),N=(0,a.useCallback)((e=>{let i="";return M&&e>new Date(`${M}T23:59:00Z`)?i=`Maximum date should be ${(0,m.A)(new Date(M),"dd/MM/yyyy")}`:e<new Date(`${I}`)&&(i=`Minimum date should be ${(0,m.A)(new Date(I),"dd/MM/yyyy")}`),i}),[I,M]),$=(0,a.useRef)();return(0,a.useEffect)((()=>{if($.current)$.current=!1;else{var e,d,a;if(null!==v&&void 0!==v&&null!==(e=v._fields)&&void 0!==e&&null!==(d=e[i])&&void 0!==d&&null!==(a=d._f)&&void 0!==a&&a.value){var r,n,t;let e=N(new Date(null===v||void 0===v||null===(r=v._fields)||void 0===r||null===(n=r[i])||void 0===n||null===(t=n._f)||void 0===t?void 0:t.value));e&&x&&x((d=>({...d,[i]:e})))}$.current=!0}}),[i,v,N,x]),(0,j.jsx)(t.$,{dateAdapter:n.h,children:(0,j.jsx)(s.xI,{name:i,control:v,defaultValue:null,render:e=>{var a;let{field:n,formState:{errors:t}}=e;return(0,j.jsx)(l.A,{fullWidth:!0,sx:{"& .MuiOutlinedInput-root":{"& fieldset":{borderColor:t[i]?"#ff4d4f":""}}},children:(0,j.jsxs)(o.A,{spacing:1,children:[(0,j.jsxs)(u.A,{children:[d,Y&&!(null!==d&&void 0!==d&&d.includes(" *"))&&" *"]}),"dateTimeBoth"===D?(0,j.jsx)(r.K,{...n,disabled:p,value:n.value?new Date(n.value):null,onChange:e=>{if(e){let d=N(e);x&&x((e=>({...e,[i]:d})))}const d=A(e);R&&"function"===typeof R&&R(d),n.onChange(d)},format:"12hour"===g?"dd/MM/yyyy hh:mm a":"dd/MM/yyyy HH:mm",renderInput:e=>(0,j.jsx)(c.A,{...e}),ampm:"12hour"===g}):"dateOnly"===D?(0,j.jsx)(f.T,{inputFormat:"dd/MM/yyyy",value:n.value?new Date(n.value):null,onChange:e=>{if(e){let d=N(e);x&&x((e=>({...e,[i]:d})))}const d=A(e);R&&"function"===typeof R&&R(d),n.onChange(d)},renderInput:e=>(0,j.jsx)(c.A,{...e})}):"monthYearBoth"===D?(0,j.jsx)(q.l,{inputFormat:"MM-yyyy",views:["month","year"],value:n.value?new Date(n.value):null,onChange:e=>{if(e){let d=N(e);x&&x((e=>({...e,[i]:d})))}const d=A(e);R&&"function"===typeof R&&R(d),n.onChange(d)},renderInput:e=>(0,j.jsx)(c.A,{...e})}):(0,j.jsx)(C.A,{value:n.value?new Date(n.value):null,onChange:e=>{const i=A(e);R&&"function"===typeof R&&R(i),n.onChange(i)},renderInput:e=>(0,j.jsx)(c.A,{...e}),ampm:"12hour"===g}),(0,j.jsx)(b.A,{sx:{position:"absolute",top:60,left:3,color:"#ff4d4f"},children:(null===(a=t[i])||void 0===a?void 0:a.message)||y})]})})}})})}}}]);