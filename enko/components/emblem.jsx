// Hero emblem — dark metallic, embossed, abstract giraffe silhouette
function GiraffeEmblem() {
  return (
    <svg viewBox="0 0 400 440" className="emblem-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* brushed metal base */}
        <linearGradient id="metalBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2620"/>
          <stop offset="30%" stopColor="#1a1712"/>
          <stop offset="70%" stopColor="#100d0a"/>
          <stop offset="100%" stopColor="#1f1b15"/>
        </linearGradient>
        {/* bevel highlight */}
        <linearGradient id="metalBevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5346" stopOpacity="0.9"/>
          <stop offset="45%" stopColor="#2a2620" stopOpacity="0"/>
          <stop offset="55%" stopColor="#0a0806" stopOpacity="0"/>
          <stop offset="100%" stopColor="#3a342a" stopOpacity="0.7"/>
        </linearGradient>
        {/* inner coin face */}
        <radialGradient id="faceGrad" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#2e2921" stopOpacity="1"/>
          <stop offset="60%" stopColor="#141109" stopOpacity="1"/>
          <stop offset="100%" stopColor="#0a0806" stopOpacity="1"/>
        </radialGradient>
        {/* specular highlight */}
        <radialGradient id="specular" cx="35%" cy="25%" r="45%">
          <stop offset="0%" stopColor="#8a7d62" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#8a7d62" stopOpacity="0"/>
        </radialGradient>
        {/* embossed sheen for silhouette */}
        <linearGradient id="embossSheen" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#a89572" stopOpacity="0.85"/>
          <stop offset="50%" stopColor="#5a4d36" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#1a1612" stopOpacity="0.8"/>
        </linearGradient>
        <linearGradient id="embossShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.1"/>
        </linearGradient>

        {/* Engraved giraffe silhouette mask */}
        <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
          <feOffset dx="0.5" dy="1" result="offset"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.8"/></feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ambient halo */}
      <circle cx="200" cy="220" r="215" fill="none" stroke="#2a241c" strokeWidth="0.5" opacity="0.4"/>

      {/* medallion outer ring — brushed metal */}
      <circle cx="200" cy="220" r="196" fill="url(#metalBase)"/>
      <circle cx="200" cy="220" r="196" fill="url(#metalBevel)" opacity="0.7"/>
      <circle cx="200" cy="220" r="196" fill="none" stroke="#3a342a" strokeWidth="1"/>
      <circle cx="200" cy="220" r="190" fill="none" stroke="#08060a" strokeWidth="1"/>

      {/* engraved micro-ring */}
      <circle cx="200" cy="220" r="186" fill="none" stroke="#5a5042" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.7"/>

      {/* inscribed text ring around outside */}
      <g opacity="0.7">
        <path id="arcTop" d="M 72 220 A 128 128 0 0 1 328 220" fill="none"/>
        <text fontFamily="var(--f-mono)" fontSize="9" letterSpacing="5" fill="#8a7d62">
          <textPath href="#arcTop" startOffset="4%">ENKO · EST · MMXXVI · A GIRAFFE OF CERTAIN STANDING ·</textPath>
        </text>
        <path id="arcBot" d="M 72 220 A 128 128 0 0 0 328 220" fill="none"/>
        <text fontFamily="var(--f-mono)" fontSize="8" letterSpacing="6" fill="#6a5f4c">
          <textPath href="#arcBot" startOffset="15%">SOLANA · MAINNET · NÂº 001</textPath>
        </text>
      </g>

      {/* decorative pips on ring */}
      <g fill="#5a4d36">
        {Array.from({length: 24}).map((_, i) => {
          const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
          const r = 178;
          const cx = 200 + Math.cos(a) * r;
          const cy = 220 + Math.sin(a) * r;
          return <circle key={i} cx={cx} cy={cy} r="0.8" opacity="0.5"/>;
        })}
      </g>

      {/* inner coin face */}
      <circle cx="200" cy="220" r="148" fill="url(#faceGrad)"/>
      {/* inner bevel */}
      <circle cx="200" cy="220" r="148" fill="none" stroke="#3a342a" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="200" cy="220" r="146" fill="none" stroke="#04030a" strokeWidth="1"/>
      <circle cx="200" cy="220" r="142" fill="none" stroke="#5a5042" strokeWidth="0.3" strokeDasharray="0.5 2.5" opacity="0.5"/>

      {/* specular catch */}
      <circle cx="200" cy="220" r="148" fill="url(#specular)"/>

      {/* === Abstract embossed giraffe === */}
      {/* The silhouette is a single stylized form: long arcing neck rising from a
          shoulder mass, with a subtle head/ossicone detail. Rendered as
          layered gradients to read as forged metal. */}
      <g transform="translate(200 245)" filter="url(#emboss)">
        {/* shadow (displaced) */}
        <path
          d="M -50 88
             C -58 60, -48 32, -34 6
             C -22 -18, -8 -42, 4 -66
             C 14 -84, 22 -96, 34 -108
             C 42 -114, 48 -112, 52 -104
             C 54 -96, 46 -88, 40 -80
             C 32 -68, 26 -54, 20 -38
             C 10 -12, 0 14, 2 40
             C 4 60, 16 78, 28 92
             C 30 94, 26 98, 20 98
             L -44 98
             C -50 98, -52 94, -50 88 Z"
          fill="url(#embossShadow)"
          transform="translate(2 2)"
          opacity="0.9"
        />
        {/* main body */}
        <path
          d="M -50 88
             C -58 60, -48 32, -34 6
             C -22 -18, -8 -42, 4 -66
             C 14 -84, 22 -96, 34 -108
             C 42 -114, 48 -112, 52 -104
             C 54 -96, 46 -88, 40 -80
             C 32 -68, 26 -54, 20 -38
             C 10 -12, 0 14, 2 40
             C 4 60, 16 78, 28 92
             C 30 94, 26 98, 20 98
             L -44 98
             C -50 98, -52 94, -50 88 Z"
          fill="url(#embossSheen)"
        />
        {/* highlight edge along neck */}
        <path
          d="M -34 6 C -22 -18, -8 -42, 4 -66 C 14 -84, 22 -96, 34 -108"
          fill="none"
          stroke="#bfa97e"
          strokeWidth="0.8"
          opacity="0.7"
          strokeLinecap="round"
        />
        {/* ossicone/head tip */}
        <path d="M 36 -112 L 38 -124 L 42 -124 L 44 -112 Z" fill="#8a7556" opacity="0.85"/>
        <circle cx="40" cy="-124" r="2" fill="#2a2319"/>
        {/* subtle eye */}
        <circle cx="44" cy="-100" r="1.2" fill="#0a0806"/>
      </g>

      {/* engraved denomination below silhouette */}
      <g transform="translate(200 370)">
        <line x1="-36" y1="0" x2="-14" y2="0" stroke="#5a5042" strokeWidth="0.5"/>
        <line x1="14" y1="0" x2="36" y2="0" stroke="#5a5042" strokeWidth="0.5"/>
        <text x="0" y="4" textAnchor="middle" fontFamily="var(--f-display)" fontSize="15" fontStyle="italic" fill="#bfa97e" letterSpacing="1">Enko</text>
        <text x="0" y="20" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="7" letterSpacing="4" fill="#6a5f4c">1 / 1</text>
      </g>

      {/* spec catch ribbon */}
      <ellipse cx="150" cy="120" rx="70" ry="14" fill="#8a7d62" opacity="0.08" transform="rotate(-18 150 120)"/>
    </svg>
  );
}

function Sparkline({ data, className = 'spark-neutral' }) {
  const w = 52, h = 16;
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / rng) * h]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = line + ` L${w},${h} L0,${h} Z`;
  return (
    <svg className={`spark ${className}`} viewBox={`0 0 ${w} ${h}`}>
      <path className="area" d={area}/>
      <path d={line}/>
    </svg>
  );
}

function Counter({ value, prefix = '', suffix = '', decimals = 0, duration = 1200 }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="counter">{prefix}{v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

Object.assign(window, { GiraffeEmblem, Sparkline, Counter });
