// cards-b.jsx — Specimens 7–12

const { Fawn, Unknown, ForestBG, TrailCamHUD, OSWindow, TapeLabel, Sticker,
        MetaRow, MossEdge, Lichen, Noise, Scanlines, IRFrame, useTweaks } = window;

function CardAnnotationB({ number, title, tension, mvp, vision, risk, format }) {
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
        <span style={{ fontSize: 10, color: c.dim, letterSpacing: 1.5 }}>SPECIMEN</span>
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.18, color: c.ink, letterSpacing: -0.3, textWrap:'balance', paddingBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 9, color: c.dim, letterSpacing: 1, textTransform:'uppercase' }}>
        FORMAT · <span style={{ color: c.forest }}>{format}</span>
      </div>
      <div style={{ background: c.paper, padding:'8px 10px', border:`1px solid ${c.rule}`, fontSize:10, lineHeight:1.45 }}>
        <div style={{ color: c.plum, fontWeight: 700, marginBottom: 3, letterSpacing: 1, fontSize: 9 }}>TENSION HELD</div>
        <div>{tension}</div>
      </div>
      <div>
        <div style={{ color: c.forest, fontWeight: 700, marginBottom: 3, letterSpacing: 1, fontSize: 9 }}>MVP ─────────────</div>
        <div style={{ fontSize: 10.5, lineHeight: 1.5 }}>{mvp}</div>
      </div>
      <div>
        <div style={{ color: c.teal, fontWeight: 700, marginBottom: 3, letterSpacing: 1, fontSize: 9 }}>FULL VISION ─────</div>
        <div style={{ fontSize: 10.5, lineHeight: 1.5 }}>{vision}</div>
      </div>
      <div style={{ marginTop:'auto', fontSize: 9.5, lineHeight: 1.4, color: c.dim, fontStyle:'italic' }}>
        <span style={{ color: c.ir, fontStyle:'normal', fontWeight:700, letterSpacing:1 }}>⚠ RISK · </span>{risk}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 07 — CRYPTID FORUM THREAD
// ═══════════════════════════════════════════════════════════
function Card07_Forum() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{ display:'flex', gap: 18, padding: 20, background: c.ground, width: 920, height: 560, position:'relative', fontFamily:'var(--mono)' }}>
      <Noise opacity={0.1}/>
      <CardAnnotationB
        number={7} title="Thread: r/trailcam · [help ID]"
        format="WEB · fictional forum post w/ 34 replies"
        tension="No authority. Only testimony. Users disagree: 'compression artifact', 'wings', 'my grandma saw one'. The thread has no accepted answer; the not-answer IS the answer."
        mvp="Single post + 8 replies rendered as static HTML. Comments have ages, karma, flags."
        vision="Multi-thread archive. Threads link to each other. One user keeps coming back over years, sometimes under different names."
        risk="Reads as Reddit cosplay. Must avoid meme-speak; the voices need to be different enough that disagreement feels real."
      />
      <div style={{ flex:1, background:'#f6f2ea', padding: 16, overflow:'hidden', fontFamily:'var(--mono-2)', fontSize: 11, color:'#222' }}>
        <div style={{ borderBottom: `2px solid ${c.forest}`, paddingBottom: 6, marginBottom: 10, display:'flex', alignItems:'baseline', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>r/trailcam</span>
          <span style={{ fontSize: 9, color:'#777', letterSpacing: 1 }}>· HELP_ID · 847 online</span>
          <span style={{ marginLeft:'auto', fontSize: 9, color:'#777' }}>sorted by: most controversial</span>
        </div>
        {/* OP */}
        <div style={{ background:'#fff', padding: 10, border:`1px solid ${c.rule}`, marginBottom: 10 }}>
          <div style={{ display:'flex', gap:8, fontSize:10, color:'#555', marginBottom: 6 }}>
            <span style={{ fontWeight:700, color: c.forest }}>u/quietclearing</span>
            <span>· 14h · TN, USA</span>
            <span style={{ marginLeft:'auto' }}>▲ 312 ▼</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>[help ID] cam-03, 3 frames apart, same night</div>
          <div style={{ fontSize: 11, lineHeight: 1.5 }}>
            ok so i have three frames. same cam, same clearing. 03:47:11, 03:47:14, 03:47:18. middle frame the deer has… something on its back. wings? before and after, nothing. canopy undisturbed. not a bird flying past (i checked). compression artifact? what am i looking at. posting all 3 below.
          </div>
          <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
            {[0, 0.9, 0].map((wing, i) => (
              <div key={i} style={{ width: 90, height: 64, background: c.forest, position:'relative', overflow:'hidden', border:'1px solid #888' }}>
                <ForestBG w={90} h={64} density={0.5}/>
                <div style={{ position:'absolute', left: 10, top: 18 }}><Fawn w={70} h={46} wing={wing}/></div>
              </div>
            ))}
          </div>
        </div>
        {/* replies */}
        {[
          { u:'pixel_forensics', age:'12h', karma: 184, flair:'verified', body:'zoom on the third frame. you can see residual noise in the wing region. it\'s a compression artifact from IR exposure transition. same cam does this to me on cold nights.', color:'#556' },
          { u:'quietclearing', age:'12h', karma: 89, flair:'OP', body:'it did this in the SAME three seconds though. not across the night. the before/after frames are clean.', color: c.forest },
          { u:'mawmaw_holler', age:'11h', karma: 247, flair:null, body:'my grandmother called them dusk-fawns. said they come back when the field has been left alone long enough. i am not joking. i am not a person who jokes about this.', color:'#7a4466' },
          { u:'skeptic_04', age:'10h', karma: -18, flair:null, body:'it\'s a barred owl in the frame above it, motion-blurred. i will die on this hill.', color:'#556' },
          { u:'[deleted]', age:'9h', karma: null, flair:null, body:'[removed by moderator — rule 4: no speculation presented as fact]', color:'#aaa', italic:true },
          { u:'quietclearing', age:'6h', karma: 41, flair:'OP', body:'pulled the card again tonight. cam-03 has 2 more. same timestamp range. different deer.', color: c.forest },
        ].map((r, i) => (
          <div key={i} style={{ background:'#fff', padding: 8, border:`1px solid ${c.rule}`, marginBottom: 6, marginLeft: i === 1 || i === 5 ? 20 : 0, fontStyle: r.italic ? 'italic' : 'normal', color: r.italic ? '#888' : '#222' }}>
            <div style={{ display:'flex', gap: 8, fontSize: 9.5, marginBottom: 3 }}>
              <span style={{ fontWeight: 700, color: r.color }}>u/{r.u}</span>
              {r.flair && <span style={{ background: r.flair==='OP'? c.ir : c.teal, color:'#fff', padding:'0 5px', fontSize: 8, letterSpacing: 0.5 }}>{r.flair}</span>}
              <span style={{ color:'#888' }}>· {r.age}</span>
              {r.karma !== null && <span style={{ marginLeft:'auto', color:'#888' }}>▲ {r.karma}</span>}
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.45 }}>{r.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 08 — FIRMWARE / MANUAL
// ═══════════════════════════════════════════════════════════
function Card08_Manual() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{ display:'flex', gap: 18, padding: 20, background: c.ground, width: 920, height: 560, position:'relative', fontFamily:'var(--mono)' }}>
      <Noise opacity={0.1}/>
      <CardAnnotationB
        number={8} title="Firmware 2.4.1 Release Notes"
        format="PDF · 24-page technical doc, downloadable"
        tension="Pure apparatus voice. The manual is all it knows how to be — bullet points, changelog, error codes. And yet somewhere in the troubleshooting section, the language cracks: 'if subject persists in frames where no subject was stored…'"
        mvp="4-page PDF: cover, changelog, troubleshooting, glossary. Typeset in IBM Plex Mono. Version string in header of every page."
        vision="Full 24-page manual. Each firmware version more disturbed than the last. Changelog entries like 'fixed: repeated writes to disk after power-off.' An email address to contact support that bounces."
        risk="Dry. The document has to be boring enough to be real and strange enough to unsettle — a narrow target."
      />
      <div style={{ flex:1, background:'#fafaf2', padding: '28px 36px', fontFamily:'var(--mono)', fontSize: 10, color:'#1a1a1a', position:'relative', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 8, color:'#666', letterSpacing: 1.5, paddingBottom: 6, borderBottom: '1px solid #1a1a1a', marginBottom: 14 }}>
          <span>STALKWORKS MERIDIAN-7 · FIRMWARE 2.4.1</span>
          <span>RELEASE NOTES · 24 OCT 2024</span>
          <span>PAGE 7 / 24</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, letterSpacing: -0.3 }}>
          §4 · Troubleshooting — <span style={{ color: c.ir }}>PERSISTENT SUBJECT</span>
        </div>
        <div style={{ lineHeight: 1.65, columnCount: 1, marginBottom: 10, fontSize: 10.5 }}>
          <p style={{ margin: '0 0 10px' }}>
            <b>4.3.1  </b>If the camera reports motion events in frames where no subject can be confirmed in storage, reset the SD card in FAT32 mode. If the issue persists, see §4.3.2.
          </p>
          <p style={{ margin: '0 0 10px' }}>
            <b>4.3.2  </b>If the subject appears in <i>stored</i> frames but disappears on retransfer: verify cable. This is a known issue with USB-C passthrough on field stations below 4°C.
          </p>
          <p style={{ margin: '0 0 10px' }}>
            <b>4.3.3  </b>If the subject appears only in <i>certain</i> stored frames — specifically one in a burst of three — no action is required. This is expected behavior on Meridian-7 under the following conditions:
          </p>
          <ul style={{ margin: '0 0 12px 22px', padding: 0, lineHeight: 1.65 }}>
            <li>Ambient temperature between −2°C and 8°C;</li>
            <li>IR flash active (i.e., low ambient visible light);</li>
            <li>Canopy density &gt; 0.6;</li>
            <li><span style={{ background: c.ir, color:'#fff', padding:'0 3px' }}>Moon phase waxing crescent through first quarter;</span></li>
            <li>No audible alarm from the unit prior to capture.</li>
          </ul>
          <p style={{ margin: '0 0 10px' }}>
            <b>4.3.4  </b>Do not report these frames as defects. They are not defects. They are the camera operating within specification.
          </p>
          <p style={{ margin: '0 0 10px', color: c.ir, fontStyle:'italic' }}>
            <b>4.3.5  </b>If the subject <u>returns</u> to a frame after deletion, delete the frame a second time. If the frame continues to return, contact support@stalkworks.zz and include the timestamp. Do not delete a third time.
          </p>
        </div>
        <div style={{ fontSize: 9, color:'#555', borderTop:'1px solid #aaa', paddingTop: 6 }}>
          See also: §4.3 Persistent Subject · §5.1 Timestamps That Do Not Advance · §6.2 Audio Log Anomalies
        </div>
        <div style={{ position:'absolute', bottom: 20, right: 30, fontSize: 8, color:'#888', letterSpacing: 2 }}>
          © STALKWORKS OUTDOORS 2024 · MADE IN PRC · 07 / 24
        </div>
        {/* subtle moss */}
        <MossEdge side="bottom" thickness={12} seed={2}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 09 — AUDIO LOG / SPECTROGRAM
// ═══════════════════════════════════════════════════════════
function Card09_Audio() {
  const t = useTweaks();
  const c = t.palette;
  // fake spectrogram bars
  const bars = useMemo(() => Array.from({length: 180}, (_,i) => {
    const r = Math.sin(i*0.3)*0.4 + Math.sin(i*0.07)*0.3 + 0.5 + (((i*7919)%97)/97 - 0.5)*0.4;
    return Math.max(0.05, Math.min(1, r));
  }), []);
  return (
    <div style={{ display:'flex', gap: 18, padding: 20, background: c.ground, width: 920, height: 560, position:'relative', fontFamily:'var(--mono)' }}>
      <Noise opacity={0.1}/>
      <CardAnnotationB
        number={9} title="Audio Log · 03:47:09 → 03:47:22"
        format="WEB · transcript + scrubbable spectrogram + playback"
        tension="The camera's mic records 13 seconds of ambient sound. The transcript is mostly [WIND]. One token in the middle is [LAUGHTER?]. The brackets are the apparatus trying to be fair."
        mvp="Static transcript + rendered spectrogram (SVG). One playable audio clip if we can source it."
        vision="Every trail cam capture in the project has its audio log public. Users can retranscribe. Consensus transcripts get pinned but dissents stay visible."
        risk="Requires real audio to land. Text-only risks feeling like a stunt."
      />
      <div style={{ flex:1, background: '#121814', padding: 18, color: c.ground, display:'flex', flexDirection:'column', gap: 14, overflow:'hidden' }}>
        {/* header */}
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color: c.dim, letterSpacing: 1.5 }}>
          <span>CAM-03 / MIC / 24-OCT-24</span>
          <span>13.4 SEC · 44.1 kHz · 16-BIT</span>
          <span style={{ color: c.phosphor }}>▶ LOG_0341.wav</span>
        </div>
        {/* waveform */}
        <div style={{ position:'relative', height: 80, background:'#0a0e0c', border:`1px solid ${c.forest}66`, padding: 8 }}>
          <svg width="100%" height="64">
            {bars.map((v, i) => (
              <rect key={i} x={i*3} y={32 - v*28} width="2" height={v*56}
                fill={i === 90 ? c.ir : c.phosphor} opacity={i === 90 ? 1 : 0.55}/>
            ))}
            {/* cursor */}
            <line x1="270" y1="0" x2="270" y2="64" stroke={c.ir} strokeWidth="1"/>
          </svg>
          <div style={{ position:'absolute', left: 270, top: -2, fontSize: 8, color: c.ir, transform:'translateX(-50%)', background:'#0a0e0c', padding:'0 4px' }}>
            03:47:15.3
          </div>
        </div>
        {/* spectrogram */}
        <div style={{ height: 120, background: '#0a0e0c', border:`1px solid ${c.forest}66`, position:'relative', padding: 8, overflow:'hidden' }}>
          <div style={{ fontSize: 9, color: c.dim, letterSpacing: 1.5, marginBottom: 4 }}>SPECTROGRAM · 20Hz–20kHz</div>
          <svg width="100%" height="94" style={{ display:'block' }}>
            {Array.from({length: 80}).map((_, x) => (
              Array.from({length: 30}).map((__, y) => {
                const e = Math.sin(x*0.15 + y*0.2) * 0.4 + Math.sin(x*0.05)*0.3 + ((x*y*41 % 97)/97 - 0.5) * 0.5 + 0.5;
                const hot = x > 38 && x < 50 && y < 12;
                return <rect key={`${x}-${y}`} x={x*6} y={y*3} width="6" height="3"
                  fill={hot ? c.ir : c.phosphor}
                  opacity={hot ? 0.7 + Math.random()*0.3 : e * 0.6}/>;
              })
            ))}
          </svg>
        </div>
        {/* transcript */}
        <div style={{ flex:1, background: '#0a0e0c', border:`1px solid ${c.forest}66`, padding: 12, fontSize: 11, lineHeight: 1.8, fontFamily:'var(--mono)', color: c.phosphor, textShadow:`0 0 3px ${c.phosphor}99`, overflow:'hidden' }}>
          <div style={{ fontSize: 9, color: c.dim, letterSpacing: 1.5, marginBottom: 8 }}>AUTO-TRANSCRIPT · model v2 · confidence colored</div>
          <div><span style={{color:c.dim}}>[03:47:09]</span> [WIND] [WIND] <span style={{opacity:0.6}}>[leaves?]</span></div>
          <div><span style={{color:c.dim}}>[03:47:11]</span> [WIND] <span style={{opacity:0.5}}>[hoof, soft]</span></div>
          <div><span style={{color:c.dim}}>[03:47:13]</span> <span style={{color:c.ir}}>[UNIDENTIFIED · 0.2s · 340Hz peak]</span></div>
          <div><span style={{color:c.dim}}>[03:47:15]</span> <span style={{color:c.ir, background:`${c.ir}22`, padding:'0 3px'}}>[LAUGHTER?]</span> <span style={{opacity:0.5}}>[wingbeat? · 2 cycles]</span></div>
          <div><span style={{color:c.dim}}>[03:47:17]</span> [WIND]</div>
          <div><span style={{color:c.dim}}>[03:47:20]</span> [WIND] [WIND]</div>
          <div style={{ marginTop: 10, color: c.dim, fontSize: 9, fontStyle:'italic' }}>
            3 tokens flagged for human review. consensus transcript pending.
          </div>
        </div>
        <Scanlines opacity={0.12}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 10 — ZINE (FOLDED PAPER)
// ═══════════════════════════════════════════════════════════
function Card10_Zine() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{ display:'flex', gap: 18, padding: 20, background: c.ground, width: 920, height: 560, position:'relative', fontFamily:'var(--mono)' }}>
      <Noise opacity={0.1}/>
      <CardAnnotationB
        number={10} title="Photocopier Devotional"
        format="PRINT · 8-page ¼-letter zine, 200 copies, Risograph"
        tension="The photocopier degrades the image with each reprint. The fawn gets less deer, more ghost. The copy is the animal now. Documentary evidence surviving only as rumor."
        mvp="Single spread (2 facing pages) as print-ready PDF. High-contrast B/W plus one spot color (magenta/IR)."
        vision="Full 8-page zine, traded at zine fairs. Each print run is slightly more degraded than the last — we publish the 'generation number'."
        risk="Zine aesthetics are a well-worn aesthetic. Must avoid 'distressed for distress's sake' — the degradation needs to align with the argument, not decorate it."
      />
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, background:'#1a1a18', padding: 22 }}>
        {/* left page */}
        <div style={{ background:'#f0ecde', padding: 18, position:'relative', fontFamily:'"Courier Prime", var(--mono)', color:'#0a0a0a', filter:'contrast(1.3)' }}>
          <div style={{ fontSize: 8, letterSpacing: 2, marginBottom: 14 }}>/ 04 /</div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.05, marginBottom: 12, letterSpacing: -0.5 }}>
            THE COPY IS<br/>THE ANIMAL<br/>NOW
          </div>
          <div style={{ position:'relative', width:'100%', height: 180, background:'#ddd', overflow:'hidden', marginBottom: 10, filter:'grayscale(1) contrast(1.6)' }}>
            <ForestBG w={180} h={180} density={1}/>
            <div style={{ position:'absolute', left: 40, top: 50, filter:'blur(0.5px) contrast(2)' }}>
              <Fawn w={120} h={86} wing={0.7} tint="#0a0a0a"/>
            </div>
            <Scanlines opacity={0.3} gap={2}/>
          </div>
          <div style={{ fontSize: 10, lineHeight: 1.5 }}>
            each generation, another layer of toner,<br/>
            another layer of grain. the fawn<br/>
            gets darker. the wings get brighter.<br/>
            by generation twelve the fawn will be<br/>
            a shape someone remembers.
          </div>
          <div style={{ position:'absolute', top: 10, right: 12 }}>
            <Sticker size={11} rotate={-6} style={{ color: c.ir }}>GEN 06</Sticker>
          </div>
        </div>
        {/* right page */}
        <div style={{ background:'#f0ecde', padding: 18, position:'relative', fontFamily:'"Courier Prime", var(--mono)', color:'#0a0a0a', filter:'contrast(1.3)' }}>
          <div style={{ fontSize: 8, letterSpacing: 2, marginBottom: 14, textAlign:'right' }}>/ 05 /</div>
          <div style={{ fontSize: 11, lineHeight: 1.65, marginBottom: 12 }}>
            <p style={{ margin:'0 0 10px' }}>a deer moves through a clearing at 3:47. the camera is not surprised.</p>
            <p style={{ margin:'0 0 10px' }}>the camera is never surprised. that is its whole job.</p>
            <p style={{ margin:'0 0 10px' }}>but between one shutter and the next — three seconds, no more —</p>
            <p style={{ margin:'0 0 10px' }}>something happens that the camera has to decide whether to keep.</p>
            <p style={{ margin:'0 0 10px' }}>it decides to keep it.</p>
            <p style={{ margin:'0 0 10px', color: c.ir, fontWeight:700 }}>it decides to keep it every time.</p>
          </div>
          <div style={{ borderTop:'1px solid #000', paddingTop: 8, fontSize: 9, lineHeight: 1.5 }}>
            photocopier devotional<br/>
            issue 04 · evening fawn · print run 200<br/>
            trade at fairs. do not sell. do not<br/>
            scan. copy by hand only.
          </div>
          {/* smudge */}
          <div style={{ position:'absolute', left: 30, bottom: 60, width: 60, height: 30, background:'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent)' }}/>
          {/* staple */}
          <div style={{ position:'absolute', left: -12, top: '50%', width: 20, height: 3, background:'#888', boxShadow:'0 10px 0 #888, 0 -10px 0 #888' }}/>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 11 — GALLERY VITRINE
// ═══════════════════════════════════════════════════════════
function Card11_Vitrine() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{ display:'flex', gap: 18, padding: 20, background: c.ground, width: 920, height: 560, position:'relative', fontFamily:'var(--mono)' }}>
      <Noise opacity={0.1}/>
      <CardAnnotationB
        number={11} title="Specimen in Vitrine"
        format="INSTALLATION · glass case, single object, museum label"
        tension="The SD card is the specimen. Not the deer on the card. The apparatus becomes the relic. The clinical gesture (case, lit, labeled) elevates a $12 consumable into something that insists on being looked at."
        mvp="Rendered vitrine mock + the exact museum-label text, typeset as it would be printed."
        vision="Traveling object. The card stays the same; the label text changes with each venue, reflecting local folklore. The deer on the card is never shown."
        risk="Precious. Vitrine-as-format has been overused. The label must carry the weight — it's the real artwork."
      />
      <div style={{ flex:1, position:'relative', background: '#1a1c1f',
        backgroundImage: `radial-gradient(ellipse at top, #2a2d32 0%, #0e1013 100%)` }}>
        {/* the plinth */}
        <div style={{
          position:'absolute', left: '50%', bottom: 60, width: 180, height: 200,
          background:'linear-gradient(180deg, #e8e2d0 0%, #b8b09e 100%)',
          transform:'translateX(-50%)', boxShadow:'0 20px 40px rgba(0,0,0,0.5)',
        }}/>
        {/* the glass case */}
        <div style={{
          position:'absolute', left: '50%', bottom: 260, width: 160, height: 110,
          background:'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          transform:'translateX(-50%)',
          boxShadow: 'inset 0 0 40px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.5)',
        }}/>
        {/* the SD card — the specimen */}
        <div style={{
          position:'absolute', left: '50%', bottom: 300, width: 46, height: 56,
          background:'#2a3d5f', border:'1px solid #1a2540',
          transform:'translateX(-50%) rotate(-4deg)',
          borderRadius: '2px 6px 2px 2px',
          boxShadow:'0 12px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <div style={{ position:'absolute', top: 6, left: 6, right: 6,
            fontSize: 6, fontFamily:'var(--mono)', color:'#8ab0d0', letterSpacing: 0.3, lineHeight: 1.2 }}>
            SanDisk<br/>EXTREME<br/>PRO<br/>128GB
          </div>
          <div style={{ position:'absolute', bottom: 4, left: 4, right: 4, height: 10,
            background:'repeating-linear-gradient(90deg, #b8a866 0 2px, #8a7c44 2px 3px)',
            borderRadius: 1 }}/>
        </div>
        {/* spotlight */}
        <div style={{
          position:'absolute', left: '50%', top: 0, width: 300, height: 400,
          background:'radial-gradient(ellipse at 50% 70%, rgba(255,240,220,0.15) 0%, transparent 60%)',
          transform:'translateX(-50%)', pointerEvents:'none',
        }}/>
        {/* museum label */}
        <div style={{
          position:'absolute', left: 40, bottom: 40, width: 260,
          background: c.paper, padding: '14px 16px',
          fontFamily:'var(--serif)', color:'#1a1a1a', fontSize: 11, lineHeight: 1.5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontSize: 8, letterSpacing: 2, color:'#666', marginBottom: 6 }}>GALLERY 3 · WALL LABEL</div>
          <div style={{ fontFamily:'var(--serif)', fontSize: 14, fontStyle:'italic', marginBottom: 4 }}>
            Untitled (Cervus aliger)
          </div>
          <div style={{ fontSize: 10, color:'#666', marginBottom: 8 }}>
            SanDisk Extreme Pro, 128 GB, containing 2,417 images<br/>
            Hardin County, TN · 24 October 2024 · 02:10–05:40 EDT
          </div>
          <div style={{ fontSize: 10.5, lineHeight: 1.6 }}>
            The artist retrieved the card from a camera trap set by an unnamed ranger. Of 2,417 images, only three contain a subject that the ranger could not account for. The card has not been copied. It is displayed here once; after the exhibition it will be returned to the clearing.
          </div>
          <div style={{ fontSize: 9, color:'#888', marginTop: 8, fontStyle:'italic' }}>
            Gift of the clearing, in exchange.
          </div>
        </div>
        {/* tiny wall stanchion silhouette */}
        <div style={{ position:'absolute', right: 50, bottom: 50, fontSize: 8, color:'#888', letterSpacing:2, fontFamily:'var(--mono)' }}>
          DO NOT TOUCH VITRINE · ATTN GUARD
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 12 — GENERATIVE BOOK OF HOURS
// ═══════════════════════════════════════════════════════════
function Card12_BookOfHours() {
  const t = useTweaks();
  const c = t.palette;
  return (
    <div style={{ display:'flex', gap: 18, padding: 20, background: c.ground, width: 920, height: 560, position:'relative', fontFamily:'var(--mono)' }}>
      <Noise opacity={0.1}/>
      <CardAnnotationB
        number={12} title="Book of Hours · CAM-03"
        format="WEB · daily illuminated calendar, one entry per timestamp"
        tension="Medieval devotional form applied to trail cam captures. Each hour of each day gets its creature. Some hours are deer; some hours are otherwise. The book keeps growing. You can never read it all."
        mvp="Single two-page spread (one 'hour'): illumination + calendar marginalia + captured specimen. Static."
        vision="Real-time. Every new capture from the (real or invented) cam array gets added as a new page. Users subscribe to RSS. A bell rings (optional) when a new hour is entered."
        risk="Twee. Illuminated-manuscript aesthetic can veer sweet — we need the illuminations to feel un-sweet, like the monks are afraid of what they're copying."
      />
      <div style={{ flex:1, background: c.paper, padding: 0, display:'grid', gridTemplateColumns:'1fr 1fr', position:'relative', overflow:'hidden' }}>
        {/* spine */}
        <div style={{ position:'absolute', left:'50%', top:0, bottom: 0, width: 2, background:`linear-gradient(180deg, transparent, ${c.ink}66 50%, transparent)`, zIndex: 2 }}/>
        {/* left page — illumination */}
        <div style={{ padding: 22, position:'relative', borderRight: `1px solid ${c.rule}` }}>
          <div style={{ fontFamily:'var(--serif)', fontSize: 9, letterSpacing: 3, color: c.dim, marginBottom: 10, textAlign:'center' }}>
            AD · HORAM · TERTIAM · ET · QUADRAGINTA · SEPTEM
          </div>
          {/* decorative border */}
          <div style={{ position:'relative', border: `1px solid ${c.rule}`, background: c.ground, padding: 12 }}>
            {/* dropcap */}
            <div style={{ float:'left', fontFamily:'var(--serif)', fontSize: 58, lineHeight: 0.8, marginRight: 6, marginTop: 2, color: c.ir, fontWeight: 900 }}>A</div>
            <div style={{ fontFamily:'var(--serif)', fontSize: 12, lineHeight: 1.5, color: c.ink, fontStyle:'italic' }}>
              t the third hour after midnight and the forty-seventh minute, the clearing yielded a fawn with the sign of the wing upon its back. The canopy was undisturbed. The camera was surprised in the manner of cameras, which is to say not at all.
            </div>
            {/* illumination itself */}
            <div style={{ clear:'both', marginTop: 14, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              {/* gold leaf halo */}
              <div style={{ position:'absolute', width: 120, height: 120, borderRadius:'50%',
                background: `radial-gradient(circle, #d4b84622 0%, transparent 70%)` }}/>
              <Fawn w={180} h={120} wing={0.9}/>
            </div>
            {/* corner flourishes */}
            {[['tl','-14','-14'],['tr','-14','auto'],['bl','auto','-14'],['br','auto','auto']].map(([k,t,l]) => (
              <svg key={k} width="28" height="28" style={{ position:'absolute', top: t==='-14'?t:'auto', bottom: t==='auto'?'-14':'auto', left: l==='-14'?l:'auto', right: l==='auto'?'-14':'auto' }}>
                <path d="M14 0 Q14 10 4 14 M14 0 Q14 10 24 14 M14 28 Q14 18 4 14 M14 28 Q14 18 24 14" stroke={c.forest} strokeWidth="0.8" fill="none"/>
                <circle cx="14" cy="14" r="2" fill={c.ir}/>
              </svg>
            ))}
          </div>
          {/* folio number */}
          <div style={{ position:'absolute', bottom: 12, left: 0, right: 0, textAlign:'center', fontSize: 9, color: c.dim, fontFamily:'var(--serif)', fontStyle:'italic' }}>
            — folium · xlvii —
          </div>
        </div>
        {/* right page — marginalia */}
        <div style={{ padding: 22, position:'relative' }}>
          <div style={{ fontFamily:'var(--serif)', fontSize: 9, letterSpacing: 3, color: c.dim, marginBottom: 10, textAlign:'center' }}>
            CALENDARIUM · OCTOBRIS · XXIV · MMXXIV
          </div>
          {/* calendar grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 2, marginBottom: 14, fontSize: 9, fontFamily:'var(--mono)', color: c.ink }}>
            {Array.from({length: 24}).map((_, h) => {
              const active = h === 3;
              const has = [3, 5, 12, 17, 22].includes(h);
              return (
                <div key={h} style={{
                  aspectRatio:'1', border:`1px solid ${c.rule}`,
                  background: active ? c.ir : has ? c.paper : c.ground,
                  color: active ? c.ground : c.ink,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight: active ? 700 : 400,
                  position:'relative',
                }}>
                  {String(h).padStart(2,'0')}
                  {has && !active && <div style={{ position:'absolute', top:1, right:1, width: 3, height: 3, background: c.forest }}/>}
                </div>
              );
            })}
          </div>
          {/* annotations */}
          <div style={{ fontFamily:'var(--serif)', fontSize: 11, lineHeight: 1.6, color: c.ink, marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: c.dim, marginBottom: 4 }}>IN MARGINE</div>
            <p style={{ margin:0 }}>
              The book keeps growing. Each new capture from CAM-03 enters as a new folium. Folia are not deleted, even when the creature is only a deer. The deer is worth recording. The deer is the miracle you do not notice because it happens every day.
            </p>
          </div>
          {/* specimen thumbnails row */}
          <div style={{ display:'flex', gap: 4, flexWrap:'wrap' }}>
            {[
              { wing: 0, h: '02' }, { wing: 0, h: '02' }, { wing: 0, h: '03' },
              { wing: 0.85, h: '03' }, { wing: 0, h: '03' }, { wing: 0, h: '04' },
              { wing: 0, h: '04' }, { wing: 0.3, h: '04' },
            ].map((f, i) => (
              <div key={i} style={{ width: 44, height: 36, background: c.ground, border:`1px solid ${c.rule}`, position:'relative', overflow:'hidden' }}>
                <Fawn w={42} h={30} wing={f.wing} style={{ position:'absolute', left:-8, top:4 }}/>
                <div style={{ position:'absolute', top: 0, left: 0, fontSize: 6, color: c.dim, padding: '1px 2px', background: c.paper }}>{f.h}</div>
              </div>
            ))}
          </div>
          <div style={{ position:'absolute', bottom: 12, left: 0, right: 0, textAlign:'center', fontSize: 9, color: c.dim, fontFamily:'var(--serif)', fontStyle:'italic' }}>
            — folium · xlviii —
          </div>
        </div>
        <MossEdge side="bottom" thickness={10} seed={17}/>
      </div>
    </div>
  );
}

Object.assign(window, { Card07_Forum, Card08_Manual, Card09_Audio, Card10_Zine, Card11_Vitrine, Card12_BookOfHours });
