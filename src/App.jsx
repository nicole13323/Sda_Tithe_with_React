import {useState} from 'react'
import {createPortal} from 'react-dom'
import {TR} from './i18n'
import {CH,fmt,ago,seed} from './data'

const ls={g:k=>{try{return localStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}}
const rwf=n=>Number(n).toLocaleString('en-US')+' RWF'
const RK={member:'rm',leader:'rl',admin:'ra'},RM={member:'member',leader:'treasurer',admin:'admin'},HINT={member:'0788100001',leader:'tres1 … tres8',admin:'admin'}
const LANGS=[['en','English'],['rw','Kinyarwanda'],['sw','Kiswahili'],['fr','Français']]

export default function App(){
  const [L,setL]=useState(ls.g('sdaL')||'en')
  const [db,setDb]=useState(()=>{try{const d=JSON.parse(ls.g('sdaDB'));if(d)return d}catch(e){}return seed()})
  const [S,setS]=useState({role:null,u:null,tab:'login',v:'rep',per:'month',ch:'all',q:''})
  const [f,setF]=useState({})
  const [rc,setRc]=useState(null)
  const [msg,setMsg]=useState('')
  const t=k=>TR[k]?TR[k][L]:k
  const up=o=>setS(s=>({...s,...o}))
  const I=k=>({value:f[k]||'',onChange:e=>setF(x=>({...x,[k]:e.target.value}))})
  const save=d=>{setDb(d);ls.s('sdaDB',JSON.stringify(d))}
  const toast=m=>{setMsg(m);setTimeout(()=>setMsg(''),2200)}
  const chOpts=()=>CH.map(c=><option key={c}>{c}</option>)
  const sumOf=id=>db.P.filter(p=>p.mid===id).reduce((a,p)=>a+p.amt,0)
  const nameOf=id=>(db.M.find(m=>m.id===id)||{}).name||''

  const login=()=>{const v=(f.a1||'').trim()
    const m=db.M.find(x=>(x.phone&&x.phone===v)||(x.u&&x.u===v))
    if(m&&f.a2==='123'&&m.role===RM[S.role]){up({u:m,ch:m.role==='admin'?'all':m.church,v:m.role==='admin'?'ana':'rep'});setF({})}else toast(t('bad'))}
  const reg=()=>{const n=(f.r1||'').trim(),p=(f.r2||'').trim()
    if(!n||p.length<9)return toast(t('bad'))
    if(db.M.some(x=>x.phone===p))return toast(t('exist'))
    const m={id:'m'+Date.now(),name:n,u:'',phone:p,church:f.r3||CH[0],role:'member'}
    save({...db,M:[...db.M,m]});up({u:m});setF({});toast(t('ok'))}
  const pay=()=>{const a=+f.pa;if(!(a>=100))return toast(t('bad'))
    const p={id:'p'+Date.now(),mid:S.u.id,ch:S.u.church,amt:a,date:fmt(new Date()),method:f.pm||'MTN MoMo',by:''}
    save({...db,P:[...db.P,p]});setF({});toast(t('ok'));setRc(p.id)}
  const scope=()=>S.u.role==='admin'?S.ch:S.u.church
  const addM=sc=>{const n=(f.n1||'').trim(),p=(f.n2||'').trim()
    if(!n||p.length<9)return toast(t('bad'))
    if(db.M.some(x=>x.phone===p))return toast(t('exist'))
    save({...db,M:[...db.M,{id:'m'+Date.now(),name:n,u:'',phone:p,church:sc==='all'?(f.n3||CH[0]):sc,role:'member'}]});setF({});toast(t('ok'))}
  const delM=id=>{if(!confirm(t('del')+'?'))return;save({M:db.M.filter(m=>m.id!==id),P:db.P.filter(p=>p.mid!==id)})}
  const cashPay=ms=>{const a=+f.c2,mid=f.c1||(ms[0]&&ms[0].id);if(!(a>=100)||!mid)return toast(t('bad'))
    const m=db.M.find(x=>x.id===mid)
    const p={id:'p'+Date.now(),mid,ch:m.church,amt:a,date:f.c3||fmt(new Date()),method:'Cash',by:S.u.name}
    save({...db,P:[...db.P,p]});setF({});toast(t('ok'));setRc(p.id)}

  const ptable=(a,showM)=>(
    <div className="tw"><table><thead><tr><th>{t('date')}</th>{showM&&<th>{t('mbr')}</th>}<th>{t('amount')}</th><th>{t('method')}</th><th></th></tr></thead>
    <tbody>{a.map(p=><tr key={p.id}><td>{p.date}</td>{showM&&<td>{nameOf(p.mid)}</td>}<td>{rwf(p.amt)}</td><td>{p.method}</td>
      <td><button className="s" onClick={()=>setRc(p.id)}>🧾 {t('rec')}</button></td></tr>)}</tbody></table></div>)

  const auth=()=>{const R=S.role,rg=R==='member'&&S.tab==='reg'
    return <>
      <div className="hero"><img className="biglogo" src="/logo.png"/><h1>{t('app')}</h1><p>Malachi 3:10</p></div>
      <div className="wrap" style={{maxWidth:440}}><div className="card" style={{marginTop:-36}}>
      {!R?<>
        <h3 style={{textAlign:'center',marginTop:0}}>{t('who')}</h3>
        {[['member','👤'],['leader','⛪'],['admin','🛡️']].map(x=>
          <button key={x[0]} className="role" onClick={()=>{up({role:x[0],tab:'login'});setF({})}}><span>{x[1]}</span>{t(RK[x[0]])}</button>)}
      </>:<>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <button className="s" onClick={()=>up({role:null})}>← {t('back')}</button><b>{t(RK[R])}</b></div>
        {R==='member'&&<div className="tabs">
          <button className={!rg?'on':''} onClick={()=>up({tab:'login'})}>{t('login')}</button>
          <button className={rg?'on':''} onClick={()=>up({tab:'reg'})}>{t('register')}</button></div>}
        {!rg?<>
          <label>{t('phone')}</label><input {...I('a1')}/>
          <label>{t('password')}</label><input type="password" {...I('a2')}/>
          <button className="btn" onClick={login}>{t('login')}</button>
          
        </>:<>
          <label>{t('name')}</label><input {...I('r1')}/>
          <label>{t('phone')}</label><input type="tel" placeholder="07XXXXXXXX" {...I('r2')}/>
          <label>{t('church')}</label><select {...I('r3')}>{chOpts()}</select>
          <small>{t('pw')}</small>
          <button className="btn" onClick={reg}>{t('register')}</button>
        </>}
      </>}
      </div></div></>}

  const member=()=>{
    const my=db.P.filter(p=>p.mid===S.u.id).sort((a,b)=>b.date.localeCompare(a.date)),y=new Date().getFullYear()+''
    const ty=my.filter(p=>p.date.startsWith(y)).reduce((a,p)=>a+p.amt,0)
    return <>
      <div className="hero" style={{padding:'24px 16px 50px'}}><h2 style={{margin:0}}>{S.u.name}</h2><p style={{margin:4}}>{S.u.church}</p></div>
      <div className="wrap" style={{marginTop:-36}}>
        <div className="stats">
          <div className="stat"><b>{rwf(ty)}</b><span>{t('yr')}</span></div>
          <div className="stat"><b>{rwf(my.reduce((a,p)=>a+p.amt,0))}</b><span>{t('total')}</span></div>
          <div className="stat"><b>{my.length}</b><span>{t('cnt')}</span></div></div>
        <div className="card"><h3>💚 {t('pay')}</h3>
          <div className="g2"><div><label>{t('amount')}</label><input type="number" min="100" {...I('pa')}/></div>
          <div><label>{t('method')}</label><select {...I('pm')}><option>MTN MoMo</option><option>Airtel Money</option><option>Card</option></select></div></div>
          <button onClick={pay}>{t('pay')}</button></div>
        <div className="card"><h3>{t('hist')}</h3>{ptable(my,false)}</div>
      </div></>}

  const rep=sc=>{const now=new Date(),P=S.per,B=[]
    if(P==='year')for(let m=1;m<=12;m++)B.push({k:now.getFullYear()+'-'+String(m).padStart(2,'0'),l:m,s:0})
    else if(P==='month'){const n=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();for(let d=1;d<=n;d++)B.push({k:fmt(new Date(now.getFullYear(),now.getMonth(),d)),l:d,s:0})}
    else for(let d=6;d>=0;d--)B.push({k:ago(d),l:ago(d).slice(5),s:0})
    const key=p=>P==='year'?p.date.slice(0,7):p.date,map={};B.forEach(b=>map[b.k]=b)
    const per=db.P.filter(p=>(sc==='all'||p.ch===sc)&&map[key(p)]);per.forEach(p=>map[key(p)].s+=p.amt)
    const tot=per.reduce((a,p)=>a+p.amt,0),mx=Math.max(1,...B.map(b=>b.s)),g={}
    per.forEach(p=>g[p.mid]=(g[p.mid]||0)+p.amt)
    const bm={},bc={},cn={}
    per.forEach(p=>{const x=bm[p.method]=bm[p.method]||{c:0,s:0};x.c++;x.s+=p.amt;const y=bc[p.ch]=bc[p.ch]||{c:0,s:0};y.c++;y.s+=p.amt;cn[p.mid]=(cn[p.mid]||0)+1})
    const R=o=>Object.entries(o).sort((a,b)=>b[1].s-a[1].s).map(x=><tr key={x[0]}><td>{x[0]}</td><td>{x[1].c}</td><td><b>{rwf(x[1].s)}</b></td></tr>)
    const foot=<tr><th>{t('total')}</th><th>{per.length}</th><th>{rwf(tot)}</th></tr>
    const T=(h,r)=><div className="tw"><table><thead><tr>{h.map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{r}</tbody></table></div>
    const ms=db.M.filter(m=>m.role==='member'&&(sc==='all'||m.church===sc)).sort((a,b)=>(g[b.id]||0)-(g[a.id]||0))
    const tx=[...per].sort((x,y)=>y.date.localeCompare(x.date)||y.id.localeCompare(x.id))
    const printRep=()=>{document.body.classList.add('rp');window.print();document.body.classList.remove('rp')}
    return <>
      <div className="tabs">{['week','month','year'].map(x=><button key={x} className={P===x?'on':''} onClick={()=>up({per:x})}>{t(x)}</button>)}</div>
      <div className="stats">
        <div className="stat"><b>{rwf(tot)}</b><span>{t('total')}</span></div>
        <div className="stat"><b>{per.length}</b><span>{t('cnt')}</span></div>
        <div className="stat"><b>{per.length?rwf(Math.round(tot/per.length)):'0'}</b><span>Ø</span></div></div>
      <div className="card"><div className="bars">{B.map(b=>
        <div key={b.k} className="bar" title={b.k+': '+rwf(b.s)}><i style={{height:Math.round(b.s/mx*85)+'%'}}></i>{b.l}</div>)}</div></div>
      <div className="card"><h3>📋 {t('full')} — {sc==='all'?t('all'):sc} ({t(P)})</h3>
        <div className="np"><button onClick={printRep}>🖨 {t('print')}</button></div>
        <h4>{t('bymeth')}</h4>{T([t('method'),t('cnt'),t('total')],<>{R(bm)}{foot}</>)}
        {sc==='all'&&<><h4>{t('bych')}</h4>{T([t('church'),t('cnt'),t('total')],<>{R(bc)}{foot}</>)}</>}
        <h4>{t('bymem')} ({ms.length})</h4>{T([t('name'),t('church'),t('cnt'),t('total')],ms.map(m=><tr key={m.id}><td>{m.name}</td><td>{m.church}</td><td>{cn[m.id]||0}</td><td>{g[m.id]?<b>{rwf(g[m.id])}</b>:'—'}</td></tr>))}
        <h4>{t('alltx')} ({per.length})</h4>{T([t('date'),t('mbr'),t('church'),t('method'),t('by'),t('amount')],tx.map(p=><tr key={p.id}><td>{p.date}</td><td>{nameOf(p.mid)}</td><td>{p.ch}</td><td>{p.method}</td><td>{p.by||'—'}</td><td><b>{rwf(p.amt)}</b></td></tr>))}</div></>}

  const ana=sc=>{const now=new Date(),Y=now.getFullYear(),mk=(y,m)=>y+'-'+String(m).padStart(2,'0'),cm=mk(Y,now.getMonth()+1),pd=new Date(Y,now.getMonth()-1,1),lm=mk(pd.getFullYear(),pd.getMonth()+1)
    const P=db.P.filter(p=>sc==='all'||p.ch===sc),ms=db.M.filter(m=>m.role==='member'&&(sc==='all'||m.church===sc))
    const sum=a=>a.reduce((x,p)=>x+p.amt,0),yr=P.filter(p=>p.date.startsWith(Y+'')),mo=P.filter(p=>p.date.startsWith(cm)),pm=P.filter(p=>p.date.startsWith(lm))
    const gr=sum(pm)?Math.round((sum(mo)-sum(pm))/sum(pm)*100):0,act=new Set(mo.map(p=>p.mid)).size,cut=ago(60),rec=new Set(P.filter(p=>p.date>=cut).map(p=>p.mid)),late=ms.filter(m=>!rec.has(m.id)).length
    const trend=[];for(let i=11;i>=0;i--){const d=new Date(Y,now.getMonth()-i,1),k=mk(d.getFullYear(),d.getMonth()+1);trend.push({k,l:d.getMonth()+1,s:sum(P.filter(p=>p.date.startsWith(k)))})}
    const mx=Math.max(1,...trend.map(b=>b.s)),ty=sum(yr)||1,bm={};yr.forEach(p=>bm[p.method]=(bm[p.method]||0)+p.amt)
    const hb=(l,v,max,x)=><div className="hb" key={l}><span>{l}</span><div className="hbt"><i style={{width:Math.round(v/max*100)+'%'}}></i></div><b>{x}</b></div>
    const rows=CH.map(c=>({c,n:ms.filter(m=>m.church===c).length,a:new Set(mo.filter(p=>p.ch===c).map(p=>p.mid)).size,y:sum(yr.filter(p=>p.ch===c))})).sort((a,b)=>b.y-a.y)
    return <>
      <div className="stats">
        <div className="stat"><b>{rwf(sum(yr))}</b><span>{t('yr')}</span></div>
        <div className="stat"><b>{rwf(sum(mo))}</b><span>{t('mon')} · <em className={gr>=0?'up':'dn'}>{gr>=0?'▲':'▼'} {Math.abs(gr)}% {t('grow')}</em></span></div>
        <div className="stat"><b>{ms.length}</b><span>{t('mem')}</span></div>
        <div className="stat"><b>{act} ({ms.length?Math.round(act/ms.length*100):0}%)</b><span>{t('act')} · {t('mon')}</span></div>
        <div className="stat"><b>{late}</b><span>{t('late')}</span></div>
        <div className="stat"><b>{rwf(Math.round(sum(yr)/(ms.length||1)))}</b><span>{t('avgm')}</span></div></div>
      <div className="card"><h3>📈 {t('trend')}</h3><div className="bars">{trend.map(b=>
        <div key={b.k} className="bar" title={b.k+': '+rwf(b.s)}><i style={{height:Math.round(b.s/mx*85)+'%'}}></i>{b.l}</div>)}</div></div>
      <div className="g2">
        <div className="card"><h3>💳 {t('share')}</h3>{Object.entries(bm).sort((a,b)=>b[1]-a[1]).map(x=>hb(x[0],x[1],ty,Math.round(x[1]/ty*100)+'%'))}</div>
        {sc==='all'&&<div className="card"><h3>🏆 {t('rank')}</h3>{rows.map(r=>hb(r.c,r.y,Math.max(1,rows[0].y),rwf(r.y)))}</div>}</div>
      {sc==='all'&&<div className="card"><h3>⛪ {t('church')} · {t('part')}</h3><div className="tw"><table><thead><tr><th>{t('church')}</th><th>{t('mem')}</th><th>{t('act')}</th><th>{t('part')}</th><th>{t('yr')}</th><th>{t('avgm')}</th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.c}><td>{r.c}</td><td>{r.n}</td><td>{r.a}</td><td>{r.n?Math.round(r.a/r.n*100):0}%</td><td><b>{rwf(r.y)}</b></td><td>{rwf(Math.round(r.y/(r.n||1)))}</td></tr>)}</tbody></table></div></div>}</>}

  const mem=sc=>{const q=S.q.toLowerCase()
    const a=db.M.filter(m=>m.role==='member'&&(sc==='all'||m.church===sc)&&(m.name+m.phone).toLowerCase().includes(q)).slice(0,100)
    return <>
      <div className="card"><h3>{t('add')}</h3>
        <div className="g2"><div><label>{t('name')}</label><input {...I('n1')}/></div>
        <div><label>{t('phone')}</label><input type="tel" {...I('n2')}/></div>
        {sc==='all'&&<div><label>{t('church')}</label><select {...I('n3')}>{chOpts()}</select></div>}</div>
        <button onClick={()=>addM(sc)}>{t('save')}</button><small>{t('pw')}</small></div>
      <div className="card"><input placeholder={t('search')} value={S.q} onChange={e=>up({q:e.target.value})}/>
        <div className="tw"><table><thead><tr><th>{t('name')}</th><th>{t('phone')}</th><th>{t('church')}</th><th>{t('total')}</th><th></th></tr></thead>
        <tbody>{a.map(m=><tr key={m.id}><td>{m.name}</td><td>{m.phone}</td><td>{m.church}</td><td>{rwf(sumOf(m.id))}</td>
          <td><button className="s d" onClick={()=>delM(m.id)}>{t('del')}</button></td></tr>)}</tbody></table></div></div></>}

  const cash=sc=>{const ms=db.M.filter(m=>m.role==='member'&&(sc==='all'||m.church===sc))
    const rcs=db.P.filter(p=>p.method==='Cash'&&p.by&&(sc==='all'||p.ch===sc)).sort((a,b)=>b.id.localeCompare(a.id)).slice(0,15)
    return <>
      <div className="card"><h3>💵 {t('cash')}</h3>
        <div className="g2"><div><label>{t('mbr')}</label><select {...I('c1')}>{ms.map(m=><option key={m.id} value={m.id}>{m.name} · {m.phone}</option>)}</select></div>
        <div><label>{t('amount')}</label><input type="number" min="100" {...I('c2')}/></div>
        <div><label>{t('date')}</label><input type="date" value={f.c3||fmt(new Date())} onChange={e=>setF(x=>({...x,c3:e.target.value}))}/></div></div>
        <button onClick={()=>cashPay(ms)}>{t('save')}</button></div>
      <div className="card">{ptable(rcs,1)}</div></>}

  const mgr=()=>{const sc=scope(),adm=S.u.role==='admin'
    return <>
      <div className="hero" style={{padding:'22px 16px 46px'}}><h2 style={{margin:0}}>{adm?t('ra'):t('rl')} · {sc==='all'?t('all'):sc}</h2></div>
      <div className="wrap" style={{marginTop:-30}}>
        {adm&&<select value={S.ch} onChange={e=>up({ch:e.target.value})}><option value="all">{t('all')}</option>{chOpts()}</select>}
        <div className="tabs">{(adm?['ana']:[]).concat(['rep','mem','cash']).map(x=><button key={x} className={S.v===x?'on':''} onClick={()=>{up({v:x});setF({})}}>{t(x)}</button>)}</div>
        {S.v==='ana'?ana(sc):S.v==='rep'?rep(sc):S.v==='mem'?mem(sc):cash(sc)}
      </div></>}

  const receipt=()=>{const p=db.P.find(x=>x.id===rc);if(!p)return null
    return createPortal(<div id="modal" className="show"><div className="rc">
      <h2><img src="/logo.png" style={{height:50,display:'block',margin:'0 auto 6px'}}/>SDA {p.ch}</h2>
      <p style={{justifyContent:'center',border:0,color:'#666'}}>{t('rec')} · SDA-{p.id.slice(1).toUpperCase()}</p>
      <p><span>{t('mbr')}</span><b>{nameOf(p.mid)}</b></p>
      <p><span>{t('church')}</span><b>{p.ch}</b></p>
      <p><span>{t('date')}</span><b>{p.date}</b></p>
      <p><span>{t('method')}</span><b>{p.method}</b></p>
      {p.by&&<p><span>{t('by')}</span><b>{p.by}</b></p>}
      <p><span>{t('amount')}</span><b style={{fontSize:'1.3rem',color:'#0b6e4f'}}>{rwf(p.amt)}</b></p>
      <div className="np" style={{display:'flex',gap:8,marginTop:14}}>
        <button className="btn" onClick={()=>window.print()}>🖨 {t('print')}</button>
        <button className="btn d" onClick={()=>setRc(null)}>{t('close')}</button></div>
    </div></div>,document.body)}

  return <>
    <header><b><img className="logo" src="/logo.png"/> {t('app')}</b>
      <div><select value={L} onChange={e=>{setL(e.target.value);ls.s('sdaL',e.target.value)}}>{LANGS.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select>
      {S.u&&<button className="o" onClick={()=>{up({u:null,role:null});setF({})}}>{t('logout')}</button>}</div></header>
    {S.u?(S.u.role==='member'?member():mgr()):auth()}
    {receipt()}
    <div id="toast" style={{display:msg?'block':'none'}}>{msg}</div>
  </>
}
