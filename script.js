// ---------- i18n (default English, optional PT-BR) ----------
(function () {
  const translations = {
    en: {
      title: 'Guilherme de Medeiros Ellena — Resume',
      description: 'Resume of Guilherme de Medeiros Ellena — Software Developer & Undergraduate Researcher.',
      nav_resume: 'Resume',
      nav_schedule: 'Schedule',
      nav_download: 'Download PDF',
      eyebrow: 'Software Developer & Undergraduate Researcher',
      hero_lead: 'Researcher and developer with experience in scientific instrumentation, computer vision, machine learning, and fullstack development. Undergraduate student in Applied and Computational Mathematics at UNICAMP, with active research at CNPEM/LNLS and as a collaborating researcher at Recod.ai.',
      meta_updated_label: 'Updated on',
      btn_download: 'Download resume (PDF)',
      btn_view: 'View resume',
      cv_hint_html: 'Can\'t see the PDF? <a href="cv.pdf" target="_blank" rel="noopener">Open it in a new tab</a> or download the file above.',
      filename: 'Resume-Guilherme-de-Medeiros-Ellena.pdf',
      iframe_title: 'Resume PDF viewer',
      download_aria: 'Download PDF',
      fallback_date: 'see PDF',
      schedule_panel_title: 'Weekly Schedule',
      schedule_hint: 'All times in Brasília time (UTC-3). Fixed commitments plus this week\'s one-off events, updated weekly — subject to change.',
      schedule_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      upcoming_title: 'Upcoming events',
      margin_line: (s, e, until) => `Margin: +${s} min to start · +${e} min to end (until ${until})`,
    },
    pt: {
      title: 'Guilherme de Medeiros Ellena — Currículo',
      description: 'Currículo de Guilherme de Medeiros Ellena — Desenvolvedor de Software & Pesquisador de Graduação.',
      nav_resume: 'Currículo',
      nav_schedule: 'Agenda',
      nav_download: 'Baixar PDF',
      eyebrow: 'Desenvolvedor de Software & Pesquisador de Graduação',
      hero_lead: 'Pesquisador e desenvolvedor com experiência em instrumentação científica, visão computacional, machine learning e desenvolvimento fullstack. Graduando em Matemática Aplicada e Computacional na UNICAMP, com pesquisa ativa no CNPEM/LNLS e como pesquisador colaborador no Recod.ai.',
      meta_updated_label: 'Atualizado em',
      btn_download: 'Baixar currículo (PDF)',
      btn_view: 'Ver currículo',
      cv_hint_html: 'Não está vendo o PDF? <a href="cv.pdf" target="_blank" rel="noopener">Abra em uma nova aba</a> ou baixe o arquivo acima.',
      filename: 'Curriculo-Guilherme-de-Medeiros-Ellena.pdf',
      iframe_title: 'Visualizador do currículo em PDF',
      download_aria: 'Baixar PDF',
      fallback_date: 'ver PDF',
      schedule_panel_title: 'Agenda Semanal',
      schedule_hint: 'Todos os horários em horário de Brasília (UTC-3). Compromissos fixos mais os eventos avulsos da semana, atualizados semanalmente — sujeito a mudanças.',
      schedule_days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      upcoming_title: 'Próximos eventos',
      margin_line: (s, e, until) => `Margem: +${s} min no início · +${e} min no fim (até ${until})`,
    },
  };

  let lastUpdatedISO = null;

  function formatDate(iso, lang) {
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    return lang === 'pt'
      ? d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  function applyLanguage(lang) {
    const t = translations[lang] || translations.en;

    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = t.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t.description);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html') + '_html';
      if (t[key] != null) el.innerHTML = t[key];
    });

    const iframe = document.getElementById('cv-iframe');
    if (iframe) iframe.title = t.iframe_title;

    const filenameLabel = document.getElementById('cv-filename-label');
    if (filenameLabel) filenameLabel.textContent = t.filename;

    const navDownload = document.getElementById('download-nav-link');
    if (navDownload) {
      navDownload.href = 'cv.pdf';
      navDownload.setAttribute('download', t.filename);
    }
    [document.getElementById('download-btn'), document.getElementById('download-panel-link')].forEach((a) => {
      if (a) a.setAttribute('download', t.filename);
    });
    const panelDownload = document.getElementById('download-panel-link');
    if (panelDownload) panelDownload.setAttribute('aria-label', t.download_aria);

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    const dateEl = document.getElementById('last-updated');
    if (dateEl) dateEl.textContent = formatDate(lastUpdatedISO, lang) || t.fallback_date;

    if (typeof window.renderSchedule === 'function') window.renderSchedule(t.schedule_days, t.margin_line);
    if (typeof window.renderUpcoming === 'function') window.renderUpcoming(lang, t.upcoming_title);

    try { localStorage.setItem('cv-lang', lang); } catch (e) { /* storage unavailable */ }
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
  });

  fetch('last-updated.json', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => { if (data && data.date) lastUpdatedISO = data.date; })
    .catch(() => {})
    .finally(() => {
      let initialLang = 'en';
      try {
        const stored = localStorage.getItem('cv-lang');
        if (stored === 'en' || stored === 'pt') initialLang = stored;
      } catch (e) { /* storage unavailable */ }
      applyLanguage(initialLang);
    });
})();

// ---------- Weekly schedule grid ----------
(function () {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;

  const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const START_HOUR = 6;
  const END_HOUR = 24;
  const HOURS = END_HOUR - START_HOUR; // 18 hourly rows

  // JS Date.getDay(): 0=Sun..6=Sat — map to our Monday-first index (0=Mon..6=Sun).
  const todayIndex = (new Date().getDay() + 6) % 7;

  function todayISO() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  }

  function hourLabel(h) {
    const hh = Math.floor(h) % 24;
    return `${String(hh).padStart(2, '0')}:00`;
  }

  // Accepts a whole hour (13) or an exact 'HH:MM' string ('13:30'); returns minutes.
  function toMinutes(v) {
    if (typeof v === 'string' && v.includes(':')) {
      const [h, m] = v.split(':').map(Number);
      return h * 60 + (m || 0);
    }
    return Math.round(Number(v) * 60);
  }

  function fmtMinutes(min) {
    const h = Math.floor(min / 60) % 24;
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // Floating tooltip (one shared element).
  const tip = document.createElement('div');
  tip.className = 'sg-tooltip';
  tip.hidden = true;
  document.body.appendChild(tip);
  function showTip(block) {
    tip.innerHTML = '';
    const lines = JSON.parse(block.dataset.tip);
    lines.forEach((text, i) => {
      const el = document.createElement('div');
      el.className = i === 0 ? 'sg-tooltip-title' : i === 1 ? 'sg-tooltip-time' : 'sg-tooltip-margin';
      el.textContent = text;
      tip.appendChild(el);
    });
    tip.hidden = false;
    const r = block.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tr.width - 8));
    let top = r.top - tr.height - 8;
    if (top < 8) top = r.bottom + 8;
    tip.style.left = `${left + window.scrollX}px`;
    tip.style.top = `${top + window.scrollY}px`;
  }
  function hideTip() { tip.hidden = true; }
  window.addEventListener('scroll', hideTip, { passive: true });

  window.renderSchedule = function (dayLabels, marginLine) {
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    const corner = document.createElement('div');
    corner.className = 'sg-corner';
    frag.appendChild(corner);

    dayLabels.forEach((label, i) => {
      const el = document.createElement('div');
      el.className = 'sg-day-header' + (i === todayIndex ? ' is-today' : '');
      el.style.gridColumn = String(i + 2);
      el.textContent = label;
      frag.appendChild(el);
    });

    for (let h = 0; h < HOURS; h++) {
      const label = document.createElement('div');
      label.className = 'sg-hour';
      label.style.gridRow = String(h + 2);
      label.textContent = hourLabel(START_HOUR + h);
      frag.appendChild(label);

      for (let d = 0; d < 7; d++) {
        const cell = document.createElement('div');
        cell.className = 'sg-cell' + (d === todayIndex ? ' is-today-col' : '');
        cell.style.gridColumn = String(d + 2);
        cell.style.gridRow = String(h + 2);
        frag.appendChild(cell);
      }
    }

    const today = todayISO();
    const events = (Array.isArray(window.SCHEDULE_EVENTS) ? window.SCHEDULE_EVENTS : [])
      .filter((ev) => !ev.until || today <= ev.until)
      .map((ev) => ({
        ev,
        dayIdx: DAY_KEYS.indexOf(ev.day),
        startMin: toMinutes(ev.start),
        endMin: toMinutes(ev.end),
        start: Math.max(START_HOUR, Math.floor(toMinutes(ev.start) / 60)),
        end: Math.min(END_HOUR, Math.ceil(toMinutes(ev.end) / 60)),
      }))
      .filter((e) => e.dayIdx !== -1 && e.end > e.start);

    // Overlapping events on the same day are laid out side by side in lanes.
    for (let d = 0; d < 7; d++) {
      const dayEvents = events.filter((e) => e.dayIdx === d).sort((a, b) => a.start - b.start || a.end - b.end);
      let cluster = [];
      let clusterEnd = -1;
      const flush = () => {
        const laneEnds = [];
        cluster.forEach((e) => {
          let lane = laneEnds.findIndex((end) => end <= e.start);
          if (lane === -1) { lane = laneEnds.length; laneEnds.push(0); }
          laneEnds[lane] = e.end;
          e.lane = lane;
        });
        cluster.forEach((e) => { e.lanes = laneEnds.length; });
        cluster = [];
      };
      dayEvents.forEach((e) => {
        if (cluster.length && e.start >= clusterEnd) flush();
        cluster.push(e);
        clusterEnd = Math.max(clusterEnd, e.end);
      });
      if (cluster.length) flush();
    }

    const margin = Object.assign({ start: 0, end: 10 }, window.SCHEDULE_MARGIN || {});

    events.forEach(({ ev, dayIdx, start, end, startMin, endMin, lane, lanes }) => {
      const block = document.createElement('div');
      block.className = 'sg-event' + (ev.color ? ` color-${ev.color}` : '');
      block.style.gridColumn = String(dayIdx + 2);
      block.style.gridRow = `${start - START_HOUR + 2} / ${end - START_HOUR + 2}`;
      if (lanes > 1) {
        block.style.width = `calc((100% - 8px) / ${lanes} - 2px)`;
        block.style.marginLeft = `calc(4px + (100% - 8px) * ${lane} / ${lanes})`;
        block.style.marginRight = '0';
        block.style.justifySelf = 'start';
        block.style.padding = '6px 5px';
      }
      const text = document.createElement('span');
      text.textContent = ev.label || '';
      const mStart = ev.marginStart ?? margin.start;
      const mEnd = ev.marginEnd ?? margin.end;
      block.dataset.tip = JSON.stringify([
        ev.label || '',
        `${fmtMinutes(startMin)} – ${fmtMinutes(endMin)}`,
        marginLine ? marginLine(mStart, mEnd, fmtMinutes(endMin + mEnd)) : '',
      ].filter(Boolean));
      block.tabIndex = 0;
      block.addEventListener('mouseenter', () => showTip(block));
      block.addEventListener('mouseleave', hideTip);
      block.addEventListener('focus', () => showTip(block));
      block.addEventListener('blur', hideTip);
      block.appendChild(text);
      frag.appendChild(block);
    });

    grid.appendChild(frag);
  };

  // ---------- Upcoming events list ----------
  window.renderUpcoming = function (lang, title) {
    const box = document.getElementById('upcoming');
    if (!box) return;
    const today = todayISO();
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
    const items = (Array.isArray(window.UPCOMING_EVENTS) ? window.UPCOMING_EVENTS : [])
      .map((ev) => {
        const days = ev.dates ? ev.dates.slice().sort() : [ev.start, ev.end || ev.start];
        return { ev, first: days[0], last: days[days.length - 1] };
      })
      .filter((e) => e.first && e.last >= today)
      .sort((a, b) => (a.first < b.first ? -1 : 1));

    box.innerHTML = '';
    box.hidden = items.length === 0;
    if (!items.length) return;

    const fmt = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString(locale,
      lang === 'pt' ? { day: '2-digit', month: '2-digit' } : { month: 'short', day: 'numeric' });
    const h = document.createElement('h3');
    h.className = 'upcoming-title';
    h.textContent = title;
    box.appendChild(h);

    const ul = document.createElement('ul');
    ul.className = 'upcoming-list';
    items.forEach(({ ev }) => {
      let when;
      if (ev.dates) {
        const parts = ev.dates.slice().sort().map(fmt);
        when = parts.length > 1 ? parts.slice(0, -1).join(', ') + (lang === 'pt' ? ' e ' : ' & ') + parts[parts.length - 1] : parts[0];
      } else {
        when = ev.end && ev.end !== ev.start ? `${fmt(ev.start)} – ${fmt(ev.end)}` : fmt(ev.start);
      }
      const li = document.createElement('li');
      const d = document.createElement('span');
      d.className = 'upcoming-date';
      d.textContent = when;
      const l = document.createElement('span');
      l.className = 'upcoming-label';
      l.textContent = ev.label || '';
      li.append(d, l);
      ul.appendChild(li);
    });
    box.appendChild(ul);
  };
})();

// ---------- Three.js background (loss-landscape wireframe) ----------
(function () {
  const canvas = document.getElementById('bg-canvas');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || reduceMotion || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 42, 92);
  camera.lookAt(0, -6, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  group.position.y = -14;
  scene.add(group);

  const isSmall = window.innerWidth < 640;
  const SIZE = 150;
  const SEGMENTS = isSmall ? 46 : 72;

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
  geometry.rotateX(-Math.PI / 2);

  const posAttr = geometry.attributes.position;
  const baseX = new Float32Array(posAttr.count);
  const baseZ = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    baseX[i] = posAttr.getX(i);
    baseZ[i] = posAttr.getZ(i);
  }

  // A loss-surface-like height field: a broad central basin (the minimum)
  // plus a few overlapping ridges, so it reads as an optimization landscape.
  function height(x, z, t) {
    const r2 = x * x + z * z;
    const basin = -22 * Math.exp(-r2 / 2600);
    const ridgeA = 6 * Math.sin(x * 0.07 + t * 0.15) * Math.cos(z * 0.06 - t * 0.1);
    const ridgeB = 3.2 * Math.sin(x * 0.12 - z * 0.09 + t * 0.2);
    const ripple = 1.4 * Math.sin((x + z) * 0.2 + t * 0.4);
    return basin + ridgeA + ridgeB + ripple;
  }

  const material = new THREE.MeshBasicMaterial({
    color: 0x6672e0,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  const terrain = new THREE.Mesh(geometry, material);
  group.add(terrain);

  // Gradient-descent marker: a small glowing point spiraling into the minimum,
  // then resetting — a nod to optimization/training.
  const markerGeo = new THREE.SphereGeometry(1.15, 16, 16);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0x9aa3ff, transparent: true, opacity: 0.95 });
  const marker = new THREE.Mesh(markerGeo, markerMat);
  group.add(marker);

  const glowGeo = new THREE.SphereGeometry(2.6, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x6672e0, transparent: true, opacity: 0.18 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  marker.add(glow);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  const CYCLE = 14; // seconds per descent loop

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    for (let i = 0; i < posAttr.count; i++) {
      posAttr.setY(i, height(baseX[i], baseZ[i], t));
    }
    posAttr.needsUpdate = true;

    const phase = (t % CYCLE) / CYCLE;
    const radius = 46 * (1 - phase) + 1.5;
    const angle = t * 0.6;
    const mx = Math.cos(angle) * radius;
    const mz = Math.sin(angle) * radius;
    marker.position.set(mx, height(mx, mz, t) + 1.4, mz);

    group.rotation.y += 0.0009;

    camera.position.x += (mouseX * 10 - camera.position.x) * 0.015;
    camera.position.y += (42 - mouseY * 6 - camera.position.y) * 0.015;
    camera.lookAt(0, -8, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
