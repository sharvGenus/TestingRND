"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[1906],{11906:(e,r,a)=>{a.r(r),a.d(r,{default:()=>E});var o=a(9950),t=a(9449),l=a(26473),d=a(60666),s=a(27081),n=a(4139),i=a(67535),c=a(8008),u=a(14351),v=a(84601),p=a(89649),m=a(99635),g=a(96951),y=a(29024),f=a(80733),x=a(76300),A=a(71826),h=a(88848),I=a(52867),L=a(44414);const j=[{id:"gaa",name:"GAA"}];const E=function(){var e,r,a,E,T;const{paginations:{pageSize:H,pageIndex:S},setPageIndex:b,setPageSize:k}=(0,p.A)(),[C,N]=(0,o.useState)(!1),[P,O]=(0,o.useState)(null),[_,$]=(0,o.useState)(null),[R,q]=(0,o.useState)(null===(e=j[0])||void 0===e?void 0:e.id),[w,F]=(0,o.useState)(!1),[V,z]=(0,o.useState)(null),[D,M]=(0,o.useState)(-1),[W,G]=(0,o.useState)([]),[Y,J]=(0,o.useState)(0),U=d.Ik().shape({projectId:v.A.other,formTypeId:v.A.formType,formId:v.A.form,...Array.from({length:10}).reduce(((e,r,a)=>(e[`gaaLevelEntryId${a}`]=d.YO().test("required-test","This field is required",((e,r)=>{var o;return!(r.path.includes("gaaLevelEntryId0")||(null===_||void 0===_||null===(o=_[a])||void 0===o?void 0:o.rank)<=D)||e&&e.length>0})),e)),{})}),X=(0,t.mN)({resolver:(0,l.t)(U),defaultValues:{gaaLevelEntryId0:[]},mode:"all"}),{handleSubmit:B,watch:Q,setValue:K,getValues:Z,formState:{errors:ee}}=X,[re,ae,oe,te,le]=Q(["projectId","formTypeId","formId","dateFrom","dateTo"]),{masterMakerOrgType:de}=(0,h.$)(),se=(0,s.wA)(),{webforms:ne}=(0,x.I)(),ie=null===de||void 0===de?void 0:de.masterObject,ce=(0,I.wn)(ne),ue=null===(r=(0,f.Y)())||void 0===r||null===(a=r.projectsDropdown)||void 0===a?void 0:a.projectsDropdownObject,ve=null===(E=(0,c.r)())||void 0===E||null===(T=E.userWiseProductivityReports)||void 0===T?void 0:T.loading;(0,o.useEffect)((()=>{se((0,y.uiG)()),se((0,y.VOH)("FORM_TYPES"))}),[se,re]),(0,o.useEffect)((()=>{re&&ae&&se((0,y.XXG)({projectId:re,typeId:ae.replace(" - O&M",""),accessSource:"Form Responses"}))}),[se,ae,re]);const pe=(0,o.useCallback)((async()=>{F(!0);const e=await(0,A.default)("/area-project-level",{method:"GET",params:oe,query:{formId:oe,sort:["rank","ASC"]}});if(e.success){const{data:a,accessRank:o}=e.data;var r;if(M(o),a)$(null===(r=a[0])||void 0===r?void 0:r.gaaLevels);else $(null)}F(!1)}),[oe]);(0,o.useEffect)((()=>{oe&&pe()}),[oe,pe]);const me=(0,o.useMemo)((()=>[{Header:"Project",accessor:"projectName",exportAccessor:"projectName"},{Header:"Form Type",accessor:"formTypeName",exportAccessor:"formTypeName"},{Header:"Form Name",accessor:"formName",exportAccessor:"formName"},{Header:"Installer Name",accessor:"Installer Name",exportAccessor:"Installer Name"},{Header:"Task Completed",accessor:"Task Completed",exportAccessor:"Task Completed"},{Header:"L1 Approval Pending",accessor:"L1 Approval Pending",exportAccessor:"L1 Approval Pending"},{Header:"L1 Approved",accessor:"L1 Approved",exportAccessor:"L1 Approved"},{Header:"L1 Rejected",accessor:"L1 Rejected",exportAccessor:"L1 Rejected"},{Header:"L1 On-Hold",accessor:"L1 On-Hold",exportAccessor:"L1 On-Hold"},{Header:"L2 Approval Pending",accessor:"L2 Approval Pending",exportAccessor:"L2 Approval Pending"},{Header:"L2 Approved",accessor:"L2 Approved",exportAccessor:"L2 Approved"},{Header:"L2 Rejected",accessor:"L2 Rejected",exportAccessor:"L2 Rejected"},{Header:"L2 On-Hold",accessor:"L2 On-Hold",exportAccessor:"L2 On-Hold"},{Header:"Total Working Hours",accessor:"Total Working Hours",exportAccessor:"Total Working Hours"},{Header:"Execution Started At",accessor:"Execution Started At",exportAccessor:"Execution Started At"},{Header:"Execution Ended At",accessor:"Execution Ended At",exportAccessor:"Execution Ended At"}]),[]),ge=(0,o.useCallback)((e=>{var r,a;e=structuredClone(e);let o={},t=!1;if(_){var l;for(let r=(null===_||void 0===_?void 0:_.length)-1;r>=0;r--){var d;if(null!==(d=e[`gaaLevelEntryId${r}`])&&void 0!==d&&d.length){o[`${_[r].columnName}`]=e[`gaaLevelEntryId${r}`];break}}null!==(l=e.gaaLevelEntryId0)&&void 0!==l&&l.length||(X.setError("gaaLevelEntryId0",{message:"This field is required"},{shouldFocus:!0}),t=!0);for(let r=1;r<_.length;r++){var s;const{rank:a}=_[r];a<=D&&(null===(s=e[`gaaLevelEntryId${r}`])||void 0===s||!s.length)&&(X.setError(`gaaLevelEntryId${r}`,{message:"This field is required"},{shouldFocus:!0}),t=!0)}}if(t)return;const[n]=Object.keys(o),i=o[n],c=null===_||void 0===_||null===(r=_[_.length-1])||void 0===r?void 0:r.columnName,u=null===_||void 0===_||null===(a=_.map((e=>e.columnName)))||void 0===a?void 0:a.filter((e=>e!==n)),v={columnName:n,columnValue:i,lastLevelColumn:c,allLevelNames:u};z(v);const p={projectId:re,formId:oe,formType:ae,gaaHierarchy:v,pageSize:H,pageIndex:S,dateFrom:te,dateTo:le,setReportData:G,setCount:J};null!==re&&void 0!==re&&re.length&&JSON.stringify(p)!==JSON.stringify(P)&&(O(p),se((0,y.IeM)(p)))}),[_,re,oe,ae,H,S,te,le,P,se,X,D]);(0,o.useEffect)((()=>{if(!re||!ae||!oe||!C)return;const e=Z();ge(e)}),[oe,ae,Z,ge,re,C]);const ye=(0,o.useCallback)(((e,r)=>{var a;const o=r-1;return null!==(a=Q())&&void 0!==a&&a[`gaaLevelEntryId${o}`]?e.gaa_level_entries.filter((e=>{var r,a;return null===(r=Q())||void 0===r||null===(a=r[`gaaLevelEntryId${o}`])||void 0===a?void 0:a.includes(null===e||void 0===e?void 0:e.parentId)})):e.gaa_level_entries}),[Q]),fe=(0,o.useCallback)(((e,r,a,o,t)=>{(a=structuredClone(a))[`gaaLevelEntryId${e}`]=t;let l=e;for(;l<(o?r.length-1:r.length);){var d,s,n;const e=`gaaLevelEntryId${l+1}`,o=`gaaLevelEntryId${l}`,t=r[l+1],i=null!==(d=a)&&void 0!==d&&d[o]&&null!==t&&void 0!==t&&t.gaa_level_entries?null===t||void 0===t||null===(s=t.gaa_level_entries)||void 0===s?void 0:s.filter((e=>{var r;return(null===(r=a)||void 0===r?void 0:r[o])===(null===e||void 0===e?void 0:e.parentId)})):(null===t||void 0===t?void 0:t.gaa_level_entries)||[],c=Array.isArray(a[e])&&(null===(n=a[e])||void 0===n?void 0:n.filter((e=>i.some((r=>r.id===e)))))||[];K(e,c),a[e]=c,l+=1}}),[K]),xe=function(e,r,a,o,t){let l=!(arguments.length>5&&void 0!==arguments[5])||arguments[5];return(0,L.jsx)(g.o3,{name:e,disabled:!1,type:a,label:r,InputLabelProps:{shrink:l},...t&&{required:!0},defaultValue:o})};return(0,L.jsxs)(u.A,{title:"User Wise Productivity Report",children:[(0,L.jsx)(g.Op,{methods:X,onSubmit:B((()=>{N(!0)})),children:(0,L.jsxs)(n.Ay,{container:!0,spacing:4,mb:3,children:[(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,L.jsx)(g.eu,{name:"projectId",label:"Project",menus:ue||[],required:!0,onChange:()=>{K("formTypeId",""),K("formId",""),G([]),N(!1)}})}),(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,L.jsx)(g.eu,{name:"formTypeId",label:"Form Type",menus:ie,required:!0,onChange:()=>{K("formId",""),G([]),N(!1)}})}),(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,L.jsx)(g.eu,{name:"formId",label:"Type",menus:ce||[],required:!0,onChange:()=>{K("gaaHierarchyId",""),G([]),N(!1)}})}),(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,L.jsx)(g.eu,{name:"hierarchyType",label:"Hierarchy Type",menus:j,required:!1,onChange:e=>{var r;return q(null===e||void 0===e||null===(r=e.target)||void 0===r?void 0:r.value)},defaultValue:j[0].id})}),"gaa"===R&&oe&&(null===_||void 0===_?void 0:_.length)>0&&(null===_||void 0===_?void 0:_.map(((e,r)=>{var a,o,t;return(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,L.jsx)(g.Yq,{required:0===r||e.rank<=D,name:`gaaLevelEntryId${r}`,label:e.name,onChange:fe.bind(null,r,_,Q(),!0),menus:ye(e,r),disable:0!==r&&e.rank>D&&!(null!==(a=Q())&&void 0!==a&&null!==(o=a["gaaLevelEntryId"+(r-1)])&&void 0!==o&&o.length),errorMessage:null===(t=ee[`gaaLevelEntryId${r}`])||void 0===t?void 0:t.message})},e.id)}))),(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:xe("dateFrom","Date From","date")}),(0,L.jsx)(n.Ay,{item:!0,md:3,xl:3,children:xe("dateTo","Date To","date")}),(0,L.jsx)(n.Ay,{item:!0,xs:12,sx:{mt:2,display:"flex",justifyContent:"flex-end",gap:"20px"},children:(0,L.jsx)(i.A,{disabled:w,type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})]})}),C&&(0,L.jsx)(m.default,{hideColumnsSelect:!0,hideSearch:!0,hideAddButton:!0,loadingCondition:ve,title:"User Wise Productivity Report",data:W,count:Y,setPageIndex:b,setPageSize:k,pageIndex:S,pageSize:H,columns:me,sortConfig:{sort:["createdAt","DESC"]},hideActions:!0,exportConfig:{tableName:"user_wise_productivity_report",apiQuery:{projectId:re,formTypeId:ae,formId:oe,gaaHierarchy:V,dateFrom:te,dateTo:le}}})]})}}}]);