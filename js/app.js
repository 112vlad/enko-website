/* ── CURSOR (bowtie papion) ── */
const papionCur = document.getElementById('papion-cur');
let _pcx = 0, _pcy = 0, _pcScale = 1, _pcTargetScale = 1, _pcPhase = 0;
let _bowtieLive = false;

document.addEventListener('mousemove', e => {
  _pcx = e.clientX; _pcy = e.clientY;
  papionCur.style.left = _pcx + 'px';
  papionCur.style.top = _pcy + 'px';
  if (_bowtieLive && Math.random() > 0.5) {
    const col = _pcTargetScale > 1 ? [168, 184, 120] : [184, 173, 152];
    _particles.push({
      x: _pcx + (Math.random() - 0.5) * 10,
      y: _pcy + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1.8,
      vy: -Math.random() * 2 - 0.3,
      life: 1, sz: Math.ceil(2 + Math.random() * 4), col
    });
  }
});

(function papionLoop() {
  _pcPhase += 0.05;
  _pcScale += (_pcTargetScale - _pcScale) * 0.08;
  const bounce = Math.sin(_pcPhase * 0.13) * 4;
  papionCur.style.transform = `translate(-50%,calc(-50% + ${bounce}px)) scale(${_pcScale})`;
  requestAnimationFrame(papionLoop);
})();

/* ── GLOBAL PARTICLE OVERLAY ── */
const _pOverlay = document.getElementById('particle-overlay');
const _pCtx = _pOverlay.getContext('2d');
const _particles = [];

function _resizeOverlay() {
  _pOverlay.width = window.innerWidth;
  _pOverlay.height = window.innerHeight;
}
_resizeOverlay();
window.addEventListener('resize', _resizeOverlay);

(function particleLoop() {
  _pCtx.clearRect(0, 0, _pOverlay.width, _pOverlay.height);
  for (let i = _particles.length - 1; i >= 0; i--) {
    const p = _particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 0.03;
    if (p.life <= 0) { _particles.splice(i, 1); continue; }
    _pCtx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.life * 0.85})`;
    _pCtx.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz);
  }
  requestAnimationFrame(particleLoop);
})();

function activateBowtie() {
  papionCur.style.display = 'block';
  document.body.style.cursor = 'none';
  _bowtieLive = true;
}

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

  /* deactivate bowtie and restore native cursor */
  _bowtieLive = false;
  papionCur.style.display = 'none';
  document.body.style.cursor = '';

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
const PAGE_ORDER = { main: 0, community: 1, pfp: 2 };
let currentPage = 'main';

function navigateTo(to, onEnter) {
  const from = currentPage;
  if (from === to) return;
  currentPage = to;

  const forward = PAGE_ORDER[to] > PAGE_ORDER[from];
  const fromEl = document.getElementById('page-' + from);
  const toEl   = document.getElementById('page-' + to);

  /* snap incoming page to its off-screen starting position (no transition) */
  toEl.style.transition = 'none';
  toEl.style.transform  = forward ? 'translateX(100%)' : 'translateX(-100%)';
  toEl.style.opacity    = '0';
  toEl.style.pointerEvents = 'none';
  toEl.offsetHeight; /* force reflow */
  toEl.style.transition = '';

  /* animate incoming page into view */
  toEl.style.transform  = 'none';
  toEl.style.opacity    = '1';
  toEl.style.pointerEvents = 'auto';
  if (to !== 'main') {
    toEl.style.overflowX = 'hidden';
    setTimeout(() => { if (currentPage === to) toEl.style.overflowY = 'auto'; }, 560);
    toEl.scrollTop = 0;
  }

  /* animate outgoing page off-screen */
  fromEl.style.transform  = forward ? 'translateX(-100%)' : 'translateX(100%)';
  fromEl.style.opacity    = '0';
  fromEl.style.pointerEvents = 'none';

  /* after transition: reset outgoing sub-page to default right position */
  if (from !== 'main') {
    setTimeout(() => {
      fromEl.style.transition = 'none';
      fromEl.style.transform  = 'translateX(100%)';
      fromEl.style.overflowY  = 'hidden';
      fromEl.offsetHeight;
      fromEl.style.transition = '';
    }, 600);
  }

  if (onEnter) onEnter();
}

function goToPfp()      { navigateTo('pfp', () => { if (typeof initWardrobeDefaults === 'function') initWardrobeDefaults(); }); }
function goToCommunity(){ navigateTo('community'); }
function goToMain()     { navigateTo('main'); }

document.getElementById('nav-pfp-link').addEventListener('click', e => { e.preventDefault(); goToPfp(); });
document.getElementById('nav-community-link').addEventListener('click', e => { e.preventDefault(); goToCommunity(); });
document.getElementById('card-wardrobe-btn').addEventListener('click', goToPfp);

// New navigation links from wardrobe page topbar
document.getElementById('nav-main-link-pfp')?.addEventListener('click', e => { e.preventDefault(); goToMain(); });
document.getElementById('nav-community-link-pfp')?.addEventListener('click', e => { e.preventDefault(); goToCommunity(); });
document.getElementById('pfp-mark-link')?.addEventListener('click', e => { e.preventDefault(); goToMain(); });

// New navigation links from community page topbar
document.getElementById('nav-main-link-community')?.addEventListener('click', e => { e.preventDefault(); goToMain(); });
document.getElementById('nav-wardrobe-link-community')?.addEventListener('click', e => { e.preventDefault(); goToPfp(); });
document.getElementById('community-mark-link')?.addEventListener('click', e => { e.preventDefault(); goToMain(); });

// Keep support for old back buttons (for backward compatibility)
document.getElementById('back-btn')?.addEventListener('click', goToMain);
document.getElementById('community-back-btn')?.addEventListener('click', goToMain);

document.querySelectorAll('.mark').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    goToMain();
  });
});

/* ── EXTRA NAV WIRING ── */
document.getElementById('wardrobe-cta-btn')?.addEventListener('click', goToPfp);
document.getElementById('footer-wardrobe-link')?.addEventListener('click', e => { e.preventDefault(); goToPfp(); });
document.getElementById('community-cta-btn')?.addEventListener('click', goToCommunity);

/* ── THEME TOGGLE ── */
document.documentElement.setAttribute('data-theme', 'dark');

/* ── CONTRACT ADDRESS COPY ── */
const ENKO_CA = ''; /* paste CA here when live */

(function initCA() {
  const text = document.getElementById('ca-text-chart');
  const btn  = document.getElementById('ca-copy-chart');
  if (!text || !btn) return;
  if (ENKO_CA) {
    text.textContent = ENKO_CA.slice(0, 4) + '…' + ENKO_CA.slice(-4);
    text.style.color = 'var(--ink-soft)';
    btn.style.display = 'inline-block';
  }
})();

function copyCA() {
  if (!ENKO_CA) return;
  navigator.clipboard.writeText(ENKO_CA).then(() => showToast('Copied'));
}

function shareOnX() {
  window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function showToast(msg) {
  const t = document.getElementById('copy-toast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(12px)';
  }, 1800);
}
