/* =========================================================
   MMGA Records — main.js
   ========================================================= */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const loaderBar = loader?.querySelector('.loader__bar');
  const loaderLetters = loader?.querySelectorAll('.loader__text span');
  const loaderEm = loader?.querySelector('.loader__text em');

  function runLoader(done) {
    if (!loader) return done();
    if (reduceMotion) {
      loader.classList.add('is-done');
      setTimeout(done, 200);
      return;
    }
    loaderBar.animate(
      [{ width: '0%' }, { width: '100%' }],
      { duration: 1100, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }
    );
    loaderLetters.forEach((s, i) => {
      s.animate(
        [{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 700, delay: 120 + i * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
      );
    });
    loaderEm?.animate(
      [{ transform: 'translateY(20px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 600, delay: 600, easing: 'ease-out', fill: 'forwards' }
    );
    setTimeout(() => {
      loader.classList.add('is-done');
      done();
    }, 1300);
  }

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  function initLenis() {
    if (reduceMotion || !window.Lenis) return;
    lenis = new window.Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
    }
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (window.matchMedia('(max-width:900px)').matches || reduceMotion) return;
    const dot = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a, button, [data-cursor="hover"]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- Nav scroll state ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    burger?.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      menu.classList.remove('is-open');
    }));

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -40 });
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- Hero entry animation ---------- */
  function animateHero() {
    if (!window.gsap) return;
    const words = document.querySelectorAll('.hero__title .word');
    if (!words.length) return;
    if (reduceMotion) {
      words.forEach(w => w.style.transform = 'none');
      return;
    }
    gsap.set(words, { yPercent: 110, rotate: 4 });
    gsap.to(words, {
      yPercent: 0, rotate: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.1,
    });
    gsap.from('.hero__meta .tag', {
      y: 20, opacity: 0, duration: .8, stagger: .08, delay: .6, ease: 'power3.out',
    });
    gsap.from('.hero__bottom > *', {
      y: 20, opacity: 0, duration: .9, stagger: .12, delay: .8, ease: 'power3.out',
    });
    gsap.from('.hero__skyline path', {
      strokeDashoffset: 4000, strokeDasharray: 4000, duration: 2.4, ease: 'power3.inOut', delay: .4,
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.fade-up');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .15 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Manifest scroll-text reveal ---------- */
  function initManifest() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const sticky = document.querySelector('.manifest__sticky');
    const words = document.querySelectorAll('.manifest__text .word');
    if (!sticky || !words.length) return;
    if (reduceMotion) { words.forEach(w => w.classList.add('is-active')); return; }

    gsap.to(words, {
      onUpdate: function () {},
      ease: 'none',
      scrollTrigger: {
        trigger: '.manifest',
        start: 'top top',
        end: '+=180%',
        pin: '.manifest__sticky',
        scrub: true,
        onUpdate: self => {
          const idx = Math.floor(self.progress * words.length);
          words.forEach((w, i) => w.classList.toggle('is-active', i <= idx));
        },
      },
    });
  }

  /* ---------- Featured cover tilt ---------- */
  function initTilt() {
    if (window.matchMedia('(max-width:900px)').matches || reduceMotion) return;
    document.querySelectorAll('[data-tilt]').forEach(box => {
      const cover = box.querySelector('.featured__cover') || box.firstElementChild;
      if (!cover) return;
      box.addEventListener('mousemove', e => {
        const r = box.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cover.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(20px)`;
      });
      box.addEventListener('mouseleave', () => {
        cover.style.transform = '';
      });
    });
  }

  /* ---------- Artist preview ---------- */
  function initArtistPreview() {
    if (window.matchMedia('(max-width:900px)').matches) return;
    const preview = document.getElementById('artistPreview');
    const inner = preview?.querySelector('.artist-preview__inner');
    const rows = document.querySelectorAll('.artist-row[data-img]');
    if (!preview || !inner) return;
    let mx = 0, my = 0, vx = 0, vy = 0;
    let active = false;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function loop() {
      vx += (mx - vx) * 0.18;
      vy += (my - vy) * 0.18;
      preview.style.transform = `translate(${vx}px, ${vy}px) translate(-50%,-50%) scale(${active ? 1 : 0.9})`;
      requestAnimationFrame(loop);
    }
    loop();

    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        active = true;
        preview.classList.add('is-active');
        inner.setAttribute('data-img', row.dataset.img);
      });
      row.addEventListener('mouseleave', () => {
        active = false;
        preview.classList.remove('is-active');
      });
    });
  }

  /* ---------- Number counter ---------- */
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = el.dataset.count;
      const num = parseInt(target, 10);
      if (Number.isNaN(num)) return;
      const isPadded = /^0\d/.test(target);
      const len = target.length;
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const dur = 1400, start = performance.now();
            function step(now) {
              const p = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              const v = Math.round(num * eased);
              el.textContent = isPadded ? String(v).padStart(len, '0') : v;
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            obs.unobserve(el);
          }
        });
      }, { threshold: .4 });
      io.observe(el);
    });
  }

  /* ---------- Big-text parallax ---------- */
  function initParallax() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        xPercent: speed * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* ---------- Join card glow follow ---------- */
  function initJoinCards() {
    document.querySelectorAll('.join-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Section fade-ups ---------- */
  function autoFadeUp() {
    const targets = document.querySelectorAll(
      '.section-head, .featured__text > *, .release, .stats li, .join-card, .contact__grid > div, .footer__top, .artist-bio > *, .artist-discog > *'
    );
    targets.forEach(el => el.classList.add('fade-up'));
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    autoFadeUp();
    runLoader(() => {
      initLenis();
      initCursor();
      initNav();
      animateHero();
      initManifest();
      initTilt();
      initArtistPreview();
      initCounters();
      initParallax();
      initJoinCards();
      initReveal();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });
})();
