/* ══════════════════════════════════════
   ENKO — GeckoTerminal chart
══════════════════════════════════════ */
const CHART_POOL = '8MMG6EG1ht27H848kFih2n25Uab2AuG3dHrDxz5sz91M';
const GT = 'https://api.geckoterminal.com/api/v2/networks/solana';
const TF_MAP = { '1m': 1, '5m': 5 };

const API_VERSION = '20230203';

let _cacheCandles = {
  '1m': { data: null, time: 0, ttl: 60000 },
  '5m': { data: null, time: 0, ttl: 60000 }
};
let _cacheToken   = { data: null, time: 0, ttl: 60000 };
let _cacheTrades  = { data: null, time: 0, ttl: 60000 };
let _enkoMint = null;

let _chartTf      = '1m';
let _chartCandles = [];
let _chartMeta    = null;
let _chartSupply  = 0;
let _chartLoading = false;

function fmtPrice(v) {
  if (!v || isNaN(v)) return '—';
  if (v < 0.000001) return v.toExponential(3);
  if (v < 0.0001)   return v.toFixed(8);
  if (v < 0.01)     return v.toFixed(6);
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
    const now = Date.now();
    if (_cacheToken.data && (now - _cacheToken.time) < _cacheToken.ttl) return _cacheToken.data;

    const r = await fetch(`${GT}/pools/${CHART_POOL}`, {
      headers: { 'Accept': `application/json;version=${API_VERSION}` }
    });
    const d = await r.json();
    const a = d.data?.attributes;
    if (!a) return;
    if (!_enkoMint) {
      const tokenId = d.data?.relationships?.base_token?.data?.id || '';
      _enkoMint = tokenId.replace('solana_', '') || null;
    }

    const price  = parseFloat(a.base_token_price_usd) || 0;
    const mcap   = parseFloat(a.market_cap_usd) || parseFloat(a.fdv_usd) || 0;
    if (price > 0 && mcap > 0) _chartSupply = mcap / price;
    const change = parseFloat(a.price_change_percentage?.h24) || 0;
    const vol    = parseFloat(a.volume_usd?.h24) || 0;
    const liq    = parseFloat(a.reserve_in_usd) || 0;

    _cacheToken = { data: { price, mcap, change, vol, liq }, time: now, ttl: 60000 };

    const priceEl  = document.getElementById('ch-price');
    const changeEl = document.getElementById('ch-change');
    const mcapEl   = document.getElementById('ch-mcap');
    const volEl    = document.getElementById('ch-vol');
    const liqEl    = document.getElementById('ch-liq');

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
    if (volEl)  volEl.textContent  = fmtUsd(vol);
    if (liqEl)  liqEl.textContent  = fmtUsd(liq);

    const chartPriceEl  = document.getElementById('chart-price-display');
    if (chartPriceEl) chartPriceEl.textContent = '$' + fmtPrice(price);
    const chartChangeEl = document.getElementById('chart-change-display');
    if (chartChangeEl) {
      chartChangeEl.textContent = (change >= 0 ? '▲ ' : '▼ ') + Math.abs(change).toFixed(2) + '%';
      chartChangeEl.className = 'chart-change num ' + (change >= 0 ? 'pos' : 'neg');
    }
  } catch (e) { console.warn('chart token fetch', e); }
}


async function fetchChartCandles(tf) {
  try {
    const now = Date.now();
    const cache = _cacheCandles[tf];
    if (cache && cache.data && (now - cache.time) < cache.ttl) return cache.data;

    const agg = TF_MAP[tf];
    const r = await fetch(
      `${GT}/pools/${CHART_POOL}/ohlcv/minute?aggregate=${agg}&limit=100&currency=usd&token=base`,
      { headers: { 'Accept': `application/json;version=${API_VERSION}` } }
    );
    if (r.status === 429) { console.warn('Rate limited.'); return cache?.data; }
    if (!r.ok)            { console.warn(`API error: ${r.status}`); return cache?.data; }

    const d = await r.json();
    const raw = d.data?.attributes?.ohlcv_list;
    if (!raw || raw.length < 2) return null;

    const candles = raw.slice().reverse().map(c => ({ t: c[0], o: c[1], h: c[2], l: c[3], c: c[4] }));
    _cacheCandles[tf] = { data: candles, time: now, ttl: 60000 };
    return candles;
  } catch (e) {
    console.warn('chart candles fetch', e);
    return _cacheCandles[tf]?.data;
  }
}

function toMcapCandles(candles) {
  if (!_chartSupply) return candles;
  return candles.map(c => ({
    t: c.t,
    o: c.o * _chartSupply,
    h: c.h * _chartSupply,
    l: c.l * _chartSupply,
    c: c.c * _chartSupply
  }));
}

function drawEnkoChart(rawCandles) {
  const candles = toMcapCandles(rawCandles);
  const canvas  = document.getElementById('enko-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W   = canvas.parentElement.clientWidth - 12;
  const H   = 320;
  canvas.width  = W * DPR; canvas.height = H * DPR;
  canvas.style.width  = W + 'px'; canvas.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  /* site palette colours */
  const bgCol   = '#1a1814';
  const gridCol = 'rgba(236,231,220,.06)';
  const labelCol= 'rgba(122,115,102,.8)';
  const bullFill= 'rgba(168,184,120,.9)';    /* --pos */
  const bullWick= 'rgba(168,184,120,.5)';
  const bearFill= 'rgba(216,122,90,.9)';     /* --neg */
  const bearWick= 'rgba(216,122,90,.5)';

  const PL = 80, PR = 16, PT = 18, PB = 36;
  const cW = W - PL - PR, cH = H - PT - PB;
  const data = candles.slice(-50);
  const N    = data.length;
  if (!N) return;

  const allP = data.flatMap(c => [c.h, c.l]).filter(Boolean);
  const minP = Math.min(...allP) * 0.975;
  const maxP = Math.max(...allP) * 1.025;
  function toY(p) { return PT + cH - ((p - minP) / (maxP - minP)) * cH; }

  /* background */
  ctx.fillStyle = bgCol;
  ctx.fillRect(0, 0, W, H);

  /* grid + price labels */
  for (let i = 0; i <= 5; i++) {
    const y = PT + (cH / 5) * i;
    ctx.strokeStyle = gridCol; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
    const val = maxP - ((maxP - minP) / 5) * i;
    ctx.fillStyle = labelCol;
    ctx.font = `10px 'JetBrains Mono',monospace`; ctx.textAlign = 'right';
    ctx.fillText(fmtUsd(val), PL - 4, y + 4);
  }

  /* candles */
  const slotW   = cW / N;
  const candleW = Math.max(slotW * 0.6, 2);

  data.forEach((c, i) => {
    const isBull  = c.c >= c.o;
    const fill    = isBull ? bullFill : bearFill;
    const wick    = isBull ? bullWick : bearWick;
    const cx      = PL + slotW * i + slotW / 2;
    const yOpen   = toY(c.o);
    const yClose  = toY(c.c);
    const yHigh   = toY(c.h);
    const yLow    = toY(c.l);
    const bodyTop = Math.min(yOpen, yClose);
    const bodyH   = Math.max(Math.abs(yClose - yOpen), 1);

    /* body first so wicks draw on top without bleeding through */
    ctx.fillStyle = fill;
    ctx.fillRect(cx - candleW / 2, bodyTop, candleW, bodyH);

    /* upper wick — high to top of body */
    ctx.strokeStyle = wick; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, yHigh); ctx.lineTo(cx, bodyTop); ctx.stroke();

    /* lower wick — bottom of body to low */
    ctx.beginPath(); ctx.moveTo(cx, bodyTop + bodyH); ctx.lineTo(cx, yLow); ctx.stroke();
  });

  /* time labels */
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

/* ── tooltip only ── */
const _chartCanvas = document.getElementById('enko-chart');

_chartCanvas?.addEventListener('mousemove', e => {
  if (!_chartMeta) return;
  const rect = _chartCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const { PL, slotW, data, N } = _chartMeta;
  const tip = document.getElementById('ch-tooltip');
  if (!tip) return;
  const idx = Math.floor((x - PL) / slotW);
  if (idx < 0 || idx >= N) { tip.style.display = 'none'; return; }
  const c = data[idx];
  const isBull = c.c >= c.o;
  const pct = (((c.c - c.o) / c.o) * 100).toFixed(2);
  tip.innerHTML = `<span style="color:${isBull ? 'var(--pos)' : 'var(--neg)'}">${isBull ? '▲' : '▼'} ${pct}%</span>\nO: ${fmtUsd(c.o)}  H: ${fmtUsd(c.h)}\nL: ${fmtUsd(c.l)}  C: ${fmtUsd(c.c)}`;
  tip.style.display = 'block';
  tip.style.left = Math.min(x + 14, _chartCanvas.offsetWidth - 190) + 'px';
  tip.style.top  = Math.max(y - 70, 0) + 'px';
});

_chartCanvas?.addEventListener('mouseleave', () => {
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
  const now  = Date.now() / 1000;
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
  btn.addEventListener('click', async () => {
    if (btn.classList.contains('active')) return;
    document.querySelectorAll('.ch-tf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const newTf = btn.dataset.tf;
    _chartTf = newTf;
    const cache = _cacheCandles[newTf];
    const now = Date.now();
    if (cache && cache.data && (now - cache.time) < cache.ttl) {
      _chartCandles = cache.data;
      drawEnkoChart(_chartCandles);
    } else {
      const candles = await fetchChartCandles(_chartTf);
      if (candles && candles.length > 1) { _chartCandles = candles; drawEnkoChart(candles); }
    }
  });
});

window.addEventListener('resize', () => {
  if (_chartCandles.length) drawEnkoChart(_chartCandles);
});

/* ── LEDGER — live trades ── */
async function fetchTrades() {
  try {
    const now = Date.now();
    if (_cacheTrades.data && (now - _cacheTrades.time) < _cacheTrades.ttl) return;

    const r = await fetch(`${GT}/pools/${CHART_POOL}/trades`, {
      headers: { 'Accept': `application/json;version=${API_VERSION}` }
    });
    if (r.status === 429) { console.warn('Rate limited.'); return; }
    if (!r.ok)            { console.warn(`API error: ${r.status}`); return; }

    const d = await r.json();
    const trades = d.data;
    if (!trades || !trades.length) return;

    _cacheTrades = { data: trades, time: now, ttl: 60000 };

    const tbody = document.getElementById('tx-body');
    if (!tbody) return;

    tbody.innerHTML = trades.slice(0, 10).map(t => {
      const a      = t.attributes;
      const isBuy  = a.kind === 'buy';
      const date   = new Date(a.block_timestamp);
      const time   = date.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
        + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const enkoAmt  = parseFloat(isBuy ? a.to_token_amount   : a.from_token_amount);
      const price    = parseFloat(isBuy ? a.price_to_in_usd   : a.price_from_in_usd);
      const value    = parseFloat(a.volume_in_usd);
      const wallet   = a.tx_from_address
        ? a.tx_from_address.slice(0, 4) + '…' + a.tx_from_address.slice(-4) : '—';
      return `<tr>
        <td style="color:var(--ink-mute)">${time}</td>
        <td class="${isBuy ? 'pos' : 'neg'}">${isBuy ? 'BUY' : 'SELL'}</td>
        <td>${isNaN(enkoAmt) ? '—' : Math.round(enkoAmt).toLocaleString()}</td>
        <td>$${fmtPrice(price)}</td>
        <td>${fmtUsd(value)}</td>
        <td style="color:var(--ink-soft)">${wallet}</td>
      </tr>`;
    }).join('');
  } catch (e) { console.warn('trades fetch', e); }
}

/* prefetch on script load while user is still on intro */
const _prefetch = {
  token:   fetchChartToken(),
  candles: fetchChartCandles(_chartTf),
  trades:  fetchTrades(),
};
/* holders fetched after token (needs mint), on a 5-min cadence */

async function initCharts() {
  const [candles] = await Promise.all([_prefetch.candles, _prefetch.token]);
  if (candles && candles.length > 1) {
    _chartCandles = candles;
    drawEnkoChart(candles);
  } else {
    drawDemoEnkoChart();
  }

  await _prefetch.trades;
  (async function tradesLoop() {
    await fetchTrades();
    setTimeout(tradesLoop, 12000);
  })();

  setInterval(() => fetchChartToken(), 30000);

  setInterval(async () => {
    if (!_chartLoading && _chartCandles.length) {
      const fresh = await fetchChartCandles(_chartTf);
      if (fresh && fresh.length > 1) { _chartCandles = fresh; drawEnkoChart(fresh); }
    }
  }, 30000);
}
