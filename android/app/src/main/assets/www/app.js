
(() => {
"use strict";
const ICONS = ["💧","📖","🏃","🧘","🥗","💤","🦷","💊","🎸","✍️","🧹","🚶","🏋️","☀️","📵","🌱"];
const COLORS = ["#F26B3A","#F2B33D","#5BC98A","#3CC8D8","#5B8CFF","#9B7BFF","#F07FA0","#A8C94A"];
const WHEN = [["morning","Morning"],["afternoon","Afternoon"],["evening","Evening"],["any","Anytime"]];
const STARTERS = [
  {name:"Drink 8 glasses of water", icon:"💧", color:"#3CC8D8", goal:7, when:"any"},
  {name:"Read 20 minutes", icon:"📖", color:"#9B7BFF", goal:7, when:"evening"},
  {name:"Walk 8,000 steps", icon:"🚶", color:"#5BC98A", goal:5, when:"afternoon"},
  {name:"Meditate", icon:"🧘", color:"#5B8CFF", goal:7, when:"morning"},
  {name:"Workout", icon:"🏋️", color:"#F26B3A", goal:3, when:"morning"},
  {name:"In bed by 11pm", icon:"💤", color:"#F07FA0", goal:7, when:"evening"},
];
const PALETTES = [
  {id:"auto",   name:"Auto",   note:"Follows phone", sw:"linear-gradient(135deg,#0A0908 0 50%,#F6F6F7 50%)", a:"#E5653A", meta:null},
  {id:"dusk",   name:"Dusk",   note:"Warm & calm",   sw:"radial-gradient(60% 80% at 70% 30%,#E8924A,transparent),linear-gradient(160deg,#B8452A,#0A0908)", a:"#E5653A", meta:"#0A0908"},
  {id:"cosmos", name:"Cosmos", note:"Night sky",     sw:"radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 70% 60%,#fff,transparent),radial-gradient(1.5px 1.5px at 45% 20%,#fff,transparent),linear-gradient(160deg,#1C2F57,#060A13)", a:"#3CC8D8", meta:"#060A13"},
  {id:"trail",  name:"Trail",  note:"Mountain air",  sw:"linear-gradient(180deg,#9CC7F0,#F7D9CF 60%,#4E8A6A 60%,#0E1F18)", a:"#F08FA6", meta:"#0E1F18"},
  {id:"paper",  name:"Paper",  note:"Clean & light", sw:"linear-gradient(180deg,#FFFFFF,#F1F1F3)", a:"#F0352B", meta:"#F6F6F7"},
];
const LOGO = "data:image/webp;base64,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";
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MON = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const LS_KEY = "daily-streaks-v1";
const PREF_KEY = "daily-streaks-prefs";
const FLAME = `<svg viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 01-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/></svg>`;
const CHECK = `<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2,"0");
const key = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const fromKey = k => { const [y,m,d]=k.split("-").map(Number); return new Date(y,m-1,d); };
const addDays = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const today0 = () => { const d=new Date(); d.setHours(0,0,0,0); return d; };
const startOfWeek = d => addDays(d, -((d.getDay()+6)%7));
const safeColor = c => /^#[0-9a-fA-F]{6}$/.test(c) ? c : COLORS[0];
const safeWhen = w => WHEN.some(x=>x[0]===w) ? w : "any";
const plural = (n,w) => `${n} ${w}${n===1?"":"s"}`;
const shortName = n => { const s=String(n); return s.length>22 ? s.slice(0,21)+"…" : s; };

let habits = {};
let selected = key(today0());
let tab = "today";
let mode = "local";
let col = null;
let loaded = false;
let prefs = {palette:"auto", haptics:true, fx:true};

// ---------- Preferences (this device only) ----------
function loadPrefs(){ try{ const p=JSON.parse(localStorage.getItem(PREF_KEY)||"{}"); prefs={...prefs, ...p}; if(!PALETTES.some(x=>x.id===prefs.palette)) prefs.palette="auto"; }catch(e){} }
function savePrefs(){ try{ localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); }catch(e){} }
function applyPalette(){
  const root=document.documentElement, p=PALETTES.find(x=>x.id===prefs.palette)||PALETTES[0];
  if(p.id==="auto") delete root.dataset.palette; else root.dataset.palette=p.id;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", p.meta || getComputedStyle(document.body).backgroundColor || "#0A0908");
}

// ---------- Storage ----------
function lsLoad(){ try{ const raw=localStorage.getItem(LS_KEY); return raw?JSON.parse(raw):{}; }catch(e){ return {}; } }
function lsSave(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(habits)); }catch(e){} }
const queues = {};
function write(id, fn){
  const prev = queues[id] || Promise.resolve();
  const next = prev.then(fn).catch(e => toast(e && e.code==="permission_denied" ? "You can't save changes to this copy" : "Couldn't save. Check your connection."));
  queues[id] = next; return next;
}
function saveHabit(id){ lsSave(); }
function saveDay(id, date, v){ lsSave(); }
function removeHabit(id){ delete habits[id]; lsSave(); }

function initStore(){
  habits = lsLoad(); render();
  setStatus("Stored only on this phone. Nothing is sent anywhere.", true);
}
function setStatus(t, ok){ const s=$("#status"); s.textContent=t; s.classList.toggle("ok",!!ok); }

// ---------- Logic ----------
const list = () => Object.entries(habits).map(([id,h])=>({id,...h})).sort((a,b)=>(a.order||0)-(b.order||0) || (a.created||0)-(b.created||0));
const isDone = (h,k) => !!(h.done && h.done[k]);
const createdKey = h => h.created ? key(new Date(h.created)) : "1970-01-01";
function streak(h){
  const t = today0();
  if((h.goal||7) >= 7){
    let d = isDone(h,key(t)) ? t : addDays(t,-1), n=0;
    while(isDone(h,key(d))){ n++; d=addDays(d,-1); }
    return {n, unit:"day"};
  }
  let ws = startOfWeek(t), n=0;
  const cnt = w => { let c=0; for(let i=0;i<7;i++) if(isDone(h,key(addDays(w,i)))) c++; return c; };
  if(cnt(ws) >= h.goal) n++;
  ws = addDays(ws,-7);
  while(cnt(ws) >= h.goal){ n++; ws=addDays(ws,-7); }
  return {n, unit:"week"};
}
function bestStreak(h){
  const days = Object.keys(h.done||{}).filter(k=>h.done[k]).sort();
  let best=0, cur=0, prev=null;
  for(const k of days){ cur = (prev && key(addDays(prev,1))===k) ? cur+1 : 1; best=Math.max(best,cur); prev=fromKey(k); }
  return best;
}
function rate(h, days){
  const t=today0(), c=fromKey(createdKey(h)); let done=0, span=0;
  for(let i=0;i<days;i++){ const d=addDays(t,-i); if(d<c) break; span++; if(isDone(h,key(d))) done++; }
  const expected = span * (Math.min(h.goal||7,7)/7);
  return expected ? Math.min(1, done/expected) : 0;
}
const total = h => Object.values(h.done||{}).filter(Boolean).length;
const weekCount = (h,ref) => { const ws=startOfWeek(ref); let c=0; for(let i=0;i<7;i++) if(isDone(h,key(addDays(ws,i)))) c++; return c; };
function period(){ const h=new Date().getHours(); return h<12?"morning":h<17?"afternoon":"evening"; }
function greeting(){ const h=new Date().getHours(); return h<5?"Still up?":h<12?"Good morning.":h<17?"Good afternoon.":"Good evening."; }
const joinNames = arr => arr.length<=1 ? arr.join("") : arr.slice(0,-1).join(", ")+" and "+arr[arr.length-1];

// ---------- Render ----------
function render(){
  renderHeader();
  $("#v-today").hidden = tab!=="today";
  $("#v-habits").hidden = tab!=="habits";
  $("#v-stats").hidden = tab!=="stats";
  if(tab==="today") renderToday();
  if(tab==="habits") renderHabits();
  if(tab==="stats") renderStats();
  document.querySelectorAll(".tab[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab===tab));
}

function renderHeader(){
  const t=today0(), sel=fromKey(selected), hs=list(), isToday = selected===key(t);
  $("#dayName").innerHTML = `${DOW[sel.getDay()]}<span class="dot"></span>`;
  $("#dateBlk").innerHTML = `${MON[sel.getMonth()]} ${sel.getDate()}<br>${sel.getFullYear()}`;
  const done = hs.filter(h=>isDone(h,selected)), left = hs.filter(h=>!isDone(h,selected));
  const p = hs.length ? done.length/hs.length : 0;
  $("#aura").style.setProperty("--p", p.toFixed(2));
  let brief;
  if(!hs.length) brief = `${greeting()}<br><b>Let's build a habit.</b>`;
  else if(!isToday) brief = `Looking back.<br><b>${done.length} of ${hs.length} done</b> that day.`;
  else if(!left.length) brief = `${greeting()}<br><b>All done today.</b>`;
  else brief = `${greeting()}<br><b>${plural(left.length,"habit")} to go.</b>`;
  $("#brief").innerHTML = brief;

  const ws = startOfWeek(t); let html="";
  for(let i=0;i<7;i++){
    const d=addDays(ws,i), k=key(d), fut=d>t;
    const act = hs.filter(h=>createdKey(h)<=k || isDone(h,k));
    const pp = act.length ? act.filter(h=>isDone(h,k)).length/act.length : 0;
    html += `<button class="day ${k===selected?'sel':''} ${k===key(t)?'today':''} ${fut?'future':''}" data-day="${k}" role="tab" aria-selected="${k===selected}" aria-label="${d.toDateString()}, ${Math.round(pp*100)}% done" ${fut?'tabindex="-1" aria-disabled="true"':''}><small>${DOW[d.getDay()].slice(0,2)}</small><b class="num">${d.getDate()}</b><span class="bar"><span style="width:${Math.round(pp*100)}%"></span></span></button>`;
  }
  $("#week").innerHTML = html;
}

function focusCard(hs){
  const isToday = selected===key(today0());
  const left = hs.filter(h=>!isDone(h,selected));
  if(!left.length) return "";
  const now = period();
  const pick = left.map(h=>({h,s:streak(h)})).sort((a,b)=>b.s.n-a.s.n || ((safeWhen(b.h.when)===now)-(safeWhen(a.h.when)===now)))[0];
  const h = pick.h, s = pick.s;
  const title = s.n>0 ? `Keep your <em>${s.n}-${s.unit}</em> streak` : `Start with <em>${esc(shortName(h.name))}</em>`;
  return `<div class="focus">
    <span class="label">${isToday?'Daily focus':'Catch up'}</span>
    <div class="row"><div style="min-width:0"><h2>${title}</h2><p>${esc(h.icon||"")} ${esc(h.name)}</p></div>
    <button class="ring-btn" data-toggle="${h.id}" aria-label="Complete ${esc(h.name)}">${CHECK}</button></div>
  </div>`;
}

function renderToday(){
  const hs=list(), el=$("#v-today");
  if(!hs.length){ el.innerHTML = emptyState(); return; }
  const isToday = selected===key(today0()), now = period();
  const row = h => {
    const s=streak(h), goal=h.goal||7, wk=weekCount(h,fromKey(selected)), d=isDone(h,selected);
    const prog = goal<7 ? `<span class="prog" aria-label="${wk} of ${goal} this week">${Array.from({length:goal},(_,i)=>`<i class="${i<wk?'on':''}"></i>`).join("")}</span>` : "";
    return `<div class="trow ${d?'done':''}" style="--c:${safeColor(h.color)}">
      <button class="ticon" data-open="${h.id}" aria-label="Open ${esc(h.name)}">${esc(h.icon||"✓")}</button>
      <button class="meta" data-open="${h.id}"><span class="name">${esc(h.name)}</span>
        <span class="sub num"><span class="flame">${FLAME}${s.n}</span>${prog}</span></button>
      <button class="chk" data-toggle="${h.id}" aria-pressed="${d}" aria-label="${d?'Undo':'Complete'} ${esc(h.name)}">${CHECK}</button>
    </div>`;
  };
  const order = isToday ? [now, ...["morning","afternoon","evening"].filter(w=>w!==now), "any"] : ["morning","afternoon","evening","any"];
  let groups = "";
  for(const w of order){
    const g = hs.filter(h=>safeWhen(h.when)===w); if(!g.length) continue;
    g.sort((a,b)=>isDone(a,selected)-isDone(b,selected));
    const label = WHEN.find(x=>x[0]===w)[1];
    const right = isToday && w===now ? `<span class="now">Now</span>` : `<span class="label num">${g.filter(h=>isDone(h,selected)).length}/${g.length}</span>`;
    groups += `<div class="group"><div class="ghead"><span class="label">${label}</span>${right}</div><div class="tl">${g.map(row).join("")}</div></div>`;
  }
  const allDone = hs.every(h=>isDone(h,selected));
  el.innerHTML = (allDone ? `<div class="sheetcard"><div class="alldone"><h3>A <em>perfect</em> day.</h3><p>Every habit is checked off. Come back tomorrow to keep it going.</p></div></div>` : focusCard(hs))
    + `<div class="sheetcard">${groups}</div>`;
}

function emptyState(){
  return `<div class="empty">
    <img class="empty-logo" src="${LOGO}" alt="Daily Streaks logo">
    <span class="label">Get started</span>
    <h2>Small steps, <em>every day.</em></h2>
    <p>Pick a few habits to try. You can change them or add your own with the + button.</p>
    <div class="chips">${STARTERS.map((s,i)=>`<button class="chip" data-starter="${i}" aria-pressed="false">${s.icon} ${esc(s.name)}</button>`).join("")}</div>
    <button class="btn" id="addStarters" disabled>Add selected</button>
  </div>`;
}

function heatmap(h, weeks){
  const t=today0(), end=addDays(startOfWeek(t),6), start=addDays(end,-(weeks*7)+1);
  let cells="";
  for(let i=0;i<weeks*7;i++){ const d=addDays(start,i), k=key(d);
    if(d>t){ cells+=`<i class="pad"></i>`; continue; }
    cells+=`<i class="${isDone(h,k)?'on':''} ${k===key(t)?'today':''}"></i>`; }
  return `<div class="heat" aria-hidden="true">${cells}</div><div class="heat-foot"><span>${MON[start.getMonth()].slice(0,3)}</span><span>${MON[t.getMonth()].slice(0,3)}</span></div>`;
}

function renderHabits(){
  const hs=list(), el=$("#v-habits");
  if(!hs.length){ el.innerHTML = emptyState(); return; }
  const w = Math.min(document.documentElement.clientWidth, 560) - 60;
  const weeks = Math.max(12, Math.min(26, Math.floor(w/14)));
  el.innerHTML = `<h2 class="vtitle">Your <em>habits</em></h2>` + hs.map(h => {
    const s=streak(h), on=isDone(h,key(today0()));
    return `<div class="hcard" style="--c:${safeColor(h.color)}">
      <div class="top">
        <button class="icon" data-open="${h.id}" aria-label="Open ${esc(h.name)}">${esc(h.icon||"✓")}</button>
        <button class="meta" data-open="${h.id}"><span class="name">${esc(h.name)}</span>
          <span class="sub num"><span class="flame">${FLAME}${s.n}</span>${Math.round(rate(h,30)*100)}% this month</span></button>
        <button class="mini-check ${on?'on':''}" data-toggle-today="${h.id}" aria-pressed="${on}" aria-label="${on?'Undo':'Complete'} ${esc(h.name)} today">${CHECK}</button>
      </div>
      <button data-open="${h.id}" aria-label="Open ${esc(h.name)} history" style="display:grid;gap:6px;width:100%">${heatmap(h,weeks)}</button>
    </div>`;
  }).join("") + `<p class="quote">Tap a habit to edit it or fill in past days.</p>`;
}

// Thru-style illustrated landscape. Sky and mountains follow the theme; the hiker climbs toward the next milestone.
function landscape(progress){
  const ridge = "M0 168 C 40 150, 70 128, 110 132 S 170 150, 210 122 S 280 86, 320 92 L320 220 L0 220 Z";
  const x = 18 + progress*284;
  const y = 160 - progress*62 + Math.sin(progress*Math.PI*2)*6;
  return `<svg class="land" viewBox="0 0 320 220" aria-hidden="true">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky-a)"/><stop offset="1" stop-color="var(--sky-b)"/></linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="var(--ground)" stop-opacity="0"/><stop offset="1" stop-color="var(--ground)"/></linearGradient></defs>
    <rect width="320" height="220" fill="url(#sky)"/>
    <circle cx="246" cy="52" r="16" fill="var(--snow)" opacity=".55"/>
    <path d="M-10 150 L60 70 L95 104 L150 38 L205 96 L240 72 L330 140 L330 220 L-10 220Z" fill="var(--m1)"/>
    <path d="M150 38 L132 60 L142 58 L150 66 L158 56 L170 62 Z M60 70 L48 84 L58 82 L64 88 L72 80Z" fill="var(--snow)" opacity=".9"/>
    <path d="M-10 170 L50 118 L100 146 L160 104 L220 140 L280 112 L330 150 L330 220 L-10 220Z" fill="var(--m2)"/>
    <path d="${ridge}" fill="var(--m3)"/>
    <rect width="320" height="220" fill="url(#fade)"/>
    <g transform="translate(${x.toFixed(1)} ${(y-10).toFixed(1)})"><circle r="9" fill="var(--accent)" opacity=".28"/><circle r="5" fill="var(--accent)"/><circle r="2" fill="#fff"/></g>
    <g transform="translate(302 82)"><path d="M0 0 V-18" stroke="#fff" stroke-width="1.5"/><path d="M0 -18 L12 -14 L0 -10Z" fill="var(--accent)"/></g>
  </svg>`;
}
function badgeArt(i, sky){
  const peaks = ["M8 44 L24 22 L34 34 L42 26 L56 44Z","M6 44 L22 28 L30 36 L44 18 L58 44Z","M6 44 L30 14 L54 44Z","M6 44 L18 30 L28 38 L40 24 L58 44Z"];
  return `<svg viewBox="0 0 64 64"><defs><clipPath id="bc${i}"><circle cx="32" cy="32" r="28"/></clipPath><linearGradient id="bs${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
    <g clip-path="url(#bc${i})"><rect width="64" height="64" fill="url(#bs${i})"/><path d="${peaks[i%4]}" fill="${sky[2]}"/><rect y="44" width="64" height="20" fill="${sky[3]}"/></g>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.5"/></svg>`;
}

// ---------- History helpers ----------
const fmtShort = d => `${MON[d.getMonth()].slice(0,3)} ${d.getDate()}`;
const fmtLong = d => `${MON[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`;
function firstDataDay(){
  let f=key(today0());
  for(const h of list()){ const c=createdKey(h); if(c!=="1970-01-01" && c<f) f=c; for(const k in (h.done||{})) if(h.done[k] && k<f) f=k; }
  return fromKey(f);
}
// all runs of consecutive done days for one habit: [{s,e,n}] (keys), newest first
function runs(h){
  const days=Object.keys(h.done||{}).filter(k=>h.done[k]).sort(); const out=[]; let cur=null;
  for(const k of days){ if(cur && key(addDays(fromKey(cur.e),1))===k){ cur.e=k; cur.n++; } else { cur={s:k,e:k,n:1}; out.push(cur); } }
  return out.reverse();
}
function periodOf(kind, off){
  const t=today0();
  if(kind==="week"){ const s0=addDays(startOfWeek(t),7*off), e0=addDays(s0,6); return {s:s0,e:e0,label: off===0?"This <em>week</em>": off===-1?"Last <em>week</em>":`${fmtShort(s0)} – ${fmtShort(e0)}`}; }
  if(kind==="month"){ const s0=new Date(t.getFullYear(), t.getMonth()+off, 1); return {s:s0,e:new Date(s0.getFullYear(), s0.getMonth()+1, 0),label:`${MON[s0.getMonth()]} <em>${s0.getFullYear()}</em>`}; }
  if(kind==="year"){ const y=t.getFullYear()+off; return {s:new Date(y,0,1),e:new Date(y,11,31),label:`<em>${y}</em>`}; }
  return {s:firstDataDay(), e:t, label:"All <em>time</em>"};
}
// share of active habits done on a day (null if no habit existed yet)
function dayShare(hs,k){ const act=hs.filter(h=>createdKey(h)<=k || isDone(h,k)); return act.length ? act.filter(h=>isDone(h,k)).length/act.length : null; }
function rangeStats(hs, S, E){
  let checkins=0, perfect=0, days=0, bestRun=0, bestHabit=null; const per=new Map(hs.map(h=>[h.id,{done:0,exp:0}]));
  for(let d=new Date(S); d<=E; d=addDays(d,1)){
    const k=key(d), act=hs.filter(h=>createdKey(h)<=k || isDone(h,k)); if(!act.length) continue; days++;
    let n=0; for(const h of act){ const st=per.get(h.id); st.exp += Math.min(h.goal||7,7)/7; if(isDone(h,k)){ st.done++; n++; } }
    checkins+=n; if(n===act.length) perfect++;
  }
  const sk=key(S), ek=key(E);
  for(const h of hs) for(const r of runs(h)){ if(r.e<sk || r.s>ek) continue; const s1=r.s<sk?sk:r.s, e1=r.e>ek?ek:r.e; const n=Math.round((fromKey(e1)-fromKey(s1))/864e5)+1; if(n>bestRun){ bestRun=n; bestHabit=h; } }
  const rates=hs.map(h=>{ const st=per.get(h.id); return {h, r: st.exp ? Math.min(1, st.done/st.exp) : null, done:st.done}; });
  const valid=rates.filter(x=>x.r!==null);
  return {checkins, perfect, days, bestRun, bestHabit, rate: valid.length ? valid.reduce((a,x)=>a+x.r,0)/valid.length : 0, rates};
}
function barChart(bars, ariaLabel){
  const N=bars.length, W=320, H=130, pl=30, pb=22, top=8, cw=(W-pl)/N, every=Math.ceil(N/8);
  let out="";
  [0,50,100].forEach(v=>{ const y=(H-pb)-(H-pb-top)*v/100; out+=`<line x1="${pl}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1" ${v?'stroke-dasharray="2 4"':''}/><text x="${pl-6}" y="${y+3.5}" text-anchor="end">${v}%</text>`; });
  bars.forEach((b,i)=>{
    const p=b.p===null?0:b.p, bh=Math.max(p>0?3:0,(H-pb-top)*p), w=Math.max(2,cw*0.62), x=pl+i*cw+(cw-w)/2, y=(H-pb)-bh;
    out+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${bh.toFixed(1)}" rx="${Math.min(w/2,bh/2,4).toFixed(1)}" fill="var(--accent)" opacity="${b.hi?1:.5}"><title>${b.title}: ${b.p===null?'no habits yet':Math.round(p*100)+'%'}</title></rect>`;
    if(i%every===0 || i===N-1 && N<=12) out+=`<text x="${(x+w/2).toFixed(1)}" y="${H-6}" text-anchor="middle">${b.label}</text>`;
  });
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${ariaLabel}">${out}</svg></div>`;
}
// GitHub-style year grid. value(k) -> 0..1 or null (outside data)
function yearHeat(year, value, color){
  const jan1=new Date(year,0,1), start=startOfWeek(jan1), t=today0(); let cells="", ml="";
  for(let w=0; w<53; w++){
    let mm=""; for(let d=0; d<7; d++){ const day=addDays(start,w*7+d); if(day.getFullYear()===year && day.getDate()===1){ mm=MON[day.getMonth()].slice(0,3); break; } }
    ml+=`<span>${mm}</span>`;
    for(let d=0; d<7; d++){
      const day=addDays(start,w*7+d), k=key(day);
      if(day.getFullYear()!==year || day>t){ cells+=`<i class="x"></i>`; continue; }
      const v=value(k); const op = v===null ? 0 : v===0 ? 0 : .25+.75*v;
      cells+=`<i class="${k===key(t)?'today':''}" style="${op?`background:color-mix(in srgb, ${color} ${Math.round(op*100)}%, var(--empty))`:''}" title="${k}${v===null?'':': '+Math.round(v*100)+'%'}"></i>`;
    }
  }
  return `<div class="yheat"><div class="ml" aria-hidden="true">${ml}</div><div class="grid">${cells}</div></div>
    <div class="legend">Less ${[0,.35,.6,.8,1].map(o=>`<i style="background:${o?`color-mix(in srgb, ${color} ${Math.round(o*100)}%, var(--empty))`:'var(--empty)'}"></i>`).join("")} More</div>`;
}
const PREV=`<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>`, NEXT=`<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>`;
let pv = {kind:"month", off:0};

function renderStats(){
  const hs=list(), el=$("#v-stats");
  if(!hs.length){ el.innerHTML = emptyState(); return; }
  const t=today0(), first=firstDataDay();
  const totalDone = hs.reduce((a,h)=>a+total(h),0);
  const best = hs.reduce((a,h)=>Math.max(a,bestStreak(h)),0);
  const dayN = Math.max(1, Math.round((t - first)/864e5)+1);
  const MS=[{n:10,name:"Base Camp"},{n:25,name:"Pine Ridge"},{n:50,name:"Alpine Lake"},{n:100,name:"Eagle Pass"},{n:250,name:"Glacier Saddle"},{n:500,name:"High Summit"},{n:1000,name:"Skyline Peak"},{n:2500,name:"The Long Trail"}];
  const nextM = MS.find(m=>m.n>totalDone) || MS[MS.length-1];
  const prevN = ([{n:0}].concat(MS)).filter(m=>m.n<=totalDone).pop().n;
  const tp = nextM.n===prevN ? 1 : Math.min(1,(totalDone-prevN)/(nextM.n-prevN));
  const wk0=startOfWeek(t);
  const perfectWeek = (()=>{ for(let w=1;w<=8;w++){ const ws=addDays(wk0,-7*w); let ok=true; for(let i=0;i<7&&ok;i++){ const k=key(addDays(ws,i)); const act=hs.filter(h=>createdKey(h)<=k); if(!act.length||!act.every(h=>isDone(h,k))) ok=false; } if(ok) return true; } return false; })();
  const SK=[["#9CC7F0","#F7D9CF","#E9A1B4","#4E8A6A"],["#F7C59F","#F28C6B","#7A3B3B","#2C4A3A"],["#1C2F57","#3CC8D8","#CFE1FF","#0D1528"],["#C8E6C9","#F1F8E9","#5BC98A","#24503B"]];
  const BADGES=[
    {t:"First step",d:"1 check-in",ok:totalDone>=1},{t:"On a roll",d:"7-day streak",ok:best>=7},{t:"Unstoppable",d:"30-day streak",ok:best>=30},{t:"Perfect week",d:"Every habit, 7 days",ok:perfectWeek},
    {t:"Base Camp",d:"10 check-ins",ok:totalDone>=10},{t:"Alpine Lake",d:"50 check-ins",ok:totalDone>=50},{t:"Eagle Pass",d:"100 check-ins",ok:totalDone>=100},{t:"High Summit",d:"500 check-ins",ok:totalDone>=500},
  ];

  // ---- selected period ----
  const P=periodOf(pv.kind, pv.off), S=P.s<first?first:P.s, E=P.e>t?t:P.e;
  const canPrev = pv.kind!=="all" && P.s>first, canNext = pv.kind!=="all" && pv.off<0;
  let periodBody;
  if(E<S){ periodBody=`<div class="panel"><p class="nodata">No habits were tracked in this period.</p></div>`; }
  else {
    const st=rangeStats(hs,S,E);
    let bars=[];
    if(pv.kind==="week" || pv.kind==="month"){
      for(let d=new Date(P.s); d<=P.e; d=addDays(d,1)){ const k=key(d); bars.push({label: pv.kind==="week"?DOW[d.getDay()].slice(0,2):d.getDate(), p: d>t||d<first?null:dayShare(hs,k), title:fmtLong(d), hi:k===key(t)}); }
    } else {
      const ys = pv.kind==="year" ? [P.s.getFullYear()] : null;
      const monthBars=(y0,m0,y1,m1)=>{ const out=[]; for(let y=y0,m=m0; y<y1||(y===y1&&m<=m1); m++){ if(m>11){m=0;y++;} if(y>y1||(y===y1&&m>m1)) break;
          const ms=new Date(y,m,1), me=new Date(y,m+1,0), s2=ms<first?first:ms, e2=me>t?t:me;
          let sum=0,n=0; for(let d=new Date(s2); d<=e2; d=addDays(d,1)){ const v=dayShare(hs,key(d)); if(v!==null){ sum+=v; n++; } }
          out.push({label:MON[m].slice(0,1)+(pv.kind==="all"&&m===0?"'"+String(y).slice(2):""), p:n?sum/n:null, title:`${MON[m]} ${y}`, hi:y===t.getFullYear()&&m===t.getMonth()}); }
        return out; };
      bars = ys ? monthBars(ys[0],0,ys[0],11) : monthBars(first.getFullYear(), first.getMonth(), t.getFullYear(), t.getMonth());
      if(bars.length>36){ // very long history: one bar per year
        const yb=[]; for(let y=first.getFullYear(); y<=t.getFullYear(); y++){ let sum=0,n=0; for(let d=new Date(Math.max(new Date(y,0,1),first)); d<=new Date(Math.min(new Date(y,11,31),t)); d=addDays(d,1)){ const v=dayShare(hs,key(d)); if(v!==null){sum+=v;n++;} } yb.push({label:"'"+String(y).slice(2),p:n?sum/n:null,title:String(y),hi:y===t.getFullYear()}); }
        bars=yb;
      }
    }
    const chartTitle = pv.kind==="week"||pv.kind==="month" ? "Day by <em>day</em>" : "Month by <em>month</em>";
    const ranked = st.rates.filter(x=>x.r!==null).sort((a,b)=>b.r-a.r);
    periodBody = `
      <div class="bento">
        <div class="tile"><span class="label">Goal hit rate</span><span class="v num">${Math.round(st.rate*100)}<small>%</small></span></div>
        <div class="tile"><span class="label">Check-ins</span><span class="v num">${st.checkins}</span></div>
        <div class="tile"><span class="label">Perfect days</span><span class="v num">${st.perfect}<small>of ${st.days}</small></span></div>
        <div class="tile"><span class="label">Best streak</span><span class="v num">${st.bestRun}<small>${st.bestRun===1?'day':'days'}</small></span>${st.bestHabit?`<span class="label" style="text-transform:none;letter-spacing:0;font-weight:500">${esc(st.bestHabit.icon||"")} ${esc(shortName(st.bestHabit.name))}</span>`:""}</div>
      </div>
      <div class="panel"><div class="phead"><h2>${chartTitle}</h2><span class="label">% done</span></div>${barChart(bars, "Completion for "+P.label.replace(/<[^>]+>/g,""))}</div>
      ${pv.kind==="year" ? `<div class="panel"><div class="phead"><h2>The whole <em>year</em></h2><span class="label">every day</span></div>${yearHeat(P.s.getFullYear(), k=>{ const d=fromKey(k); return d<first?null:dayShare(hs,k); }, "var(--accent)")}</div>` : ""}
      <div class="panel"><div class="phead"><h2>By <em>habit</em></h2><span class="label">vs. goal</span></div>
        <div class="rank">${ranked.map(({h,r,done})=>`<div class="r" style="--c:${safeColor(h.color)}"><span class="icon">${esc(h.icon||"✓")}</span><div style="min-width:0"><div class="nm">${esc(h.name)}</div><div class="bar"><span style="width:${Math.round(r*100)}%"></span></div></div><span class="pc num">${Math.round(r*100)}%</span></div>`).join("") || '<p class="nodata">No habits in this period.</p>'}</div></div>`;
  }

  el.innerHTML = `
    <div class="scene">
      ${landscape(tp)}
      <div class="stat"><small class="num">Day ${dayN}</small><span class="big num">${totalDone.toLocaleString()}</span><span class="unit">check-ins on your trail</span></div>
      <div class="landmark"><b><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>${totalDone>=nextM.n?`${nextM.name} reached`:`Next: ${nextM.name}`}</b>
        <span class="num">${totalDone>=nextM.n?"You've walked the whole trail.":`${nextM.n-totalDone} more check-ins to reach ${nextM.n}.`}</span>
        <span class="track"><i style="width:${Math.round(tp*100)}%"></i></span></div>
    </div>
    <div class="segbar" role="tablist" aria-label="Time period">${[["week","Week"],["month","Month"],["year","Year"],["all","All time"]].map(([k,l])=>`<button role="tab" data-pkind="${k}" class="${pv.kind===k?'on':''}" aria-selected="${pv.kind===k}">${l}</button>`).join("")}</div>
    <div class="pnav"><button data-pnav="-1" aria-label="Previous period" ${canPrev?'':'disabled'} ${pv.kind==="all"?'style="visibility:hidden"':''}>${PREV}</button><h2>${P.label}</h2><button data-pnav="1" aria-label="Next period" ${canNext?'':'disabled'} ${pv.kind==="all"?'style="visibility:hidden"':''}>${NEXT}</button></div>
    ${periodBody}
    <div class="panel">
      <div class="phead"><h2>Trail <em>badges</em></h2><span class="label num">${BADGES.filter(b=>b.ok).length} of ${BADGES.length}</span></div>
      <div class="badges hscroll">${BADGES.map((b,i)=>`<div class="badge ${b.ok?'':'locked'}" aria-label="${b.t}: ${b.d}, ${b.ok?'earned':'locked'}">${badgeArt(i,SK[i%4])}<b>${b.t}</b><small>${b.d}</small></div>`).join("")}</div>
    </div>`;
}

// ---------- Sheets ----------
let sheetCtx = null;
function openSheet(html, ctx){ sheetCtx=ctx||null; $("#sheetIn").innerHTML = `<div class="grab"></div>`+html; $("#sheet").classList.add("open"); $("#scrim").classList.add("open"); }
function closeSheet(){ $("#sheet").classList.remove("open"); $("#scrim").classList.remove("open"); sheetCtx=null; }
const XBTN = `<button class="x" data-close aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
const goalText = g => g===7 ? "Every day. Streaks count days in a row." : `${g} days a week. Streaks count weeks where you hit the goal.`;

function editor(id){
  const h = id ? habits[id] : {name:"", icon:ICONS[0], color:COLORS[0], goal:7, when:"any"};
  const f = {name:h.name, icon:h.icon||ICONS[0], color:safeColor(h.color), goal:h.goal||7, when:safeWhen(h.when)};
  openSheet(`
    <div class="sheet-head"><h2>${id?'Edit <em>habit</em>':'A new <em>habit</em>'}</h2>${XBTN}</div>
    <div class="preview" id="pv" style="--c:${f.color}"><span class="icon" id="pvIcon">${esc(f.icon)}</span><div style="min-width:0;flex:1"><div class="name" id="pvName">${esc(f.name||"Your new habit")}</div><div class="sub" id="pvGoal"></div></div></div>
    <div class="field"><label class="label" for="hName">Name</label><input type="text" id="hName" maxlength="60" placeholder="e.g. Stretch for 10 minutes" value="${esc(f.name)}" autocomplete="off" enterkeyhint="done"></div>
    <div class="field"><span class="label">Icon</span><div class="icons">${ICONS.map(i=>`<button data-icon="${i}" class="${i===f.icon?'on':''}" aria-label="Icon ${i}">${i}</button>`).join("")}</div></div>
    <div class="field"><span class="label">Colour</span><div class="colors">${COLORS.map(c=>`<button data-color="${c}" class="${c===f.color?'on':''}" style="--c:${c}" aria-label="Colour ${c}"></button>`).join("")}</div></div>
    <div class="field"><span class="label">Time of day</span><div class="seg four">${WHEN.map(([v,l])=>`<button data-when="${v}" class="${v===f.when?'on':''}">${l}</button>`).join("")}</div></div>
    <div class="field"><span class="label">Days per week</span><div class="seg">${[1,2,3,4,5,6,7].map(n=>`<button data-goal="${n}" class="num ${n===f.goal?'on':''}">${n}</button>`).join("")}</div><p class="hint" id="goalHint">${goalText(f.goal)}</p></div>
    <p class="err" id="hErr" hidden>Give your habit a name.</p>
    <button class="btn block" data-save>${id?'Save changes':'Create habit'}</button>
    ${id?`<div id="delZone"><button class="btn danger block" data-askdel>Delete habit</button></div>`:''}
  `, {kind:"edit", id, f});
  updatePreview(f);
}

function detail(id){
  const h = habits[id]; if(!h) return;
  const now = today0(); const ym = {y:now.getFullYear(), m:now.getMonth(), view:"month"};
  const firstY = Math.min(firstDataDay().getFullYear(), now.getFullYear());
  const draw = () => {
    const s=streak(h), b=bestStreak(h), H=habits[id]||h;
    let body;
    if(ym.view==="month"){
      const first=new Date(ym.y,ym.m,1), lead=(first.getDay()+6)%7, days=new Date(ym.y,ym.m+1,0).getDate();
      let cells = ["M","T","W","T","F","S","S"].map(d=>`<span class="dow">${d}</span>`).join(""), cnt=0;
      for(let i=0;i<lead;i++) cells+=`<span></span>`;
      for(let d=1; d<=days; d++){ const dt=new Date(ym.y,ym.m,d), k=key(dt); if(isDone(H,k)) cnt++;
        cells += `<button class="num ${isDone(H,k)?'on':''} ${k===key(now)?'today':''}" data-calday="${k}" ${dt>now?'disabled':''} aria-pressed="${isDone(H,k)}" aria-label="${dt.toDateString()}">${d}</button>`; }
      const atNow = ym.y===now.getFullYear() && ym.m===now.getMonth(), atFirst = ym.y<firstY || (ym.y===firstY && ym.m===0);
      body = `<div class="cal-nav"><button data-mon="-1" aria-label="Previous month" ${atFirst?'disabled':''}>${PREV}</button><h3>${MON[ym.m]} <em>${ym.y}</em></h3><button data-mon="1" aria-label="Next month" ${atNow?'disabled':''}>${NEXT}</button></div>
        <div class="cal">${cells}</div>
        <p class="hint num">${cnt} ${cnt===1?'day':'days'} done this month. Tap a day to mark it done or undo it.</p>`;
    } else {
      const yk=String(ym.y); const cnt=Object.keys(H.done||{}).filter(k=>H.done[k]&&k.startsWith(yk)).length;
      const yBest = runs(H).reduce((a,r)=>{ const s1=r.s<yk+"-01-01"?yk+"-01-01":r.s, e1=r.e>yk+"-12-31"?yk+"-12-31":r.e; return e1<s1?a:Math.max(a,Math.round((fromKey(e1)-fromKey(s1))/864e5)+1); },0);
      body = `<div class="cal-nav"><button data-yr="-1" aria-label="Previous year" ${ym.y<=firstY?'disabled':''}>${PREV}</button><h3><em>${ym.y}</em></h3><button data-yr="1" aria-label="Next year" ${ym.y>=now.getFullYear()?'disabled':''}>${NEXT}</button></div>
        ${yearHeat(ym.y, k=>isDone(H,k)?1:0, safeColor(H.color))}
        <p class="hint num">${cnt} ${cnt===1?'day':'days'} done in ${ym.y} · best streak that year: ${yBest} ${yBest===1?'day':'days'}.</p>`;
    }
    const rs = runs(H).slice().sort((a,b)=>b.n-a.n || (a.e<b.e?1:-1)).slice(0,5);
    const curKey = s.unit==="day" && s.n>0 ? key(isDone(H,key(now))?now:addDays(now,-1)) : null;
    const hist = rs.length ? rs.map((r,i)=>`<div class="srow ${r.e===curKey?'now':''}"><span class="rk">${i+1}</span><span class="dt">${fmtShort(fromKey(r.s))} – ${fmtLong(fromKey(r.e))}<small>${r.e===curKey?'Current streak':'Ended '+fmtLong(fromKey(r.e))}</small></span><span class="len num">${r.n}d</span></div>`).join("") : `<p class="nodata">Check this habit off on consecutive days to start a streak.</p>`;
    openSheet(`
      <div class="sheet-head"><div style="display:flex;gap:12px;align-items:center;min-width:0;flex:1"><span class="icon" style="--c:${safeColor(H.color)}">${esc(H.icon||"✓")}</span><h2 style="font-size:26px">${esc(H.name)}</h2></div>${XBTN}</div>
      <div class="stat3">
        <div class="tile"><span class="label">Streak</span><span class="v num">${s.n}<small>${s.unit}${s.n===1?'':'s'}</small></span></div>
        <div class="tile"><span class="label">Best</span><span class="v num">${b}<small>${b===1?'day':'days'}</small></span></div>
        <div class="tile"><span class="label">Total</span><span class="v num">${total(H)}</span></div>
      </div>
      <div class="segbar two" role="tablist" aria-label="Calendar view"><button role="tab" data-dview="month" class="${ym.view==='month'?'on':''}" aria-selected="${ym.view==='month'}">Month</button><button role="tab" data-dview="year" class="${ym.view==='year'?'on':''}" aria-selected="${ym.view==='year'}">Year</button></div>
      <div class="panel" style="--c:${safeColor(H.color)}">${body}</div>
      <div class="panel" style="--c:${safeColor(H.color)}"><div class="phead"><h2>Streak <em>history</em></h2><span class="label">longest</span></div><div class="streaks">${hist}</div></div>
      <div class="row-btns"><button class="btn secondary" data-edit="${id}">Edit</button><button class="btn" data-close>Done</button></div>
    `, {kind:"detail", id, ym, draw});
  };
  draw();
}

function settings(){
  openSheet(`
    <div class="sheet-head"><h2>Make it <em>yours</em></h2>${XBTN}</div>
    <div class="field"><span class="label">Theme</span>
      <div class="palettes hscroll">${PALETTES.map(p=>`<button class="pal ${prefs.palette===p.id?'on':''}" data-palette="${p.id}" aria-pressed="${prefs.palette===p.id}" style="--pa:${p.a}"><span class="sw" style="background:${p.sw}"></span><span class="meta"><b>${p.name}</b><small>${p.note}</small></span></button>`).join("")}</div>
    </div>
    <div class="field"><span class="label">Feel</span>
      <button class="toggle-row" data-pref="haptics" role="switch" aria-checked="${prefs.haptics}"><span class="t"><b>Vibration</b><span>A short buzz when you check off a habit</span></span><span class="sw-ui"></span></button>
      <button class="toggle-row" data-pref="fx" role="switch" aria-checked="${prefs.fx}"><span class="t"><b>Celebrations</b><span>Confetti and streak messages</span></span><span class="sw-ui"></span></button>
    </div>
    <div class="field"><span class="label">Your data</span>
      <button class="toggle-row" data-export><span class="t"><b>Export to Excel</b><span>A spreadsheet of your habits and every check-in</span></span><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg></button>
    </div>
    <div class="field"><span class="label">Backup</span>
      <p class="hint">Copy a backup of all your habits and keep it in a note. Paste it back here to restore it on a new phone.</p>
      <div class="row-btns"><button class="btn secondary" data-backup>Copy backup</button><button class="btn secondary" data-showrestore>Restore</button></div>
      <div id="backupZone"></div>
    </div>
    <div class="privacy"><svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg><span>${mode==="cloud"?"Your habits are stored privately in your account. No ads, no tracking, no analytics.":"Your habits never leave this phone. No account, no ads, no tracking, no analytics."}</span></div>
    <div class="about"><img src="${LOGO}" alt=""><span><b>Daily Streaks</b>Version 1.3</span></div>
  `, {kind:"settings"});
}

// ---------- Celebration ----------
const fx = $("#fx"), ctx2 = fx.getContext("2d"); let parts=[], raf=0;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function burst(x, y, color){
  if(reduced || !prefs.fx) return;
  const dpr = window.devicePixelRatio||1; fx.width=innerWidth*dpr; fx.height=innerHeight*dpr; ctx2.setTransform(dpr,0,0,dpr,0,0);
  const cs=getComputedStyle(document.documentElement); const cols=[color, cs.getPropertyValue("--accent").trim()||"#E5653A", cs.getPropertyValue("--accent-2").trim()||"#F2A65A"];
  for(let i=0;i<26;i++){ const a=Math.random()*Math.PI*2, v=1.5+Math.random()*4; parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,life:1,s:1.6+Math.random()*3,c:cols[i%3]}); }
  if(!raf) raf=requestAnimationFrame(step);
}
function step(){
  ctx2.clearRect(0,0,innerWidth,innerHeight);
  parts = parts.filter(p=>p.life>0);
  for(const p of parts){ p.x+=p.vx; p.y+=p.vy; p.vy+=.15; p.vx*=.98; p.life-=.02; ctx2.globalAlpha=Math.max(0,p.life); ctx2.fillStyle=p.c; ctx2.beginPath(); ctx2.arc(p.x,p.y,p.s,0,7); ctx2.fill(); }
  raf = parts.length ? requestAnimationFrame(step) : 0;
  if(!raf) ctx2.clearRect(0,0,innerWidth,innerHeight);
}
function buzz(ms){ if(!prefs.haptics) return; try{ navigator.vibrate && navigator.vibrate(ms); }catch(e){} }

// ---------- Actions ----------
function toggle(id, k, srcEl, quiet){
  const h=habits[id]; if(!h || fromKey(k)>today0()) return;
  h.done = h.done || {};
  const v = h.done[k] ? 0 : 1; h.done[k] = v;
  if(v){ buzz(15); if(srcEl){ const r=srcEl.getBoundingClientRect(); burst(r.left+r.width/2, r.top+r.height/2, safeColor(h.color)); } }
  saveDay(id, k, v);
  render();
  if(quiet) return;
  if(v){
    const s=streak(h), undo=() => toggle(id,k,null,true);
    if(prefs.fx && s.unit==="day" && [3,7,14,21,30,50,100,365].includes(s.n)) toast(`${s.n}-day streak on ${h.name}`, undo);
    else if(prefs.fx && list().length>1 && list().every(x=>isDone(x,k))) toast("Every habit done. Great day.", undo);
    else toast(`${h.name} done`, undo);
  }
}
function createHabit(f){
  const id = "h"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const maxOrder = list().reduce((a,h)=>Math.max(a,h.order||0),0);
  habits[id] = {name:f.name, icon:f.icon, color:f.color, goal:f.goal, when:safeWhen(f.when), created:Date.now(), order:maxOrder+1, done:{}};
  saveHabit(id); return id;
}
let toastT, undoFn=null;
function toast(msg, undo){
  const t=$("#toast"); $("#toastMsg").textContent=msg; undoFn = undo||null;
  $("#toastUndo").hidden = !undo; t.classList.toggle("plain", !undo); t.classList.add("show");
  clearTimeout(toastT); toastT=setTimeout(()=>{ t.classList.remove("show"); undoFn=null; }, undo?3500:2200);
}
function updatePreview(f){
  const pv=$("#pv"); if(!pv) return;
  pv.style.setProperty("--c", f.color); $("#pvIcon").textContent=f.icon; $("#pvName").textContent=f.name.trim()||"Your new habit";
  $("#pvGoal").textContent=(f.goal===7?"Every day":f.goal+" days a week")+" · "+WHEN.find(x=>x[0]===f.when)[1];
}

// ---------- Excel export (.xlsx written in the browser; nothing is uploaded) ----------
const XLSX = (() => {
  const enc = new TextEncoder();
  const T = new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c = c&1 ? 0xEDB88320^(c>>>1) : c>>>1; T[n]=c>>>0; }
  const crc32 = b => { let c=0xFFFFFFFF; for(let i=0;i<b.length;i++) c=T[(c^b[i])&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0; };
  function zip(files){
    const parts=[], central=[]; let off=0;
    for(const f of files){
      const nm=enc.encode(f.name), d=enc.encode(f.text), crc=crc32(d);
      const h=new DataView(new ArrayBuffer(30));
      h.setUint32(0,0x04034b50,true); h.setUint16(4,20,true); h.setUint16(6,0x0800,true); h.setUint16(10,0,true); h.setUint16(12,0x21,true);
      h.setUint32(14,crc,true); h.setUint32(18,d.length,true); h.setUint32(22,d.length,true); h.setUint16(26,nm.length,true);
      parts.push(new Uint8Array(h.buffer), nm, d);
      const c=new DataView(new ArrayBuffer(46));
      c.setUint32(0,0x02014b50,true); c.setUint16(4,20,true); c.setUint16(6,20,true); c.setUint16(8,0x0800,true); c.setUint16(14,0x21,true);
      c.setUint32(16,crc,true); c.setUint32(20,d.length,true); c.setUint32(24,d.length,true); c.setUint16(28,nm.length,true); c.setUint32(42,off,true);
      central.push(new Uint8Array(c.buffer), nm); off += 30+nm.length+d.length;
    }
    const csize=central.reduce((a,b)=>a+b.length,0), e=new DataView(new ArrayBuffer(22));
    e.setUint32(0,0x06054b50,true); e.setUint16(8,files.length,true); e.setUint16(10,files.length,true); e.setUint32(12,csize,true); e.setUint32(16,off,true);
    const all=[...parts,...central,new Uint8Array(e.buffer)], out=new Uint8Array(all.reduce((a,b)=>a+b.length,0)); let p=0; for(const a of all){ out.set(a,p); p+=a.length; } return out;
  }
  const x = v => String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/[<>&"]/g, c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
  const col = i => { let s=""; i++; while(i){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); } return s; };
  // cell: string | number | {v, s} where s: 1 header, 2 date (v = "YYYY-MM-DD"), 3 percent (v = 0..1)
  const serial = k => { const [y,m,d]=k.split("-").map(Number); return (Date.UTC(y,m-1,d)-Date.UTC(1899,11,30))/864e5; };
  function sheet(rows, widths, freeze){
    const body = rows.map((r,ri)=>`<row r="${ri+1}">`+r.map((c,ci)=>{
      if(c===null||c===undefined||c==="") return "";
      const ref=col(ci)+(ri+1), o=(typeof c==="object")?c:{v:c};
      if(o.s===2) return `<c r="${ref}" s="2"><v>${serial(o.v)}</v></c>`;
      if(typeof o.v==="number") return `<c r="${ref}"${o.s?` s="${o.s}"`:""}><v>${o.v}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${o.s?` s="${o.s}"`:""}><is><t xml:space="preserve">${x(o.v)}</t></is></c>`;
    }).join("")+`</row>`).join("");
    const pane = freeze ? `<sheetViews><sheetView workbookViewId="0"><pane xSplit="${freeze[0]}" ySplit="${freeze[1]}" topLeftCell="${col(freeze[0])}${freeze[1]+1}" activePane="bottomRight" state="frozen"/></sheetView></sheetViews>` : "";
    const cols = widths ? `<cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join("")}</cols>` : "";
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${pane}${cols}<sheetData>${body}</sheetData></worksheet>`;
  }
  function book(sheets){
    const NS='xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"', R='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const files=[
      {name:"[Content_Types].xml", text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`},
      {name:"_rels/.rels", text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>`},
      {name:"xl/workbook.xml", text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook ${NS} xmlns:r="${R}"><sheets>${sheets.map((s,i)=>`<sheet name="${x(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join("")}</sheets></workbook>`},
      {name:"xl/_rels/workbook.xml.rels", text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="${R}/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}<Relationship Id="rId${sheets.length+1}" Type="${R}/styles" Target="styles.xml"/></Relationships>`},
      {name:"xl/styles.xml", text:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet ${NS}><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0E3B2E"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="9" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`},
      ...sheets.map((s,i)=>({name:`xl/worksheets/sheet${i+1}.xml`, text:sheet(s.rows, s.widths, s.freeze)}))
    ];
    return zip(files);
  }
  return {book};
})();

function buildWorkbook(){
  const hs=list(), t=today0(), H=s=>({v:s,s:1});
  const summary=[[H("Habit"),H("Icon"),H("Time of day"),H("Days per week"),H("Current streak"),H("Streak unit"),H("Best streak (days)"),H("Total check-ins"),H("Last 30 days vs goal"),H("Started")]];
  for(const h of hs){ const s=streak(h);
    summary.push([h.name, h.icon||"", WHEN.find(w=>w[0]===safeWhen(h.when))[1], h.goal||7, s.n, s.unit+"s", bestStreak(h), total(h), {v:Math.round(rate(h,30)*1000)/1000,s:3}, {v:createdKey(h)==="1970-01-01"?key(t):createdKey(h),s:2}]); }
  // Daily log: one row per day (newest first), 1 = done
  const first = hs.reduce((a,h)=>{ const ks=[createdKey(h), ...Object.keys(h.done||{}).filter(k=>h.done[k])].filter(k=>k!=="1970-01-01").sort(); return ks.length && ks[0]<a ? ks[0] : a; }, key(t));
  const log=[[H("Date"),H("Day"),...hs.map(h=>H(h.name)),H("Done"),H("Habits")]];
  for(let d=new Date(t), n=0; d>=fromKey(first) && n<3660; d=addDays(d,-1), n++){
    const k=key(d), act=hs.filter(h=>createdKey(h)<=k || isDone(h,k));
    log.push([{v:k,s:2}, DOW[d.getDay()], ...hs.map(h=>isDone(h,k)?1:""), hs.filter(h=>isDone(h,k)).length, act.length]);
  }
  return XLSX.book([
    {name:"Summary", rows:summary, widths:[30,7,13,14,14,12,17,15,20,12], freeze:[1,1]},
    {name:"Daily log", rows:log, widths:[12,7,...hs.map(h=>Math.min(28,Math.max(10,h.name.length+2))),8,9], freeze:[2,1]},
  ]);
}


async function saveFile(name, bytes){
  
  if(location.host==="appassets.androidplatform.net"){
    // Android app: the app shell picks this up and asks where to save it (nothing leaves the phone)
    let bin=""; for(let i=0;i<bytes.length;i+=0x8000) bin+=String.fromCharCode.apply(null, bytes.subarray(i,i+0x8000));
    const b64=btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    location.href = "https://appassets.androidplatform.net/__export?name="+encodeURIComponent(name)+"&data="+b64;
    return;
  }
  const url=URL.createObjectURL(new Blob([bytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
  const a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000);
}

// Backup / restore: a plain JSON copy of the user's own habits; nothing is sent anywhere.
function backupText(){ return JSON.stringify({app:"daily-streaks", version:1, exported:new Date().toISOString(), habits}); }
function restoreFrom(text){
  let data; try{ data=JSON.parse(text); }catch(e){ return "That doesn't look like a Daily Streaks backup. Paste the whole text you copied."; }
  const hs = data && data.app==="daily-streaks" && data.habits && typeof data.habits==="object" ? data.habits : null;
  if(!hs) return "That doesn't look like a Daily Streaks backup. Paste the whole text you copied.";
  let n=0;
  for(const [id,h] of Object.entries(hs)){
    if(!/^[A-Za-z0-9_-]{1,40}$/.test(id) || !h || typeof h.name!=="string") continue;
    const done={}; if(h.done && typeof h.done==="object") for(const [k,v] of Object.entries(h.done)) if(/^\d{4}-\d{2}-\d{2}$/.test(k)) done[k]=v?1:0;
    habits[id]={name:h.name.slice(0,60), icon:typeof h.icon==="string"?h.icon.slice(0,8):"✓", color:safeColor(h.color), goal:Math.min(7,Math.max(1,+h.goal||7)), when:safeWhen(h.when), created:+h.created||Date.now(), order:+h.order||0, done};
    saveHabit(id); n++;
  }
  return n ? n : "No habits were found in that backup.";
}

document.addEventListener("input", e => { if(e.target.id==="hName" && sheetCtx && sheetCtx.f){ sheetCtx.f.name=e.target.value; $("#hErr").hidden=true; updatePreview(sheetCtx.f); } });
document.addEventListener("click", e => {
  const b = e.target.closest("button, .scrim"); if(!b) return;
  const d = b.dataset;
  if(b.id==="toastUndo"){ const f=undoFn; undoFn=null; $("#toast").classList.remove("show"); if(f) f(); return; }
  if(b.id==="scrim" || d.close!==undefined){ closeSheet(); render(); return; }
  if(d.day){ selected=d.day; tab="today"; render(); return; }
  if(d.tab){
    if(d.tab==="settings"){ settings(); return; }
    tab=d.tab; render(); window.scrollTo({top:0}); return;
  }
  if(b.id==="fab"){ editor(null); return; }
  if(d.toggle){ toggle(d.toggle, selected, b); const nb=document.querySelector(`.chk[data-toggle="${d.toggle}"]`); if(nb) nb.classList.add("pop"); return; }
  if(d.toggleToday){ toggle(d.toggleToday, key(today0()), b); return; }
  if(d.open && !sheetCtx){ detail(d.open); return; }
  if(d.pkind){ pv={kind:d.pkind, off:0}; renderStats(); return; }
  if(d.pnav){ pv.off += +d.pnav; if(pv.off>0) pv.off=0; renderStats(); return; }
  if(d.starter!==undefined){ const on=b.getAttribute("aria-pressed")!=="true"; b.setAttribute("aria-pressed",on); b.classList.toggle("on",on); const any=document.querySelectorAll(".chip.on").length; const ab=$("#addStarters"); ab.disabled=!any; ab.textContent= any?`Add ${plural(any,"habit")}`:"Add selected"; return; }
  if(b.id==="addStarters"){ document.querySelectorAll(".chip.on").forEach(c=>createHabit(STARTERS[+c.dataset.starter])); toast("Habits added. Tap a circle to check one off."); render(); return; }

  if(sheetCtx && sheetCtx.kind==="settings"){
    if(d.palette){ prefs.palette=d.palette; savePrefs(); applyPalette(); document.querySelectorAll(".pal").forEach(x=>{ const on=x.dataset.palette===prefs.palette; x.classList.toggle("on",on); x.setAttribute("aria-pressed",on); }); render(); return; }
    if(d.pref){ prefs[d.pref]=!prefs[d.pref]; savePrefs(); b.setAttribute("aria-checked", prefs[d.pref]); if(d.pref==="haptics" && prefs.haptics) buzz(15); return; }
    if(d.export!==undefined){ if(!list().length){ toast("Add a habit first, then export."); return; } saveFile(`daily-streaks-${key(today0())}.xlsx`, buildWorkbook()); return; }
    if(d.backup!==undefined){
      const text=backupText(); const zone=$("#backupZone");
      zone.innerHTML = `<div class="field"><textarea id="bkText" readonly aria-label="Backup text"></textarea><p class="hint" id="bkHint">Copied. Paste it into a note to keep it safe.</p></div>`;
      const ta=$("#bkText"); ta.value=text;
      const fallback = () => { ta.focus(); ta.select(); $("#bkHint").textContent="Select all of this text and copy it, then paste it into a note."; };
      try{ navigator.clipboard.writeText(text).then(()=>toast("Backup copied"), fallback); }catch(err){ fallback(); }
      return;
    }
    if(d.showrestore!==undefined){ $("#backupZone").innerHTML = `<div class="field"><label class="label" for="rsText">Paste your backup</label><textarea id="rsText" placeholder='{"app":"daily-streaks", …}'></textarea><p class="err" id="rsErr" hidden></p><button class="btn block" data-restore>Restore habits</button><p class="hint">Habits in the backup are added or updated. Nothing else is removed.</p></div>`; $("#rsText").focus(); return; }
    if(d.restore!==undefined){ const r=restoreFrom($("#rsText").value); if(typeof r==="number"){ closeSheet(); render(); toast(`Restored ${plural(r,"habit")}`); } else { const er=$("#rsErr"); er.textContent=r; er.hidden=false; } return; }
  }
  if(sheetCtx && sheetCtx.kind==="edit"){
    const f=sheetCtx.f;
    if(d.icon){ f.icon=d.icon; document.querySelectorAll("[data-icon]").forEach(x=>x.classList.toggle("on",x===b)); updatePreview(f); return; }
    if(d.color){ f.color=d.color; document.querySelectorAll("[data-color]").forEach(x=>x.classList.toggle("on",x===b)); updatePreview(f); return; }
    if(d.when){ f.when=d.when; document.querySelectorAll("[data-when]").forEach(x=>x.classList.toggle("on",x===b)); updatePreview(f); return; }
    if(d.goal){ f.goal=+d.goal; document.querySelectorAll("[data-goal]").forEach(x=>x.classList.toggle("on",x===b)); $("#goalHint").textContent=goalText(f.goal); updatePreview(f); return; }
    if(d.save!==undefined){
      const name=f.name.trim(); if(!name){ $("#hErr").hidden=false; $("#hName").focus(); return; }
      if(sheetCtx.id){ Object.assign(habits[sheetCtx.id], {name, icon:f.icon, color:f.color, goal:f.goal, when:f.when}); saveHabit(sheetCtx.id); toast("Changes saved"); }
      else { createHabit({...f, name}); toast("Habit created"); }
      closeSheet(); render(); return;
    }
    if(d.askdel!==undefined){ $("#delZone").innerHTML = `<div class="confirm"><p>Delete <b>${esc(habits[sheetCtx.id].name)}</b> and all its history? This can't be undone.</p><div class="row-btns"><button class="btn secondary" data-keep>Keep it</button><button class="btn danger" data-del>Delete</button></div></div>`; return; }
    if(d.keep!==undefined){ $("#delZone").innerHTML = `<button class="btn danger block" data-askdel>Delete habit</button>`; return; }
    if(d.del!==undefined){ removeHabit(sheetCtx.id); closeSheet(); toast("Habit deleted"); render(); return; }
  }
  if(sheetCtx && sheetCtx.kind==="detail"){
    if(d.calday){ toggle(sheetCtx.id, d.calday, b, true); sheetCtx.draw(); return; }
    if(d.mon){ const ym=sheetCtx.ym; ym.m+= +d.mon; if(ym.m<0){ym.m=11;ym.y--;} if(ym.m>11){ym.m=0;ym.y++;} sheetCtx.draw(); return; }
    if(d.yr){ sheetCtx.ym.y += +d.yr; sheetCtx.draw(); return; }
    if(d.dview){ sheetCtx.ym.view=d.dview; sheetCtx.draw(); return; }
    if(d.edit){ editor(d.edit); return; }
  }
});
document.addEventListener("keydown", e => {
  if(e.key==="Escape" && sheetCtx){ closeSheet(); render(); }
  if(e.key==="Enter" && e.target.id==="hName"){ e.preventDefault(); const s=document.querySelector("[data-save]"); s && s.click(); }
});
document.addEventListener("animationend", e => e.target.classList && e.target.classList.remove("pop"));

// Android back button / gesture closes an open sheet instead of leaving
window.addEventListener("popstate", () => { if(sheetCtx){ closeSheet(); render(); } });
const _open = openSheet;
openSheet = function(html, ctx){ const wasOpen=!!sheetCtx; _open(html, ctx); if(!wasOpen){ try{ history.pushState({sheet:1},""); }catch(e){} } };
const _close = closeSheet;
closeSheet = function(){ const was=!!sheetCtx; _close(); if(was && history.state && history.state.sheet){ try{ history.back(); }catch(e){} } };

let lastDay = key(today0());
function rollover(){ const k=key(today0()); if(k!==lastDay){ if(selected===lastDay) selected=k; lastDay=k; render(); } }
setInterval(rollover, 60000);
document.addEventListener("visibilitychange", () => { if(!document.hidden) rollover(); });
let rT; window.addEventListener("resize", () => { clearTimeout(rT); rT=setTimeout(()=>{ if(tab==="habits") renderHabits(); },150); });

function runSplash(){
  const sp=$("#splash"); if(!sp) return;
  let seen=false; try{ seen = sessionStorage.getItem("ds-splash")==="1"; sessionStorage.setItem("ds-splash","1"); }catch(e){}
  if(seen){ sp.remove(); return; }
  const done=()=>{ if(sp.classList.contains("out")) return; sp.classList.add("out"); setTimeout(()=>sp.remove(),600); };
  sp.addEventListener("click", done);
  setTimeout(done, reduced ? 700 : 2400);
}
loadPrefs(); applyPalette();
runSplash();
initStore();
})();
