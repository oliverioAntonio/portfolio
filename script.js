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
   LANGUAGE TOGGLE (IT default / EN optional)
   ======================== */
const langToggle = document.querySelector(".lang-toggle");
const langCurrent = document.querySelector(".lang-current");
const metaDescription = document.querySelector("meta[name='description']");

const translations = {
  it: {
    title: "Antonio Davide Oliverio | Full-Stack .NET & RPA Developer",
    description: "Portfolio di Antonio Davide Oliverio - Full-Stack .NET / Blazor e RPA Developer.",
    nextLanguageLabel: "Cambia lingua in inglese",
    current: "IT",
    other: "EN",
    navProjects: "Progetti",
    navStack: "Stack",
    navContacts: "Contatti",
    heroEyebrow: "Full-Stack .NET / Blazor &middot; RPA Developer",
    heroText: "Costruisco prodotti web, API, dashboard operative e automazioni enterprise su stack Microsoft. Dalla UI al backend, dai dati ai processi: tutto connesso, tutto funzionante.",
    heroPrimary: "Vedi Clepsydra",
    heroSecondary: "Altri progetti",
    profileKicker: "Profilo",
    statYears: "anni enterprise",
    statProjects: "progetti live",
    statControllers: "controller API",
    introTitle: "Sviluppo software che tiene insieme prodotto, dati e automazione.",
    introText: "Lavoro su PWA, microservizi, job asincroni, report, stampa locale, gestione documentale e bot RPA. Creo strumenti che entrano davvero nel flusso operativo: dashboard leggibili, backend robusti e automazioni che eliminano le attivit&agrave; ripetitive.",
    featuredKicker: "Progetto di punta",
    featuredSub: "Gestionale modulare enterprise su Blazor e .NET &mdash; costruito da zero, in produzione.",
    featuredText: "Una piattaforma enterprise composta da client Blazor WebAssembly, API ASP.NET Core, layer applicativo condiviso, database SQL Server, job scheduler Hangfire, moduli di inventory, documenti, listini, riparazioni, workstations, voucher, reportistica e integrazioni con stampa locale.",
    proofOne: "controller e aree funzionali tra identity, catalogo, dashboard, documenti e stock.",
    proofTwo: "progetti di test su application, client, infrastructure, printer API e shared.",
    proofThree: "web, mobile MAUI, API, job scheduler, servizi condivisi e agent di stampa locale.",
    projectsKicker: "Progetti",
    projectsTitle: "Casi reali, impatto concreto.",
    p1Title: "Gestionale enterprise end-to-end",
    p1Text: "Architettura modulare con Blazor WASM, API .NET 9, job Hangfire, Azure Storage/Queues e suite di test.",
    p2Title: "Inventory con bot orchestrati",
    p2Text: "Bot multipli, dashboard Blazor/Syncfusion, automazioni SAP/Navision, Microsoft Graph e SharePoint.",
    p3Title: "Gestione scarti operativi",
    p3Text: "Automazioni su portali web e Microsoft Dynamics, Blazor con Syncfusion, storico ed export Excel.",
    p4Title: "File complessi e incassi",
    p4Text: "Produzione massiva Excel con Syncfusion XlsIO, mapping Dynamics, calcoli e workflow da dashboard.",
    p5Title: "Moduli IA per PWA",
    p5Text: "Integrazione API ChatGPT, comandi vocali/testuali, Blazor WASM e deploy containerizzato Azure.",
    p6Title: "Preventivatore e configuratore",
    p6Text: "Blazor Server con SSO via Clockify (OAuth2/OIDC), JWT sulle API REST, CRUD dinamici, DevExpress, NUnit e deploy DMZ.",
    p7Top: "Consulenza &middot; Rollout",
    p7Title: "Supporto tecnico enterprise",
    p7Text: "Consulenza su rollout e strumenti interni, sviluppo Web API REST in .NET 8, migrazione da .NET Framework 4.8 a .NET 8, troubleshooting, database MongoDB/SQL Server e DevOps Agile.",
    stackKicker: "Stack",
    stackTitle: "Tecnologie che uso per costruire, integrare e automatizzare.",
    expKicker: "Esperienza",
    expTitle: "Dal codice al rilascio, dentro ambienti enterprise.",
    expRole: "Microsoft Full-Stack Developer / RPA Developer",
    expText: "Sviluppo di applicazioni web PWA, API REST, gestionali enterprise, integrazioni IA e automazioni RPA con focus su Blazor, ASP.NET Core, SQL Server e processi reali.",
    consultingDate: "Consulenza",
    consultingRole: "Software consultant / Team Rollout",
    consultingText: "Supporto operativo e tecnico al team Rollout: sviluppo di Web API REST in .NET 8, migrazione da .NET Framework 4.8 a .NET 8, configurazione di strumenti interni, shared folder, permessi, troubleshooting, database MongoDB/SQL Server e collaborazione con team Agile su Jira, Jenkins, Octopus, GitHub e Bitbucket.",
    educationDate: "Formazione",
    educationRole: "Universit&agrave; della Calabria",
    educationText: "Informatica, programmazione a oggetti, basi di dati, sistemi web, intelligenza artificiale, algoritmi, reti e sistemi distribuiti.",
    contactsKicker: "Contatti",
    contactsTitle: "Hai un gestionale, una dashboard o un processo da automatizzare?",
    contactsText: "Sono basato in Italia e lavoro su soluzioni full-stack, integrazioni enterprise, job asincroni e automazioni operative ad alto impatto.",
    cvLabel: "Curriculum",
    cvValue: "Scarica CV",
  },
  en: {
    title: "Antonio Davide Oliverio | Full-Stack .NET & RPA Developer",
    description: "Portfolio of Antonio Davide Oliverio - Full-Stack .NET / Blazor and RPA Developer.",
    nextLanguageLabel: "Switch language to Italian",
    current: "EN",
    other: "IT",
    navProjects: "Projects",
    navStack: "Stack",
    navContacts: "Contact",
    heroEyebrow: "Full-Stack .NET / Blazor &middot; RPA Developer",
    heroText: "I build web products, APIs, operational dashboards and enterprise automations on the Microsoft stack. From UI to backend, from data to process: everything connected, everything working.",
    heroPrimary: "View Clepsydra",
    heroSecondary: "Other projects",
    profileKicker: "Profile",
    statYears: "enterprise years",
    statProjects: "live projects",
    statControllers: "API controllers",
    introTitle: "Software development that connects product, data and automation.",
    introText: "I work on PWAs, microservices, async jobs, reports, local printing, document management and RPA bots. I create tools that fit real operational workflows: readable dashboards, robust backends and automations that remove repetitive work.",
    featuredKicker: "Flagship project",
    featuredSub: "Enterprise modular management platform on Blazor and .NET &mdash; built from scratch, running in production.",
    featuredText: "An enterprise platform composed of a Blazor WebAssembly client, ASP.NET Core APIs, shared application layer, SQL Server database, Hangfire job scheduler, inventory, documents, price lists, repairs, workstations, vouchers, reporting and local printing integrations.",
    proofOne: "controllers and functional areas across identity, catalog, dashboard, documents and stock.",
    proofTwo: "test projects covering application, client, infrastructure, printer API and shared modules.",
    proofThree: "web, MAUI mobile, APIs, job scheduler, shared services and local printing agent.",
    projectsKicker: "Projects",
    projectsTitle: "Real cases, concrete impact.",
    p1Title: "End-to-end enterprise management system",
    p1Text: "Modular architecture with Blazor WASM, .NET 9 APIs, Hangfire jobs, Azure Storage/Queues and a test suite.",
    p2Title: "Inventory with orchestrated bots",
    p2Text: "Multiple bots, Blazor/Syncfusion dashboard, SAP/Navision automations, Microsoft Graph and SharePoint.",
    p3Title: "Operational waste-flow management",
    p3Text: "Automations on web portals and Microsoft Dynamics, Blazor with Syncfusion, history tracking and Excel export.",
    p4Title: "Complex files and cash collection flows",
    p4Text: "Mass Excel generation with Syncfusion XlsIO, Dynamics mapping, calculations and dashboard-driven workflow.",
    p5Title: "AI modules for PWAs",
    p5Text: "ChatGPT API integration, voice/text commands, Blazor WASM and containerized Azure deployment.",
    p6Title: "Quotation and configuration tool",
    p6Text: "Blazor Server with Clockify SSO (OAuth2/OIDC), JWT on REST APIs, dynamic CRUDs, DevExpress, NUnit and DMZ deployment.",
    p7Top: "Consulting &middot; Rollout",
    p7Title: "Enterprise technical support",
    p7Text: "Consulting on rollout and internal tools, development of .NET 8 REST Web APIs, migration from .NET Framework 4.8 to .NET 8, troubleshooting, MongoDB/SQL Server databases and Agile DevOps.",
    stackKicker: "Stack",
    stackTitle: "Technologies I use to build, integrate and automate.",
    expKicker: "Experience",
    expTitle: "From code to release, inside enterprise environments.",
    expRole: "Microsoft Full-Stack Developer / RPA Developer",
    expText: "Development of PWA web applications, REST APIs, enterprise management systems, AI integrations and RPA automations, focused on Blazor, ASP.NET Core, SQL Server and real business processes.",
    consultingDate: "Consulting",
    consultingRole: "Software consultant / Rollout Team",
    consultingText: "Operational and technical support for the Rollout team: development of .NET 8 REST Web APIs, migration from .NET Framework 4.8 to .NET 8, internal tool configuration, shared folders, permissions, troubleshooting, MongoDB/SQL Server database maintenance and collaboration with Agile teams using Jira, Jenkins, Octopus, GitHub and Bitbucket.",
    educationDate: "Education",
    educationRole: "University of Calabria",
    educationText: "Computer science, object-oriented programming, databases, web systems, artificial intelligence, algorithms, networks and distributed systems.",
    contactsKicker: "Contact",
    contactsTitle: "Do you have a management platform, dashboard or process to automate?",
    contactsText: "I am based in Italy and work on full-stack solutions, enterprise integrations, async jobs and high-impact operational automations.",
    cvLabel: "Resume",
    cvValue: "Download CV",
  },
};

const translationTargets = {
  navProjects: '.site-nav a[href="#progetti"]',
  navStack: '.site-nav a[href="#stack"]',
  navContacts: '.site-nav a[href="#contatti"]',
  heroEyebrow: ".hero .eyebrow",
  heroText: ".hero-text",
  heroPrimary: ".hero-actions .primary span",
  heroSecondary: ".hero-actions .ghost",
  profileKicker: ".intro-left .section-kicker",
  statYears: ".intro-stat:nth-child(1) .stat-lbl",
  statProjects: ".intro-stat:nth-child(2) .stat-lbl",
  statControllers: ".intro-stat:nth-child(3) .stat-lbl",
  introTitle: ".intro-right h2",
  introText: ".intro-right p",
  featuredKicker: ".featured-header .section-kicker",
  featuredSub: ".featured-sub",
  featuredText: ".featured-desc p",
  proofOne: ".proof-item:nth-child(1) p",
  proofTwo: ".proof-item:nth-child(2) p",
  proofThree: ".proof-item:nth-child(3) p",
  projectsKicker: "#progetti .section-kicker",
  projectsTitle: "#projects-title",
  p1Title: ".project-card:nth-child(1) h3",
  p1Text: ".project-card:nth-child(1) p",
  p2Title: ".project-card:nth-child(2) h3",
  p2Text: ".project-card:nth-child(2) p",
  p3Title: ".project-card:nth-child(3) h3",
  p3Text: ".project-card:nth-child(3) p",
  p4Title: ".project-card:nth-child(4) h3",
  p4Text: ".project-card:nth-child(4) p",
  p5Title: ".project-card:nth-child(5) h3",
  p5Text: ".project-card:nth-child(5) p",
  p6Title: ".project-card:nth-child(6) h3",
  p6Text: ".project-card:nth-child(6) p",
  p7Top: ".project-card:nth-child(7) .project-topline span:nth-child(2)",
  p7Title: ".project-card:nth-child(7) h3",
  p7Text: ".project-card:nth-child(7) p",
  stackKicker: "#stack .section-kicker",
  stackTitle: "#stack-title",
  expKicker: "#esperienza .section-kicker",
  expTitle: "#exp-title",
  expRole: ".timeline-item:nth-child(1) .tl-role",
  expText: ".timeline-item:nth-child(1) .tl-body p:last-of-type",
  consultingDate: ".timeline-item:nth-child(2) .tl-date",
  consultingRole: ".timeline-item:nth-child(2) .tl-role",
  consultingText: ".timeline-item:nth-child(2) .tl-body p:last-of-type",
  educationDate: ".timeline-item:nth-child(3) .tl-date",
  educationRole: ".timeline-item:nth-child(3) .tl-role",
  educationText: ".timeline-item:nth-child(3) .tl-body p:last-of-type",
  contactsKicker: "#contatti .section-kicker",
  contactsTitle: "#contact-title",
  contactsText: ".contact-copy p:last-child",
  cvLabel: ".download-cv .cc-label",
  cvValue: ".download-cv .cc-value",
};

function applyLanguage(lang) {
  const dictionary = translations[lang] || translations.it;
  document.documentElement.lang = lang;
  document.title = dictionary.title;
  if (metaDescription) metaDescription.setAttribute("content", dictionary.description);

  Object.entries(translationTargets).forEach(([key, selector]) => {
    const element = document.querySelector(selector);
    if (element && dictionary[key]) element.innerHTML = dictionary[key];
  });

  if (langToggle && langCurrent) {
    langToggle.setAttribute("aria-pressed", String(lang === "en"));
    langToggle.setAttribute("aria-label", dictionary.nextLanguageLabel);
    langCurrent.textContent = dictionary.current;
    const other = langToggle.querySelector("span:last-child");
    if (other) other.textContent = dictionary.other;
  }

  localStorage.setItem("portfolio-lang", lang);
}

const initialLanguage = localStorage.getItem("portfolio-lang") === "en" ? "en" : "it";
applyLanguage(initialLanguage);

langToggle?.addEventListener("click", () => {
  const nextLanguage = document.documentElement.lang === "en" ? "it" : "en";
  applyLanguage(nextLanguage);
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
