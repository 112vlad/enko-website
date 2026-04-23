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
let currentPage = 'main'; // Track current page

function goToPfp() {
  const community = document.getElementById('page-community');
  const main = document.getElementById('page-main');
  const pfp = document.getElementById('page-pfp');
  
  community.classList.remove('pg-on', 'slide-from-left', 'slide-from-right');
  
  if (currentPage === 'main') {
    // Overview → Wardrobe: slide from right
    main.classList.add('pg-off', 'slide-right');
    pfp.classList.remove('slide-from-left', 'slide-from-right');
  } else if (currentPage === 'community') {
    // Community → Wardrobe: slide from left
    community.classList.add('slide-from-left');
    pfp.classList.remove('slide-from-right');
  }
  
  pfp.classList.add('pg-on');
  pfp.scrollTop = 0;
  currentPage = 'pfp';
  if (typeof initWardrobeDefaults === 'function') initWardrobeDefaults();
}

function goToCommunity() {
  const main = document.getElementById('page-main');
  const pfp = document.getElementById('page-pfp');
  const com = document.getElementById('page-community');
  
  pfp.classList.remove('pg-on', 'slide-from-left', 'slide-from-right');
  
  if (currentPage === 'main') {
    // Overview → Community: slide from right
    main.classList.add('pg-off', 'slide-right');
    com.classList.remove('slide-from-left');
  } else if (currentPage === 'pfp') {
    // Wardrobe → Community: slide from left
    pfp.classList.add('slide-from-right');
    com.classList.remove('slide-from-left');
  }
  
  com.classList.add('pg-on');
  com.scrollTop = 0;
  currentPage = 'community';
}

function goToMain() {
  const main = document.getElementById('page-main');
  const pfp = document.getElementById('page-pfp');
  const com = document.getElementById('page-community');
  
  main.classList.remove('slide-right', 'slide-left');
  
  if (currentPage === 'pfp') {
    // Wardrobe → Overview: slide in from left
    pfp.classList.add('slide-from-right');
  } else if (currentPage === 'community') {
    // Community → Overview: slide in from left
    com.classList.add('slide-from-left');
  }
  
  pfp.classList.remove('pg-on');
  com.classList.remove('pg-on');
  currentPage = 'main';
}

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
