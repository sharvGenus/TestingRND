"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[7120],{7120:(e,a,l)=>{l.r(a),l.d(a,{default:()=>S});var r=l(9950),t=l(9449),o=l(26473),d=l(60666),n=l(27081),i=l(4139),s=l(67535),u=l(8008),v=l(14351),m=l(84601),c=l(89649),p=l(99635),g=l(96951),f=l(29024),h=l(80733),y=l(76300),I=l(71826),x=l(88848),b=l(44414);const j=[{id:"gaa",name:"GAA"}],A=[{name:"L1",value:"l1"},{name:"L2",value:"l2"}];const S=function(){var e,a,l,S,L,C,T,E,_;const{paginations:{pageSize:k,pageIndex:$},setPageIndex:w,setPageSize:q}=(0,c.A)(),[H,N]=(0,r.useState)(!1),[F,O]=(0,r.useState)(null),[P,R]=(0,r.useState)(null===(e=A[0])||void 0===e?void 0:e.value),[V,D]=(0,r.useState)(null),[U,z]=(0,r.useState)(null===(a=j[0])||void 0===a?void 0:a.id),[M,G]=(0,r.useState)(!1),[Y,J]=(0,r.useState)(null),[W,B]=(0,r.useState)(-1),[X,Q]=(0,r.useState)([]),[K,Z]=(0,r.useState)(0),ee=d.Ik().shape({projectId:m.A.other,formTypeId:m.A.formType,formId:m.A.form,...Array.from({length:10}).reduce(((e,a,l)=>(e[`gaaLevelEntryId${l}`]=d.YO().test("required-test","This field is required",((e,a)=>{var r;return!(a.path.includes("gaaLevelEntryId0")||(null===V||void 0===V||null===(r=V[l])||void 0===r?void 0:r.rank)<=W)||e&&e.length>0})),e)),{})}),ae=(0,t.mN)({resolver:(0,o.t)(ee),defaultValues:{gaaLevelEntryId0:[]},mode:"all"}),{handleSubmit:le,watch:re,setValue:te,getValues:oe,formState:{errors:de}}=ae,[ne,ie,se,ue,ve]=re(["projectId","formTypeId","formId","dateFrom","dateTo"]),{masterMakerOrgType:me}=(0,x.$)(),ce=null===me||void 0===me?void 0:me.masterObject,pe=(null===(l=ce.find((e=>e.id===ie)))||void 0===l?void 0:l.name)||"",ge=null===(S=(0,u.r)())||void 0===S||null===(L=S.userWiseValidationStatusReports)||void 0===L?void 0:L.loading,fe=null===(C=(0,h.Y)())||void 0===C||null===(T=C.projectsDropdown)||void 0===T?void 0:T.projectsDropdownObject,{webforms:he}=(0,y.I)(),ye=function(e,a,l,r,t){let o=!(arguments.length>5&&void 0!==arguments[5])||arguments[5];return(0,b.jsx)(g.o3,{name:e,disabled:!1,type:l,label:a,InputLabelProps:{shrink:o},...t&&{required:!0},defaultValue:r})},Ie=(0,r.useMemo)((()=>[{Header:"Customer",accessor:"customer"},{Header:"Project",accessor:"project"},{Header:"Form Type",accessor:"formType"},{Header:"Form Name",accessor:"formName"},{Header:"Contractor Name",accessor:"contractor_name"},{Header:`${null===P||void 0===P?void 0:P.toUpperCase()}  Approver Name`,accessor:"approver_name"},{Header:"Approver Mobile Number",accessor:"approver_mobile_number"},{Header:`${null===P||void 0===P?void 0:P.toUpperCase()} Level - Approved`,accessor:"approved"},{Header:`${null===P||void 0===P?void 0:P.toUpperCase()} Level - Rejected`,accessor:"rejected"},{Header:`${null===P||void 0===P?void 0:P.toUpperCase()} Level - On-Hold`,accessor:"on_hold"}]),[P]),xe=(null===he||void 0===he||null===(E=he.webformDataObject)||void 0===E||null===(_=E.rows)||void 0===_?void 0:_.filter((e=>e.isPublished&&e.form_attributes instanceof Array&&e.form_attributes.some((e=>"l_a_approval_status"===(null===e||void 0===e?void 0:e.columnName))))).map((e=>({id:e.id,name:e.name,tableName:e.tableName}))))||[],be=(0,n.wA)(),je=(0,r.useCallback)((e=>{let a={},l=!1;if(V){var r;for(let l=(null===V||void 0===V?void 0:V.length)-1;l>=0;l--){var t;if(null!==(t=e[`gaaLevelEntryId${l}`])&&void 0!==t&&t.length){a[`${V[l].columnName}`]=e[`gaaLevelEntryId${l}`];break}}null!==(r=e.gaaLevelEntryId0)&&void 0!==r&&r.length||(ae.setError("gaaLevelEntryId0",{message:"This field is required"},{shouldFocus:!0}),l=!0);for(let a=1;a<V.length;a++){var o;const{rank:r}=V[a];r<=W&&(null===(o=e[`gaaLevelEntryId${a}`])||void 0===o||!o.length)&&(ae.setError(`gaaLevelEntryId${a}`,{message:"This field is required"},{shouldFocus:!0}),l=!0)}}if(l)return;N(!0),J(a);const d={projectId:ne,formId:se,formType:pe,pageSize:k,pageIndex:$,approver:null===P||void 0===P?void 0:P.toUpperCase(),gaaLevelDetails:a,dateFrom:ue,dateTo:ve,setReportsData:Q,setReportsCount:Z};null!==ne&&void 0!==ne&&ne.length&&JSON.stringify(d)!==JSON.stringify(F)&&(O(d),be((0,f.BJ6)(d)))}),[V,ne,se,pe,k,$,P,ue,ve,F,be,ae,W]);(0,r.useEffect)((()=>{if(!ne||!ie||!se||!H)return;const e=oe();je(e)}),[se,ie,oe,je,ne,H]),(0,r.useEffect)((()=>{be((0,f.uiG)()),be((0,f.VOH)("FORM_TYPES"))}),[be,ne]),(0,r.useEffect)((()=>{ne&&ie&&be((0,f.XXG)({projectId:ne,typeId:ie.replace(" - O&M",""),accessSource:"Form Responses"}))}),[be,ie,ne]);const Ae=(0,r.useCallback)((async()=>{G(!0);const e=await(0,I.default)("/area-project-level",{method:"GET",params:se,query:{formId:se,sort:["rank","ASC"]}});if(e.success){const{data:l,accessRank:r}=e.data;var a;if(B(r),l)D(null===(a=l[0])||void 0===a?void 0:a.gaaLevels);else D(null)}G(!1)}),[se]);(0,r.useEffect)((()=>{se&&Ae()}),[se,Ae]);const Se=(0,r.useCallback)(((e,a)=>{var l;const r=a-1;return null!==(l=re())&&void 0!==l&&l[`gaaLevelEntryId${r}`]?e.gaa_level_entries.filter((e=>{var a,l;return null===(a=re())||void 0===a||null===(l=a[`gaaLevelEntryId${r}`])||void 0===l?void 0:l.includes(null===e||void 0===e?void 0:e.parentId)})):e.gaa_level_entries}),[re]),Le=(0,r.useCallback)(((e,a,l,r,t)=>{(l=structuredClone(l))[`gaaLevelEntryId${e}`]=t;let o=e;for(;o<(r?a.length-1:a.length);){var d,n,i;const e=`gaaLevelEntryId${o+1}`,r=`gaaLevelEntryId${o}`,t=a[o+1],s=null!==(d=l)&&void 0!==d&&d[r]&&null!==t&&void 0!==t&&t.gaa_level_entries?null===t||void 0===t||null===(n=t.gaa_level_entries)||void 0===n?void 0:n.filter((e=>{var a;return(null===(a=l)||void 0===a?void 0:a[r])===(null===e||void 0===e?void 0:e.parentId)})):(null===t||void 0===t?void 0:t.gaa_level_entries)||[],u=Array.isArray(l[e])&&(null===(i=l[e])||void 0===i?void 0:i.filter((e=>s.some((a=>a.id===e)))))||[];te(e,u),l[e]=u,o+=1}Q([]),N(!1)}),[te]);return(0,b.jsxs)(v.A,{title:"User Wise Validation Status Report",children:[(0,b.jsx)(g.Op,{methods:ae,onSubmit:le((()=>{N(!0)})),children:(0,b.jsxs)(i.Ay,{container:!0,spacing:4,mb:3,children:[(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,b.jsx)(g.eu,{name:"projectId",label:"Project",menus:fe||[],required:!0,onChange:()=>{te("formTypeId",""),te("formId",""),Q([]),N(!1)}})}),(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,b.jsx)(g.eu,{name:"formTypeId",label:"Form Type",menus:ce,required:!0,onChange:()=>{te("formId",""),Q([]),N(!1)}})}),(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,b.jsx)(g.eu,{name:"formId",label:"Type",menus:xe||[],required:!0,onChange:()=>{Q([]),N(!1)}})}),(0,b.jsx)(i.Ay,{item:!0,xs:3,md:3,children:(0,b.jsx)(g.gk,{name:"approvalLevels",title:"Select Approval Levels",singleLineRadio:"true",labels:A,onChange:e=>{var a;R(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)},style:{"& label":{marginTop:"0",width:"33%"},marginTop:"10px !important",padding:"3px 0"},required:!0,defaultValue:A[0].value})}),(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,b.jsx)(g.eu,{name:"hierarchyType",label:"Hierarchy Type",menus:j,required:!1,onChange:e=>{var a;return z(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)},defaultValue:j[0].id})}),"gaa"===U&&se&&(null===V||void 0===V?void 0:V.length)>0&&(null===V||void 0===V?void 0:V.map(((e,a)=>{var l,r,t;return(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,b.jsx)(g.Yq,{required:0===a||e.rank<=W,name:`gaaLevelEntryId${a}`,label:e.name,onChange:Le.bind(null,a,V,re(),!0),menus:Se(e,a),disable:0!==a&&e.rank>W&&!(null!==(l=re())&&void 0!==l&&null!==(r=l["gaaLevelEntryId"+(a-1)])&&void 0!==r&&r.length),errorMessage:null===(t=de[`gaaLevelEntryId${a}`])||void 0===t?void 0:t.message})},e.id)}))),(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:ye("dateFrom","Date From","date")}),(0,b.jsx)(i.Ay,{item:!0,md:3,xl:3,children:ye("dateTo","Date To","date")}),(0,b.jsx)(i.Ay,{item:!0,xs:12,sx:{mt:2,display:"flex",justifyContent:"flex-end",gap:"20px"},children:(0,b.jsx)(s.A,{disabled:M,type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})]})}),H&&(0,b.jsx)(p.default,{hideColumnsSelect:!0,hideSearch:!0,hideAddButton:!0,loadingCondition:ge,title:"User Wise Validation Status Report",data:X||[],count:K||0,setPageIndex:w,setPageSize:q,pageIndex:$,pageSize:k,columns:Ie,hideActions:!0,exportConfig:{tableName:"user-wise-validation_status_report",apiQuery:{projectId:ne,formId:se,formType:pe,pageSize:k,pageIndex:$,approver:null===P||void 0===P?void 0:P.toUpperCase(),gaaLevelDetails:Y,dateFrom:ue,dateTo:ve}}})]})}}}]);