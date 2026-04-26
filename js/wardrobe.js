/* ══════════════════════════════════════
   ENKO — PFP maker / wardrobe
══════════════════════════════════════ */

const BG_LIST = [
  { src: 'pfp/backgrounds/big ben.jpg',            name: 'BIG BEN' },
  { src: 'pfp/backgrounds/breaking bad.jpg',       name: 'BREAKING BAD', zoom: 1.50, posX: 287 },
  { src: 'pfp/backgrounds/cathedral.png',          name: 'CATHEDRAL' },
  { src: 'pfp/backgrounds/cn tower.jpg',           name: 'CN TOWER', posX: -395 },
  { src: 'pfp/backgrounds/colosseum.jpg',          name: 'COLOSSEUM', posX: -41 },
  { src: 'pfp/backgrounds/eiffel tower.jpg',       name: 'EIFFEL', zoom: 1.02, posX: 53 },
  { src: 'pfp/backgrounds/ichiraku ramen.jpeg',    name: 'ICHIRAKU', zoom: 1.08, posX: -102 },
  { src: 'pfp/backgrounds/mario.jpg',              name: 'MARIO', posX: 63 },
  { src: 'pfp/backgrounds/mugshot.jpg',            name: 'MUGSHOT' },
  { src: 'pfp/backgrounds/nether.png',             name: 'NETHER', posX: -11 },
  { src: 'pfp/backgrounds/nuketown.jpg',           name: 'NUKETOWN', posX: 117 },
  { src: 'pfp/backgrounds/metin2.png',             name: 'METIN2', zoom: 1.08, posX: 142 },
  { src: 'pfp/backgrounds/moon.jpg',               name: 'MOON', posX: 142 },
  { src: 'pfp/backgrounds/pleasant park.jpg',      name: 'PLEASANT PARK', posX: -93 },
  { src: 'pfp/backgrounds/pyramids.jpg',           name: 'PYRAMIDS' },
  { src: 'pfp/backgrounds/rialto.png',             name: 'RIALTO', posX: -185 },
  { src: 'pfp/backgrounds/krusty krab.png',        name: 'KRUSTY KRAB' },
  { src: 'pfp/backgrounds/satoshi nakamoto.jpg',   name: 'SATOSHI', zoom: 1.74, posX: 386 },
  { src: 'pfp/backgrounds/statue of liberty.jpg',  name: 'LIBERTY', posX: -47 },
  { src: 'pfp/backgrounds/times square.jpg',       name: 'TIMES SQ', posX: -74 },
  { src: 'pfp/backgrounds/vice city.jpg',          name: 'VICE CITY', posX: -179 },
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
  { src: 'pfp/accs/cigar.png',               name: 'CIGAR' },
  { src: 'pfp/accs/supreme.png',             name: 'SUPREME' },
  { src: 'pfp/accs/anita max wynn.png',      name: 'ANITA MAX WYNN' },
  { src: 'pfp/accs/british guard.png',       name: 'BRITISH GUARD' },
  { src: 'pfp/accs/graduation ushanka.png',  name: 'GRAD USHANKA' },
  { src: 'pfp/accs/gucci.png',               name: 'GUCCI' },
  { src: 'pfp/accs/jester.png',              name: 'JESTER' },
  { src: 'pfp/accs/naruto.png',              name: 'NARUTO' },
  { src: 'pfp/accs/propeller hat.png',       name: 'PROPELLER HAT' },
  { src: 'pfp/accs/sombrero.png',            name: 'SOMBRERO' },
];
const BOW_LIST = [
  { src: 'pfp/bowtie/bacon.png',      name: 'BACON',           x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/dollar.png',     name: 'DOLLAR',          x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/israel.png',     name: 'ISRAEL',          x: 500, y: 930, scale: 2.1, swatchScale: 2.2 },
  { src: 'pfp/bowtie/jhon pork.png',  name: 'JHON PORK',       x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/lego.png',       name: 'LEGO',            x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/lightning.png',  name: 'LIGHTNING',       x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/pumpfun.png',    name: 'PUMPFUN',         x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/shark.png',      name: 'SHARK',           x: 500, y: 930, scale: 1.2 },
  { src: 'pfp/bowtie/spiked.png',     name: 'SPIKED',          x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/superhero.png',  name: 'SUPERHERO',       x: 500, y: 930, scale: 1.0 },
  { src: 'pfp/bowtie/taco.png',       name: 'TACO',            x: 500, y: 930, scale: 1.2 },
  { src: 'pfp/bowtie/usa.png',        name: 'USA',             x: 500, y: 930, scale: 1.4 },
  { src: 'pfp/bowtie/wine.png',       name: 'WINE',            x: 500, y: 930, scale: 1.0 },
];
const CAT_MAP = {
  characters:  { list: ACCS_LIST, type: 'gf',  label: 'Characters' },
  backgrounds: { list: BG_LIST,   type: 'bg',  label: 'Backgrounds' },
  accessories: { list: BOW_LIST,  type: 'bow', label: 'Accessories' },
};

const DEFAULT_CHAR = 'pfp/characters/front_closeup_nobowtie_nobg.png';
let sb = null, sg = DEFAULT_CHAR, sbow = null;
let btSize = 320; // Base bowtie size (position and scale are hardcoded per bowtie)
let _bgZoom = 1.0;
let _bgOffsetX = 0;
let _activeCat = 'characters';
let _wardrobeInited = false;

/* ── DEFAULT: show base character on first open ── */
function initWardrobeDefaults() {
  if (_wardrobeInited) return;
  _wardrobeInited = true;
  sg = DEFAULT_CHAR;
  setCategory('characters');
  updateSummary();
  render();
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
      : `position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:6px${item.swatchScale ? `;transform:scale(${item.swatchScale})` : ''}`;

    d.innerHTML = `
      <img src="${item.src}" alt="${item.name}" loading="lazy" style="${imgStyle}">
      <div class="swatch-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="swatch-name">${item.name.toLowerCase()}</div>`;

    d.onclick = () => {
      grid.querySelectorAll('.swatch').forEach(t => t.classList.remove('selected'));
      d.classList.add('selected');
      if (type === 'bg') {
        sb = item.src;
        _bgOffsetX = item.posX || 0;
        _bgZoom = item.zoom || 1.0;
      }
      else if (type === 'gf') sg = item.src;
      else { 
        sbow = item.src;
        // Bowtie position and scale are now hardcoded per style
      }
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
  else if (type === 'gf') sg = DEFAULT_CHAR;
  else {
    sbow = null;
    // Bowtie size/position settings removed
  }
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

/* ── CANVAS — Style Selection Only ── */
const _ppc = document.getElementById('ppc');
function _cv(e) {
  const r = _ppc.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (1000 / r.width), y: (e.clientY - r.top) * (1000 / r.height) };
}

/* Drag functionality removed — bowtie position is now hardcoded per style */

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
      const s = Math.max(1000 / b.width, 1000 / b.height) * _bgZoom;
      ctx.drawImage(b, (1000 - b.width * s) / 2 + _bgOffsetX, (1000 - b.height * s) / 2, b.width * s, b.height * s);
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
      const bowData = BOW_LIST.find(x => x.src === sbow) || {};
      const bowScale = bowData.scale || 1;
      const bowX = bowData.x || 500;
      const bowY = bowData.y || 930;
      const bw = btSize * bowScale;
      const bh = bw * (bow.height / bow.width);
      ctx.drawImage(bow, bowX - bw / 2, bowY - bh / 2, bw, bh);
      // Drag hint removed since dragging is no longer allowed
      if (dragHint) dragHint.style.opacity = '0';
    } catch (_) { }
  } else {
    if (dragHint) dragHint.style.opacity = '0';
  }

  const dlbtn = document.getElementById('dlbtn');
  if (dlbtn) dlbtn.disabled = !(sb || sg);
}

/* ── DOWNLOAD ── */
async function doDownload() {
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
  } catch (_) {
    alert('Could not save — try serving over http://');
  }
}

document.getElementById('dlbtn')?.addEventListener('click', doDownload);

/* ── RESET ── */
function doReset() {
  sb = null; sg = DEFAULT_CHAR; sbow = null;
  setCategory('characters');
  updateSummary();
  render();
}

document.getElementById('rstbtn')?.addEventListener('click', doReset);
