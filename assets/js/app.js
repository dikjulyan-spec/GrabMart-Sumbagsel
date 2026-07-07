const GS_API='https://script.google.com/macros/s/AKfycbwqcXVXjSyCwHnbN9AYKsH8pYT3xkGw6AoR_G6JGMTu0D27qpUkXntHEDFFVMPgNlF0/exec';
const navShell=document.querySelector('.nav-shell');
const menuBtn=document.querySelector('[data-menu-btn]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
window.addEventListener('scroll',()=>{navShell?.classList.toggle('scrolled',window.scrollY>24)});
if(menuBtn){menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('open'));}
document.querySelectorAll('[data-close-menu]').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
function trackDaftar(source){if(typeof gtag!=='undefined')gtag('event','click_daftar',{event_category:'CTA',event_label:source});}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function safeUrl(url){const u=String(url||'').trim();return /^https:\/\//i.test(u)?u:'#';}
function short(v,n=80){v=String(v??'');return v.length>n?v.slice(0,n-1)+'…':v;}

const slider=document.querySelector('[data-slider]');
document.querySelector('[data-slide-prev]')?.addEventListener('click',()=>slider?.scrollBy({left:-310,behavior:'smooth'}));
document.querySelector('[data-slide-next]')?.addEventListener('click',()=>slider?.scrollBy({left:310,behavior:'smooth'}));

async function fetchSheet(sheet){
  const res=await fetch(GS_API+'?sheet='+encodeURIComponent(sheet),{cache:'no-store'});
  if(!res.ok) throw new Error('network');
  const data=await res.json();
  if(!Array.isArray(data)) throw new Error('bad-data');
  return data;
}
function merchantFallback(){
  return [
    {nama_toko:'Merchant baru GrabMart',lokasi:'Palembang',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''},
    {nama_toko:'Toko siap go digital',lokasi:'Lampung',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''},
    {nama_toko:'Mitra GrabMart Sumbagsel',lokasi:'Jambi',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''},
    {nama_toko:'Bergabung sekarang',lokasi:'Bengkulu',tanggal:'Aktif',link_toko:'https://grb.to/PendaftaranGM',screenshot:''}
  ];
}
function renderMerchantBaru(rows){
  const box=document.getElementById('merchant-baru-container');
  if(!box)return;
  const aktif=rows.filter(x=>String(x.status||'aktif').toLowerCase()==='aktif').slice(0,12);
  const data=aktif.length?aktif:merchantFallback();
  box.innerHTML=data.map(m=>{
    const img=m.screenshot?`<img src="${esc(safeUrl(m.screenshot))}" alt="${esc(m.nama_toko||'Merchant GrabMart')}" loading="lazy" onerror="this.style.display='none'">`:'';
    return `<a class="merchant-card" href="${esc(safeUrl(m.link_toko||'https://grb.to/PendaftaranGM'))}" target="_blank" onclick="trackDaftar('merchant-baru-card')">
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
    <div class="stars">★★★★★</div>
    <p class="quote">“${esc(short(t.kutipan||t.jawaban||'Pengalaman merchant akan ditampilkan di sini.',170))}”</p>
    <div class="testi-person"><div class="avatar">${esc(String(t.nama||'G').charAt(0).toUpperCase())}</div><div><strong>${esc(t.nama||'Merchant GrabMart')}</strong><span>${esc(t.lokasi||'Sumbagsel')}${t.kategori?' · '+esc(t.kategori):''}</span></div></div>
  </article>`).join('');
}
async function initDynamicSections(){
  try{renderMerchantBaru(await fetchSheet('merchant_baru'));}catch(e){renderMerchantBaru([]);}
  try{renderTestimonials(await fetchSheet('merchant'));}catch(e){renderTestimonials([]);}
}
initDynamicSections();
