(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const menu = document.getElementById('menu');
  const experience = document.getElementById('experience');
  const select = document.getElementById('slide-select');
  const stage = document.getElementById('stage');
  const animations = window.EcoAnimations;
  let index = 0, mode = 'menu', cleanupTimer = 0, touchStart = null;
  const pad = n => String(n).padStart(2, '0');
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', 'true');
    slide.inert = true;
    const option = document.createElement('option');
    option.value = i; option.textContent = `${pad(i + 1)} — ${slide.dataset.title}`; select.append(option);
  });
  animations.prepare();
  // Replace SVG src paths in index.html with local artwork photographs when available.
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    if (!img.dataset.fallback) {
      img.dataset.fallback = 'true'; img.src = 'assets/images/nature.svg';
      img.alt = 'Ilustração alternativa de natureza';
    } else img.style.visibility = 'hidden';
  }));
  function showSlide(nextIndex) {
    if (mode === 'menu' || !Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= slides.length) return;
    clearTimeout(cleanupTimer);
    slides.forEach(s => s.classList.remove('departing'));
    const previous = slides[index];
    const next = slides[nextIndex];
    if (previous === next && next.classList.contains('active')) { restartSlideAnimation(); return; }
    slides.forEach(s => {
      animations.leave(s); s.classList.remove('active'); s.setAttribute('aria-hidden', 'true'); s.inert = true;
    });
    if (previous !== next) previous.classList.add('departing');
    index = nextIndex;
    next.classList.add('active'); next.setAttribute('aria-hidden', 'false'); next.inert = false;
    animations.enter(next);
    const wipe = document.getElementById('leaf-wipe');
    wipe.classList.remove('running');
    if (next.dataset.transition === 'leaf' && !animations.reduced.matches) {
      void wipe.offsetWidth; wipe.classList.add('running');
    }
    cleanupTimer = setTimeout(() => { previous.classList.remove('departing'); wipe.classList.remove('running'); }, 1050);
    document.getElementById('counter').textContent = `${pad(index + 1)} / ${slides.length}`;
    document.getElementById('slide-name').textContent = next.dataset.title;
    document.getElementById('chapter').textContent = `${pad(index + 1)} / ${next.dataset.title.toUpperCase()}`;
    document.getElementById('progress').style.width = `${(index + 1) / slides.length * 100}%`;
    document.getElementById('prev').disabled = index === 0;
    document.getElementById('next').disabled = index === slides.length - 1;
    select.value = index;
    document.getElementById('announcement').textContent = `Slide ${index + 1} de ${slides.length}: ${next.dataset.title}`;
  }
  function nextSlide() { showSlide(index + 1); }
  function previousSlide() { showSlide(index - 1); }
  function restartSlideAnimation() { if (mode !== 'menu') animations.restart(slides[index]); }
  function enterMode(nextMode) {
    mode = nextMode;
    document.body.className = `${mode}-mode`;
    menu.hidden = true; experience.hidden = false;
    showSlide(0); stage.focus({ preventScroll: true });
  }
  function enterPresentationMode() { enterMode('presentation'); }
  function enterPreviewMode() { enterMode('preview'); }
  function backToMenu() {
    clearTimeout(cleanupTimer);
    slides.forEach(s => { animations.leave(s); s.classList.remove('active', 'departing'); s.inert = true; s.setAttribute('aria-hidden', 'true'); });
    document.getElementById('leaf-wipe').classList.remove('running');
    experience.hidden = true; menu.hidden = false;
    mode = 'menu'; document.body.className = 'menu-mode';
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    document.getElementById('start').focus();
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else document.getElementById('announcement').textContent = 'Tela cheia não está disponível neste navegador.';
    } catch { document.getElementById('announcement').textContent = 'O navegador não permitiu tela cheia. A apresentação continua funcionando.'; }
  }
  document.getElementById('start').addEventListener('click', enterPresentationMode);
  document.getElementById('demo').addEventListener('click', enterPreviewMode);
  document.getElementById('prev').addEventListener('click', previousSlide);
  document.getElementById('next').addEventListener('click', nextSlide);
  document.getElementById('restart').addEventListener('click', restartSlideAnimation);
  document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
  document.getElementById('back-menu').addEventListener('click', backToMenu);
  document.getElementById('end-menu').addEventListener('click', backToMenu);
  select.addEventListener('change', () => showSlide(Number(select.value)));
  document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => {
    showSlide(Number(button.dataset.jump)); stage.focus({preventScroll:true});
  }));
  document.addEventListener('keydown', event => {
    if (mode === 'menu' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape') { backToMenu(); return; }
    if (event.target.matches('select,input,textarea') || (event.target.closest('button') && [' ', 'Enter'].includes(event.key))) return;
    if (['ArrowRight', ' ', 'PageDown'].includes(event.key)) { event.preventDefault(); if (!event.repeat) nextSlide(); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); if (!event.repeat) previousSlide(); }
    if (event.key.toLowerCase() === 'r') restartSlideAnimation();
  });
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('button')) return;
    const t = event.touches[0]; touchStart = { x:t.clientX, y:t.clientY };
  }, {passive:true});
  stage.addEventListener('touchend', event => {
    if (!touchStart) return;
    const t = event.changedTouches[0], dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) dx < 0 ? nextSlide() : previousSlide();
  }, {passive:true});
  stage.addEventListener('touchcancel', () => touchStart = null, {passive:true});
  document.addEventListener('fullscreenchange', () => {
    document.querySelector('#fullscreen span').textContent = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
  });
  window.Ecoarte = { showSlide, nextSlide, previousSlide, restartSlideAnimation, enterPresentationMode, enterPreviewMode, backToMenu, getState: () => ({index, mode, total:slides.length}) };
})();
