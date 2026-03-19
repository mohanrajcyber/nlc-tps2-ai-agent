# NLC TPS-II AI Agent — Questions & Answers Notes
## CSE Division · Internal Reference

---

## 1. UNIT STATUS QUERIES

**Q: Unit 6 bearing status / shutdown procedure / turbine critical**
- Unit 6 — Turbine Bearing CRITICAL (92°C, trip at 95°C)
- Check lube oil pressure — must be >1.2 kg/cm²
- Open CW flow valve to oil cooler fully
- Reduce load to 150 MW if temp rises above 93°C
- If temp reaches 94°C — initiate controlled shutdown
- Inform DGM & prepare Unit 6 isolation procedure
- Log every 15 min in shift register

---

**Q: Unit 3 steam temp fix / attemperator / 541°C alarm**
- Unit 3 — Steam Temp High (541°C, limit: 538°C)
- Increase attemperator spray flow by 10–15%
- Check spray control valve CV-301 — verify not stuck
- Reduce coal feeder speed by 5% on Mill-C
- Monitor SH outlet temp every 10 min
- If temp exceeds 543°C — reduce load by 20 MW
- Target: bring below 538°C within 30 min

---

**Q: Unit 1 status**
- Status: RUNNING | 185 MW | Efficiency: 85% | Steam Temp: 532°C
- PA Fan vibration: 5.4 mm/s (MONITOR — threshold 7 mm/s)
- Action: Monitor every 30 min

---

**Q: Unit 2 status**
- Status: RUNNING | 210 MW | Efficiency: 87% | Steam Temp: 537°C
- CEP motor trip: Recovered, monitoring
- Standby CEP on auto-standby

---

**Q: Unit 4 status**
- Status: RUNNING | 215 MW | Efficiency: 88% (best today) | Steam Temp: 533°C
- All Clear — no active faults

---

**Q: Unit 5 status / shutdown / maintenance**
- Status: SHUTDOWN — Planned PM (Turbine overhaul)
- Expected return: 3 days
- Active PTW for turbine overhaul
- PM checklist: Blade inspection, bearing replacement, seal replacement, alignment check, trial run

---

**Q: Unit 7 status / CW pump**
- Status: RUNNING | 195 MW | Efficiency: 86% | Steam Temp: 531°C
- CW pump bearing greased — temp normal at 48°C
- 1 minor warning — monitoring

---

**Q: All units status / all units fault summary**
- Unit 6 — CRITICAL | 175 MW | Turbine bearing 92°C
- Unit 3 — WARNING  | 200 MW | Steam temp 541°C
- Unit 2 — RUNNING  | 210 MW | CEP trip recovered
- Unit 1 — RUNNING  | 185 MW | PA fan vibration monitor
- Unit 4 — RUNNING  | 215 MW | All clear
- Unit 7 — RUNNING  | 195 MW | Normal
- Unit 5 — SHUTDOWN |   0 MW | Planned PM
- Total: 1,180 MW | Open faults: 5

---

## 2. EQUIPMENT FAULT PROCEDURES

**Q: PA fan vibration fix / PA fan bearing**
- Unit 1 PA Fan — 5.4 mm/s (threshold: 7 mm/s) — MONITOR
- Check bearing temperature — should be <80°C
- Inspect coupling alignment
- Grease bearing if last greasing >7 days ago
- Check for coal dust accumulation on impeller
- If vibration crosses 6.5 mm/s — keep standby PA fan ready
- Log readings every 30 min

---

**Q: CEP motor trip recovery**
- Unit 2 — CEP Motor Overload Trip
- Root Cause: Seal water pressure drop → motor overload
- Check seal water pressure — min 2.5 kg/cm²
- Reset overload relay after 10 min cooling
- Start CEP on manual mode, check current draw
- If trips again — isolate and inspect mechanical seal
- Keep standby CEP on auto-standby

---

**Q: ID fan VFD alarm**
- Unit 6 — ID Fan VFD Alarm (cooling fan failure)
- Open VFD panel door — check internal cooling fan
- Check VFD panel temperature — should be <45°C
- If panel temp >50°C — reduce ID fan speed by 10%
- Replace cooling fan (E&I store, Part No. VFD-CF-06)
- Reset VFD alarm after fan replacement
- Do NOT bypass VFD thermal protection

---

**Q: Drum level low alarm / BFP**
- Unit 4 — Drum Level Low Alarm (CLOSED ✅)
- Resolved: BFP speed increased, level restored (+25mm NWL)
- Check BFP recirculation valve — ensure not passing
- Verify drum level transmitter LT-401 calibration
- Check feed control valve FCV-401 response
- Normal drum level: ±0 to +50mm NWL

---

## 3. EQUIPMENT PARAMETERS

**Q: Turbine parameters**
- Bearing temp: <85°C (trip at 95°C)
- Lube oil pressure: >1.2 kg/cm²
- Vibration: <7 mm/s
- Speed: 3000 RPM (50 Hz)
- Exhaust pressure: <0.1 kg/cm²
- Gland steam pressure: 0.05–0.1 kg/cm²

---

**Q: Boiler parameters**
- Drum pressure: 150–155 kg/cm²
- SH outlet temp: 535–538°C
- RH outlet temp: 535–540°C
- Drum level: ±50mm NWL
- Furnace draft: -5 to -8 mmWC
- O2 at APH outlet: 3.5–4.5%
- Feed water temp: 240–250°C

---

**Q: Generator parameters**
- Stator temp: <120°C
- Rotor temp: <130°C
- Hydrogen pressure: 3.5 kg/cm² (H2 cooled)
- Power factor: 0.85 lagging
- Rated capacity: 250 MW per unit

---

**Q: Coal mill / pulverizer status**
- Mills per unit: 5 (A, B, C, D, E)
- Normal operation: 3–4 mills running
- Mill outlet temp: 65–75°C
- PA fan pressure: 800–1000 mmWC
- Coal fineness: >70% through 200 mesh
- Unit 3: Mill-C feeder reduced to control steam temp
- Unit 6: Mill load reduced due to bearing issue

---

**Q: Cooling tower / condenser**
- CW inlet temp: 32°C (normal)
- CW outlet temp: 42°C (normal)
- Condenser vacuum: 720–730 mmHg
- All CW pumps running normally

---

**Q: Transformer monitoring**
- GT-1 to GT-7: Oil temp <85°C ✅
- Winding temp: <95°C ✅
- Buchholz relay: No gas accumulation ✅
- Tap changer: Auto mode ✅
- Last oil BDV test: >60 kV (within limits)
- No active transformer alarms

---

**Q: Ash handling / ESP**
- ESP efficiency: >99.5%
- Fly ash collection: 6 fields per unit
- Bottom ash: Submerged scraper conveyor
- Stack emission: Within CPCB norms (<100 mg/Nm³)
- All ESP fields operational

---

**Q: Electrical protection / relay**
- Generator protection: Differential, over-current, earth fault
- Transformer protection: Buchholz, OTI, WTI, differential
- Motor protection: Overload, single phasing, earth fault
- Bus protection: Numerical relay (Micom/SEL)
- All protection relays: Healthy ✅

---

**Q: Water chemistry**
- Feed water pH: 9.0–9.5
- Boiler water pH: 10.5–11.5
- Conductivity: <0.3 μS/cm (feed water)
- Dissolved O2: <7 ppb
- Silica: <20 ppb
- DM plant output: Normal

---

## 4. PROCEDURES

**Q: Emergency shutdown procedure**
1. Press EMERGENCY STOP on UCB
2. Trip turbine manually if auto-trip fails
3. Close main steam stop valve (MSV)
4. Initiate boiler MFT (Master Fuel Trip)
5. Start boiler purge (5 min, >30% air flow)
6. Isolate all fuel inputs
7. Maintain BFP for drum cooling
8. Notify Shift Charge Engineer + DGM immediately
9. Log time and reason in shift register
10. Do NOT restart without DGM approval

---

**Q: Unit startup sequence**
1. Pre-startup checks complete (PTW cleared)
2. Boiler light-up (HFO ignition)
3. Drum pressure raise to 10 kg/cm²
4. Turbine rolling at 500 RPM
5. Critical speed (1400–1600 RPM) — pass quickly
6. Rated speed: 3000 RPM
7. Synchronization with grid
8. Load raise: 50 → 100 → 150 → 200 MW
9. Switch to coal firing at 100 MW
10. Full load: 210–215 MW

---

**Q: PTW / Permit to Work / isolation / LOTO**
- Types: Hot Work, Cold Work, Electrical Isolation, Confined Space
- Issuing authority: Shift Charge Engineer
- Process: Equipment isolation → LOTO → Safety checks → Work → Handback → PTW cancellation
- Current active PTW: Unit 5 turbine overhaul

---

## 5. PERFORMANCE & REPORTS

**Q: Efficiency / heat rate**
- Unit 1: 85% | Unit 2: 87% | Unit 3: 83% | Unit 4: 88% | Unit 6: 79% | Unit 7: 86%
- Station Average: 85% (+0.8% vs yesterday)
- Target efficiency: >87% for all running units
- Target heat rate: <2,450 kcal/kWh
- Unit 6 low: Due to reduced load from bearing issue
- Unit 3 low: Steam temp control reducing output

---

**Q: Generate shift report / shift summary / handover**
- Shift B — 1,180 MW (6/7 units, 84% capacity)
- Unit 5: Shutdown — Planned PM
- Critical: Unit 6 — Turbine bearing 92°C
- Warning: Unit 3 — Steam temp 541°C
- Open: Unit 2 — CEP trip (recovered)
- Monitor: Unit 1 — PA fan vibration 5.4 mm/s
- Handover to Shift C at 22:00, DGM informed

---

## 6. TAMIL SUPPORT

**Q: வணக்கம் / Vanakkam / enna panalam / என்ன**
- Tamil-லயும் English-லயும் கேக்கலாம்
- Equipment fault diagnosis
- Shift handover report
- Procedures and parameters

**Q: யூனிட் 6 bearing / Unit 6 Tamil**
- Same as Unit 6 bearing answer — responds in Tamil

**Q: Shift report கொடு**
- Same as shift report — responds in Tamil/mixed

---

## 7. QUICK QUESTION BUTTONS (in UI)

1. Unit 6 shutdown procedure
2. Unit 3 steam temp fix
3. PA fan vibration fix
4. CEP motor trip recovery
5. Generate shift report
6. All units fault summary
7. Emergency shutdown steps
8. Turbine startup sequence
9. Boiler parameters
10. Coal mill status
11. யூனிட் 6 bearing status (Tamil)
12. Shift report கொடு (Tamil)

---

## 8. CSC DIVISION — DGM PROFILE

**Q: Who is CSC DGM / who is DGM / Velmurugan / computer science department DGM**

| Field       | Details |
|-------------|---------|
| Name        | Velmurugan Utthandy |
| Position    | Deputy General Manager (DGM) |
| Division    | Computer Science (CSC) · NLC TPS-II |
| Location    | Cuddalore, Tamil Nadu, India |
| Service     | July 1987 – Present (38+ years, Full-time) |

**Education:**
- Post Graduate Diploma in Computer Science — Madras University (Jun 1994 – Dec 1995) · First Class with Distinction
- B.E. Electronics & Instrumentation Engineering — Annamalai University, Annamalainagar (Jun 1989 – Jul 1993) · First Class with Distinction

**Skills / Certification:**
- Certified Cyber Warrior

**Career History:**
- Joined NLC India Limited — July 1987
- 38+ years of continuous service
- Rose to Deputy General Manager position
- Currently open to Head Manager roles

---

*NLC TPS-II AI Agent — CSE Division · Internal Use Only*
*Prepared by: Mohanraj · Version: 1.0 · Date: 19-Mar-2026*
