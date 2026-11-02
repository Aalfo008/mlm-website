/* MLM Academy engine — reads content/academy/courses.json and lesson Markdown files.
   Content comes from content/academy.json (edit it in the CMS). */
(function () {
  const { $, $$, I, esc, json, text, md, param, progress, toast, reveal } = window.MLM;
  const DATA = "content/academy.json";

  async function load() {
    const d = await json(DATA);
    const slug = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const uniq = (list) => { const seen = {}; list.forEach(x => { let id = x.id = slug(x.id || x.title) || "item"; if (seen[id]) x.id = id + "-" + (++seen[id]); else seen[id] = 1; }); return list; };
    return uniq((d.courses || []).filter(c => c && c.title && c.published !== false)).map(c => ({
      ...c,
      outcomes: (c.outcomes || []).filter(Boolean),
      lessons: uniq((c.lessons || []).filter(l => l && l.title && l.published !== false)).map(l => ({
        ...l,
        resources: (l.resources || []).filter(r => r && r.url),
        quiz: (l.quiz || []).filter(q => q && q.question && (q.options || []).filter(Boolean).length > 1)
          .map(q => ({ question: q.question, options: q.options.filter(Boolean), answer: Math.max(0, (Number(q.correct) || 1) - 1) }))
      }))
    }));
  }
  const courseUrl = c => `course.html?c=${encodeURIComponent(c.id)}`;
  const lessonUrl = (c, l) => `lesson.html?c=${encodeURIComponent(c.id)}&l=${encodeURIComponent(l.id)}`;

  function minutes(c) {
    const total = c.lessons.reduce((s, l) => s + (parseInt(l.duration) || 0), 0);
    if (!total) return c.duration || "";
    return total >= 60 ? `${Math.floor(total / 60)}h ${total % 60 ? (total % 60) + "m" : ""}`.trim() : `${total} min`;
  }

  function cover(c, extra = "") {
    return `<div class="course-cover" style="--c:${esc(c.color || "#042757")}">
      ${c.image ? `<img class="cover" src="${esc(c.image)}" alt="" loading="lazy">` : `<img class="orn" src="assets/img/mandala.png" alt="" loading="lazy">`}
      <div class="chips">${extra}${c.category ? `<span class="chip">${esc(c.category)}</span>` : ""}${c.status === "coming-soon" ? `<span class="chip red">Coming soon</span>` : ""}</div>
    </div>`;
  }

  function card(c) {
    const pct = progress.pct(c);
    return `<a class="course-card reveal" href="${courseUrl(c)}">
      ${cover(c)}
      <div class="course-body">
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.subtitle || "")}</p>
        <div class="course-meta">
          <span>${I.book}${c.lessons.length} lessons</span>
          ${minutes(c) ? `<span>${I.clock}${minutes(c)}</span>` : ""}
          ${c.level ? `<span>${I.level}${esc(c.level)}</span>` : ""}
        </div>
        ${pct ? `<div class="progress" title="${pct}% complete"><i style="width:${pct}%"></i></div>` : ""}
      </div></a>`;
  }

  /* ---------- Featured (home page) ---------- */
  async function featured(el, n = 3) {
    try {
      const cs = await load();
      const list = cs.filter(c => c.featured).concat(cs.filter(c => !c.featured)).slice(0, n);
      el.innerHTML = list.map(card).join("");
      reveal(el);
    } catch (e) { el.innerHTML = `<div class="empty">Courses are loading soon.</div>`; console.error(e); }
  }

  /* ---------- Catalog ---------- */
  async function catalog(el) {
    const cs = await load();
    const cats = [...new Set(cs.map(c => c.category).filter(Boolean))];
    const levels = [...new Set(cs.map(c => c.level).filter(Boolean))];
    const state = { q: "", cat: "All", level: "" };
    const filtersEl = $("#filters");
    filtersEl.innerHTML = `
      <label class="search">${I.search}<span class="sr-only">Search courses</span><input type="search" placeholder="Search courses and lessons…" id="q"></label>
      <div class="pills" role="group" aria-label="Category">${["All", ...cats].map(c => `<button class="pill" aria-pressed="${c === "All"}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      ${levels.length > 1 ? `<select class="select" id="lvl" aria-label="Level"><option value="">All levels</option>${levels.map(l => `<option>${esc(l)}</option>`).join("")}</select>` : ""}`;

    // Continue-learning strip
    const started = cs.filter(c => progress.count(c.id) > 0 && progress.pct(c) < 100);
    const cont = $("#continue");
    if (cont && started.length) {
      cont.hidden = false;
      $("#continue-list").innerHTML = started.map(c => {
        const nx = progress.next(c);
        return `<a class="card" href="${lessonUrl(c, nx)}" style="padding:20px">
          <small class="muted">${progress.pct(c)}% complete</small>
          <h3 style="font-size:1.3rem;margin:.2em 0 .5em">${esc(c.title)}</h3>
          <div class="progress"><i style="width:${progress.pct(c)}%"></i></div>
          <p style="margin-top:12px;font-size:.9rem">Next: <b>${esc(nx.title)}</b></p></a>`;
      }).join("");
    }

    const draw = () => {
      const q = state.q.toLowerCase();
      const list = cs.filter(c =>
        (state.cat === "All" || c.category === state.cat) &&
        (!state.level || c.level === state.level) &&
        (!q || [c.title, c.subtitle, c.description, c.category, c.instructor, ...c.lessons.map(l => l.title)].join(" ").toLowerCase().includes(q)));
      el.innerHTML = list.length ? list.map(card).join("") : `<div class="empty" style="grid-column:1/-1">No courses match your search.</div>`;
      reveal(el);
      $("#count") && ($("#count").textContent = `${list.length} course${list.length === 1 ? "" : "s"}`);
    };
    $("#q").addEventListener("input", e => { state.q = e.target.value; draw(); });
    $$("[data-cat]").forEach(b => b.addEventListener("click", () => {
      state.cat = b.dataset.cat; $$("[data-cat]").forEach(x => x.setAttribute("aria-pressed", x === b)); draw();
    }));
    $("#lvl") && $("#lvl").addEventListener("change", e => { state.level = e.target.value; draw(); });
    draw();
  }

  /* ---------- Curriculum list ---------- */
  function curriculum(c, current) {
    let html = "", mod = null;
    c.lessons.forEach((l, i) => {
      if (l.module && l.module !== mod) { mod = l.module; html += `<div class="module-h">${esc(mod)}</div>`; }
      const done = progress.done(c.id, l.id);
      html += `<a class="lesson-row ${done ? "done" : ""} ${current === l.id ? "current" : ""}" href="${lessonUrl(c, l)}">
        <span class="num">${done ? I.check.replace("<svg", '<svg width="14"') : i + 1}</span>
        <span class="t"><b>${esc(l.title)}</b>${l.summary ? `<small>${esc(l.summary)}</small>` : ""}</span>
        <span class="d">${l.video ? I.play : I.file}${esc(l.duration || "")}</span></a>`;
    });
    return html;
  }

  /* ---------- Course page ---------- */
  async function coursePage() {
    const cs = await load();
    const c = cs.find(x => x.id === param("c"));
    const main = $("#main");
    if (!c) { main.innerHTML = `<section class="section"><div class="wrap center"><h1>Course not found</h1><p><a class="btn" href="academy.html">Browse the Academy</a></p></div></section>`; return; }
    document.title = `${c.title} — MLM Academy`;
    const pct = progress.pct(c), nx = progress.next(c);
    const start = c.status === "coming-soon" ? `<span class="btn" style="opacity:.6;pointer-events:none">Coming soon</span>` :
      c.lessons.length ? `<a class="btn btn-red" href="${lessonUrl(c, nx)}">${I.play} ${pct ? (pct === 100 ? "Review course" : "Continue") : "Start course"}</a>` : "";
    const enroll = c.enrollUrl ? `<a class="btn btn-ghost" href="${esc(c.enrollUrl)}" target="_blank" rel="noopener">Register / Enroll</a>` : "";

    $("#hero-slot").innerHTML = `
      <section class="page-hero"><div class="wrap">
        <div class="crumbs"><a href="academy.html">Academy</a> / ${esc(c.category || "Course")}</div>
        <div class="chips" style="margin-bottom:18px">${c.level ? `<span class="chip">${esc(c.level)}</span>` : ""}${c.lessons.length ? `<span class="chip">${c.lessons.length} lessons</span>` : ""}${minutes(c) ? `<span class="chip">${minutes(c)}</span>` : ""}</div>
        <h1>${esc(c.title)}</h1><p class="lead">${esc(c.subtitle || "")}</p>
      </div></section>`;

    main.innerHTML = `<section class="section-tight"><div class="wrap course-layout">
      <div>
        ${c.intro ? `<div class="video">${embed(c.intro)}</div>` : ""}
        <h2 style="font-size:2rem">About this course</h2>
        <div class="prose">${md(c.description || "")}</div>
        ${c.outcomes && c.outcomes.length ? `<div class="card" style="margin:32px 0;box-shadow:none;background:var(--gold-50)"><h3>What you'll learn</h3><ul class="checks" style="margin-top:16px">${c.outcomes.map(o => `<li>${esc(o)}</li>`).join("")}</ul></div>` : ""}
        <h2 style="font-size:2rem;margin-top:40px">Curriculum</h2>
        <div class="curriculum">${curriculum(c) || `<div class="empty" style="border:0">Lessons are being prepared — check back soon.</div>`}</div>
      </div>
      <aside class="side-card">
        ${cover(c)}
        <div class="in">
          ${pct ? `<div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:8px"><b>Your progress</b><span>${pct}%</span></div><div class="progress"><i style="width:${pct}%"></i></div>` : ""}
          <dl>
            ${c.instructor ? `<dt>Instructor</dt><dd>${esc(c.instructor)}</dd>` : ""}
            ${c.level ? `<dt>Level</dt><dd>${esc(c.level)}</dd>` : ""}
            <dt>Lessons</dt><dd>${c.lessons.length}</dd>
            ${minutes(c) ? `<dt>Length</dt><dd>${minutes(c)}</dd>` : ""}
            ${c.language ? `<dt>Language</dt><dd>${esc(c.language)}</dd>` : ""}
            <dt>Price</dt><dd>${esc(c.price || "Free")}</dd>
          </dl>
          ${start}${enroll}
          ${pct ? `<button class="btn btn-ghost btn-sm" id="reset" style="margin-top:10px;width:100%">Reset progress</button>` : ""}
        </div>
      </aside></div></section>`;
    $("#reset") && $("#reset").addEventListener("click", () => { c.lessons.forEach(l => progress.set(c.id, l.id, false)); location.reload(); });
  }

  /* ---------- Video embeds: YouTube, Vimeo, Google Drive, or direct mp4 ---------- */
  function embed(v) {
    v = String(v).trim();
    let m;
    if ((m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)) || (m = v.match(/^([\w-]{11})$/)))
      return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1" title="Lesson video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    if ((m = v.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return `<iframe src="https://player.vimeo.com/video/${m[1]}" title="Lesson video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    if ((m = v.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
      return `<iframe src="https://drive.google.com/file/d/${m[1]}/preview" title="Lesson video" allow="autoplay" allowfullscreen loading="lazy"></iframe>`;
    return `<video src="${esc(v)}" controls preload="metadata" playsinline></video>`;
  }

  /* ---------- Lesson page ---------- */
  async function lessonPage() {
    const cs = await load();
    const c = cs.find(x => x.id === param("c"));
    const idx = c ? c.lessons.findIndex(l => l.id === param("l")) : -1;
    const main = $("#main");
    if (!c || idx < 0) { main.innerHTML = `<section class="section"><div class="wrap center"><h1>Lesson not found</h1><p><a class="btn" href="academy.html">Back to the Academy</a></p></div></section>`; return; }
    const l = c.lessons[idx], prev = c.lessons[idx - 1], next = c.lessons[idx + 1];
    document.title = `${l.title} — ${c.title}`;

    const side = () => `<div class="head"><a href="${courseUrl(c)}">${I.back.replace("<svg", '<svg width="12" style="vertical-align:-1px"')} Course overview</a>
        <h3>${esc(c.title)}</h3><div class="progress"><i style="width:${progress.pct(c)}%"></i></div>
        <small>${progress.count(c.id)} of ${c.lessons.length} lessons complete</small></div>${curriculum(c, l.id)}`;

    main.innerHTML = `<div class="player-layout">
      <aside class="player-side" id="side">${side()}</aside>
      <div class="player-main">
        <button class="btn btn-ghost btn-sm side-toggle" id="side-toggle">${I.list} Lessons</button>
        <div class="lesson-head">
          <div class="eyebrow">Lesson ${idx + 1} of ${c.lessons.length}${l.module ? " · " + esc(l.module) : ""}</div>
          <h1>${esc(l.title)}</h1>
          ${l.duration ? `<p class="muted" style="display:flex;gap:6px;align-items:center">${I.clock.replace("<svg", '<svg width="16"')} ${esc(l.duration)}</p>` : ""}
        </div>
        ${l.video ? `<div class="video">${embed(l.video)}</div>` : ""}
        <article class="prose" id="body"><div class="skeleton"></div></article>
        ${l.resources && l.resources.length ? `<div class="resources"><h3>Resources</h3>${l.resources.map(r => `<a href="${esc(r.url)}" target="_blank" rel="noopener">${I.file.replace("<svg", '<svg width="20"')}<span>${esc(r.title)}</span></a>`).join("")}</div>` : ""}
        ${l.quiz.length ? quizHtml(l.quiz) : ""}
        <div class="complete-bar">
          <span id="done-label"></span>
          <button class="btn btn-sm" id="done-btn"></button>
        </div>
        <nav class="lesson-nav">
          ${prev ? `<a class="btn btn-ghost" href="${lessonUrl(c, prev)}">${I.back} Previous</a>` : `<span></span>`}
          ${next ? `<a class="btn" href="${lessonUrl(c, next)}" id="next-btn">Next lesson ${I.arrow}</a>` : `<a class="btn btn-gold" href="${courseUrl(c)}">Finish course ${I.check}</a>`}
        </nav>
      </div></div>`;

    const sideEl = $("#side");
    $("#side-toggle").addEventListener("click", () => document.body.classList.toggle("side-open"));
    sideEl.addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("side-open"); });

    const paint = () => {
      const d = progress.done(c.id, l.id);
      $("#done-label").innerHTML = d ? `<b style="color:#16a34a">✓ Lesson complete</b>` : `Finished this lesson?`;
      const b = $("#done-btn"); b.textContent = d ? "Mark as not done" : "Mark complete";
      b.className = d ? "btn btn-ghost btn-sm" : "btn btn-red btn-sm";
      sideEl.innerHTML = side();
    };
    $("#done-btn").addEventListener("click", () => {
      const d = !progress.done(c.id, l.id); progress.set(c.id, l.id, d); paint();
      if (d) toast(next ? "Nice work! On to the next lesson." : "🎉 You've completed the course!");
    });
    paint();
    if (l.quiz.length) wireQuiz(l.quiz);

    $("#body").innerHTML = l.body ? md(l.body) : `<p class="muted">This lesson's notes are coming soon.</p>`;
    $$("#body a[href^='http']").forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
  }

  function quizHtml(qs) {
    return `<form class="quiz" id="quiz"><h3>${I.light.replace("<svg", '<svg width="24"')} Check your understanding</h3>
      ${qs.map((q, i) => `<fieldset class="q" style="border:0;padding:0"><p>${i + 1}. ${esc(q.question)}</p>
        ${q.options.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}" required> ${esc(o)}</label>`).join("")}</fieldset>`).join("")}
      <button class="btn btn-sm" type="submit">Check answers</button><div class="quiz-result" id="quiz-result"></div></form>`;
  }
  function wireQuiz(qs) {
    $("#quiz").addEventListener("submit", e => {
      e.preventDefault(); let score = 0;
      qs.forEach((q, i) => {
        $$(`input[name=q${i}]`).forEach(inp => {
          const lab = inp.parentElement; lab.classList.remove("right", "wrong");
          if (+inp.value === q.answer) lab.classList.add("right");
          else if (inp.checked) lab.classList.add("wrong");
          if (inp.checked && +inp.value === q.answer) score++;
        });
      });
      $("#quiz-result").textContent = `You got ${score} of ${qs.length} correct${score === qs.length ? " — excellent!" : ". Review the highlighted answers."}`;
    });
  }

  window.Academy = { load, featured, catalog, coursePage, lessonPage, card };
})();
