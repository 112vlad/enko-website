/* ══════════════════════════════════════
   ENKO — PFP maker / wardrobe
══════════════════════════════════════ */

const BG_LIST = [
  { src: 'pfp/backgrounds/background1.jpg', name: 'SAVANNA' },
  { src: 'pfp/backgrounds/background2.jpg', name: 'HORIZON' },
];
const ACCS_LIST = [
  { src: 'pfp/accs/bloods.png',     name: 'BLOODS' },
  { src: 'pfp/accs/chrome.png',     name: 'CHROME' },
  { src: 'pfp/accs/crips.png',      name: 'CRIPS' },
  { src: 'pfp/accs/dolce.png',      name: 'DOLCE' },
  { src: 'pfp/accs/fedora.png',     name: 'FEDORA' },
  { src: 'pfp/accs/fire.png',       name: 'FIRE' },
  { src: 'pfp/accs/gawn.png',       name: 'GAWN' },
  { src: 'pfp/accs/lakers.png',     name: 'LAKERS' },
  { src: 'pfp/accs/netanyahu.png',  name: 'NETANYAHU' },
  { src: 'pfp/accs/round.png',      name: 'ROUND' },
  { src: 'pfp/accs/sharped.png',    name: 'SHARPED' },
];
const BOW_LIST = [
  { src: 'pfp/bowtie/bacon.png',      name: 'BACON' },
  { src: 'pfp/bowtie/dollar.png',     name: 'DOLLAR' },
  { src: 'pfp/bowtie/israel.png',     name: 'ISRAEL' },
  { src: 'pfp/bowtie/jhon pork.png',  name: 'JHON PORK' },
  { src: 'pfp/bowtie/lego.png',       name: 'LEGO' },
  { src: 'pfp/bowtie/lightning.png',  name: 'LIGHTNING' },
  { src: 'pfp/bowtie/pumpfun.png',    name: 'PUMPFUN' },
  { src: 'pfp/bowtie/shark.png',      name: 'SHARK' },
  { src: 'pfp/bowtie/spiked.png',     name: 'SPIKED' },
  { src: 'pfp/bowtie/superhero.png',  name: 'SUPERHERO' },
  { src: 'pfp/bowtie/taco.png',       name: 'TACO' },
  { src: 'pfp/bowtie/usa.png',        name: 'USA' },
  { src: 'pfp/bowtie/wine.png',       name: 'WINE' },
];
const CAT_MAP = {
  characters:  { list: ACCS_LIST, type: 'gf',  label: 'Characters' },
  backgrounds: { list: BG_LIST,   type: 'bg',  label: 'Backgrounds' },
  accessories: { list: BOW_LIST,  type: 'bow', label: 'Accessories' },
};

let sb = null, sg = null, sbow = null;
let btPos = { x: 500, y: 870 }, btSize = 320;
let _isDrag = false, _dragOff = { x: 0, y: 0 };
let _activeCat = 'characters';
let _wardrobeInited = false;

/* ── DEFAULT: select lakers on first open ── */
function initWardrobeDefaults() {
  if (_wardrobeInited) return;
  _wardrobeInited = true;
  const lakers = ACCS_LIST.find(x => x.name === 'LAKERS');
  if (lakers) {
    sg = lakers.src;
    setCategory('characters');
    updateSummary();
    render();
  }
}

/* ── GRID ── */
function buildCategory(cat) {
  const grid = document.getElementById('wd-grid');
  grid.innerHTML = '';
  const { list, type, label } = CAT_MAP[cat];

  /* update slot label */
  const slotLabel = document.getElementById('slot-label');
  if (slotLabel) slotLabel.textContent = label;

  /* update clear button visibility */
  const slotClear = document.getElementById('slot-clear');
  if (slotClear) {
    const hasSel = (type === 'bg' && sb) || (type === 'gf' && sg) || (type === 'bow' && sbow);
    slotClear.style.display = hasSel ? 'inline' : 'none';
  }

  /* swatch-grid class (bg-grid for 3-col cover images) */
  grid.className = 'swatch-grid' + (cat === 'backgrounds' ? ' bg-grid' : '');

  list.forEach((item, i) => {
    const isSel = (type === 'bg' && sb === item.src) ||
                  (type === 'gf' && sg === item.src) ||
                  (type === 'bow' && sbow === item.src);
    const d = document.createElement('div');
    d.className = 'swatch' + (isSel ? ' selected' : '');

    const imgStyle = cat === 'backgrounds'
      ? 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'
      : 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:6px';

    d.innerHTML = `
      <img src="${item.src}" alt="${item.name}" loading="lazy" style="${imgStyle}">
      <div class="swatch-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="swatch-name">${item.name.toLowerCase()}</div>`;

    d.onclick = () => {
      grid.querySelectorAll('.swatch').forEach(t => t.classList.remove('selected'));
      d.classList.add('selected');
      if (type === 'bg') sb = item.src;
      else if (type === 'gf') sg = item.src;
      else { sbow = item.src; btPos = { x: 500, y: 870 }; }
      if (slotClear) slotClear.style.display = 'inline';
      updateSummary();
      render();
    };
    grid.appendChild(d);
  });
}

function setCategory(cat) {
  _activeCat = cat;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  buildCategory(cat);
}

/* called by the clear button in slot-head */
function clearCurrentSlot() {
  const { type } = CAT_MAP[_activeCat];
  if (type === 'bg') sb = null;
  else if (type === 'gf') sg = null;
  else sbow = null;
  buildCategory(_activeCat);
  updateSummary();
  render();
}

document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => setCategory(t.dataset.cat)));
buildCategory('characters');

function updateSummary() {
  const bgN  = sb   ? (BG_LIST.find(x => x.src === sb)?.name.toLowerCase()   || '—') : '—';
  const chN  = sg   ? (ACCS_LIST.find(x => x.src === sg)?.name.toLowerCase() || '—') : '—';
  const bwN  = sbow ? (BOW_LIST.find(x => x.src === sbow)?.name.toLowerCase() || '—') : '—';

  /* summary list (right panel) */
  const selBg   = document.getElementById('sel-bg');
  const selChar = document.getElementById('sel-char');
  const selBow  = document.getElementById('sel-bow');
  if (selBg)   selBg.textContent   = bgN;
  if (selChar) selChar.textContent = chN;
  if (selBow)  selBow.textContent  = bwN;

  /* portrait-meta (below canvas) */
  const pmBg   = document.getElementById('pm-bg');
  const pmChar = document.getElementById('pm-char');
  const pmBow  = document.getElementById('pm-bow');
  if (pmBg)   pmBg.textContent   = bgN;
  if (pmChar) pmChar.textContent = chN;
  if (pmBow)  pmBow.textContent  = bwN;
}

/* ── CANVAS DRAG ── */
const _ppc = document.getElementById('ppc');
function _cv(e) {
  const r = _ppc.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (1000 / r.width), y: (e.clientY - r.top) * (1000 / r.height) };
}
_ppc.addEventListener('mousedown', e => {
  if (!sbow) return;
  const p = _cv(e), bow = _imgCache[sbow];
  if (!bow) return;
  const bh = btSize * (bow.height / bow.width);
  if (p.x >= btPos.x - btSize / 2 && p.x <= btPos.x + btSize / 2 &&
      p.y >= btPos.y - bh / 2 && p.y <= btPos.y + bh / 2) {
    _isDrag = true;
    _dragOff = { x: p.x - btPos.x, y: p.y - btPos.y };
    e.preventDefault();
  }
});
_ppc.addEventListener('mousemove', e => {
  if (_isDrag) {
    const p = _cv(e);
    btPos = { x: p.x - _dragOff.x, y: p.y - _dragOff.y };
    render();
  }
  if (sbow) {
    const bow = _imgCache[sbow]; if (!bow) return;
    const p = _cv(e), bh = btSize * (bow.height / bow.width);
    const over = p.x >= btPos.x - btSize / 2 && p.x <= btPos.x + btSize / 2 &&
                 p.y >= btPos.y - bh / 2 && p.y <= btPos.y + bh / 2;
    _ppc.style.cursor = over ? (_isDrag ? 'grabbing' : 'grab') : 'default';
  }
}, { passive: true });
window.addEventListener('mouseup', () => { _isDrag = false; });

/* ── RENDER ── */
async function render() {
  const c = _ppc, ctx = c.getContext('2d');
  c.width = c.height = 1000;
  c.style.display = 'block';
  const ph = document.getElementById('ph');
  if (ph) ph.style.display = 'none';
  ctx.clearRect(0, 0, 1000, 1000);

  if (sb) {
    try {
      const b = await loadImg(sb);
      const s = Math.max(1000 / b.width, 1000 / b.height);
      ctx.drawImage(b, (1000 - b.width * s) / 2, (1000 - b.height * s) / 2, b.width * s, b.height * s);
    } catch (_) {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-sunk') || '#24201a';
      ctx.fillRect(0, 0, 1000, 1000);
    }
  } else {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-sunk') || '#24201a';
    ctx.fillRect(0, 0, 1000, 1000);
  }

  if (sg) { try { const g = await loadImg(sg); ctx.drawImage(g, 0, 0, 1000, 1000); } catch (_) { } }

  const dragHint = document.getElementById('drag-hint');
  if (sbow) {
    try {
      const bow = await loadImg(sbow);
      const bh = btSize * (bow.height / bow.width);
      ctx.drawImage(bow, btPos.x - btSize / 2, btPos.y - bh / 2, btSize, bh);
      if (dragHint) dragHint.style.opacity = '0.65';
    } catch (_) { }
  } else {
    if (dragHint) dragHint.style.opacity = '0';
  }

  document.getElementById('dlbtn').disabled = !(sb || sg);
}

/* ── DOWNLOAD ── */
async function doDownload() {
  const dl = document.getElementById('dlbtn'), orig = dl.textContent;
  dl.textContent = 'Saving…'; dl.disabled = true;
  await render();
  try {
    await new Promise((res, rej) => {
      _ppc.toBlob(blob => {
        if (!blob) { rej(new Error('no blob')); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'enko-pfp.png'; a.href = url;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        res();
      }, 'image/png');
    });
    dl.textContent = '✓ Saved';
    setTimeout(() => { dl.textContent = orig; dl.disabled = !(sb || sg); }, 1600);
  } catch (_) {
    dl.textContent = orig; dl.disabled = !(sb || sg);
    alert('Could not save — try serving over http://');
  }
}

document.getElementById('dlbtn').addEventListener('click', doDownload);

/* ── RESET ── */
function doReset() {
  sb = null; sg = null; sbow = null;
  _ppc.getContext('2d').clearRect(0, 0, 1000, 1000);
  _ppc.style.display = 'none';
  const ph = document.getElementById('ph');
  if (ph) ph.style.display = 'flex';
  document.getElementById('dlbtn').disabled = true;
  const dragHint = document.getElementById('drag-hint');
  if (dragHint) dragHint.style.opacity = '0';
  btPos = { x: 500, y: 870 };
  buildCategory(_activeCat);
  updateSummary();
}

document.getElementById('rstbtn').addEventListener('click', doReset);
