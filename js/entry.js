/* ── INTRO TYPEWRITER ── */
const MSG = 'where should the bowtie go?';
const itxt = document.getElementById('itxt');
let ci = 0;

function type() {
  if (ci <= MSG.length) {
    itxt.innerHTML = MSG.slice(0, ci) + '<span class="blink"></span>';
    ci++;
    setTimeout(type, 80 + Math.random() * 60);
  } else {
    setTimeout(showEntry, 1100);
  }
}
type();

/* ── ENTRY CANVAS ── */
async function initEntryCanvas() {
  const canvas = document.getElementById('entry-canvas');
  const hint = document.getElementById('gate-hint');
  const ctx = canvas.getContext('2d');
  let giraffe, papion;
  try {
    [giraffe, papion] = await Promise.all([loadImg('girafa.png'), loadImg('papion.png')]);
  } catch (e) {
    hint.textContent = '[ failed to load images ]';
    return;
  }
  const IW = giraffe.naturalWidth, IH = giraffe.naturalHeight;
  canvas.width = IW; canvas.height = IH;
  const sc = Math.min(Math.min(480, window.innerWidth * .88) / IW, window.innerHeight * .72 / IH);
  canvas.style.width = Math.round(IW * sc) + 'px';
  canvas.style.height = Math.round(IH * sc) + 'px';
  canvas.style.cursor = 'none';

  const neck = { x: IW * .36, y: IH * .33, w: IW * .28, h: IH * .60 };
  let mx = IW / 2, my = IH / 2, hovering = false, phase = 0;
  const particles = [];

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) * (IW / r.width);
    my = (e.clientY - r.top) * (IH / r.height);
    hovering = mx >= neck.x && mx <= neck.x + neck.w && my >= neck.y && my <= neck.y + neck.h;
    _pcTargetScale = hovering ? 1.45 : 1;
    hint.classList.toggle('ready', hovering);
    hint.textContent = hovering ? '[ click to enter ]' : '[ hover neck & click to enter ]';
  });

  canvas.addEventListener('mouseleave', () => {
    hovering = false; _pcTargetScale = 1;
    hint.classList.remove('ready');
    hint.textContent = '[ hover neck & click to enter ]';
  });

  canvas.addEventListener('click', () => { if (hovering) enterMain(); });

  (function frame() {
    ctx.clearRect(0, 0, IW, IH);
    ctx.drawImage(giraffe, 0, 0, IW, IH);
    const vig = ctx.createRadialGradient(IW / 2, IH / 2, IW * .22, IW / 2, IH / 2, IW * .78);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(0,0,0,${.50 + Math.sin(phase * .015) * .08})`);
    ctx.fillStyle = vig; ctx.fillRect(0, 0, IW, IH);
    if (Math.random() > .5) {
      const col = hovering ? [255, 180, 0] : [77, 255, 145];
      particles.push({
        x: mx + (Math.random() - .5) * 10, y: my + (Math.random() - .5) * 10,
        vx: (Math.random() - .5) * 1.8, vy: -Math.random() * 2 - .3,
        life: 1, sz: Math.ceil(2 + Math.random() * 4), col
      });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += .05; p.life -= .03;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.life * .85})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.sz, p.sz);
    }
    phase += .045;
    requestAnimationFrame(frame);
  })();
}

function showEntry() {
  const intro = document.getElementById('intro');
  intro.style.transition = 'opacity .7s';
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    const e = document.getElementById('entry');
    e.classList.add('on');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      e.classList.add('vis');
      /* show bowtie cursor on entry gate screen */
      document.getElementById('papion-cur').style.display = 'block';
    }));
    initEntryCanvas();
  }, 700);
}
