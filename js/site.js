/* ==========================================================================
   Thanh Hiếu — hành vi dùng chung cho mọi trang
   Nạp SAU file từ điển (i18n-*.js) vì cần biến I18N
   ========================================================================== */

/* --- Contact placeholders: replace these once, everything updates --------- */
const CONTACT = {
  phone: "0364724641",
  zalo: "0364724641",
  messenger: "https://m.me/thanh.hieu.43246",
  email: "buihieu050898@gmail.com",
  facebook: "https://www.facebook.com/thanh.hieu.43246",
};

/* 0364724641 → "0364 724 641" — readable on desktop where tel: can't dial */
const PHONE_FMT = CONTACT.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");

/* Từ điển do file i18n-*.js nạp trước đặt vào. */
const I18N = window.PAGE_I18N || { vi: {}, en: {} };

function applyLang(lang) {
  const dict = I18N[lang] || I18N.vi;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
  try { localStorage.setItem("lang", lang); } catch (_) { /* private mode */ }
}

function initLangSwitch() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });
  let saved = "vi";
  try { saved = localStorage.getItem("lang") || "vi"; } catch (_) { /* private mode */ }
  if (saved !== "vi") applyLang(saved);
}

/* --- Image fallbacks -------------------------------------------------------
   Until a real photo exists at the path, show a labeled drop-target box.
   Drop the correctly named file into images/ and it appears — no code edits. */
function installImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    const swap = () => {
      const box = document.createElement("div");
      box.className = "img-fallback " + img.className;
      box.innerHTML =
        '<span>📷 Thả ảnh vào:</span><strong>' + img.dataset.fallback + "</strong>";
      img.replaceWith(box);
    };
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener("error", swap, { once: true });
  });
}

/* --- Scroll reveal --------------------------------------------------------- */
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveals() {
  const items = document.querySelectorAll(".reveal");
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el, i) => {
    // stagger siblings that enter together
    el.style.setProperty("--reveal-delay", (i % 4) * 0.08 + "s");
    io.observe(el);
  });
}

/* --- Stat counters --------------------------------------------------------- */
function animateCount(el, target) {
  const duration = 1600;
  const start = performance.now();
  const fmt = (n) => n.toLocaleString("vi-VN");
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = fmt(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    nums.forEach((el) => (el.textContent = Number(el.dataset.count).toLocaleString("vi-VN")));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target, Number(entry.target.dataset.count));
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((el) => io.observe(el));
}

/* --- Lightbox --------------------------------------------------------------
   Opens only for real photos; placeholder tiles stay inert. */
function initLightbox() {
  const box = document.getElementById("lightbox");
  if (!box || typeof box.showModal !== "function") return;
  const boxImg = box.querySelector(".lightbox-img");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img) return; // placeholder tile — nothing to enlarge
      boxImg.src = img.src;
      boxImg.alt = img.alt;
      box.showModal();
    });
  });

  box.querySelector(".lightbox-close").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => {
    if (e.target === box) box.close(); // backdrop click
  });
}

/* --- Hero parallax ---------------------------------------------------------- */
function initParallax() {
  if (REDUCED_MOTION) return;
  const heroImg = document.querySelector(".hero-img, .hero .img-fallback");
  if (!heroImg) return;
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) heroImg.style.transform = "translateY(" + y * 0.25 + "px)";
        ticking = false;
      });
    },
    { passive: true }
  );
}

/* --- Active nav highlight --------------------------------------------------- */
function initActiveNav() {
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

/* --- Contact buttons ------------------------------------------------------- */
function initContactLinks() {
  const set = (id, href) => {
    const el = document.getElementById(id);
    if (el) el.href = href;
  };
  set("btn-phone", "tel:" + CONTACT.phone);
  initPhoneModal();
  set("btn-zalo", "https://zalo.me/" + CONTACT.zalo);
  set("btn-messenger", CONTACT.messenger);
  set("btn-email", "mailto:" + CONTACT.email);
  set("link-facebook", CONTACT.facebook);

  const year = document.getElementById("footer-year");
  if (year) year.textContent = new Date().getFullYear();
}

/* --- Phone modal -------------------------------------------------------------
   Phones dial via tel: directly. Desktops have no dialer, so intercept the
   click and show the number in a copyable popup instead of the OS app picker. */
function initPhoneModal() {
  const btn = document.getElementById("btn-phone");
  const modal = document.getElementById("phone-modal");
  if (!btn || !modal || typeof modal.showModal !== "function") return;

  const isPhoneDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isPhoneDevice) return; // keep native one-tap dialing

  modal.querySelector("#phone-modal-number").textContent = PHONE_FMT;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.showModal();
  });

  modal.querySelector("#phone-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close(); // backdrop click
  });

  const copyBtn = modal.querySelector("#phone-copy");
  copyBtn.addEventListener("click", () => {
    const lang = document.documentElement.lang || "vi";
    const done = () => {
      copyBtn.textContent = I18N[lang]["phone.copied"];
      setTimeout(() => (copyBtn.textContent = I18N[lang]["phone.copy"]), 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONTACT.phone).then(done, () => selectNumber());
    } else {
      selectNumber();
    }
  });

  function selectNumber() {
    // clipboard API unavailable (e.g. some file:// contexts) — select for manual copy
    const range = document.createRange();
    range.selectNodeContents(modal.querySelector("#phone-modal-number"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/* --- boot ---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initLangSwitch();
  installImageFallbacks();
  initReveals();
  initCounters();
  initLightbox();
  initContactLinks();
  initParallax();
  initActiveNav();
});
