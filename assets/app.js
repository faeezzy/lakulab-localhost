/* LakuLab local prototype. No server API or payment integration. */
if (window.lucide) {
  window.lucide.createIcons({attrs:{width:16,height:16}});
}

    (()=>{
      const root=document.getElementById('lakulab-web-design');
      if(!root)return;
      const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s));
      const names={beranda:'Beranda',dashboard:'Dashboard',kampanye:'Kampanye',pembeli:'Calon pembeli',simulasi:'Vendor & simulasi',laporan:'Laporan'};
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function go(page){
        qa('[data-view]').forEach(el=>el.hidden=el.dataset.view!==page);
        qa('[data-page]').forEach(el=>{if(el.dataset.page===page)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
        q('#ll-current-label').textContent=names[page];
        q('.ll-sidebar').classList.remove('is-open');q('.ll-mobile-menu').setAttribute('aria-expanded','false');
        if(window.gsap&&!reduced)window.gsap.fromTo(q('[data-view="'+page+'"]'),{y:10,opacity:.65},{y:0,opacity:1,duration:.35,clearProps:'transform,opacity'});
        if(window.ScrollTrigger)window.ScrollTrigger.refresh();
      }
      qa('[data-page],[data-go]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.page||el.dataset.go)));
      q('.ll-mobile-menu').addEventListener('click',()=>{const open=q('.ll-sidebar').classList.toggle('is-open');q('.ll-mobile-menu').setAttribute('aria-expanded',String(open));});
      const productTemplates={
        tote:{label:'Tote bag',name:'Tote bag Ruang Kota',price:'59000',audience:'Mahasiswa yang mencari tote bag untuk aktivitas kampus'},
        kaos:{label:'Kaos',name:'Kaos Studio Kampus',price:'89000',audience:'Mahasiswa dan komunitas yang mencari kaos dengan desain orisinal'},
        hoodie:{label:'Hoodie / sweater',name:'Hoodie After Class',price:'199000',audience:'Mahasiswa yang mencari hoodie untuk kegiatan kampus dan perjalanan'},
        topi:{label:'Topi',name:'Topi Weekend Club',price:'59000',audience:'Anggota komunitas yang mencari topi untuk aktivitas luar ruangan'},
        tumbler:{label:'Tumbler',name:'Tumbler Daily Refill',price:'79000',audience:'Mahasiswa yang membawa minuman sendiri untuk aktivitas harian'},
        mug:{label:'Mug',name:'Mug Meja Cerita',price:'45000',audience:'Pencinta desain ilustrasi yang mencari mug untuk meja belajar'},
        stiker:{label:'Stiker',name:'Paket Stiker Campus Life',price:'15000',audience:'Mahasiswa yang menghias laptop dan notebook dengan stiker'},
        notebook:{label:'Notebook',name:'Notebook Ide Harian',price:'39000',audience:'Mahasiswa yang mencari buku untuk mencatat ide dan materi kuliah'}
      };
      const category=q('#ll-category'),customCategory=q('#ll-custom-category');
      let previousTemplate=productTemplates.tote;
      category.addEventListener('change',()=>{
        const custom=category.value==='custom';
        const next=productTemplates[category.value]||{name:'',price:'',audience:''};
        q('#ll-custom-category-field').hidden=!custom;
        customCategory.disabled=!custom;customCategory.required=custom;
        customCategory.setCustomValidity('');
        for(const [selector,key] of [['#ll-product','name'],['#ll-campaign-price','price'],['#ll-audience','audience']]){
          const field=q(selector);
          if(field.value===''||field.value===previousTemplate[key])field.value=next[key];
        }
        previousTemplate=next;
        q('#ll-product-hint').textContent=custom
          ?'Isi kategori, nama produk, harga, dan sasaran pembelimu sendiri.'
          :'Contoh kategori '+next.label+'. Semua nilai bisa diedit; harga bukan hasil riset pasar.';
        q('#ll-form-feedback').textContent='';
      });
      customCategory.addEventListener('input',()=>customCategory.setCustomValidity(''));
      q('#ll-campaign-form').addEventListener('submit',event=>{
        event.preventDefault();
        if(category.value==='custom'&&!customCategory.value.trim()){
          customCategory.setCustomValidity('Isi nama kategori produk.');customCategory.reportValidity();return;
        }
        const name=new FormData(event.currentTarget).get('product');
        const label=category.value==='custom'?customCategory.value.trim():productTemplates[category.value].label;
        q('#ll-form-feedback').textContent='Rancangan “'+name+'” ('+label+') siap ditinjau. Ini contoh tampilan, belum dipublikasikan.';
      });
      const currency=v=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v);
      function calc(){
        const ids=['qty','sold','cost','price','fixed'];
        const values=ids.map(id=>Number(q('#ll-'+id).value));
        if(values.some(v=>!Number.isFinite(v)||v<0)||!Number.isInteger(values[0])||values[0]<1||!Number.isInteger(values[1])){q('#ll-sim-status').textContent='Masukkan jumlah unit bulat dan biaya minimal nol.';return;}
        const [qty,sold,cost,price,fixed]=values;q('#ll-sold').max=String(qty);
        if(sold>qty){q('#ll-sim-status').textContent='Skenario terjual tidak boleh melebihi jumlah produksi.';return;}
        const total=qty*cost+fixed,receipts=sold*price;
        q('#ll-capital').textContent=currency(total);q('#ll-stock').textContent=(qty-sold)+' unit';q('#ll-receipts').textContent=currency(receipts);q('#ll-surplus').textContent=currency(receipts-total);q('#ll-sim-status').textContent='Skenario diperbarui.';
      }
      qa('[data-view="simulasi"] input').forEach(el=>el.addEventListener('input',calc));
      function motion(){
        if(reduced||!window.gsap)return;
        const g=window.gsap;
        g.from(q('.ll-hero-copy').children,{y:20,opacity:0,duration:.75,stagger:.1,ease:'power3.out',clearProps:'transform,opacity'});
        g.from(qa('.ll-art-scene>div'),{y:25,opacity:0,scale:.93,duration:.95,stagger:.12,delay:.25,ease:'back.out(1.1)',clearProps:'opacity,scale'});
        const art=q('.ll-art');
        const targets=qa('[data-depth]').map(el=>({el,x:g.quickTo(el,'x',{duration:.9,ease:'power3.out'}),y:g.quickTo(el,'y',{duration:.9,ease:'power3.out'})}));
        art.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=art.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;targets.forEach(t=>{const z=Number(t.el.dataset.depth);t.x(x*15*z);t.y(y*12*z);});});
        art.addEventListener('pointerleave',()=>targets.forEach(t=>{t.x(0);t.y(0);}));
        if(window.ScrollTrigger){g.registerPlugin(window.ScrollTrigger);g.to(q('.ll-orbit-ring'),{y:38,rotation:25,ease:'none',scrollTrigger:{trigger:q('.ll-hero'),start:'top top',end:'bottom top',scrub:1}});g.from(q('.ll-bottom-banner'),{y:30,opacity:.4,duration:.8,scrollTrigger:{trigger:q('.ll-bottom-banner'),start:'top 95%',once:true},clearProps:'opacity,transform'});}
      }
      motion();
    })();
  
