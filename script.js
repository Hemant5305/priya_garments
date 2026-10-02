(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

   /* Header: glass effect, hide on scroll down, progress bar, active link */
  const header = $('#siteHeader');
  const bar = $('#progress');
    let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    ticking = false;
  };
  onScroll();
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

    const navLinks = $$('.links a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id === 'home' ? 'top' : e.target.id;
      navLinks.forEach((a) =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  [$('.hero'), $('#about'), $('#collections'), $('#visit')].forEach((s) => s && spy.observe(s));

  /* Mobile menu */
  const burger = $('#burger');
  const menu = $('#mobileMenu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* Collections: tabs (first one always open) */
  $$('[data-coll]').forEach((coll) => {
    const tabs = $$('[role="tab"]', coll);
    const panels = $$('[role="tabpanel"]', coll);
    const select = (i, focus) => {
      tabs.forEach((t, n) => {
        const on = n === i;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (step) { e.preventDefault(); select((i + step + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    select(0);
  });
    /* Collections: arrow buttons slide the visible row */
  $$('[data-coll]').forEach((coll) => {
    const prev = $('.arrow.prev', coll), next = $('.arrow.next', coll);
    if (!prev || !next) return;
    const track = () => $('.tpanel:not([hidden]) .tiles', coll);
    const sync = () => {
      const t = track();
      prev.disabled = t.scrollLeft < 4;
      next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
    };
    const go = (dir) => track().scrollBy({ left: dir * track().clientWidth * 0.8, behavior: 'smooth' });
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    $$('.tiles', coll).forEach((t) => t.addEventListener('scroll', sync, { passive: true }));
    $$('[role="tab"]', coll).forEach((t) => {
      t.addEventListener('click', sync);
      t.addEventListener('keyup', sync);
    });
    window.addEventListener('resize', sync);
    sync();
  });
    /* About: split heading into words, reveal on scroll, count up numbers */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = new Intl.NumberFormat('en-IN');

  $$('.split').forEach((h) => {
    const text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.innerHTML = text.split(/\s+/).map((w, i) =>
      `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`
    ).join(' ');
  });

  const countUp = (el) => {
    const to = +el.dataset.count;
    const from = +(el.dataset.from || 0);
    const final = el.dataset.final || (to >= 10000 ? fmt.format(to) : to);
    if (reduce) { el.textContent = final; return; }
    const dur = 1800, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const v = Math.round(from + (to - from) * eased);
      el.textContent = to >= 10000 ? fmt.format(v) : v;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = final;
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });

  $$('.reveal, .split').forEach((el) => io.observe(el));
})();