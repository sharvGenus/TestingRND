"use strict";(self.webpackChunkgenus_power=self.webpackChunkgenus_power||[]).push([[2627],{43997:(e,a,r)=>{r.d(a,{i:()=>o});var t=r(9950),l=r(62054);const o=e=>{(0,t.useEffect)((()=>{e&&(0,l.A)(e,{variant:"error"})}),[e])}},24618:(e,a,r)=>{r.d(a,{L:()=>o});var t=r(9950),l=r(27081);const o=()=>{const[e,a]=(0,t.useState)({gaaObject:{},error:"",loading:!0}),[r,o]=(0,t.useState)({gaaProjectsObject:[],error:"",loading:!0}),[d,i]=(0,t.useState)({gaaLevelProjectsObject:[],error:"",loading:!0}),[n,s]=(0,t.useState)({gaaLevelParentsObject:[],error:"",loading:!0}),[u,v]=(0,t.useState)({projectAreaLevelsObject:[],error:"",loading:!1}),[c,p]=(0,t.useState)({gaaHistoryObject:{},error:"",loading:!0}),[m,g]=(0,t.useState)({gaaLevelEntryHistoryObject:{},error:"",loading:!0}),y=(0,l.d4)((e=>e.gaa||{})),f=(0,l.d4)((e=>e.gaaProjects||{})),h=(0,l.d4)((e=>e.gaaLevelProjects||{})),j=(0,l.d4)((e=>e.gaaLevelParents||{})),x=(0,l.d4)((e=>e.projectAreaLevels||{})),I=(0,l.d4)((e=>e.gaaHistory||{})),b=(0,l.d4)((e=>e.gaaLevelEntryHistory||{}));return(0,t.useEffect)((()=>{a((e=>({...e,...y})))}),[y]),(0,t.useEffect)((()=>{o((e=>({...e,...f})))}),[f]),(0,t.useEffect)((()=>{i((e=>({...e,...h})))}),[h]),(0,t.useEffect)((()=>{s((e=>({...e,...j})))}),[j]),(0,t.useEffect)((()=>{v((e=>({...e,...x})))}),[x]),(0,t.useEffect)((()=>{p((e=>({...e,...I})))}),[I]),(0,t.useEffect)((()=>{g((e=>({...e,...b})))}),[b]),{gaa:e,gaaProjects:r,gaaLevelProjects:d,gaaLevelParents:n,projectAreaLevels:u,gaaHistory:c,gaaLevelEntryHistory:m}}},52627:(e,a,r)=>{r.r(a),r.d(a,{default:()=>C});var t=r(9950),l=r(9449),o=r(4139),d=r(67535),i=r(95537),n=r(26473),s=r(60666),u=r(27081),v=r(8008),c=r(87713),p=r(14351),m=r(84601),g=r(29024),y=r(89649),f=r(99635),h=r(96951),j=r(80733),x=r(76300),I=r(43997),b=r(24618),L=r(52867),A=r(44414);const S=[{id:"1d75feca-2e64-4b95-900d-fcd53446ddeb",name:"Survey"},{id:"30ea8a65-ff5b-4bff-b1a1-892204e23669",name:"Installation"},{id:"30ea8a65-ff5b-4bff-b1a1-892204e23669 - O&M",name:"O&M"}];const C=function(){var e,a,r,C,E,T,P,k,_,O,$,H,w,F,D,q;const{paginations:{pageSize:R,pageIndex:z},setPageIndex:M,setPageSize:V}=(0,y.A)(),[N,U]=(0,t.useState)(!1),[W,G]=(0,t.useState)(null===(e=c.hierarchyData[0])||void 0===e?void 0:e.id),Y=(0,v.r)(),[X,B,J,Q]=[null===Y||void 0===Y||null===(a=Y.dateWiseProductivityReports)||void 0===a||null===(r=a.dateWiseProductivityReportsObject)||void 0===r?void 0:r.rows,null===Y||void 0===Y||null===(C=Y.dateWiseProductivityReports)||void 0===C||null===(E=C.dateWiseProductivityReportsObject)||void 0===E?void 0:E.count,null===Y||void 0===Y||null===(T=Y.dateWiseProductivityReports)||void 0===T?void 0:T.error,null===Y||void 0===Y||null===(P=Y.dateWiseProductivityReports)||void 0===P?void 0:P.loading],Z=(0,b.L)(),[K,ee,ae,re]=[null===Z||void 0===Z||null===(k=Z.projectAreaLevels)||void 0===k||null===(_=k.projectAreaLevelsObject)||void 0===_||null===(O=_[0])||void 0===O?void 0:O.gaaLevels,null===Z||void 0===Z||null===($=Z.projectAreaLevels)||void 0===$?void 0:$.accessRank,null===Z||void 0===Z||null===(H=Z.projectAreaLevels)||void 0===H?void 0:H.loading,null===Z||void 0===Z||null===(w=Z.projectAreaLevels)||void 0===w?void 0:w.error],te=(0,l.mN)({resolver:(0,n.t)(s.Ik().shape({projectId:m.A.project,formTypeId:m.A.taskType,...(0,c.generateAreaLevelsValidation)(K,ee)}))}),{handleSubmit:le,watch:oe,setValue:de}=te,ie=(0,u.wA)(),[ne,se,ue,ve,ce]=oe(["projectId","formTypeId","formId","dateFrom","dateTo"]),pe=null===(F=(0,j.Y)())||void 0===F||null===(D=F.projectsDropdown)||void 0===D?void 0:D.projectsDropdownObject,{webforms:me}=(0,x.I)(),ge=(0,L.wn)(me);(0,I.i)(J),(0,I.i)(re);const ye=(null===(q=S.find((e=>e.id===se)))||void 0===q?void 0:q.name)||"";(0,t.useEffect)((()=>{ie((0,g.uiG)())}),[ie]);const fe=(0,t.useCallback)((e=>{const{errorFlag:a,newLevelFilter:r}=(0,L.Wr)({areaLevelsData:K,values:e,methods:te,accessRank:ee});if(!a)return{projectId:ne,formId:ue,formType:ye,pageSize:R,pageIndex:z,gaaLevelDetails:r,dateFrom:ve,dateTo:ce}}),[ee,K,ve,ce,ue,ye,te,z,R,ne]),he=(0,t.useCallback)((()=>{ie((0,g.ZUe)(fe(oe()))),U(!0)}),[ie,fe,oe]);(0,t.useEffect)((()=>{N&&he()}),[N,ie,fe,oe,z,R]);const je=(0,t.useMemo)((()=>[{Header:"S. No.",accessor:(e,a)=>(z-1)*R+a+1},{Header:"Project Name",accessor:"Projects__name"},{Header:"Project Code",accessor:"Projects__code"},{Header:"Task Type",accessor:"Task Type"},{Header:`${ye} Date`,accessor:"Installation Date"},{Header:"Task Completed",accessor:"Task Completed"},{Header:"Manpower",accessor:"Manpower"},{Header:"Productivity",accessor:"Productivity",Cell:e=>{let{value:a}=e;return parseFloat(a).toFixed(2)}}]),[ye,z,R]);(0,t.useEffect)((()=>{ue&&W&&ie((0,g.aT5)({formId:ue}))}),[ue,ie,W]),(0,t.useEffect)((()=>{ne&&se&&ie((0,g.XXG)({projectId:ne,typeId:se.replace(" - O&M",""),accessSource:"Form Responses"}))}),[ie,se,ne]);const xe=(0,t.useCallback)(((e,a)=>{var r;const t=a-1;return null!==(r=oe())&&void 0!==r&&r[`gaaLevelEntryId${t}`]?e.gaa_level_entries.filter((e=>{var a,r;return null===(a=oe())||void 0===a||null===(r=a[`gaaLevelEntryId${t}`])||void 0===r?void 0:r.includes(null===e||void 0===e?void 0:e.parentId)})):e.gaa_level_entries}),[oe]),Ie=(0,t.useCallback)(((e,a,r,t,l)=>{(r=structuredClone(r))[`gaaLevelEntryId${e}`]=l;let o=e;for(;o<(t?a.length-1:a.length);){var d,i,n;const e=`gaaLevelEntryId${o+1}`,t=`gaaLevelEntryId${o}`,l=a[o+1],s=null!==(d=r)&&void 0!==d&&d[t]&&null!==l&&void 0!==l&&l.gaa_level_entries?null===l||void 0===l||null===(i=l.gaa_level_entries)||void 0===i?void 0:i.filter((e=>{var a,l;return null===(a=r)||void 0===a||null===(l=a[t])||void 0===l?void 0:l.includes(null===e||void 0===e?void 0:e.parentId)})):(null===l||void 0===l?void 0:l.gaa_level_entries)||[],u=Array.isArray(r[e])&&(null===(n=r[e])||void 0===n?void 0:n.filter((e=>s.some((a=>a.id===e)))))||[];de(e,u),r[e]=u,o+=1}}),[de]);return(0,A.jsxs)(p.A,{title:"Date Wise Productivity Report",sx:{mb:2},children:[(0,A.jsx)(h.Op,{methods:te,onSubmit:le(he),children:(0,A.jsxs)(o.Ay,{container:!0,spacing:4,children:[(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.eu,{name:"projectId",label:"Project",menus:pe,required:!0})}),(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.eu,{name:"formTypeId",label:"Form Type",menus:S,required:!0})}),(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.eu,{name:"formId",label:"Type",menus:ge||[],required:!0})}),(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.eu,{name:"hierarchyType",label:"Hierarchy Type",menus:c.hierarchyData,required:!1,onChange:e=>{var a;return G(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)},defaultValue:c.hierarchyData[0].id})}),"gaa"===W&&ue&&(null===K||void 0===K?void 0:K.length)>0&&(null===K||void 0===K?void 0:K.map(((e,a)=>{var r,t;return(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.Yq,{name:`gaaLevelEntryId${a}`,label:e.name,onChange:Ie.bind(null,a,K,oe(),!0),menus:xe(e,a),disable:0!==a&&!(null!==(r=oe())&&void 0!==r&&null!==(t=r["gaaLevelEntryId"+(a-1)])&&void 0!==t&&t.length),required:0===a})},e.id)}))),(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.o3,{name:"dateFrom",type:"date",label:"Date From",InputLabelProps:{shrink:!0}})}),(0,A.jsx)(o.Ay,{item:!0,md:3,xl:3,children:(0,A.jsx)(h.o3,{name:"dateTo",type:"date",label:"Date To",InputLabelProps:{shrink:!0}})}),(0,A.jsx)(o.Ay,{item:!0,xs:12,sx:{mt:2,display:"flex",justifyContent:"flex-end",gap:"20px"},children:(0,A.jsx)(d.A,{disabled:ae,type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})]})}),N&&(0,A.jsx)(i.A,{sx:{mt:2},children:(0,A.jsx)(f.default,{hideColumnsSelect:!0,hideSearch:!0,hideAddButton:!0,loadingCondition:Q,title:"Date Wise Productivity Report",data:X||[],count:B||0,setPageIndex:M,setPageSize:V,pageIndex:z,pageSize:R,columns:je,hideActions:!0,exportConfig:{tableName:"date_wise_productivity_report",apiQuery:fe(oe())}})})]})}},87713:(e,a,r)=>{r.r(a),r.d(a,{approvalLevels:()=>L,createClearFieldSubscription:()=>S,default:()=>C,generateAreaLevelsValidation:()=>A,hierarchyData:()=>b});var t=r(9950),l=r(9449),o=r(26473),d=r(60666),i=r(27081),n=r(4139),s=r(67535),u=r(14351),v=r(84601),c=r(89649),p=r(99635),m=r(96951),g=r(29024),y=r(80733),f=r(76300),h=r(52867),j=r(71826),x=r(88848),I=r(44414);const b=[{id:"gaa",name:"GAA"}],L=[{name:"L1",value:"l1"},{name:"L2",value:"l2"}],A=(e,a)=>Array.from({length:10}).reduce(((r,t,l)=>(r[`gaaLevelEntryId${l}`]=d.YO().test("required-test","This field is required",((r,t)=>{var o;return!(t.path.includes("gaaLevelEntryId0")||(null===e||void 0===e||null===(o=e[l])||void 0===o?void 0:o.rank)<=a)||r&&r.length>0})),r)),{}),S=e=>{let{watch:a,allFields:r,setShowTable:t,resetField:l}=e;return a(((e,a)=>{let{name:o,type:d}=a;if("change"!==d)return;let i=!1;r.slice(1+r.indexOf(o)).forEach((e=>{"function"!==typeof t||i||(t(!1),i=!0),l(e)}))}))};const C=function(){var e,a,r,S,C;const{paginations:{pageSize:E,pageIndex:T},setPageIndex:P,setPageSize:k}=(0,c.A)(),_=(0,i.wA)(),[O,$]=(0,t.useState)(!1),[H,w]=(0,t.useState)(null===(e=L[0])||void 0===e?void 0:e.value),[F,D]=(0,t.useState)(null===(a=b[0])||void 0===a?void 0:a.id),[q,R]=(0,t.useState)(),[z,M]=(0,t.useState)([]),[V,N]=(0,t.useState)(null),[U,W]=(0,t.useState)(0),[G,Y]=(0,t.useState)(-1),[X,B]=(0,t.useState)(null),[J,Q]=(0,t.useState)(!1),Z=null===(r=(0,y.Y)())||void 0===r||null===(S=r.projectsDropdown)||void 0===S?void 0:S.projectsDropdownObject,K=(0,l.mN)({resolver:(0,o.t)(d.Ik().shape({projectId:v.A.project,formTypeId:v.A.formType,formId:v.A.form,...A(X,G)}))}),{handleSubmit:ee,watch:ae,setValue:re,getValues:te,formState:{errors:le}}=K,[oe,de,ie,ne,se]=ae(["projectId","formTypeId","formId","dateFrom","dateTo"]),{masterMakerOrgType:ue}=(0,x.$)(),ve=null===ue||void 0===ue?void 0:ue.masterObject,ce=(null===(C=ve.find((e=>e.id===de)))||void 0===C?void 0:C.name)||"",{webforms:pe}=(0,f.I)(),me=(0,t.useMemo)((()=>[{Header:"Customer",accessor:"Customer"},{Header:"Project",accessor:"Project"},{Header:"Date",accessor:"Date"},{Header:`Type Of ${ce}`,accessor:"Type of Survey"},{Header:`${ce} Completed`,accessor:"Survey Completed"},{Header:`${H.toUpperCase()} Level - Approved`,accessor:`${H.toUpperCase()} Level - Approved`},{Header:`${H.toUpperCase()} Level - Rejected`,accessor:`${H.toUpperCase()} Level - Rejected`},{Header:`${H.toUpperCase()} Level - On-Hold`,accessor:`${H.toUpperCase()} Level - On-Hold`}]),[ce,H]),ge=(0,h.wn)(pe),ye=(0,t.useCallback)((e=>{let a={},r=!1;if(X){var t;for(let r=(null===X||void 0===X?void 0:X.length)-1;r>=0;r--){var l;if(null!==(l=e[`gaaLevelEntryId${r}`])&&void 0!==l&&l.length){a[`${X[r].columnName}`]=e[`gaaLevelEntryId${r}`];break}}null!==(t=e.gaaLevelEntryId0)&&void 0!==t&&t.length||(K.setError("gaaLevelEntryId0",{message:"This field is required"},{shouldFocus:!0}),r=!0);for(let a=1;a<X.length;a++){var o;const{rank:t}=X[a];t<=G&&(null===(o=e[`gaaLevelEntryId${a}`])||void 0===o||!o.length)&&(K.setError(`gaaLevelEntryId${a}`,{message:"This field is required"},{shouldFocus:!0}),r=!0)}}if(r)return;$(!0),R(a);const d={projectId:oe,formId:ie,formType:ce,pageSize:E,pageIndex:T,approver:null===H||void 0===H?void 0:H.toUpperCase(),gaaLevelDetails:a,dateFrom:ne,dateTo:se,setReportData:M,setCount:W};null!==oe&&void 0!==oe&&oe.length&&JSON.stringify(d)!==JSON.stringify(V)&&(N(d),_((0,g.wFo)(d)))}),[X,oe,ie,ce,E,T,H,ne,se,V,_,K,G]);(0,t.useEffect)((()=>{if(!oe||!de||!ie||!O)return;const e=te();ye(e)}),[ie,de,te,ye,oe,O]),(0,t.useEffect)((()=>{_((0,g.uiG)()),_((0,g.VOH)("FORM_TYPES"))}),[_,oe]),(0,t.useEffect)((()=>{oe&&de&&_((0,g.XXG)({projectId:oe,typeId:de.replace(" - O&M",""),accessSource:"Form Responses"}))}),[_,de,oe]);const fe=(0,t.useCallback)((async()=>{Q(!0);const e=await(0,j.default)("/area-project-level",{method:"GET",params:ie,query:{formId:ie,sort:["rank","ASC"]}});if(e.success){const{data:r,accessRank:t}=e.data;var a;if(Y(t),r)B(null===(a=r[0])||void 0===a?void 0:a.gaaLevels);else B(null)}Q(!1)}),[ie]);(0,t.useEffect)((()=>{ie&&fe()}),[ie,fe]);const he=(0,t.useCallback)(((e,a)=>{var r;const t=a-1;return null!==(r=ae())&&void 0!==r&&r[`gaaLevelEntryId${t}`]?e.gaa_level_entries.filter((e=>{var a,r;return null===(a=ae())||void 0===a||null===(r=a[`gaaLevelEntryId${t}`])||void 0===r?void 0:r.includes(null===e||void 0===e?void 0:e.parentId)})):e.gaa_level_entries}),[ae]),je=(0,t.useCallback)(((e,a,r,t,l)=>{(r=structuredClone(r))[`gaaLevelEntryId${e}`]=l;let o=e;for(;o<(t?a.length-1:a.length);){var d,i,n;const e=`gaaLevelEntryId${o+1}`,t=`gaaLevelEntryId${o}`,l=a[o+1],s=null!==(d=r)&&void 0!==d&&d[t]&&null!==l&&void 0!==l&&l.gaa_level_entries?null===l||void 0===l||null===(i=l.gaa_level_entries)||void 0===i?void 0:i.filter((e=>{var a;return(null===(a=r)||void 0===a?void 0:a[t])===(null===e||void 0===e?void 0:e.parentId)})):(null===l||void 0===l?void 0:l.gaa_level_entries)||[],u=Array.isArray(r[e])&&(null===(n=r[e])||void 0===n?void 0:n.filter((e=>s.some((a=>a.id===e)))))||[];re(e,u),r[e]=u,o+=1}M([]),$(!1)}),[re]);return(0,I.jsxs)(u.A,{title:"Validation Status Report",children:[(0,I.jsx)(m.Op,{methods:K,onSubmit:ee((()=>{$(!0)})),children:(0,I.jsxs)(n.Ay,{container:!0,spacing:4,mb:3,children:[(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.eu,{name:"projectId",label:"Project",menus:Z||[],required:!0,onChange:()=>{re("formTypeId",""),re("formId",""),M([]),$(!1)}})}),(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.eu,{name:"formTypeId",label:"Form Type",menus:ve,required:!0,onChange:()=>{re("formId",""),M([]),$(!1)}})}),(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.eu,{name:"formId",label:"Type",menus:ge||[],required:!0,onChange:()=>{M([]),$(!1)}})}),(0,I.jsx)(n.Ay,{item:!0,xs:3,md:3,children:(0,I.jsx)(m.gk,{name:"approvalLevels",title:"Select Approval Levels",singleLineRadio:"true",labels:L,onChange:e=>{var a;w(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)},style:{"& label":{marginTop:"0",width:"33%"},marginTop:"10px !important",padding:"3px 0"},required:!0,defaultValue:L[0].value})}),(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.eu,{name:"hierarchyType",label:"Hierarchy Type",menus:b,required:!1,onChange:e=>{var a;return D(null===e||void 0===e||null===(a=e.target)||void 0===a?void 0:a.value)},defaultValue:b[0].id})}),"gaa"===F&&ie&&(null===X||void 0===X?void 0:X.length)>0&&(null===X||void 0===X?void 0:X.map(((e,a)=>{var r,t,l;return(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.Yq,{required:0===a||e.rank<=G,name:`gaaLevelEntryId${a}`,label:e.name,onChange:je.bind(null,a,X,ae(),!0),menus:he(e,a),disable:0!==a&&e.rank>G&&!(null!==(r=ae())&&void 0!==r&&null!==(t=r["gaaLevelEntryId"+(a-1)])&&void 0!==t&&t.length),errorMessage:null===(l=le[`gaaLevelEntryId${a}`])||void 0===l?void 0:l.message})},e.id)}))),(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.o3,{name:"dateFrom",disabled:!1,type:"date",label:"Date From",InputLabelProps:{shrink:!0},required:!0})}),(0,I.jsx)(n.Ay,{item:!0,md:3,xl:3,children:(0,I.jsx)(m.o3,{name:"dateTo",disabled:!1,type:"date",label:"Date To",InputLabelProps:{shrink:!0},required:!0})}),(0,I.jsx)(n.Ay,{item:!0,xs:12,sx:{mt:2,display:"flex",justifyContent:"flex-end",gap:"20px"},children:(0,I.jsx)(s.A,{disabled:J,type:"submit",size:"small",variant:"contained",color:"primary",children:"Proceed"})})]})}),O&&(0,I.jsx)(p.default,{hideColumnsSelect:!0,hideSearch:!0,hideAddButton:!0,loadingCondition:0===(null===z||void 0===z?void 0:z.length),title:"Validation Status Report",data:z,count:U,setPageIndex:P,setPageSize:k,pageIndex:T,pageSize:E,columns:me,hideActions:!0,exportConfig:{tableName:"validation_status_report",apiQuery:{projectId:oe,formId:ie,formType:ce,pageSize:E,pageIndex:T,approver:H.toUpperCase(),gaaLevelDetails:q,dateFrom:ne,dateTo:se}}})]})}}}]);