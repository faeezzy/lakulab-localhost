(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Math.round(n));
const KEY='lakulab.v1';
const V=(n,m,u,s,t,o,d)=>({name:n,moq:m,unit:u,sample:s,setup:t,ship:o,dp:d});
const DEF=()=>({camp:{name:'Tote bag Ruang Kota',cat:'Tote bag',price:59000,target:'Mahasiswa Bandung Raya',days:'14',goal:30,crit:20},f:{visit:180,res:24,conf:16,cancel:3},sim:{qty:30,vendor:0,price:59000,conv:50,pct:[40,60,85]},vendors:[V('Vendor A',30,24000,45000,150000,40000,50),V('Vendor B',50,21500,60000,200000,60000,100),V('Vendor C',20,27000,30000,0,35000,30)]});
let S=DEF();
try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&r.camp&&r.sim&&r.vendors&&r.f)S=r;}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200);};
const get=(o,p)=>p.split('.').reduce((a,k)=>a&&a[k],o);
const set=(o,p,v)=>{const k=p.split('.'),l=k.pop();get(o,k.join('.')||'')&&0;const t=k.reduce((a,x)=>a[x],o);t[l]=v;};
const num=v=>Math.max(0,Number(v)||0);
const tot=(v,q)=>Math.max(q,v.moq)*v.unit+v.sample+v.setup+v.ship;
const qOf=v=>Math.max(1,Math.round(num(S.sim.qty)));
const VF=[['moq','MOQ (unit)'],['unit','Harga per unit (Rp)'],['sample','Biaya sampel (Rp)'],['setup','Setup sablon (Rp)'],['ship','Ongkir (Rp)'],['dp','DP di muka (%)']];
function cards(){
  $('#vcards').innerHTML=S.vendors.map((v,i)=>`<div class="c" style="min-width:250px"><label>Nama vendor<input data-k="vendors.${i}.name"></label>${VF.map(f=>`<div class="l"><span>${f[1]}</span><input type="number" min="0" data-k="vendors.${i}.${f[0]}"></div>`).join('')}<p class="big" id="vt${i}"></p><p class="mu" id="vq${i}"></p><span id="vb${i}"></span></div>`).join('')+(S.vendors.length<4?'<div class="c" style="justify-content:center"><button class="ol" id="addv">+ Tambah vendor</button></div>':'');
  const a=$('#addv');if(a)a.onclick=()=>{S.vendors.push(V('Vendor '+'ABCD'[S.vendors.length],30,25000,40000,100000,40000,50));save();cards();bind();calc();};
}
function bind(){
  $$('[data-k]').forEach(el=>{
    if(el.tagName==='SELECT'&&el.id==='vsel')fillSel();
    const v=get(S,el.dataset.k);el.value=v==null?'':v;
    el.oninput=()=>{const t=el.type==='number'||el.id==='vsel';set(S,el.dataset.k,t?num(el.value):el.value);if(/vendors\.\d\.name/.test(el.dataset.k))fillSel();save();calc();};
  });
}
function fillSel(){const s=$('#vsel');s.innerHTML=S.vendors.map((v,i)=>`<option value="${i}">${v.name||'Vendor '+(i+1)}</option>`).join('');s.value=Math.min(S.sim.vendor,S.vendors.length-1);}
function init(){
  $$('.tabs').forEach(t=>t.innerHTML=[['vendor','Vendor'],['simulasi','Simulasi'],['keputusan','Keputusan']].map(x=>`<a href="#${x[0]}" data-t="${x[0]}">${x[1]}</a>`).join(''));
  $('#scen').innerHTML=['Pesimis','Realistis','Optimis'].map((n,i)=>`<div class="c"><span class="chip">${n}</span><label>Terjual (% dari produksi)<input type="number" min="0" max="100" data-k="sim.pct.${i}"></label><p class="big" id="sd${i}"></p><div class="l"><span>Penerimaan</span><b id="sr${i}"></b></div><div class="l"><span>Terjual</span><b id="sn${i}"></b></div><div class="l"><span>Stok sisa</span><b id="ss${i}"></b></div></div>`).join('');
  $('#sstat').innerHTML=['Titik impas|bk','Konversi dari minat|cv','Kas puncak (DP)|kp'].map(x=>{const[a,b]=x.split('|');return `<div class="c"><h3>${a}</h3><p class="big" id="${b}"></p><p class="mu" id="${b}n"></p></div>`}).join('');
  cards();bind();calc();
}
function dec(){
  const v=S.vendors[Math.min(S.sim.vendor,S.vendors.length-1)],q=Math.max(qOf(),v.moq),T=tot(v,q),p=num(S.sim.price),b=p?Math.ceil(T/p):Infinity,cf=num(S.f.conf),cr=num(S.camp.crit);
  let st='sesuaikan',head,body;
  if(cf>=cr&&cf>=b){st='lanjut';head='Lanjut produksi';body=`Konfirmasi ulang ${cf} memenuhi kriteria ${cr} dan melewati titik impas ${b} unit.`;}
  else if(cf<b/2){st='tunda';head='Tunda produksi';body=`Konfirmasi ulang ${cf} masih jauh di bawah titik impas ${b} unit.`;}
  else{head='Sesuaikan rencana';body=`Konfirmasi ulang ${cf} belum ${cf<cr?'memenuhi kriteria '+cr:'menutup titik impas '+b+' unit'}.`;}
  let alt=null;S.vendors.forEach(x=>{const qq=Math.max(x.moq,cf,1),t=tot(x,qq),bb=p?Math.ceil(t/p):Infinity;if(bb<=cf&&(!alt||t<alt.t))alt={x,qq,t,bb};});
  const sug=st==='lanjut'?'':(alt?`Saran: pakai ${alt.x.name}, produksi ${alt.qq} unit. Modal ${rp(alt.t)}, titik impas ${alt.bb} unit, di bawah konfirmasi yang ada.`:'Belum ada kombinasi vendor yang titik impasnya di bawah konfirmasi. Naikkan harga, turunkan biaya, atau kumpulkan lebih banyak minat.');
  return{st,head,body,sug,v,q,T,b};
}
function calc(){
  const q0=qOf();
  const ts=S.vendors.map(v=>tot(v,q0)),min=Math.min(...ts),cf=num(S.f.conf);
  S.vendors.forEach((v,i)=>{const e=$('#vt'+i);if(!e)return;e.textContent=rp(ts[i]);$('#vq'+i).textContent='modal untuk '+Math.max(q0,v.moq)+' unit'+(v.moq>q0?' (MOQ)':'');$('#vb'+i).innerHTML=ts[i]===min?'<span class="chip" style="background:#D9EE7A;color:#1F3A2E">Modal terendah</span>':'';});
  const hi=S.vendors.filter(v=>v.moq>cf&&cf>0);$('#vwarn').innerHTML=hi.length?`<div class="wn">MOQ ${hi.map(v=>v.name+' ('+v.moq+')').join(', ')} lebih besar dari ${cf} konfirmasi ulang. Risiko stok tersisa tinggi.</div>`:'';
  const d=dec(),p=num(S.sim.price),v=d.v;
  $('#s-sub').textContent=`Modal ${rp(d.T)} · produksi ${d.q} unit · harga jual ${rp(p)}. Jumlah terjual adalah asumsi, bukan penjualan.`;
  S.sim.pct.forEach((pc,i)=>{const n=Math.round(d.q*Math.min(100,num(pc))/100),r=n*p,df=r-d.T;$('#sd'+i).textContent=(df>=0?'+':'-')+rp(Math.abs(df));$('#sd'+i).style.color=df>=0?'#1E6B3F':'#A8201A';$('#sr'+i).textContent=rp(r);$('#sn'+i).textContent=n+' unit';$('#ss'+i).textContent=(d.q-n)+' unit';});
  $('#bk').textContent=isFinite(d.b)?d.b+' unit':'-';$('#bkn').textContent='Terjual minimal sebanyak ini untuk menutup modal.';
  const cv=Math.round(cf*num(S.sim.conv)/100);$('#cv').textContent=S.sim.conv+'% = '+cv+' unit';$('#cvn').textContent=cf+' konfirmasi ulang × asumsi kamu. Belum riset pasar.';
  $('#kp').textContent=rp(d.T*v.dp/100);$('#kpn').textContent='DP '+v.dp+'% '+v.name+' sebelum produksi.';
  const F=S.f,pc=(a,b)=>b?Math.round(a/b*100)+'%':'-';
  $('#f-rate').textContent=`Reservasi dari kunjungan ${pc(F.res,F.visit)} · konfirmasi dari reservasi ${pc(F.conf,F.res)}`;
  $('#k-f').innerHTML=`<h3>Funnel minat</h3><div class="l"><span>Kunjungan</span><b>${F.visit}</b></div><div class="l"><span>Reservasi gratis</span><b>${F.res} (${pc(F.res,F.visit)})</b></div><div class="l"><span>Konfirmasi ulang</span><b>${F.conf} (${pc(F.conf,F.res)})</b></div><div class="l"><span>Batal</span><b>${F.cancel}</b></div>`;
  const ok=cf>=S.camp.crit;
  $('#k-c').innerHTML=`<h3>Kriteria sukses</h3><div class="l"><span>Konfirmasi minimal</span><b>${S.camp.crit}</b></div><div class="l"><span>Realisasi</span><b class="${ok?'ok':'bd'}">${cf} · ${ok?'tercapai':'belum'}</b></div><div class="l"><span>Modal ${v.name}</span><b>${rp(d.T)}</b></div><div class="l"><span>Titik impas</span><b>${isFinite(d.b)?d.b+' unit':'-'}</b></div>`;
  const D=$('#dec');D.className='dec '+d.st;D.innerHTML=`<span class="chip">${d.st.toUpperCase()}</span><h2>${d.head}</h2><p>${d.body}</p><p class="mu">${d.sug}</p>`;
  $('#kpi').innerHTML=[['Produk',S.camp.name],['Reservasi gratis',F.res],['Konfirmasi ulang',F.conf],['Modal skenario',rp(d.T)]].map(x=>`<div class="c"><p class="mu">${x[0]}</p><p class="big" style="font-size:${String(x[1]).length>12?18:26}px">${x[1]}</p></div>`).join('');
  $('#d-name').textContent=S.camp.name;$('#d-day').textContent=`Konfirmasi ${cf} dari ${S.camp.crit}`;$('#d-bar').style.width=Math.min(100,S.camp.crit?cf/S.camp.crit*100:0)+'%';
  $('#p-name').textContent=S.camp.name||'Nama produk';$('#p-price').textContent=rp(S.camp.price);$('#p-target').textContent='Untuk '+S.camp.target+' · '+S.camp.days+' hari';
  const L=[['Produk',S.camp.name+' ('+S.camp.cat+')'],['Reservasi / konfirmasi ulang',F.res+' / '+cf],['Vendor terpilih',`${v.name}, MOQ ${v.moq}`],['Modal '+d.q+' unit',rp(d.T)],['Titik impas',isFinite(d.b)?d.b+' unit':'-'],['Rekomendasi',d.head],['Saran',d.sug||'Tidak ada penyesuaian.']];
  $('#rep').innerHTML='<h2>Laporan eksperimen</h2>'+L.map(x=>`<div class="l"><span>${x[0]}</span><b style="text-align:right">${x[1]}</b></div>`).join('')+'<p class="mu">Asumsi: konversi minat '+S.sim.conv+'% dan harga jual adalah asumsi pengguna. Reservasi bukan penjualan.</p>';
  calc.text=L.map(x=>x[0]+': '+x[1]).join('\n');
}
const views=['beranda','dashboard','kampanye','pembeli','vendor','simulasi','keputusan','laporan'];let first=true;
function route(){
  let h=location.hash.slice(1);if(!views.includes(h))h='beranda';
  $$('.v').forEach(s=>s.classList.toggle('on',s.id==='v-'+h));
  const m=['vendor','simulasi','keputusan'].includes(h)?'vendor':h;
  $$('.sb a[data-m]').forEach(a=>{const on=a.dataset.m===m;a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  $$('.tabs a').forEach(a=>a.classList.toggle('on',a.dataset.t===h));
  $('#sb').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');window.scrollTo(0,0);
  document.title='LakuLab · '+h[0].toUpperCase()+h.slice(1);
  if(h==='beranda')motion();if(window.ScrollTrigger)ScrollTrigger.refresh();
}
let moved=false;
function motion(){
  const g=window.gsap;if(moved||!g||matchMedia('(prefers-reduced-motion:reduce)').matches)return;moved=true;
  g.from('.hc>*',{y:22,opacity:0,duration:.8,stagger:.1,ease:'power3.out',clearProps:'all'});
  g.from('.art g[data-depth]',{y:26,opacity:0,scale:.94,duration:.9,stagger:.12,delay:.25,ease:'back.out(1.2)',transformOrigin:'50% 50%',clearProps:'opacity,scale'});
  const art=$('.art'),t=$$('.art [data-depth]').map(el=>({d:+el.dataset.depth,x:g.quickTo(el,'x',{duration:.9,ease:'power3.out'}),y:g.quickTo(el,'y',{duration:.9,ease:'power3.out'})}));
  art.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=art.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;t.forEach(o=>{o.x(x*16*o.d);o.y(y*12*o.d);});});
  art.addEventListener('pointerleave',()=>t.forEach(o=>{o.x(0);o.y(0);}));
  if(window.ScrollTrigger){g.registerPlugin(ScrollTrigger);g.to('.orbit',{y:34,rotation:25,svgOrigin:'270 220',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});g.from('.steps .c',{y:30,opacity:.2,duration:.7,stagger:.12,scrollTrigger:{trigger:'.steps',start:'top 90%',once:true},clearProps:'all'});}
}
$('#menu').onclick=()=>{const o=$('#sb').classList.toggle('open');$('#menu').setAttribute('aria-expanded',o);};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#sb').classList.remove('open');});
$('#save').onclick=()=>{save();toast('Rancangan disimpan di browser ini.');};
$('#reset').onclick=()=>{if(confirm('Kembalikan semua isian ke data contoh?')){S=DEF();save();cards();bind();calc();toast('Data contoh dipulihkan.');}};
$('#p-res').onclick=()=>{$('#p-msg').textContent='Ini pratinjau. Reservasi belum terkirim di versi localhost.';};
$('#print').onclick=()=>window.print();
$('#copy').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(calc.text):Promise.reject()).then(()=>toast('Laporan disalin.'),()=>toast('Tidak bisa menyalin. Pilih teks lalu salin manual.'));};
window.addEventListener('hashchange',route);
init();route();
})();
