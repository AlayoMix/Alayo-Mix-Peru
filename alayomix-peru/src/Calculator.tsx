import { useState } from "react";

const TIERS: Record<string, { label: string; desc: string; price: number; revisions: number; includesStems: boolean; perks: string[] }> = {
  "2mix": { label: "2 Mix", desc: "Mezcla de voz + instrumental", price: 100, revisions: 2, includesStems: false, perks: ["Mezcla de voz + instrumental"] },
  standard: { label: "Mix Estándar", desc: "Mezcla completa con coordinación", price: 240, revisions: 3, includesStems: false, perks: ["Mix instrumental incluido", "1 llamada de coordinación previa"] },
  allaccess: { label: "Mix All Access", desc: "Experiencia completa", price: 320, revisions: 6, includesStems: true, perks: ["Mix instrumental incluido", "Stems incluidos", "1 llamada de coordinación previa", "1 sesión online en tiempo real (1 hr)"] },
};

const FORMATS = [
  { id: "single", label: "Single", tracks: 1 },
  { id: "ep", label: "EP", tracks: 4 },
  { id: "album", label: "Album", tracks: 10 },
  { id: "custom", label: "Custom", tracks: 0 },
];

const S = 30, M = 30, R = 25;

export default function Calc() {
  const [tier, setTier] = useState("standard");
  const [format, setFormat] = useState("single");
  const [ct, setCt] = useState(1);
  const [stems, setStems] = useState(false);
  const [master, setMaster] = useState(false);
  const [revs, setRevs] = useState(0);
  const [rush, setRush] = useState(false);
  const [open, setOpen] = useState(false);

  const t = TIERS[tier];
  const tracks = format === "custom" ? ct : FORMATS.find(f => f.id === format)!.tracks;
  const perSong = t.price + (!t.includesStems && stems ? S : 0) + (master ? M : 0);
  const disc = tracks >= 4;
  const base = perSong * tracks + revs * R;
  const discount = disc ? Math.round(base * 0.1) : 0;
  const sub = base - discount;
  const rushFee = rush ? Math.round(sub * 0.3) : 0;
  const total = sub + rushFee;

  const C = "#C9A84C";
  const btn = (a: boolean) => ({ cursor:"pointer" as const, padding:"0.5rem 0.8rem", borderRadius:"3px", border:`1px solid ${a ? C : "#1e1e1e"}`, background: a ? "#C9A84C15" : "#0d0d0d", color: a ? C : "#444", fontFamily:"inherit", fontSize:"0.72rem", flex:1, textAlign:"center" as const });
  const row = (a: boolean) => ({ cursor:"pointer" as const, display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.65rem 1rem", border:`1px solid ${a ? "#C9A84C30" : "#1a1a1a"}`, borderRadius:"3px", background: a ? "#C9A84C08" : "transparent", color: a ? "#ccc" : "#555", fontSize:"0.78rem", userSelect:"none" as const });
  const box = (a: boolean) => ({ width:"13px", height:"13px", border:`1px solid ${a ? C : "#2a2a2a"}`, borderRadius:"2px", display:"inline-flex", alignItems:"center", justifyContent:"center", background: a ? C : "transparent", color:"#000", fontSize:"0.65rem", flexShrink:0 as const });

  return (
    <div style={{ minHeight:"100vh", background:"#070709", fontFamily:"'DM Mono','Courier New',monospace", color:"#d0d0d0", padding:"2rem 1.5rem", maxWidth:"460px", margin:"0 auto" }}>
      <div style={{ marginBottom:"2.5rem" }}>
        <div style={{ fontSize:"0.55rem", letterSpacing:"0.45em", color:"#2a2a2a", marginBottom:"0.6rem" }}>PE26</div>
        <div style={{ display:"flex", alignItems:"baseline" }}>
          <span style={{ fontSize:"2rem", fontWeight:"900", color:"#fff", letterSpacing:"-0.03em" }}>ALAYO</span>
          <span style={{ fontSize:"2rem", fontWeight:"900", color:C, letterSpacing:"-0.03em" }}>MIX</span>
        </div>
        <div style={{ fontSize:"0.58rem", letterSpacing:"0.3em", color:"#2a2a2a", marginTop:"0.2rem" }}>MIXING ENGINEER</div>
        <div style={{ width:"32px", height:"1px", background:C, marginTop:"0.9rem" }} />
      </div>

      <section style={{ marginBottom:"1.8rem" }}>
        <div style={{ fontSize:"0.55rem", letterSpacing:"0.35em", color:"#333", marginBottom:"0.6rem" }}>PAQUETE</div>
        <div style={{ display:"flex", gap:"0.4rem", marginBottom:"1rem" }}>
          {Object.entries(TIERS).map(([k, v]) => <button key={k} style={btn(tier===k)} onClick={() => { setTier(k); setStems(false); }}>{v.label}</button>)}
        </div>
        <div style={{ border:"1px solid #1a1a1a", borderRadius:"4px", padding:"1rem", background:"#0a0a0c" }}>
          <div style={{ color:"#888", marginBottom:"0.6rem", fontSize:"0.7rem" }}>{t.desc}</div>
          <div style={{ color:"#555", fontSize:"0.68rem" }}>✓ {t.revisions} revisiones incluidas</div>
          {t.perks.map(p => <div key={p} style={{ color:"#555", fontSize:"0.68rem" }}>✓ {p}</div>)}
          <div style={{ marginTop:"0.8rem", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:"0.6rem", color:"#2a2a2a", letterSpacing:"0.2em" }}>BASE / CANCIÓN</span>
            <span style={{ color:C, fontSize:"1rem" }}>${t.price}</span>
          </div>
        </div>
      </section>

      <section style={{ marginBottom:"1.8rem" }}>
        <div style={{ fontSize:"0.55rem", letterSpacing:"0.35em", color:"#333", marginBottom:"0.6rem" }}>FORMATO</div>
        <div style={{ display:"flex", gap:"0.4rem" }}>
          {FORMATS.map(f => <button key={f.id} style={btn(format===f.id)} onClick={() => setFormat(f.id)}>{f.label}{f.tracks ? ` · ${f.tracks}` : ""}</button>)}
        </div>
        {format === "custom" && (
          <div style={{ marginTop:"0.8rem", display:"flex", alignItems:"center", gap:"1rem" }}>
            <span style={{ fontSize:"0.7rem", color:"#444" }}>N° de canciones</span>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <button onClick={() => setCt(Math.max(1, ct-1))} style={{ background:"#111", border:"1px solid #222", color:"#aaa", width:"28px", height:"28px", borderRadius:"3px", cursor:"pointer" }}>−</button>
              <span style={{ minWidth:"24px", textAlign:"center", color:C }}>{ct}</span>
              <button onClick={() => setCt(ct+1)} style={{ background:"#111", border:"1px solid #222", color:"#aaa", width:"28px", height:"28px", borderRadius:"3px", cursor:"pointer" }}>+</button>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginBottom:"1.8rem", display:"flex", flexDirection:"column", gap:"0.45rem" }}>
        <div style={{ fontSize:"0.55rem", letterSpacing:"0.35em", color:"#333", marginBottom:"0.2rem" }}>ADD-ONS</div>
        {t.includesStems
          ? <div style={{ ...row(false), opacity:0.4, cursor:"default" }}><span style={box(true)}>✓</span><span style={{ flex:1 }}>Stems</span><span style={{ fontSize:"0.7rem", color:"#C9A84C40" }}>incluido</span></div>
          : <div style={row(stems)} onClick={() => setStems(!stems)}><span style={box(stems)}>{stems?"✓":""}</span><span style={{ flex:1 }}>Stems</span><span style={{ fontSize:"0.7rem", color: stems ? C : "#333" }}>+${S}/song</span></div>
        }
        <div style={row(master)} onClick={() => setMaster(!master)}><span style={box(master)}>{master?"✓":""}</span><span style={{ flex:1 }}>Mastering</span><span style={{ fontSize:"0.7rem", color: master ? C : "#333" }}>+${M}/song</span></div>
        <div style={row(rush)} onClick={() => setRush(!rush)}><span style={box(rush)}>{rush?"✓":""}</span><span style={{ flex:1 }}>Rush / Entrega urgente</span><span style={{ fontSize:"0.7rem", color: rush ? C : "#333" }}>+30%</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.65rem 1rem", border:"1px solid #1a1a1a", borderRadius:"3px" }}>
          <span style={{ flex:1, fontSize:"0.78rem", color: revs > 0 ? "#ccc" : "#555" }}>Revisiones adicionales</span>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <button onClick={() => setRevs(Math.max(0, revs-1))} style={{ background:"#111", border:"1px solid #222", color:"#aaa", width:"26px", height:"26px", borderRadius:"3px", cursor:"pointer" }}>−</button>
            <span style={{ minWidth:"20px", textAlign:"center", color: revs > 0 ? C : "#444" }}>{revs}</span>
            <button onClick={() => setRevs(revs+1)} style={{ background:"#111", border:"1px solid #222", color:"#aaa", width:"26px", height:"26px", borderRadius:"3px", cursor:"pointer" }}>+</button>
          </div>
          <span style={{ fontSize:"0.7rem", color: revs > 0 ? C : "#333", minWidth:"65px", textAlign:"right" }}>+${R}/ronda</span>
        </div>
      </section>

      <div style={{ border:"1px solid #C9A84C20", borderRadius:"4px", padding:"1.5rem", background:"#0a0a0c", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:`linear-gradient(90deg, transparent, ${C}, transparent)` }} />
        <button onClick={() => setOpen(!open)} style={{ background:"none", border:"none", color:"#2a2a2a", fontSize:"0.55rem", letterSpacing:"0.35em", cursor:"pointer", padding:0, marginBottom:"1.2rem", display:"block" }}>
          DESGLOSE {open ? "▲" : "▼"}
        </button>
        {open && (
          <div style={{ marginBottom:"1.2rem", display:"flex", flexDirection:"column", gap:"0.4rem" }}>
            {[
              { label:`${t.label} × ${tracks}`, val:t.price * tracks },
              (!t.includesStems && stems) ? { label:`Stems × ${tracks}`, val: S * tracks } : null,
              master ? { label:`Mastering × ${tracks}`, val: M * tracks } : null,
              revs > 0 ? { label:`Revisiones extra × ${revs}`, val: revs * R } : null,
              disc ? { label:"Descuento proyecto (10%)", val:-discount, discount:true } : null,
              rush ? { label:"Rush (30%)", val: rushFee } : null,
            ].filter(Boolean).map((item: any) => (
              <div key={item.label} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem" }}>
                <span style={{ color: item.discount ? C : "#444" }}>{item.label}</span>
                <span style={{ color: item.discount ? C : "#666" }}>{item.discount ? `-$${discount}` : `$${item.val}`}</span>
              </div>
            ))}
            <div style={{ height:"1px", background:"#161616", margin:"0.4rem 0" }} />
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem" }}>
              <div style={{ fontSize:"0.55rem", letterSpacing:"0.35em", color:"#2a2a2a" }}>TOTAL ESTIMADO</div>
              {disc && <span style={{ fontSize:"0.55rem", background:"#C9A84C20", color:C, border:"1px solid #C9A84C40", borderRadius:"2px", padding:"0.1rem 0.4rem" }}>−10% PROYECTO</span>}
            </div>
            <div style={{ fontSize:"2.8rem", fontWeight:"bold", color:C, letterSpacing:"-0.03em" }}>${total.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:"right", fontSize:"0.65rem", color:"#2a2a2a", lineHeight:1.8 }}>
            <div>USD</div>
            <div>{tracks} {tracks === 1 ? "canción" : "canciones"}</div>
            <div>{t.revisions} rev. incl.</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop:"1rem", fontSize:"0.6rem", color:"#1e1e1e", lineHeight:1.6 }}>* Tarifas en USD. Rush aplica sobre el subtotal total del proyecto.</div>
    </div>
  );
}
