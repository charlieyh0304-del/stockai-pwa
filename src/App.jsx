import { useState, useEffect, useRef } from "react";

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

const TAB_NAMES = ["포트폴리오","실시간","종목분석","AI추천","시장스캔","뉴스"];
const TAB_EMOJIS = ["📊","📈","🔍","💡","🌐","📰"];

const RESPONSIVE_CSS = `
*{box-sizing:border-box}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#161f35;border-radius:3px}
input::placeholder{color:#243050}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
:focus-visible{outline:2px solid #7c5cfc;outline-offset:2px}

.header{padding:14px 22px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #0d1320;flex-wrap:wrap;gap:10px}
.header-right{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.tab-bar{display:flex;gap:2px;background:#090e18;border-radius:8px;padding:2px;overflow-x:auto;-webkit-overflow-scrolling:touch}
.tab-bar::-webkit-scrollbar{display:none}
.tab-btn{background:transparent;border:1px solid transparent;border-radius:6px;padding:6px 13px;color:#374460;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit}
.tab-btn.active{background:linear-gradient(135deg,#7c5cfc12,#00e4a008);border:1px solid #7c5cfc30;color:#d5dced}

.main-content{padding:20px 24px;max-width:1020px;margin:0 auto}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.donut-wrap{display:flex;align-items:center;gap:16px}
.themes-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
.quick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.add-form{margin-top:10px;display:flex;gap:6px;flex-wrap:wrap}

.mobile-cards{display:none}
.desktop-table{display:block}

@media(max-width:768px){
  .header{padding:12px 16px;gap:8px}
  .header-right{width:100%;justify-content:space-between}
  .tab-bar{flex:1;min-width:0}
  .tab-btn{padding:6px 10px;font-size:11px}
  .main-content{padding:14px 12px}
  .stats-grid{grid-template-columns:repeat(2,1fr);gap:8px}
  .charts-grid{grid-template-columns:1fr}
  .donut-wrap{flex-direction:column;align-items:flex-start}
  .themes-grid{grid-template-columns:repeat(3,1fr);gap:6px}
  .quick-grid{grid-template-columns:repeat(2,1fr);gap:7px}
  .add-form{flex-direction:column}
  .add-form input,.add-form button{width:100%!important;min-width:0!important;flex:none!important}
  .desktop-table{display:none}
  .mobile-cards{display:flex;flex-direction:column;gap:8px}
}

@media(max-width:480px){
  .header{padding:10px 12px}
  .main-content{padding:10px 8px}
  .stats-grid{grid-template-columns:1fr 1fr;gap:6px}
  .themes-grid{grid-template-columns:repeat(2,1fr);gap:5px}
  .quick-grid{grid-template-columns:1fr 1fr;gap:6px}
  .tab-btn{padding:5px 8px;font-size:10.5px}
}
`;

function Donut({data,size=148}){const total=data.reduce((s,d)=>s+d.value,0);let cum=0;const ariaLabel="섹터별 비중: "+data.map(d=>d.label+" "+((d.value/total)*100).toFixed(1)+"%").join(", ");return(<div className="donut-wrap"><svg width={size} height={size} role="img" aria-label={ariaLabel}>{data.map((d,i)=>{const s0=cum/total;cum+=d.value;const e0=cum/total;const sa=s0*Math.PI*2-Math.PI/2,ea=e0*Math.PI*2-Math.PI/2;const la=e0-s0>0.5?1:0,r=size/2-7,ir=r*0.6,cx=size/2,cy=size/2;return<path key={i} d={`M${cx+r*Math.cos(sa)},${cy+r*Math.sin(sa)} A${r},${r} 0 ${la} 1 ${cx+r*Math.cos(ea)},${cy+r*Math.sin(ea)} L${cx+ir*Math.cos(ea)},${cy+ir*Math.sin(ea)} A${ir},${ir} 0 ${la} 0 ${cx+ir*Math.cos(sa)},${cy+ir*Math.sin(sa)}Z`} fill={CL[i%8]} opacity={0.85}/>;})}</svg><table className="sr-only"><caption>섹터별 비중</caption><thead><tr><th scope="col">섹터</th><th scope="col">비중</th></tr></thead><tbody>{data.map((d,i)=>(<tr key={i}><td>{d.label}</td><td>{((d.value/total)*100).toFixed(1)}%</td></tr>))}</tbody></table><div style={{display:"flex",flexDirection:"column",gap:4}}>{data.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11.5}}><div style={{width:8,height:8,borderRadius:2,background:CL[i%8]}} aria-hidden="true"/><span style={{color:"#5e6e88"}}>{d.label}</span><span style={{color:"#a0adc4",fontWeight:700}}>{((d.value/total)*100).toFixed(1)}%</span></div>))}</div></div>);}

function HBar({data}){const mx=Math.max(...data.map(d=>Math.abs(d.value)),1);const ariaLabel="종목별 수익률: "+data.map(d=>d.label+" "+pct(d.value)).join(", ");return(<div role="img" aria-label={ariaLabel}><div style={{display:"flex",flexDirection:"column",gap:5}}>{data.map((d,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:74,fontSize:11.5,color:"#5e6e88",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label}</span><div style={{flex:1,height:17,background:"#101828",borderRadius:3,position:"relative",overflow:"hidden"}} aria-hidden="true"><div style={{position:"absolute",left:d.value>=0?"50%":undefined,right:d.value<0?"50%":undefined,width:`${(Math.abs(d.value)/mx)*50}%`,height:"100%",borderRadius:3,transition:"width 0.5s",background:d.value>=0?"linear-gradient(90deg,#00e4a044,#00e4a0)":"linear-gradient(270deg,#ff547044,#ff5470)"}}/></div><span style={{width:54,fontSize:11,fontWeight:700,color:pc(d.value),textAlign:"right",fontFamily:"monospace"}}>{pct(d.value)}</span></div>))}</div><ul className="sr-only">{data.map((d,i)=>(<li key={i}>{d.label}: {pct(d.value)} {d.value>=0?"이익":"손실"}</li>))}</ul></div>);}

function Card({title,children,style:s}){return(<div role={title?"region":undefined} aria-label={title||undefined} style={{background:"linear-gradient(160deg,#0d1320,#090e18)",border:"1px solid #161f35",borderRadius:12,padding:"16px 19px",...s}}>{title&&<h2 style={{fontSize:10.5,fontWeight:700,color:"#374460",textTransform:"uppercase",letterSpacing:1.5,margin:"0 0 12px 0"}}>{title}</h2>}{children}</div>);}

function LoadDots({msg}){const[n,setN]=useState(0);useEffect(()=>{const t=setInterval(()=>setN(p=>(p+1)%4),400);return()=>clearInterval(t);},[]);return(<div role="status" aria-live="polite" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:45}}><div style={{textAlign:"center"}}><div style={{width:48,height:48,borderRadius:24,background:"linear-gradient(135deg,#7c5cfc22,#00e4a011)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:22}} aria-hidden="true"><div style={{animation:"spin 1.5s linear infinite"}}>⟳</div></div><div style={{color:"#7c5cfc",fontWeight:600,fontSize:14}}>{"AI가 분석 중"+".".repeat(n)}</div><div style={{fontSize:11.5,color:"#374460",marginTop:5}}>{msg}</div></div></div>);}

function renderB(t){return t.split(/\*\*(.*?)\*\*/g).map((p,i)=>i%2?<strong key={i} style={{color:"#d5dced",fontWeight:700}}>{p}</strong>:p);}
function RenderAI({text}){if(!text)return null;const lines=text.split("\n");const elements=[];let listItems=[];const flushList=()=>{if(listItems.length>0){elements.push(<ul key={"ul-"+elements.length} style={{listStyle:"none",padding:0,margin:0}}>{listItems}</ul>);listItems=[];}};lines.forEach((l,i)=>{if(l.startsWith("- ")||l.startsWith("• ")){listItems.push(<li key={i} style={{paddingLeft:14,position:"relative"}}><span style={{position:"absolute",left:0,color:"#7c5cfc"}} aria-hidden="true">•</span>{renderB(l.slice(2))}</li>);}else{flushList();if(l.startsWith("### "))elements.push(<h4 key={i} style={{color:"#00e4a0",margin:"14px 0 4px",fontSize:13.5,fontWeight:700}}>{l.slice(4)}</h4>);else if(l.startsWith("## "))elements.push(<h3 key={i} style={{color:"#7c5cfc",margin:"16px 0 5px",fontSize:14.5,fontWeight:700}}>{l.slice(3)}</h3>);else if(l.startsWith("# "))elements.push(<h2 key={i} style={{color:"#b8c5dc",margin:"18px 0 6px",fontSize:16,fontWeight:800}}>{l.slice(2)}</h2>);else if(l.startsWith("> "))elements.push(<div key={i} style={{borderLeft:"3px solid #7c5cfc44",paddingLeft:12,margin:"4px 0",color:"#6b7e9a",fontSize:12.5,background:"#7c5cfc08",borderRadius:"0 6px 6px 0",padding:"8px 12px 8px 14px"}}>{renderB(l.slice(2))}</div>);else if(!l.trim())elements.push(<div key={i} style={{height:5}}/>);else elements.push(<p key={i} style={{margin:"2px 0"}}>{renderB(l)}</p>);}});flushList();return(<div aria-live="polite" style={{fontSize:13.2,lineHeight:1.85,color:"#8a99b5"}}>{elements}</div>);}

function MobileStockCard({p,i,onDelete}){
  const r=((p.cur-p.avg)/p.avg)*100,pl=(p.cur-p.avg)*p.qty;
  return(
    <div style={{background:"#0a0f1a",border:"1px solid #161f35",borderRadius:10,padding:"12px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div><span style={{fontWeight:700,color:"#d5dced",fontSize:13.5}}>{p.symbol}</span><span style={{color:"#374460",fontSize:10.5,marginLeft:6}}>{p.sec}</span></div>
        <button onClick={onDelete} aria-label={p.symbol+" 삭제"} style={{background:"none",border:"none",color:"#283350",cursor:"pointer",fontSize:13}}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 12px",fontSize:11.5}}>
        <div><span style={{color:"#374460"}}>수량 </span><span style={{color:"#5e6e88",fontFamily:"monospace"}}>{p.qty}</span></div>
        <div><span style={{color:"#374460"}}>평균 </span><span style={{color:"#5e6e88",fontFamily:"monospace"}}>{fmt(p.avg)}</span></div>
        <div><span style={{color:"#374460"}}>현재 </span><span style={{color:"#d5dced",fontFamily:"monospace",fontWeight:700}}>{fmt(p.cur)}</span></div>
        <div><span style={{color:"#374460"}}>수익 </span><span style={{color:pc(r),fontFamily:"monospace",fontWeight:700}}>{pct(r)}</span><span className="sr-only">{r>=0?"이익":"손실"}</span></div>
      </div>
      <div style={{marginTop:6,textAlign:"right",fontSize:12,color:pc(pl),fontFamily:"monospace",fontWeight:700}}>{(pl>=0?"+":"")+fmt(pl)}원<span className="sr-only">{pl>=0?"이익":"손실"}</span></div>
    </div>
  );
}

// ═══ MAIN APP ═══
export default function App(){
  const[tab,setTab]=useState(0);
  const[pf,setPf]=useState(SAMPLE);
  const[q,setQ]=useState("");const[res,setRes]=useState("");const[ld,setLd]=useState(false);
  const[sty,setSty]=useState("가치투자");const[rR,setRR]=useState("");const[rL,setRL]=useState(false);
  const[sT,setST]=useState("");const[sC,setSC]=useState("");const[sR,setSR]=useState("");const[sL,setSL]=useState(false);
  const[prR,setPrR]=useState("");const[prL,setPrL]=useState(false);
  const[nwCat,setNwCat]=useState("전체");const[nwR,setNwR]=useState("");const[nwL,setNwL]=useState(false);
  const[ns,setNs]=useState({s:"",q:"",a:"",c:"",sc:""});
  const[beg,setBeg]=useState(true);
  const[announce,setAnnounce]=useState("");
  const[apiKey,setApiKey]=useState(()=>localStorage.getItem("stockai-api-key")||"");
  const[showKey,setShowKey]=useState(false);
  const tabRefs=useRef([]);
  const panelRef=useRef(null);

  useEffect(()=>{panelRef.current?.focus();},[tab]);

  const tI=pf.reduce((s,p)=>s+p.qty*p.avg,0),tC=pf.reduce((s,p)=>s+p.qty*p.cur,0),tR=tI?((tC-tI)/tI)*100:0,tP=tC-tI;
  const sm={};pf.forEach(p=>{sm[p.sec]=(sm[p.sec]||0)+p.qty*p.cur;});
  const sd=Object.entries(sm).map(([label,value])=>({label,value}));
  const rd=pf.map(p=>({label:p.symbol,value:((p.cur-p.avg)/p.avg)*100}));
  const add=()=>{if(!ns.s||!ns.q||!ns.a||!ns.c)return;setPf([...pf,{symbol:ns.s,qty:+ns.q,avg:+ns.a,cur:+ns.c,sec:ns.sc||"기타"}]);setAnnounce(ns.s+" 종목이 추가되었습니다");setNs({s:"",q:"",a:"",c:"",sc:""});};
  const delStock=(idx)=>{const symbol=pf[idx].symbol;setPf(pf.filter((_,j)=>j!==idx));setAnnounce(symbol+" 종목이 삭제되었습니다");};

  const saveApiKey=(key)=>{setApiKey(key);localStorage.setItem("stockai-api-key",key);};
  const callAI=async(prompt,sr,sl)=>{if(!apiKey){setShowKey(true);sr("API 키를 먼저 설정해주세요. 헤더의 🔑 버튼을 눌러 Anthropic API 키를 입력하세요.");return;}sl(true);sr("");try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}],tools:[{type:"web_search_20250305",name:"web_search"}]})});const d=await r.json();if(d.error){sr("오류: "+d.error.message);sl(false);return;}sr(d.content?.filter(c=>c.type==="text").map(c=>c.text).join("\n")||"결과를 가져오지 못했습니다.");}catch(e){sr("오류: "+e.message);}sl(false);};

  const bg=beg?BG:"\n한국어로 답변.\n";

  const fetchPrices=()=>{
    const symbols=pf.map(p=>p.symbol).join(", ");
    callAI(`한국 주식시장 전문 애널리스트입니다. 웹 검색으로 다음 정보를 최신 데이터로 조회하세요.

## 📊 주요 지수
코스피, 코스닥, 원/달러 환율의 현재값, 전일 대비 등락폭(+/-), 등락률(%)을 표로 정리.

## 📈 보유 종목 시세
다음 종목들의 실시간 시세를 조회: ${symbols||"삼성전자, SK하이닉스, NAVER, 카카오, 현대차"}

각 종목별로:
- **현재가** (원)
- **전일 대비** (+/- 금액, %)
- **거래량**
- **시가총액**
- **52주 최고/최저**

표 형태로 깔끔하게 정리해주세요.

## 🔥 오늘의 특징주
오늘 급등/급락한 주요 종목 3개씩, 사유와 함께 간단히.

## 📌 시장 한줄 요약
현재 시장 분위기를 한 문장으로.

한국어로 답변.`,setPrR,setPrL);
  };

  const analyze=()=>{if(!q.trim())return;callAI(`한국 주식시장 전문 애널리스트이자 초보자 멘토로서 "${q}" 종목을 웹 검색으로 최신 정보 기반 분석하세요.\n\n## 기업 개요\n이 회사가 뭘 하는지, 우리 일상과 어떻게 연결되는지 쉽게 설명. 핵심 경쟁력 포함.\n> 💡 초보자 팁: 한 줄 요약\n\n## 핵심 재무 지표\n매출, 영업이익, 순이익, PER, PBR, ROE 등. 각 지표가 뭔지, 이 수치가 좋은지 나쁜지 설명.\n> 💡 초보자 팁: 한 줄 요약\n\n## 강점 (투자하면 좋은 이유)\n긍정적 요인 3가지를 구체적 근거와 함께.\n> 💡 초보자 팁: 한 줄 요약\n\n## 리스크 (조심할 점)\n위험 요인 3가지를 구체적 근거와 함께.\n> 💡 초보자 팁: 한 줄 요약\n\n## 업종 전망\n이 산업의 미래 트렌드.\n> 💡 초보자 팁: 한 줄 요약\n\n## 종합 의견\n"이런 사람에게 적합 / 이런 사람은 주의" 형태로 정리.\n\n## 📖 용어 사전\n리포트에 쓰인 주요 용어를 한 줄씩 쉽게 설명.\n\n⚠️ 본 분석은 정보 제공 목적이며 투자 권유가 아닙니다.${bg}`,setRes,setLd);};

  const recommend=()=>{const ps=pf.map(p=>`${p.symbol}(${p.sec})`).join(", ");callAI(`전문 투자 리서치 애널리스트이자 초보자 멘토로서, 웹 검색으로 최신 정보 반영.\n\n보유: ${ps||"없음"}\n스타일: ${sty}\n\n## 포트폴리오 진단\n섹터 편중, 분산도, 리스크 진단. 각 개념을 쉽게 풀어 설명.\n> 💡 초보자 팁: 한 줄 요약\n\n## 추천 종목 5선\n각 종목:\n### [종목명] (섹터)\n- **이 회사는?**: 쉬운 설명\n- **추천 이유**: 구체적 근거\n- **핵심 수치**: 재무지표 + 의미\n- **리스크**: 주의점\n- **난이도**: 초보 적합 / 중급 이상\n\n## 포트폴리오 개선 제안\n비중 조절, 리밸런싱 등 용어 설명 포함.\n\n## 📖 용어 사전\n주요 용어 한 줄 설명.\n\n⚠️ 본 분석은 정보 제공 목적이며 투자 권유가 아닙니다.${bg}`,setRR,setRL);};

  const scan=(theme)=>{const t=theme||sC;if(!t.trim())return;setST(t);callAI(`한국 주식시장 전문 리서치 애널리스트이자 초보자 멘토.\n\n"${t}" 테마를 웹 검색으로 최신 뉴스와 동향 파악 후 유망 종목 분석.\n\n## 🔥 이 테마가 뭔가요?\n"${t}" 테마가 뭔지, 왜 주목받는지 쉽게 설명.\n> 💡 초보자 팁: 한 줄 요약\n\n## 📰 최신 시장 동향\n관련 최근 뉴스와 흐름 구체적 요약.\n> 💡 초보자 팁: 한 줄 요약\n\n## 📈 주목 종목 TOP 5\n### 1. [종목명] (코스피/코스닥)\n- **이 회사는?**: 쉬운 설명\n- **왜 관련?**: 구체적 연결고리\n- **현재 상황**: 주가, 실적 + 숫자 의미\n- **투자 매력도**: ★~★★★★★ (이유)\n- **리스크**: 주의점\n- **난이도**: 초보 적합 / 중급 이상\n\n## 💡 투자 전략\n분할매수, 비중 조절 등 용어 설명 포함.\n\n## ⚠️ 주의사항\n테마주 위험성도 설명.\n\n## 📖 용어 사전\n주요 용어 한 줄 설명.\n\n⚠️ 본 분석은 정보 제공 목적이며 투자 권유가 아닙니다.${bg}`,setSR,setSL);};

  const fetchNews=()=>{
    const symbols=pf.map(p=>p.symbol).join(", ");
    const catPrompt=nwCat==="보유종목"?`특히 다음 보유 종목 관련 뉴스 위주로: ${symbols||"주요 대형주"}`
      :nwCat==="전체"?"한국 주식시장 전반의 주요 뉴스"
      :`"${nwCat}" 관련 주식 뉴스`;
    callAI(`한국 주식시장 전문 뉴스 애널리스트입니다. 웹 검색으로 오늘 가장 중요한 최신 주식 뉴스를 조회하세요.

카테고리: ${catPrompt}

## 📰 주요 뉴스 TOP 5
각 뉴스별로:
### [번호]. [뉴스 제목]
- **핵심 내용**: 2-3문장 요약
- **관련 종목**: 해당 뉴스로 영향받는 종목들 (긍정적↑ / 부정적↓ 표시)
- **투자 시사점**: 투자자가 알아야 할 포인트

## 📊 시장 심리 분석
현재 시장 분위기(공포/중립/탐욕), 주요 이슈 키워드 3개.

## 🔮 내일 주목할 이벤트
내일 예정된 주요 경제 이벤트, 실적 발표 등.

한국어로 답변.`,setNwR,setNwL);
  };

  const handleTabKeyDown=(e)=>{
    const total=TAB_NAMES.length;
    let next=null;
    if(e.key==="ArrowRight"){next=(tab+1)%total;}
    else if(e.key==="ArrowLeft"){next=(tab-1+total)%total;}
    if(next!==null){e.preventDefault();setTab(next);tabRefs.current[next]?.focus();}
  };

  const IS={background:"#070b14",border:"1px solid #161f35",borderRadius:7,padding:"8px 12px",color:"#a0adc4",fontSize:13,outline:"none",fontFamily:"inherit"};
  const BP={background:"linear-gradient(135deg,#7c5cfc,#00e4a0)",border:"none",borderRadius:9,color:"#fff",fontWeight:700,fontSize:13.5,padding:"9px 24px",cursor:"pointer"};

  return(
    <div style={{minHeight:"100vh",background:"#060a12",color:"#a0adc4",fontFamily:"'Pretendard','Inter',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{RESPONSIVE_CSS}</style>

      {/* Skip navigation */}
      <a href="#main-content" className="sr-only" style={{position:'absolute',left:'-9999px',top:'auto',width:'1px',height:'1px',overflow:'hidden',zIndex:9999}} onFocus={e=>{e.target.style.position='static';e.target.style.width='auto';e.target.style.height='auto';}} onBlur={e=>{e.target.style.position='absolute';e.target.style.left='-9999px';}}>본문으로 건너뛰기</a>

      {/* Live announcements */}
      <div className="sr-only" role="status" aria-live="polite">{announce}</div>

      <h1 className="sr-only">StockAI - AI 주식 분석 대시보드</h1>

      {/* HEADER */}
      <header className="header">
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#7c5cfc,#00e4a0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#060a12"}} aria-hidden="true">S</div>
          <div><div style={{fontSize:15,fontWeight:800,color:"#d5dced"}}>StockAI</div><div style={{fontSize:9.5,color:"#374460",letterSpacing:1}}>AI 주식 분석 & 추천</div></div>
        </div>
        <div className="header-right">
          <button onClick={()=>setShowKey(!showKey)} aria-label="API 키 설정" style={{background:apiKey?"#0d1320":"linear-gradient(135deg,#ff5470,#ffb800)",border:apiKey?"1px solid #161f35":"none",borderRadius:7,padding:"5px 10px",fontSize:12,color:apiKey?"#5e6e88":"#fff",cursor:"pointer",fontWeight:600}} title="Anthropic API 키 설정"><span aria-hidden="true">🔑</span> {apiKey?"API 설정됨":"API 키 필요"}</button>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11.5,color:beg?"#00e4a0":"#374460",fontWeight:600}}><span aria-hidden="true">📚</span> 초보자 모드</span>
            <button onClick={()=>setBeg(!beg)} role="switch" aria-checked={beg} aria-label="초보자 모드" style={{width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",background:beg?"linear-gradient(135deg,#7c5cfc,#00e4a0)":"#161f35"}}>
              <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:3,left:beg?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px #0004"}}/>
            </button>
          </div>
          <nav aria-label="주요 메뉴">
            <div className="tab-bar" role="tablist">
              {TAB_NAMES.map((t,i)=>(
                <button key={i} ref={el=>tabRefs.current[i]=el} onClick={()=>setTab(i)} onKeyDown={handleTabKeyDown} role="tab" aria-selected={tab===i} id={"tab-"+i} aria-controls={"tabpanel-"+i} tabIndex={tab===i?0:-1} className={`tab-btn${tab===i?" active":""}`}><span aria-hidden="true">{TAB_EMOJIS[i]} </span>{t}</button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* API Key Modal */}
      {showKey&&(<div style={{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowKey(false)}><div onClick={e=>e.stopPropagation()} role="dialog" aria-label="API 키 설정" style={{background:"#0d1320",border:"1px solid #161f35",borderRadius:14,padding:"24px 28px",maxWidth:420,width:"100%"}}><div style={{fontSize:15,fontWeight:700,color:"#d5dced",marginBottom:6}}>Anthropic API 키 설정</div><div style={{fontSize:12,color:"#374460",marginBottom:14}}>AI 기능 사용을 위해 Anthropic API 키가 필요합니다. 키는 브라우저에만 저장됩니다.</div><input type="password" value={apiKey} onChange={e=>saveApiKey(e.target.value)} placeholder="sk-ant-..." aria-label="API 키 입력" style={{...IS,width:"100%",fontSize:14,padding:"10px 14px",marginBottom:12}}/><div style={{display:"flex",gap:8}}><button onClick={()=>setShowKey(false)} style={{...BP,flex:1}}>{apiKey?"저장 완료":"닫기"}</button>{apiKey&&<button onClick={()=>{saveApiKey("");}} style={{background:"#161f35",border:"1px solid #283350",borderRadius:9,color:"#ff5470",fontWeight:600,fontSize:13,padding:"9px 16px",cursor:"pointer"}}>삭제</button>}</div></div></div>)}

      <main id="main-content" className="main-content">
        {/* Beginner Banner */}
        {beg&&tab!==0&&tab!==1&&(<div style={{marginBottom:14,padding:"10px 15px",background:"linear-gradient(135deg,#7c5cfc0a,#00e4a006)",border:"1px solid #7c5cfc22",borderRadius:10,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}} aria-hidden="true">📚</span><div><div style={{fontSize:12.5,color:"#8a99b5",fontWeight:600}}>초보자 모드 ON</div><div style={{fontSize:11.5,color:"#4a5c78"}}>모든 전문 용어에 쉬운 설명 + 각 섹션에 초보자 팁이 추가됩니다</div></div></div>)}

        {/* ══ TAB 0: PORTFOLIO ══ */}
        {tab===0&&(<div role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0" ref={panelRef} tabIndex={-1} style={{display:"flex",flexDirection:"column",gap:14}}>
          {beg&&<Card style={{background:"linear-gradient(135deg,#0d132088,#7c5cfc06)",border:"1px solid #7c5cfc18"}}><div style={{fontSize:13,color:"#8a99b5",lineHeight:1.7}}><b style={{color:"#d5dced"}}><span aria-hidden="true">💡</span> 포트폴리오란?</b> 내가 가지고 있는 주식들의 모음이에요. <b style={{color:"#00e4a0"}}>초록색</b>=이익, <b style={{color:"#ff5470"}}>빨간색</b>=손실. 아래에서 종목을 추가/삭제할 수 있어요.</div></Card>}
          <div className="stats-grid">
            {[{l:"총 투자금",v:fmt(tI)+"원",c:"#6b7e9a",t:"주식 사는데 쓴 총 돈",pl:false},{l:"현재 평가액",v:fmt(tC)+"원",c:"#d5dced",t:"지금 팔면 받을 돈",pl:false},{l:"총 수익률",v:pct(tR),c:pc(tR),t:"투자금 대비 수익 비율",pl:true,pv:tR},{l:"평가 손익",v:(tP>=0?"+":"")+fmt(tP)+"원",c:pc(tP),t:"실제 번(또는 잃은) 금액",pl:true,pv:tP}].map((x,i)=>(
              <Card key={i}><div style={{fontSize:10.5,color:"#374460",marginBottom:4,fontWeight:600}}>{x.l}</div><div style={{fontSize:18,fontWeight:800,color:x.c,fontFamily:"monospace"}}>{x.v}{x.pl&&<span className="sr-only">{x.pv>=0?"이익":"손실"}</span>}</div>{beg&&<div style={{fontSize:10,color:"#4a5c78",marginTop:4}}><span aria-hidden="true">💡</span> {x.t}</div>}</Card>
            ))}
          </div>
          <div className="charts-grid">
            <Card title="섹터별 비중">{sd.length?<><Donut data={sd}/>{beg&&<div style={{fontSize:10.5,color:"#4a5c78",marginTop:8}}><span aria-hidden="true">💡</span> 한 섹터에 너무 몰려있으면 위험해요. 여러 분야에 나누는 게 안전!</div>}</>:<span style={{color:"#374460",fontSize:12}}>종목을 추가하세요</span>}</Card>
            <Card title="종목별 수익률">{rd.length?<><HBar data={rd}/>{beg&&<div style={{fontSize:10.5,color:"#4a5c78",marginTop:8}}><span aria-hidden="true">💡</span> 초록=이익, 빨강=손실. 막대가 길수록 변동이 큰 거예요.</div>}</>:<span style={{color:"#374460",fontSize:12}}>종목을 추가하세요</span>}</Card>
          </div>
          <Card title="보유 종목">
            {/* Desktop Table */}
            <div className="desktop-table" style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><caption className="sr-only">보유 종목 목록</caption><thead><tr style={{borderBottom:"1px solid #161f35"}}>{["종목","섹터","수량","평균단가","현재가","수익률","평가손익",""].map((h,i)=>(<th key={i} scope="col" style={{padding:"8px 4px",textAlign:i>=2?"right":"left",color:"#374460",fontWeight:600,fontSize:10.5}}>{h}</th>))}</tr></thead>
            <tbody>{pf.map((p,i)=>{const r=((p.cur-p.avg)/p.avg)*100,pl=(p.cur-p.avg)*p.qty;return(<tr key={i} style={{borderBottom:"1px solid #0d1320"}}><td style={{padding:"9px 4px",fontWeight:700,color:"#d5dced"}}>{p.symbol}</td><td style={{padding:"9px 4px",color:"#374460",fontSize:11}}>{p.sec}</td><td style={{padding:"9px 4px",textAlign:"right",color:"#5e6e88",fontFamily:"monospace"}}>{p.qty}</td><td style={{padding:"9px 4px",textAlign:"right",color:"#5e6e88",fontFamily:"monospace"}}>{fmt(p.avg)}</td><td style={{padding:"9px 4px",textAlign:"right",color:"#d5dced",fontFamily:"monospace",fontWeight:700}}>{fmt(p.cur)}</td><td style={{padding:"9px 4px",textAlign:"right",color:pc(r),fontFamily:"monospace",fontWeight:700}}>{pct(r)}<span className="sr-only">{r>=0?"이익":"손실"}</span></td><td style={{padding:"9px 4px",textAlign:"right",color:pc(pl),fontFamily:"monospace"}}>{(pl>=0?"+":"")+fmt(pl)}<span className="sr-only">{pl>=0?"이익":"손실"}</span></td><td style={{padding:"9px 4px",textAlign:"right"}}><button onClick={()=>delStock(i)} aria-label={p.symbol+" 삭제"} style={{background:"none",border:"none",color:"#283350",cursor:"pointer",fontSize:13}}>✕</button></td></tr>);})}</tbody></table></div>
            {/* Mobile Cards */}
            <div className="mobile-cards">
              {pf.map((p,i)=>(<MobileStockCard key={i} p={p} i={i} onDelete={()=>delStock(i)}/>))}
            </div>
            {beg&&<div style={{fontSize:11,color:"#4a5c78",margin:"10px 0 6px",padding:"8px 12px",background:"#7c5cfc08",borderRadius:6,borderLeft:"3px solid #7c5cfc33"}}><span aria-hidden="true">💡</span> <b style={{color:"#8a99b5"}}>평균단가</b>=내가 산 평균 가격, <b style={{color:"#8a99b5"}}>현재가</b>=지금 시장 가격. 현재가가 평균단가보다 높으면 이익!</div>}
            <div className="add-form">
              <input placeholder="종목명" aria-label="종목명" value={ns.s} onChange={e=>setNs({...ns,s:e.target.value})} style={{...IS,flex:2,minWidth:85}}/>
              <input placeholder="섹터" aria-label="섹터" value={ns.sc} onChange={e=>setNs({...ns,sc:e.target.value})} style={{...IS,flex:1.5,minWidth:65}}/>
              <input placeholder="수량" aria-label="수량" type="number" value={ns.q} onChange={e=>setNs({...ns,q:e.target.value})} style={{...IS,flex:1,minWidth:55}}/>
              <input placeholder="평균단가" aria-label="평균단가" type="number" value={ns.a} onChange={e=>setNs({...ns,a:e.target.value})} style={{...IS,flex:1.5,minWidth:80}}/>
              <input placeholder="현재가" aria-label="현재가" type="number" value={ns.c} onChange={e=>setNs({...ns,c:e.target.value})} style={{...IS,flex:1.5,minWidth:80}}/>
              <button onClick={add} style={{...BP,padding:"8px 16px",fontSize:12.5}}>추가</button>
            </div>
          </Card>
        </div>)}

        {/* ══ TAB 1: REALTIME PRICES ══ */}
        {tab===1&&(<div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1" ref={panelRef} tabIndex={-1} style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}><span aria-hidden="true">📈</span> 실시간 시세</div>
                <div style={{fontSize:12,color:"#374460"}}>AI가 웹에서 최신 주가 및 시장 지수를 검색합니다</div>
              </div>
              <button onClick={fetchPrices} disabled={prL} style={{...BP,opacity:prL?0.5:1,whiteSpace:"nowrap"}}>{prL?"조회 중...":"시세 조회"}</button>
            </div>
          </Card>
          {(prL||prR)?(<Card style={{minHeight:160}}>{prL?<LoadDots msg="웹에서 최신 시세 데이터를 검색하는 중"/>:<RenderAI text={prR}/>}</Card>):(
            <Card style={{background:"linear-gradient(135deg,#0d132088,#7c5cfc08)",border:"1px solid #7c5cfc22"}}><div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:40,marginBottom:10}} aria-hidden="true">📈</div><div style={{fontSize:14.5,color:"#8a99b5",fontWeight:600,marginBottom:6}}>시세 조회 버튼을 눌러주세요</div><div style={{fontSize:12,color:"#374460"}}>AI가 보유 종목의 최신 시세와 주요 지수를 검색합니다</div>{pf.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",marginTop:14}}>{pf.map((p,i)=>(<span key={i} style={{background:"#101828",borderRadius:4,padding:"3px 9px",fontSize:11,color:"#5e6e88",border:"1px solid #161f35"}}>{p.symbol}</span>))}</div>}</div></Card>
          )}
        </div>)}

        {/* ══ TAB 2: AI ANALYSIS ══ */}
        {tab===2&&(<div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" ref={panelRef} tabIndex={-1} style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}><span aria-hidden="true">🔍</span> AI 종목 분석</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:13}}>종목명을 입력하면 AI가 웹에서 최신 정보를 검색하여 {beg?"초보자도 이해할 수 있는 ":""}분석 리포트를 생성합니다.</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} placeholder="예: 삼성전자, SK하이닉스, 테슬라..." aria-label="종목 검색" style={{...IS,flex:1,fontSize:14,padding:"10px 15px",minWidth:0}}/>
              <button onClick={analyze} disabled={ld} style={{...BP,opacity:ld?0.5:1,whiteSpace:"nowrap"}}>{ld?"분석 중...":"분석하기"}</button>
            </div>
          </Card>
          {(ld||res)?(<Card style={{minHeight:160}}>{ld?<LoadDots msg="웹에서 최신 정보를 검색하고 분석하는 중"/>:<RenderAI text={res}/>}</Card>):(
            <div className="quick-grid">{["삼성전자","SK하이닉스","NAVER","카카오","현대차","셀트리온"].map(n=>(<button key={n} onClick={()=>setQ(n)} style={{background:"#090e18",border:"1px solid #161f35",borderRadius:8,padding:"12px 13px",color:"#5e6e88",fontSize:12.5,cursor:"pointer",textAlign:"left"}}><span style={{color:"#7c5cfc",marginRight:6}} aria-hidden="true">→</span>{n} 분석하기</button>))}</div>
          )}
        </div>)}

        {/* ══ TAB 3: AI RECOMMENDATION ══ */}
        {tab===3&&(<div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3" ref={panelRef} tabIndex={-1} style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}><span aria-hidden="true">💡</span> AI 종목 추천</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:13}}>포트폴리오와 투자 스타일 기반으로 {beg?"초보자도 따라할 수 있는 ":""}추천 종목과 개선 방향을 제안합니다.</div>
            <div style={{marginBottom:12}}><div style={{fontSize:11,color:"#374460",marginBottom:6,fontWeight:600}}>투자 스타일 {beg&&<span style={{fontWeight:400,color:"#4a5c78"}}>(잘 모르면 "균형 포트폴리오" 추천!)</span>}</div>
              <div role="radiogroup" aria-label="투자 스타일" style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["가치투자","성장투자","배당투자","단기 트레이딩","균형 포트폴리오"].map(s=>(<button key={s} onClick={()=>setSty(s)} role="radio" aria-checked={sty===s} style={{background:sty===s?"linear-gradient(135deg,#7c5cfc22,#00e4a008)":"#070b14",border:sty===s?"1px solid #7c5cfc44":"1px solid #161f35",borderRadius:6,padding:"6px 13px",fontSize:12,color:sty===s?"#d5dced":"#374460",fontWeight:sty===s?700:500,cursor:"pointer"}}>{s}</button>))}</div>
              {beg&&<div style={{fontSize:10.5,color:"#4a5c78",marginTop:6}}><span aria-hidden="true">💡</span> 가치투자=저평가 종목 장기보유 / 성장투자=빠르게 크는 회사 / 배당투자=꾸준히 용돈 주는 회사 / 균형=골고루</div>}
            </div>
            <div style={{marginBottom:12,padding:"10px 13px",background:"#070b14",borderRadius:8,border:"1px solid #161f35"}}><div style={{fontSize:10.5,color:"#374460",marginBottom:4,fontWeight:600}}>현재 포트폴리오</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{pf.length?pf.map((p,i)=>(<span key={i} style={{background:"#101828",borderRadius:4,padding:"2px 8px",fontSize:11,color:"#5e6e88",border:"1px solid #161f35"}}>{p.symbol}</span>)):<span style={{color:"#243050",fontSize:11.5}}>포트폴리오 탭에서 종목 추가 시 더 정확한 추천</span>}</div></div>
            <button onClick={recommend} disabled={rL} style={{...BP,width:"100%",opacity:rL?0.5:1}}>{rL?"추천 분석 중...":"AI 추천 받기"}</button>
          </Card>
          {(rL||rR)&&(<Card style={{minHeight:160}}>{rL?<LoadDots msg="포트폴리오를 분석하고 최적의 종목을 찾는 중"/>:<RenderAI text={rR}/>}</Card>)}
        </div>)}

        {/* ══ TAB 4: AI MARKET SCAN ══ */}
        {tab===4&&(<div role="tabpanel" id="tabpanel-4" aria-labelledby="tab-4" ref={panelRef} tabIndex={-1} style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}><span aria-hidden="true">🌐</span> AI 시장 스캔</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:14}}>AI가 인터넷에서 최신 뉴스를 검색하여 테마별 유망 종목을 찾아줍니다. {beg&&"초보자도 이해할 수 있도록 쉽게 설명해 드려요!"}</div>
            <div style={{marginBottom:14}}><div style={{fontSize:11,color:"#374460",marginBottom:8,fontWeight:600}}><span aria-hidden="true">🔥</span> 인기 테마 선택</div>
              <div className="themes-grid">{THEMES.map(t=>(<button key={t.k} onClick={()=>scan(t.k)} disabled={sL} aria-label={t.l} style={{background:sT===t.k&&(sL||sR)?"linear-gradient(135deg,#7c5cfc18,#00e4a008)":"#070b14",border:sT===t.k&&(sL||sR)?"1px solid #7c5cfc33":"1px solid #161f35",borderRadius:8,padding:"10px 8px",cursor:sL?"default":"pointer",opacity:sL?0.5:1,textAlign:"center",fontFamily:"inherit"}}><div style={{fontSize:20,marginBottom:3}} aria-hidden="true">{t.e}</div><div style={{fontSize:11.5,color:"#8a99b5",fontWeight:600}}>{t.l}</div></button>))}</div>
            </div>
            <div><div style={{fontSize:11,color:"#374460",marginBottom:7,fontWeight:600}}><span aria-hidden="true">✏️</span> 직접 입력</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input value={sC} onChange={e=>setSC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&scan()} placeholder="예: 트럼프 수혜주, 금리 인하, K-뷰티..." aria-label="테마 검색" style={{...IS,flex:1,fontSize:13.5,padding:"10px 14px",minWidth:0}}/><button onClick={()=>scan()} disabled={sL||!sC.trim()} style={{...BP,opacity:(sL||!sC.trim())?0.5:1,whiteSpace:"nowrap"}}>{sL?"검색 중...":"스캔"}</button></div>
            </div>
          </Card>
          {(sL||sR)?(<Card style={{minHeight:160}}>{sL?<LoadDots msg={`"${sT}" 관련 최신 뉴스와 종목을 검색하는 중`}/>:<div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"10px 14px",background:"#070b14",borderRadius:8,border:"1px solid #161f35",flexWrap:"wrap"}}><span style={{fontSize:16}} aria-hidden="true">🌐</span><span style={{fontSize:13,color:"#7c5cfc",fontWeight:700}}>검색 테마:</span><span style={{fontSize:13,color:"#d5dced",fontWeight:600}}>{sT}</span></div><RenderAI text={sR}/></div>}</Card>):(
            <Card style={{background:"linear-gradient(135deg,#0d132088,#7c5cfc08)",border:"1px solid #7c5cfc22"}}><div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:36,marginBottom:8}} aria-hidden="true">🌐</div><div style={{fontSize:14,color:"#8a99b5",fontWeight:600,marginBottom:4}}>위 테마를 선택하거나 키워드를 입력하세요</div><div style={{fontSize:12,color:"#374460"}}>AI가 인터넷에서 최신 뉴스를 검색하여 유망 종목을 찾아드립니다</div></div></Card>
          )}
        </div>)}

        {/* ══ TAB 5: NEWS FEED ══ */}
        {tab===5&&(<div role="tabpanel" id="tabpanel-5" aria-labelledby="tab-5" ref={panelRef} tabIndex={-1} style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:14.5,fontWeight:700,color:"#d5dced",marginBottom:4}}><span aria-hidden="true">📰</span> AI 뉴스 브리핑</div>
            <div style={{fontSize:12,color:"#374460",marginBottom:13}}>AI가 웹에서 최신 주식 뉴스를 검색하여 핵심만 요약합니다</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"#374460",marginBottom:6,fontWeight:600}}>카테고리</div>
              <div role="radiogroup" aria-label="뉴스 카테고리" style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["전체","보유종목","반도체","바이오","2차전지","AI/테크"].map(c=>(<button key={c} onClick={()=>setNwCat(c)} role="radio" aria-checked={nwCat===c} style={{background:nwCat===c?"linear-gradient(135deg,#7c5cfc22,#00e4a008)":"#070b14",border:nwCat===c?"1px solid #7c5cfc44":"1px solid #161f35",borderRadius:6,padding:"6px 13px",fontSize:12,color:nwCat===c?"#d5dced":"#374460",fontWeight:nwCat===c?700:500,cursor:"pointer"}}>{c}</button>))}</div>
            </div>
            <button onClick={fetchNews} disabled={nwL} style={{...BP,width:"100%",opacity:nwL?0.5:1}}>{nwL?"뉴스 검색 중...":"최신 뉴스 가져오기"}</button>
          </Card>
          {(nwL||nwR)?(<Card style={{minHeight:160}}>{nwL?<LoadDots msg="최신 주식 뉴스를 검색하고 분석하는 중"/>:<RenderAI text={nwR}/>}</Card>):(
            <Card style={{background:"linear-gradient(135deg,#0d132088,#7c5cfc08)",border:"1px solid #7c5cfc22"}}><div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:40,marginBottom:10}} aria-hidden="true">📰</div><div style={{fontSize:14.5,color:"#8a99b5",fontWeight:600,marginBottom:6}}>뉴스 브리핑을 받아보세요</div><div style={{fontSize:12,color:"#374460"}}>AI가 오늘의 주요 주식 뉴스를 검색하여 핵심만 요약해 드립니다</div></div></Card>
          )}
        </div>)}
      </main>
    </div>
  );
}
