// NLC TPS-II AI Agent — React Frontend (Full Version)
import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const INITIAL_UNITS = [
  { id: 1, status: "RUNNING",  gen: 185, eff: 85, steamTemp: 532, faults: [{ type: "warn", label: "1 Warn" }] },
  { id: 2, status: "RUNNING",  gen: 210, eff: 87, steamTemp: 537, faults: [{ type: "warn", label: "1 Warn" }, { type: "crit", label: "1 Crit" }] },
  { id: 3, status: "WARNING",  gen: 200, eff: 83, steamTemp: 541, faults: [{ type: "crit", label: "1 Crit" }, { type: "warn", label: "1 Warn" }] },
  { id: 4, status: "RUNNING",  gen: 215, eff: 88, steamTemp: 533, faults: [{ type: "ok",   label: "All Clear" }] },
  { id: 5, status: "SHUTDOWN", gen: 0,   eff: 0,  steamTemp: 0,   faults: [], maintenance: "Planned PM" },
  { id: 6, status: "CRITICAL", gen: 175, eff: 79, steamTemp: 528, faults: [{ type: "crit", label: "Immediate Action" }] },
  { id: 7, status: "RUNNING",  gen: 195, eff: 86, steamTemp: 531, faults: [{ type: "warn", label: "1 Warn" }] },
];

const ACTIVE_FAULTS = [
  { id: 1, unit: 6, title: "Unit 6 — Turbine Bearing Temp High", detail: "92°C — Trip 95°C — Check lube oil cooler",      severity: "CRITICAL", time: "U6 · 07:51" },
  { id: 2, unit: 2, title: "Unit 2 — CEP Motor Overload Trip",   detail: "Seal water restored — Monitor for recurrence",  severity: "OPEN",     time: "U2 · 08:05" },
  { id: 3, unit: 3, title: "Unit 3 — Steam Temp High Alarm",     detail: "541°C — Check attemperator spray flow",          severity: "WARNING",  time: "U3 · 08:39" },
  { id: 4, unit: 1, title: "Unit 1 — PA Fan Bearing Vibration",  detail: "5.4 mm/s — Threshold 7 mm/s — Monitor",         severity: "MONITOR",  time: "U1 · 07:34" },
  { id: 5, unit: 6, title: "Unit 6 — ID Fan VFD Alarm",          detail: "Cooling fan fault — Check VFD panel",            severity: "WARNING",  time: "U6 · 08:10" },
  { id: 6, unit: 4, title: "Unit 4 — Drum Level Low Alarm",      detail: "BFP speed increased — Level restored",           severity: "CLOSED",   time: "U4 · Yesterday" },
  { id: 7, unit: 7, title: "Unit 7 — CW Pump Bearing Temp",      detail: "Greased — Temp normal at 48°C",                  severity: "CLOSED",   time: "U7 · Yesterday" },
];

// ─── AI Knowledge Base ───────────────────────────────────────
const getSmartReply = (q) => {
  const t = q.toLowerCase();

  // DGM / CSC DGM profile
  if (t.includes("csc dgm") || t.includes("computer science dgm") || t.includes("cse dgm") || t.includes("velmurugan") || t.includes("dgm யாரு") || t.includes("dgm பேரு") || t.includes("our dgm") || t.includes("நம்ம dgm"))
    return `👤 CSC Division — Deputy General Manager\n` +
      `${"─".repeat(42)}\n` +
      `Name     : Velmurugan Utthandy\n` +
      `Position : Deputy General Manager (DGM)\n` +
      `Division : Computer Science (CSC) · NLC TPS-II\n` +
      `Location : Cuddalore, Tamil Nadu, India\n\n` +
      `💼 Career at NLC India Limited\n` +
      `${"─".repeat(42)}\n` +
      `• Joined NLC India Limited — July 1987\n` +
      `• Total Service: 38 years 9 months (Full-time)\n` +
      `• Designation: Deputy General Manager\n` +
      `• Heads the Computer Science (CSC) Division\n` +
      `  at NLC Thermal Power Station II\n` +
      `• Oversees all IT, ERP, SCADA & digital\n` +
      `  systems across TPS-II operations\n\n` +
      `🎓 Education\n` +
      `${"─".repeat(42)}\n` +
      `• PG Diploma — Computer Science\n` +
      `  Madras University\n` +
      `  Jun 1994 – Dec 1995\n` +
      `  Grade: First Class with Distinction ⭐\n\n` +
      `• B.E. — Electronics & Instrumentation Engg.\n` +
      `  Annamalai University, Annamalainagar\n` +
      `  Jun 1989 – Jul 1993\n` +
      `  Grade: First Class with Distinction ⭐\n\n` +
      `🏅 Certification\n` +
      `${"─".repeat(42)}\n` +
      `• Certified Cyber Warrior\n\n` +
      `📈 Career Timeline\n` +
      `${"─".repeat(42)}\n` +
      `1987 — Joined NLC India Limited\n` +
      `1989 – 1993 — B.E. E&I, Annamalai University\n` +
      `1994 – 1995 — PG Diploma CS, Madras University\n` +
      `1987 – Now  — 38+ years continuous NLC service\n` +
      `Present     — DGM, CSC Division, NLC TPS-II\n\n` +
      `Sir is one of NLC's most experienced officers\n` +
      `with nearly 4 decades of dedicated service. 🙏`;

  // Tamil greetings / help
  if (t.includes("வணக்கம்") || t.includes("vanakkam") || t.includes("enna panalam") || t.includes("என்ன"))
    return "வணக்கம்! நான் NLC TPS-II AI Agent.\n\nநான் உதவக்கூடியவை:\n• யூனிட் fault diagnosis\n• Steam temp, bearing, vibration alarms\n• Shift handover report\n• Equipment procedures\n• Efficiency analysis\n\nதமிழிலோ English-லோ கேளுங்கள்!";

  // Tamil fault queries
  if (t.includes("யூனிட் 6") || (t.includes("unit 6") && (t.includes("bearing") || t.includes("shutdown") || t.includes("critical") || t.includes("trip") || t.includes("turbine"))))
    return "⚠️ Unit 6 — Turbine Bearing CRITICAL (92°C, trip limit: 95°C)\n\nImmediate Actions:\n1. Lube oil pressure check — >1.2 kg/cm² வேண்டும்\n2. CW flow valve to oil cooler — fully open பண்ணுங்க\n3. Load 150 MW-க்கு குறைக்கவும் (temp 93°C தாண்டினால்)\n4. 94°C reached — controlled shutdown initiate பண்ணுங்க\n5. DGM-ஐ inform பண்ணி shift register-ல் log பண்ணுங்க\n6. Every 15 min reading எடுங்க";

  if (t.includes("unit 3") || t.includes("steam temp") || t.includes("attemperator") || t.includes("ஸ்டீம்"))
    return "Unit 3 — Steam Temp High (541°C, limit: 538°C)\n\nAction Plan:\n1. Attemperator spray flow 10–15% அதிகரிக்கவும்\n2. Spray control valve CV-301 position verify பண்ணுங்க\n3. Mill-C coal feeder speed 5% குறைக்கவும்\n4. SH outlet temp every 10 min monitor பண்ணுங்க\n5. 543°C தாண்டினால் — load 20 MW குறைக்கவும்\n6. Target: 30 min-ல் 538°C-க்கு கீழே கொண்டு வரவும்";

  if (t.includes("pa fan") || (t.includes("fan") && (t.includes("vibration") || t.includes("vib"))))
    return "PA Fan Bearing Vibration — Unit 1 (5.4 mm/s)\n\nStatus: MONITOR (threshold: 7 mm/s)\n\nActions:\n1. Bearing temp check — <80°C இருக்கணும்\n2. Coupling alignment inspect பண்ணுங்க\n3. Last greasing >7 days ஆனால் — grease பண்ணுங்க\n4. Impeller-ல் coal dust accumulation check பண்ணுங்க\n5. 6.5 mm/s தாண்டினால் — standby PA fan ready வையுங்க\n6. Every 30 min readings log பண்ணுங்க";

  if (t.includes("cep") || (t.includes("motor") && t.includes("trip")))
    return "Unit 2 — CEP Motor Overload Trip\n\nRoot Cause: Seal water pressure drop → motor overload\n\nRecovery:\n1. Seal water pressure check — min 2.5 kg/cm²\n2. 10 min cooling-க்கு பிறகு overload relay reset பண்ணுங்க\n3. Manual mode-ல் CEP start பண்ணி current draw check பண்ணுங்க\n4. Again trip ஆனால் — mechanical seal inspect பண்ணுங்க\n5. Standby CEP auto-standby-ல் வையுங்க";

  if (t.includes("id fan") || t.includes("vfd"))
    return "Unit 6 — ID Fan VFD Alarm\n\nFault: VFD panel internal cooling fan failure\n\nSteps:\n1. VFD panel door open பண்ணி internal cooling fan check பண்ணுங்க\n2. Panel temp — <45°C இருக்கணும்\n3. Panel temp >50°C ஆனால் — ID fan speed 10% குறைக்கவும்\n4. Cooling fan replace பண்ணுங்க (E&I store, Part No. VFD-CF-06)\n5. Fan replacement-க்கு பிறகு VFD alarm reset பண்ணுங்க\n6. VFD thermal protection bypass பண்ணாதீங்க";

  if (t.includes("drum level") || t.includes("bfp"))
    return "Unit 4 — Drum Level Low Alarm (CLOSED ✅)\n\nResolved: BFP speed increased, level restored (+25mm NWL)\n\nPreventive Checks:\n1. BFP recirculation valve — passing இல்லையா check பண்ணுங்க\n2. Drum level transmitter LT-401 calibration verify பண்ணுங்க\n3. Feed control valve FCV-401 response check பண்ணுங்க\n4. Normal drum level: ±0 to +50mm NWL";

  if (t.includes("cw pump") || t.includes("cooling water") || t.includes("unit 7"))
    return "Unit 7 — CW Pump Bearing Temp (CLOSED ✅)\n\nResolved: Bearing greased, temp normal at 48°C\n\nUnit 7 Status:\n• Generation: 195 MW ✅\n• Efficiency: 86% ✅\n• Steam Temp: 531°C ✅\n• 1 Warning (minor) — monitoring\n\nNo immediate action required for Unit 7.";

  if (t.includes("unit 1") && !t.includes("pa fan"))
    return "Unit 1 — Status: RUNNING ✅\n\n• Generation: 185 MW\n• Efficiency: 85%\n• Steam Temp: 532°C (normal)\n• PA Fan vibration: 5.4 mm/s (MONITOR)\n\nAction: PA fan bearing vibration monitoring தொடரவும். 30 min interval-ல் readings எடுங்க.";

  if (t.includes("unit 2") && !t.includes("cep"))
    return "Unit 2 — Status: RUNNING ✅\n\n• Generation: 210 MW\n• Efficiency: 87%\n• Steam Temp: 537°C (normal)\n• CEP trip: Recovered, monitoring\n• 1 Warning + 1 Critical (CEP related)\n\nCEP standby auto-standby-ல் வையுங்க.";

  if (t.includes("unit 4") && !t.includes("drum"))
    return "Unit 4 — Status: RUNNING ✅ (Best performing unit)\n\n• Generation: 215 MW\n• Efficiency: 88% (highest today)\n• Steam Temp: 533°C (normal)\n• All Clear — no active faults\n\nUnit 4 station-ல் best efficiency unit today.";

  if (t.includes("unit 5") || t.includes("shutdown") || t.includes("maintenance"))
    return "Unit 5 — Status: SHUTDOWN (Planned PM)\n\n• Turbine overhaul in progress\n• Expected return: 3 days\n• Maintenance team: Mechanical + E&I\n• Permit to Work (PTW): Active\n\nPlanned PM checklist:\n1. Turbine blade inspection\n2. Bearing replacement\n3. Seal replacement\n4. Alignment check\n5. Trial run before synchronization";

  // Turbine general
  if (t.includes("turbine") && !t.includes("unit 6"))
    return "Turbine Parameters — Normal Range (NLC TPS-II):\n• Bearing temp: <85°C (trip at 95°C)\n• Lube oil pressure: >1.2 kg/cm²\n• Vibration: <7 mm/s\n• Speed: 3000 RPM (50 Hz)\n• Exhaust pressure: <0.1 kg/cm²\n• Gland steam pressure: 0.05–0.1 kg/cm²\n\nCurrent concern: Unit 6 bearing at 92°C — critical monitoring.";

  // Generator
  if (t.includes("generator") || t.includes("gen") || t.includes("stator") || t.includes("rotor"))
    return "Generator Parameters — NLC TPS-II:\n• Stator temp: <120°C\n• Rotor temp: <130°C\n• Hydrogen pressure: 3.5 kg/cm² (H2 cooled)\n• Stator water flow: Normal\n• Power factor: 0.85 lagging\n• Rated capacity: 250 MW per unit\n\nAll generators currently within normal limits. Unit 5 offline for PM.";

  // Coal mill
  if (t.includes("mill") || t.includes("coal") || t.includes("pulverizer"))
    return "Coal Mill / Pulverizer — NLC TPS-II:\n• Mills per unit: 5 (A, B, C, D, E)\n• Normal operation: 3–4 mills running\n• Mill outlet temp: 65–75°C\n• PA fan pressure: 800–1000 mmWC\n• Coal fineness: >70% through 200 mesh\n\nUnit 3 concern: Mill-C feeder speed reduced to control steam temp.\nUnit 6: Mill load reduced due to bearing issue.";

  // Ash handling
  if (t.includes("ash") || t.includes("esp") || t.includes("electrostatic"))
    return "Ash Handling System — NLC TPS-II:\n• ESP efficiency: >99.5%\n• Fly ash collection: 6 fields per unit\n• Bottom ash: Submerged scraper conveyor\n• Ash pond: Level normal\n• Stack emission: Within CPCB norms (<100 mg/Nm³)\n\nAll ESP fields operational. No ash handling alarms currently.";

  // Cooling tower
  if (t.includes("cooling tower") || t.includes("ct") || t.includes("condenser"))
    return "Cooling Tower / Condenser — NLC TPS-II:\n• CW inlet temp: 32°C (normal)\n• CW outlet temp: 42°C (normal)\n• Condenser vacuum: 720–730 mmHg\n• CW flow: Normal (all 7 CW pumps)\n• Cooling tower fans: All running\n\nUnit 7 CW pump bearing recently greased — temp normal at 48°C.";

  // Transformer
  if (t.includes("transformer") || t.includes("gt") || t.includes("uab") || t.includes("station transformer"))
    return "Transformer Monitoring — NLC TPS-II:\n• GT-1 to GT-7: Oil temp <85°C ✅\n• Winding temp: <95°C ✅\n• Buchholz relay: No gas accumulation ✅\n• Tap changer: Auto mode ✅\n• Station transformer: Normal\n• UAT (Unit Auxiliary Transformer): Normal\n\nLast oil BDV test: >60 kV (within limits). No active transformer alarms.";

  // Boiler
  if (t.includes("boiler") || t.includes("furnace") || t.includes("superheater") || t.includes("reheater"))
    return "Boiler Parameters — Normal Range:\n• Drum pressure: 150–155 kg/cm²\n• SH outlet temp: 535–538°C\n• RH outlet temp: 535–540°C\n• Drum level: ±50mm NWL\n• Furnace draft: -5 to -8 mmWC\n• O2 at APH outlet: 3.5–4.5%\n• Feed water temp: 240–250°C\n\n⚠️ Unit 3 SH outlet: 541°C — action in progress.";

  // Emergency shutdown
  if (t.includes("emergency") || t.includes("emergency shutdown") || t.includes("esd"))
    return "Emergency Shutdown Procedure — NLC TPS-II:\n\n1. Press EMERGENCY STOP on UCB\n2. Trip turbine manually if auto-trip fails\n3. Close main steam stop valve (MSV)\n4. Initiate boiler MFT (Master Fuel Trip)\n5. Start boiler purge (5 min, >30% air flow)\n6. Isolate all fuel inputs\n7. Maintain BFP for drum cooling\n8. Notify Shift Charge Engineer + DGM immediately\n9. Log time and reason in shift register\n10. Do NOT restart without DGM approval";

  // Startup sequence
  if (t.includes("startup") || t.includes("start up") || t.includes("synchronize") || t.includes("sync"))
    return "Unit Startup Sequence — NLC TPS-II:\n\n1. Pre-startup checks complete (PTW cleared)\n2. Boiler light-up (HFO ignition)\n3. Drum pressure raise to 10 kg/cm²\n4. Turbine rolling at 500 RPM\n5. Critical speed (1400–1600 RPM) — pass quickly\n6. Rated speed: 3000 RPM\n7. Synchronization with grid\n8. Load raise: 50 → 100 → 150 → 200 MW\n9. Switch to coal firing at 100 MW\n10. Full load: 210–215 MW";

  // PTW / Permit to Work
  if (t.includes("ptw") || t.includes("permit") || t.includes("isolation"))
    return "Permit to Work (PTW) — NLC TPS-II:\n\nTypes:\n• Hot Work Permit — welding, grinding\n• Cold Work Permit — mechanical maintenance\n• Electrical Isolation Permit — HT/LT work\n• Confined Space Permit — vessel entry\n\nProcess:\n1. Issuing authority: Shift Charge Engineer\n2. Equipment isolation + LOTO (Lock Out Tag Out)\n3. Safety checks: Gas test, earthing, barriers\n4. Work completion → equipment handback\n5. PTW cancellation by issuing authority\n\nCurrent active PTW: Unit 5 turbine overhaul";

  // Efficiency / heat rate
  if (t.includes("efficiency") || t.includes("heat rate") || t.includes("performance"))
    return "Station Efficiency — Today's Summary:\n\nUnit 1: 85% | Unit 2: 87% | Unit 3: 83%\nUnit 4: 88% ⭐ | Unit 6: 79% ⚠️ | Unit 7: 86%\n\nStation Average: 85% (+0.8% vs yesterday)\n\nUnit 6 low efficiency: Reduced load due to bearing issue\nUnit 3 low efficiency: Steam temp control reducing output\n\nTarget: >87% for all running units\nHeat Rate target: <2450 kcal/kWh";

  // Shift report
  if (t.includes("report") || t.includes("shift") || t.includes("summary") || t.includes("handover") || t.includes("ரிப்போர்ட்"))
    return `📋 Shift B — Station Report\n${new Date().toLocaleDateString('en-IN', { weekday:'long', day:'2-digit', month:'short', year:'numeric' })}\n\n⚡ Generation: 1,180 MW (6/7 units, 84% capacity)\n🔴 CRITICAL: Unit 6 — Turbine bearing 92°C (action in progress)\n🟡 WARNING: Unit 3 — Steam temp 541°C (spray increased)\n🟠 OPEN: Unit 2 — CEP trip (recovered, monitoring)\n🔵 MONITOR: Unit 1 — PA fan vibration 5.4 mm/s\n⚫ SHUTDOWN: Unit 5 — Planned PM (turbine overhaul)\n✅ Units 4, 7 — Normal operation\n\nShift handover to Shift C at 22:00\nDGM informed of Unit 6 critical status.`;

  // All units summary
  if ((t.includes("all") || t.includes("எல்லா")) && (t.includes("unit") || t.includes("fault") || t.includes("summary") || t.includes("status")))
    return "All 7 Units — Live Status:\n\n🔴 Unit 6 — CRITICAL | 175 MW | Turbine bearing 92°C\n🟡 Unit 3 — WARNING  | 200 MW | Steam temp 541°C\n🟠 Unit 2 — RUNNING  | 210 MW | CEP trip recovered\n🔵 Unit 1 — RUNNING  | 185 MW | PA fan vibration monitor\n✅ Unit 4 — RUNNING  | 215 MW | All clear\n✅ Unit 7 — RUNNING  | 195 MW | Normal\n⚫ Unit 5 — SHUTDOWN | 0 MW   | Planned PM\n\nTotal: 1,180 MW | Open faults: 5";

  // Electrical
  if (t.includes("electrical") || t.includes("relay") || t.includes("protection") || t.includes("switchgear"))
    return "Electrical Protection — NLC TPS-II:\n• Generator protection: Differential, over-current, earth fault\n• Transformer protection: Buchholz, OTI, WTI, differential\n• Motor protection: Overload, single phasing, earth fault\n• Bus protection: Numerical relay (Micom/SEL)\n• Grid protection: Under/over frequency, voltage\n\nAll protection relays: Healthy ✅\nLast relay testing: As per annual schedule";

  // Water chemistry
  if (t.includes("water") || t.includes("chemistry") || t.includes("ph") || t.includes("conductivity"))
    return "Water Chemistry — NLC TPS-II:\n• Feed water pH: 9.0–9.5\n• Boiler water pH: 10.5–11.5\n• Conductivity: <0.3 μS/cm (feed water)\n• Dissolved O2: <7 ppb\n• Silica: <20 ppb\n• DM plant output: Normal\n\nAll water chemistry parameters within limits. Next sampling: Next shift.";

  // Hello / help
  if (t.includes("hello") || t.includes("hi") || t.includes("help") || t.includes("what can"))
    return "Hello! I am the NLC TPS-II AI Agent 🤖\n\nI can answer questions about:\n⚡ Equipment: Turbine, Boiler, Generator, PA/ID Fan, CEP, Transformer, Coal Mill, ESP, Cooling Tower\n🔧 Procedures: Emergency shutdown, Startup sequence, PTW/LOTO\n📊 Performance: Efficiency, heat rate, unit-wise status\n📋 Reports: Shift handover, fault summary, station report\n🌡️ Parameters: Normal ranges for all equipment\n\nTamil-லயும் கேக்கலாம்! Ask me anything.";

  // Default
  return `Query: "${q}"\n\nTry asking about:\n• "Unit 6 bearing status" / "யூனிட் 6 bearing"\n• "PA fan vibration fix"\n• "Emergency shutdown procedure"\n• "Generate shift report" / "shift report கொடு"\n• "All units status"\n• "Boiler parameters"\n• "Turbine startup sequence"\n• "Coal mill status"\n\nFor live AI (Ollama): run "ollama serve" + "ollama pull llama3"`;
};

// ─── Auth Hook ───────────────────────────────────────────────
function useAuth() {
  const [token] = useState(localStorage.getItem("nlc_token"));
  const logout = () => { localStorage.removeItem("nlc_token"); window.location.reload(); };
  const authFetch = (url, opts = {}) => {
    const t = localStorage.getItem("nlc_token");
    return fetch(`${API}${url}`, {
      ...opts,
      headers: { ...(t ? { Authorization: `Bearer ${t}` } : {}), "Content-Type": "application/json", ...opts.headers },
    });
  };
  return { token, logout, authFetch };
}

// ─── Helpers ─────────────────────────────────────────────────
const statusColor = (s) => ({ RUNNING: "#00E676", WARNING: "#FFD600", CRITICAL: "#FF1744", SHUTDOWN: "#90A4AE" }[s] || "#90A4AE");
const faultColor  = (s) => ({ CRITICAL: { bg: "#FF1744" }, OPEN: { bg: "#FF6D00" }, WARNING: { bg: "#FFD600" }, MONITOR: { bg: "#00B0FF" }, CLOSED: { bg: "#37474F" } }[s] || { bg: "#37474F" });

function Bar({ value, max = 100, color }) {
  return (
    <div style={{ height: 4, background: "#1E2A38", borderRadius: 2, overflow: "hidden", marginTop: 4 }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s" }} />
    </div>
  );
}

// ─── Login Screen ────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [empId, setEmpId]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const roles = ["Engineer / Officer", "Technician", "Management / DGM", "System Admin"];

  const handleLogin = async () => {
    if (!empId || !password || !role) { setError("Please fill all fields and select a role."); return; }
    setLoading(true); setError("");
    try {
      const form = new FormData();
      form.append("username", empId); form.append("password", password);
      const res = await fetch(`${API}/auth/login`, { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("nlc_token", data.access_token);
      onLogin(data.user);
    } catch { setError("Invalid Employee ID or password."); }
    finally { setLoading(false); }
  };

  const inp = { height: 40, border: "1px solid #1E3A5F", borderRadius: 8, padding: "0 12px",
    fontSize: 13, width: "100%", marginTop: 6, background: "#0A1628", color: "#E0E0E0", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0F1E30", borderRadius: 14, width: 400, overflow: "hidden", border: "1px solid #1E3A5F" }}>
        <div style={{ background: "linear-gradient(135deg,#0C447C,#0A2A50)", padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#4FC3F7", marginBottom: 6 }}>NEYVELI LIGNITE CORPORATION</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>NLC TPS-II</div>
          <div style={{ fontSize: 12, color: "#85B7EB", marginTop: 4 }}>AI Agent · CSE Division · Internal Only</div>
        </div>
        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: "#4FC3F7", letterSpacing: 1 }}>EMPLOYEE ID</label>
            <input value={empId} onChange={e => setEmpId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="e.g. admin" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: "#4FC3F7", letterSpacing: 1 }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: "#4FC3F7", letterSpacing: 1 }}>LOGIN AS</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              {roles.map(r => (
                <button key={r} onClick={() => setRole(r)} style={{ padding: "8px 6px", borderRadius: 8,
                  border: role === r ? "1.5px solid #4FC3F7" : "1px solid #1E3A5F",
                  background: role === r ? "#0C2A45" : "#0A1628", color: role === r ? "#4FC3F7" : "#607D8B",
                  fontSize: 11, fontWeight: role === r ? 600 : 400, cursor: "pointer" }}>{r}</button>
              ))}
            </div>
          </div>
          {error && <div style={{ fontSize: 12, color: "#FF5252" }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{ height: 44, background: loading ? "#1E3A5F" : "linear-gradient(90deg,#0C447C,#1565C0)",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
            {loading ? "AUTHENTICATING..." : "SECURE LOGIN"}
          </button>
          <button onClick={() => onLogin({ name: "Demo User", role: "Engineer", emp_id: "demo" })}
            style={{ height: 36, background: "transparent", color: "#546E7A", border: "1px solid #1E2A38",
              borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
            ⚡ Skip Login — Demo Mode
          </button>
          <div style={{ fontSize: 10, color: "#37474F", textAlign: "center" }}>NLC TPS-II internal use only · All activity is logged</div>
        </div>
      </div>
    </div>
  );
}

// ─── Unit Card ───────────────────────────────────────────────
function UnitCard({ unit }) {
  const isCritical = unit.status === "CRITICAL";
  const isWarning  = unit.status === "WARNING";
  const isShutdown = unit.status === "SHUTDOWN";
  return (
    <div style={{ background: "#0F1E30", border: `1px solid ${isCritical ? "#FF1744" : isWarning ? "#FFD600" : "#1E2A38"}`,
      borderRadius: 8, padding: "10px 12px",
      boxShadow: isCritical ? "0 0 12px rgba(255,23,68,0.2)" : isWarning ? "0 0 8px rgba(255,214,0,0.1)" : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#B0BEC5" }}>Unit {unit.id}</div>
        <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
          background: statusColor(unit.status) + "22", color: statusColor(unit.status), letterSpacing: 1 }}>{unit.status}</div>
      </div>
      {isShutdown ? (
        <div style={{ color: "#546E7A", fontSize: 11 }}>
          <div style={{ marginBottom: 4 }}>GENERATION <span style={{ float: "right" }}>—</span></div>
          <div style={{ marginBottom: 4 }}>EFFICIENCY  <span style={{ float: "right" }}>—</span></div>
          <div style={{ marginBottom: 8 }}>STEAM TEMP  <span style={{ float: "right" }}>—</span></div>
          <div style={{ fontSize: 10, color: "#4FC3F7" }}>MAINTENANCE — {unit.maintenance}</div>
        </div>
      ) : (
        <>
          {[
            { label: "GENERATION", val: `${unit.gen}`, unit: "MW", barVal: unit.gen, barMax: 250, color: "#4FC3F7" },
            { label: "EFFICIENCY",  val: `${unit.eff}`, unit: "%",  barVal: unit.eff, barMax: 100, color: "#00E676" },
            { label: "STEAM TEMP",  val: `${unit.steamTemp}`, unit: "°C", barVal: unit.steamTemp - 500, barMax: 60,
              color: unit.steamTemp >= 540 ? "#FF6D00" : "#FFD600", valColor: unit.steamTemp >= 540 ? "#FF6D00" : "#E0E0E0" },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#607D8B" }}>
                <span>{r.label}</span>
                <span style={{ color: r.valColor || "#E0E0E0", fontWeight: 600 }}>{r.val}<span style={{ fontSize: 9, color: "#607D8B" }}>{r.unit}</span></span>
              </div>
              <Bar value={r.barVal} max={r.barMax} color={r.color} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
            {unit.faults.map((f, i) => (
              <span key={i} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
                background: f.type === "crit" ? "#FF174422" : f.type === "warn" ? "#FFD60022" : "#00E67622",
                color:      f.type === "crit" ? "#FF5252"   : f.type === "warn" ? "#FFD600"   : "#00E676",
                border: `1px solid ${f.type === "crit" ? "#FF174444" : f.type === "warn" ? "#FFD60044" : "#00E67644"}` }}>{f.label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── AI Chat Panel ───────────────────────────────────────────
function ChatPanel({ authFetch }) {
  const [messages, setMessages] = useState([
    { role: "agent", text: "Station overview: 6 of 7 units online, total generation 1,180 MW.\n\n🔴 Unit 6 CRITICAL — turbine bearing 92°C (trip at 95°C)\n🟡 Unit 3 WARNING — steam temp 541°C approaching limit\n\nImmediate action recommended on both units.\nTamil-லயும் கேக்கலாம்! Ask me anything about NLC TPS-II." }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const quickQ = [
    "Unit 6 shutdown procedure", "Unit 3 steam temp fix",
    "PA fan vibration fix",      "CEP motor trip recovery",
    "Generate shift report",     "All units fault summary",
    "Emergency shutdown steps",  "Turbine startup sequence",
    "Boiler parameters",         "Coal mill status",
    "யூனிட் 6 bearing status",   "Shift report கொடு",
  ];

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput(""); setLoading(true);
    // Small delay for realistic feel
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await authFetch("/ai/chat", { method: "POST", body: JSON.stringify({ message: q }) });
      const data = await res.json();
      const reply = (data.reply && !data.reply.startsWith("[Demo mode]")) ? data.reply : getSmartReply(q);
      setMessages(m => [...m, { role: "agent", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "agent", text: getSmartReply(q) }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div style={{ background: "#0F1E30", border: "1px solid #1E2A38", borderRadius: 10,
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", borderBottom: "1px solid #1E2A38",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#B0BEC5" }}>AI Agent — Station Intelligence</div>
        <div style={{ display: "flex", gap: 5 }}>
          {[["Llama 3","#4FC3F7"], ["Offline","#FF5252"], ["Secure","#00E676"]].map(([t,c]) => (
            <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
              background: c + "22", color: c, border: `1px solid ${c}44` }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%",
              background: m.role === "agent" ? "#0C447C" : "#1E3A5F",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: m.role === "agent" ? "#4FC3F7" : "#90CAF9", flexShrink: 0 }}>
              {m.role === "agent" ? "AI" : "ME"}
            </div>
            <div style={{ maxWidth: "82%", padding: "8px 11px", borderRadius: 8,
              background: m.role === "user" ? "#0C2A45" : "#162030",
              color: "#CFD8DC", fontSize: 11, lineHeight: 1.7,
              border: `1px solid ${m.role === "user" ? "#1E3A5F" : "#1E2A38"}`,
              whiteSpace: "pre-line" }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ fontSize: 11, color: "#546E7A", paddingLeft: 34 }}>AI Agent is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "5px 12px", display: "flex", gap: 5, flexWrap: "wrap", borderTop: "1px solid #1E2A38", flexShrink: 0 }}>
        {quickQ.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            style={{ fontSize: 9, padding: "3px 9px", borderRadius: 4,
              border: "1px solid #1E3A5F", background: "#0A1628", color: "#607D8B", cursor: "pointer" }}>{q}</button>
        ))}
      </div>

      <div style={{ padding: "8px 12px", display: "flex", gap: 8, borderTop: "1px solid #1E2A38", flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask in English or Tamil — fault, procedure, report..."
          style={{ flex: 1, height: 34, border: "1px solid #1E3A5F", borderRadius: 6,
            padding: "0 11px", fontSize: 11, background: "#0A1628", color: "#CFD8DC", outline: "none" }} />
        <button onClick={() => sendMessage()}
          style={{ width: 34, height: 34, background: "#0C447C", color: "#4FC3F7",
            border: "none", borderRadius: 6, fontSize: 18, cursor: "pointer", fontWeight: 700 }}>›</button>
      </div>
    </div>
  );
}

// ─── Active Faults Panel ─────────────────────────────────────
function FaultsPanel() {
  const [faults, setFaults] = useState(ACTIVE_FAULTS);
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", "CRITICAL", "WARNING", "OPEN", "MONITOR", "CLOSED"];
  const shown = filter === "ALL" ? faults : faults.filter(f => f.severity === filter);

  return (
    <div style={{ background: "#0F1E30", border: "1px solid #1E2A38", borderRadius: 10,
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", borderBottom: "1px solid #1E2A38",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#B0BEC5" }}>Active Faults — All 7 Units</div>
        <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4,
          background: "#FF174422", color: "#FF5252", border: "1px solid #FF174444" }}>
          {faults.filter(f => f.severity !== "CLOSED").length} Open
        </span>
      </div>
      <div style={{ padding: "5px 12px", display: "flex", gap: 4, flexWrap: "wrap", borderBottom: "1px solid #1E2A38", flexShrink: 0 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, cursor: "pointer",
              background: filter === f ? faultColor(f).bg + "33" : "#0A1628",
              color: filter === f ? faultColor(f).bg : "#546E7A",
              border: `1px solid ${filter === f ? faultColor(f).bg + "66" : "#1E2A38"}` }}>{f}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {shown.map(f => {
          const { bg } = faultColor(f.severity);
          return (
            <div key={f.id} style={{ padding: "9px 14px", borderBottom: "1px solid #0F1E30",
              background: "#0A1628", display: "flex", gap: 10, alignItems: "flex-start",
              opacity: f.severity === "CLOSED" ? 0.5 : 1 }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: bg, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#CFD8DC", marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: 10, color: "#546E7A", lineHeight: 1.5 }}>{f.detail}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3,
                  background: bg + "33", color: bg, border: `1px solid ${bg}44`,
                  fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>{f.severity}</div>
                <div style={{ fontSize: 9, color: "#37474F" }}>{f.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shift Log Tab ───────────────────────────────────────────
function ShiftLogTab({ authFetch }) {
  const [logs, setLogs] = useState([
    { id: 1, time: "06:00", event: "Shift B commenced. All units checked. Unit 5 under PM.", tag: "OK",    unit: "Station", logged_by: "Shift Engineer" },
    { id: 2, time: "07:34", event: "Unit 1 PA fan bearing vibration noted — 5.4 mm/s. Monitoring started.", tag: "Warn",  unit: "Unit 1",   logged_by: "AE Mechanical" },
    { id: 3, time: "07:51", event: "Unit 6 turbine bearing temp rising — 88°C. Lube oil checked.", tag: "Alert", unit: "Unit 6",   logged_by: "AE Mechanical" },
    { id: 4, time: "08:05", event: "Unit 2 CEP motor tripped on overload. Seal water restored. Standby CEP started.", tag: "Alert", unit: "Unit 2", logged_by: "AE Electrical" },
    { id: 5, time: "08:10", event: "Unit 6 ID fan VFD cooling fan alarm. Panel temp 47°C. Spare fan arranged.", tag: "Warn",  unit: "Unit 6",   logged_by: "AE E&I" },
    { id: 6, time: "08:39", event: "Unit 3 steam temp 541°C. Attemperator spray increased by 12%.", tag: "Alert", unit: "Unit 3",   logged_by: "AE Operations" },
    { id: 7, time: "09:15", event: "Unit 6 bearing temp now 92°C. DGM informed. Load reduced to 175 MW.", tag: "Alert", unit: "Unit 6",   logged_by: "Shift Charge Engr" },
    { id: 8, time: "10:00", event: "Unit 4 drum level low alarm — BFP speed increased. Level restored.", tag: "OK",    unit: "Unit 4",   logged_by: "AE Operations" },
  ]);
  const [event, setEvent]   = useState("");
  const [tag, setTag]       = useState("OK");
  const [unit, setUnit]     = useState("Station");
  const [msg, setMsg]       = useState("");

  const addLog = () => {
    if (!event.trim()) { setMsg("Event description required."); return; }
    const entry = { id: logs.length + 1, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      event, tag, unit, logged_by: "Current User" };
    setLogs(l => [...l, entry]);
    setEvent(""); setMsg("✅ Log entry added.");
    setTimeout(() => setMsg(""), 2000);
  };

  const tagColor = { OK: "#00E676", Warn: "#FFD600", Alert: "#FF5252" };

  return (
    <div style={{ padding: "14px 16px", height: "100%", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
      {/* Add entry */}
      <div style={{ background: "#0F1E30", border: "1px solid #1E2A38", borderRadius: 10, padding: "12px 14px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#B0BEC5", marginBottom: 10 }}>Add Shift Log Entry</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: 8, marginBottom: 8 }}>
          <input value={event} onChange={e => setEvent(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addLog()}
            placeholder="Event description..."
            style={{ height: 34, border: "1px solid #1E3A5F", borderRadius: 6, padding: "0 10px",
              fontSize: 11, background: "#0A1628", color: "#CFD8DC", outline: "none" }} />
          <select value={unit} onChange={e => setUnit(e.target.value)}
            style={{ height: 34, border: "1px solid #1E3A5F", borderRadius: 6, padding: "0 8px",
              fontSize: 11, background: "#0A1628", color: "#CFD8DC", outline: "none" }}>
            {["Station","Unit 1","Unit 2","Unit 3","Unit 4","Unit 5","Unit 6","Unit 7"].map(u => <option key={u}>{u}</option>)}
          </select>
          <select value={tag} onChange={e => setTag(e.target.value)}
            style={{ height: 34, border: "1px solid #1E3A5F", borderRadius: 6, padding: "0 8px",
              fontSize: 11, background: "#0A1628", color: "#CFD8DC", outline: "none" }}>
            <option>OK</option><option>Warn</option><option>Alert</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={addLog}
            style={{ padding: "6px 18px", background: "#0C447C", color: "#4FC3F7",
              border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            + Add Entry
          </button>
          {msg && <span style={{ fontSize: 11, color: "#00E676" }}>{msg}</span>}
        </div>
      </div>

      {/* Log list */}
      <div style={{ flex: 1, background: "#0F1E30", border: "1px solid #1E2A38", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 14px", borderBottom: "1px solid #1E2A38", fontSize: 11, fontWeight: 700, color: "#B0BEC5", flexShrink: 0 }}>
          Shift B Log — {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {[...logs].reverse().map(l => (
            <div key={l.id} style={{ padding: "8px 14px", borderBottom: "1px solid #0F1E30",
              background: "#0A1628", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ fontSize: 10, color: "#546E7A", width: 38, flexShrink: 0, paddingTop: 1 }}>{l.time}</div>
              <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", background: tagColor[l.tag] || "#546E7A", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#CFD8DC", lineHeight: 1.5 }}>{l.event}</div>
                <div style={{ fontSize: 9, color: "#546E7A", marginTop: 2 }}>{l.unit} · {l.logged_by}</div>
              </div>
              <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, flexShrink: 0,
                background: (tagColor[l.tag] || "#546E7A") + "22", color: tagColor[l.tag] || "#546E7A",
                border: `1px solid ${(tagColor[l.tag] || "#546E7A")}44` }}>{l.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Reports Tab ─────────────────────────────────────────────
function ReportsTab({ authFetch }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("shift");

  const reports = {
    shift: () => `SHIFT HANDOVER REPORT — NLC TPS-II CSE DIVISION
${"=".repeat(55)}
Date    : ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
Shift   : B (14:00 – 22:00)
Prepared: Shift Charge Engineer

GENERATION SUMMARY
${"─".repeat(40)}
Total Generation  : 1,180 MW (6/7 units)
Rated Capacity    : 1,500 MW
Capacity Factor   : 84%
Unit 5            : Shutdown (Planned PM – Turbine overhaul)

UNIT-WISE STATUS
${"─".repeat(40)}
Unit 1 : RUNNING  | 185 MW | Eff: 85% | Steam: 532°C | PA fan vib: 5.4 mm/s (MONITOR)
Unit 2 : RUNNING  | 210 MW | Eff: 87% | Steam: 537°C | CEP trip recovered (OPEN)
Unit 3 : WARNING  | 200 MW | Eff: 83% | Steam: 541°C | Attemperator spray increased
Unit 4 : RUNNING  | 215 MW | Eff: 88% | Steam: 533°C | All clear ✓
Unit 5 : SHUTDOWN |   0 MW | Planned PM in progress
Unit 6 : CRITICAL | 175 MW | Eff: 79% | Steam: 528°C | Turbine bearing 92°C ⚠️
Unit 7 : RUNNING  | 195 MW | Eff: 86% | Steam: 531°C | CW pump bearing normal ✓

ACTIVE FAULTS (5 Open)
${"─".repeat(40)}
[CRITICAL] Unit 6 – Turbine Bearing Temp 92°C (Trip: 95°C) — Action in progress
[OPEN]     Unit 2 – CEP Motor Overload Trip — Recovered, monitoring
[WARNING]  Unit 3 – Steam Temp High 541°C — Spray increased
[WARNING]  Unit 6 – ID Fan VFD Alarm — Cooling fan replacement arranged
[MONITOR]  Unit 1 – PA Fan Vibration 5.4 mm/s — Monitoring every 30 min

ACTIONS TAKEN THIS SHIFT
${"─".repeat(40)}
• Unit 6: Lube oil pressure checked, CW valve opened, load reduced to 175 MW
• Unit 3: Attemperator spray increased by 12%, Mill-C feeder reduced
• Unit 2: Standby CEP started, seal water pressure restored
• Unit 6: VFD spare cooling fan arranged from E&I store
• DGM informed of Unit 6 critical status at 09:15

HANDOVER INSTRUCTIONS
${"─".repeat(40)}
1. Unit 6 bearing temp — monitor every 15 min. If >94°C, initiate shutdown.
2. Unit 3 steam temp — maintain spray, target <538°C.
3. Unit 2 CEP — standby on auto. Watch for recurrence.
4. Unit 5 PM — expected completion in 3 days.

Prepared by : Shift Charge Engineer, Shift B
Received by : Shift Charge Engineer, Shift C
${"=".repeat(55)}`,

    efficiency: () => `EFFICIENCY & PERFORMANCE REPORT — NLC TPS-II
${"=".repeat(55)}
Date    : ${new Date().toLocaleDateString("en-IN")}
Period  : Shift B

UNIT-WISE EFFICIENCY
${"─".repeat(40)}
Unit 1 : 85.0%  | Heat Rate: 2,470 kcal/kWh
Unit 2 : 87.0%  | Heat Rate: 2,415 kcal/kWh
Unit 3 : 83.0%  | Heat Rate: 2,530 kcal/kWh  ⚠️ Below target
Unit 4 : 88.0%  | Heat Rate: 2,390 kcal/kWh  ⭐ Best today
Unit 5 : —      | Shutdown (PM)
Unit 6 : 79.0%  | Heat Rate: 2,650 kcal/kWh  ⚠️ Low (bearing issue)
Unit 7 : 86.0%  | Heat Rate: 2,440 kcal/kWh

Station Average : 85.0% (+0.8% vs yesterday)
Station Heat Rate: 2,482 kcal/kWh
Target Efficiency: >87%
Target Heat Rate : <2,450 kcal/kWh

IMPROVEMENT ACTIONS
${"─".repeat(40)}
• Unit 6: Restore full load after bearing repair → +8% efficiency
• Unit 3: Reduce steam temp to 535°C → +2% efficiency
• Unit 1: PA fan alignment check → minor improvement expected
${"=".repeat(55)}`,

    fault: () => `FAULT ANALYSIS REPORT — NLC TPS-II
${"=".repeat(55)}
Date    : ${new Date().toLocaleDateString("en-IN")}
Period  : Last 24 Hours

FAULT SUMMARY
${"─".repeat(40)}
Total Faults  : 7
Open          : 5
Closed        : 2
Critical      : 1
Warnings      : 2

DETAILED FAULT LOG
${"─".repeat(40)}
#1 [CRITICAL] Unit 6 – Turbine Bearing Temp High
   Time: 07:51 | Temp: 92°C | Trip: 95°C
   Action: Lube oil checked, CW valve opened, load reduced
   Status: OPEN — monitoring every 15 min

#2 [OPEN] Unit 2 – CEP Motor Overload Trip
   Time: 08:05 | Cause: Seal water pressure drop
   Action: Seal water restored, standby CEP started
   Status: OPEN — monitoring for recurrence

#3 [WARNING] Unit 3 – Steam Temp High Alarm
   Time: 08:39 | Temp: 541°C | Limit: 538°C
   Action: Attemperator spray +12%, Mill-C reduced
   Status: OPEN — temp reducing

#4 [WARNING] Unit 6 – ID Fan VFD Alarm
   Time: 08:10 | Cause: Cooling fan failure
   Action: Spare fan arranged (Part: VFD-CF-06)
   Status: OPEN — replacement pending

#5 [MONITOR] Unit 1 – PA Fan Bearing Vibration
   Time: 07:34 | Vib: 5.4 mm/s | Limit: 7 mm/s
   Action: Bearing greased, monitoring every 30 min
   Status: OPEN — within acceptable range

#6 [CLOSED] Unit 4 – Drum Level Low Alarm
   Time: Yesterday | BFP speed increased
   Status: CLOSED — level restored ✓

#7 [CLOSED] Unit 7 – CW Pump Bearing Temp
   Time: Yesterday | Bearing greased
   Status: CLOSED — temp normal at 48°C ✓
${"=".repeat(55)}`,
  };

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await authFetch("/reports/shift-summary");
      const data = await res.json();
      if (data.summary && !data.summary.includes("Connect Ollama")) {
        setReport(data.summary);
      } else { setReport(reports[type]()); }
    } catch { setReport(reports[type]()); }
    setLoading(false);
  };

  const copyReport = () => { navigator.clipboard.writeText(report); };

  return (
    <div style={{ padding: "14px 16px", height: "100%", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
      <div style={{ background: "#0F1E30", border: "1px solid #1E2A38", borderRadius: 10, padding: "12px 14px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#B0BEC5", marginBottom: 10 }}>Generate Report</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["shift","Shift Handover"],["efficiency","Efficiency"],["fault","Fault Analysis"]].map(([v,l]) => (
            <button key={v} onClick={() => setType(v)}
              style={{ padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 11,
                background: type === v ? "#0C2A45" : "#0A1628",
                color: type === v ? "#4FC3F7" : "#607D8B",
                border: `1px solid ${type === v ? "#4FC3F7" : "#1E3A5F"}` }}>{l}</button>
          ))}
          <button onClick={generate} disabled={loading}
            style={{ padding: "6px 18px", background: loading ? "#1E3A5F" : "#0C447C", color: "#4FC3F7",
              border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
            {loading ? "Generating..." : "⚡ Generate"}
          </button>
          {report && (
            <button onClick={copyReport}
              style={{ padding: "6px 14px", background: "#0A1628", color: "#00E676",
                border: "1px solid #00E67644", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
              📋 Copy
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, background: "#0F1E30", border: "1px solid #1E2A38", borderRadius: 10, overflow: "hidden" }}>
        {report ? (
          <pre style={{ margin: 0, padding: "14px 16px", fontSize: 10.5, color: "#B0BEC5",
            lineHeight: 1.7, overflowY: "auto", height: "100%", fontFamily: "'Courier New', monospace",
            whiteSpace: "pre-wrap", boxSizing: "border-box" }}>{report}</pre>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
            flexDirection: "column", gap: 8, color: "#37474F" }}>
            <div style={{ fontSize: 32 }}>📋</div>
            <div style={{ fontSize: 12 }}>Select report type and click Generate</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────
function Dashboard({ user, logout, authFetch }) {
  const [units]     = useState(INITIAL_UNITS);
  const [time, setTime] = useState(new Date());
  const [tab, setTab]   = useState("dashboard");

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const totalGen   = units.filter(u => u.status !== "SHUTDOWN").reduce((s, u) => s + u.gen, 0);
  const avgEff     = Math.round(units.filter(u => u.eff > 0).reduce((s, u) => s + u.eff, 0) / units.filter(u => u.eff > 0).length);
  const avgSteam   = Math.round(units.filter(u => u.steamTemp > 0).reduce((s, u) => s + u.steamTemp, 0) / units.filter(u => u.steamTemp > 0).length);
  const openFaults = ACTIVE_FAULTS.filter(f => f.severity !== "CLOSED").length;
  const unitsOnline= units.filter(u => u.status !== "SHUTDOWN").length;

  const navTabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "shiftlog",  label: "Shift Log" },
    { id: "reports",   label: "Reports" },
  ];

  return (
    <div style={{ height: "100vh", background: "#070F1A", color: "#CFD8DC",
      display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Top Nav ── */}
      <div style={{ background: "#0A1628", borderBottom: "1px solid #1E2A38", flexShrink: 0,
        padding: "0 14px", height: 42, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "#0C447C",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 800, color: "#4FC3F7" }}>NLC</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#E0E0E0" }}>NLC TPS-II</div>
            <div style={{ fontSize: 9, color: "#546E7A" }}>Neyveli Lignite Corporation · Thermal Power Station II</div>
          </div>
          <div style={{ marginLeft: 10, fontSize: 10, fontWeight: 700, color: "#4FC3F7", letterSpacing: 1.5 }}>
            ALL 7 UNITS — OPERATIONS DASHBOARD
          </div>
          {/* Nav tabs */}
          <div style={{ marginLeft: 16, display: "flex", gap: 2 }}>
            {navTabs.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)}
                style={{ padding: "4px 12px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 11,
                  background: tab === n.id ? "#0C2A45" : "transparent",
                  color: tab === n.id ? "#4FC3F7" : "#546E7A",
                  fontWeight: tab === n.id ? 600 : 400 }}>{n.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {[
            { label: `● ${unitsOnline} Units Running`, bg: "#00E67622", color: "#00E676", border: "#00E67644" },
            { label: "● 1 Critical",   bg: "#FF174422", color: "#FF5252", border: "#FF174444" },
            { label: "Shift B Active", bg: "#1E2A38",   color: "#90A4AE", border: "#263238" },
            { label: `Total: ${totalGen.toLocaleString()} MW`, bg: "#0C2A45", color: "#4FC3F7", border: "#1E3A5F" },
          ].map(b => (
            <span key={b.label} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
              background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>{b.label}</span>
          ))}
          <span style={{ fontSize: 11, fontWeight: 600, color: "#607D8B", marginLeft: 4 }}>
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span style={{ fontSize: 10, color: "#546E7A" }}>{user?.name}</span>
          <button onClick={logout} style={{ fontSize: 10, color: "#FF5252", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: "#1E2A38", flexShrink: 0 }}>
        {[
          { label: "TOTAL GENERATION",  value: totalGen.toLocaleString(), unit: "MW", sub: "84% of rated 1,500 MW", color: "#4FC3F7" },
          { label: "AVG EFFICIENCY",    value: avgEff,  unit: "%",  sub: "+0.8% vs yesterday",      color: "#00E676" },
          { label: "AVG STEAM TEMP",    value: avgSteam,unit: "°C", sub: "▲ Unit 3 high at 541°C",  color: "#FF6D00" },
          { label: "TOTAL OPEN FAULTS", value: openFaults, unit: "", sub: "1 critical · 2 warnings", color: "#FF5252" },
          { label: "UNITS ONLINE",      value: `${unitsOnline}/7`, unit: "", sub: "Unit 5 — Planned PM", color: "#00E676" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0A1628", padding: "8px 14px" }}>
            <div style={{ fontSize: 9, color: "#546E7A", letterSpacing: 1, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: 10, color: "#607D8B", marginLeft: 2 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 9, color: "#546E7A", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === "dashboard" && (
        <>
          <div style={{ flexShrink: 0 }}>
            <div style={{ padding: "5px 14px 3px", fontSize: 9, color: "#546E7A", letterSpacing: 2 }}>
              UNIT-WISE LIVE STATUS — NLC TPS-II (ALL 7 UNITS)
            </div>
            <div style={{ padding: "0 14px 7px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {units.slice(0, 4).map(u => <UnitCard key={u.id} unit={u} />)}
            </div>
            <div style={{ padding: "0 14px 7px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {units.slice(4).map(u => <UnitCard key={u.id} unit={u} />)}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: "0 14px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ChatPanel authFetch={authFetch} />
            <FaultsPanel />
          </div>
        </>
      )}
      {tab === "shiftlog" && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ShiftLogTab authFetch={authFetch} />
        </div>
      )}
      {tab === "reports" && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ReportsTab authFetch={authFetch} />
        </div>
      )}
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────
export default function App() {
  const { logout, authFetch } = useAuth();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("nlc_token"));
  const [appUser, setAppUser]   = useState(null);

  if (!loggedIn) {
    return <LoginScreen onLogin={(u) => { setAppUser(u); setLoggedIn(true); }} />;
  }
  return <Dashboard user={appUser} logout={() => { logout(); setLoggedIn(false); }} authFetch={authFetch} />;
}
