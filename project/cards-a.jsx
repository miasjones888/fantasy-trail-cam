// cards-a.jsx — Specimens 1–6
// Each card is a self-contained visual argument. They share primitives but
// have different structural logic — the point is that format does work.

const { Fawn, Unknown, ForestBG, TrailCamHUD, OSWindow, TapeLabel, Sticker,
        MetaRow, MossEdge, Lichen, Noise, Scanlines, IRFrame, useTweaks } = window;

// ─── Common "annotation" for the card's argument ────────────
function CardAnnotation({ number, title, tension, mvp, vision, risk, format }) {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      width: 280, flexShrink: 0, alignSelf: 'stretch',
      fontFamily: 'var(--mono)', fontSize: 11, color: c.ink,
      padding: '0 14px 0 0', borderRight: `1px dashed ${c.rule}`,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display:'flex', alignItems:'baseline', gap: 8 }}>
        <span style={{ fontSize: 32, fontWeight: 300, color: c.ir, letterSpacing: -1 }}>
          {String(number).padStart(2, '0')}
        </span>
        <span style={{ fontSize: 10, color: c.dim, letterSpacing: 1.5, textTransform:'uppercase' }}>
          SPECIMEN
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.18,
        color: c.ink, letterSpacing: -0.3, textWrap: 'balance',
        paddingBottom: 4,
      }}>{title}</div>
      <div style={{ fontSize: 9, color: c.dim, letterSpacing: 1, textTransform:'uppercase' }}>
        FORMAT · <span style={{ color: c.forest }}>{format}</span>
      </div>
      <div style={{
        background: c.paper, padding: '8px 10px',
        border: `1px solid ${c.rule}`,
        fontSize: 10, lineHeight: 1.45,
      }}>
        <div style={{ color: c.plum, fontWeight: 700, marginBottom: 3, letterSpacing: 1, fontSize: 9 }}>
          TENSION HELD
        </div>
        <div>{tension}</div>
      </div>
      <div>
        <div style={{ color: c.forest, fontWeight: 700, marginBottom: 3, letterSpacing: 1, fontSize: 9 }}>
          MVP ─────────────
        </div>
        <div style={{ fontSize: 10.5, lineHeight: 1.5 }}>{mvp}</div>
      </div>
      <div>
        <div style={{ color: c.teal, fontWeight: 700, marginBottom: 3, letterSpacing: 1, fontSize: 9 }}>
          FULL VISION ─────
        </div>
        <div style={{ fontSize: 10.5, lineHeight: 1.5 }}>{vision}</div>
      </div>
      <div style={{ marginTop: 'auto', fontSize: 9.5, lineHeight: 1.4, color: c.dim, fontStyle:'italic' }}>
        <span style={{ color: c.ir, fontStyle:'normal', fontWeight:700, letterSpacing:1 }}>⚠ RISK · </span>{risk}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 01 — FIELD GUIDE (SPECIMEN PLATE)
// The by-the-book container. Peterson's guide in a parallel world.
// ═══════════════════════════════════════════════════════════
function Card01_FieldGuide() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'flex', gap: 18, padding: 20,
      background: c.ground, width: 920, height: 560,
      position: 'relative', fontFamily: 'var(--mono)',
    }}>
      <Noise opacity={0.1}/>
      <CardAnnotation
        number={1} title="Field Guide to the Unresolved"
        format="PRINT · 144pp hardback + web mirror"
        tension="Clinical register insists on naming. The plate insists the thing is animate. The guide cannot decide whether it is documenting species or hauntings — and prints both columns anyway."
        mvp="One 4-page spread. Plate + taxonomy + range map + observer's notes. Real printer. Matte uncoated."
        vision="Full field guide. 30 beasts. Phylogenetic chart that doesn't close. Index keyed to moon phase. Sold in gift shops near the trailhead."
        risk="Too finished. The guide's authority can overpower the uncertainty it's trying to preserve — risks becoming a collectible, not an argument."
      />
      {/* the plate itself */}
      <div style={{
        flex: 1, background: c.paper,
        border: `1px solid ${c.rule}`,
        padding: 18, position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 200px', gap: 14,
      }}>
        {/* header */}
        <div style={{ gridColumn: '1 / -1', display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom: `2px solid ${c.ink}`, paddingBottom: 6 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: c.dim }}>PLATE XVII</div>
            <div style={{ fontFamily:'var(--serif)', fontSize: 26, fontStyle:'italic', color: c.ink, marginTop: 2 }}>
              Cervus aliger vespertinus
            </div>
            <div style={{ fontSize: 11, color: c.dim, marginTop: 2 }}>
              Winged Evening Fawn · Eastern Deciduous Range · <span style={{ color: c.ir }}>status: unresolved</span>
            </div>
          </div>
          <div style={{ fontSize: 9, color: c.dim, textAlign:'right' }}>
            <div>OBS. 03:47 EDT</div>
            <div>24 · OCT · 2024</div>
          </div>
        </div>
        {/* illustration */}
        <div style={{
          background: c.ground, border: `1px solid ${c.rule}`,
          position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          minHeight: 280,
        }}>
          <Fawn w={320} h={220} wing={0.85} />
          {/* scale bar */}
          <div style={{ position:'absolute', bottom: 10, left: 10, fontSize: 8, color: c.dim, fontFamily:'var(--mono)' }}>
            <div style={{ width: 80, height: 1, background: c.ink, marginBottom: 2 }}/>
            0 ———— 1m (est.)
          </div>
          {/* illustrator credit */}
          <div style={{ position:'absolute', bottom: 10, right: 10, fontSize: 8, color: c.dim, fontStyle:'italic' }}>
            after TC-03 · 03:47:12
          </div>
          <Lichen corner="tr" size={80} seed={7}/>
        </div>
        {/* taxonomy sidebar */}
        <div style={{ fontSize: 10, color: c.ink }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: c.dim, marginBottom: 6 }}>TAXONOMY</div>
          <MetaRow label="Kingdom" value="Animalia"/>
          <MetaRow label="Order" value="Artiodactyla"/>
          <MetaRow label="Family" value={<span>Cervidae <span style={{color:c.ir}}>?</span></span>}/>
          <MetaRow label="Wing" value={<span style={{color:c.forest}}>dorsal, non-avian</span>}/>
          <MetaRow label="Range" value="10km radius"/>
          <MetaRow label="Crepuscular" value="yes"/>
          <MetaRow label="Confirmed" value={<span style={{color:c.ir}}>no</span>}/>
          <div style={{ marginTop: 10, fontSize: 9, letterSpacing: 2, color: c.dim, marginBottom: 4 }}>OBSERVER'S NOTE</div>
          <div style={{ fontSize: 10, lineHeight: 1.4, fontStyle:'italic', color: c.dim }}>
            "Subject present in frames 03:47:12 and 03:47:15. Absent by 03:47:18. Trail showed four hoofprints, no disturbance of canopy."
          </div>
        </div>
        {/* body text */}
        <div style={{ gridColumn: '1 / -1', fontSize: 10, lineHeight: 1.55, color: c.ink, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: c.forest, marginBottom: 4 }}>DESCRIPTION</div>
            White-tailed deer in all proportions save the dorsal outgrowth, visible in approximately one in forty captures. Outgrowth resembles cervid feather; not keratinous; appears to retract.
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: c.plum, marginBottom: 4 }}>FOLK NAMES</div>
            Wing-fawn · Evening kite · <span style={{fontStyle:'italic'}}>vesperdeer</span> · <span style={{color:c.dim}}>"the one that comes back"</span>
          </div>
        </div>
        <MossEdge side="bottom" thickness={16} seed={5}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 02 — CONFIG WIZARD FOR A CHIMERA
// Plant Wizard / Tamagotchi setup screen applied to a thing the camera saw.
// ═══════════════════════════════════════════════════════════
function Card02_ConfigWizard() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'flex', gap: 18, padding: 20,
      background: c.ground, width: 920, height: 560,
      position: 'relative', fontFamily: 'var(--mono)',
    }}>
      <Noise opacity={0.1}/>
      <CardAnnotation
        number={2} title="Configure Your Chimera"
        format="WEB TOY · shareable permalink"
        tension="The wizard's register (radio buttons, defaults, 'Next >') is violently domestic. The creature is not. The interface insists it can be reduced to parameters — and the longer you use it, the more the form admits it cannot."
        mvp="Single Win98-chrome wizard. 4 steps: body / outgrowth / time-of-sighting / sound. Generates a shareable card."
        vision="Every user's wizard-output is a real 'specimen' in a shared database. Aggregate view: what the collective unconscious thinks lives in the trail cam."
        risk="Too cute. The Plant Wizard reference is strong — but 'build-a-bear for cryptids' is a known failure mode. The config steps must refuse to close cleanly."
      />
      {/* the wizard */}
      <div style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center', background: `repeating-linear-gradient(45deg, ${c.forest}22 0 2px, transparent 2px 20px), ${c.teal}` }}>
        <OSWindow chromeStyle="win98" title="Chimera Wizard — Step 2 of ?" w={420} h={360}>
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Outgrowth</div>
            <div style={{ color:'#333', marginBottom: 10 }}>
              What was coming out of the body? The wizard drew a 3D object to represent the shape. <span style={{ color: '#a00', fontStyle:'italic' }}>The shape may differ between frames.</span>
            </div>
            {/* shape options */}
            <div style={{ display:'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 12 }}>
              {['none', 'feather', 'leaf', 'bone', '???'].map((name, i) => (
                <div key={i} style={{
                  border: i === 1 ? '2px inset #000080' : '1px solid #888',
                  background: i === 1 ? '#c8d0e8' : '#fff',
                  padding: 4, textAlign:'center', fontSize: 10,
                  display: 'flex', flexDirection:'column', alignItems:'center', gap: 2,
                }}>
                  <svg width="36" height="28" viewBox="0 0 36 28">
                    {name === 'none' && <circle cx="18" cy="14" r="6" fill="#888"/>}
                    {name === 'feather' && <g>
                      <path d="M4 20 Q12 10 18 12 Q24 14 30 8" fill="none" stroke={c.forest} strokeWidth="1.5"/>
                      {[0,1,2,3].map(j => <line key={j} x1={8+j*5} y1={18-j*2} x2={12+j*5} y2={14-j*2} stroke={c.forest} strokeWidth="0.5"/>)}
                    </g>}
                    {name === 'leaf' && <path d="M18 4 Q26 14 18 24 Q10 14 18 4 Z M18 6 L18 22" fill={c.lichen} stroke={c.forest}/>}
                    {name === 'bone' && <path d="M8 10 Q4 10 4 14 Q4 18 8 18 L28 18 Q32 18 32 14 Q32 10 28 10" fill="#eee" stroke="#333"/>}
                    {name === '???' && <text x="18" y="20" textAnchor="middle" fontSize="14" fontFamily="var(--mono)" fill="#a00">?</text>}
                  </svg>
                  <span>{name}</span>
                </div>
              ))}
            </div>
            {/* sliders */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, marginBottom: 2 }}>How often visible? (frames per hundred)</div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 10 }}>
                <div style={{ flex:1, height: 14, background: '#fff', border:'1px solid #888', position:'relative' }}>
                  <div style={{ position:'absolute', left: '18%', top: -2, width: 10, height: 18, background:'#c3c3c3', border:'1px solid', borderColor:'#fff #555 #555 #fff' }}/>
                </div>
                <span style={{ width: 28, textAlign:'right' }}>2.4</span>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, marginBottom: 2 }}>Plausibility <span style={{ color:'#a00' }}>(this field accepts negative values)</span></div>
              <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 10 }}>
                <div style={{ flex:1, height: 14, background: '#fff', border:'1px solid #888', position:'relative' }}>
                  <div style={{ position:'absolute', left: '38%', top: -2, width: 10, height: 18, background:'#c3c3c3', border:'1px solid', borderColor:'#fff #555 #555 #fff' }}/>
                  <div style={{ position:'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#a00' }}/>
                </div>
                <span style={{ width: 28, textAlign:'right' }}>−0.3</span>
              </div>
            </div>
            <div style={{ fontSize: 9, color:'#555', fontStyle:'italic', marginBottom: 10 }}>
              Tip: if the outgrowth is different in every frame, choose "???". The wizard will
              add a fifth tab: <u>Belief</u>.
            </div>
            {/* buttons */}
            <div style={{ display:'flex', justifyContent:'flex-end', gap: 6, marginTop: 14 }}>
              {['Back', 'Next >', 'Cancel'].map(l => (
                <div key={l} style={{
                  padding: '3px 14px', background: '#c3c3c3',
                  border:'1px solid', borderColor:'#fff #555 #555 #fff',
                  fontSize: 11, cursor:'pointer',
                }}>{l}</div>
              ))}
            </div>
          </div>
        </OSWindow>
        <div style={{ position:'absolute', bottom: 30, right: 30 }}>
          <TapeLabel rotate={4}>specimens/chimera_wizard_v0.3.exe</TapeLabel>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 03 — MOTION-TRACKER LOSES THE THING
// Phosphor-green bounding boxes try to hold a shape that won't stay one thing.
// ═══════════════════════════════════════════════════════════
function Card03_MotionTracker() {
  const t = useTweaks();
  const c = t.palette;
  const [wing, setWing] = useState(0.2);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = () => {
      const dt = (performance.now() - start) / 1000;
      setWing(0.4 + Math.sin(dt * 0.8) * 0.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{
      display:'flex', gap: 18, padding: 20,
      background: c.ground, width: 920, height: 560,
      position: 'relative', fontFamily: 'var(--mono)',
    }}>
      <Noise opacity={0.1}/>
      <CardAnnotation
        number={3} title="The Tracker Disagrees With Itself"
        format="WEB · silent video loop, 90 seconds"
        tension="The tracker's green rectangles are the camera's certainty. The rectangles proliferate, drift, and fail — because the thing inside them keeps becoming a different class of thing. The UI stays confident; the confidence is the joke."
        mvp="90-second video. Phosphor rectangles track a fawn. Wings sprout. Rectangles split into two, labeled 'DEER' and 'BIRD'. Neither is right."
        vision="Real-time. User uploads any trail cam clip and our (broken) classifier labels it with rolling, contradicting confidence scores. Log exported as CSV."
        risk="Technical gag. Can read as 'AI is dumb, lol'. The specimen must preserve awe — the rectangles should feel like they're failing *respectfully*."
      />
      <div style={{ flex: 1, position:'relative', background: '#000', overflow:'hidden' }}>
        <ForestBG w={556} h={520} density={1.2}/>
        <div style={{ position:'absolute', inset: 0 }}>
          <div style={{ position:'absolute', left: 180, top: 200 }}>
            <Fawn w={260} h={180} wing={wing} tint={t.irMode ? c.ground : undefined}/>
          </div>
        </div>
        {/* tracker boxes */}
        <svg width="556" height="520" style={{ position:'absolute', inset: 0 }}>
          {/* primary box */}
          <g stroke={c.phosphor} strokeWidth="1.5" fill="none" opacity="0.95">
            <rect x="180" y="210" width="260" height="170"
              strokeDasharray="none"/>
            {/* corner ticks */}
            {[[180,210],[440,210],[180,380],[440,380]].map(([x,y], i) => (
              <g key={i}>
                <line x1={x-6} y1={y} x2={x+6} y2={y}/>
                <line x1={x} y1={y-6} x2={x} y2={y+6}/>
              </g>
            ))}
          </g>
          {/* label */}
          <g>
            <rect x="180" y="190" width="120" height="16" fill={c.phosphor}/>
            <text x="184" y="201" fontFamily="var(--mono)" fontSize="10" fill="#000" fontWeight="700">
              DEER · 0.47
            </text>
          </g>
          {/* secondary (wing) box, appears when wing > 0.5 */}
          {wing > 0.5 && (
            <g stroke={c.phosphor} strokeWidth="1" strokeDasharray="3 3" opacity="0.85">
              <rect x="195" y="240" width="110" height="60" fill="none"/>
              <rect x="195" y="302" width="120" height="16" fill={c.phosphor}/>
              <text x="199" y="313" fontFamily="var(--mono)" fontSize="10" fill="#000" fontWeight="700">
                BIRD · 0.31 ?
              </text>
            </g>
          )}
          {/* rejected guesses, faded */}
          <g opacity="0.4" stroke={c.phosphor} strokeDasharray="1 4">
            <rect x="220" y="260" width="80" height="50" fill="none"/>
            <text x="220" y="256" fontFamily="var(--mono)" fontSize="9" fill={c.phosphor}>ANGEL · 0.04 rejected</text>
          </g>
          <g opacity="0.4" stroke={c.phosphor} strokeDasharray="1 4">
            <rect x="160" y="290" width="140" height="90" fill="none"/>
            <text x="160" y="286" fontFamily="var(--mono)" fontSize="9" fill={c.phosphor}>DOG + HAT · 0.02 rejected</text>
          </g>
        </svg>
        {/* log overlay */}
        <div style={{
          position:'absolute', top: 14, right: 14, width: 180,
          background: 'rgba(0,0,0,0.7)', color: c.phosphor,
          fontFamily: 'var(--mono)', fontSize: 9, padding: 8, lineHeight: 1.5,
          border: `1px solid ${c.phosphor}55`,
        }}>
          <div style={{ opacity: 0.6, marginBottom: 4 }}>&gt; classifier.log</div>
          <div>03:47:11 deer ▓▓▓▓▓░░░░░ 0.51</div>
          <div>03:47:12 deer ▓▓▓▓░░░░░░ 0.47</div>
          <div>03:47:13 deer ▓▓▓░░░░░░░ 0.38</div>
          <div style={{ color: c.ir }}>03:47:14 <span style={{textDecoration:'line-through'}}>deer</span></div>
          <div>03:47:14 bird? ▓▓░░░░░░░░ 0.31</div>
          <div>03:47:15 <span style={{ color: c.ir }}>NO MATCH</span></div>
          <div>03:47:16 deer ▓▓▓░░░░░░░ 0.42</div>
        </div>
        <TrailCamHUD w={556} h={520} timestamp="03:47:14"/>
        <Scanlines opacity={0.18}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 04 — FOUR-MONITOR INSTALLATION
// Four small CRTs, same clearing, different timestamps, different beasts.
// ═══════════════════════════════════════════════════════════
function Card04_FourMonitors() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'flex', gap: 18, padding: 20,
      background: c.ground, width: 920, height: 560,
      position: 'relative', fontFamily: 'var(--mono)',
    }}>
      <Noise opacity={0.1}/>
      <CardAnnotation
        number={4} title="Four Stations, One Clearing"
        format="INSTALLATION · 4× 7-inch LCDs, wall-mounted, SD cards exposed"
        tension="Four cameras, same GPS, four different realities. The viewer's eye moves between them looking for reconciliation and finds only rhythm. Documentary multiplied becomes mythology."
        mvp="Single-wall HTML mock: four video frames, same clearing, different beasts / timestamps, looping out of phase."
        vision="Real gallery install. Four battery-powered LCDs on bare wall. Exposed cabling. SD cards you can eject and read. A bench. No wall label — only a xeroxed FAQ."
        risk="Installations don't travel. The web mock must hold up as its own piece, not a sketch of the real thing."
      />
      <div style={{ flex:1, position:'relative', background: '#2a2d2a',
        background: `repeating-linear-gradient(0deg, #2a2d2a 0 2px, #26292a 2px 4px)`,
        padding: 24, display:'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 18, alignItems:'center', justifyItems:'center' }}>
        {[
          { ts: '02:12:40', beast: 'fawn',   wing: 0, label: 'CAM-01 · N-slope' },
          { ts: '03:47:12', beast: 'wfawn',  wing: 0.9, label: 'CAM-02 · N-slope' },
          { ts: '04:19:03', beast: 'unk',    wing: 0, label: 'CAM-03 · N-slope' },
          { ts: '05:02:58', beast: 'fawn',   wing: 0, label: 'CAM-04 · N-slope' },
        ].map((m, i) => (
          <div key={i} style={{ position:'relative', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }}>
            {/* monitor bezel */}
            <div style={{
              padding: 8, background: '#3a3d3a',
              border: '1px solid #1a1c1a',
              borderRadius: 2,
              width: 220,
            }}>
              <div style={{ position:'relative', width: 204, height: 130, overflow:'hidden', background:'#000' }}>
                <ForestBG w={204} h={130} density={0.7}/>
                <div style={{ position:'absolute', left: 50, top: 40 }}>
                  {m.beast === 'fawn' && <Fawn w={110} h={80} wing={m.wing}/>}
                  {m.beast === 'wfawn' && <Fawn w={110} h={80} wing={m.wing}/>}
                  {m.beast === 'unk' && <Unknown w={110} h={80}/>}
                </div>
                <TrailCamHUD w={204} h={130} timestamp={m.ts} cam={m.label.split(' · ')[0]}/>
                <Scanlines opacity={0.22}/>
              </div>
              {/* cable */}
              <div style={{ display:'flex', alignItems:'center', gap: 4, marginTop: 4, fontSize: 8, color: '#888' }}>
                <div style={{ width: 10, height: 6, background: '#555', border:'1px solid #222' }}/>
                <span>{m.label}</span>
              </div>
            </div>
          </div>
        ))}
        {/* cables dangling */}
        <svg width="100%" height="100%" style={{ position:'absolute', inset: 0, pointerEvents:'none' }}>
          <path d="M 140 260 Q 300 340 456 260" stroke="#1a1c1a" strokeWidth="2" fill="none"/>
          <path d="M 140 260 Q 300 380 300 420" stroke="#1a1c1a" strokeWidth="2" fill="none"/>
        </svg>
        <div style={{ position:'absolute', bottom: 14, left: 20, fontSize: 9, color:'#aaa', letterSpacing: 1 }}>
          GALLERY 3 · WEST WALL · NO LABEL
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 05 — RESEARCHER'S WALL (MOODBOARD)
// Taped cutouts, red string, index cards in someone else's handwriting.
// The person keeping this board has lost certainty.
// ═══════════════════════════════════════════════════════════
function Card05_Wall() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'flex', gap: 18, padding: 20,
      background: c.ground, width: 920, height: 560,
      position: 'relative', fontFamily: 'var(--mono)',
    }}>
      <Noise opacity={0.1}/>
      <CardAnnotation
        number={5} title="Someone Is Keeping A Wall"
        format="WEB · scrollable wall, zoomable; optional print poster"
        tension="The wall has a keeper. You never see them. You see what they taped up, what they circled, what they crossed out, what they added at 3am. The keeper believes something but won't say it. You decide if they're right."
        mvp="Single zoomable wall. ~40 artifacts: photos, notes, a hair sample in a baggie, a torn topo map with a red circle."
        vision="Wall grows over months. New captures get added. Old 'confirmed' items get question marks drawn on them. The keeper leaves a note asking if you're the one who moved the string."
        risk="Mood-only. The wall must earn its spookiness through specificity (real GPS, real dates, real tree species) — otherwise it's a Pinterest board."
      />
      <div style={{ flex:1, position:'relative', background: '#b8a894',
        backgroundImage:`repeating-linear-gradient(23deg, ${c.rule}22 0 1px, transparent 1px 14px), repeating-linear-gradient(-67deg, ${c.rule}22 0 1px, transparent 1px 14px)` }}>
        {/* red string */}
        <svg width="100%" height="100%" style={{ position:'absolute', inset: 0, pointerEvents:'none' }}>
          <path d="M 80 90 Q 180 60 280 140 Q 340 180 420 240 Q 480 260 520 120"
            stroke={c.ir} strokeWidth="1" fill="none" opacity="0.6"/>
          <path d="M 280 140 L 200 290 L 380 340"
            stroke={c.ir} strokeWidth="1" fill="none" opacity="0.6"/>
        </svg>
        {/* photo 1 — fawn */}
        <div style={{ position:'absolute', left: 40, top: 60, width: 120, transform: 'rotate(-3deg)',
          background:'#fff', padding: 6, boxShadow:'2px 3px 8px rgba(0,0,0,0.2)' }}>
          <div style={{ width:108, height:78, background: c.forest, position:'relative', overflow:'hidden' }}>
            <ForestBG w={108} h={78} density={0.6}/>
            <div style={{ position:'absolute', left: 20, top: 20 }}><Fawn w={70} h={50} wing={0}/></div>
          </div>
          <div style={{ fontSize: 8, marginTop: 3, color:'#333', fontFamily:'var(--mono)' }}>10/24 03:47 cam3</div>
          <div style={{ position:'absolute', top:-8, left:'50%', width: 30, height: 12,
            background: `${c.teal}aa`, transform:'translateX(-50%) rotate(-2deg)' }}/>
        </div>
        {/* photo 2 — WINGED */}
        <div style={{ position:'absolute', left: 240, top: 70, width: 140, transform: 'rotate(2deg)',
          background:'#fff', padding: 6, boxShadow:'2px 3px 8px rgba(0,0,0,0.25)', zIndex: 2 }}>
          <div style={{ width:128, height:92, background: c.forest, position:'relative', overflow:'hidden' }}>
            <ForestBG w={128} h={92} density={0.6}/>
            <div style={{ position:'absolute', left: 16, top: 22 }}><Fawn w={94} h={68} wing={0.9}/></div>
          </div>
          <div style={{ fontSize: 8, marginTop: 3, color:'#333', fontFamily:'var(--mono)' }}>10/24 03:47 cam3 · <span style={{color:'#a00'}}>WHAT</span></div>
          {/* circled in red */}
          <svg style={{ position:'absolute', top:-10, left:-10, right:-10, bottom:-10, pointerEvents:'none' }}>
            <ellipse cx="50%" cy="50%" rx="75" ry="58" fill="none" stroke={c.ir} strokeWidth="2" opacity="0.7" strokeDasharray="0" transform="rotate(-4)" style={{ transformOrigin:'center' }}/>
          </svg>
        </div>
        {/* photo 3 — fawn again, normal */}
        <div style={{ position:'absolute', left: 480, top: 90, width: 100, transform: 'rotate(5deg)',
          background:'#fff', padding: 5, boxShadow:'2px 3px 8px rgba(0,0,0,0.2)' }}>
          <div style={{ width:90, height:64, background: c.forest, position:'relative', overflow:'hidden' }}>
            <ForestBG w={90} h={64} density={0.6}/>
            <div style={{ position:'absolute', left: 12, top: 18 }}><Fawn w={64} h={46} wing={0}/></div>
          </div>
          <div style={{ fontSize: 8, marginTop: 3, color:'#333', fontFamily:'var(--mono)' }}>10/24 03:47:18</div>
        </div>
        {/* index card — typed */}
        <div style={{ position:'absolute', left: 140, top: 240, width: 200,
          background: c.paper, padding: '8px 10px', transform:'rotate(-1.5deg)',
          fontFamily:'var(--mono-2)', fontSize: 10, lineHeight: 1.4, color: c.ink,
          boxShadow:'2px 3px 6px rgba(0,0,0,0.2)',
          borderLeft: `3px solid ${c.forest}` }}>
          <div style={{ fontSize: 9, color: c.dim, marginBottom: 3 }}>— CAM-03 / 24-OCT —</div>
          3 frames, 6 seconds apart.<br/>
          Frame 1: deer.<br/>
          Frame 2: deer <span style={{ color: c.ir, fontWeight:700 }}>+ something</span>.<br/>
          Frame 3: deer. <br/>
          <span style={{ fontStyle:'italic' }}>canopy undisturbed.</span>
        </div>
        {/* handwritten sticky */}
        <div style={{ position:'absolute', left: 380, top: 320, width: 150,
          background: '#e8d470', padding: '10px 12px', transform:'rotate(3deg)',
          fontFamily: '"Caveat", "Marker Felt", cursive', fontSize: 16, lineHeight: 1.2, color: '#2a2218',
          boxShadow:'2px 3px 8px rgba(0,0,0,0.25)' }}>
          if it doesn't have wings<br/>
          <span style={{ textDecoration:'underline' }}>every other time</span><br/>
          what are the wings for
        </div>
        {/* topo fragment */}
        <div style={{ position:'absolute', left: 40, top: 330, width: 130, height: 100,
          background: c.paper, padding: 4, transform:'rotate(-4deg)',
          boxShadow:'2px 3px 6px rgba(0,0,0,0.2)', overflow:'hidden' }}>
          <svg width="122" height="92" viewBox="0 0 122 92">
            <rect width="122" height="92" fill={c.paper}/>
            {[0,1,2,3,4].map(i => (
              <path key={i} d={`M ${i*20} 90 Q ${40+i*10} ${60-i*8} ${80-i*5} ${40-i*4} Q 100 ${20+i*5} 122 ${10+i*10}`}
                fill="none" stroke={c.forest} strokeWidth="0.5" opacity="0.7"/>
            ))}
            <circle cx="72" cy="48" r="14" fill="none" stroke={c.ir} strokeWidth="1.5"/>
            <text x="76" y="50" fontFamily="var(--mono)" fontSize="7" fill={c.ir}>3</text>
          </svg>
        </div>
        {/* hair sample baggie */}
        <div style={{ position:'absolute', left: 600, top: 300, width: 90, height: 70,
          background: 'rgba(255,255,255,0.35)', border: '1px solid #8884',
          transform: 'rotate(6deg)', padding: 4, fontSize: 9, fontFamily:'var(--mono)', color:'#333' }}>
          <div style={{ letterSpacing: 1 }}>SAMPLE 04</div>
          <div style={{ fontSize: 8, color:'#666' }}>near cam-03</div>
          {/* "hair" */}
          <svg width="80" height="30">
            {Array.from({length:6}).map((_,i) => (
              <path key={i} d={`M ${5+i*12} 6 Q ${10+i*12} ${15+i} ${8+i*12} 26`}
                stroke={['#d8d0c2','#8a7c66','#c8b896'][i%3]} strokeWidth="1" fill="none"/>
            ))}
          </svg>
        </div>
        <Lichen corner="tl" size={80} seed={3}/>
        <Lichen corner="br" size={100} seed={9}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 06 — HAUNTED DESKTOP
// Mac OS 9 over forest wallpaper. The machine is the haunted thing.
// ═══════════════════════════════════════════════════════════
function Card06_HauntedDesktop() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{
      display:'flex', gap: 18, padding: 20,
      background: c.ground, width: 920, height: 560,
      position: 'relative', fontFamily: 'var(--mono)',
    }}>
      <Noise opacity={0.1}/>
      <CardAnnotation
        number={6} title="The Camera's Hard Drive"
        format="WEB · clickable OS 9 desktop, 30 min-60 min playthrough"
        tension="The apparatus is the subject. Not the deer. The deer is just what the machine caught and can't stop replaying. The OS is the ghost. The moss is growing on the desktop."
        mvp="Static desktop mock with folders, a TextEdit window, a SimpleText note from the ranger, one playable QuickTime frame."
        vision="Full desktop OS, playable. Open folders; read dated logs; the machine gets weirder as you click further back in time. Something is writing new files while you browse."
        risk="Nostalgia porn. The OS 9 chrome is seductive but empty if the contents don't argue. Every file must earn its place."
      />
      <div style={{ flex:1, position:'relative', overflow:'hidden',
        background: `linear-gradient(180deg, ${c.forest} 0%, ${c.ink} 100%)` }}>
        {/* forest wallpaper */}
        <ForestBG w={556} h={520} density={1.4} style={{ position:'absolute', inset: 0 }}/>
        {/* menu bar */}
        <div style={{
          position:'absolute', top: 0, left: 0, right: 0, height: 20,
          background: c.paper, borderBottom: `1px solid ${c.ink}`,
          display:'flex', alignItems:'center', padding: '0 8px', gap: 16,
          fontSize: 11, color: c.ink, fontWeight: 600,
        }}>
          <span>▲</span>
          <span>File</span><span>Edit</span><span>View</span><span>Special</span>
          <span style={{ marginLeft:'auto', fontFamily:'var(--mono)', fontSize: 10 }}>3:47 AM · 🌙 ◐</span>
        </div>
        {/* desktop icons */}
        <div style={{ position:'absolute', top: 40, left: 14, display:'flex', flexDirection:'column', gap: 16, fontFamily:'var(--mono)', fontSize: 10, color: c.ground, textShadow:'1px 1px 0 rgba(0,0,0,0.8)' }}>
          {[
            { icon: '📁', label: 'CAM-01' },
            { icon: '📁', label: 'CAM-02' },
            { icon: '📁', label: 'CAM-03' },
            { icon: '📁', label: 'do_not_sync/' },
            { icon: '📄', label: 'ranger_notes.txt' },
            { icon: '🗑', label: 'Trash (full)' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, width: 64 }}>
              <div style={{ width: 32, height: 32, background: c.paper, border:`1px solid ${c.ink}`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize: 20,
                filter: i === 3 ? `hue-rotate(300deg)` : 'none' }}>
                {item.icon}
              </div>
              <span style={{ textAlign:'center' }}>{item.label}</span>
            </div>
          ))}
        </div>
        {/* CAM-03 folder window */}
        <div style={{ position:'absolute', top: 50, left: 110 }}>
          <OSWindow chromeStyle="mac9" title="CAM-03" w={260} h={160} titleRight="24 items">
            <div style={{ padding: 6, fontSize: 10, fontFamily:'var(--mono)', color: c.ink, background: c.paper, height:'100%' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px', fontSize: 9, color: c.dim, borderBottom:`1px solid ${c.rule}`, paddingBottom: 3, marginBottom: 4, letterSpacing: 1 }}>
                <span>NAME</span><span>SIZE</span><span>MODIFIED</span>
              </div>
              {[
                ['IMG_0341.jpg', '2.1M', '03:47:11'],
                ['IMG_0342.jpg', '2.2M', '03:47:12'],
                ['IMG_0343.jpg', '2.0M', '03:47:15'],
                ['IMG_0344.jpg', '—',    <span style={{color:c.ir}}>03:47:??</span>],
                ['IMG_0345.jpg', '2.1M', '03:47:18'],
                ['._.hidden',    '14 B', <span style={{color:c.ir}}>—</span>],
              ].map((row, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 60px 60px', padding:'1px 0', background: i === 3 ? `${c.ir}22` : 'transparent' }}>
                  <span>{row[0]}</span>
                  <span style={{ color: c.dim }}>{row[1]}</span>
                  <span style={{ color: c.dim }}>{row[2]}</span>
                </div>
              ))}
            </div>
          </OSWindow>
        </div>
        {/* ranger_notes.txt open */}
        <div style={{ position:'absolute', top: 220, left: 180 }}>
          <OSWindow chromeStyle="mac9" title="ranger_notes.txt" w={280} h={170}>
            <div style={{ background: c.paper, padding: 10, fontSize: 11, color: c.ink, height:'100%', lineHeight: 1.5 }}>
              <div style={{ fontStyle:'italic', color: c.dim, fontSize: 9, marginBottom: 6 }}>— last edited 03:47, today —</div>
              pulled cards this AM.<br/>
              3rd time in 2 weeks.<br/>
              the tree is fine.<br/>
              the tree is fine.<br/>
              <span style={{ color: c.ir }}>the tree is fine.</span><br/>
              not sleeping.
            </div>
          </OSWindow>
        </div>
        {/* QT preview */}
        <div style={{ position:'absolute', top: 90, right: 20 }}>
          <OSWindow chromeStyle="mac9" title="IMG_0342.jpg" w={180} h={140}>
            <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', background:'#000' }}>
              <ForestBG w={178} h={120} density={0.9}/>
              <div style={{ position:'absolute', left: 40, top: 40 }}>
                <Fawn w={90} h={60} wing={0.9}/>
              </div>
              <TrailCamHUD w={178} h={120} timestamp="03:47:12"/>
              <Scanlines opacity={0.2}/>
            </div>
          </OSWindow>
        </div>
        {/* moss growing on the desktop edge */}
        <MossEdge side="bottom" thickness={30} seed={11}/>
        <MossEdge side="left" thickness={20} seed={4}/>
      </div>
    </div>
  );
}

Object.assign(window, { Card01_FieldGuide, Card02_ConfigWizard, Card03_MotionTracker, Card04_FourMonitors, Card05_Wall, Card06_HauntedDesktop });
