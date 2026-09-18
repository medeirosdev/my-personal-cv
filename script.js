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
      schedule_hint: 'All times in Brasília time (UTC-3). Fixed commitments only — subject to change.',
      schedule_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      schedule_hint: 'Todos os horários em horário de Brasília (UTC-3). Apenas compromissos fixos — sujeito a mudanças.',
      schedule_days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
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

    if (typeof window.renderSchedule === 'function') window.renderSchedule(t.schedule_days);

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

  function hourLabel(h) {
    const hh = Math.floor(h) % 24;
    return `${String(hh).padStart(2, '0')}:00`;
  }

  window.renderSchedule = function (dayLabels) {
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

    const events = Array.isArray(window.SCHEDULE_EVENTS) ? window.SCHEDULE_EVENTS : [];
    events.forEach((ev) => {
      const dayIdx = DAY_KEYS.indexOf(ev.day);
      if (dayIdx === -1) return;
      const start = Math.max(START_HOUR, Math.round(Number(ev.start)));
      const end = Math.min(END_HOUR, Math.round(Number(ev.end)));
      if (!(end > start)) return;

      const block = document.createElement('div');
      block.className = 'sg-event' + (ev.color ? ` color-${ev.color}` : '');
      block.style.gridColumn = String(dayIdx + 2);
      block.style.gridRow = `${start - START_HOUR + 2} / ${end - START_HOUR + 2}`;
      const text = document.createElement('span');
      text.textContent = ev.label || '';
      block.title = ev.label || '';
      block.appendChild(text);
      frag.appendChild(block);
    });

    grid.appendChild(frag);
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
