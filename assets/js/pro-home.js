const GS_API='https://script.google.com/macros/s/AKfycbwJFr2K3kaigoVYs5PwxhriPQih8FZYtGaJeV7B_P6jvUsAE_tl4NchdgPZGijBefou/exec';
const CACHE_TTL=1000*60*4;

function trackDaftar(source){if(typeof gtag!=='undefined')gtag('event','click_daftar',{event_category:'CTA',event_label:source});}
window.trackDaftar=trackDaftar;

function cleanText(value){return String(value??'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim();}
function esc(value){return cleanText(value).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function safeUrl(url){const u=String(url||'').trim();if(/^https:\/\//i.test(u))return u;if(/^[\w\-./]+\.html(\?.*)?$/i.test(u)||/^#[\w\-]+$/i.test(u))return u;return '#';}
function short(value,n=80){const v=cleanText(value);return v.length>n?v.slice(0,n-1)+'...':v;}
function normalizeWa(v){return String(v||'').replace(/\D/g,'')||'6281282102509';}
function cacheKey(sheet){return 'gm_pro_'+sheet;}
function readCache(sheet){try{const raw=sessionStorage.getItem(cacheKey(sheet));if(!raw)return null;const data=JSON.parse(raw);if(Date.now()-data.time>CACHE_TTL)return null;return data.rows;}catch(e){return null;}}
function writeCache(sheet,rows){try{sessionStorage.setItem(cacheKey(sheet),JSON.stringify({time:Date.now(),rows}));}catch(e){}}
async function fetchSheet(sheet){const cached=readCache(sheet);if(cached)return cached;const res=await fetch(GS_API+'?sheet='+encodeURIComponent(sheet),{cache:'no-store'});if(!res.ok)throw new Error('Network error');const rows=await res.json();if(!Array.isArray(rows))throw new Error('Invalid data');writeCache(sheet,rows);return rows;}
function isActive(row,active='aktif'){return String(row?.status||active).toLowerCase().trim()!== 'nonaktif' && String(row?.status||active).toLowerCase().trim()!== 'sembunyi';}

const menuButton=document.getElementById('menuButton');
const mobileMenu=document.getElementById('mobileMenu');
if(menuButton&&mobileMenu){
  menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',open?'true':'false');});
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){mobileMenu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}});
}

function merchantFallback(){return [
  {nama_toko:'Merchant GrabMart Sumbagsel',lokasi:'Palembang',tanggal:'Baru aktif',link_toko:'daftar.html',screenshot:''},
  {nama_toko:'Toko siap onboarding',lokasi:'Lampung',tanggal:'Baru aktif',link_toko:'daftar.html',screenshot:''},
  {nama_toko:'Mitra GrabMart baru',lokasi:'Jambi',tanggal:'Baru aktif',link_toko:'daftar.html',screenshot:''},
  {nama_toko:'Toko kebutuhan harian',lokasi:'Bengkulu',tanggal:'Baru aktif',link_toko:'daftar.html',screenshot:''}
];}
function renderMerchants(rows){
  const box=document.getElementById('merchantContainer');if(!box)return;
  const data=(Array.isArray(rows)?rows:[]).filter(r=>isActive(r,'aktif')).slice(0,14);
  const list=data.length?data:merchantFallback();
  box.innerHTML=list.map(m=>{
    const img=m.screenshot?`<img src="${safeUrl(m.screenshot)}" alt="${esc(m.nama_toko||'Merchant GrabMart')}" loading="lazy" decoding="async" onerror="this.style.display='none'">`:'';
    return `<a class="merchant-card" href="${safeUrl(m.link_toko||'daftar.html')}" target="_blank" rel="noopener" onclick="trackDaftar('merchant-card')"><div class="merchant-shot"><span class="merchant-badge">Baru Aktif</span>${img}</div><div class="merchant-info"><h3>${esc(short(m.nama_toko||m.nama||'Merchant GrabMart',46))}</h3><p>${esc(m.lokasi||'Sumbagsel')} ${m.tanggal?' - '+esc(m.tanggal):''}</p><div class="merchant-link">Lihat Toko</div></div></a>`;
  }).join('');
}

function faqFallback(){return [
  {pertanyaan:'Apakah pendaftaran GrabMart berbayar?',jawaban:'Pendaftaran tidak dikenakan biaya pendaftaran. Jangan melakukan transfer biaya pendaftaran ke pihak mana pun.',status:'tampil'},
  {pertanyaan:'Apakah data pendaftaran langsung masuk ke tim?',jawaban:'Ya. Form internal menyimpan data ke Google Sheet dan mengirim email ke PIC kota yang sesuai.',status:'tampil'},
  {pertanyaan:'Dokumen apa saja yang perlu disiapkan?',jawaban:'Siapkan KTP, foto toko, data rekening, daftar produk dan harga, serta titik lokasi toko.',status:'tampil'},
  {pertanyaan:'Wilayah mana saja yang dibantu?',jawaban:'Palembang, Lampung, Jambi, Bengkulu, dan Pangkal Pinang.',status:'tampil'}
];}
function renderFaq(rows){
  const box=document.getElementById('faqContainer');if(!box)return;
  const data=(Array.isArray(rows)?rows:[]).filter(r=>isActive(r,'tampil')).slice(0,8);
  const list=data.length?data:faqFallback();
  box.innerHTML=list.map((f,i)=>`<details ${i===0?'open':''}><summary>${esc(f.pertanyaan||'Pertanyaan GrabMart')}</summary><p>${esc(f.jawaban||'Jawaban akan tersedia di sini.')}</p></details>`).join('');
}
function contactFallback(){return [
  {kota:'Palembang',wa:'6281282102509',pesan:'Halo, saya mau tanya daftar GrabMart Palembang.'},
  {kota:'Lampung',wa:'6288902083913',pesan:'Halo, saya mau tanya daftar GrabMart Lampung.'},
  {kota:'Jambi',wa:'6281278578077',pesan:'Halo, saya mau tanya daftar GrabMart Jambi.'},
  {kota:'Bengkulu',wa:'62895360938284',pesan:'Halo, saya mau tanya daftar GrabMart Bengkulu.'},
  {kota:'Pangkal Pinang',wa:'6281282102509',pesan:'Halo, saya mau tanya daftar GrabMart Pangkal Pinang.'}
];}
function renderContacts(rows){
  const box=document.getElementById('contactContainer');if(!box)return;
  const data=(Array.isArray(rows)?rows:[]).filter(r=>isActive(r,'aktif')).slice(0,8);
  const list=data.length?data:contactFallback();
  box.innerHTML=list.map(k=>{const kota=k.kota||'Sumbagsel';const wa=normalizeWa(k.wa||k.nomor||k.phone);const pesan=k.pesan||`Halo, saya mau tanya daftar GrabMart ${kota}.`;return `<article class="contact-card"><h3>${esc(kota)}</h3><p>Hubungi tim wilayah untuk koordinasi alur pendaftaran dan follow-up merchant.</p><a href="https://wa.me/${wa}?text=${encodeURIComponent(pesan)}" target="_blank" rel="noopener">Chat WhatsApp</a></article>`;}).join('');
}
function renderTopbar(rows){
  const el=document.getElementById('topbarText');if(!el)return;
  const active=(Array.isArray(rows)?rows:[]).filter(r=>isActive(r,'aktif'));
  if(!active.length)return;
  let index=0;
  const apply=()=>{const item=active[index%active.length];el.textContent=short(item.teks||item.judul||'Daftar GrabMart gratis - data masuk ke tim PIC kota.',120);el.href=safeUrl(item.link||'daftar.html');index++;};
  apply();if(active.length>1)setInterval(apply,4200);
}

const slider=document.getElementById('merchantContainer');
document.getElementById('merchantPrev')?.addEventListener('click',()=>slider?.scrollBy({left:-320,behavior:'smooth'}));
document.getElementById('merchantNext')?.addEventListener('click',()=>slider?.scrollBy({left:320,behavior:'smooth'}));

Promise.allSettled([
  fetchSheet('merchant_baru').then(renderMerchants).catch(()=>renderMerchants([])),
  fetchSheet('faq').then(renderFaq).catch(()=>renderFaq([])),
  fetchSheet('kontak').then(renderContacts).catch(()=>renderContacts([])),
  fetchSheet('pengumuman').then(renderTopbar).catch(()=>{})
]);

// guard for old cached mojibake text from prior versions
function removeMojibake(){
  const bad=/[\u9200-\u9FFF]|\uFFFD|鈥|�/g;
  document.querySelectorAll('body *').forEach(node=>{
    node.childNodes.forEach(child=>{if(child.nodeType===3&&bad.test(child.textContent||'')){child.textContent=(child.textContent||'').replace(bad,'').trim();}});
  });
}
setTimeout(removeMojibake,400);
