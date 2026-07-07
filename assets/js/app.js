const GS_API='https://script.google.com/macros/s/AKfycbwqcXVXjSyCwHnbN9AYKsH8pYT3xkGw6AoR_G6JGMTu0D27qpUkXntHEDFFVMPgNlF0/exec';
const CACHE_TTL=1000*60*4;
const navShell=document.querySelector('.nav-shell');
const menuBtn=document.querySelector('[data-menu-btn]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
const progress=document.querySelector('[data-scroll-progress]');
let ticking=false;

function onScroll(){
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{
    const y=window.scrollY||document.documentElement.scrollTop;
    navShell?.classList.toggle('scrolled',y>24);
    if(progress){
      const doc=document.documentElement;
      const max=Math.max(1,doc.scrollHeight-doc.clientHeight);
      progress.style.width=Math.min(100,Math.max(0,(y/max)*100))+'%';
    }
    ticking=false;
  });
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

if(menuBtn){menuBtn.addEventListener('click',()=>mobileMenu?.classList.toggle('open'));}
document.querySelectorAll('[data-close-menu]').forEach(a=>a.addEventListener('click',()=>mobileMenu?.classList.remove('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')mobileMenu?.classList.remove('open');});
document.addEventListener('click',e=>{if(!mobileMenu?.classList.contains('open'))return;if(!mobileMenu.contains(e.target)&&!menuBtn?.contains(e.target))mobileMenu.classList.remove('open');});

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target);}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('show'));
}

function trackDaftar(source){if(typeof gtag!=='undefined')gtag('event','click_daftar',{event_category:'CTA',event_label:source});}
window.trackDaftar=trackDaftar;
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function safeUrl(url){const u=String(url||'').trim();return /^https:\/\//i.test(u)?u:'#';}
function short(v,n=80){v=String(v??'');return v.length>n?v.slice(0,n-1)+'…':v;}
function cacheKey(sheet){return 'grabmart_sheet_'+sheet;}
function readCache(sheet){try{const raw=sessionStorage.getItem(cacheKey(sheet));if(!raw)return null;const cached=JSON.parse(raw);if(Date.now()-cached.time>CACHE_TTL)return null;return cached.data;}catch(e){return null;}}
function writeCache(sheet,data){try{sessionStorage.setItem(cacheKey(sheet),JSON.stringify({time:Date.now(),data}));}catch(e){}}

const slider=document.querySelector('[data-slider]');
document.querySelector('[data-slide-prev]')?.addEventListener('click',()=>slider?.scrollBy({left:-330,behavior:'smooth'}));
document.querySelector('[data-slide-next]')?.addEventListener('click',()=>slider?.scrollBy({left:330,behavior:'smooth'}));
if(slider){
  let autoTimer;
  const startAuto=()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;stopAuto();autoTimer=setInterval(()=>{const max=slider.scrollWidth-slider.clientWidth;if(max<=0)return;if(slider.scrollLeft>=max-10)slider.scrollTo({left:0,behavior:'smooth'});else slider.scrollBy({left:310,behavior:'smooth'});},5200);};
  const stopAuto=()=>{if(autoTimer)clearInterval(autoTimer);};
  slider.addEventListener('pointerenter',stopAuto);
  slider.addEventListener('pointerleave',startAuto);
  slider.addEventListener('focusin',stopAuto);
  slider.addEventListener('focusout',startAuto);
  startAuto();
}

async function fetchSheet(sheet){
  const cached=readCache(sheet);
  if(cached)return cached;
  const res=await fetch(GS_API+'?sheet='+encodeURIComponent(sheet),{cache:'no-store'});
  if(!res.ok) throw new Error('network');
  const data=await res.json();
  if(!Array.isArray(data)) throw new Error('bad-data');
  writeCache(sheet,data);
  return data;
}
function merchantFallback(){return [
  {nama_toko:'Merchant baru GrabMart',lokasi:'Palembang',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''},
  {nama_toko:'Toko siap go digital',lokasi:'Lampung',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''},
  {nama_toko:'Mitra GrabMart Sumbagsel',lokasi:'Jambi',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''},
  {nama_toko:'Bergabung sekarang',lokasi:'Bengkulu',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''}
];}
function renderMerchantBaru(rows){
  const box=document.getElementById('merchant-baru-container');
  if(!box)return;
  const aktif=rows.filter(x=>String(x.status||'aktif').toLowerCase()==='aktif').slice(0,12);
  const data=aktif.length?aktif:merchantFallback();
  box.innerHTML=data.map((m,i)=>{
    const img=m.screenshot?`<img src="${esc(safeUrl(m.screenshot))}" alt="${esc(m.nama_toko||'Merchant GrabMart')}" loading="lazy" decoding="async" onerror="this.style.display='none'">`:'';
    return `<a class="merchant-card" href="${esc(safeUrl(m.link_toko||'https://grb.to/PendaftaranGM'))}" target="_blank" rel="noopener" onclick="trackDaftar('merchant-baru-card')" aria-label="Lihat toko ${esc(m.nama_toko||'Merchant GrabMart')}">
      <div class="merchant-shot"><span class="merchant-badge">Baru Aktif</span>${img}</div>
      <div class="merchant-info"><h3>${esc(short(m.nama_toko||m.nama||'Merchant GrabMart',48))}</h3><p>${esc(m.lokasi||'Sumbagsel')} ${m.tanggal?'· '+esc(m.tanggal):''}</p><div class="merchant-link">Lihat Toko</div></div>
    </a>`;
  }).join('');
}
function renderTestimonials(rows){
  const box=document.getElementById('merchant-container');
  if(!box)return;
  const tampil=rows.filter(x=>String(x.status||'tampil').toLowerCase()==='tampil').slice(0,3);
  const data=tampil.length?tampil:[
    {nama:'Rizal Bumbu',lokasi:'Merchant GrabMart',kategori:'Pasar & Bumbu',kutipan:'Setelah toko masuk kanal online, pelanggan jadi lebih mudah menemukan produk dan proses pesanan lebih teratur.'},
    {nama:'Toko MB Dita',lokasi:'Merchant GrabMart',kategori:'Kebutuhan Harian',kutipan:'Platform digital membantu toko menjangkau pembeli tanpa harus menunggu pelanggan datang langsung.'},
    {nama:'Merchant Sumbagsel',lokasi:'Palembang',kategori:'Grocery',kutipan:'Onboarding yang jelas membuat proses pendaftaran lebih mudah dipahami dari awal sampai toko siap aktif.'}
  ];
  box.innerHTML=data.map(t=>`<article class="testi-card">
    <div class="stars" aria-label="Rating 5 dari 5">★★★★★</div>
    <p class="quote">“${esc(short(t.kutipan||t.jawaban||'Pengalaman merchant akan ditampilkan di sini.',170))}”</p>
    <div class="testi-person"><div class="avatar" aria-hidden="true">${esc(String(t.nama||'G').charAt(0).toUpperCase())}</div><div><strong>${esc(t.nama||'Merchant GrabMart')}</strong><span>${esc(t.lokasi||'Sumbagsel')}${t.kategori?' · '+esc(t.kategori):''}</span></div></div>
  </article>`).join('');
}

let cachedFaqRows=[];
function faqFallback(){return [
  {pertanyaan:'Apakah pendaftaran GrabMart berbayar?',jawaban:'Pendaftaran merchant tidak dikenakan biaya pendaftaran. Tetap waspada terhadap pihak yang meminta transfer biaya pendaftaran.',status:'tampil'},
  {pertanyaan:'Berapa lama toko bisa aktif?',jawaban:'Estimasi toko aktif sekitar 3-10 hari kerja setelah data dan dokumen lengkap, mengikuti proses verifikasi dan onboarding.',status:'tampil'},
  {pertanyaan:'Dokumen apa saja yang perlu disiapkan?',jawaban:'Umumnya KTP pemilik, selfie KTP, foto luar toko, foto dalam toko, rekening bank, serta daftar produk dan harga.',status:'tampil'},
  {pertanyaan:'Wilayah mana saja yang dibantu?',jawaban:'Wilayah Sumbagsel meliputi Palembang, Bandar Lampung, Jambi, Bengkulu, dan Pangkal Pinang.',status:'tampil'},
  {pertanyaan:'Apakah saya bisa tanya dulu sebelum daftar?',jawaban:'Bisa. Pilih kontak kota pada bagian Kontak Wilayah untuk chat WhatsApp dengan tim yang sesuai.',status:'tampil'}
];}
function renderFaq(rows,query=''){
  const box=document.getElementById('faq-container');
  if(!box)return;
  const source=(rows&&rows.length?rows:faqFallback()).filter(x=>String(x.status||'tampil').toLowerCase()==='tampil');
  cachedFaqRows=source;
  const q=String(query||'').toLowerCase().trim();
  const data=q?source.filter(f=>(String(f.pertanyaan||'')+' '+String(f.jawaban||'')).toLowerCase().includes(q)):source;
  if(!data.length){box.innerHTML='<div class="faq-empty">Belum ada FAQ yang cocok dengan pencarian tersebut.</div>';return;}
  box.innerHTML=data.map((f,i)=>`<details ${i===0?'open':''}><summary>${esc(f.pertanyaan||'Pertanyaan GrabMart')}</summary><p>${esc(f.jawaban||'Jawaban akan ditampilkan di sini.')}</p></details>`).join('');
}
function kontakFallback(){return [
  {kota:'Palembang',wa:'6281282102509',pesan:'Halo kak, saya mau daftar jadi merchant GrabMart di Palembang. Bisa bantu prosesnya?'},
  {kota:'Lampung',wa:'6288902083913',pesan:'Halo kak, saya mau daftar jadi merchant GrabMart di Lampung. Bisa bantu prosesnya?'},
  {kota:'Jambi',wa:'6281278578077',pesan:'Halo kak, saya mau daftar jadi merchant GrabMart di Jambi. Bisa bantu prosesnya?'},
  {kota:'Bengkulu',wa:'62895360938284',pesan:'Halo kak, saya mau daftar jadi merchant GrabMart di Bengkulu. Bisa bantu prosesnya?'},
  {kota:'Pangkal Pinang',wa:'6281282102509',pesan:'Halo kak, saya mau daftar jadi merchant GrabMart di Pangkal Pinang. Bisa bantu prosesnya?'}
];}
function cityIcon(kota){const k=String(kota||'').toLowerCase();if(k.includes('palembang'))return '🏙️';if(k.includes('lampung'))return '🌊';if(k.includes('jambi'))return '🌿';if(k.includes('bengkulu'))return '🌺';if(k.includes('pangkal')||k.includes('pinang')||k.includes('bangka'))return '🏝️';return '📍';}
function normalizeWa(v){return String(v||'6281282102509').replace(/\D/g,'');}
function renderKontak(rows){
  const box=document.getElementById('kontak-container');
  if(!box)return;
  const source=(rows&&rows.length?rows:kontakFallback()).filter(x=>String(x.status||'aktif').toLowerCase()!=='nonaktif').slice(0,8);
  const data=source.length?source:kontakFallback();
  box.innerHTML=data.map(k=>{
    const kota=k.kota||k.nama||'Sumbagsel';
    const wa=normalizeWa(k.wa||k.whatsapp||k.nomor||k.phone);
    const pesan=k.pesan||`Halo kak, saya mau daftar jadi merchant GrabMart di ${kota}. Bisa bantu prosesnya?`;
    return `<article class="contact-card"><div class="city-icon" aria-hidden="true">${cityIcon(kota)}</div><h3>${esc(kota)}</h3><p>Chat tim wilayah untuk tanya alur daftar, dokumen, dan proses onboarding GrabMart.</p><a href="https://wa.me/${esc(wa)}?text=${encodeURIComponent(pesan)}" target="_blank" rel="noopener" onclick="trackDaftar('kontak-${esc(kota)}')">Chat WhatsApp</a></article>`;
  }).join('');
}

document.addEventListener('input',e=>{if(e.target&&e.target.matches('[data-faq-search]'))renderFaq(cachedFaqRows,e.target.value);});

async function initDynamicSections(){
  const tasks=[
    fetchSheet('merchant_baru').then(renderMerchantBaru).catch(()=>renderMerchantBaru([])),
    fetchSheet('merchant').then(renderTestimonials).catch(()=>renderTestimonials([])),
    fetchSheet('faq').then(renderFaq).catch(()=>renderFaq([])),
    fetchSheet('kontak').then(renderKontak).catch(()=>renderKontak([]))
  ];
  await Promise.allSettled(tasks);
}
initDynamicSections();
