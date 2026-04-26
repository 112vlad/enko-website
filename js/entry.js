/* ── INTRO TYPEWRITER ── */
const MSG = 'where should the bowtie go?';
const itxt = document.getElementById('itxt');
let ci = 0;
let _entryShown = false;

function showEntryOnce() {
  if (_entryShown) return;
  _entryShown = true;
  showEntry();
}

document.getElementById('intro').addEventListener('click', showEntryOnce);

function type() {
  if (ci <= MSG.length) {
    itxt.innerHTML = MSG.slice(0, ci) + '<span class="blink"></span>';
    ci++;
    setTimeout(type, 80 + Math.random() * 60);
  } else {
    setTimeout(showEntryOnce, 2500);
  }
}
type();

/* ── ENTRY CANVAS ── */
async function initEntryCanvas() {
  const canvas = document.getElementById('entry-canvas');
  const hint = document.getElementById('gate-hint');
  const ctx = canvas.getContext('2d');
  let giraffe;
  try {
    giraffe = await loadImg('images/girafa.png');
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
  const isMobile = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

  if (isMobile) {
    canvas.style.cursor = '';
    hint.textContent = '[ tap neck to enter ]';

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const r = canvas.getBoundingClientRect();
      const tx = (touch.clientX - r.left) * (IW / r.width);
      const ty = (touch.clientY - r.top) * (IH / r.height);
      const onNeck = tx >= neck.x && tx <= neck.x + neck.w && ty >= neck.y && ty <= neck.y + neck.h;
      if (onNeck) {
        enterMain();
      } else {
        hint.classList.add('ready');
        hint.textContent = '[ tap the neck ]';
        setTimeout(() => {
          hint.classList.remove('ready');
          hint.textContent = '[ tap neck to enter ]';
        }, 900);
      }
    }, { passive: false });

  } else {
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
  }

  (function frame() {
    ctx.clearRect(0, 0, IW, IH);
    ctx.drawImage(giraffe, 0, 0, IW, IH);
    const vig = ctx.createRadialGradient(IW / 2, IH / 2, IW * .22, IW / 2, IH / 2, IW * .78);
    vig.addColorStop(0, 'rgba(26,24,20,0)');
    vig.addColorStop(1, `rgba(26,24,20,${.55 + Math.sin(phase * .015) * .08})`);
    ctx.fillStyle = vig; ctx.fillRect(0, 0, IW, IH);
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
      if (!(navigator.maxTouchPoints > 0 || 'ontouchstart' in window)) activateBowtie();
    }));
    initEntryCanvas();
  }, 700);
}
