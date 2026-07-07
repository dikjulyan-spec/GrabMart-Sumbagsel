const navShell=document.querySelector('.nav-shell');
const menuBtn=document.querySelector('[data-menu-btn]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
window.addEventListener('scroll',()=>{navShell.classList.toggle('scrolled',window.scrollY>24)});
if(menuBtn){menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('open'));}
document.querySelectorAll('[data-close-menu]').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
function trackDaftar(source){if(typeof gtag!=='undefined')gtag('event','click_daftar',{event_category:'CTA',event_label:source});}
