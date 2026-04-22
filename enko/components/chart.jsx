// Chart — candlestick + line, hover crosshair, tooltip, timeframe switcher
const { useState: useStateC, useMemo: useMemoC, useRef: useRefC, useEffect: useEffectC } = React;

// deterministic pseudo-random for stable chart
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function generateSeries(points, seed, startPrice, trend = 0.0002) {
  const rnd = seeded(seed);
  const out = [];
  let p = startPrice;
  const now = Date.now();
  const step = 3600 * 1000; // 1h
  for (let i = 0; i < points; i++) {
    const open = p;
    const drift = trend + (rnd() - 0.5) * 0.04;
    const close = Math.max(0.000001, open * (1 + drift));
    const hi = Math.max(open, close) * (1 + rnd() * 0.02);
    const lo = Math.min(open, close) * (1 - rnd() * 0.02);
    const vol = 20000 + rnd() * 180000;
    out.push({ t: now - (points - i) * step, open, close, hi, lo, vol });
    p = close;
  }
  return out;
}

const TIMEFRAMES = [
  { id: '1H',  label: '1H',  points: 60,  seed: 3, start: 0.0079 },
  { id: '24H', label: '24H', points: 96,  seed: 17, start: 0.0072, trend: 0.0008 },
  { id: '7D',  label: '7D',  points: 168, seed: 42, start: 0.0055, trend: 0.0012 },
  { id: '30D', label: '30D', points: 180, seed: 88, start: 0.0031, trend: 0.002 },
  { id: 'ALL', label: 'All', points: 260, seed: 123, start: 0.00021, trend: 0.004 },
];

function fmtPrice(v) {
  if (v >= 1) return '$' + v.toFixed(2);
  if (v >= 0.01) return '$' + v.toFixed(4);
  return '$' + v.toFixed(7).replace(/0+$/, '').replace(/\.$/, '.0');
}
function fmtShort(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(0);
}
function fmtTime(ts, tf) {
  const d = new Date(ts);
  if (tf === '1H' || tf === '24H') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function PriceChart() {
  const [tfId, setTfId] = useStateC('7D');
  const [mode, setMode] = useStateC('candle'); // candle | line
  const [hover, setHover] = useStateC(null);
  const wrapRef = useRefC(null);
  const [dims, setDims] = useStateC({ w: 800, h: 360 });

  useEffectC(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setDims({ w: e.contentRect.width, h: e.contentRect.height });
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const tf = TIMEFRAMES.find(t => t.id === tfId);
  const series = useMemoC(() => generateSeries(tf.points, tf.seed, tf.start, tf.trend ?? 0.0002), [tfId]);

  const padL = 60, padR = 20, padT = 24, padB = 36;
  const W = dims.w, H = dims.h;
  const innerW = Math.max(100, W - padL - padR);
  const innerH = Math.max(80, H - padT - padB);

  const yMin = Math.min(...series.map(d => d.lo));
  const yMax = Math.max(...series.map(d => d.hi));
  const yPad = (yMax - yMin) * 0.08;
  const yLo = yMin - yPad, yHi = yMax + yPad;

  const x = (i) => padL + (i / (series.length - 1)) * innerW;
  const y = (v) => padT + (1 - (v - yLo) / (yHi - yLo)) * innerH;

  const linePath = useMemoC(() => {
    return series.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.close).toFixed(1)}`).join(' ');
  }, [series, W, H]);
  const areaPath = useMemoC(() => {
    return linePath + ` L${x(series.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${padL.toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
  }, [linePath, series, W, H]);

  const yTicks = 5;
  const yValues = Array.from({ length: yTicks }, (_, i) => yLo + (yHi - yLo) * (i / (yTicks - 1)));
  const xTickCount = 6;
  const xTicks = Array.from({ length: xTickCount }, (_, i) => Math.round((series.length - 1) * (i / (xTickCount - 1))));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.round(((px - padL) / innerW) * (series.length - 1));
    const clamped = Math.max(0, Math.min(series.length - 1, i));
    setHover(clamped);
  };
  const onLeave = () => setHover(null);

  const last = series[series.length - 1];
  const first = series[0];
  const change = ((last.close - first.open) / first.open) * 100;
  const changePos = change >= 0;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-header-left">
          <div className="eyebrow">Price · SOL market</div>
          <div className="chart-price num">{fmtPrice(last.close)}</div>
          <div className={`chart-change num ${changePos ? 'pos' : 'neg'}`}>
            {changePos ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
            <span style={{color: 'var(--ink-mute)', marginLeft: 8, fontSize: 11}}>{tf.label.toLowerCase()}</span>
          </div>
        </div>
        <div className="chart-header-right">
          <div className="chart-mode">
            <button className={mode === 'candle' ? 'active' : ''} onClick={() => setMode('candle')}>Candles</button>
            <button className={mode === 'line' ? 'active' : ''} onClick={() => setMode('line')}>Line</button>
          </div>
          <div className="chart-tf">
            {TIMEFRAMES.map(t => (
              <button key={t.id} className={tfId === t.id ? 'active' : ''} onClick={() => setTfId(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-wrap" ref={wrapRef} style={{height: 360}} onMouseMove={onMove} onMouseLeave={onLeave}>
        <svg className="chart-svg" width={W} height={H}>
          <defs>
            <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="var(--ink)" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* grid */}
          <g className="chart-grid">
            {yValues.map((v, i) => (
              <line key={i} x1={padL} x2={padL + innerW} y1={y(v)} y2={y(v)} />
            ))}
          </g>

          {/* y axis labels */}
          <g className="chart-axis">
            {yValues.map((v, i) => (
              <text key={i} x={padL - 10} y={y(v) + 3} textAnchor="end">{fmtPrice(v)}</text>
            ))}
          </g>
          {/* x axis labels */}
          <g className="chart-axis">
            {xTicks.map((i, k) => (
              <text key={k} x={x(i)} y={padT + innerH + 22} textAnchor="middle">{fmtTime(series[i].t, tfId)}</text>
            ))}
          </g>

          {mode === 'line' ? (
            <>
              <path d={areaPath} className="chart-area" />
              <path d={linePath} className="chart-line" />
            </>
          ) : (
            <g>
              {series.map((d, i) => {
                const up = d.close >= d.open;
                const cx = x(i);
                const bw = Math.max(1.5, innerW / series.length * 0.6);
                const yO = y(d.open), yC = y(d.close);
                const yH = y(d.hi), yL = y(d.lo);
                const color = up ? 'var(--pos)' : 'var(--neg)';
                return (
                  <g key={i}>
                    <line x1={cx} x2={cx} y1={yH} y2={yL} stroke={color} strokeWidth={1} />
                    <rect
                      x={cx - bw / 2}
                      y={Math.min(yO, yC)}
                      width={bw}
                      height={Math.max(1, Math.abs(yO - yC))}
                      fill={up ? 'var(--pos)' : 'var(--neg)'}
                      opacity={up ? 0.85 : 1}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* crosshair */}
          {hover != null && (
            <g className="chart-crosshair">
              <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} />
              <line x1={padL} x2={padL + innerW} y1={y(series[hover].close)} y2={y(series[hover].close)} />
              <circle cx={x(hover)} cy={y(series[hover].close)} r={4} className="chart-dot" />
            </g>
          )}
        </svg>
        {hover != null && (() => {
          const d = series[hover];
          const posL = x(hover);
          const posT = y(d.close);
          return (
            <div className="chart-tooltip" style={{left: posL, top: posT}}>
              <div className="v">{fmtPrice(d.close)}</div>
              <div className="d">{new Date(d.t).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

Object.assign(window, { PriceChart, fmtPrice, fmtShort });
