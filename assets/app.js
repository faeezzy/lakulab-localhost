(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Math.round(n)).replace(/\s/g,'');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='lakulab.v1';
const V=(n,m,u,s,t,o,d)=>({name:n,moq:m,unit:u,sample:s,setup:t,ship:o,dp:d});
const DEF=()=>({camp:{name:'Tote bag Ruang Kota',cat:'Tote bag',price:59000,target:'Mahasiswa Bandung Raya',days:'14',goal:30,crit:20},f:{visit:180,res:24,conf:16,cancel:3},sim:{qty:30,vendor:0,price:59000,conv:50,pct:[40,60,85]},vendors:[V('Vendor A',30,24000,45000,150000,40000,50),V('Vendor B',50,21500,60000,200000,60000,100),V('Vendor C',20,27000,30000,0,35000,30)]});
let S=DEF();
try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&r.camp&&r.sim&&r.vendors&&r.f)S=r;}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200);};
const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const set=(o,p,v)=>{const k=p.split('.'),l=k.pop();k.reduce((a,x)=>a[x],o)[l]=v;};
const num=v=>Math.max(0,Number(v)||0);
const icon=n=>`<i data-lucide="${n}"></i>`;
const icons=()=>{if(window.lucide)lucide.createIcons();};

/* ---- model ---- */
const tot=(v,q)=>Math.max(q,v.moq)*v.unit+v.sample+v.setup+v.ship;
const plan=()=>Math.max(1,Math.round(num(S.sim.qty)));
const curV=()=>S.vendors[Math.min(S.sim.vendor,S.vendors.length-1)];
function dec(){
  const v=curV(),q=Math.max(plan(),v.moq),T=tot(v,q),p=num(S.sim.price),b=p?Math.ceil(T/p):Infinity,cf=num(S.f.conf),cr=num(S.camp.crit);
  const okC=cf>=cr,okB=cf>=b,okM=v.moq<=cf;
  let st,head,body;
  if(okC&&okB){st='lanjut';head='Lanjut produksi';body=`${cf} konfirmasi ulang memenuhi kriteria ${cr} dan melewati titik impas ${b} unit.`;}
  else if(cf<b/2){st='tunda';head='Tunda produksi';body=`${cf} konfirmasi ulang masih jauh di bawah titik impas ${b} unit. Kumpulkan minat lebih dulu.`;}
  else{st='sesuaikan';const gaps=[];if(!okB)gaps.push(`kurang ${b-cf} dari titik impas ${b} unit`);if(!okC)gaps.push(`kurang ${cr-cf} dari kriteria ${cr}`);head='Sesuaikan rencana';body=`${cf} konfirmasi ulang, ${gaps.join(' dan ')}.`;}
  let alt=null;S.vendors.forEach(x=>{const qq=Math.max(x.moq,cf,1),t=tot(x,qq),bb=p?Math.ceil(t/p):Infinity;if(bb<=cf&&(!alt||t<alt.t))alt={x,qq,t,bb};});
  const sug=st==='lanjut'?'':(alt?`Coba ${alt.x.name} dengan produksi ${alt.qq} unit. Modalnya ${rp(alt.t)} dan titik impasnya ${alt.bb} unit, di bawah ${cf} konfirmasi yang sudah ada.`:'Belum ada vendor yang titik impasnya di bawah jumlah konfirmasi. Naikkan harga, cari biaya lebih rendah, atau perpanjang pengumpulan minat.');
  return{st,head,body,sug,v,q,T,b,p,cf,cr,okC,okB,okM};
}

/* ---- render pieces ---- */
function funnelRows(big,d){
  const F=S.f,mx=Math.max(1,num(F.visit)),pc=(a,b)=>b?Math.round(a/b*100)+'%':'-';
  const be=isFinite(d.b)?Math.min(100,d.b/mx*100):null;
  const rows=[['Kunjungan',F.visit,'',false],['Reservasi gratis',F.res,pc(F.res,F.visit)+' dari kunjungan',false],['Konfirmasi ulang',F.conf,pc(F.conf,F.res)+' dari reservasi',true]];
  if(big)rows.push(['Batal',F.cancel,'',false]);
  return rows.map(([k,n,s,key])=>`<div class="fr${key?' key':''}"><span>${k}</span><div class="tr"><i style="width:${Math.min(100,num(n)/mx*100)}%"></i>${key&&be!=null?`<div class="be" style="left:${be}%"><span>Titik impas ${d.b}</span></div>`:''}</div><b>${num(n)}${big&&s?` <span>${s}</span>`:''}</b></div>`).join('');
}
const kpi=(k,n,s='')=>`<div class="kpi"><span class="k">${k}</span><span class="n">${n}</span>${s?`<span class="s">${s}</span>`:''}</div>`;
const chk=(ok,t,s='',link='')=>`<li class="${ok?'y':'n'}"><span class="ic">${icon(ok?'check':'x')}</span><div><span>${t}</span>${s?`<span class="mu sm">${s}</span>`:''}</div>${link}</li>`;
const kv=(k,v)=>`<div class="kv"><span>${k}</span><b>${v}</b></div>`;

const FLOW=[['kampanye','Rancangan'],['pembeli','Minat'],['vendor','Vendor'],['simulasi','Simulasi'],['keputusan','Keputusan'],['laporan','Laporan']];
const seen=new Set();
const VF=[['moq','MOQ','unit'],['unit','Harga per unit','Rp'],['sample','Biaya sampel','Rp'],['setup','Setup sablon','Rp'],['ship','Ongkir','Rp'],['dp','DP di muka','%']];
function vtable(){
  const n=S.vendors.length;
  $('#vtable').innerHTML=`<colgroup><col>${S.vendors.map((_,i)=>`<col id="vc${i}">`).join('')}${n<4?'<col>':''}</colgroup>
  <thead><tr><th>Penawaran</th>${S.vendors.map((v,i)=>`<th><div class="vh"><div class="row"><span id="vb${i}"></span>${n>1?`<button class="link" data-del="${i}" type="button" aria-label="Hapus ${esc(v.name)}">Hapus</button>`:''}</div><input aria-label="Nama vendor ${i+1}" data-k="vendors.${i}.name"></div></th>`).join('')}${n<4?'<th><button class="btn ol" id="addv" type="button">'+icon('plus')+'Vendor</button></th>':''}</tr></thead>
  <tbody>${VF.map(f=>`<tr><td>${f[1]} <span class="mu">(${f[2]})</span></td>${S.vendors.map((_,i)=>`<td><input type="number" inputmode="numeric" min="0" aria-label="${f[1]} vendor ${i+1}" data-k="vendors.${i}.${f[0]}"></td>`).join('')}${n<4?'<td></td>':''}</tr>`).join('')}</tbody>
  <tfoot><tr><td>Unit diproduksi</td>${S.vendors.map((_,i)=>`<td class="num" id="vq${i}"></td>`).join('')}${n<4?'<td></td>':''}</tr>
  <tr class="total"><td>Total modal</td>${S.vendors.map((_,i)=>`<td class="num" id="vt${i}"></td>`).join('')}${n<4?'<td></td>':''}</tr>
  <tr><td>DP sebelum produksi</td>${S.vendors.map((_,i)=>`<td class="num" id="vd${i}"></td>`).join('')}${n<4?'<td></td>':''}</tr>
  <tr><td>Titik impas</td>${S.vendors.map((_,i)=>`<td class="num" id="vbe${i}"></td>`).join('')}${n<4?'<td></td>':''}</tr></tfoot>`;
  const a=$('#addv');if(a)a.onclick=()=>{S.vendors.push(V('Vendor '+'ABCD'[S.vendors.length],30,25000,40000,100000,40000,50));save();vtable();bind();calc();};
  $$('[data-del]').forEach(b=>b.onclick=()=>{const i=+b.dataset.del;if(!confirm(`Hapus ${S.vendors[i].name}?`))return;S.vendors.splice(i,1);if(S.sim.vendor>=S.vendors.length)S.sim.vendor=0;save();vtable();bind();calc();});
  icons();
}
function bind(){
  $$('[data-k]').forEach(el=>{
    if(el.id==='vsel')fillSel();
    const v=get(S,el.dataset.k);el.value=v==null?'':v;
    el.oninput=()=>{const t=el.type==='number'||el.id==='vsel';set(S,el.dataset.k,t?num(el.value):el.value);if(/vendors\.\d\.name/.test(el.dataset.k))fillSel();save();calc();};
  });
}
function fillSel(){const s=$('#vsel');s.innerHTML=S.vendors.map((v,i)=>`<option value="${i}">${esc(v.name||'Vendor '+(i+1))}</option>`).join('');s.value=Math.min(S.sim.vendor,S.vendors.length-1);}

function init(){
  FLOW.forEach(([id],i)=>{const sec=$('#v-'+id),ph=sec.querySelector('.ph');
    ph.insertAdjacentHTML('afterend',`<nav class="flow" aria-label="Tahapan eksperimen">${FLOW.map(([f,l],j)=>`<a href="#${f}" data-f="${f}"${j===i?' aria-current="step"':''}><span class="fn">${j+1}</span><span class="fl">${l}</span></a>`).join('')}</nav>`);
    const prev=FLOW[i-1],next=FLOW[i+1];
    sec.insertAdjacentHTML('beforeend',`<div class="flownav noprint">${prev?`<a class="btn ol" href="#${prev[0]}">${icon('arrow-left')}${prev[1]}</a>`:'<span></span>'}${next?`<a class="btn pu" href="#${next[0]}">Lanjut ke ${next[1].toLowerCase()}${icon('arrow-right')}</a>`:'<a class="btn pu" href="#dashboard">Kembali ke ringkasan</a>'}</div>`);});
  $('#scen').innerHTML=['Pesimis','Realistis','Optimis'].map((n,i)=>`<div class="sc"><div class="row between"><h3>${n}</h3><span class="chip" id="sk${i}"></span></div><label>Terjual dari produksi<span class="ip"><input type="number" inputmode="numeric" min="0" max="100" data-k="sim.pct.${i}"><em>%</em></span></label><p class="res" id="sd${i}"></p><div class="stack" aria-hidden="true"><i id="sb${i}"></i></div><div>${['Terjual|sn','Stok sisa|ss','Penerimaan|sr'].map(x=>{const[a,b]=x.split('|');return `<div class="kv"><span>${a}</span><b id="${b}${i}"></b></div>`}).join('')}</div></div>`).join('');
  vtable();bind();calc();
  $('#p-ok').onchange=e=>{$('#p-res').disabled=!e.target.checked;};
  renderInst();
}

function calc(){
  const d=dec(),F=S.f,cf=d.cf,v=d.v,p=d.p,q0=plan();
  // vendor table
  const ts=S.vendors.map(x=>tot(x,q0)),min=Math.min(...ts);
  S.vendors.forEach((x,i)=>{if(!$('#vt'+i))return;const q=Math.max(q0,x.moq),b=p?Math.ceil(ts[i]/p):Infinity;
    $('#vt'+i).textContent=rp(ts[i]);$('#vq'+i).textContent=q+' unit'+(x.moq>q0?' (MOQ)':'');$('#vd'+i).textContent=rp(ts[i]*x.dp/100);
    $('#vbe'+i).innerHTML=isFinite(b)?`<span class="${b<=cf?'pos':'neg'}">${b} unit</span>`:'-';
    $('#vb'+i).innerHTML=ts[i]===min?'<span class="chip lime">Modal terendah</span>':'';
    const c=$('#vc'+i);if(c)c.className=ts[i]===min?'best':'';});
  const hi=S.vendors.filter(x=>x.moq>cf&&cf>0);
  $('#vwarn').innerHTML=hi.length?`<div class="warn">${icon('triangle-alert')}<span>MOQ ${hi.map(x=>esc(x.name)+' ('+x.moq+' unit)').join(', ')} lebih besar dari ${cf} konfirmasi ulang. Kalau produksi mengikuti MOQ, sebagian stok kemungkinan tersisa.</span></div>`:'';

  // simulasi
  $('#s-sub').textContent=`${v.name}: modal ${rp(d.T)} untuk ${d.q} unit, harga jual ${rp(p)}. Persentase terjual adalah asumsimu.`;
  S.sim.pct.forEach((pc,i)=>{const pp=Math.min(100,num(pc)),n=Math.round(d.q*pp/100),r=n*p,df=r-d.T;
    const e=$('#sd'+i);e.textContent=(df>=0?'+':'−')+rp(Math.abs(df));e.className='res '+(df>=0?'pos':'neg');
    $('#sk'+i).textContent=df>=0?'Untung':'Rugi';$('#sk'+i).className='chip '+(df>=0?'ok':'bad');
    $('#sb'+i).style.width=pp+'%';$('#sr'+i).textContent=rp(r);$('#sn'+i).textContent=n+' unit';$('#ss'+i).textContent=(d.q-n)+' unit';});
  const cv=Math.round(cf*num(S.sim.conv)/100);
  $('#sstat').innerHTML=kpi('Titik impas',isFinite(d.b)?d.b+' unit':'-','Unit yang harus laku untuk menutup modal')+kpi('Perkiraan pembeli',cv+' unit',`${cf} konfirmasi × ${num(S.sim.conv)}% asumsi konversi`)+kpi('DP sebelum produksi',rp(d.T*v.dp/100),`${v.dp}% ke ${esc(v.name)}`)+kpi('Pelunasan',rp(d.T*(100-v.dp)/100),'Dibayar setelah produksi');

  // keputusan
  const D=$('#dec');D.className='verdict '+d.st;
  D.innerHTML=`<div class="rail" aria-hidden="true">${['tunda','sesuaikan','lanjut'].map(s=>`<span class="${s===d.st?'on':''}">${s[0].toUpperCase()+s.slice(1)}</span>`).join('')}</div><h2>${d.head}</h2><p>${d.body}</p>${d.sug?`<p class="sug">${d.sug}</p>`:''}`;
  $('#k-checks').innerHTML=chk(d.okC,`Konfirmasi ulang ${cf} dari kriteria ${d.cr}`)+chk(d.okB,`Konfirmasi ulang ${cf} dari titik impas ${isFinite(d.b)?d.b:'-'} unit`,`${v.name}, ${d.q} unit, harga ${rp(p)}`)+chk(d.okM,`MOQ ${v.name} ${v.moq} unit dibanding ${cf} konfirmasi`,d.okM?'':'Produksi minimum melebihi minat yang terkonfirmasi.');
  $('#k-c').innerHTML=kv('Kunjungan',F.visit)+kv('Reservasi gratis',F.res)+kv('Konfirmasi ulang',cf)+kv('Modal '+esc(v.name),rp(d.T))+kv('Harga jual',rp(p));

  // dashboard
  const days=S.camp.days;
  $('#d-sub').textContent=`${S.camp.name} · ${S.camp.cat} · uji ${days} hari untuk ${S.camp.target}`;
  $('#kpi').innerHTML=kpi('Reservasi gratis',F.res,`target ${S.camp.goal}`)+kpi('Konfirmasi ulang',cf,`kriteria ${d.cr}`)+kpi('Titik impas',isFinite(d.b)?d.b+' unit':'-',`${v.name}, ${d.q} unit`)+kpi('Modal',rp(d.T),`DP ${rp(d.T*v.dp/100)}`);
  const top=Math.max(cf,d.cr,isFinite(d.b)?d.b:0,1)*1.15,pct=x=>Math.min(100,x/top*100);
  $('#d-meter').innerHTML=`<i style="width:${pct(cf)}%"></i>${isFinite(d.b)?`<div class="mk" style="left:${pct(d.b)}%"><span>Impas ${d.b}</span></div>`:''}<div class="mk c" style="left:${pct(d.cr)}%"><span>Kriteria ${d.cr}</span></div>`;
  $('#d-meter-n').textContent=`${cf} konfirmasi ulang saat ini. ${d.head}.`;
  const stepOK=[!!(S.camp.name&&S.camp.price&&S.camp.crit),num(F.res)>0,S.vendors.length>=2,d.st==='lanjut'];
  $('#d-steps').innerHTML=chk(stepOK[0],'Rancangan uji lengkap','','<a href="#kampanye">Ubah</a>')+chk(stepOK[1],'Minat dicatat',`${F.res} reservasi, ${cf} konfirmasi`,'<a href="#pembeli">Buka</a>')+chk(stepOK[2],'Minimal dua vendor dibandingkan',`${S.vendors.length} vendor`,'<a href="#vendor">Buka</a>')+chk(stepOK[3],'Keputusan',d.head,'<a href="#keputusan">Baca</a>');

  // flow done states
  const done={kampanye:!!(S.camp.name&&S.camp.price&&S.camp.crit),pembeli:num(F.res)>0,vendor:S.vendors.length>=2,simulasi:seen.has('simulasi'),keputusan:seen.has('keputusan'),laporan:seen.has('laporan')};
  $$('.flow a').forEach(a=>a.classList.toggle('done',!!done[a.dataset.f]));
  $$('[data-echo]').forEach(e=>{e.textContent=rp(num(get(S,e.dataset.echo)));});
  // sidebar status
  $('#sb-now').innerHTML=`<span class="mu">Eksperimen aktif</span><b>${esc(S.camp.name)}</b><span><span class="chip ${d.st==='lanjut'?'ok':d.st==='tunda'?'bad':''}">${d.head}</span></span>`;

  // pembeli
  $('#f-funnel').innerHTML=funnelRows(true,d);

  // kampanye preview
  $('#p-name').textContent=S.camp.name||'Nama produk';$('#p-price').textContent=rp(S.camp.price);$('#p-target').textContent=`Untuk ${S.camp.target} · dibuka ${days} hari`;

  // laporan
  const today=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  $('#rep').innerHTML=`<header><div><p class="eyebrow">Laporan eksperimen · ${today}</p><h2 style="font-size:22px;margin-top:4px">${esc(S.camp.name)}</h2><p class="mu">${esc(S.camp.cat)} · harga uji ${rp(S.camp.price)} · ${days} hari · ${esc(S.camp.target)}</p></div><img src="assets/logo-lakulab.png" alt="LakuLab"></header>
  <section><h3>Rekomendasi</h3><p style="font:800 20px Manrope">${d.head}</p><p>${d.body}</p>${d.sug?`<p class="mu">${d.sug}</p>`:''}</section>
  <div class="g2"><section><h3>Bukti minat</h3>${kv('Kunjungan',F.visit)}${kv('Reservasi gratis',F.res)}${kv('Konfirmasi ulang',cf)}${kv('Batal',F.cancel)}${kv('Kriteria sukses',d.cr+(d.okC?' · tercapai':' · belum'))}</section>
  <section><h3>Biaya produksi</h3>${kv('Vendor',esc(v.name)+', MOQ '+v.moq)}${kv('Produksi',d.q+' unit')}${kv('Modal',rp(d.T))}${kv('DP sebelum produksi',rp(d.T*v.dp/100))}${kv('Titik impas',isFinite(d.b)?d.b+' unit':'-')}</section></div>
  <section><h3>Asumsi</h3><p class="mu">Harga jual ${rp(p)} dan konversi konfirmasi ke pembelian ${num(S.sim.conv)}% ditetapkan pengguna. Skenario terjual ${S.sim.pct.map(num).join('%, ')}% dari produksi. Reservasi gratis dan konfirmasi ulang adalah sinyal permintaan, bukan transaksi penjualan.</p></section>`;
  calc.text=[`Laporan eksperimen LakuLab: ${S.camp.name}`,`Rekomendasi: ${d.head}. ${d.body}`,d.sug&&`Saran: ${d.sug}`,`Kunjungan ${F.visit}, reservasi ${F.res}, konfirmasi ulang ${cf}, batal ${F.cancel}`,`Vendor ${v.name}, ${d.q} unit, modal ${rp(d.T)}, titik impas ${isFinite(d.b)?d.b:'-'} unit`,`Asumsi: harga ${rp(p)}, konversi ${num(S.sim.conv)}%. Minat bukan penjualan.`].filter(Boolean).join('\n');
  icons();
}

function renderInst(){
  const T=[['Tim Sablon Senja','Kaos',22,20,18,'lanjut'],['Kopi Kampus','Tumbler',9,15,21,'tunda'],['Ruang Kota','Tote bag',16,20,17,'sesuaikan'],['Stiker Lab','Stiker',41,30,25,'lanjut'],['Hoodie Angkatan','Hoodie',12,25,19,'sesuaikan'],['Catatan Kecil','Notebook',0,20,16,'belum']];
  const lab={lanjut:['Lanjut','ok'],sesuaikan:['Sesuaikan',''],tunda:['Tunda','bad'],belum:['Belum mulai','']};
  const c=k=>T.filter(t=>t[5]===k).length;
  $('#i-kpi').innerHTML=kpi('Tim aktif',T.length+' / 25')+kpi('Lanjut',c('lanjut'))+kpi('Sesuaikan',c('sesuaikan'))+kpi('Tunda atau belum mulai',c('tunda')+c('belum'));
  $('#i-table').innerHTML=`<thead><tr><th>Tim</th><th>Produk</th><th class="num">Konfirmasi</th><th class="num">Kriteria</th><th class="num">Titik impas</th><th>Status</th></tr></thead><tbody>${T.map(t=>`<tr><td><b>${t[0]}</b></td><td>${t[1]}</td><td class="num">${t[2]}</td><td class="num">${t[3]}</td><td class="num">${t[4]} unit</td><td><span class="chip ${lab[t[5]][1]}">${lab[t[5]][0]}</span></td></tr>`).join('')}</tbody>`;
}

/* ---- routing ---- */
const views=['beranda','dashboard','kampanye','pembeli','vendor','simulasi','keputusan','laporan','paket','institusi'];
const names={beranda:'Uji minat sebelum produksi',dashboard:'Ringkasan',kampanye:'Rancangan uji',pembeli:'Calon pembeli',vendor:'Vendor',simulasi:'Simulasi',keputusan:'Keputusan',laporan:'Laporan',paket:'Paket & harga',institusi:'Untuk institusi'};
function route(){
  let h=location.hash.slice(1);if(!views.includes(h))h='beranda';
  $$('.v').forEach(s=>s.classList.toggle('on',s.id==='v-'+h));
  const m=['vendor','simulasi','keputusan'].includes(h)?'vendor':h;
  $$('.sb a[data-m]').forEach(a=>{const on=a.dataset.m===m;a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  $$('.tabs a').forEach(a=>{const on=a.dataset.t===h;a.classList.toggle('on',on);a.setAttribute('aria-selected',on);});
  $('#sb').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');window.scrollTo(0,0);
  document.title='LakuLab · '+names[h];
  document.body.classList.toggle('is-landing',h==='beranda');
  seen.add(h);if(['simulasi','keputusan','laporan'].includes(h))calc();
  if(window.LakuLanding)LakuLanding[h==='beranda'?'show':'hide']();
  const g=window.gsap,cur=$('#v-'+h);
  if(g&&!rm()&&h!=='beranda'){g.fromTo(cur,{opacity:0,y:10},{opacity:1,y:0,duration:.35,ease:'power2.out',clearProps:'all'});
    if(h==='dashboard'||h==='simulasi')cur.querySelectorAll('.kpi .n').forEach(el=>{const t=el.textContent,m=t.match(/[\d.]+/);if(!m)return;const n=+m[0].replace(/\./g,'');if(!n)return;const o={v:0};g.to(o,{v:n,duration:.8,ease:'power2.out',onUpdate:()=>{el.textContent=t.replace(m[0],Math.round(o.v).toLocaleString('id-ID'))},onComplete:()=>{el.textContent=t}});});}
}
const rm=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#menu').onclick=()=>{const o=$('#sb').classList.toggle('open');$('#menu').setAttribute('aria-expanded',o);};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#sb').classList.remove('open');});
$('#save').onclick=()=>{save();toast('Rancangan disimpan di browser ini.');};
$('#reset').onclick=()=>{if(confirm('Kembalikan semua isian ke data contoh?')){S=DEF();save();vtable();bind();calc();toast('Data contoh dipulihkan.');}};
$('#p-res').onclick=()=>{$('#p-msg').textContent='Ini pratinjau. Reservasi belum terkirim di versi localhost.';};
$('#print').onclick=()=>window.print();
$('#copy').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(calc.text):Promise.reject()).then(()=>toast('Laporan disalin.'),()=>toast('Tidak bisa menyalin. Pilih teks lalu salin manual.'));};
window.addEventListener('hashchange',route);
init();route();
})();
