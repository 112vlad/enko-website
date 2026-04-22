/* ── CURSOR (bowtie papion) ── */
const papionCur = document.getElementById('papion-cur');
let _pcx = 0, _pcy = 0, _pcScale = 1, _pcTargetScale = 1, _pcPhase = 0;

document.addEventListener('mousemove', e => {
  _pcx = e.clientX; _pcy = e.clientY;
  papionCur.style.left = _pcx + 'px';
  papionCur.style.top = _pcy + 'px';
});

(function papionLoop() {
  _pcPhase += 0.05;
  _pcScale += (_pcTargetScale - _pcScale) * 0.08;
  const bounce = Math.sin(_pcPhase * 0.13) * 4;
  papionCur.style.transform = `translate(-50%,calc(-50% + ${bounce}px)) scale(${_pcScale})`;
  requestAnimationFrame(papionLoop);
})();

/* ── GATE → MAIN ── */
let entered = false;
function enterMain() {
  if (entered) return;
  entered = true;
  const entry = document.getElementById('entry');
  const main = document.getElementById('main');

  /* no flash — just fade out cleanly */
  entry.style.transition = 'opacity .5s';
  entry.style.opacity = '0';

  /* hide bowtie cursor on main page */
  papionCur.style.display = 'none';

  main.style.display = 'block';
  requestAnimationFrame(() => requestAnimationFrame(() => main.classList.add('vis')));

  setTimeout(() => { entry.style.display = 'none'; }, 500);

  setTimeout(() => initCharts(), 800);
}

/* ── IMAGE LOADER (fetch→blob to prevent canvas taint) ── */
const _imgCache = {};
function loadImg(src) {
  if (_imgCache[src]) return Promise.resolve(_imgCache[src]);
  return fetch(src).then(r => r.blob()).then(blob => {
    const url = URL.createObjectURL(blob);
    return new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => { _imgCache[src] = i; res(i); };
      i.onerror = rej;
      i.src = url;
    });
  });
}

/* ── PAGE NAVIGATION ── */
function goToPfp() {
  document.getElementById('page-main').classList.add('pg-off');
  const pfp = document.getElementById('page-pfp');
  pfp.classList.add('pg-on');
  pfp.scrollTop = 0;
  /* trigger lakers default on first open (defined in wardrobe.js) */
  if (typeof initWardrobeDefaults === 'function') initWardrobeDefaults();
}
function goToMain() {
  document.getElementById('page-main').classList.remove('pg-off');
  document.getElementById('page-pfp').classList.remove('pg-on');
}

document.getElementById('nav-pfp-link').addEventListener('click', e => { e.preventDefault(); goToPfp(); });
document.getElementById('card-wardrobe-btn').addEventListener('click', goToPfp);
document.getElementById('back-btn').addEventListener('click', goToMain);

/* ── EXTRA NAV WIRING ── */
document.getElementById('wardrobe-cta-btn')?.addEventListener('click', goToPfp);
document.getElementById('footer-wardrobe-link')?.addEventListener('click', e => { e.preventDefault(); goToPfp(); });

/* ── THEME TOGGLE ── */
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('enko-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-btn');
  if (btn) {
    btn.textContent = saved === 'dark' ? 'Light' : 'Dark';
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('enko-theme', next);
      btn.textContent = next === 'dark' ? 'Light' : 'Dark';
    });
  }
})();
