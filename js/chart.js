/* ══════════════════════════════════════
   ENKO — GeckoTerminal chart (canvas, up/down candle images)
══════════════════════════════════════ */
const CHART_POOL = 'BWFZkx1pMpvwxammwTrizvoWzZZGiFEYUYW6Ee51SHLy';
const GT = 'https://api.geckoterminal.com/api/v2/networks/solana';
const TF_MAP = { '1m': 1, '5m': 5 };

/* Separate caches for each timeframe to avoid stale data when switching */
let _cacheCandles = { 
  '1m': { data: null, time: 0, ttl: 60000 },
  '5m': { data: null, time: 0, ttl: 60000 }
};
let _cacheToken = { data: null, time: 0, ttl: 60000 };
let _cacheTrades = { data: null, time: 0, ttl: 60000 };

const API_VERSION = '20230203';

let _chartTf = '1m';
let _chartCandles = [];
let _chartMeta = null;
let _chartSupply = 0;
let _chartLoading = false;

/* ── view state for zoom / pan ── */
let _viewStart = 0;   // index of leftmost visible candle
let _viewCount = 50;  // number of candles visible
const VIEW_MIN = 10;
const VIEW_MAX = 100;

/* ── drag state ── */
let _dragState = null;
// { type: 'pan'|'scrollbar', startX, startViewStart, thumbX0 }

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
    // Check cache first (API backend caches for 1 minute)
    const now = Date.now();
    if (_cacheToken.data && (now - _cacheToken.time) < _cacheToken.ttl) {
      return _cacheToken.data;
    }

    const r = await fetch(`${GT}/pools/${CHART_POOL}`, {
      headers: { 'Accept': `application/json;version=${API_VERSION}` }
    });
    const d = await r.json();
    const a = d.data?.attributes;
    if (!a) return;
    
    const price = parseFloat(a.base_token_price_usd) || 0;
    const mcap = parseFloat(a.market_cap_usd) || parseFloat(a.fdv_usd) || 0;
    if (price > 0 && mcap > 0) _chartSupply = mcap / price;
    const change = parseFloat(a.price_change_percentage?.h24) || 0;
    const vol = parseFloat(a.volume_usd?.h24) || 0;
    const liq = parseFloat(a.reserve_in_usd) || 0;

    // Cache the result
    _cacheToken = { data: { price, mcap, change, vol, liq }, time: now, ttl: 60000 };

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
    // Check cache for this specific timeframe (API backend caches for 1 minute)
    const now = Date.now();
    const cache = _cacheCandles[tf];
    if (cache && cache.data && (now - cache.time) < cache.ttl) {
      return cache.data;
    }

    const agg = TF_MAP[tf];
    const r = await fetch(`${GT}/pools/${CHART_POOL}/ohlcv/minute?aggregate=${agg}&limit=100&currency=usd&token=base`, {
      headers: { 'Accept': `application/json;version=${API_VERSION}` }
    });
    
    // Check for rate limiting
    if (r.status === 429) {
      console.warn('Rate limited by GeckoTerminal API (10 calls/min limit). Using cached data.');
      return cache?.data;
    }
    
    if (!r.ok) {
      console.warn(`API error: ${r.status}`);
      return cache?.data;
    }
    
    const d = await r.json();
    const raw = d.data?.attributes?.ohlcv_list;
    if (!raw || raw.length < 2) return null;
    
    const candles = raw.slice().reverse().map(c => ({ t: c[0], o: c[1], h: c[2], l: c[3], c: c[4] }));
    
    // Cache the result for this timeframe
    _cacheCandles[tf] = { data: candles, time: now, ttl: 60000 };
    return candles;
  } catch (e) {
    console.warn('chart candles fetch', e);
    return _cacheCandles[tf]?.data; // Return cached data on error
  }
}

function toMcapCandles(candles) {
  if (!_chartSupply) return candles;
  return candles.map(c => ({ t: c.t, o: c.o * _chartSupply, h: c.h * _chartSupply, l: c.l * _chartSupply, c: c.c * _chartSupply }));
}

/* clamp _viewStart so view never exceeds available candles */
function clampView(total) {
  _viewCount = Math.max(VIEW_MIN, Math.min(VIEW_MAX, _viewCount));
  _viewStart = Math.max(0, Math.min(total - _viewCount, _viewStart));
}

function resetViewToLatest(total) {
  _viewCount = Math.min(50, total);
  _viewStart = Math.max(0, total - _viewCount);
}

const SB_H = 10;   // scrollbar height in CSS px
const SB_T = 6;    // top margin above scrollbar

function drawEnkoChart(rawCandles) {
  const allCandles = toMcapCandles(rawCandles);
  const total = allCandles.length;
  if (!total) return;

  clampView(total);

  const canvas = document.getElementById('enko-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const W = canvas.parentElement.clientWidth - 12;
  const H = 320;
  canvas.width = W * DPR; canvas.height = H * DPR;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.scale(DPR, DPR);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const bgCol    = isDark ? '#1a1814' : '#efeae1';
  const gridCol  = isDark ? 'rgba(236,231,220,.06)' : 'rgba(26,24,20,.06)';
  const labelCol = isDark ? 'rgba(122,115,102,.8)'  : 'rgba(138,131,120,.8)';
  const sbTrack  = isDark ? 'rgba(236,231,220,.08)' : 'rgba(26,24,20,.08)';
  const sbThumb  = isDark ? 'rgba(236,231,220,.25)' : 'rgba(26,24,20,.22)';
  const sbThumbH = isDark ? 'rgba(236,231,220,.45)' : 'rgba(26,24,20,.38)';

  /* scrollbar is drawn at very bottom; shrink usable chart height */
  const PL = 80, PR = 16, PT = 18;
  const PB = 36 + SB_T + SB_H + 4;
  const cW = W - PL - PR, cH = H - PT - PB;

  const data = allCandles.slice(_viewStart, _viewStart + _viewCount);
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
      ctx.fillText(label, cx, H - PB + SB_T - 4);
    }
  });

  /* ── scrollbar ── */
  const sbY = H - SB_H - 4;
  const sbX = PL, sbW = cW;

  ctx.fillStyle = sbTrack;
  ctx.beginPath();
  ctx.roundRect(sbX, sbY, sbW, SB_H, 3);
  ctx.fill();

  const thumbW = Math.max(20, sbW * (_viewCount / total));
  const thumbX = sbX + (sbW - thumbW) * (_viewStart / Math.max(1, total - _viewCount));
  const isHover = _dragState?.type === 'scrollbar';
  ctx.fillStyle = isHover ? sbThumbH : sbThumb;
  ctx.beginPath();
  ctx.roundRect(thumbX, sbY, thumbW, SB_H, 3);
  ctx.fill();

  _chartMeta = { data, PL, slotW, N, toY, sbX, sbY, sbW, SB_H, thumbX, thumbW, total };
}

/* ── unified canvas mouse handlers ── */
const _chartCanvas = document.getElementById('enko-chart');

function getCanvasPos(e) {
  const rect = _chartCanvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function isOnScrollbar(x, y) {
  if (!_chartMeta) return false;
  const { sbX, sbY, sbW, SB_H } = _chartMeta;
  return x >= sbX && x <= sbX + sbW && y >= sbY && y <= sbY + SB_H;
}

_chartCanvas?.addEventListener('mousedown', e => {
  if (!_chartMeta) return;
  const { x, y } = getCanvasPos(e);
  if (isOnScrollbar(x, y)) {
    _dragState = { type: 'scrollbar', startX: x, startViewStart: _viewStart };
  } else {
    _dragState = { type: 'pan', startX: x, startViewStart: _viewStart };
  }
  _chartCanvas.style.cursor = 'grabbing';
});

_chartCanvas?.addEventListener('mousemove', e => {
  if (!_chartMeta) return;
  const { x, y } = getCanvasPos(e);
  const { PL, slotW, data, N, sbX, sbY, sbW, SB_H, thumbW, total } = _chartMeta;

  if (_dragState) {
    const dx = x - _dragState.startX;
    if (_dragState.type === 'pan') {
      /* dragging chart body: each slotW px = 1 candle */
      const delta = -Math.round(dx / slotW);
      _viewStart = Math.max(0, Math.min(total - _viewCount, _dragState.startViewStart + delta));
    } else {
      /* dragging scrollbar thumb */
      const scrollRange = sbW - thumbW;
      if (scrollRange > 0) {
        const ratio = dx / scrollRange;
        _viewStart = Math.round(Math.max(0, Math.min(total - _viewCount, _dragState.startViewStart + ratio * (total - _viewCount))));
      }
    }
    drawEnkoChart(_chartCandles);
    return;
  }

  /* tooltip */
  const tip = document.getElementById('ch-tooltip');
  if (!tip) return;

  if (isOnScrollbar(x, y)) {
    _chartCanvas.style.cursor = 'pointer';
    tip.style.display = 'none';
    return;
  }

  _chartCanvas.style.cursor = 'crosshair';
  const idx = Math.floor((x - PL) / slotW);
  if (idx < 0 || idx >= N) { tip.style.display = 'none'; return; }
  const c = data[idx];
  const isBull = c.c >= c.o;
  const pct = (((c.c - c.o) / c.o) * 100).toFixed(2);
  tip.innerHTML = `<span style="color:${isBull ? 'var(--pos)' : 'var(--neg)'}">${isBull ? '▲' : '▼'} ${pct}%</span>\nO: ${fmtUsd(c.o)}  H: ${fmtUsd(c.h)}\nL: ${fmtUsd(c.l)}  C: ${fmtUsd(c.c)}`;
  tip.style.display = 'block';
  tip.style.left = Math.min(x + 14, _chartCanvas.offsetWidth - 190) + 'px';
  tip.style.top = Math.max(y - 70, 0) + 'px';
});

_chartCanvas?.addEventListener('mouseup', () => {
  _dragState = null;
  if (_chartCanvas) _chartCanvas.style.cursor = 'crosshair';
});

_chartCanvas?.addEventListener('mouseleave', () => {
  _dragState = null;
  if (_chartCanvas) _chartCanvas.style.cursor = '';
  const tip = document.getElementById('ch-tooltip');
  if (tip) tip.style.display = 'none';
});

_chartCanvas?.addEventListener('wheel', e => {
  if (!_chartMeta) return;
  e.preventDefault();
  const { x } = getCanvasPos(e);
  const { PL, slotW, N, total } = _chartMeta;

  /* zoom centered on mouse x */
  const idxUnderMouse = (x - PL) / slotW; // fractional index in current view
  const zoomFactor = e.deltaY > 0 ? 1.15 : 0.87;
  const newCount = Math.round(Math.max(VIEW_MIN, Math.min(VIEW_MAX, _viewCount * zoomFactor)));
  if (newCount === _viewCount) return;

  /* keep the candle under the mouse pinned */
  const absoluteIdx = _viewStart + idxUnderMouse;
  _viewStart = Math.round(absoluteIdx - idxUnderMouse * (newCount / _viewCount));
  _viewCount = newCount;
  clampView(total);
  drawEnkoChart(_chartCandles);
}, { passive: false });

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
    resetViewToLatest(_chartCandles.length);
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
  resetViewToLatest(demo.length);
  drawEnkoChart(demo);
}

document.querySelectorAll('.ch-tf-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (btn.classList.contains('active')) return;
    document.querySelectorAll('.ch-tf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const newTf = btn.dataset.tf;
    
    // Check if we have cached data for this timeframe first
    const cache = _cacheCandles[newTf];
    const now = Date.now();
    const hasFreshCache = cache && cache.data && (now - cache.time) < cache.ttl;
    
    if (hasFreshCache) {
      // Use cached data immediately
      _chartTf = newTf;
      _chartCandles = cache.data;
      resetViewToLatest(_chartCandles.length);
      drawEnkoChart(_chartCandles);
    } else {
      // Fetch fresh data only if cache is stale
      _chartTf = newTf;
      const candles = await fetchChartCandles(_chartTf);
      if (candles && candles.length > 1) {
        _chartCandles = candles;
        resetViewToLatest(_chartCandles.length);
        drawEnkoChart(candles);
      }
    }
  });
});

window.addEventListener('resize', () => {
  if (_chartCandles.length) drawEnkoChart(_chartCandles);
});

/* ── LEDGER — live trades ── */
async function fetchTrades() {
  try {
    // Check cache first (API backend caches for 1 minute)
    const now = Date.now();
    if (_cacheTrades.data && (now - _cacheTrades.time) < _cacheTrades.ttl) {
      return;
    }

    const r = await fetch(`${GT}/pools/${CHART_POOL}/trades`, {
      headers: { 'Accept': `application/json;version=${API_VERSION}` }
    });
    
    // Check for rate limiting
    if (r.status === 429) {
      console.warn('Rate limited by GeckoTerminal API (10 calls/min limit).');
      return;
    }
    
    if (!r.ok) {
      console.warn(`API error: ${r.status}`);
      return;
    }

    const d = await r.json();
    const trades = d.data;
    if (!trades || !trades.length) return;

    // Cache the result
    _cacheTrades = { data: trades, time: now, ttl: 60000 };

    const tbody = document.getElementById('tx-body');
    if (!tbody) return;

    tbody.innerHTML = trades.slice(0, 10).map(t => {
      const a = t.attributes;
      const isBuy = a.kind === 'buy';

      const date = new Date(a.block_timestamp);
      const time = date.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
        + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const enkoAmt = parseFloat(isBuy ? a.to_token_amount : a.from_token_amount);
      const price   = parseFloat(isBuy ? a.price_to_in_usd   : a.price_from_in_usd);
      const value   = parseFloat(a.volume_in_usd);

      const wallet  = a.tx_from_address
        ? a.tx_from_address.slice(0, 4) + '…' + a.tx_from_address.slice(-4)
        : '—';

      const amtFmt  = isNaN(enkoAmt) ? '—' : Math.round(enkoAmt).toLocaleString();
      const priceFmt = '$' + fmtPrice(price);
      const valFmt  = fmtUsd(value);
      const typeClass = isBuy ? 'pos' : 'neg';
      const typeLabel = isBuy ? 'BUY' : 'SELL';

      return `<tr>
        <td style="color:var(--ink-mute)">${time}</td>
        <td class="${typeClass}">${typeLabel}</td>
        <td>${amtFmt}</td>
        <td>${priceFmt}</td>
        <td>${valFmt}</td>
        <td style="color:var(--ink-soft)">${wallet}</td>
      </tr>`;
    }).join('');
  } catch (e) {
    console.warn('trades fetch', e);
  }
}

/* prefetch starts immediately on script load — runs in the background
   while the user is still on the intro/entry screen */
const _prefetch = {
  token: fetchChartToken(),
  candles: fetchChartCandles(_chartTf),
  trades: fetchTrades(),
};

async function initCharts() {
  /* consume prefetched results — already in flight or done */
  const [candles] = await Promise.all([
    _prefetch.candles,
    _prefetch.token,
  ]);

  if (candles && candles.length > 1) {
    _chartCandles = candles;
    resetViewToLatest(_chartCandles.length);
    drawEnkoChart(candles);
  } else {
    drawDemoEnkoChart();
  }

  /* trades loop — every 12 seconds (5 calls/min) */
  await _prefetch.trades;
  (async function tradesLoop() {
    await fetchTrades();
    setTimeout(tradesLoop, 12000);
  })();

  /* Update token data every 30 seconds (2 calls/min) */
  setInterval(async () => {
    fetchChartToken();
  }, 30000);

  /* Update charts every 30 seconds (2 calls/min) + trades (5) + token (2) = 9 calls/min */
  setInterval(async () => {
    if (!_chartLoading && _chartCandles.length) {
      const fresh = await fetchChartCandles(_chartTf);
      if (fresh && fresh.length > 1) {
        _chartCandles = fresh;
        const atEnd = _viewStart >= fresh.length - _viewCount - 2;
        if (atEnd) resetViewToLatest(fresh.length);
        drawEnkoChart(fresh);
      }
    }
  }, 30000);
}
