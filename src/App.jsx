import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SUPABASE_URL = "https://hunzfzlugkufhhbedsip.supabase.co";
const SUPABASE_KEY = "sb_publishable_08hbOPKB4lC7ZuvJkjPxsg_XvncvK18";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const P = {
  bg:"#fdf6f0",card:"#ffffff",accent:"#f4a7b9",accent2:"#a8d8ea",
  accent3:"#b8e0c8",accent4:"#d4b8e0",text:"#4a3f3f",muted:"#9e8f8f",
  border:"#f0e6e0",warn:"#f4a261",danger:"#e76f51",success:"#52b788",
  shadow:"rgba(180,140,130,0.12)",
};

const EMOTIONS=[{name:"기쁨",emoji:"😊"},{name:"슬픔",emoji:"😢"},{name:"분노",emoji:"😠"},{name:"불안",emoji:"😰"},{name:"수치심",emoji:"😳"},{name:"죄책감",emoji:"😞"},{name:"두려움",emoji:"😨"},{name:"사랑",emoji:"🥰"}];
const DBT_SKILLS=[
  {category:"마음챙김",emoji:"🧘",color:"#a8d8ea",skills:[{name:"관찰하기",desc:"판단 없이 현재 순간을 있는 그대로 바라보세요."},{name:"묘사하기",desc:"경험을 말로 표현하되 해석을 붙이지 마세요."},{name:"참여하기",desc:"현재 활동에 완전히 몰입하세요."},{name:"비판단적으로",desc:"자신과 타인을 판단하지 않는 태도를 연습하세요."},{name:"한 가지에 집중",desc:"한 번에 하나의 일에만 집중하세요."},{name:"효과적으로",desc:"상황에서 실제로 효과 있는 방법을 선택하세요."}]},
  {category:"고통 감내",emoji:"🛡️",color:"#f4a7b9",skills:[{name:"TIPP",desc:"체온, 격렬한 운동, 호흡 조절, 이완으로 강렬한 감정을 빠르게 낮춥니다."},{name:"ACCEPTS",desc:"활동, 기여, 비교, 감정, 밀어내기, 생각, 감각으로 주의를 전환합니다."},{name:"Self-Soothe",desc:"5가지 감각을 활용해 자신을 달래세요."},{name:"IMPROVE",desc:"심상, 의미, 기도, 이완, 한 가지, 휴식, 격려를 활용합니다."},{name:"장단점 분석",desc:"충동에 따르거나 참는 것의 장단점을 적어보세요."},{name:"근본 수용",desc:"현실을 바꿀 수 없을 때 저항 대신 받아들이세요."}]},
  {category:"감정 조절",emoji:"💜",color:"#d4b8e0",skills:[{name:"감정 확인",desc:"지금 감정의 이름, 원인, 신체 반응, 행동 충동을 파악합니다."},{name:"반대 행동",desc:"감정이 이끄는 충동과 반대되는 행동을 해보세요."},{name:"즐거운 활동",desc:"기분 좋은 활동 목록을 만들고 매일 하나씩 실천하세요."},{name:"PLEASE 스킬",desc:"신체건강, 식사, 수면, 운동, 음주/약물 피하기로 감정 취약성을 줄입니다."},{name:"감사 목록",desc:"매일 감사한 것 3가지를 적으며 긍정적 감정을 쌓습니다."},{name:"걱정 줄이기",desc:"걱정 시간을 정해두고 그 외 시간엔 걱정을 미루는 연습을 합니다."}]},
  {category:"대인관계",emoji:"🤝",color:"#b8e0c8",skills:[{name:"DEAR MAN",desc:"묘사, 표현, 주장, 강화, 마음챙김, 자신감, 협상으로 원하는 것을 요청합니다."},{name:"GIVE",desc:"부드럽게, 관심, 검증, 쉽게로 관계를 유지합니다."},{name:"FAST",desc:"공정하게, 사과 줄이기, 가치 고수, 정직하게로 자존감을 지킵니다."},{name:"관계 마음챙김",desc:"상대방에게 온전히 집중하며 판단 없이 경청합니다."},{name:"관계 평가",desc:"이 관계가 나에게 어떤 영향을 미치는지 정기적으로 점검합니다."},{name:"자기존중",desc:"자신의 필요와 감정을 타인만큼 소중히 여기는 연습을 합니다."}]},
];
const IMPULSES=[{name:"자해 충동",emoji:"🔴",crisis:true},{name:"자살 충동",emoji:"🆘",crisis:true},{name:"물질 사용 충동",emoji:"🟠",crisis:false},{name:"폭식/제한 충동",emoji:"🟡",crisis:false},{name:"격리 충동",emoji:"🔵",crisis:false},{name:"공격 충동",emoji:"🟣",crisis:false}];
const CRISIS_GUIDE=[
  {step:"1단계",title:"TIPP 즉시 사용",desc:"찬물로 얼굴 담그기(30초), 또는 달리기/제자리 뛰기(1분).",icon:"🧊"},
  {step:"2단계",title:"안전한 공간으로",desc:"혼자 있지 마세요. 신뢰하는 사람 옆에 있거나 안전한 장소로 이동하세요.",icon:"🏠"},
  {step:"3단계",title:"근본 수용 시도",desc:"\"지금 이 순간은 힘들지만, 이 감정은 지나간다\"고 스스로에게 말해주세요.",icon:"🌊"},
  {step:"4단계",title:"장단점 분석",desc:"충동에 따랐을 때의 결과를 떠올려보세요. 장기적으로 나에게 도움이 되나요?",icon:"⚖️"},
  {step:"5단계",title:"전문가에게 연락",desc:"자살예방상담전화 1393 (24시간), 정신건강위기상담 1577-0199",icon:"📞"},
];

const todayStr=()=>new Date().toISOString().slice(0,10);
const emptyEntry=()=>({emotions:{},skills:[],impulses:{},goals:{medication:false,sleep:"",meals:0,exercise:false,therapy:false},note:""});
const fmtDate=(d)=>{const dt=new Date(d+"T00:00:00");return`${dt.getMonth()+1}/${dt.getDate()}`};
const impColor=(v)=>v>=8?P.danger:v>=5?P.warn:P.success;

function Card({children,style={}}){return<div style={{background:P.card,borderRadius:20,padding:18,marginBottom:14,boxShadow:`0 2px 16px ${P.shadow}`,border:`1px solid ${P.border}`,...style}}>{children}</div>}
function SecTitle({title,sub,emoji}){return<div style={{marginBottom:14}}><div style={{fontSize:15,fontWeight:600,color:P.text}}>{emoji&&<span style={{marginRight:6}}>{emoji}</span>}{title}</div>{sub&&<div style={{fontSize:12,color:P.muted,marginTop:2}}>{sub}</div>}</div>}
function Toggle({value,onChange}){return<div onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:12,background:value?P.accent:P.border,position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:value?23:3,transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/></div>}
function CheckRow({label,value,onChange}){return<div onClick={()=>onChange(!value)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${P.border}`,cursor:"pointer"}}><span style={{fontSize:14,color:P.text}}>{label}</span><Toggle value={value} onChange={onChange}/></div>}
function Pill({label,active,color,onClick}){return<button onClick={onClick} style={{padding:"6px 13px",borderRadius:20,fontSize:13,fontWeight:active?600:400,border:active?`2px solid ${color}`:`1.5px solid ${P.border}`,background:active?color+"28":"transparent",color:active?color:P.muted,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit"}}>{active?"✓ ":""}{label}</button>}
function Spinner(){return<div style={{width:24,height:24,border:`3px solid ${P.border}`,borderTopColor:P.accent,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>}

// ── AUTH ──────────────────────────────────────────────────────────
function AuthScreen({onAuth}){
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[name,setName]=useState("");
  const[role,setRole]=useState("client");
  const[therapistId,setTherapistId]=useState("");
  const[therapistEmail,setTherapistEmail]=useState("");
  const[therapists,setTherapists]=useState([]);
  const[therapistsLoading,setTherapistsLoading]=useState(false);
  const[therapistsFetchFailed,setTherapistsFetchFailed]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState("");
  const[msg,setMsg]=useState("");
  const inp={width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${P.border}`,background:P.bg,color:P.text,fontSize:14,boxSizing:"border-box",fontFamily:"inherit",outline:"none"};

  useEffect(()=>{
    if(mode==="signup"&&role==="client"){
      setTherapistsLoading(true);
      setTherapistsFetchFailed(false);
      supabase.from("profiles").select("id,name,email").eq("role","therapist").order("name")
        .then(({data,error:e})=>{
          if(e||!data){setTherapistsFetchFailed(true);setTherapists([]);}
          else{setTherapists(data);}
          setTherapistsLoading(false);
        });
    }
  },[mode,role]);

  const submit=async()=>{
    setError("");setMsg("");
    if(!email||!password){setError("이메일과 비밀번호를 입력해주세요.");return;}
    setLoading(true);
    try{
      if(mode==="login"){
        const{data,error:e}=await supabase.auth.signInWithPassword({email,password});
        if(e)throw e;
        const{data:p}=await supabase.from("profiles").select("*").eq("id",data.user.id).single();
        onAuth(data.user,p);
      }else{
        if(!name){setError("이름을 입력해주세요.");setLoading(false);return;}
        const{data,error:e}=await supabase.auth.signUp({email,password});
        if(e)throw e;
        let resolvedTherapistId=null;
        if(role==="client"){
          if(therapistId){resolvedTherapistId=therapistId;}
          else if(therapistEmail){
            const{data:th}=await supabase.from("profiles").select("id").eq("email",therapistEmail).eq("role","therapist").single();
            if(th)resolvedTherapistId=th.id;
          }
        }
        await supabase.from("profiles").insert({id:data.user.id,email,name,role,therapist_id:resolvedTherapistId});
        setMsg("가입 완료! 이메일 인증 후 로그인해주세요.");setMode("login");
      }
    }catch(e){setError(e.message||"오류가 발생했어요.");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fff5f8 0%,#f0f8ff 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:8}}>🌸</div>
          <div style={{fontSize:26,fontWeight:700,color:P.text}}>DBT 다이어리</div>
          <div style={{fontSize:13,color:P.muted,marginTop:4}}>마음을 기록하는 공간</div>
        </div>
        <Card>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");setMsg("");}} style={{flex:1,padding:"9px",borderRadius:12,border:mode===m?`2px solid ${P.accent}`:`1.5px solid ${P.border}`,background:mode===m?P.accent+"22":"transparent",color:mode===m?P.accent:P.muted,fontWeight:mode===m?700:400,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
                {m==="login"?"로그인":"회원가입"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {mode==="signup"&&<input placeholder="이름" value={name} onChange={e=>setName(e.target.value)} style={inp}/>}
            <input placeholder="이메일" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/>
            <input placeholder="비밀번호 (6자 이상)" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp}/>
            {mode==="signup"&&<>
              <div style={{display:"flex",gap:8}}>
                {[{v:"client",label:"🙋 내담자"},{v:"therapist",label:"👩‍⚕️ 치료자"}].map(r=>(
                  <button key={r.v} onClick={()=>{setRole(r.v);setTherapistId("");}} style={{flex:1,padding:"9px",borderRadius:12,border:role===r.v?`2px solid ${P.accent2}`:`1.5px solid ${P.border}`,background:role===r.v?P.accent2+"28":"transparent",color:role===r.v?"#5a9fb5":P.muted,fontWeight:role===r.v?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{r.label}</button>
                ))}
              </div>
              {role==="client"&&(
                therapistsLoading
                  ?<div style={{padding:"12px 14px",borderRadius:12,border:`1.5px solid ${P.border}`,background:P.bg,fontSize:13,color:P.muted}}>치료자 목록 불러오는 중...</div>
                  :therapistsFetchFailed||therapists.length===0
                    ?<input placeholder="치료자 이메일 (선택사항)" value={therapistEmail} onChange={e=>setTherapistEmail(e.target.value)} style={inp}/>
                    :<select value={therapistId} onChange={e=>setTherapistId(e.target.value)} style={{...inp,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239e8f8f' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:36,cursor:"pointer"}}>
                      <option value="">치료자 선택 (선택사항)</option>
                      {therapists.map(t=>(
                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                      ))}
                    </select>
              )}
            </>}
            {error&&<div style={{fontSize:12,color:P.danger,padding:"8px 12px",background:P.danger+"15",borderRadius:10}}>{error}</div>}
            {msg&&<div style={{fontSize:12,color:P.success,padding:"8px 12px",background:P.success+"15",borderRadius:10}}>{msg}</div>}
            <button onClick={submit} disabled={loading} style={{padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${P.accent},${P.accent2})`,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit"}}>
              {loading?<Spinner/>:mode==="login"?"로그인":"가입하기"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── THERAPIST DASHBOARD ───────────────────────────────────────────
function TherapistDashboard({profile,onLogout}){
  const[clients,setClients]=useState([]);
  const[selected,setSelected]=useState(null);
  const[entries,setEntries]=useState({});
  const[loading,setLoading]=useState(true);
  const[selDate,setSelDate]=useState(todayStr());

  useEffect(()=>{
    supabase.from("profiles").select("*").eq("therapist_id",profile.id).then(({data})=>{setClients(data||[]);setLoading(false);});
  },[]);

  const pickClient=async(c)=>{
    setSelected(c);setSelDate(todayStr());
    const{data}=await supabase.from("diary_entries").select("*").eq("user_id",c.id).order("date",{ascending:false}).limit(30);
    const m={};(data||[]).forEach(e=>{m[e.date]=e;});setEntries(m);
  };

  const entry=selected?(entries[selDate]||emptyEntry()):null;
  const dateList=selected?[todayStr(),...Object.keys(entries).filter(d=>d!==todayStr()).sort((a,b)=>b.localeCompare(a))].slice(0,10):[];
  const maxImp=entry?Math.max(0,...Object.values(entry.impulses||{}).map(Number)):0;

  return(
    <div style={{minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:40}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{background:"linear-gradient(160deg,#fff5f8,#f0f8ff)",borderBottom:`1px solid ${P.border}`,padding:"16px 18px",boxShadow:`0 2px 12px ${P.shadow}`}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:19,fontWeight:700,color:P.text}}>👩‍⚕️ 치료자 대시보드</div>
            <div style={{fontSize:11,color:P.muted}}>{profile.name} · {profile.email}</div>
          </div>
          <button onClick={onLogout} style={{padding:"7px 14px",borderRadius:10,border:`1.5px solid ${P.border}`,background:P.card,color:P.muted,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>로그아웃</button>
        </div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"16px 14px",display:"flex",gap:14,flexWrap:"wrap"}}>
        {/* 내담자 목록 */}
        <div style={{width:190,flexShrink:0}}>
          <div style={{fontSize:13,fontWeight:600,color:P.muted,marginBottom:10}}>내담자 목록</div>
          {loading?<Spinner/>:clients.length===0?(
            <div style={{fontSize:12,color:P.muted,background:P.card,borderRadius:14,padding:14,border:`1px solid ${P.border}`,lineHeight:1.7}}>
              아직 연결된 내담자가 없어요.<br/><br/>내담자 회원가입 시 아래 이메일을 입력하면 연결돼요.<br/><br/><strong style={{color:P.accent}}>{profile.email}</strong>
            </div>
          ):clients.map(c=>(
            <div key={c.id} onClick={()=>pickClient(c)} style={{padding:"10px 12px",borderRadius:12,marginBottom:8,cursor:"pointer",border:selected?.id===c.id?`2px solid ${P.accent}`:`1.5px solid ${P.border}`,background:selected?.id===c.id?P.accent+"15":P.card}}>
              <div style={{fontSize:14,fontWeight:600,color:P.text}}>🙋 {c.name}</div>
              <div style={{fontSize:11,color:P.muted,marginTop:2}}>{c.email}</div>
            </div>
          ))}
        </div>
        {/* 다이어리 뷰 */}
        <div style={{flex:1,minWidth:280}}>
          {!selected?(
            <Card style={{textAlign:"center",padding:40}}><div style={{fontSize:30,marginBottom:10}}>👈</div><div style={{fontSize:14,color:P.muted}}>내담자를 선택하세요</div></Card>
          ):(
            <>
              <div style={{fontSize:15,fontWeight:700,color:P.text,marginBottom:10}}>📔 {selected.name}님의 다이어리</div>
              <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:14,paddingBottom:2}}>
                {dateList.map(d=>{
                  const isSel=d===selDate;
                  return<button key={d} onClick={()=>setSelDate(d)} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:isSel?`2px solid ${P.accent}`:`1.5px solid ${P.border}`,background:isSel?P.accent+"22":P.card,color:isSel?P.accent:P.muted,fontSize:12,fontWeight:isSel?700:400,cursor:"pointer",position:"relative"}}>
                    {d===todayStr()?"오늘":d.slice(5).replace("-","/")}
                    {entries[d]&&d!==selDate&&<span style={{position:"absolute",top:2,right:3,width:5,height:5,borderRadius:"50%",background:P.accent2}}/>}
                  </button>;
                })}
              </div>
              {!entries[selDate]?(
                <Card style={{textAlign:"center",padding:30}}><div style={{color:P.muted,fontSize:14}}>이 날의 기록이 없어요.</div></Card>
              ):(
                <>
                  <Card>
                    <SecTitle title="감정 기록" emoji="🎭"/>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {EMOTIONS.map(({name,emoji})=>{
                        const val=entry.emotions?.[name]??0;
                        return val>0?<div key={name} style={{padding:"5px 11px",borderRadius:20,background:`hsl(${340-val*8},65%,72%)28`,border:`1.5px solid hsl(${340-val*8},65%,72%)`,fontSize:13}}>{emoji} {name} <strong>{val}</strong></div>:null;
                      })}
                    </div>
                    {entry.note&&<div style={{marginTop:12,fontSize:13,color:P.muted,background:P.bg,borderRadius:10,padding:"10px 12px",lineHeight:1.6}}>"{entry.note}"</div>}
                  </Card>
                  <Card>
                    <SecTitle title="충동 기록" emoji="⚡"/>
                    {IMPULSES.map(imp=>{
                      const val=entry.impulses?.[imp.name]??0;
                      return<div key={imp.name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <span style={{fontSize:13,flex:1}}>{imp.emoji} {imp.name}</span>
                        <div style={{flex:2,height:8,borderRadius:4,background:P.border,overflow:"hidden"}}><div style={{width:`${val*10}%`,height:"100%",background:impColor(val),borderRadius:4}}/></div>
                        <span style={{fontSize:13,fontWeight:700,color:impColor(val),width:28,textAlign:"right"}}>{val}</span>
                      </div>;
                    })}
                  </Card>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <Card style={{marginBottom:0}}>
                      <SecTitle title="사용한 스킬" emoji="🧠"/>
                      {(entry.skills||[]).length>0?entry.skills.map(s=><div key={s} style={{fontSize:12,color:P.text,padding:"4px 0",borderBottom:`1px solid ${P.border}`}}>{s}</div>):<div style={{fontSize:12,color:P.muted}}>기록 없음</div>}
                    </Card>
                    <Card style={{marginBottom:0}}>
                      <SecTitle title="목표 체크" emoji="✅"/>
                      {[{k:"medication",label:"💊 약물"},{k:"exercise",label:"🏃 운동"},{k:"therapy",label:"💬 상담"}].map(g=>(
                        <div key={g.k} style={{fontSize:12,padding:"4px 0",borderBottom:`1px solid ${P.border}`,display:"flex",justifyContent:"space-between"}}>
                          <span>{g.label}</span><span style={{color:entry.goals?.[g.k]?P.success:P.muted}}>{entry.goals?.[g.k]?"✓":"✗"}</span>
                        </div>
                      ))}
                      <div style={{fontSize:12,marginTop:6,color:P.muted}}>수면: {entry.goals?.sleep||"-"}</div>
                      <div style={{fontSize:12,color:P.muted}}>식사: {entry.goals?.meals||0}회</div>
                    </Card>
                  </div>
                  {maxImp>=7&&<div style={{marginTop:14,padding:"12px 16px",background:P.danger+"18",borderRadius:14,border:`1px solid ${P.danger}44`,fontSize:13,color:P.danger,fontWeight:600}}>⚠️ 이 날 충동 강도가 {maxImp}/10 으로 높았어요. 확인이 필요합니다.</div>}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CLIENT DIARY ──────────────────────────────────────────────────
function ClientDiary({profile,onLogout}){
  const[allData,setAllData]=useState({});
  const[selDate,setSelDate]=useState(todayStr());
  const[tab,setTab]=useState("emotion");
  const[saved,setSaved]=useState(false);
  const[saving,setSaving]=useState(false);
  const[loading,setLoading]=useState(true);
  const[skillModal,setSkillModal]=useState(null);
  const[crisisOpen,setCrisisOpen]=useState(false);
  const[statsRange,setStatsRange]=useState("week");
  const saveTimer=useRef(null);

  useEffect(()=>{
    supabase.from("diary_entries").select("*").eq("user_id",profile.id).order("date",{ascending:false}).limit(60)
      .then(({data})=>{const m={};(data||[]).forEach(e=>{m[e.date]=e;});setAllData(m);setLoading(false);});
  },[]);

  const entry=allData[selDate]||emptyEntry();

  const updateEntry=useCallback((patch)=>{
    const merged={...entry,...patch};
    setAllData(prev=>({...prev,[selDate]:merged}));
    setSaving(true);
    clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(async()=>{
      await supabase.from("diary_entries").upsert({user_id:profile.id,date:selDate,emotions:merged.emotions,skills:merged.skills,impulses:merged.impulses,goals:merged.goals,note:merged.note,updated_at:new Date().toISOString()},{onConflict:"user_id,date"});
      setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),1600);
    },800);
  },[entry,selDate]);

  const setEmo=(n,v)=>updateEntry({emotions:{...entry.emotions,[n]:v}});
  const toggleSkill=(s)=>updateEntry({skills:entry.skills.includes(s)?entry.skills.filter(x=>x!==s):[...entry.skills,s]});
  const setImp=(n,v)=>updateEntry({impulses:{...entry.impulses,[n]:v}});
  const setGoal=(k,v)=>updateEntry({goals:{...entry.goals,[k]:v}});

  const hasCrisis=IMPULSES.filter(i=>i.crisis).some(i=>(entry.impulses?.[i.name]??0)>=6);
  const maxImp=Math.max(0,...Object.values(entry.impulses||{}).map(Number));

  const buildStats=(days)=>[...Array(days)].map((_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(days-1-i));
    const ds=d.toISOString().slice(0,10);
    const e=allData[ds]||emptyEntry();
    const emos=Object.values(e.emotions||{});
    return{date:fmtDate(ds),감정평균:emos.length?Number((emos.reduce((a,b)=>a+b,0)/emos.length).toFixed(1)):0,최고충동:Math.max(0,...Object.values(e.impulses||{}).map(Number)),스킬수:(e.skills||[]).length};
  });

  const exportCSV=()=>{
    const rows=[["날짜","감정평균","사용스킬","최고충동","약복용","수면","식사","메모"]];
    Object.keys(allData).sort().forEach(d=>{
      const e=allData[d];const emos=Object.values(e.emotions||{});
      const avg=emos.length?(emos.reduce((a,b)=>a+b,0)/emos.length).toFixed(1):0;
      rows.push([d,avg,(e.skills||[]).join("|"),Math.max(0,...Object.values(e.impulses||{}).map(Number)),e.goals?.medication?"O":"X",e.goals?.sleep||"",e.goals?.meals||0,`"${(e.note||"").replace(/"/g,'""')}"`]);
    });
    const blob=new Blob(["\uFEFF"+rows.map(r=>r.join(",")).join("\n")],{type:"text/csv;charset=utf-8;"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="dbt_diary.csv";a.click();
  };

  const tabs=[{id:"emotion",label:"🎭 감정"},{id:"skills",label:"🧠 스킬"},{id:"impulses",label:"⚡ 충동"},{id:"goals",label:"✅ 목표"},{id:"stats",label:"📊 통계"}];
  const dateList=[todayStr(),...Object.keys(allData).filter(d=>d!==todayStr()).sort((a,b)=>b.localeCompare(a))].slice(0,9);
  const statsData=buildStats(statsRange==="week"?7:30);

  if(loading)return<div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,fontFamily:"sans-serif"}}><div style={{fontSize:32}}>🌸</div><Spinner/></div>;

  return(
    <div style={{minHeight:"100vh",background:P.bg,color:P.text,fontFamily:"'DM Sans',sans-serif",paddingBottom:60}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}} input[type=range]{-webkit-appearance:none;height:6px;border-radius:3px;outline:none} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${P.accent};cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.15)} textarea{outline:none} ::-webkit-scrollbar{height:4px} ::-webkit-scrollbar-thumb{background:${P.border};border-radius:2px}`}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(160deg,#fff5f8 0%,#f0f8ff 100%)",borderBottom:`1px solid ${P.border}`,padding:"16px 16px 13px",position:"sticky",top:0,zIndex:20,boxShadow:`0 2px 12px ${P.shadow}`}}>
        <div style={{maxWidth:520,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
            <div>
              <div style={{fontSize:19,fontWeight:700,color:P.text}}>DBT 다이어리 🌸</div>
              <div style={{fontSize:11,color:P.muted}}>{profile.name} · {selDate===todayStr()?"오늘의 기록":selDate}</div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {saving&&<div style={{fontSize:11,color:P.muted}}>저장 중...</div>}
              {saved&&<div style={{background:P.success,color:"#fff",borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:600}}>저장 ✓</div>}
              <button onClick={exportCSV} title="CSV" style={{width:32,height:32,borderRadius:10,border:`1px solid ${P.border}`,background:P.card,fontSize:14,cursor:"pointer"}}>📤</button>
              <button onClick={onLogout} style={{width:32,height:32,borderRadius:10,border:`1px solid ${P.border}`,background:P.card,fontSize:14,cursor:"pointer"}}>🚪</button>
            </div>
          </div>
          <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:2}}>
            {dateList.map(d=>{
              const isSel=d===selDate;
              return<button key={d} onClick={()=>setSelDate(d)} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:isSel?`2px solid ${P.accent}`:`1.5px solid ${P.border}`,background:isSel?P.accent+"22":P.card,color:isSel?P.accent:P.muted,fontSize:12,fontWeight:isSel?700:400,cursor:"pointer",position:"relative"}}>
                {d===todayStr()?"오늘":d.slice(5).replace("-","/")}
                {allData[d]&&!isSel&&<span style={{position:"absolute",top:2,right:3,width:5,height:5,borderRadius:"50%",background:P.accent2}}/>}
              </button>;
            })}
          </div>
        </div>
      </div>

      {hasCrisis&&<div onClick={()=>setCrisisOpen(true)} style={{background:`linear-gradient(90deg,${P.danger}22,${P.warn}22)`,borderBottom:`2px solid ${P.danger}44`,padding:"9px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>🆘</span><span style={{fontSize:13,color:P.danger,fontWeight:600}}>위기 충동이 감지됐어요. 위기 대처 가이드 보기 →</span></div>}

      <div style={{maxWidth:520,margin:"0 auto",padding:"0 13px"}}>
        <div style={{display:"flex",gap:3,margin:"13px 0 11px",background:P.card,borderRadius:16,padding:4,border:`1px solid ${P.border}`,boxShadow:`0 1px 6px ${P.shadow}`}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 2px",borderRadius:11,border:"none",fontSize:11,fontWeight:600,background:tab===t.id?`linear-gradient(135deg,${P.accent},${P.accent2})`:"transparent",color:tab===t.id?"#fff":P.muted,cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>{t.label}</button>)}
        </div>

        {/* EMOTION TAB */}
        {tab==="emotion"&&<>
          <Card>
            <SecTitle title="감정 강도 기록" sub="막대를 클릭해 강도를 기록하세요 (0 = 없음)" emoji="🎭"/>
            {EMOTIONS.map(({name,emoji})=>{
              const cur=entry.emotions?.[name]??0;
              return<div key={name} style={{marginBottom:13}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:14,fontWeight:500}}>{emoji} {name}</span><span style={{fontSize:13,color:P.accent,fontWeight:700}}>{cur}</span></div>
                <div style={{display:"flex",gap:3}}>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(v=><button key={v} onClick={()=>setEmo(name,v)} style={{flex:1,height:20,borderRadius:4,border:"none",cursor:"pointer",background:v===0?(cur===0?P.accent+"55":P.border):cur>=v?`hsl(${340-v*8},65%,72%)`:P.border,transform:cur===v&&v>0?"scaleY(1.25)":"scaleY(1)",transition:"all 0.1s"}}/>)}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:P.muted,marginTop:2}}><span>없음</span><span>보통</span><span>극심</span></div>
              </div>;
            })}
          </Card>
          <Card>
            <SecTitle title="메모" emoji="📝"/>
            <textarea value={entry.note||""} onChange={e=>updateEntry({note:e.target.value})} placeholder="오늘 어떠셨나요? 자유롭게 적어보세요..." style={{width:"100%",minHeight:90,background:P.bg,border:`1.5px solid ${P.border}`,borderRadius:12,color:P.text,fontSize:14,padding:12,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.6}}/>
          </Card>
        </>}

        {/* SKILLS TAB */}
        {tab==="skills"&&<>
          {DBT_SKILLS.map(cat=>(
            <Card key={cat.category}>
              <SecTitle title={cat.category} sub={`${entry.skills?.filter(s=>cat.skills.map(x=>x.name).includes(s)).length}개 사용됨`} emoji={cat.emoji}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {cat.skills.map(skill=>(
                  <div key={skill.name} style={{display:"flex",alignItems:"center",gap:3}}>
                    <Pill label={skill.name} active={entry.skills?.includes(skill.name)} color={cat.color} onClick={()=>toggleSkill(skill.name)}/>
                    <button onClick={()=>setSkillModal(skill)} style={{width:18,height:18,borderRadius:"50%",border:`1px solid ${P.border}`,background:P.bg,color:P.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>?</button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          {entry.skills?.length>0&&<Card style={{background:P.accent3+"22"}}><div style={{fontSize:12,color:P.success,fontWeight:700,marginBottom:6}}>✨ 오늘 사용한 스킬 ({entry.skills.length}개)</div><div style={{fontSize:13,color:P.text,lineHeight:1.9}}>{entry.skills.join("  ·  ")}</div></Card>}
        </>}

        {/* IMPULSES TAB */}
        {tab==="impulses"&&<Card>
          <SecTitle title="행동 충동 체크" sub="슬라이더로 강도를 기록하세요" emoji="⚡"/>
          {IMPULSES.map(imp=>{
            const val=entry.impulses?.[imp.name]??0;const col=impColor(val);
            return<div key={imp.name} style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:14,fontWeight:500}}>{imp.emoji} {imp.name}</span><span style={{fontSize:13,fontWeight:700,color:col}}>{val} / 10</span></div>
              <input type="range" min={0} max={10} value={val} onChange={e=>setImp(imp.name,Number(e.target.value))} style={{width:"100%",accentColor:col,background:`linear-gradient(to right,${col} ${val*10}%,${P.border} ${val*10}%)`}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:P.muted,marginTop:2}}><span>없음</span><span>약함</span><span>보통</span><span>강함</span><span>극심</span></div>
              {val>=7&&<div onClick={()=>setCrisisOpen(true)} style={{marginTop:8,padding:"8px 12px",background:P.danger+"18",borderRadius:10,fontSize:12,color:P.danger,cursor:"pointer"}}>⚠️ 충동이 강합니다. <u>위기 대처 가이드 보기</u></div>}
            </div>;
          })}
        </Card>}

        {/* GOALS TAB */}
        {tab==="goals"&&<>
          <Card>
            <SecTitle title="오늘의 건강 체크" emoji="💊"/>
            <CheckRow label="💊 약물 복용" value={entry.goals?.medication} onChange={v=>setGoal("medication",v)}/>
            <CheckRow label="🏃 운동" value={entry.goals?.exercise} onChange={v=>setGoal("exercise",v)}/>
            <CheckRow label="💬 치료/상담" value={entry.goals?.therapy} onChange={v=>setGoal("therapy",v)}/>
          </Card>
          <Card>
            <SecTitle title="생활 습관" emoji="🌿"/>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:13,color:P.muted,marginBottom:8,fontWeight:500}}>😴 수면 시간</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {["4시간 미만","4-6시간","6-8시간","8시간 이상"].map(s=><Pill key={s} label={s} active={entry.goals?.sleep===s} color={P.accent2} onClick={()=>setGoal("sleep",s)}/>)}
              </div>
            </div>
            <div>
              <div style={{fontSize:13,color:P.muted,marginBottom:8,fontWeight:500}}>🍽️ 식사 횟수</div>
              <div style={{display:"flex",gap:8}}>
                {[0,1,2,3,4].map(n=><button key={n} onClick={()=>setGoal("meals",n)} style={{width:44,height:44,borderRadius:12,border:entry.goals?.meals===n?`2px solid ${P.accent}`:`1.5px solid ${P.border}`,background:entry.goals?.meals===n?P.accent+"28":P.bg,color:entry.goals?.meals===n?P.accent:P.muted,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>)}
              </div>
            </div>
          </Card>
          <Card style={{background:"linear-gradient(135deg,#fff5f8,#f0f8ff)"}}>
            <SecTitle title="오늘의 요약" emoji="✨"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{label:"기록된 감정",value:Object.keys(entry.emotions||{}).filter(k=>(entry.emotions[k]||0)>0).length,unit:"가지",color:P.accent},{label:"사용한 스킬",value:(entry.skills||[]).length,unit:"개",color:P.accent2},{label:"최고 충동",value:maxImp,unit:"/10",color:impColor(maxImp)},{label:"식사 횟수",value:entry.goals?.meals||0,unit:"회",color:P.accent3}].map(item=>(
                <div key={item.label} style={{background:P.card,borderRadius:14,padding:12,textAlign:"center",boxShadow:`0 1px 6px ${P.shadow}`}}>
                  <div style={{fontSize:22,fontWeight:700,color:item.color}}>{item.value}<span style={{fontSize:12,color:P.muted}}> {item.unit}</span></div>
                  <div style={{fontSize:11,color:P.muted,marginTop:2}}>{item.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </>}

        {/* STATS TAB */}
        {tab==="stats"&&<>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["week","month"].map(r=><button key={r} onClick={()=>setStatsRange(r)} style={{flex:1,padding:"8px",borderRadius:12,border:statsRange===r?`2px solid ${P.accent}`:`1.5px solid ${P.border}`,background:statsRange===r?P.accent+"22":P.card,color:statsRange===r?P.accent:P.muted,fontWeight:statsRange===r?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{r==="week"?"최근 7일":"최근 30일"}</button>)}
          </div>
          <Card><SecTitle title="감정 평균 추이" emoji="🎭"/><ResponsiveContainer width="100%" height={150}><LineChart data={statsData}><XAxis dataKey="date" tick={{fontSize:10,fill:P.muted}}/><YAxis domain={[0,10]} tick={{fontSize:10,fill:P.muted}}/><Tooltip contentStyle={{borderRadius:10,fontSize:12}}/><Line type="monotone" dataKey="감정평균" stroke={P.accent} strokeWidth={2} dot={{fill:P.accent,r:3}}/></LineChart></ResponsiveContainer></Card>
          <Card><SecTitle title="충동 최고값 추이" emoji="⚡"/><ResponsiveContainer width="100%" height={130}><BarChart data={statsData}><XAxis dataKey="date" tick={{fontSize:10,fill:P.muted}}/><YAxis domain={[0,10]} tick={{fontSize:10,fill:P.muted}}/><Tooltip contentStyle={{borderRadius:10,fontSize:12}}/><Bar dataKey="최고충동" fill={P.accent} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card>
          <Card><SecTitle title="DBT 스킬 사용" emoji="🧠"/><ResponsiveContainer width="100%" height={130}><BarChart data={statsData}><XAxis dataKey="date" tick={{fontSize:10,fill:P.muted}}/><YAxis tick={{fontSize:10,fill:P.muted}}/><Tooltip contentStyle={{borderRadius:10,fontSize:12}}/><Bar dataKey="스킬수" fill={P.accent2} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></Card>
          <button onClick={exportCSV} style={{width:"100%",padding:"13px",borderRadius:14,border:`1.5px solid ${P.border}`,background:P.card,color:P.text,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14,fontFamily:"inherit"}}>📤 전체 데이터 CSV로 내보내기</button>
        </>}
      </div>

      {/* SKILL MODAL */}
      {skillModal&&<div onClick={()=>setSkillModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:P.card,borderRadius:"20px 20px 0 0",padding:24,maxWidth:520,width:"100%",boxShadow:"0 -4px 30px rgba(0,0,0,0.12)"}}>
          <div style={{width:40,height:4,background:P.border,borderRadius:2,margin:"0 auto 18px"}}/>
          <div style={{fontSize:18,fontWeight:700,color:P.text,marginBottom:10}}>🧠 {skillModal.name}</div>
          <div style={{fontSize:14,color:P.muted,lineHeight:1.8}}>{skillModal.desc}</div>
          <button onClick={()=>setSkillModal(null)} style={{marginTop:20,width:"100%",padding:13,borderRadius:14,border:"none",background:P.accent,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
        </div>
      </div>}

      {/* CRISIS MODAL */}
      {crisisOpen&&<div onClick={()=>setCrisisOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:P.card,borderRadius:"20px 20px 0 0",padding:24,maxWidth:520,width:"100%",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 -4px 30px rgba(0,0,0,0.14)"}}>
          <div style={{width:40,height:4,background:P.border,borderRadius:2,margin:"0 auto 16px"}}/>
          <div style={{fontSize:18,fontWeight:700,color:P.danger,marginBottom:6}}>🆘 위기 대처 가이드</div>
          <div style={{fontSize:13,color:P.muted,marginBottom:16}}>지금 많이 힘드시죠. 한 단계씩 따라해 보세요.</div>
          {CRISIS_GUIDE.map(step=>(
            <div key={step.step} style={{display:"flex",gap:12,marginBottom:14,padding:"12px 14px",background:P.bg,borderRadius:14,border:`1px solid ${P.border}`}}>
              <span style={{fontSize:22,flexShrink:0}}>{step.icon}</span>
              <div><div style={{fontSize:11,color:P.muted,fontWeight:600}}>{step.step}</div><div style={{fontSize:14,fontWeight:600,color:P.text,marginBottom:3}}>{step.title}</div><div style={{fontSize:13,color:P.muted,lineHeight:1.6}}>{step.desc}</div></div>
            </div>
          ))}
          <div style={{background:P.danger+"15",borderRadius:14,padding:"12px 16px",marginBottom:16,border:`1px solid ${P.danger}33`}}>
            <div style={{fontSize:13,fontWeight:700,color:P.danger,marginBottom:4}}>📞 긴급 연락처</div>
            <div style={{fontSize:13,color:P.text,lineHeight:1.8}}>자살예방상담전화: <strong>1393</strong> (24시간)<br/>정신건강위기상담: <strong>1577-0199</strong><br/>응급: <strong>119</strong></div>
          </div>
          <button onClick={()=>setCrisisOpen(false)} style={{width:"100%",padding:13,borderRadius:14,border:"none",background:P.accent,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>닫기</button>
        </div>
      </div>}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────
export default function App(){
  const[user,setUser]=useState(null);
  const[profile,setProfile]=useState(null);
  const[checking,setChecking]=useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){
        const{data:p}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        setUser(session.user);setProfile(p);
      }
      setChecking(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      if(session?.user){
        const{data:p}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        setUser(session.user);setProfile(p);
      }else{setUser(null);setProfile(null);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  const logout=async()=>{await supabase.auth.signOut();setUser(null);setProfile(null);};

  if(checking)return<div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><div style={{fontSize:36}}>🌸</div><Spinner/></div>;
  if(!user||!profile)return<AuthScreen onAuth={(u,p)=>{setUser(u);setProfile(p);}}/>;
  if(profile.role==="therapist")return<TherapistDashboard profile={profile} onLogout={logout}/>;
  return<ClientDiary profile={profile} onLogout={logout}/>;
}
