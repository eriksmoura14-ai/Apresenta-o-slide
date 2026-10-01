/* Animation lifecycle is shared by both viewing modes. No background RAF loop. */
window.EcoAnimations = (() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  function prepare() {
    const forest = document.getElementById('forest');
    for (let i = 0; i < 9; i++) {
      const tree = document.createElement('div');
      tree.className = 'tree';
      tree.style.cssText = `left:${i * 10}%;height:${42 + (i * 17 % 50)}%;--delay:${i * .18}s`;
      tree.innerHTML = '<svg viewBox="0 0 100 220" aria-hidden="true"><path d="M50 220V75" stroke="#5b6145" stroke-width="5"/><ellipse cx="50" cy="76" rx="42" ry="70" fill="#788962"/><ellipse cx="43" cy="66" rx="27" ry="55" fill="#93a278"/><path d="M50 150L25 110M50 120L75 86" fill="none" stroke="#526b4b" stroke-width="2"/></svg>';
      forest.append(tree);
    }
    const leaves = document.getElementById('drifting-leaves');
    for (let i = 0; i < 15; i++) {
      const leaf = document.createElement('i');
      leaf.className = 'floating-leaf';
      leaf.style.cssText = `left:${44 + i * 3}%;top:${20 + i * 7 % 52}%;--delay:${i * .22}s`;
      leaves.append(leaf);
    }
    const fragments = document.getElementById('fragments');
    // An original abstract silhouette; not a reproduction of a Vik Muniz portrait.
    for (let i = 0; i < 125; i++) {
      const piece = document.createElement('i');
      piece.className = 'fragment';
      const head = i < 50;
      const angle = i * 2.399;
      const radius = Math.sqrt((i % 50) / 50);
      const x = head ? 50 + Math.cos(angle) * radius * 19 : 50 + Math.cos(angle) * radius * 36;
      const y = head ? 27 + Math.sin(angle) * radius * 23 : 70 + Math.sin(angle) * radius * 22;
      piece.style.cssText = `--x:${x}%;--y:${y}%;--w:${7 + i % 11}px;--dx:${(i * 97 % 500) - 250}px;--dy:${(i * 53 % 400) - 200}px;--rot:${i * 37}deg;--delay:${i % 15 * .06}s;--color:${['#67755a','#a5a47e','#c1b594','#3a5343'][i % 4]}`;
      fragments.append(piece);
    }
    const subtitle = document.querySelector('.cover .subtitle');
    const words = subtitle.textContent.split(' ');
    subtitle.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word'; span.style.setProperty('--word-delay', `${.7 + i * .12}s`);
      span.textContent = word; subtitle.append(span, document.createTextNode(' '));
    });
  }
  function enter(slide) {
    slide.classList.remove('run');
    requestAnimationFrame(() => { if (slide.classList.contains('active')) slide.classList.add('run'); });
  }
  function leave(slide) {
    slide.classList.remove('run');
    slide.querySelectorAll('img').forEach(img => img.style.removeProperty('translate'));
  }
  function restart(slide) {
    slide.classList.remove('active', 'run');
    void slide.offsetWidth;
    slide.classList.add('active');
    enter(slide);
  }
  const cursor = document.getElementById('cursor');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  function hideCursor() {
    cancelAnimationFrame(raf);
    root.classList.remove('custom-cursor');
    cursor.classList.remove('is-hover', 'is-pressed');
    cursor.style.opacity = '0';
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) return;
    const target = event.target instanceof Element ? event.target : null;
    // Native select popups live outside the page and retain the system pointer.
    if (target?.closest('select, input, textarea')) { hideCursor(); return; }
    root.classList.add('custom-cursor');
    cursor.style.opacity = '1';
    cursor.classList.toggle('is-hover', !!target?.closest('button:not(:disabled), a[href]'));
    cancelAnimationFrame(raf);
    const x = event.clientX, y = event.clientY;
    const update = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (reduced.matches) return;
      const image = document.querySelector('.active.land img, .active.smithson .artist-image img');
      if (image) image.style.translate = `${(x / innerWidth - .5) * 8}px ${(y / innerHeight - .5) * 5}px`;
    };
    if (reduced.matches) update();
    else raf = requestAnimationFrame(update);
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && root.classList.contains('custom-cursor')) cursor.classList.add('is-pressed');
  });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  document.addEventListener('pointercancel', hideCursor);
  document.addEventListener('mouseleave', hideCursor);
  window.addEventListener('blur', hideCursor);
  finePointer.addEventListener('change', hideCursor);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursor(); });
  return { prepare, enter, leave, restart, reduced };
})();
