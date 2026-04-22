// Landing — Enko overview
const { useState: useStateL } = React;

function Landing() {
  const { tweaks, update, editMode } = useTweaks();

  return (
    <>
      <TopBar active="overview" />
      <main className="shell">

        {/* HERO */}
        <section className="hero-grid">
          <div className="hero-ambient"></div>
          <div className="hero-left">
            <div>
              <div className="hero-labels">
                <span className="tag">Chapter I</span>
                <span className="sep">—</span>
                <span>The Character</span>
                <span className="sep">·</span>
                <span>Est. MMXXVI</span>
              </div>
              <h1 className="hero-title">
                A giraffe<br/>
                of <span className="it">certain</span><br/>
                standing.
                <span className="sm">A quiet asset on Solana. Unhurried. Long-necked. Patient by design.</span>
              </h1>
            </div>
            <div className="hero-cta-row">
              <button className="btn">Acquire $ENKO <span className="arrow">→</span></button>
              <a href="wardrobe.html" className="btn ghost">Visit wardrobe</a>
            </div>
          </div>

          <div className="hero-right">
            <div className="emblem-stack">
              <div className="emblem-float">
                <GiraffeEmblem/>
              </div>
              <div className="emblem-caption">
                <span>✠ Hand-composed</span>
                <span>Nº 001 · Plate 01/01</span>
              </div>
            </div>
            <div className="hero-meta">
              <div className="hero-meta-row">
                <div>
                  <div className="k">Origin</div>
                  <div className="v">Solana · 2026</div>
                </div>
                <div>
                  <div className="k">Temperament</div>
                  <div className="v">Reserved</div>
                </div>
              </div>
              <div className="hero-meta-row">
                <div>
                  <div className="k">Ticker</div>
                  <div className="v">$ENKO</div>
                </div>
                <div>
                  <div className="k">Supply</div>
                  <div className="v">1,000,000,000</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* brand strip */}
        <div className="brand-strip">
          <span>Rarity</span><span className="dot"></span>
          <span>Patience</span><span className="dot"></span>
          <span>Quiet strength</span><span className="dot"></span>
          <span>Long horizon</span><span className="dot"></span>
          <span>Reserve</span><span className="dot"></span>
          <span>Status</span>
        </div>

        {/* STATS */}
        <div className="stats-strip" style={{marginTop: 24}}>
          <div className="stat-cell">
            <div className="l"><span>Price</span><Sparkline data={[4,5,4,6,5,7,8,7,9,10,9,11]} className="spark-pos"/></div>
            <div className="v"><Counter value={0.008346} prefix="$" decimals={6}/></div>
            <div className="sub"><span>SOL 0.0000412</span><span className="pos" style={{color:'var(--pos)'}}>▲</span></div>
          </div>
          <div className="stat-cell">
            <div className="l"><span>24h Change</span><Sparkline data={[2,3,4,3,5,6,5,7,8,9,8,10]} className="spark-pos"/></div>
            <div className="v" style={{color:'var(--pos)'}}>+<Counter value={8.23} decimals={2}/>%</div>
            <div className="sub"><span>+$0.000633</span><span style={{color:'var(--pos)'}}>▲</span></div>
          </div>
          <div className="stat-cell">
            <div className="l"><span>Volume · 24h</span><Sparkline data={[3,4,3,5,4,6,5,7,6,8,7,9]} className="spark-neutral"/></div>
            <div className="v">$<Counter value={8.37} decimals={2}/>M</div>
            <div className="sub"><span>+12.4%</span><span style={{color:'var(--ink-mute)'}}>○</span></div>
          </div>
          <div className="stat-cell">
            <div className="l"><span>Market cap</span><Sparkline data={[5,6,5,7,6,8,7,9,8,10,9,11]} className="spark-pos"/></div>
            <div className="v">$<Counter value={2.62} decimals={2}/>M</div>
            <div className="sub"><span>FDV $8.35M</span><span style={{color:'var(--pos)'}}>▲</span></div>
          </div>
          <div className="stat-cell">
            <div className="l"><span>Holders</span><Sparkline data={[1,2,3,3,4,5,6,7,8,9,10,11]} className="spark-pos"/></div>
            <div className="v"><Counter value={5300} decimals={0}/></div>
            <div className="sub"><span>+142 · 24h</span><span style={{color:'var(--pos)'}}>▲</span></div>
          </div>
        </div>

        {/* CHART */}
        <div style={{marginTop: 32}}>
          <PriceChart />
        </div>

        <div className="section-divider"><span>✠ · I</span></div>

        {/* SECTION I — THE CHARACTER */}
        <div className="section-head">
          <div className="num-tag">§ I — The Character</div>
          <h2>Composure, in a <span className="it">long</span> neck.</h2>
          <div className="side">Height 4.8 m · Pattern reticulated · Disposition unhurried</div>
        </div>
        <div className="feature-grid">
          <div className="feature-copy">
            <p>Enko was not designed to react. He was designed to observe — from a height other market participants cannot reach, and on a timescale they rarely consider.</p>
            <p>Where others chase the ground, Enko eats from the canopy. Where others dart, Enko arrives.</p>
            <div className="feature-caption">
              <div className="cell">
                <div className="k">Height</div>
                <div className="v">4.8 metres</div>
              </div>
              <div className="cell">
                <div className="k">Pattern</div>
                <div className="v">26 plates</div>
              </div>
              <div className="cell">
                <div className="k">Disposition</div>
                <div className="v">Unhurried</div>
              </div>
              <div className="cell">
                <div className="k">Habitat</div>
                <div className="v">SOL savanna</div>
              </div>
            </div>
          </div>
          <div className="feature-image">
            <div className="placeholder"><span>Enko · portrait</span></div>
          </div>
        </div>

        <div className="section-divider"><span>✠ · II</span></div>

        {/* SECTION II — THE LEDGER */}
        <div className="section-head" id="ledger">
          <div className="num-tag">§ II — The Ledger</div>
          <h2>Recent <span className="it">movement.</span></h2>
          <div className="side">Live · refreshed every block</div>
        </div>
        <div style={{paddingBottom: 32}}>
          <table className="txn-table">
            <thead>
              <tr>
                <th style={{width: '18%'}}>Time</th>
                <th>Type</th>
                <th>Amount $ENKO</th>
                <th>Price</th>
                <th>Value</th>
                <th>Wallet</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['18:42', 'buy',  '482,130',  '$0.008346', '$4,024.26', '7xQk…p3Lm'],
                ['18:39', 'buy',  '128,000',  '$0.008318', '$1,064.70', 'H9vE…qW41'],
                ['18:36', 'sell', '1,204,502', '$0.008290', '$9,985.33', 'Ab2X…tRn8'],
                ['18:32', 'buy',  '68,900',   '$0.008275', '$570.14',   'Np7k…vBx2'],
                ['18:29', 'buy',  '2,100,000','$0.008251', '$17,326.96','cE4m…wSg7'],
                ['18:22', 'sell', '340,000',  '$0.008244', '$2,802.96', 'Lf8p…dKh3'],
                ['18:18', 'buy',  '95,400',   '$0.008211', '$783.33',   'QrT5…xMz9'],
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{color: 'var(--ink-mute)'}}>{r[0]}</td>
                  <td className={r[1] === 'buy' ? 'pos' : 'neg'}>{r[1].toUpperCase()}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                  <td style={{color: 'var(--ink-soft)'}}>{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-divider"><span>✠ · III</span></div>

        {/* SECTION III — THE WARDROBE */}
        <div className="section-head" id="wardrobe-cta">
          <div className="num-tag">§ III — The Wardrobe</div>
          <h2>Dress him, <span className="it">carefully.</span></h2>
          <div className="side">Backgrounds · Accessories · Bowties</div>
        </div>
        <div className="feature-grid">
          <div className="feature-image" style={{gridColumn: '1 / span 7', aspectRatio: '16/10'}}>
            <div className="placeholder"><span>Wardrobe · preview</span></div>
          </div>
          <div className="feature-copy" style={{gridColumn: '9 / span 4', paddingTop: 0, justifyContent: 'center'}}>
            <p>A studio of considered objects. Each piece is a decision.</p>
            <div style={{marginTop: 20}}>
              <a href="wardrobe.html" className="btn">Enter the wardrobe <span className="arrow">→</span></a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-head">
                <span className="it">Enko</span>,<br/>
                at leisure.
              </div>
            </div>
            <div className="footer-col">
              <div className="h">Token</div>
              <a href="#">Chart</a>
              <a href="#">Holders</a>
              <a href="#">Contract</a>
              <a href="#">Audit</a>
            </div>
            <div className="footer-col">
              <div className="h">Studio</div>
              <a href="wardrobe.html">Wardrobe</a>
              <a href="#">Portraits</a>
              <a href="#">Downloads</a>
            </div>
            <div className="footer-col">
              <div className="h">Elsewhere</div>
              <a href="#">Twitter / X</a>
              <a href="#">Telegram</a>
              <a href="#">DexScreener</a>
              <a href="#">Jupiter</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Enko · MMXXVI</span>
            <div>
              <span>Not financial advice</span>
              <span>SOL · Mainnet</span>
              <span>v 1.0</span>
            </div>
          </div>
        </footer>
      </main>

      <TweaksPanel tweaks={tweaks} update={update} show={editMode} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Landing />);
