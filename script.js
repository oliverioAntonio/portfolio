/* ========================
   CANVAS — Particelle e connessioni
   ======================== */
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let W = 0, H = 0, nodes = [], raf = null;
let pointer = { x: -9999, y: -9999, active: false };

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width  = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  canvas.style.width  = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  spawnNodes();
}

function spawnNodes() {
  const count = Math.max(48, Math.floor((W * H) / 16000));
  nodes = Array.from({ length: count }, (_, i) => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r:  i % 6 === 0 ? 2.4 : 1.4,
  }));
}

function lerp(a, b, t) { return a + (b - a) * t; }

function frame() {
  ctx.clearRect(0, 0, W, H);

  const LINK_DIST   = 150;
  const CURSOR_DIST = 180;

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!reduceMotion) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    }

    /* node-to-node links */
    for (let j = i + 1; j < nodes.length; j++) {
      const m  = nodes[j];
      const dx = n.x - m.x, dy = n.y - m.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < LINK_DIST) {
        const a = 0.16 * (1 - d / LINK_DIST);
        ctx.strokeStyle = `rgba(46,232,245,${a})`;
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }
    }

    /* cursor links */
    if (pointer.active) {
      const dx = n.x - pointer.x, dy = n.y - pointer.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < CURSOR_DIST) {
        const a = 0.35 * (1 - d / CURSOR_DIST);
        ctx.strokeStyle = `rgba(77,240,160,${a})`;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    }

    /* dot */
    const alpha = pointer.active
      ? lerp(0.35, 0.9, 1 - Math.min(
          Math.sqrt((n.x-pointer.x)**2+(n.y-pointer.y)**2) / CURSOR_DIST, 1))
      : 0.45;
    ctx.fillStyle = `rgba(46,232,245,${alpha})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!reduceMotion) raf = requestAnimationFrame(frame);
}

window.addEventListener("resize", () => { resize(); });
window.addEventListener("pointermove", e => {
  pointer = { x: e.clientX, y: e.clientY, active: true };
});
window.addEventListener("pointerleave", () => { pointer.active = false; });

resize();
if (!reduceMotion) frame();
else frame(); /* single static draw */

/* ========================
   HEADER — scroll behaviour
   ======================== */
const header = document.getElementById("site-header");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 40);
  lastScroll = y;
}, { passive: true });

/* ========================
   NAV TOGGLE (mobile)
   ======================== */
const navToggle = document.querySelector(".nav-toggle");
const nav       = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
});
nav.addEventListener("click", e => {
  if (e.target.matches("a")) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Apri menu");
  }
});
document.addEventListener("click", e => {
  if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ========================
   REVEAL ON SCROLL
   ======================== */
if (document.documentElement.classList.contains("js")) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* ========================
   MARQUEE — duplicate per loop continuo
   ======================== */
const track = document.querySelector(".marquee-track");
if (track) track.innerHTML += track.innerHTML;

/* ========================
   ACTIVE NAV LINK su scroll
   ======================== */
const sections = document.querySelectorAll("section[id], div[id]");
const navLinks  = document.querySelectorAll(".site-nav a[href^='#']");

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach(a => {
        a.style.color = a.getAttribute("href") === `#${id}`
          ? "var(--cyan)" : "";
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => navObserver.observe(s));
