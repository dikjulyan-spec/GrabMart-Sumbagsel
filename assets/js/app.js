const GS_API =
  "https://script.google.com/macros/s/AKfycbwJFr2K3kaigoVYs5PwxhriPQih8FZYtGaJeV7B_P6jvUsAE_tl4NchdgPZGijBefou/exec";
const CACHE_TTL = 1000 * 60 * 4;
const navShell = document.querySelector(".nav-shell");
const menuBtn = document.querySelector("[data-menu-btn]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const progress = document.querySelector("[data-scroll-progress]");
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY || document.documentElement.scrollTop;
    navShell?.classList.toggle("scrolled", y > 24);
    if (progress) {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      progress.style.width = Math.min(100, Math.max(0, (y / max) * 100)) + "%";
    }
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (menuBtn) {
  menuBtn.addEventListener("click", () => mobileMenu?.classList.toggle("open"));
}
document
  .querySelectorAll("[data-close-menu]")
  .forEach((a) =>
    a.addEventListener("click", () => mobileMenu?.classList.remove("open"))
  );
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") mobileMenu?.classList.remove("open");
});
document.addEventListener("click", (e) => {
  if (!mobileMenu?.classList.contains("open")) return;
  if (!mobileMenu.contains(e.target) && !menuBtn?.contains(e.target))
    mobileMenu.classList.remove("open");
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("show"));
}

function trackDaftar(source) {
  if (typeof gtag !== "undefined")
    gtag("event", "click_daftar", {
      event_category: "CTA",
      event_label: source,
    });
}
window.trackDaftar = trackDaftar;
function esc(v) {
  return String(v ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}
function escAttr(v) {
  return esc(v);
}
function safeUrl(url) {
  const u = String(url || "").trim();
  if (/^https:\/\//i.test(u)) return u;
  if (/^(daftar|index|privacy|terms|404)[\w\-.]*\.html(\?.*)?$/i.test(u))
    return u;
  return "#";
}
function short(v, n = 80) {
  v = String(v ?? "");
  return v.length > n ? v.slice(0, n - 1) + "…" : v;
}
function cacheKey(sheet) {
  return "grabmart_sheet_" + sheet;
}
function readCache(sheet) {
  try {
    const raw = sessionStorage.getItem(cacheKey(sheet));
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.time > CACHE_TTL) return null;
    return cached.data;
  } catch (e) {
    return null;
  }
}
function writeCache(sheet, data) {
  try {
    sessionStorage.setItem(
      cacheKey(sheet),
      JSON.stringify({ time: Date.now(), data })
    );
  } catch (e) {}
}

const slider = document.querySelector("[data-slider]");
document
  .querySelector("[data-slide-prev]")
  ?.addEventListener("click", () =>
    slider?.scrollBy({ left: -330, behavior: "smooth" })
  );
document
  .querySelector("[data-slide-next]")
  ?.addEventListener("click", () =>
    slider?.scrollBy({ left: 330, behavior: "smooth" })
  );
if (slider) {
  let autoTimer;
  const startAuto = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopAuto();
    autoTimer = setInterval(() => {
      const max = slider.scrollWidth - slider.clientWidth;
      if (max <= 0) return;
      if (slider.scrollLeft >= max - 10)
        slider.scrollTo({ left: 0, behavior: "smooth" });
      else slider.scrollBy({ left: 310, behavior: "smooth" });
    }, 5200);
  };
  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
  };
  slider.addEventListener("pointerenter", stopAuto);
  slider.addEventListener("pointerleave", startAuto);
  slider.addEventListener("focusin", stopAuto);
  slider.addEventListener("focusout", startAuto);
  startAuto();
}

async function fetchSheet(sheet) {
  const cached = readCache(sheet);
  if (cached) return cached;
  const res = await fetch(GS_API + "?sheet=" + encodeURIComponent(sheet), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("network");
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("bad-data");
  writeCache(sheet, data);
  return data;
}
function merchantFallback() {
  return [
    {
      nama_toko: "Merchant baru GrabMart",
      lokasi: "Palembang",
      tanggal: "Aktif",
      link_toko: "https://mitrasumbagsel.com/daftar.html",
      screenshot: "",
    },
    {
      nama_toko: "Toko siap go digital",
      lokasi: "Lampung",
      tanggal: "Aktif",
      link_toko: "https://mitrasumbagsel.com/daftar.html",
      screenshot: "",
    },
    {
      nama_toko: "Mitra GrabMart Sumbagsel",
      lokasi: "Jambi",
      tanggal: "Aktif",
      link_toko: "https://mitrasumbagsel.com/daftar.html",
      screenshot: "",
    },
    {
      nama_toko: "Bergabung sekarang",
      lokasi: "Bengkulu",
      tanggal: "Aktif",
      link_toko: "https://mitrasumbagsel.com/daftar.html",
      screenshot: "",
    },
  ];
}
function renderMerchantBaru(rows) {
  const box = document.getElementById("merchant-baru-container");
  if (!box) return;
  const aktif = rows
    .filter((x) => String(x.status || "aktif").toLowerCase() === "aktif")
    .slice(0, 12);
  const data = aktif.length ? aktif : merchantFallback();
  box.innerHTML = data
    .map((m, i) => {
      const img = m.screenshot
        ? `<img src="${esc(safeUrl(m.screenshot))}" alt="${esc( m.nama_toko || "Merchant GrabMart" )}" loading="lazy" decoding="async" onerror="this.style.display='none'">`
        : "";
      return `<a class="merchant-card" href="${esc( safeUrl(m.link_toko || "https://mitrasumbagsel.com/daftar.html") )}" target="_blank" rel="noopener" onclick="trackDaftar('merchant-baru-card')" aria-label="Lihat toko ${esc( m.nama_toko || "Merchant GrabMart" )}"> <div class="merchant-shot"><span class="merchant-badge">Baru Aktif</span>${img}</div> <div class="merchant-info"><h3>${esc( short(m.nama_toko || m.nama || "Merchant GrabMart", 48) )}</h3><p>${esc(m.lokasi || "Sumbagsel")} ${ m.tanggal ? "· " + esc(m.tanggal) : "" }</p><div class="merchant-link">Lihat Toko</div></div> </a>`;
    })
    .join("");
}
function renderTestimonials(rows) {
  const box = document.getElementById("merchant-container");
  if (!box) return;
  const tampil = rows
    .filter((x) => String(x.status || "tampil").toLowerCase() === "tampil")
    .slice(0, 3);
  const data = tampil.length
    ? tampil
    : [
        {
          nama: "Rizal Bumbu",
          lokasi: "Merchant GrabMart",
          kategori: "Pasar & Bumbu",
          kutipan:
            "Setelah toko masuk kanal online, pelanggan jadi lebih mudah menemukan produk dan proses pesanan lebih teratur.",
        },
        {
          nama: "Toko MB Dita",
          lokasi: "Merchant GrabMart",
          kategori: "Kebutuhan Harian",
          kutipan:
            "Platform digital membantu toko menjangkau pembeli tanpa harus menunggu pelanggan datang langsung.",
        },
        {
          nama: "Merchant Sumbagsel",
          lokasi: "Palembang",
          kategori: "Grocery",
          kutipan:
            "Onboarding yang jelas membuat proses pendaftaran lebih mudah dipahami dari awal sampai toko siap aktif.",
        },
      ];
  box.innerHTML = data
    .map(
      (t) => `<article class="testi-card"> <div class="stars" aria-label="Rating 5 dari 5">★★★★★</div> <p class="quote">“${esc( short( t.kutipan || t.jawaban || "Pengalaman merchant akan ditampilkan di sini.", 170 ) )}”</p> <div class="testi-person"><div class="avatar" aria-hidden="true">${esc( String(t.nama || "G") .charAt(0) .toUpperCase() )}</div><div><strong>${esc( t.nama || "Merchant GrabMart" )}</strong><span>${esc(t.lokasi || "Sumbagsel")}${ t.kategori ? " · " + esc(t.kategori) : "" }</span></div></div> </article>`
    )
    .join("");
}

let cachedFaqRows = [];
function faqFallback() {
  return [
    {
      pertanyaan: "Apakah pendaftaran GrabMart berbayar?",
      jawaban:
        "Pendaftaran merchant tidak dikenakan biaya pendaftaran. Tetap waspada terhadap pihak yang meminta transfer biaya pendaftaran.",
      status: "tampil",
    },
    {
      pertanyaan: "Berapa lama toko bisa aktif?",
      jawaban:
        "Estimasi toko aktif sekitar 3-10 hari kerja setelah data dan dokumen lengkap, mengikuti proses verifikasi dan onboarding.",
      status: "tampil",
    },
    {
      pertanyaan: "Dokumen apa saja yang perlu disiapkan?",
      jawaban:
        "Umumnya KTP pemilik, selfie KTP, foto luar toko, foto dalam toko, rekening bank, serta daftar produk dan harga.",
      status: "tampil",
    },
    {
      pertanyaan: "Wilayah mana saja yang dibantu?",
      jawaban:
        "Wilayah Sumbagsel meliputi Palembang, Bandar Lampung, Jambi, Bengkulu, dan Pangkal Pinang.",
      status: "tampil",
    },
    {
      pertanyaan: "Apakah saya bisa tanya dulu sebelum daftar?",
      jawaban:
        "Bisa. Pilih kontak kota pada bagian Kontak Wilayah untuk chat WhatsApp dengan tim yang sesuai.",
      status: "tampil",
    },
  ];
}
function renderFaq(rows, query = "") {
  const box = document.getElementById("faq-container");
  if (!box) return;
  const source = (rows && rows.length ? rows : faqFallback()).filter(
    (x) => String(x.status || "tampil").toLowerCase() === "tampil"
  );
  cachedFaqRows = source;
  const q = String(query || "")
    .toLowerCase()
    .trim();
  const data = q
    ? source.filter((f) =>
        (String(f.pertanyaan || "") + " " + String(f.jawaban || ""))
          .toLowerCase()
          .includes(q)
      )
    : source;
  if (!data.length) {
    box.innerHTML =
      '<div class="faq-empty">Belum ada FAQ yang cocok dengan pencarian tersebut.</div>';
    return;
  }
  box.innerHTML = data
    .map(
      (f, i) =>
        `<details ${i === 0 ? "open" : ""}><summary>${esc( f.pertanyaan || "Pertanyaan GrabMart" )}</summary><p>${esc( f.jawaban || "Jawaban akan ditampilkan di sini." )}</p></details>`
    )
    .join("");
}
function kontakFallback() {
  return [
    {
      kota: "Palembang",
      wa: "6281282102509",
      pesan:
        "Halo kak, saya mau daftar jadi merchant GrabMart di Palembang. Bisa bantu prosesnya?",
    },
    {
      kota: "Lampung",
      wa: "6288902083913",
      pesan:
        "Halo kak, saya mau daftar jadi merchant GrabMart di Lampung. Bisa bantu prosesnya?",
    },
    {
      kota: "Jambi",
      wa: "6281278578077",
      pesan:
        "Halo kak, saya mau daftar jadi merchant GrabMart di Jambi. Bisa bantu prosesnya?",
    },
    {
      kota: "Bengkulu",
      wa: "62895360938284",
      pesan:
        "Halo kak, saya mau daftar jadi merchant GrabMart di Bengkulu. Bisa bantu prosesnya?",
    },
    {
      kota: "Pangkal Pinang",
      wa: "6281282102509",
      pesan:
        "Halo kak, saya mau daftar jadi merchant GrabMart di Pangkal Pinang. Bisa bantu prosesnya?",
    },
  ];
}
function cityIcon(kota) {
  const k = String(kota || "").toLowerCase();
  if (k.includes("palembang")) return "🏙️";
  if (k.includes("lampung")) return "🌊";
  if (k.includes("jambi")) return "🌿";
  if (k.includes("bengkulu")) return "🌺";
  if (k.includes("pangkal") || k.includes("pinang") || k.includes("bangka"))
    return "🏝️";
  return "📍";
}
function normalizeWa(v) {
  return String(v || "6281282102509").replace(/\D/g, "");
}
function renderKontak(rows) {
  const box = document.getElementById("kontak-container");
  if (!box) return;
  const source = (rows && rows.length ? rows : kontakFallback())
    .filter((x) => String(x.status || "aktif").toLowerCase() !== "nonaktif")
    .slice(0, 8);
  const data = source.length ? source : kontakFallback();
  box.innerHTML = data
    .map((k) => {
      const kota = k.kota || k.nama || "Sumbagsel";
      const wa = normalizeWa(k.wa || k.whatsapp || k.nomor || k.phone);
      const pesan =
        k.pesan ||
        `Halo kak, saya mau daftar jadi merchant GrabMart di ${kota}. Bisa bantu prosesnya?`;
      return `<article class="contact-card"><div class="city-icon" aria-hidden="true">${cityIcon( kota )}</div><h3>${esc( kota )}</h3><p>Chat tim wilayah untuk tanya alur daftar, dokumen, dan proses onboarding GrabMart.</p><a href="https://wa.me/${esc( wa )}?text=${encodeURIComponent( pesan )}" target="_blank" rel="noopener" onclick="trackDaftar('kontak-${esc( kota )}')">Chat WhatsApp</a></article>`;
    })
    .join("");
}

document.addEventListener("input", (e) => {
  if (e.target && e.target.matches("[data-faq-search]"))
    renderFaq(cachedFaqRows, e.target.value);
});

async function initDynamicSections() {
  const tasks = [
    fetchSheet("merchant_baru")
      .then(renderMerchantBaru)
      .catch(() => renderMerchantBaru([])),
    fetchSheet("merchant")
      .then(renderTestimonials)
      .catch(() => renderTestimonials([])),
    fetchSheet("faq")
      .then(renderFaq)
      .catch(() => renderFaq([])),
    fetchSheet("kontak")
      .then(renderKontak)
      .catch(() => renderKontak([])),
  ];
  await Promise.allSettled(tasks);
}
initDynamicSections();

// Step 6 - announcement bar, WhatsApp quick hub, and back-to-top helper
function activeRows(rows, field = "status") {
  const ok = new Set([
    "",
    "aktif",
    "active",
    "tampil",
    "show",
    "publish",
    "published",
  ]);
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    ok.has(
      String(row?.[field] ?? "aktif")
        .trim()
        .toLowerCase()
    )
  );
}
function createAnnouncement(rows) {
  const items = activeRows(rows).slice(0, 8);
  if (
    !items.length ||
    sessionStorage.getItem("grabmart_announcement_closed") === "1"
  )
    return;
  const existing = document.querySelector(".announcement-wrap");
  const wrap = existing || document.createElement("div");
  wrap.className = "announcement-wrap announcement-slider-wrap";
  const slides = items
    .map((item, i) => {
      const text = esc(
        item.teks ||
          item.judul ||
          item.pesan ||
          "Informasi terbaru GrabMart Sumbagsel"
      );
      const btn = esc(item.btn || item.tombol || "Lihat Info");
      const link = safeUrl(
        item.link || "https://mitrasumbagsel.com/daftar.html"
      );
      const banner = safeUrl(
        item.banner || item.gambar || item.image || item.foto || ""
      );
      const hasBanner = banner && banner !== "#";
      const bg = hasBanner
        ? ` style="background-image:url('${escAttr(banner)}')"`
        : "";
      return `<a class="announcement-slide ${hasBanner ? "has-banner" : ""} ${ i === 0 ? "is-active" : "" }" data-announcement-slide href="${escAttr( link )}" target="_blank" rel="noopener noreferrer" aria-label="${text}"${bg} onclick="trackDaftar('announcement-${ i + 1 }')"><span class="announcement-dot" aria-hidden="true"></span><strong>${text}</strong><em>${btn}</em></a>`;
    })
    .join("");
  const dots =
    items.length > 1
      ? items
          .map(
            (_, i) =>
              `<button class="announcement-dot-btn ${ i === 0 ? "is-active" : "" }" type="button" data-announcement-dot="${i}" aria-label="Tampilkan pengumuman ${ i + 1 }"></button>`
          )
          .join("")
      : "";
  wrap.innerHTML = `<div class="announcement-card announcement-slider" role="region" aria-label="Pengumuman GrabMart"><div class="announcement-viewport">${slides}</div><div class="announcement-controls">${dots}<button class="announcement-close" type="button" aria-label="Tutup pengumuman">×</button></div></div>`;
  const slideEls = [...wrap.querySelectorAll("[data-announcement-slide]")];
  const dotEls = [...wrap.querySelectorAll("[data-announcement-dot]")];
  let current = 0;
  let timer = null;
  const showSlide = (idx) => {
    if (!slideEls.length) return;
    current = (idx + slideEls.length) % slideEls.length;
    slideEls.forEach((el, i) =>
      el.classList.toggle("is-active", i === current)
    );
    dotEls.forEach((el, i) => el.classList.toggle("is-active", i === current));
  };
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  const startTimer = () => {
    stop();
    if (slideEls.length > 1)
      timer = setInterval(() => showSlide(current + 1), 3000);
  };
  dotEls.forEach((dot, i) =>
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showSlide(i);
      startTimer();
    })
  );
  wrap.addEventListener("mouseenter", stop);
  wrap.addEventListener("mouseleave", startTimer);
  wrap.addEventListener("focusin", stop);
  wrap.addEventListener("focusout", startTimer);
  wrap.querySelector(".announcement-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    stop();
    sessionStorage.setItem("grabmart_announcement_closed", "1");
    document.body.classList.remove("has-announcement");
    wrap.classList.add("hidden");
    setTimeout(() => wrap.remove(), 260);
  });
  if (!existing) document.body.prepend(wrap);
  document.body.classList.add("has-announcement");
  startTimer();
}
function createWhatsAppHub(rows) {
  const existing = document.querySelector(".wa-launcher");
  const list = (Array.isArray(rows) && rows.length ? rows : kontakFallback())
    .filter(
      (x) =>
        String(x.status || "aktif")
          .trim()
          .toLowerCase() !== "nonaktif"
    )
    .slice(0, 8);
  const launcher = existing || document.createElement("div");
  launcher.className = "wa-launcher";
  const cityButtons = list
    .map((k) => {
      const kota = k.kota || k.nama || "Sumbagsel";
      const wa = normalizeWa(k.wa || k.whatsapp || k.nomor || k.phone);
      const pesan =
        k.pesan ||
        `Halo kak, saya mau daftar jadi merchant GrabMart di ${kota}. Bisa bantu prosesnya?`;
      return `<a class="wa-city" href="https://wa.me/${esc( wa )}?text=${encodeURIComponent( pesan )}" target="_blank" rel="noopener" onclick="trackDaftar('floating-wa-${esc( kota )}')"><span>${cityIcon(kota)} ${esc(kota)}</span><small>Chat</small></a>`;
    })
    .join("");
  launcher.innerHTML = `<div class="wa-panel" data-wa-panel><div class="wa-head"><div class="wa-avatar">GM</div><div><strong>Tim GrabMart Sumbagsel</strong><span>Siap bantu pendaftaran</span></div></div><p>Pilih kota untuk tanya alur daftar, dokumen, dan onboarding merchant GrabMart.</p><div class="wa-city-list">${cityButtons}</div></div><button class="wa-main" data-wa-toggle type="button" aria-label="Buka bantuan WhatsApp"><span class="wa-ping" aria-hidden="true"></span><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26C2.168 6.442 6.603 2.008 12.055 2.008c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885"/></svg></button>`;
  if (!existing) document.body.appendChild(launcher);
  const panel = launcher.querySelector("[data-wa-panel]");
  const btn = launcher.querySelector("[data-wa-toggle]");
  if (btn) {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      panel?.classList.toggle("open");
      launcher.querySelector(".wa-ping")?.remove();
    };
  }
  launcher.onclick = (e) => e.stopPropagation();
  if (!window.__grabmartWaGlobalBound) {
    document.addEventListener("click", () =>
      document.querySelector("[data-wa-panel]")?.classList.remove("open")
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape")
        document.querySelector("[data-wa-panel]")?.classList.remove("open");
    });
    window.__grabmartWaGlobalBound = true;
  }
}
function createBackToTop() {
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Kembali ke atas");
  btn.textContent = "↑";
  document.body.appendChild(btn);
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", (window.scrollY || 0) > 700),
    { passive: true }
  );
}

// Step 8.1 - top announcement + clean clickable campaign slider
function initCampaignAnnouncements(rows) {
  const items = activeRows(rows).slice(0, 8);
  const normalized = (
    items.length
      ? items
      : [
          {
            teks: "Daftar GrabMart Gratis, Aktif 3-10 hari kerja",
            btn: "Daftar Sekarang",
            link: "https://mitrasumbagsel.com/daftar.html",
            banner: "",
          },
        ]
  ).map((item) => ({
    text: String(
      item.teks ||
        item.judul ||
        item.pesan ||
        "Daftar GrabMart Gratis, Aktif 3-10 hari kerja"
    ),
    btn: String(item.btn || item.tombol || "Daftar Sekarang"),
    link: safeUrl(item.link || "https://mitrasumbagsel.com/daftar.html"),
    banner: safeUrl(
      item.banner || item.gambar || item.image || item.foto || ""
    ),
  }));
  const topLink = document.querySelector("[data-topbar-link]");
  const track = document.querySelector("[data-campaign-track]");
  const dots = document.querySelector("[data-campaign-dots]");
  if (!track || !dots) return;

  // Important: if a banner image exists, the image itself is the campaign creative.
  // Do not print the Sheet text as a huge overlay on top of the image.
  const bannerItems = normalized.filter(
    (item) => item.banner && item.banner !== "#"
  );
  const heroItems = bannerItems.length ? bannerItems : normalized;
  let current = 0;
  const fallbackVisual = "assets/images/toko-grabmart.png";

  function shortHeadline(text) {
    const clean = String(text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return "Daftar GrabMart Gratis";
    return clean.length > 48 ? clean.substring(0, 46).trim() + "…" : clean;
  }
  function splitSubline(text) {
    const parts = String(text || "").split(",");
    return parts.length > 1
      ? parts.slice(1).join(",").trim()
      : "Aktif 3-10 hari kerja";
  }

  track.innerHTML = heroItems
    .map((item, i) => {
      const hasBanner = item.banner && item.banner !== "#";
      if (hasBanner) {
        return `<a class="gm-campaign-slide has-image ${ i === 0 ? "is-active" : "" }" href="${escAttr( item.link )}" target="_blank" rel="noopener noreferrer" aria-label="${escAttr( item.text )}" style="background-image:url('${escAttr( item.banner )}')" onclick="trackDaftar('campaign-banner-${ i + 1 }')"><span class="sr-only">${esc(item.text)} - ${esc( item.btn )}</span></a>`;
      }
      return `<a class="gm-campaign-slide gm-campaign-fallback ${ i === 0 ? "is-active" : "" }" href="${escAttr( item.link )}" target="_blank" rel="noopener noreferrer" onclick="trackDaftar('campaign-text-${ i + 1 }')"><div class="gm-campaign-content"><span>Onboarding Merchant</span><h1>${esc( shortHeadline(item.text.split(",")[0] || item.text) )}</h1><p>${esc( splitSubline(item.text) )}</p><div class="gm-campaign-cta">${esc( item.btn )} <strong>›</strong></div></div><div class="gm-campaign-visual" aria-hidden="true"><img src="${fallbackVisual}" alt="" width="720" height="560" loading="eager" decoding="async"></div></a>`;
    })
    .join("");

  dots.innerHTML = heroItems
    .map(
      (_, i) =>
        `<button class="${ i === 0 ? "is-active" : "" }" type="button" data-campaign-dot="${i}" aria-label="Banner ${ i + 1 }"></button>`
    )
    .join("");
  const slides = [...track.querySelectorAll(".gm-campaign-slide")];
  const dotBtns = [...dots.querySelectorAll("[data-campaign-dot]")];
  const show = (idx) => {
    if (!slides.length) return;
    current = (idx + slides.length) % slides.length;
    slides.forEach((el, i) => el.classList.toggle("is-active", i === current));
    dotBtns.forEach((el, i) => el.classList.toggle("is-active", i === current));
    if (topLink) {
      const currentItem = heroItems[current] || normalized[0];
      topLink.textContent = currentItem.text;
      topLink.href = currentItem.link;
    }
  };
  document.querySelectorAll("[data-campaign-prev]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      show(current - 1);
      restart();
    };
  });
  document.querySelectorAll("[data-campaign-next]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      show(current + 1);
      restart();
    };
  });
  dotBtns.forEach((btn, i) =>
    btn.addEventListener("click", () => {
      show(i);
      restart();
    })
  );
  let timer = null;
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  const start = () => {
    stop();
    if (
      slides.length > 1 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      timer = setInterval(() => show(current + 1), 3000);
    }
  };
  function restart() {
    start();
  }
  const shell = document.getElementById("campaign-slider");
  shell?.addEventListener("mouseenter", stop);
  shell?.addEventListener("mouseleave", start);
  shell?.addEventListener("focusin", stop);
  shell?.addEventListener("focusout", start);
  show(0);
  start();
}

fetchSheet("pengumuman")
  .then(initCampaignAnnouncements)
  .catch(() => initCampaignAnnouncements([]));
createWhatsAppHub(kontakFallback());
fetchSheet("kontak")
  .then(createWhatsAppHub)
  .catch(() => {});
createBackToTop();

// Step 7 - mobile sticky CTA and safer outbound handling
function createMobileStickyCta() {
  if (document.querySelector(".mobile-sticky-cta")) return;
  const bar = document.createElement("div");
  bar.className = "mobile-sticky-cta";
  bar.innerHTML =
    '<a class="sticky-primary" href="daftar.html" onclick="trackDaftar(\'sticky-mobile-daftar\')">Daftar Gratis</a><a class="sticky-secondary" href="#merchant-baru" onclick="trackDaftar(\'sticky-mobile-merchant-baru\')">Merchant Baru</a>';
  document.body.appendChild(bar);
}
function hardenOutboundLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    const rel = new Set(
      String(a.getAttribute("rel") || "")
        .split(/\s+/)
        .filter(Boolean)
    );
    rel.add("noopener");
    rel.add("noreferrer");
    a.setAttribute("rel", Array.from(rel).join(" "));
  });
}
createMobileStickyCta();
hardenOutboundLinks();

// Step 7.6 - robust WhatsApp launcher delegation for mobile/desktop re-renders
(function () {
  if (window.__grabmartWaDelegationV76) return;
  window.__grabmartWaDelegationV76 = true;
  function toggleWaLauncher(e) {
    const btn =
      e.target && e.target.closest
        ? e.target.closest("[data-wa-toggle]")
        : null;
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const launcher = btn.closest(".wa-launcher");
    const panel = launcher && launcher.querySelector("[data-wa-panel]");
    if (panel) panel.classList.toggle("open");
    if (launcher) launcher.querySelector(".wa-ping")?.remove();
  }
  document.addEventListener("click", toggleWaLauncher, true);
})();