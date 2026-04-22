/* ══════════════════════════════════════
   ENKO — GeckoTerminal chart (canvas, up/down candle images)
══════════════════════════════════════ */
const CHART_POOL = 'BWFZkx1pMpvwxammwTrizvoWzZZGiFEYUYW6Ee51SHLy';
const GT = 'https://api.geckoterminal.com/api/v2/networks/solana';
const TF_MAP = { '1m': 1, '5m': 5 };

let _chartTf = '1m';
let _chartCandles = [];
let _chartMeta = null;
let _chartSupply = 0;
let _chartLoading = false;

const _upImg = new Image(), _dnImg = new Image();
let _candleImgsReady = 0;
_upImg.onload = () => _candleImgsReady++;
_dnImg.onload = () => _candleImgsReady++;
_upImg.src = 'candles/up.png';
_dnImg.src = 'candles/down.png';

function fmtPrice(v) {
  if (!v || isNaN(v)) return '—';
  if (v < 0.000001) return v.toExponential(3);
  if (v < 0.0001) return v.toFixed(8);
  if (v < 0.01) return v.toFixed(6);
  return v.toFixed(4);
}
function fmtUsd(v) {
  if (!v || isNaN(v)) return '—';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
  return '$' + v.toFixed(2);
}

async function fetchChartToken() {
  try {
    const r = await fetch(`${GT}/pools/${CHART_POOL}`);
    const d = await r.json();
    const a = d.data?.attributes;
    if (!a) return;
    const price = parseFloat(a.base_token_price_usd) || 0;
    const mcap = parseFloat(a.market_cap_usd) || parseFloat(a.fdv_usd) || 0;
    if (price > 0 && mcap > 0) _chartSupply = mcap / price;
    const change = parseFloat(a.price_change_percentage?.h24) || 0;
    const vol = parseFloat(a.volume_usd?.h24) || 0;
    const liq = parseFloat(a.reserve_in_usd) || 0;

    const priceEl = document.getElementById('ch-price');
    const changeEl = document.getElementById('ch-change');
    const mcapEl = document.getElementById('ch-mcap');
    const volEl = document.getElementById('ch-vol');
    const liqEl = document.getElementById('ch-liq');

    if (priceEl) priceEl.textContent = '$' + fmtPrice(price);
    if (changeEl) {
      changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
      changeEl.className = 'v num ' + (change >= 0 ? 'pos' : 'neg');
      const arrowEl = document.getElementById('ch-change-arrow');
      if (arrowEl) {
        arrowEl.textContent = change >= 0 ? '▲' : '▼';
        arrowEl.style.color = change >= 0 ? 'var(--pos)' : 'var(--neg)';
      }
    }
    if (mcapEl) mcapEl.textContent = fmtUsd(mcap);
    if (volEl) volEl.textContent = fmtUsd(vol);
    if (liqEl) liqEl.textContent = fmtUsd(liq);

    /* update the chart-price large display */
    const chartPriceEl = document.getElementById('chart-price-display');
    if (chartPriceEl) chartPriceEl.textContent = '$' + fmtPrice(price);
    const chartChangeEl = document.getElementById('chart-change-display');
    if (chartChangeEl) {
      chartChangeEl.textContent = (change >= 0 ? '▲ ' : '▼ ') + Math.abs(change).toFixed(2) + '%';
      chartChangeEl.className = 'chart-change num ' + (change >= 0 ? 'pos' : 'neg');
    }
  } catch (e) {
    console.warn('chart token fetch', e);
  }
}

async function fetchChartCandles(tf) {
  try {
    const agg = TF_MAP[tf];
    const r = await fetch(`${GT}/pools/${CHART_POOL}/ohlcv/minute?aggregate=${agg}&limit=100&currency=usd&token=base`);
    const d = await r.json();
    const raw = d.data?.attributes?.ohlcv_list;
    if (!raw || raw.length < 2) return null;
    return raw.slice().reverse().map(c => ({ t: c[0], o: c[1], h: c[2], l: c[3], c: c[4] }));
  } catch (e) {
    return null;
  }
}

function toMcapCandles(candles) {
  if (!_chartSupply) return candles;
  return candles.map(c => ({ t: c.t, o: c.o * _chartSupply, h: c.h * _chartSupply, l: c.l * _chartSupply, c: c.c * _chartSupply }));
}

function drawEnkoChart(rawCandles) {
  const candles = toMcapCandles(rawCandles);
  const canvas = document.getElementById('enko-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = canvas.parentElement.clientWidth - 12;
  const H = 320;
  canvas.width = W * DPR; canvas.height = H * DPR;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  /* theme-aware colours */
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bgCol = isDark ? '#1a1814' : '#efeae1';
  const gridCol = isDark ? 'rgba(236,231,220,.06)' : 'rgba(26,24,20,.06)';
  const labelCol = isDark ? 'rgba(122,115,102,.8)' : 'rgba(138,131,120,.8)';

  const PL = 80, PR = 16, PT = 18, PB = 36;
  const cW = W - PL - PR, cH = H - PT - PB;
  const data = candles.slice(-50);
  const N = data.length;
  if (!N) return;

  const allP = data.flatMap(c => [c.h, c.l]).filter(Boolean);
  const minP = Math.min(...allP) * 0.975;
  const maxP = Math.max(...allP) * 1.025;
  function toY(p) { return PT + cH - ((p - minP) / (maxP - minP)) * cH; }

  ctx.fillStyle = bgCol;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i <= 5; i++) {
    const y = PT + (cH / 5) * i;
    ctx.strokeStyle = gridCol; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
    const val = maxP - ((maxP - minP) / 5) * i;
    ctx.fillStyle = labelCol;
    ctx.font = `10px 'JetBrains Mono',monospace`; ctx.textAlign = 'right';
    ctx.fillText(fmtUsd(val), PL - 4, y + 4);
  }

  const slotW = cW / N;
  const bodyMinH = 4;

  data.forEach((c, i) => {
    const cx = PL + slotW * i + slotW / 2;
    const isBull = c.c >= c.o;
    const yTop = toY(Math.max(c.o, c.c));
    const yBot = toY(Math.min(c.o, c.c));
    const bodyH = Math.max(Math.abs(yBot - yTop), bodyMinH);
    const imgW = Math.max(slotW * 0.78, 8);
    const img = isBull ? _upImg : _dnImg;
    if (_candleImgsReady > 0 && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, cx - imgW / 2, yTop, imgW, bodyH);
    } else {
      ctx.fillStyle = isBull ? 'rgba(60,120,60,.7)' : 'rgba(160,50,40,.7)';
      ctx.fillRect(cx - imgW / 2, yTop, imgW, bodyH);
    }
  });

  ctx.fillStyle = labelCol;
  ctx.font = `9px 'JetBrains Mono',monospace`; ctx.textAlign = 'center';
  const step = Math.ceil(N / 7);
  data.forEach((c, i) => {
    if (i % step === 0) {
      const cx = PL + slotW * i + slotW / 2;
      const dd = new Date(c.t * 1000);
      const label = dd.getHours().toString().padStart(2, '0') + ':' + dd.getMinutes().toString().padStart(2, '0');
      ctx.fillText(label, cx, H - 8);
    }
  });

  _chartMeta = { data, PL, slotW, N, toY };
}

document.getElementById('enko-chart')?.addEventListener('mousemove', function (e) {
  if (!_chartMeta) return;
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const { PL, slotW, data, N } = _chartMeta;
  const idx = Math.floor((x - PL) / slotW);
  const tip = document.getElementById('ch-tooltip');
  if (!tip) return;
  if (idx < 0 || idx >= N) { tip.style.display = 'none'; return; }
  const c = data[idx];
  const isBull = c.c >= c.o;
  const pct = (((c.c - c.o) / c.o) * 100).toFixed(2);
  tip.innerHTML = `<span style="color:${isBull ? 'var(--pos)' : 'var(--neg)'}">${isBull ? '▲' : '▼'} ${pct}%</span>\nO: ${fmtUsd(c.o)}  H: ${fmtUsd(c.h)}\nL: ${fmtUsd(c.l)}  C: ${fmtUsd(c.c)}`;
  tip.style.display = 'block';
  tip.style.left = Math.min(x + 14, this.offsetWidth - 190) + 'px';
  tip.style.top = Math.max(e.clientY - rect.top - 70, 0) + 'px';
});

document.getElementById('enko-chart')?.addEventListener('mouseleave', () => {
  const tip = document.getElementById('ch-tooltip');
  if (tip) tip.style.display = 'none';
});

async function loadChartData(tf) {
  if (_chartLoading) return;
  _chartLoading = true;
  const loading = document.getElementById('ch-loading');
  if (loading) loading.style.display = 'block';
  const candles = await fetchChartCandles(tf);
  if (loading) loading.style.display = 'none';
  _chartLoading = false;
  if (candles && candles.length > 1) {
    _chartCandles = candles;
    drawEnkoChart(candles);
  } else if (_chartCandles.length) {
    drawEnkoChart(_chartCandles);
  } else {
    drawDemoEnkoChart();
  }
}

function drawDemoEnkoChart() {
  const demo = []; let price = 1000000;
  const now = Date.now() / 1000;
  const mins = TF_MAP[_chartTf] || 1;
  for (let i = 49; i >= 0; i--) {
    const o = price; const ch = (Math.random() - .46) * .18;
    const c = Math.max(o * (1 + ch), 1);
    const h = Math.max(o, c) * (1 + Math.random() * .04);
    const l = Math.min(o, c) * (1 - Math.random() * .04);
    demo.push({ t: now - i * mins * 60, o, h, l, c });
    price = c;
  }
  _chartCandles = demo;
  drawEnkoChart(demo);
}

document.querySelectorAll('.ch-tf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (_chartLoading) return;
    document.querySelectorAll('.ch-tf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _chartTf = btn.dataset.tf;
    loadChartData(_chartTf);
  });
});

window.addEventListener('resize', () => {
  if (_chartCandles.length) drawEnkoChart(_chartCandles);
});

async function initCharts() {
  await fetchChartToken();
  await loadChartData(_chartTf);
  setInterval(async () => {
    fetchChartToken();
    if (!_chartLoading && _chartCandles.length) {
      const fresh = await fetchChartCandles(_chartTf);
      if (fresh && fresh.length > 1) { _chartCandles = fresh; drawEnkoChart(fresh); }
    }
  }, 30000);
}
