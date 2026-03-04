import { useState, useEffect } from "react";

const fmt = (v) => v?.toLocaleString("ko-KR") ?? "0";
const pct = (v) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%";
const pc = (v) => (v >= 0 ? "#00e4a0" : "#ff5470");
const CL = ["#00e4a0","#7c5cfc","#ff5470","#ffb800","#00b4d8","#ff8fab","#a78bfa","#f97316"];
const SAMPLE = [
  { symbol:"삼성전자", qty:50, avg:71000, cur:72500, sec:"반도체" },
  { symbol:"SK하이닉스", qty:20, avg:178000, cur:185000, sec:"반도체" },
  { symbol:"NAVER", qty:15, avg:210000, cur:198000, sec:"IT/플랫폼" },
  { symbol:"카카오", qty:30, avg:52000, cur:48500, sec:"IT/플랫폼" },
  { symbol:"현대차", qty:10, avg:245000, cur:262000, sec:"자동차" },
  { symbol:"LG에너지솔루션", qty:5, avg:380000, cur:395000, sec:"배터리" },
];
const THEMES = [
  {e:"🤖",l:"AI / 인공지능",k:"AI 인공지능 관련주"},{e:"🔋",l:"2차전지",k:"2차전지 배터리 관련주"},
  {e:"💊",l:"바이오 / 제약",k:"바이오 제약 관련주"},{e:"🛡️",l:"방산 / 우주항공",k:"방위산업 우주항공 관련주"},
  {e:"🔌",l:"반도체",k:"반도체 관련주"},{e:"☀️",l:"신재생에너지",k:"신재생에너지 태양광 관련주"},
  {e:"⚙️",l:"로봇 / 자동화",k:"로봇 자동화 관련주"},{e:"🚗",l:"자율주행 / 전기차",k:"자율주행 전기차 관련주"},
  {e:"🏗️",l:"건설 / 인프라",k:"건설 인프라 관련주"},{e:"📱",l:"플랫폼 / 콘텐츠",k:"플랫폼 콘텐츠 관련주"},
  {e:"💰",l:"고배당주",k:"고배당 배당성장 관련주"},{e:"📊",l:"실적 호전주",k:"최근 실적 호전 관련주"},
];
const BG = `\n중요: 전문 용어마다 괄호로 쉬운 설명을 달아주세요. 예: PER(주가수익비율 - 주가가 순이익의 몇 배인지, 낮을수록 저평가). 숫자는 좋은지 나쁜지 판단 기준도 함께 알려주세요. 각 섹션 끝에 "> 💡 초보자 팁:" 한 줄을 추가해 핵심을 쉽게 요약하세요. 비유와 일상 예시를 적극 활용하세요. 마지막에 "## 📖 용어 사전" 섹션을 추가해 리포트에서 사용된 주요 투자 용어를 한 줄씩 쉽게 설명하세요. 한국어로 답변.\n`;

function Donut({data,size=148}){const total=data.reduce((s,d)=>s+d.value,0);let cum=0;return(<div style={{display:"flex",alignItems:"center",gap:16}}><svg width={size} height={size}>{data.map((d,i)=>{const s0=cum/total;cum+=d.value;const e0=cum/total;const sa=s0*Math.PI*2-Math.PI/2,ea=e0*Math.PI*2-Math.PI/2;const la=e0-s0>0.5?1:0,r=size/2-7,ir=r*0.6,cx=size/2,cy=size/2;return<path key={i} d={`M${cx+r*Math.cos(sa)},${cy+r*Math.sin(sa)} A${r},${r} 0 ${la} 1 ${cx+r*Math.cos(ea)},${cy+r*Math.sin(ea)} L${cx+ir*Math.cos(ea)},${cy+ir*Math.sin(ea)} A${ir},${ir} 0 ${la} 0 ${cx+ir*Math.cos(sa)},${cy+ir*Math.sin(sa)}Z`} fill={CL[i%8]} opacity={0.85}/>;})}</svg><div style={{display:"flex",flexDirection:"column",gap:4}}>{data.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11.5}}><div style={{width:8,height:8,borderRadius:2,background:CL[i%8]}}/><span style={{color:"#5e6e88"}}>{d.label}</span><span style={{color:"#a0adc4",fontWeight:700}}>{((d.value/total)*100).toFixed(1)}%</span></div>))}</div></div>);}

function HBar({data}){const mx=Math.max(...data.map(d=>Math.abs(d.value)),1);return(<div style={{display:"flex",flexDirection:"column",gap:5}}>{data.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:74,fontSize:11.5,color:"#5e6e88",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</span><div style={{flex:1,height:17,background:"#101828",borderRadius:3,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",left:d.value>=0?"50%":undefined,right:d.value<0?"50%":undefined,width:`${(Math.abs(d.value)/mx)*50}%`,height:"100%",borderRadius:3,transition:"width 0.5s",background:d.value>=0?"linear-gradient(90deg,#00e4a044,#00e4a0)":"linear-gradient(270deg,#ff547044,#ff5470)"}}/></div><span style={{width:54,fontSize:11,fontWeight:700,color:pc(d.value),textAlign:"right",fontFamily:"monospace"}}>{pct(d.value)}</span></div>))}</div>);}

function Card({title,children,style:s}){return(<div style={{background:"linear-gradient(160deg,#0d1320,#090e18)",border:"1px solid #161f35",borderRadius:12,padding:"16px 19px",...s}}>{title&&<div style={{fontSize:10.5,fontWeight:700,color:"#374460",textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>{title}</div>}{children}</div>);}

function LoadDots({msg}){const[n,setN]=useState(0);useEffect(()=>{const t=setInterval(()=>setN(p=>(p+1)%4),400);return()=>clearInterval(t);},[]);return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:45}}><div style={{textAlign:"center"}}><div style={{width:48,height:48,borderRadius:24,background:"linear-gradient(135deg,#7c5cfc22,#00e4a011)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:22}}><div style={{animation:"spin 1.5s linear infinite"}}>⟳</div></div><div style={{color:"#7c5cfc",fontWeight:600,fontSize:14}}>{"AI가 분석 중"+".".repeat(n)}</div><div style={{fontSize:11.5,color:"#374460",marginTop:5}}>{msg}</div></div></div>);}

function renderB(t){return t.split(/\*\*(.*?)\*\*/g).map((p,i)=>i%2?<strong key={i} style={{color:"#d5dced",fontWeight:700}}>{p}</strong>:p);}
function RenderAI({text}){if(!text)return null;return(<div style={{fontSize:13.2,lineHeight:1.85,color:"#8a99b5"}}>{text.split("\n").map((l,i)=>{if(l.startsWith("### "))return<h4 key={i} style={{color:"#00e4a0",margin:"14px 0 4px",fontSize:13.5,fontWeight:700}}>{l.slice(4)}</h4>;if(l.startsWith("## "))return<h3 key={i} style={{color:"#7c5cfc",margin:"16px 0 5px",fontSize:14.5,fontWeight:700}}>{l.slice(3)}</h3>;if(l.startsWith("# "))return<h2 key={i} style={{color:"#b8c5dc",margin:"18px 0 6px",fontSize:16,fontWeight:800}}>{l.slice(2)}</h2>;if(l.startsWith("> "))return<div key={i} style={{borderLeft:"3px solid #7c5cfc44",paddingLeft:12,margin:"4px 0",color:"#6b7e9a",fontSize:12.5,background:"#7c5cfc08",borderRadius:"0 6px 6px 0",padding:"8px 12px 8px 14px"}}>{renderB(l.slice(2))}</div>;if(l.startsWith("- ")||l.startsWith("• "))return<div key={i} style={{paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:0,color:"#7c5cfc"}}>•</span>{renderB(l.slice(2))}</div>;if(!l.trim())return<div key={i} style={{height:5}}/>;return<p key={i} style={{margin:"2px 0"}}>{renderB(l)}</p>;})}</div>);}

// ═══ MAIN APP ═══
export default function App(){
  const[tab,setTab]=useState(0);
  const[pf,setPf]=useState(SAMPLE);
  const[q,setQ]=useState("");const[res,setRes]=useState("");const[ld,setLd]=useState(false);
  const[sty,setSty]=useState("가치투자");const[rR,setRR]=useState("");const[rL,setRL]=useState(false);
  const[sT,setST]=useState("");const[sC,setSC]=useState("");const[sR,setSR]=useState("");const[sL,setSL]=useState(false);
  const[ns,setNs]=useState({s:"",q:"",a:"",c:"",sc:""});
  const[beg,setBeg]=useState(true);

  const tI=pf.reduce((s,p)=>s+p.qty*p.avg,0),tC=pf.reduce((s,p)=>s+p.qty*p.cur,0),tR=tI?((tC-tI)/tI)*100:0,tP=tC-tI;
  const sm={};pf.forEach(p=>{sm[p.sec]=(sm[p.sec]||0)+p.qty*p.cur;});
  const sd=Object.entries(sm).map(([label,value])=>({label,value}));
  const rd=pf.map(p=>({label:p.symbol,value:((p.cur-p.avg)/p.avg)*100}));
  const add=()=>{if(!ns.s||!ns.q||!ns.a||!ns.c)return;setPf([...pf,{symbol:ns.s,qty:+ns.q,avg:+ns.a,cur:+ns.c,sec:ns.sc||"기타"}]);setNs({s:"",q:"",a:"",c:"",sc:""});};

  const callAI=async(prompt,sr,sl)=>{sl(true);sr("");try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}],tools:[{type:"web_search_20250305",name:"web_search"}]})});const d=await r.json();sr(d.content?.filter(c=>c.type==="text").map(c=>c.text).join("\n")||"결과를 가져오지 못했습니다.");}catch(e){sr("오류: "+e.message);}sl(false);};

  const bg=beg?BG:"\n한국어로 답변.\n";

  const analyze=()=>{if(!q.trim())return;callAI(`한국 주식시장 전문 애널리스트이자 초보자 멘토로서 "${q}" 종목을 웹 검색으로 최신 정보 기반 분석하세요.\n\n## 기업 개요\n이 회사가 뭘 하는지, 우리 일상과 어떻게 연결되는지 쉽게 설명. 핵심 경쟁력 포함.\n> 💡 초보자 팁: 한 줄 요약\n\n## 핵심 재무 지표\n매출, 영업이익, 순이익, PER, PBR, ROE 등. 각 지표가 뭔지, 이 수치가 좋은지 나쁜지 설명.\n> 💡 초보자 팁: 한 줄 요약\n\n## 강점 (투자하면 좋은 이유)\n긍정적 요인 3가지를 구체적 근거와 함께.\n> 💡 초보자 팁: 한 줄 요약\n\n## 리스크 (조심할 점)\n위험 요인 3가지를 구체적 근거와 함께.\n> 💡 초보자 팁: 한 줄 요약\n\n## 업종 전망\n이 산업의 미래 트렌드.\n> 💡 초보자 팁: 한 줄 요약\n\n## 종합 의견\n"이런 사람에게 적합 / 이런 사람은 주의" 형태로 정리.\n\n## 📖 용어 사전\n리포트에 쓰인 주요 용어를 한 줄씩 쉽게 설명.\n\n⚠️ 본 분석은 정보 제공 목적이며 투자 권유가 아닙니다.${bg}`,setRes,setLd);};

  const recommend=()=>{const ps=pf.map(p=>`${p.symbol}(${p.sec})`).join(", ");callAI(`전문 투자 리서치 애널리스트이자 초보자 멘토로서, 웹 검색으로 최신 정보 반영.\n\n보유: ${ps||"없음"}\n스타일: ${sty}\n\n## 포트폴리오 진단\n섹터 편중, 분산도, 리스크 진단. 각 개념을 쉽게 풀어 설명.\n> 💡 초보자 팁: 한 줄 요약\n\n## 추천 종목 5선\n각 종목:\n### [종목명] (섹터)\n- **이 회사는?**: 쉬운 설명\n- **추천 이유**: 구체적 근거\n- **핵심 수치**: 재무지표 + 의미\n- **리스크**: 주의점\n- **난이도**: 초보 적합 / 중급 이상\n\n## 포트폴리오 개선 제안\n비중 조절, 리밸런싱 등 용어 설명 포함.\n\n## 📖 용어 사전\n주요 용어 한 줄 설명.\n\n⚠️ 본 분석은 정보 제공 목적이며 투자 권유가 아닙니다.${bg}`,setRR,setRL);};

  const scan=(theme)=>{const t=theme||sC;if(!t.trim())return;setST(t);callAI(`한국 주식시장 전문 리서치 애널리스트이자 초보자 멘토.\n\n"${t}" 테마를 웹 검색으로 최신 뉴스와 동향 파악 후 유망 종목 분석.\n\n## 🔥 이 테마가 뭔가요?\n"${t}" 테마가 뭔지, 왜 주목받는지 쉽게 설명.\n> 💡 초보자 팁: 한 줄 요약\n\n## 📰 최신 시장 동향\n관련 최근 뉴스와 흐름 구체적 요약.\n> 💡 초보자 팁: 한 줄 요약\n\n## 📈 주목 종목 TOP 5\n### 1. [종목명] (코스피/코스닥)\n- **이 회사는?**: 쉬운 설명\n- **왜 관련?**: 구체적 연결고리\n- **현재 상황**: 주가, 실적 + 숫자 의미\n- **투자 매력도**: ★~★★★★★ (이유)\n- **리스크**: 주의점\n- **난이도**: 초보 적합 / 중급 이상\n\n## 💡 투자 전략\n분할매수, 비중 조절 등 용어 설명 포함.\n\n## ⚠️ 주의사항\n테마주 위험성도 설명.\n\n## 📖 용어 사전\n주요 용어 한 줄 설명.\n\n⚠️ 본 분석은 정보 제공 목적이며 투자 권유가 아닙니다.${bg}`,setSR,setSL);};

  const IS={background:"#070b14",border:"1px solid #161f35",borderRadius:7,padding:"8px 12px",color:"#a0adc4",fontSize:13,outline:"none",fontFamily:"inherit"};
  const BP={background:"linear-gradient(135deg,#7c5cfc,#00e4a0)",border:"none",borderRadius:9,color:"#fff",fontWeight:700,fontSize:13.5,padding:"9px 24px",cursor:"pointer"};

  return(
    <div style={{minHeight:"100vh",background:"#060a12",color:"#a0adc4",fontFamily:"'Pretendard','Inter',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#161f35;border-radius:3px}input::placeholder{color:#243050}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* HEADER */}
      <div style={{padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #0d1320",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#7c5cfc,#00e4a0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#060a12"}}>S</div>
          <div><div style={{fontSize:15,fontWeight:800,color:"#d5dced"}}>StockAI</div><div style={{fontSize:9.5,color:"#374460",letterSpacing:1}}>AI 주식 분석 & 추천</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11.5,color:beg?"#00e4a0":"#374460",fontWeight:600}}>📚 초보자 모드</span>
            <button onClick={()=>setBeg(!beg)} style={{width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",background:beg?"linear-gradient(135deg,#7c5cfc,#00e4a0)":"#161f35"}}>
              <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:3,left:beg?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px #0004"}}/>
            </button>
          </div>
          <div style={{display:"flex",gap:2,background:"#090e18",borderRadius:8,padding:2}}>
            {["📊 포트폴리오","🔍 종목분석","💡 AI추천","🌐 시장스캔"].map((t,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{background:tab===i?"linear-gradient(135deg,#7c5cfc12,#00e4a008)":"transparent",border:tab===i?"1px solid #7c5cfc30":"1px solid transparent",borderRadius:6,padding:"6px 13px",color:tab===i?"#d5dced":"#374460",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"20px 24px",maxWidth:1020,margin:"0 auto"}}>
        {/* Beginner Banner */}
        {beg&&tab!==0&&(<div style={{marginBottom:14,padding:"10px 15px",background:"linear-gradient(135deg,#7c5cfc0a,#00e4a006)",border:"1px solid #7c5cfc22",borderRadius:10,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>📚</span><div><div style={{fontSize:12.5,color:"#8a99b5",fontWeight:600}}>초보자 모드 ON</div><div style={{fontSize:11.5,color:"#4a5c78"}}>모든 전문 용어에 쉬운 설명 + 각 섹션에 초보자 팁이 추가됩니다</div></div></div>)}

        {/* ══ TAB 0: PORTFOLIO ══ */}
        {tab===0&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
          {beg&&<Card style={{background:"linear-gradient(135deg,#0d132088,#7c5cfc06)",border:"1px solid #7c5cfc18"}}><div style={{fontSize:13,color:"#8a99b5",lineHeight:1.7}}><b style={{color:"#d5dced"}}>💡 포트폴리오란?</b> 내가 가지고 있는 주식들의 모음이에요. <b style={{color:"#00e4a0"}}>초록색</b>=이익, <b style={{color:"#ff5470"}}>빨간색</b>=손실. 아래에서 종목을 추가/삭제할 수 있어요.</div></Card>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {[{l:"총 투자금",v:fmt(tI)+"원",c:"#6b7e9a",t:"주식 사는데 쓴 총 돈"},{l:"현재 평가액",v:fmt(tC)+"원",c:"#d5dced",t:"지금 팔면 받을 돈"},{l:"총 수익률",v:pct(tR),c:pc(tR),t:"투자금 대비 수익 비율"},{l:"평가 손익",v:(tP>=0?"+":"")+fmt(tP)+"원",c:pc(tP),t:"실제 번(또는 잃은) 금액"}].map((x,i)=>(
              <Card key={i}><div style={{fontSize:10.5,color:"#374460",marginBottom:4,fontWeight:600}}>{x.l}</div><div style={{fontSize:18,fontWeight:800,color:x.c,fontFamily:"monospace"}}>{x.v}</div>{beg&&<div style={{fontSize:10,color:"#4a5c78",marginTop:4}}>💡 {x.t}</div>}</Card>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Card title="섹터별 비중">{sd.length?<><Donut data={sd}/>{beg&&<div style={{fontSize:10.5,color:"#4a5c78",marginTop:8}}>💡 한 섹터에 너무 몰려있으면 위험해요. 여러 분야에 나누는 게 안전!</div>}</>:<span style={{color:"#374460",fontSize:12}}>종목을 추가하세요</span>}</Card>
            <Card title="종목별 수익률">{rd.length?<><HBar data={rd}/>{beg&&<div style={{fontSize:10.5,color:"#4a5c78",marginTop:8}}>💡 초록=이익, 빨강=손실. 막대가 길수록 변동이 큰 거예요.</div>}</>:<span style={{color:"#374460",fontSize:12}}>종목을 추가하세요</span>}</Card>
          </div>
          <Card title="보유 종목">
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{borderBottom:"1px solid #161f35"}}>{["종목","섹터","수량","평균단가","현재가","수익률","평가손익",""].map((h,i)=>(<th key={i} style={{padding:"8px 4px",textAlign:i>=2?"right":"left",color:"#374460",fontWeight:600,fontSize:10.5}}>{h}</th>))}</tr></thead>
            <tbody>{pf.map((p,i)=>{const r=((p.cur-p.avg)/p.avg)*100,pl=(p.cur-p.avg)*p.qty;return(<tr key={i} style={{borderBottom:"1px solid #0d1320"}}><td style={{padding:"9px 4px",fontWeight:700,color:"#d5dced"}}>{p.symbol}</td><td style={{padding:"9px 4px",color:"#374460",fontSize:11}}>{p.sec}</td><td style={{padding:"9px 4px",textAlign:"right",color:"#5e6e88",fontFamily:"monospace"}}>{p.qty}</td><td style={{padding:"9px 4px",textAlign:"right",color:"#5e6e88",fontFamily:"monospace"}}>{fmt(p.avg)}</td><td style={{padding:"9px 4px",textAlign:"right",color:"#d5dced",fontFamily:"monospace",fontWeight:700}}>{fmt(p.cur)}</td><td style={{padding:"9px 4px",textAlign:"right",color:pc(r),fontFamily:"monospace",fontWeight:700}}>{pct(r)}</td><td style={{padding:"9px 4px",textAlign:"right",color:pc(pl),fontFamily:"monospace"}}>{(pl>=0?"+":"")+fmt(pl)}</td><td style={{padding:"9px 4px",textAlign:"right"}}><button onClick={()=>setPf(pf.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#283350",cursor:"pointer",fontSize:13}}>✕</button></td></tr>);})}</tbody></table></div>
            {beg&&<div style={{fontSize:11,color:"#4a5c78",margin:"10px 0 6px",padding:"8px 12px",background:"#7c5cfc08",borderRadius:6,borderLeft:"3px solid #7c5cfc33"}}>💡 <b style={{color:"#8a99b5"}}>평균단가</b>=내가 산 평균 가격, <b style={{color:"#8a99b5"}}>현재가</b>=지금 시장 가격. 현재가가 평균단가보다 높으면 이익!</div>}
            <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
              <input placeholder="종목명" value={ns.s} onChange={e=>setNs({...ns,s:e.target.value})} style={{...IS,flex:2,minWidth:85}}/>
              <input placeholder="섹터" value={ns.sc} onChange={e=>setNs({...ns,sc:e.target.value})} style={{...IS,flex:1.5,minWidth:65}}/>
              <input placeholder="수량" type="number" value={ns.q} onChange={e=>setNs({...ns,q:e.target.value})} style={{...IS,flex:1,minWidth:55}}/>
              <input placeholder="평균단가" type="number" value={ns.a} onChange={e=>setNs({...ns,a:e.target.value})} style={{...IS,flex:1.5,minWidth:80}}/>
              <input placeholder="현재가" type="number" value={ns.c} onChange={e=>setNs({...ns,c:e.target.value})} style={{...IS,flex:1.5,minWidth:80}}/>
              <button onClick={add} style={{...BP,padding:"8px 16px",fontSize:12.5}}>추가</button>
            </div>
          </Card>
        </div>)}

        {/* ══ TAB 1: AI ANALYSIS ══ */}
        {tab===1&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}>🔍 AI 종목 분석</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:13}}>종목명을 입력하면 AI가 웹에서 최신 정보를 검색하여 {beg?"초보자도 이해할 수 있는 ":""}분석 리포트를 생성합니다.</div>
            <div style={{display:"flex",gap:8}}>
              <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} placeholder="예: 삼성전자, SK하이닉스, 테슬라..." style={{...IS,flex:1,fontSize:14,padding:"10px 15px"}}/>
              <button onClick={analyze} disabled={ld} style={{...BP,opacity:ld?0.5:1}}>{ld?"분석 중...":"분석하기"}</button>
            </div>
          </Card>
          {(ld||res)?(<Card style={{minHeight:160}}>{ld?<LoadDots msg="웹에서 최신 정보를 검색하고 분석하는 중"/>:<RenderAI text={res}/>}</Card>):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>{["삼성전자","SK하이닉스","NAVER","카카오","현대차","셀트리온"].map(n=>(<button key={n} onClick={()=>setQ(n)} style={{background:"#090e18",border:"1px solid #161f35",borderRadius:8,padding:"12px 13px",color:"#5e6e88",fontSize:12.5,cursor:"pointer",textAlign:"left"}}><span style={{color:"#7c5cfc",marginRight:6}}>→</span>{n} 분석하기</button>))}</div>
          )}
        </div>)}

        {/* ══ TAB 2: AI RECOMMENDATION ══ */}
        {tab===2&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}>💡 AI 종목 추천</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:13}}>포트폴리오와 투자 스타일 기반으로 {beg?"초보자도 따라할 수 있는 ":""}추천 종목과 개선 방향을 제안합니다.</div>
            <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#374460",marginBottom:6,fontWeight:600}}>투자 스타일 {beg&&<span style={{fontWeight:400,color:"#4a5c78"}}>(잘 모르면 "균형 포트폴리오" 추천!)</span>}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["가치투자","성장투자","배당투자","단기 트레이딩","균형 포트폴리오"].map(s=>(<button key={s} onClick={()=>setSty(s)} style={{background:sty===s?"linear-gradient(135deg,#7c5cfc22,#00e4a008)":"#070b14",border:sty===s?"1px solid #7c5cfc44":"1px solid #161f35",borderRadius:6,padding:"6px 13px",fontSize:12,color:sty===s?"#d5dced":"#374460",fontWeight:sty===s?700:500,cursor:"pointer"}}>{s}</button>))}</div>
              {beg&&<div style={{fontSize:10.5,color:"#4a5c78",marginTop:6}}>💡 가치투자=저평가 종목 장기보유 / 성장투자=빠르게 크는 회사 / 배당투자=꾸준히 용돈 주는 회사 / 균형=골고루</div>}
            </div>
            <div style={{marginBottom:12,padding:"10px 13px",background:"#070b14",borderRadius:8,border:"1px solid #161f35"}}><div style={{fontSize:10.5,color:"#374460",marginBottom:4,fontWeight:600}}>현재 포트폴리오</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{pf.length?pf.map((p,i)=>(<span key={i} style={{background:"#101828",borderRadius:4,padding:"2px 8px",fontSize:11,color:"#5e6e88",border:"1px solid #161f35"}}>{p.symbol}</span>)):<span style={{color:"#243050",fontSize:11.5}}>포트폴리오 탭에서 종목 추가 시 더 정확한 추천</span>}</div></div>
            <button onClick={recommend} disabled={rL} style={{...BP,width:"100%",opacity:rL?0.5:1}}>{rL?"추천 분석 중...":"🤖 AI 추천 받기"}</button>
          </Card>
          {(rL||rR)&&(<Card style={{minHeight:160}}>{rL?<LoadDots msg="포트폴리오를 분석하고 최적의 종목을 찾는 중"/>:<RenderAI text={rR}/>}</Card>)}
        </div>)}

        {/* ══ TAB 3: AI MARKET SCAN ══ */}
        {tab===3&&(<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}>🌐 AI 시장 스캔</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:14}}>AI가 인터넷에서 최신 뉴스를 검색하여 테마별 유망 종목을 찾아줍니다. {beg&&"초보자도 이해할 수 있도록 쉽게 설명해 드려요!"}</div>
            <div style={{marginBottom:14}}><div style={{fontSize:11,color:"#374460",marginBottom:8,fontWeight:600}}>🔥 인기 테마 선택</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>{THEMES.map(t=>(<button key={t.k} onClick={()=>scan(t.k)} disabled={sL} style={{background:sT===t.k&&(sL||sR)?"linear-gradient(135deg,#7c5cfc18,#00e4a008)":"#070b14",border:sT===t.k&&(sL||sR)?"1px solid #7c5cfc33":"1px solid #161f35",borderRadius:8,padding:"10px 8px",cursor:sL?"default":"pointer",opacity:sL?0.5:1,textAlign:"center"}}><div style={{fontSize:20,marginBottom:3}}>{t.e}</div><div style={{fontSize:11.5,color:"#8a99b5",fontWeight:600}}>{t.l}</div></button>))}</div>
            </div>
            <div><div style={{fontSize:11,color:"#374460",marginBottom:7,fontWeight:600}}>✏️ 직접 입력</div>
              <div style={{display:"flex",gap:8}}><input value={sC} onChange={e=>setSC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&scan()} placeholder="예: 트럼프 수혜주, 금리 인하, K-뷰티..." style={{...IS,flex:1,fontSize:13.5,padding:"10px 14px"}}/><button onClick={()=>scan()} disabled={sL||!sC.trim()} style={{...BP,opacity:(sL||!sC.trim())?0.5:1}}>{sL?"검색 중...":"🔍 스캔"}</button></div>
            </div>
          </Card>
          {(sL||sR)?(<Card style={{minHeight:160}}>{sL?<LoadDots msg={`"${sT}" 관련 최신 뉴스와 종목을 검색하는 중`}/>:<div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"10px 14px",background:"#070b14",borderRadius:8,border:"1px solid #161f35"}}><span style={{fontSize:16}}>🌐</span><span style={{fontSize:13,color:"#7c5cfc",fontWeight:700}}>검색 테마:</span><span style={{fontSize:13,color:"#d5dced",fontWeight:600}}>{sT}</span></div><RenderAI text={sR}/></div>}</Card>):(
            <Card style={{background:"linear-gradient(135deg,#0d132088,#7c5cfc08)",border:"1px solid #7c5cfc22"}}><div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:36,marginBottom:8}}>🌐</div><div style={{fontSize:14,color:"#8a99b5",fontWeight:600,marginBottom:4}}>위 테마를 선택하거나 키워드를 입력하세요</div><div style={{fontSize:12,color:"#374460"}}>AI가 인터넷에서 최신 뉴스를 검색하여 유망 종목을 찾아드립니다</div></div></Card>
          )}
        </div>)}
      </div>
    </div>
  );
}
