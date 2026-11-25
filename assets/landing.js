/* Halaman depan: panggung 3D + cerita gulir + kalkulator mini */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const g=window.gsap,ST=window.ScrollTrigger;
const small=()=>matchMedia('(max-width:900px)').matches,sc=()=>small()?.62:1;
const reduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const N=30,COLS=4,ROWS=3,PER=12,CELL=57,H=40;
let built=false,step=-1,triggers=[];

function build(){
  const plane=$('#plane');
  plane.style.width=COLS*CELL+'px';plane.style.height=ROWS*CELL+'px';
  /* 3 lapis kardus di atas palet: 12 + 12 + 6 (lapis atas 3x2, di tengah) */
  plane.innerHTML='<div class="pallet"></div>'+Array.from({length:N},(_,i)=>{
    const layer=Math.floor(i/PER),k=i%PER,top=layer===2;
    const col=top?k%3+.5:k%COLS,row=top?Math.floor(k/3)+.5:Math.floor(k/COLS);
    const cls=['cube',i<16?'conf':i<24?'res':'',i===16?'gap':'',i>16?'rest':''].join(' ');
    return `<div class="${cls}" data-z0="${layer*H}" style="left:${col*CELL}px;top:${row*CELL}px;transform:translateZ(${layer*H}px);--d:${i*14}ms"><i class="t"></i><i class="s"></i><i class="e"></i><i class="w"></i><i class="n"></i></div>`;
  }).join('');
  if(g){
    $$('.cube').forEach(c=>g.set(c,{z:+c.dataset.z0}));
    $$('.c3').forEach(c=>g.set(c,{z:+c.dataset.z||0,autoAlpha:0,scale:sc(),transformOrigin:'0 0'}));
    tilt();
  }
  calc();
  ['t-conf','t-price','t-qty'].forEach(id=>$('#'+id).addEventListener('input',calc));
  $$('[name="t-v"]').forEach(r=>r.addEventListener('change',calc));
  magnet();
  $$('[data-goto]').forEach(b=>b.addEventListener('click',()=>{const t=document.getElementById(b.dataset.goto);if(t)t.scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'});}));
  built=true;
}

/* CTA utama sedikit menarik kursor: penanda bahwa ini bisa dipencet */
function magnet(){
  if(!g||reduce())return;
  $$('.btn.lime, .btn.pu').forEach(b=>{
    if(b.disabled)return;
    const x=g.quickTo(b,'x',{duration:.4,ease:'power3.out'}),y=g.quickTo(b,'y',{duration:.4,ease:'power3.out'});
    b.addEventListener('pointermove',e=>{
      if(e.pointerType==='touch')return;
      const r=b.getBoundingClientRect();
      x((e.clientX-r.left-r.width/2)*.22);y((e.clientY-r.top-r.height/2)*.3);
    });
    b.addEventListener('pointerleave',()=>{x(0);y(0);});
  });
}

/* Gulir halus ala Lenis, ditulis sendiri supaya tidak perlu library.
   Hanya roda kursor yang diambil alih; sentuh, keyboard, dan seret bilah gulir
   tetap bawaan browser, lalu disinkronkan lagi lewat event scroll. */
function smooth(){
  if(!g||reduce())return;
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const de=document.documentElement;
  de.style.scrollBehavior='auto';
  let target=scrollY,cur=target,run=false,self=false;
  const max=()=>de.scrollHeight-innerHeight;
  const clamp=v=>Math.max(0,Math.min(v,max()));

  function frame(){
    cur+=(target-cur)*.12;
    if(Math.abs(target-cur)<.4)cur=target;
    self=true;scrollTo(0,cur);
    if(ST)ST.update();
    if(cur===target){run=false;g.ticker.remove(frame);}
  }
  function start(){if(run)return;run=true;cur=scrollY;g.ticker.add(frame);}
  function sync(){target=cur=scrollY;}

  /* biarkan kotak yang punya gulir sendiri memakai gulir bawaan */
  function inner(el){
    for(let n=el;n&&n!==document.body;n=n.parentElement){
      if(n.scrollHeight-n.clientHeight>2){
        const o=getComputedStyle(n).overflowY;
        if(o==='auto'||o==='scroll')return true;
      }
    }
    return false;
  }

  addEventListener('wheel',e=>{
    if(e.ctrlKey||e.defaultPrevented||inner(e.target))return;
    e.preventDefault();
    target=clamp(target+e.deltaY*(e.deltaMode===1?28:e.deltaMode===2?innerHeight:1));
    start();
  },{passive:false});

  /* gulir dari sumber lain (keyboard, bilah gulir, scrollIntoView) */
  addEventListener('scroll',()=>{if(self){self=false;return;}if(!run)sync();},{passive:true});
  addEventListener('resize',sync);
  window.LakuSmooth={stop:()=>{run=false;g.ticker.remove(frame);},sync};
}

/* Bagian bawah muncul saat masuk layar */
function reveals(){
  if(!g||!ST||reduce())return;
  const show=(sel,o={})=>$$(sel).forEach(el=>{
    g.from(el,Object.assign({y:22,autoAlpha:0,duration:.7,ease:'power2.out',
      scrollTrigger:{trigger:el,start:'top 88%',once:true}},o));
  });
  show('.lsec-h');
  show('.try',{y:28,duration:.8});
  show('.vs',{y:26,duration:.8});
  $$('.plans').forEach(w=>g.from(w.children,{y:26,autoAlpha:0,duration:.65,stagger:.12,
    ease:'power2.out',scrollTrigger:{trigger:w,start:'top 85%',once:true}}));
  $$('.faq').forEach(w=>g.from(w.children,{y:14,autoAlpha:0,duration:.5,stagger:.07,
    ease:'power2.out',scrollTrigger:{trigger:w,start:'top 85%',once:true}}));
  show('.lend',{y:34,duration:.85});
}

function tilt(){
  const stage=$('.stage-in'),world=$('.world');
  const rx=g.quickTo(world,'rotationX',{duration:.8,ease:'power3.out'}),ry=g.quickTo(world,'rotationY',{duration:.8,ease:'power3.out'});
  stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduce())return;const b=stage.getBoundingClientRect();ry(((e.clientX-b.left)/b.width-.5)*14);rx(-((e.clientY-b.top)/b.height-.5)*10);});
  stage.addEventListener('pointerleave',()=>{rx(0);ry(0);});
  if(!reduce())g.to('.plane',{y:-10,duration:3.2,ease:'sine.inOut',yoyo:true,repeat:-1});
}

function setStep(n){
  if(n===step)return;const prev=step;step=n;
  $('.world').dataset.step=n;
  $$('#rail li').forEach((li,i)=>{li.classList.toggle('on',i===n-1);li.classList.toggle('past',i<n-1);});
  if(!g){$$('.c3').forEach(c=>c.style.visibility=c.dataset.show.split(' ').includes(String(n))?'visible':'hidden');return;}
  const d=reduce()?0:1;
  $$('.c3').forEach(c=>{
    const on=c.dataset.show.split(' ').includes(String(n)),z=+c.dataset.z||0;
    g.to(c,{scale:sc(),autoAlpha:on?1:0,z:on?z:z-80,y:on?0:16,duration:.55*d,delay:on?.18*d:0,ease:on?'back.out(1.4)':'power2.in',overwrite:true});
  });
  if(!d)return;
  if(n===2){$$('.c-funnel [data-count]').forEach(el=>{const o={v:0},t=+el.dataset.count;g.to(o,{v:t,duration:1,delay:.3,ease:'power2.out',onUpdate:()=>el.textContent=Math.round(o.v)});});
    $$('.cube.conf').forEach((c,i)=>{const z=+c.dataset.z0;g.fromTo(c,{z:z+50},{z,duration:.5,delay:i*.035,ease:'bounce.out',overwrite:true});});}
  if(n===4){g.fromTo('.c-verdict .stamp',{scale:1.8,opacity:0},{scale:1,opacity:1,duration:.4,delay:.5,ease:'back.out(2.2)'});
    $$('.cube.gap').forEach(c=>{const z=+c.dataset.z0;g.fromTo(c,{z},{z:z+26,duration:.6,yoyo:true,repeat:3,ease:'sine.inOut',delay:.4,overwrite:true});});
    /* kardus tanpa pembeli sedikit tergeser: stok berisiko */
    $$('.cube.rest').forEach((c,i)=>g.fromTo(c,{rotationZ:0},{rotationZ:i%2?5:-5,duration:.12,yoyo:true,repeat:3,delay:.5+i*.03,ease:'sine.inOut'}));}
  /* kardus jatuh dan menumpuk, lapis bawah dulu */
  if(n===0&&prev===-1)$$('.cube').forEach((c,i)=>{const z=+c.dataset.z0;
    g.fromTo(c,{z:z+420,autoAlpha:0},{z,autoAlpha:1,duration:.75,delay:.2+i*.035,ease:'bounce.out',overwrite:true});});
}

function scroll(){
  if(!g||!ST){setStep(0);return;}
  g.registerPlugin(ST);
  reveals();
  $$('.chap').forEach(ch=>triggers.push(ST.create({trigger:ch,start:'top 60%',end:'bottom 60%',onToggle:s=>{if(s.isActive)setStep(+ch.dataset.step);}})));
  triggers.push(ST.create({trigger:'.story',start:'top top',end:'bottom bottom',onUpdate:s=>$('#rail').style.setProperty('--p',s.progress)}));
  if(!reduce()){
    /* parallax: tumpukan ikut gulir, naik dan mendekat pelan */
    g.fromTo('.para',{y:24,scale:.97},{y:-16,scale:1.03,ease:'none',scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:.8}});
    g.from('.chap-hero>*',{y:18,opacity:0,duration:.7,stagger:.09,ease:'power2.out',clearProps:'all'});
  }
  setStep(0);
}

/* kalkulator mini */
const VEN=[{n:'Vendor A',moq:30,unit:24000,fix:235000,dp:50},{n:'Vendor B',moq:50,unit:21500,fix:320000,dp:100},{n:'Vendor C',moq:20,unit:27000,fix:65000,dp:30}];
let lastSt='';
function calc(){
  const cf=+$('#t-conf').value,p=+$('#t-price').value,qty=+$('#t-qty').value,vi=+document.querySelector('[name="t-v"]:checked').value,v=VEN[vi];
  const q=Math.max(qty,v.moq),T=q*v.unit+v.fix,b=Math.ceil(T/p),cr=20;
  $('#t-conf-o').textContent=cf+' orang';$('#t-price-o').textContent=rp(p);$('#t-qty-o').textContent=qty+' unit';
  $('#t-vinfo').textContent=`${v.n}: MOQ ${v.moq} unit, ${rp(v.unit)} per unit, DP ${v.dp}%`+(v.moq>qty?`. Produksi dinaikkan ke ${v.moq} unit mengikuti MOQ.`:'.');
  let st,head,body;
  if(cf>=cr&&cf>=b){st='lanjut';head='Lanjut produksi';body=`${cf} konfirmasi ulang sudah melewati titik impas ${b} unit dan kriteria ${cr}.`;}
  else if(cf<b/2){st='tunda';head='Tunda dulu';body=`${cf} konfirmasi ulang masih jauh dari titik impas ${b} unit.`;}
  else{st='sesuaikan';head='Sesuaikan rencana';const g2=[];if(cf<b)g2.push(`kurang ${b-cf} dari titik impas`);if(cf<cr)g2.push(`kurang ${cr-cf} dari kriteria`);body=`${cf} konfirmasi ulang, ${g2.join(' dan ')}.`;}
  if(b>q)body+=` Bahkan kalau semua ${q} unit laku, modalnya belum kembali.`;
  $('#t-head').textContent=head;$('#t-body').textContent=body;
  const s=$('#t-stamp');s.textContent=st;s.className='stamp '+st;
  if(g&&lastSt&&lastSt!==st&&!reduce())g.fromTo(s,{scale:1.5,rotation:-12},{scale:1,rotation:-3,duration:.35,ease:'back.out(2)'});
  lastSt=st;
  $('#t-modal').textContent=rp(T);$('#t-be').textContent=b+' unit';$('#t-dp').textContent=rp(T*v.dp/100);
  $('#t-units').innerHTML=Array.from({length:q},(_,i)=>`<i class="${i<cf?'a':i<b?'b':'c'}"></i>`).join('');
}

/* gulir halus berlaku di semua halaman, bukan cuma halaman depan */
smooth();

window.LakuLanding={
  show(){
    if(!built){build();scroll();}
    else if(ST)ST.refresh();
  },
  hide(){}
};
})();
