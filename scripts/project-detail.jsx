// Project Detail — reads ?slug=X from the URL and renders a project from
// window.PROJECTS. Sections with no content are hidden rather than shown
// as placeholders.

function getSlug() {
  const qs = new URLSearchParams(location.search).get('slug');
  if (qs) return qs;
  const hash = location.hash.replace(/^#/, '');
  return hash || null;
}

function Slot({ src, alt, ratio = '4/3', caption, onClick }) {
  const clickable = !!(src && onClick);
  return (
    <figure
      className={`slot${clickable ? ' clickable' : ''}`}
      style={{ '--ratio': ratio }}
      onClick={clickable ? () => onClick({ src, alt, caption }) : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick({ src, alt, caption }); }
      } : undefined}
    >
      <div className="slot-frame">
        {src
          ? <img src={src} alt={alt} />
          : (
            <div className="slot-empty" aria-label="Image placeholder">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth=".4" vectorEffect="non-scaling-stroke"/>
                <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth=".4" vectorEffect="non-scaling-stroke"/>
              </svg>
              <div className="slot-info">
                <div className="slot-tag">IMG</div>
                <div className="slot-ratio">{ratio}</div>
                <div className="slot-alt">{alt}</div>
              </div>
            </div>
          )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Lightbox({ item, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close">✕ CLOSE</button>
      <img
        className="lightbox-img"
        src={item.src}
        alt={item.alt}
        onClick={(e) => e.stopPropagation()}
      />
      {item.caption && <div className="lightbox-cap" onClick={(e) => e.stopPropagation()}>{item.caption}</div>}
    </div>
  );
}

// Vertical milestone flow — crisp SVG.
function MilestoneFlow({ items }) {
  const rowH = 92;
  const w = 560;
  const h = items.length * rowH + 20;
  const dotX = 38;

  return (
    <div className="flow">
      <div className="flow-head">
        <span className="kicker">ms.flow</span>
        <span className="meta">{items.length} milestones</span>
      </div>

      <svg className="flow-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMinYMin meet">
        <line x1={dotX} y1={14} x2={dotX} y2={h - 14}
              stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity=".35"/>

        {items.map((m, i) => {
          const cy = 24 + i * rowH;
          return (
            <g key={m.id} transform={`translate(0, ${cy})`}>
              <line x1={dotX} y1={0} x2={dotX + 42} y2={0}
                    stroke="currentColor" strokeWidth="1" opacity=".45"/>
              <circle cx={dotX} cy={0} r="7" fill="var(--bg)" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx={dotX} cy={0} r="2.5" fill="var(--prompt)"/>
              <text x={dotX} y={-14} textAnchor="middle"
                    fontSize="9" letterSpacing="1" fill="var(--fg-mute)">{m.id}</text>

              <rect x={dotX + 42} y={-28} width={w - dotX - 52} height={66}
                    fill="var(--bg-card)" stroke="currentColor" strokeWidth="1"/>
              <rect x={dotX + 42} y={-28} width="3" height="66" fill="var(--prompt)"/>

              <text x={dotX + 56} y={-11} fontSize="12" fontWeight="600"
                    fill="var(--fg)" fontFamily="inherit">{m.title}</text>
              <text x={w - 18} y={-11} textAnchor="end" fontSize="10"
                    fill="var(--fg-mute)" letterSpacing="1">{m.date.toUpperCase()}</text>

              <foreignObject x={dotX + 56} y={-4} width={w - dotX - 80} height={38}>
                <div xmlns="http://www.w3.org/1999/xhtml" className="flow-note">{m.note}</div>
              </foreignObject>
            </g>
          );
        })}

        <g transform={`translate(${dotX}, ${h - 10})`}>
          <polygon points="0,-6 5,4 -5,4" fill="var(--prompt)"/>
        </g>
      </svg>
    </div>
  );
}

function NotFound({ slug }) {
  return (
    <div className="window" role="main">
      <div className="chrome">
        <div className="dots"><span className="dot"/><span className="dot"/><span className="dot"/></div>
        <div className="title">rushav@dash : ~/portfolio/projects/?</div>
        <div className="right"><a href="index.html" className="back">← INDEX</a></div>
      </div>
      <div className="notfound">
        <div className="kicker">§ error · 404</div>
        <h1>project not found</h1>
        <p>No project with slug <code>{slug || '(none)'}</code>. Try the index.</p>
        <a className="btn" href="index.html">← all projects</a>
      </div>
    </div>
  );
}

function ProjectDetail() {
  const slug = getSlug();
  const p = slug ? window.getProject(slug) : null;
  const [lightboxItem, setLightboxItem] = React.useState(null);
  if (!p) return <NotFound slug={slug}/>;

  const { PROJECTS } = window;
  const idx = String(PROJECTS.findIndex(x => x.slug === slug) + 1).padStart(2, '0');
  const done = p.status === 'complete';
  const statusLabel = done ? '■ shipped' : '□ in progress';
  const statusClass = done ? 'done' : 'wip';

  const images = p.images || [];
  const heroImg = images[0] || null;
  const gallery = images.length > 1 ? images.slice(1) : [];

  const details = p.details || [];
  const outcomes = p.outcomes || [];
  const milestones = p.milestones || [];
  const hasRightColumn = milestones.length > 0;

  // Description paragraphs: use context + approach (the rich data we already have).
  const descParagraphs = [p.context, p.approach].filter(Boolean);

  // Links: map the project's links object into ordered anchors.
  const linkEntries = [];
  if (p.links?.github)  linkEntries.push({ label: 'github / ' + p.slug, href: p.links.github, ext: true });
  if (p.links?.devpost) linkEntries.push({ label: 'devpost', href: p.links.devpost, ext: true });
  if (p.links?.paper)   linkEntries.push({ label: 'paper (pdf)', href: p.links.paper, ext: true });
  if (p.links?.live)    linkEntries.push({ label: 'live', href: p.links.live, ext: true });
  linkEntries.push({ label: '← all projects', href: 'index.html', ext: false });

  return (
    <div className="window" role="main" style={{ '--glow': p.glow }}>
      {/* chrome */}
      <div className="chrome">
        <div className="dots"><span className="dot"/><span className="dot"/><span className="dot"/></div>
        <div className="title">rushav@dash : ~/portfolio/projects/{p.slug} — zsh — 140×52</div>
        <div className="right">
          <a href="index.html" className="back">← INDEX</a>
        </div>
      </div>

      {/* breadcrumb */}
      <div className="crumb">
        <span className="p">$</span>
        <span>cd</span>
        <span className="mute">~/portfolio/projects/</span>
        <span className="cur">{p.slug}</span>
        <span className="cursor"/>
      </div>

      {/* HERO */}
      <section className="section hero-d">
        <div className="hero-d-grid">
          <div className="hero-left">
            <div className="pid">
              <span className="pid-idx">PROJ.{idx}</span>
              <span className="pid-tag">{p.tag}</span>
              <span className={`pid-status ${statusClass}`}>{statusLabel}</span>
            </div>

            <h1 className="ptitle">{p.name}</h1>
            {p.shortDesc && <p className="oneliner">{p.shortDesc}</p>}

            <div className="kv">
              {p.period &&    (<><div className="k">period</div><div>{p.period}</div></>)}
              {!p.period &&    (<><div className="k">when</div><div>{p.when}</div></>)}
              {p.roleTitle && (<><div className="k">role</div><div>{p.roleTitle}</div></>)}
              {p.team &&      (<><div className="k">team</div><div>{p.team}</div></>)}
              <div className="k">sponsor</div><div>{p.sponsor}</div>
              <div className="k">category</div><div>{p.category}</div>
            </div>

            {descParagraphs.length > 0 && (
              <div className="desc">
                <div className="label">&gt; description</div>
                {descParagraphs.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            )}

            {p.techStack?.length > 0 && (
              <div className="skills-d">
                <div className="label">&gt; skills.utilized</div>
                <div className="chips">
                  {p.techStack.map(s => <span key={s} className="chip">{s}</span>)}
                </div>
              </div>
            )}

            <div className="cta-row">
              {linkEntries.map(l => (
                <a key={l.label} className="btn" href={l.href}
                   target={l.ext ? '_blank' : undefined}
                   rel={l.ext ? 'noreferrer' : undefined}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* flagship image */}
          <div className="hero-right">
            <div className="img-head">
              <span className="kicker">fig.00 / flagship</span>
              <span className="meta">{heroImg ? '4/3' : '—'}</span>
            </div>
            {heroImg
              ? <Slot src={heroImg.src} alt={heroImg.alt} ratio="4/3" caption={null}/>
              : <Slot src="" alt={`${p.name} — flagship image`} ratio="4/3" caption={null}/>}
            {heroImg?.caption && <div className="img-cap">{heroImg.caption}</div>}
          </div>
        </div>
      </section>

      {/* BODY */}
      {(details.length > 0 || outcomes.length > 0 || p.technicalDetails?.length > 0 || hasRightColumn) && (
        <section className="section body-d">
          <div className={`body-grid ${hasRightColumn ? '' : 'single'}`}>
            <div className="body-left">
              {p.technicalDetails?.length > 0 && (
                <div className="block">
                  <div className="section-head flush">
                    <div><span className="kicker">§ 01</span><div className="shead"><span className="prompt">&gt;</span>technical details</div></div>
                    <div className="meta">what was built</div>
                  </div>
                  <div className="block-body">
                    <ul style={{margin:0,paddingLeft:18,color:'var(--fg-dim)',fontSize:'20.5px',lineHeight:1.75}}>
                      {p.technicalDetails.map((t, i) => <li key={i} style={{marginBottom:6}}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {details.length > 0 && (
                <div className="block">
                  <div className="section-head flush">
                    <div><span className="kicker">§ 02</span><div className="shead"><span className="prompt">&gt;</span>details</div></div>
                    <div className="meta">spec sheet</div>
                  </div>
                  <div className="block-body">
                    <dl className="details-list">
                      {details.map(d => (
                        <React.Fragment key={d.k}>
                          <dt>{d.k}</dt><dd>{d.v}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {outcomes.length > 0 && (
                <div className="block">
                  <div className="section-head flush">
                    <div><span className="kicker">§ 03</span><div className="shead"><span className="prompt">&gt;</span>outcomes</div></div>
                    <div className="meta">measured</div>
                  </div>
                  <div className="block-body">
                    <div className="outcomes">
                      {outcomes.map(o => (
                        <div key={o.label} className="outcome">
                          <div className="metric">{o.metric}</div>
                          <div className="olabel">{o.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {p.role && (
                <div className="block">
                  <div className="section-head flush">
                    <div><span className="kicker">§ 04</span><div className="shead"><span className="prompt">&gt;</span>my role</div></div>
                    <div className="meta">contribution</div>
                  </div>
                  <div className="block-body"><p>{p.role}</p></div>
                </div>
              )}
            </div>

            {hasRightColumn && (
              <div className="body-right">
                <div className="section-head flush">
                  <div><span className="kicker">§ 05</span><div className="shead"><span className="prompt">&gt;</span>milestones</div></div>
                  <div className="meta">timeline</div>
                </div>
                <MilestoneFlow items={milestones}/>
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="section gallery-d">
          <div className="section-head">
            <div><span className="kicker">§ 06</span><div className="shead"><span className="prompt">&gt;</span>figures &amp; media</div></div>
            <div className="meta">{gallery.length} image{gallery.length === 1 ? '' : 's'}</div>
          </div>
          <div className="gallery-grid">
            {gallery.map((g, i) => (
              <Slot key={i} src={g.src} alt={g.alt} ratio="4/3" caption={g.caption}
                    onClick={setLightboxItem}/>
            ))}
          </div>
        </section>
      )}

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)}/>
      )}

      {/* footer */}
      <div className="foot">
        <div><span className="p">$</span> <a href="index.html" style={{color:'var(--fg)'}}>cd ..</a><span className="cursor"/></div>
        <div>portfolio / projects / {p.slug}</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProjectDetail/>);
