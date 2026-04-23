// Terminal Portfolio App — home page.
// Professional terminal aesthetic · light theme · sponsor-glow cards.

const GLYPHS = {
  R: ['█████ ','█   █ ','█████ ','█  █  ','█   █ '],
  U: ['█   █ ','█   █ ','█   █ ','█   █ ','█████ '],
  S: ['█████ ','█     ','█████ ','    █ ','█████ '],
  H: ['█   █ ','█   █ ','█████ ','█   █ ','█   █ '],
  A: ['█████ ','█   █ ','█████ ','█   █ ','█   █ '],
  V: ['█   █ ','█   █ ','█   █ ',' █ █  ','  █   '],
  D: ['████  ','█   █ ','█   █ ','█   █ ','████  '],
  ' ': ['      ','      ','      ','      ','      '],
};
function renderAscii(word) {
  const rows = ['','','','',''];
  for (const ch of word.toUpperCase()) {
    const g = GLYPHS[ch] || GLYPHS[' '];
    for (let i = 0; i < 5; i++) rows[i] += g[i];
  }
  return rows.join('\n');
}
const ASCII_NAME = renderAscii('RUSHAV DASH');

// Paragraph with inline **bold** → <mark> spans.
function Paragraph({ text, lastParagraph }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p style={lastParagraph ? {marginBottom:0} : undefined}>
      {parts.map((seg, i) =>
        seg.startsWith('**') && seg.endsWith('**')
          ? <mark key={i}>{seg.slice(2,-2)}</mark>
          : <React.Fragment key={i}>{seg}</React.Fragment>
      )}
    </p>
  );
}

// Map our 3-state status to the design's 2-state visual (done | wip).
const isDone = (p) => p.status === 'complete';
const statusPillText = (p) => isDone(p) ? 'shipped' : 'in progress';
const cardStatusClass = (p) => isDone(p) ? 'done' : 'wip';

function App() {
  const { PROJECTS, EXPERIENCE, SKILLS, ABOUT } = window;
  const done = PROJECTS.filter(isDone).length;

  return (
    <div className="window" role="main">
      {/* ── chrome ── */}
      <div className="chrome">
        <div className="dots"><span className="dot"/><span className="dot"/><span className="dot"/></div>
        <div className="title">rushav@dash : ~/portfolio — zsh — 120×48</div>
        <div className="right">
          <span style={{fontSize:18,letterSpacing:'.1em',color:'var(--fg-mute)'}}>ONLINE</span>
        </div>
      </div>

      {/* ── hero ── */}
      <section className="hero section">
        <div className="hero-grid">
          <div>
            <pre className="ascii" aria-hidden="true">{ASCII_NAME}</pre>

            <div className="about-block">
              <div className="label">&gt; about</div>
              {ABOUT.paragraphs.map((t, i) => (
                <Paragraph key={i} text={t} lastParagraph={i === ABOUT.paragraphs.length - 1}/>
              ))}
            </div>

            <div className="contact">
              <div className="k">edu</div>   <div>{ABOUT.edu}</div>
              <div className="k">email</div> <div><a href={`mailto:${ABOUT.email}`}>{ABOUT.email}</a></div>
              <div className="k">linkedin</div><div><a href={ABOUT.linkedin} target="_blank" rel="noreferrer">{ABOUT.linkedinLabel}</a></div>
              <div className="k">github</div><div><a href={ABOUT.github} target="_blank" rel="noreferrer">{ABOUT.githubLabel}</a></div>
            </div>

            <div className="cta-row">
              <a className="btn primary" href={ABOUT.resumeHref} download>$ ./resume.pdf <span className="key">↓</span></a>
              <a className="btn" href={`mailto:${ABOUT.email}`}>$ ./contact <span className="key">⏎</span></a>
              <span style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--fg-mute)',fontSize:19,marginLeft:4}}>
                <span className="cursor"/>
              </span>
            </div>
          </div>

          {/* right column: animated ASCII lidar maze */}
          <div>
            <window.AsciiLidarMaze/>
          </div>
        </div>
      </section>

      {/* ── projects ── */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">§ 02 · selected work</div>
            <div className="shead"><span className="prompt">$</span>ls projects/ --status --sponsor</div>
          </div>
          <div className="meta">count={PROJECTS.length} · shipped={done} · wip={PROJECTS.length-done}</div>
        </div>

        <div className="proj-head">
          <div className="legend">
            <span><span className="swatch" style={{background:'#e20074'}}/>T-MOBILE</span>
            <span><span className="swatch" style={{background:'#6d7bdc'}}/>OPEN ROBOTICS</span>
            <span><span className="swatch" style={{background:'#8a62d4'}}/>UW</span>
          </div>
        </div>

        <div className="grid">
          {PROJECTS.map((p,i) => (
            <a key={p.slug} className={`card ${cardStatusClass(p)}`} style={{['--glow']:p.glow}}
               href={`project.html?slug=${p.slug}`}>
              <div className="card-head">
                <span className="idx">[{String(i+1).padStart(2,'0')}]</span>
                <span className={`spill ${cardStatusClass(p)}`}>
                  <span className="pd"/>{statusPillText(p)}
                </span>
              </div>
              <h3>{p.name}</h3>
              <div className="when">{p.when.toLowerCase()}</div>
              <div style={{fontSize:17,letterSpacing:'.14em',color:'var(--fg-mute)',textTransform:'uppercase',marginBottom:10}}>{p.tag}</div>
              <p>{p.shortDesc}</p>
              <div className="card-foot">
                <span className="sponsor"><span className="sdot"/>{p.sponsor}</span>
                <span className="cd">cd ./{p.slug}<span className="arrow">→</span></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── experience / gantt ── */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">§ 03 · trajectory</div>
            <div className="shead"><span className="prompt">$</span>history --visual --since 2021</div>
          </div>
          <div className="meta">{EXPERIENCE.length} roles · concurrent</div>
        </div>

        <div className="exp-wrap">
          <div className="legend-exp">
            <span><span className="leg-sw work"/>WORK</span>
            <span><span className="leg-sw res"/>RESEARCH</span>
            <span><span className="leg-sw edu"/>EDUCATION</span>
          </div>
          <Gantt/>
        </div>
      </section>

      {/* ── skills ── */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">§ 04 · stack</div>
            <div className="shead"><span className="prompt">$</span>cat skills.txt</div>
          </div>
          <div className="meta">{SKILLS.reduce((n,s)=>n+s.items.length,0)} items across {SKILLS.length} groups</div>
        </div>
        <div className="skills">
          {SKILLS.map(s => (
            <div className="skill-row" key={s.group}>
              <div className="g">// {s.group}</div>
              <div className="items">
                {s.items.map(it => <span key={it} className="chip">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── foot ── */}
      <div className="foot">
        <span><span className="p">rushav@dash</span>:~/portfolio $ <span className="cursor" style={{verticalAlign:'-3px'}}/></span>
        <span>© 2026 rushav dash · rev 0.2</span>
      </div>
    </div>
  );
}

// ── Gantt ──
function Gantt() {
  const { EXPERIENCE } = window;
  const [expanded, setExpanded] = React.useState(() => new Set());
  const toggle = (i) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  const min = 2021.5, max = 2026.5;
  const years = [2022, 2023, 2024, 2025, 2026];
  const pct = v => ((v - min) / (max - min)) * 100;

  const fmt = d => {
    const y = Math.floor(d);
    const m = Math.round((d - y) * 12);
    const mm = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Math.min(11,Math.max(0,m))];
    return `${mm} ${y}`;
  };

  return (
    <div>
      <div className="ruler">
        {years.map(y => (
          <React.Fragment key={y}>
            <div className="tick" style={{left:`${pct(y)}%`}}/>
            <div className="year" style={{left:`${pct(y)}%`}}>{y}</div>
          </React.Fragment>
        ))}
      </div>

      <div style={{position:'relative'}}>
        {EXPERIENCE.map((e, i) => {
          const left = pct(e.start), width = Math.max(pct(e.end) - pct(e.start), 1.5);
          const cls = e.kind === 'work' ? 'work' : e.kind === 'research' ? 'res' : 'edu';
          const hasBullets = e.bullets && e.bullets.length > 0;
          const isOpen = expanded.has(i);
          const onClick = hasBullets ? () => toggle(i) : undefined;
          return (
            <div key={i} className={`gantt-row ${isOpen ? 'expanded' : ''}`}>
              <button
                type="button"
                className={`lbl-btn ${hasBullets ? 'interactive' : ''}`}
                onClick={onClick}
                aria-expanded={hasBullets ? isOpen : undefined}
                aria-controls={hasBullets ? `gantt-detail-${i}` : undefined}
              >
                <div className="lbl-main">
                  <b>{e.role}</b>
                  <div className="sub">{e.org} · {e.location} · {fmt(e.start)}{e.current?' — present':' – '+fmt(e.end)}</div>
                </div>
                {hasBullets && <span className="arrow" aria-hidden="true">{isOpen ? '▾' : '▸'}</span>}
              </button>
              <div className="bar-track">
                {years.map(y => (
                  <div key={y} className="tick" style={{left:`${pct(y)}%`}}/>
                ))}
                <div className={`bar ${cls} ${e.current?'current':''}`}
                     style={{left:`${left}%`, width:`${width}%`}}
                     title={`${e.role} · ${fmt(e.start)} → ${e.current?'present':fmt(e.end)}`}>
                  {e.current && <span style={{marginLeft:'auto',fontSize:16,letterSpacing:'.15em'}}>● NOW</span>}
                </div>
              </div>
              {hasBullets && isOpen && (
                <div className="gantt-details" id={`gantt-detail-${i}`}>
                  <ul>
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
