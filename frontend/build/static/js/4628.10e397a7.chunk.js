"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[4628],{34628:(e,r,a)=>{a.r(r),a.d(r,{default:()=>b});var t=a(9950),l=a(9449),o=a(26473),d=a(60666),n=a(27081),i=a(4139),s=a(67535),u=a(8008),c=a(14351),v=a(84601),m=a(89649),p=a(99635),y=a(96951),g=a(29024),f=a(80733),h=a(76300),x=a(71826),I=a(88848),A=a(52867),j=a(44414);const S=[{id:"gaa",name:"GAA"}];const b=function(){var e,r,a,b,E;const{paginations:{pageSize:T,pageIndex:_},setPageIndex:C,setPageSize:L}=(0,m.A)(),[k,P]=(0,t.useState)(!1),[w,H]=(0,t.useState)(null),[$,q]=(0,t.useState)(null),[F,N]=(0,t.useState)(null===(e=S[0])||void 0===e?void 0:e.id),[O,M]=(0,t.useState)(!1),[R,V]=(0,t.useState)(null),[z,D]=(0,t.useState)(-1),[G,Y]=(0,t.useState)([]),[W,J]=(0,t.useState)(0),X=d.Ik().shape({projectId:v.A.other,formTypeId:v.A.formType,formId:v.A.form,...Array.from({length:10}).reduce(((e,r,a)=>(e[`gaaLevelEntryId${a}`]=d.YO().test("required-test","This field is required",((e,r)=>{var t;return!(r.path.includes("gaaLevelEntryId0")||(null===$||void 0===$||null===(t=$[a])||void 0===t?void 0:t.rank)<=z)||e&&e.length>0})),e)),{})}),B=(0,l.mN)({resolver:(0,o.t)(X),defaultValues:{gaaLevelEntryId0:[]},mode:"all"}),{handleSubmit:Q,watch:K,setValue:U,getValues:Z,formState:{errors:ee}}=B,[re,ae,te,le,oe]=K(["projectId","formTypeId","formId","dateFrom","dateTo"]),{masterMakerOrgType:de}=(0,I.$)(),ne=(0,n.wA)(),{webforms:ie}=(0,h.I)(),se=null===de||void 0===de?void 0:de.masterObject,ue=(0,A.wn)(ie),ce=null===(r=(0,f.Y)())||void 0===r||null===(a=r.projectsDropdown)||void 0===a?void 0:a.projectsDropdownObject,ve=null===(b=(0,u.r)())||void 0===b||null===(E=b.areaWiseProductivityReports)||void 0===E?void 0:E.loading;(0,t.useEffect)((()=>{ne((0,g.uiG)()),ne((0,g.VOH)("FORM_TYPES"))}),[ne,re]),(0,t.useEffect)((()=>{re&&ae&&ne((0,g.XXG)({projectId:re,typeId:ae.replace(" - O&M",""),accessSource:"Form Responses"}))}),[ne,ae,re]);const me=(0,t.useCallback)((async()=>{M(!0);const e=await(0,x.default)("/area-project-level",{method:"GET",params:te,query:{formId:te,sort:["rank","ASC"]}});if(e.success){const{data:a,accessRank:t}=e.data;var r;if(D(t),a)q(null===(r=a[0])||void 0===r?void 0:r.gaaLevels);else q(null)}M(!1)}),[te]);(0,t.useEffect)((()=>{te&&me()}),[te,me]);const pe=(0,t.useMemo)((()=>[{Header:"Project",accessor:"project",exportAccessor:"project"},{Header:"Form Type",accessor:"formType",exportAccessor:"formType"},{Header:"Form Name",accessor:"form",exportAccessor:"form"},...(null===$||void 0===$?void 0:$.map((e=>({Header:e.name,accessor:e.columnName,exportAccessor:e.columnName}))))||[],{Header:"Survey Total",accessor:"total",exportAccessor:"total"},{Header:"Survey Manpower",accessor:"man_power",exportAccessor:"man_power"},{Header:"Survey Average Productivity",accessor:"avg_productivity",exportAccessor:"avg_productivity"},{Header:"Survey Max Productivity",accessor:"max_productivity",exportAccessor:"max_productivity"},{Header:"Survey Min Productivity",accessor:"min_productivity",exportAccessor:"min_productivity"}]),[$]),ye=function(e,r,a,t,l){let o=!(arguments.length>5&&void 0!==arguments[5])||arguments[5];return(0,j.jsx)(y.o3,{name:e,disabled:!1,type:a,label:r,InputLabelProps:{shrink:o},...l&&{required:!0},defaultValue:t})},ge=(0,t.useCallback)((e=>{var r,a;e=structuredClone(e);let t={},l=!1;if($){var o;for(let r=(null===$||void 0===$?void 0:$.length)-1;r>=0;r--){var d;if(null!==(d=e[`gaaLevelEntryId${r}`])&&void 0!==d&&d.length){t[`${$[r].columnName}`]=e[`gaaLevelEntryId${r}`];break}}null!==(o=e.gaaLevelEntryId0)&&void 0!==o&&o.length||(B.setError("gaaLevelEntryId0",{message:"This field is required"},{shouldFocus:!0}),l=!0);for(let r=1;r<$.length;r++){var n;const{rank:a}=$[r];a<=z&&(null===(n=e[`gaaLevelEntryId${r}`])||void 0===n||!n.length)&&(B.setError(`gaaLevelEntryId${r}`,{message:"This field is required"},{shouldFocus:!0}),l=!0)}}if(l)return;const[i]=Object.keys(t),s=t[i],u=null===$||void 0===$||null===(r=$[$.length-1])||void 0===r?void 0:r.columnName,c=null===$||void 0===$||null===(a=$.map((e=>e.columnName)))||void 0===a?void 0:a.filter((e=>e!==i)),v={columnName:i,columnValue:s,lastLevelColumn:u,allLevelNames:c};V(v);const m={projectId:re,formId:te,formType:ae,gaaHierarchy:v,pageSize:T,pageIndex:_,dateFrom:le,dateTo:oe,setReportsData:Y,setCount:J};null!==re&&void 0!==re&&re.length&&JSON.stringify(m)!==JSON.stringify(w)&&(H(m),ne((0,g.GuP)(m)))}),[$,re,te,ae,T,_,le,oe,w,ne,B,z]);(0,t.useEffect)((()=>{if(!re||!ae||!te||!k)return;const e=Z();ge(e)}),[te,ae,Z,ge,re,k]);const fe=(0,t.useCallback)(((e,r)=>{var a;const t=r-1;return null!==(a=K())&&void 0!==a&&a[`gaaLevelEntryId${t}`]?e.gaa_level_entries.filter((e=>{var r,a;return null===(r=K())||void 0===r||null===(a=r[`gaaLevelEntryId${t}`])||void 0===a?void 0:a.includes(null===e||void 0===e?void 0:e.parentId)})):e.gaa_level_entries}),[K]),he=(0,t.useCallback)(((e,r,a,t,l)=>{(a=structuredClone(a))[`gaaLevelEntryId${e}`]=l;let o=e;for(;o<(t?r.length-1:r.length);){var d,n,i;const e=`gaaLevelEntryId${o+1}`,t=`gaaLevelEntryId${o}`,l=r[o+1],s=null!==(d=a)&&void 0!==d&&d[t]&&null!==l&&void 0!==l&&l.gaa_level_entries?null===l||void 0===l||null===(n=l.gaa_level_entries)||void 0===n?void 0:n.filter((e=>{var r;return(null===(r=a)||void 0===r?void 0:r[t])===(null===e||void 0===e?void 0:e.parentId)})):(null===l||void 0===l?void 0:l.gaa_level_entries)||[],u=Array.isArray(a[e])&&(null===(i=a[e])||void 0===i?void 0:i.filter((e=>s.some((r=>r.id===e)))))||[];U(e,u),a[e]=u,o+=1}}),[U]);return(0,j.jsxs)(c.A,{title:"Area Wise Productivity Report",children:[(0,j.jsx)(y.Op,{methods:B,onSubmit:Q((()=>{P(!0)})),children:(0,j.jsxs)(i.Ay,{container:!0,spacing:4,mb:3,children:[(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,j.jsx)(y.eu,{name:"projectId",label:"Project",menus:ce||[],required:!0,onChange:()=>{U("formTypeId",""),U("formId",""),Y([]),P(!1)}})}),(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,j.jsx)(y.eu,{name:"formTypeId",label:"Form Type",menus:null===se||void 0===se?void 0:se.filter((e=>"Survey"===e.name)),required:!0,onChange:()=>{U("formId",""),Y([]),P(!1)}})}),(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,j.jsx)(y.eu,{name:"formId",label:"Type",menus:ue||[],required:!0,onChange:()=>{U("gaaHierarchyId",""),Y([]),P(!1)}})}),(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,j.jsx)(y.eu,{name:"hierarchyType",label:"Hierarchy Type",menus:S,required:!1,onChange:e=>{var r;return N(null===e||void 0===e||null===(r=e.target)||void 0===r?void 0:r.value)},defaultValue:S[0].id})}),"gaa"===F&&te&&(null===$||void 0===$?void 0:$.length)>0&&(null===$||void 0===$?void 0:$.map(((e,r)=>{var a,t,l;return(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:(0,j.jsx)(y.Yq,{required:0===r||e.rank<=z,name:`gaaLevelEntryId${r}`,label:e.name,onChange:he.bind(null,r,$,K(),!0),menus:fe(e,r),disable:0!==r&&e.rank>z&&!(null!==(a=K())&&void 0!==a&&null!==(t=a["gaaLevelEntryId"+(r-1)])&&void 0!==t&&t.length),errorMessage:null===(l=ee[`gaaLevelEntryId${r}`])||void 0===l?void 0:l.message})},e.id)}))),(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:ye("dateFrom","Date From","date")}),(0,j.jsx)(i.Ay,{item:!0,md:3,xl:3,children:ye("dateTo","Date To","date")}),(0,j.jsx)(i.Ay,{item:!0,xs:12,sx:{mt:2,display:"flex",justifyContent:"flex-end",gap:"20px"},children:(0,j.jsx)(s.A,{disabled:O,type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})]})}),k&&(0,j.jsx)(p.default,{hideColumnsSelect:!0,hideSearch:!0,hideAddButton:!0,loadingCondition:ve,title:"Area Wise Productivity Report",data:G,count:W,setPageIndex:C,setPageSize:L,pageIndex:_,pageSize:T,columns:pe,hideActions:!0,sortConfig:{sort:["createdAt","DESC"]},exportConfig:{tableName:"area_wise_productivity_report",apiQuery:{formId:te,gaaHierarchy:R,dateFrom:le,dateTo:oe,formType:ae}}})]})}}}]);