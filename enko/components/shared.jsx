// Shared UI — TopBar, Tweaks, helpers
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ============================================================
   Theme + Tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "dark",
  "palette": "bone",
  "density": "compact",
  "font": "fraunces-inter"
}/*EDITMODE-END*/;

const PALETTES = {
  bone:   { name: "Bone",   light: { bg: "#efeae1", bgSunk: "#e8e2d5", ink: "#1a1814", inkSoft: "#4a453c", inkMute: "#8a8378", rule: "#c9c1b2", ruleSoft: "#d9d2c2", accent: "#5b6b3a" }, dark:  { bg: "#1a1814", bgSunk: "#24201a", ink: "#ece7dc", inkSoft: "#b8b0a0", inkMute: "#7a7366", rule: "#3a342a", ruleSoft: "#2a261f", accent: "#a8b878" } },
  paper:  { name: "Paper",  light: { bg: "#f6f4ef", bgSunk: "#ececdf", ink: "#14140f", inkSoft: "#3d3d35", inkMute: "#7a7a6e", rule: "#cfcdc1", ruleSoft: "#e0ddd0", accent: "#3a5a3a" }, dark:  { bg: "#16160f", bgSunk: "#1f1f17", ink: "#f0ece0", inkSoft: "#bbb6a7", inkMute: "#7f7a6c", rule: "#33312a", ruleSoft: "#252320", accent: "#9ab57a" } },
  ink:    { name: "Ink",    light: { bg: "#ececea", bgSunk: "#e2e2df", ink: "#0f1013", inkSoft: "#3b3c41", inkMute: "#7a7c84", rule: "#c5c5c0", ruleSoft: "#d8d8d3", accent: "#2f4a2f" }, dark:  { bg: "#0f1013", bgSunk: "#17181c", ink: "#eaeaea", inkSoft: "#b8b8b6", inkMute: "#7d7e82", rule: "#2a2b30", ruleSoft: "#1e1f23", accent: "#a6c08a" } },
  clay:   { name: "Clay",   light: { bg: "#eee3d6", bgSunk: "#e2d5c3", ink: "#1f150d", inkSoft: "#4e3f2e", inkMute: "#8a7a66", rule: "#c9b89e", ruleSoft: "#dac9b0", accent: "#6a4a2a" }, dark:  { bg: "#1a130d", bgSunk: "#241b12", ink: "#efe3d0", inkSoft: "#bfae94", inkMute: "#86785f", rule: "#3a2c1e", ruleSoft: "#2a1f15", accent: "#c7955e" } },
};

const FONTS = {
  "fraunces-inter": { name: "Fraunces / Inter", display: "'Fraunces', Georgia, serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace", gf: "Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500" },
  "tiempos-neue":   { name: "Tiempos / Neue",  display: "'DM Serif Display', Georgia, serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', monospace", gf: "DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500" },
  "playfair-work":  { name: "Playfair / Work", display: "'Playfair Display', serif", body: "'Work Sans', sans-serif", mono: "'IBM Plex Mono', monospace", gf: "Playfair+Display:ital,wght@0,500;1,500&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500" },
  "editorial-sans": { name: "Editorial / Sans", display: "'Cormorant Garamond', serif", body: "'Manrope', sans-serif", mono: "'JetBrains Mono', monospace", gf: "Cormorant+Garamond:ital,wght@0,500;1,500&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500" },
};

function useTweaks() {
  const [tweaks, setTweaks] = useState(() => {
    try {
      const v = localStorage.getItem('enko-tweaks-v');
      if (v === '2') {
        const s = localStorage.getItem('enko-tweaks');
        if (s) return { ...TWEAK_DEFAULTS, ...JSON.parse(s) };
      } else {
        localStorage.setItem('enko-tweaks-v', '2');
        localStorage.removeItem('enko-tweaks');
      }
    } catch {}
    return TWEAK_DEFAULTS;
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('enko-tweaks', JSON.stringify(tweaks));
    const root = document.documentElement;
    root.setAttribute('data-theme', tweaks.mode);
    root.setAttribute('data-density', tweaks.density);
    const p = PALETTES[tweaks.palette];
    const v = p[tweaks.mode];
    root.style.setProperty('--bg', v.bg);
    root.style.setProperty('--bg-sunk', v.bgSunk);
    root.style.setProperty('--ink', v.ink);
    root.style.setProperty('--ink-soft', v.inkSoft);
    root.style.setProperty('--ink-mute', v.inkMute);
    root.style.setProperty('--rule', v.rule);
    root.style.setProperty('--rule-soft', v.ruleSoft);
    root.style.setProperty('--accent', v.accent);
    const f = FONTS[tweaks.font];
    root.style.setProperty('--f-display', f.display);
    root.style.setProperty('--f-body', f.body);
    root.style.setProperty('--f-mono', f.mono);
    // load google fonts
    const id = 'enko-gf';
    let link = document.getElementById(id);
    if (!link) { link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; document.head.appendChild(link); }
    link.href = `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`;
  }, [tweaks]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  return { tweaks, update, editMode };
}

function TweaksPanel({ tweaks, update, show }) {
  if (!show) return null;
  return (
    <div className="tweaks">
      <div className="tweaks-head">
        <span className="t">Tweaks</span>
        <span className="t" style={{color: 'var(--ink-mute)'}}>ENKO</span>
      </div>
      <div className="tweaks-body">
        <TweakRow label="Mode" value={tweaks.mode} options={[['light','Light'],['dark','Dark']]} onChange={v => update({mode:v})} />
        <TweakRow label="Palette" value={tweaks.palette} options={Object.entries(PALETTES).map(([k,v]) => [k, v.name])} onChange={v => update({palette:v})} />
        <TweakRow label="Density" value={tweaks.density} options={[['compact','Compact'],['default','Default'],['spacious','Spacious']]} onChange={v => update({density:v})} />
        <TweakRow label="Type" value={tweaks.font} options={Object.entries(FONTS).map(([k,v]) => [k, v.name])} onChange={v => update({font:v})} />
      </div>
    </div>
  );
}

function TweakRow({ label, value, options, onChange }) {
  return (
    <div className="tweak-row">
      <label>{label}</label>
      <div className="opts" style={{flexWrap: options.length > 3 ? 'wrap' : 'nowrap'}}>
        {options.map(([k, l]) => (
          <button key={k} className={`opt ${value === k ? 'active' : ''}`} onClick={() => onChange(k)} style={options.length > 3 ? {flex: '1 1 45%'} : {}}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TopBar
   ============================================================ */

function TopBar({ active }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="index.html" className="mark">
          Enko<sup>◊</sup>
        </a>
        <nav className="nav">
          <a href="index.html" className={active === 'overview' ? 'active' : ''}>Overview</a>
          <a href="wardrobe.html" className={active === 'wardrobe' ? 'active' : ''}>Wardrobe</a>
          <a href="#story" className={active === 'story' ? 'active' : ''}>Story</a>
          <a href="#community" className={active === 'community' ? 'active' : ''}>Community</a>
        </nav>
        <div className="topbar-cta">
          <span className="pill"><span className="dot"></span>SOL · LIVE</span>
          <button className="btn" style={{padding: '10px 16px', fontSize: 11}}>Acquire <span className="arrow">→</span></button>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { useTweaks, TweaksPanel, TopBar, PALETTES, FONTS });
