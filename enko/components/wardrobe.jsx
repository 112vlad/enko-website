// Wardrobe — portrait studio
const { useState: useStateW, useMemo: useMemoW, useRef: useRefW } = React;

/* ---------- asset catalog ---------- */

const BACKGROUNDS = [
  { id: 'savanna',  name: 'Savanna',   css: 'linear-gradient(180deg, #e8d89a 0%, #c9a86a 50%, #8a6a3a 100%)' },
  { id: 'dusk',     name: 'Dusk',      css: 'linear-gradient(180deg, #4a3a5a 0%, #a8685a 60%, #d89a6a 100%)' },
  { id: 'fog',      name: 'Fog',       css: 'linear-gradient(180deg, #d4d0c8 0%, #a8a49a 100%)' },
  { id: 'studio',   name: 'Studio',    css: 'linear-gradient(180deg, #2a2520 0%, #1a1814 100%)' },
  { id: 'paper',    name: 'Paper',     css: 'linear-gradient(180deg, #f0ebe0 0%, #dcd4c0 100%)' },
  { id: 'forest',   name: 'Forest',    css: 'linear-gradient(180deg, #3a4a2a 0%, #6a7a4a 100%)' },
  { id: 'sea',      name: 'Sea',       css: 'linear-gradient(180deg, #5a7a8a 0%, #8aa4b0 100%)' },
  { id: 'rust',     name: 'Rust',      css: 'linear-gradient(180deg, #8a4a2a 0%, #c9693a 100%)' },
  { id: 'void',     name: 'Void',      css: '#0a0a08' },
];

// Category: 'accessories' (exclusive one at a time, any type), 'bowties' (exclusive)
const ACCESSORIES = [
  { id: 'bandana-blue',   name: 'Bandana · Blue',   cat: 'accessories', color: '#3a5a8a', kind: 'bandana' },
  { id: 'bandana-red',    name: 'Bandana · Red',    cat: 'accessories', color: '#8a3a2a', kind: 'bandana' },
  { id: 'bandana-olive',  name: 'Bandana · Olive',  cat: 'accessories', color: '#5b6b3a', kind: 'bandana' },
  { id: 'cap-navy',       name: 'Cap · Navy',       cat: 'accessories', color: '#1a2a4a', kind: 'cap' },
  { id: 'hat-fedora',     name: 'Fedora',           cat: 'accessories', color: '#3a2a1a', kind: 'fedora' },
  { id: 'mortarboard',    name: 'Mortarboard',      cat: 'accessories', color: '#1a1814', kind: 'mortarboard' },
  { id: 'glasses-round',  name: 'Glasses · Round',  cat: 'accessories', color: '#1a1814', kind: 'glasses' },
  { id: 'monocle',        name: 'Monocle',          cat: 'accessories', color: '#b8a868', kind: 'monocle' },
];

const BOWTIES = [
  { id: 'bowtie-green',   name: 'Bow-tie · Green',  cat: 'bowties', color: '#3a6a4a', kind: 'bowtie' },
  { id: 'bowtie-black',   name: 'Bow-tie · Black',  cat: 'bowties', color: '#1a1814', kind: 'bowtie' },
  { id: 'bowtie-red',     name: 'Bow-tie · Red',    cat: 'bowties', color: '#8a3a2a', kind: 'bowtie' },
  { id: 'bowtie-cream',   name: 'Bow-tie · Cream',  cat: 'bowties', color: '#e8d8b0', kind: 'bowtie' },
  { id: 'bowtie-navy',    name: 'Bow-tie · Navy',   cat: 'bowties', color: '#1a2a4a', kind: 'bowtie' },
  { id: 'bowtie-olive',   name: 'Bow-tie · Olive',  cat: 'bowties', color: '#5b6b3a', kind: 'bowtie' },
];

const ALL_ITEMS = [...ACCESSORIES, ...BOWTIES];



/* ---------- Giraffe illustration (placeholder-style but readable) ---------- */

function GiraffeSVG({ accessory, bowtie, background }) {
  // We render a stylized giraffe portrait using SVG.

  // Accessory can be any kind; bowtie is separate.
  const bandana = accessory?.kind === 'bandana' ? accessory : null;
  const head    = (accessory?.kind === 'cap' || accessory?.kind === 'fedora' || accessory?.kind === 'mortarboard') ? accessory : null;
  const eyes    = (accessory?.kind === 'glasses' || accessory?.kind === 'monocle') ? accessory : null;
  const neck    = bowtie;

  const tilt = 0;
  const ty   = 0;

  return (
    <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
      <defs>
        <pattern id="giraffePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#d9a96a"/>
          <path d="M5 5 L20 3 L30 15 L22 28 L8 22 Z" fill="#8a5a2a"/>
          <path d="M28 28 L38 30 L36 40 L26 38 Z" fill="#8a5a2a"/>
        </pattern>
        <pattern id="giraffePatternLight" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#e8c48a"/>
          <path d="M5 5 L20 3 L30 15 L22 28 L8 22 Z" fill="#a87a3a"/>
          <path d="M28 28 L38 30 L36 40 L26 38 Z" fill="#a87a3a"/>
        </pattern>
      </defs>

      {/* background */}
      <rect width="400" height="500" fill={background ? `url(#bg-${background.id})` : '#d9a96a'} />
      {background && (
        <>
          <rect width="400" height="500" style={{fill: 'none'}} />
          <foreignObject x="0" y="0" width="400" height="500">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{width:'100%',height:'100%',background: background.css}}/>
          </foreignObject>
        </>
      )}

      <g>
        {/* neck base */}
        <path d="M150 500 L150 360 Q150 320 200 310 Q250 320 250 360 L250 500 Z" fill="url(#giraffePattern)" />

        {/* head */}
        <ellipse cx="200" cy="260" rx="68" ry="90" fill="url(#giraffePattern)" />
        {/* muzzle */}
        <ellipse cx="200" cy="320" rx="46" ry="38" fill="url(#giraffePatternLight)" />
        {/* nostrils */}
        <ellipse cx="188" cy="318" rx="3" ry="4" fill="#3a2a1a" />
        <ellipse cx="212" cy="318" rx="3" ry="4" fill="#3a2a1a" />
        {/* mouth */}
        <path d="M184 340 Q200 346 216 340" stroke="#3a2a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* ears */}
        <ellipse cx="138" cy="210" rx="18" ry="26" fill="url(#giraffePattern)" transform="rotate(-30 138 210)"/>
        <ellipse cx="262" cy="210" rx="18" ry="26" fill="url(#giraffePattern)" transform="rotate(30 262 210)"/>
        <ellipse cx="138" cy="214" rx="10" ry="18" fill="#d8a078" transform="rotate(-30 138 214)"/>
        <ellipse cx="262" cy="214" rx="10" ry="18" fill="#d8a078" transform="rotate(30 262 214)"/>

        {/* ossicones */}
        <rect x="172" y="170" width="10" height="34" rx="4" fill="#8a5a2a"/>
        <circle cx="177" cy="170" r="8" fill="#3a2a1a"/>
        <rect x="218" y="170" width="10" height="34" rx="4" fill="#8a5a2a"/>
        <circle cx="223" cy="170" r="8" fill="#3a2a1a"/>

        {/* eyes */}
        <ellipse cx="172" cy="248" rx="9" ry="11" fill="#fff"/>
        <ellipse cx="228" cy="248" rx="9" ry="11" fill="#fff"/>
        <circle cx="172" cy="250" r="5" fill="#1a1008"/>
        <circle cx="228" cy="250" r="5" fill="#1a1008"/>
        <circle cx="173" cy="248" r="1.5" fill="#fff"/>
        <circle cx="229" cy="248" r="1.5" fill="#fff"/>

        {/* eyelashes */}
        <path d="M164 240 L161 237 M168 237 L167 233 M172 236 L172 232 M176 237 L177 233" stroke="#1a1008" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M236 240 L239 237 M232 237 L233 233 M228 236 L228 232 M224 237 L223 233" stroke="#1a1008" strokeWidth="1.4" strokeLinecap="round"/>

        {/* accessories — head */}
        {head?.kind === 'cap' && (
          <g>
            <path d="M130 200 Q200 140 270 200 L270 210 L130 210 Z" fill={head.color}/>
            <path d="M270 210 Q290 214 294 224 L280 222 Q272 218 270 215 Z" fill={head.color}/>
          </g>
        )}
        {head?.kind === 'fedora' && (
          <g>
            <ellipse cx="200" cy="200" rx="100" ry="16" fill={head.color}/>
            <path d="M150 200 Q150 150 200 140 Q250 150 250 200 Z" fill={head.color}/>
            <rect x="150" y="196" width="100" height="8" fill="#1a1008" opacity="0.3"/>
          </g>
        )}
        {head?.kind === 'mortarboard' && (
          <g>
            <rect x="150" y="190" width="100" height="18" rx="2" fill={head.color}/>
            <polygon points="110,180 290,180 250,200 150,200" fill={head.color}/>
            <line x1="200" y1="180" x2="260" y2="170" stroke="#8a6a2a" strokeWidth="2"/>
            <circle cx="262" cy="170" r="5" fill="#c9993a"/>
          </g>
        )}

        {/* eyes accessory */}
        {eyes?.kind === 'glasses' && (
          <g fill="none" stroke={eyes.color} strokeWidth="2.5">
            <circle cx="172" cy="250" r="14"/>
            <circle cx="228" cy="250" r="14"/>
            <line x1="186" y1="250" x2="214" y2="250"/>
          </g>
        )}
        {eyes?.kind === 'monocle' && (
          <g fill="none" stroke={eyes.color} strokeWidth="2.5">
            <circle cx="228" cy="250" r="18"/>
            <path d="M246 252 L254 280" strokeWidth="1.2"/>
          </g>
        )}

        {/* face — bandana */}
        {bandana?.kind === 'bandana' && (
          <g>
            <path d="M140 290 Q200 288 260 290 L258 356 Q200 370 142 356 Z" fill={bandana.color}/>
            <path d="M150 300 Q200 298 250 300" stroke="#fff" strokeWidth="1" strokeDasharray="2 4" fill="none" opacity="0.4"/>
            <path d="M150 320 Q200 318 250 320" stroke="#fff" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.4"/>
            <path d="M150 340 Q200 338 250 340" stroke="#fff" strokeWidth="1" strokeDasharray="2 4" fill="none" opacity="0.4"/>
          </g>
        )}

        {/* bowtie */}
        {neck?.kind === 'bowtie' && (
          <g>
            <polygon points="165,238 200,228 200,262 165,250" fill={neck.color}/>
            <polygon points="235,238 200,228 200,262 235,250" fill={neck.color}/>
            <rect x="194" y="232" width="12" height="28" rx="2" fill={neck.color}/>
          </g>
        )}
      </g>
    </svg>
  );
}

/* ---------- Wardrobe page ---------- */

const CATEGORIES = [
  { id: 'background',  label: 'Backgrounds' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'bowties',     label: 'Bowties' },
];

function Wardrobe() {
  const { tweaks, update, editMode } = useTweaks();

  const [cat, setCat] = useStateW('accessories');
  const [bg, setBg] = useStateW(BACKGROUNDS[0]);

  // One accessory (any kind) + one bowtie, both toggleable
  const [accessoryId, setAccessoryId] = useStateW('bandana-blue');
  const [bowtieId,    setBowtieId]    = useStateW('bowtie-green');

  const toggleItem = (item) => {
    if (item.cat === 'accessories') {
      setAccessoryId(prev => prev === item.id ? null : item.id);
    } else {
      setBowtieId(prev => prev === item.id ? null : item.id);
    }
  };
  const clearAll = () => { setAccessoryId(null); setBowtieId(null); };

  const accessory = accessoryId ? ACCESSORIES.find(a => a.id === accessoryId) : null;
  const bowtie    = bowtieId    ? BOWTIES.find(b => b.id === bowtieId)       : null;

  return (
    <>
      <TopBar active="wardrobe" />

      <main className="shell wardrobe-page">
        {/* page head */}
        <div className="wardrobe-head">
          <div>
            <div className="eyebrow">§ II — The Wardrobe</div>
            <h1 className="wardrobe-title">The <span className="it">Portrait</span><br/>Studio.</h1>
          </div>
          <div className="wardrobe-head-right">
            <p>Select an accessory. Set a background. Save your portrait and use it wherever a face is asked of you.</p>
            <div style={{display:'flex', gap: 12, marginTop: 20}}>
              <button className="btn">Save portrait <span className="arrow">↓</span></button>
              <button className="btn ghost" onClick={clearAll}>Reset</button>
            </div>
          </div>
        </div>

        {/* main grid */}
        <div className="wardrobe-grid">
          {/* LEFT — controls */}
          <aside className="wardrobe-controls">
            <div className="tab-row">
              {CATEGORIES.map(c => (
                <button key={c.id} className={`tab ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>

            {cat === 'background' && (
              <div className="panel">
                <div className="slot-group">
                  <div className="slot-head">
                    <span className="eyebrow">Scene</span>
                  </div>
                  <div className="swatch-grid bg-grid">
                    {BACKGROUNDS.map((b, i) => (
                      <div key={b.id} className={`swatch ${bg.id === b.id ? 'selected' : ''}`} onClick={() => setBg(b)}>
                        <div className="swatch-num" style={{color: '#fff', textShadow:'0 1px 2px rgba(0,0,0,.4)'}}>{String(i + 1).padStart(2, '0')}</div>
                        <div style={{position:'absolute', inset: 0, background: b.css}}></div>
                        <div className="swatch-name" style={{color: '#fff', textShadow:'0 1px 2px rgba(0,0,0,.4)'}}>{b.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {cat === 'accessories' && (
              <div className="panel">
                <div className="slot-group">
                  <div className="slot-head">
                    <span className="eyebrow">Accessory</span>
                    {accessoryId && (
                      <button className="clear-slot" onClick={() => setAccessoryId(null)}>clear</button>
                    )}
                  </div>
                  <div className="swatch-grid">
                    {ACCESSORIES.map((a, i) => (
                      <div key={a.id} className={`swatch ${accessoryId === a.id ? 'selected' : ''}`} onClick={() => toggleItem(a)}>
                        <div className="swatch-num">{String(i + 1).padStart(2, '0')}</div>
                        <AccessoryThumb acc={a} />
                        <div className="swatch-name">{a.name.split('·')[1]?.trim() || a.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {cat === 'bowties' && (
              <div className="panel">
                <div className="slot-group">
                  <div className="slot-head">
                    <span className="eyebrow">Bowtie</span>
                    {bowtieId && (
                      <button className="clear-slot" onClick={() => setBowtieId(null)}>clear</button>
                    )}
                  </div>
                  <div className="swatch-grid">
                    {BOWTIES.map((b, i) => (
                      <div key={b.id} className={`swatch ${bowtieId === b.id ? 'selected' : ''}`} onClick={() => toggleItem(b)}>
                        <div className="swatch-num">{String(i + 1).padStart(2, '0')}</div>
                        <AccessoryThumb acc={b} />
                        <div className="swatch-name">{b.name.split('·')[1]?.trim() || b.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* CENTER — portrait */}
          <section className="wardrobe-portrait">
            <div className="portrait-frame">
              <GiraffeSVG accessory={accessory} bowtie={bowtie} background={bg}/>
            </div>
            <div className="portrait-meta">
              <div className="cell">
                <div className="k">Subject</div>
                <div className="v">Enko</div>
              </div>
              <div className="cell">
                <div className="k">Scene</div>
                <div className="v">{bg.name}</div>
              </div>
              <div className="cell">
                <div className="k">Accessory</div>
                <div className="v">{accessory?.name || '—'}</div>
              </div>
              <div className="cell">
                <div className="k">Bowtie</div>
                <div className="v">{bowtie?.name.replace('Bow-tie · ','') || '—'}</div>
              </div>
            </div>
          </section>

          {/* RIGHT — summary */}
          <aside className="wardrobe-summary">
            <div className="eyebrow">Manifest</div>
            <h3 className="summary-title">A portrait,<br/><span className="it">assembled.</span></h3>
            <div className="summary-list">
              <SummaryRow k="Scene" v={bg.name} />
              <SummaryRow k="Accessories" v={accessory?.name || '—'} />
              <SummaryRow k="Bowtie" v={bowtie ? bowtie.name.replace('Bow-tie · ','') : '—'} />
            </div>
            <div style={{marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--rule-soft)'}}>
              <div className="eyebrow" style={{marginBottom: 10}}>Export</div>
              <div style={{display:'flex', flexDirection:'column', gap: 8}}>
                <button className="btn" style={{justifyContent:'space-between', width: '100%'}}>
                  Save as PFP <span className="arrow">→</span>
                </button>
                <button className="btn ghost" style={{justifyContent:'space-between', width: '100%'}}>
                  Download PNG <span className="arrow">↓</span>
                </button>
                <button className="btn ghost" style={{justifyContent:'space-between', width: '100%'}}>
                  Copy link <span className="arrow">⎘</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-head">
                <span className="it">Enko</span>,<br/>at leisure.
              </div>
            </div>
            <div className="footer-col">
              <div className="h">Token</div>
              <a href="index.html">Chart</a>
              <a href="index.html#ledger">Ledger</a>
              <a href="#">Contract</a>
            </div>
            <div className="footer-col">
              <div className="h">Studio</div>
              <a href="wardrobe.html">Wardrobe</a>
              <a href="#">Portraits</a>
            </div>
            <div className="footer-col">
              <div className="h">Elsewhere</div>
              <a href="#">Twitter / X</a>
              <a href="#">Telegram</a>
              <a href="#">DexScreener</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Enko · MMXXVI</span>
            <div>
              <span>Not financial advice</span>
              <span>SOL · Mainnet</span>
            </div>
          </div>
        </footer>
      </main>

      <TweaksPanel tweaks={tweaks} update={update} show={editMode} />
    </>
  );
}

function SummaryRow({ k, v }) {
  return (
    <div className="summary-row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

function AccessoryThumb({ acc }) {
  const cx = 50, cy = 54;
  if (acc.id === 'none') {
    return <svg viewBox="0 0 100 100" style={{position:'absolute', inset: 0, width:'100%', height:'100%'}}>
      <line x1="30" y1="30" x2="70" y2="70" stroke="var(--ink-mute)" strokeWidth="1"/>
      <line x1="70" y1="30" x2="30" y2="70" stroke="var(--ink-mute)" strokeWidth="1"/>
    </svg>;
  }
  return (
    <svg viewBox="0 0 100 100" style={{position:'absolute', inset: 0, width:'100%', height:'100%'}}>
      {acc.kind === 'bandana' && <path d={`M20 50 Q50 48 80 50 L78 75 Q50 80 22 75 Z`} fill={acc.color}/>}
      {acc.kind === 'bowtie' && <g fill={acc.color}>
        <polygon points="30,40 52,34 52,66 30,60"/>
        <polygon points="70,40 48,34 48,66 70,60"/>
        <rect x="46" y="36" width="8" height="28" rx="2"/>
      </g>}
      {acc.kind === 'scarf' && <g fill={acc.color}>
        <path d="M20 40 Q50 36 80 40 L82 70 Q50 76 18 70 Z"/>
        <path d="M70 68 L84 90 L76 90 L66 72 Z"/>
      </g>}
      {acc.kind === 'cap' && <g fill={acc.color}>
        <path d="M20 50 Q50 22 80 50 L80 58 L20 58 Z"/>
        <path d="M80 58 Q92 62 96 72 L82 68 Z"/>
      </g>}
      {acc.kind === 'fedora' && <g fill={acc.color}>
        <ellipse cx="50" cy="60" rx="38" ry="6"/>
        <path d="M30 60 Q30 32 50 28 Q70 32 70 60 Z"/>
      </g>}
      {acc.kind === 'mortarboard' && <g fill={acc.color}>
        <rect x="30" y="50" width="40" height="10" rx="1"/>
        <polygon points="16,46 84,46 70,58 30,58"/>
      </g>}
      {acc.kind === 'glasses' && <g fill="none" stroke={acc.color} strokeWidth="3">
        <circle cx="36" cy="54" r="14"/>
        <circle cx="64" cy="54" r="14"/>
        <line x1="50" y1="54" x2="50" y2="54"/>
      </g>}
      {acc.kind === 'monocle' && <g fill="none" stroke={acc.color} strokeWidth="3">
        <circle cx="56" cy="52" r="18"/>
        <path d="M74 58 L80 80" strokeWidth="1.5"/>
      </g>}
    </svg>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Wardrobe />);

Object.assign(window, { Wardrobe });
