/* Shared layout + helpers for every page. You normally don't need to edit this. */
(function () {
  /* Defaults — the real values come from content/settings.json (edit in the CMS). */
  const C = {
    name: "Muslim Leadership Media", short: "MLM",
    email: "info@muslimleadershipmedia.org", phone: "", location: "",
    donateUrl: "", contactFormEndpoint: "", newsletterFormEndpoint: "",
    announcement: "", announcementLink: "",
    social: { instagram: "", facebook: "", x: "", youtube: "" },
    nav: [
      { label: "About", href: "about.html", key: "about" },
      { label: "Academy", href: "academy.html", key: "academy" },
      { label: "Our Team", href: "team.html", key: "team" },
      { label: "Events", href: "events.html", key: "events" },
      { label: "Blog", href: "blog.html", key: "blog" },
      { label: "Contact", href: "contact.html", key: "contact" }
    ]
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Icons ---------- */
  const I = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    level: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 20v-5M12 20V10M19 20V4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.5C.4 8.2 2.4 4 6.3 4c2.2 0 3.7 1.2 4.7 2.6C12 5.2 13.5 4 15.7 4 19.6 4 21.6 8.2 20 11.5 17.5 16.4 12 21 12 21z"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5"/></svg>',
    mentor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 11l2 2 4-4"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
    hands: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5 5 0 0 1 6 .8L21 9"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.3l-7.2 8.2L22.4 21h-6.6l-5.2-6.8L4.6 21H1.3l7.7-8.8L.9 3h6.8l4.7 6.2zm-1.2 16h1.8L6.5 4.9H4.6z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8zM9.7 15.1V8.9l5.8 3.1z"/></svg>'
  };

  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const donateHref = () => C.donateUrl || "donate.html";
  const socialLinks = () => Object.entries(C.social).filter(([, u]) => u)
    .map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${k}">${I[k] || ""}</a>`).join("");

  /* ---------- Header / footer ---------- */
  function renderChrome() {
    const page = document.body.dataset.page || "";
    const navLinks = C.nav.map(n => `<a href="${n.href}" class="${n.key === page ? "active" : ""}"${n.key === page ? ' aria-current="page"' : ""}>${n.label}</a>`).join("");
    const h = $("#site-header");
    const ann = C.announcement ? `<div class="announce">${C.announcementLink ? `<a href="${esc(C.announcementLink)}">${esc(C.announcement)} →</a>` : esc(C.announcement)}</div>` : "";
    if (h) h.outerHTML = `
      <a class="skip" href="#main">Skip to content</a>${ann}
      <header class="site-header" id="top">
        <div class="wrap header-in">
          <a class="brand" href="index.html" aria-label="${esc(C.name)} — home">
            <img src="assets/img/logo-icon.png" alt="" width="44" height="44">
            <span class="brand-txt"><b>MLM</b><small>Muslim Leadership Media</small></span>
          </a>
          <nav class="nav" aria-label="Main">${navLinks}</nav>
          <div class="header-cta">
            <a class="btn btn-ghost btn-sm" href="academy.html">Start learning</a>
            <a class="btn btn-red btn-sm" href="${donateHref()}">${I.heart} Donate</a>
            <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span></button>
          </div>
        </div>
      </header>
      <nav class="mobile-nav" aria-label="Mobile">
        <a href="index.html" class="${page === "home" ? "active" : ""}">Home</a>${navLinks}
        <a class="btn btn-red" href="${donateHref()}">${I.heart} Donate</a>
        <div class="socials">${socialLinks()}</div>
      </nav>`;

    const f = $("#site-footer");
    if (f) f.outerHTML = `
      <footer class="site-footer">
        <div class="wrap">
          <div class="foot-grid">
            <div>
              <img class="foot-logo" src="assets/img/logo-full.png" alt="Muslim Leadership Media Organization" loading="lazy">
              <p>A Virginia-based nonprofit building an alternative media platform rooted in Islamic values — and training the next generation of Muslim storytellers.</p>
              <div class="socials">${socialLinks()}</div>
            </div>
            <div><h4>Explore</h4><ul class="foot-links">
              <li><a href="about.html">About MLM</a></li><li><a href="academy.html">Academy</a></li>
              <li><a href="team.html">Our Team</a></li><li><a href="events.html">Events</a></li><li><a href="blog.html">Blog</a></li></ul></div>
            <div><h4>Get involved</h4><ul class="foot-links">
              <li><a href="${donateHref()}">Donate</a></li><li><a href="contact.html#partner">Partner with us</a></li>
              <li><a href="contact.html">Contact</a></li><li><a href="academy.html">Enroll in a course</a></li></ul></div>
            <div><h4>Contact</h4><ul class="foot-links">
              <li><a href="mailto:${C.email}">${C.email}</a></li>
              <li><a href="tel:${(C.phone||"").replace(/[^\d+]/g, "")}">${C.phone}</a></li>
              <li>${esc(C.location)}</li></ul></div>
          </div>
          <div class="foot-bottom">
            <span>© ${new Date().getFullYear()} ${esc(C.name)}. All rights reserved.</span>
            <span>A registered 501(c)(3) nonprofit organization.</span>
          </div>
        </div>
      </footer>
      <button class="back-top" aria-label="Back to top">${I.up}</button>
      <div class="toast" role="status" aria-live="polite"></div>`;

    const btn = $(".menu-btn");
    btn && btn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", open);
    });
    $$(".mobile-nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
    const header = $(".site-header"), top = $(".back-top");
    const onScroll = () => {
      header && header.classList.toggle("scrolled", scrollY > 8);
      top && top.classList.toggle("show", scrollY > 800);
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    top && top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    $$("[data-donate]").forEach(a => (a.href = donateHref()));
  }

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" }) : null;
  function reveal(root = document) { $$(".reveal:not(.in)", root).forEach(el => io ? io.observe(el) : el.classList.add("in")); }

  /* ---------- Data helpers ---------- */
  const cache = {};
  async function json(path) {
    if (!cache[path]) cache[path] = fetch(path, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(path + " " + r.status); return r.json(); });
    return cache[path];
  }
  async function text(path) {
    const r = await fetch(path, { cache: "no-cache" });
    if (!r.ok) throw new Error(path + " " + r.status);
    return r.text();
  }
  function md(src) {
    if (window.marked) { marked.setOptions({ gfm: true, breaks: false }); return marked.parse(src); }
    return "<p>" + esc(src).replace(/\n\n/g, "</p><p>") + "</p>";
  }
  const param = k => new URLSearchParams(location.search).get(k);
  const fmtDate = (d, o = { month: "long", day: "numeric", year: "numeric" }) => new Date(d + (String(d).length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-US", o);
  const initials = n => n.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  /* ---------- Learning progress (saved in the visitor's browser) ---------- */
  const KEY = "mlm-progress-v1";
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const write = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
  const progress = {
    done: (c, l) => !!(read()[c] || {})[l],
    set(c, l, v) { const d = read(); d[c] = d[c] || {}; v ? (d[c][l] = Date.now()) : delete d[c][l]; write(d); },
    count: c => Object.keys(read()[c] || {}).length,
    pct(course) { const n = course.lessons.length; if (!n) return 0; return Math.round(course.lessons.filter(l => progress.done(course.id, l.id)).length / n * 100); },
    next(course) { return course.lessons.find(l => !progress.done(course.id, l.id)) || course.lessons[0]; }
  };

  function toast(msg) {
    const t = $(".toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Forms (Formspree or mailto fallback) ---------- */
  function wireForms() {
    $$("form[data-form]").forEach(form => {
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const type = form.dataset.form;
        const endpoint = type === "newsletter" ? C.newsletterFormEndpoint : C.contactFormEndpoint;
        const data = new FormData(form);
        const msg = form.querySelector(".form-msg") || form.parentElement.querySelector(".form-msg");
        if (endpoint) {
          try {
            const r = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
            if (!r.ok) throw 0;
            form.reset();
            if (msg) { msg.classList.add("show"); } else toast("Thank you — you're on the list!");
          } catch { toast("Something went wrong. Please email " + C.email); }
        } else {
          const subject = type === "newsletter" ? "Newsletter signup" : (data.get("subject") || "Website message");
          const body = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
          location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
      });
    });
  }

  /* Events: turn CMS fields (date, time, end_date) into start/end timestamps */
  function eventTimes(e) {
    const at = (d, t, def) => {
      if (!d) return null;
      let h = def[0], m = def[1];
      const x = String(t || "").trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
      if (x) { h = +x[1] % 12 + (x[3] === "pm" ? 12 : 0); if (!x[3]) h = +x[1]; m = +(x[2] || 0); }
      const dt = new Date(String(d).slice(0, 10) + "T00:00:00"); dt.setHours(h, m); return dt;
    };
    const start = at(e.date, e.time, [12, 0]);
    const end = at(e.end_date || e.date, e.end_date ? "" : "", [23, 59]);
    return { ...e, start, end, allDay: !e.time };
  }

  const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const listOf = d => Array.isArray(d) ? d : (d && (d.posts || d.events || d.items)) || [];
  async function posts() {
    const list = listOf(await json("content/posts.json")).filter(p => p && p.title && p.published !== false);
    return list.map(p => ({ ...p, slug: p.slug || slugify(p.title), date: String(p.date || "").slice(0, 10), tags: (p.tags || []).filter(Boolean),
      excerpt: p.excerpt || String(p.body || "").replace(/[#>*_\[\]()`]/g, "").trim().slice(0, 170) + "…" }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }
  async function events() {
    return listOf(await json("content/events.json")).filter(e => e && e.title && e.date).map(eventTimes);
  }
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

  window.MLM = { $, $$, I, esc, json, text, md, param, fmtDate, initials, progress, toast, reveal, config: C, donateHref, eventTimes, posts, events, inline, slugify };

  // Load site settings, then draw header/footer. Page scripts wait on MLM.ready.
  MLM.ready = (async () => {
    try {
      const S = await json("content/settings.json");
      Object.assign(C, {
        email: S.email || C.email, phone: S.phone || "", location: S.location || "",
        donateUrl: S.donateUrl || "", contactFormEndpoint: S.contactFormEndpoint || "", newsletterFormEndpoint: S.newsletterFormEndpoint || "",
        announcement: S.announcement || "", announcementLink: S.announcementLink || "",
        social: { instagram: S.instagram || "", facebook: S.facebook || "", x: S.x || "", youtube: S.youtube || "" }
      });
    } catch (e) { console.warn("Settings not loaded", e); }
    renderChrome(); wireForms(); reveal();
  })();
})();
