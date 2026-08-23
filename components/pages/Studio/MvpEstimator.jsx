"use client";
// Interactive MVP cost estimator (Pencil node ploD8). Rendered by the
// server-safe EstimatorBlock — same pattern as HeaderBlock -> Header.
// All labels and pricing inputs arrive as props (editable in Puck);
// the component merges defaults so partial props never break it.
import { useMemo, useState } from "react";
import styles from "./estimator.module.css";

/* ---------------- defaults (mirrored in EstimatorBlock fields) ------------- */
export const ESTIMATOR_DEFAULTS = {
  currency: "€",
  step1Title: "What are you building?",
  types: [
    { label: "Web app", desc: "Dashboard, portal, SaaS", costLo: 18, costHi: 26, weeksLo: 6, weeksHi: 8 },
    { label: "Mobile app", desc: "iOS + Android", costLo: 24, costHi: 34, weeksLo: 8, weeksHi: 10 },
    { label: "Internal tool", desc: "Ops, admin, back-office", costLo: 14, costHi: 20, weeksLo: 5, weeksHi: 7 },
    { label: "AI agent", desc: "Automation & copilots", costLo: 22, costHi: 32, weeksLo: 7, weeksHi: 9 },
  ],
  step2Title: "Which pieces do you need?",
  step2Hint: "Pick all that apply",
  features: [
    { label: "User accounts & roles", costLo: 2, costHi: 3 },
    { label: "Payments & billing", costLo: 2, costHi: 3 },
    { label: "Dashboard & analytics", costLo: 2, costHi: 3 },
    { label: "Admin panel", costLo: 2, costHi: 3 },
    { label: "Notifications", costLo: 1, costHi: 2 },
    { label: "File uploads", costLo: 1, costHi: 2 },
    { label: "Chat / messaging", costLo: 2, costHi: 3 },
    { label: "AI features", costLo: 3, costHi: 4 },
    { label: "Public API", costLo: 2, costHi: 3 },
  ],
  step3Title: "How many external integrations?",
  step3Hint: "CRM, ERP, payments, internal APIs",
  integrationCostLo: 1.5, integrationCostHi: 2.5,
  step4Title: "How much design do you need?",
  designs: [
    { label: "Template", desc: "Off-the-shelf UI kit", addLo: 0, addHi: 0, addWeeks: 0 },
    { label: "Custom UI", desc: "Designed for your product", addLo: 4, addHi: 6, addWeeks: 1 },
    { label: "Full brand", desc: "Identity + product system", addLo: 8, addHi: 12, addWeeks: 2 },
  ],
  step5Title: "When do you need it live?",
  speeds: [
    { label: "Standard", desc: "Normal cadence", multiplier: 1 },
    { label: "Fast-track", desc: "Parallel squads, +25%", multiplier: 1.25 },
  ],
  resultKicker: "Your estimate",
  resultNote: "EUR · fixed scope · updates as you answer",
  factTimeline: "Timeline",
  factTeam: "Team",
  factBilling: "Billing",
  factBillingValue: "Milestone-based",
  factIncludes: "Includes",
  factIncludesValue: "Discovery, build, launch",
  weeksUnit: "weeks",
  peopleUnit: "people",
  breakdownTitle: "Where it goes",
  breakdown: [
    { label: "Discovery & scoping", percent: 10 },
    { label: "Product & UI design", percent: 20 },
    { label: "Engineering", percent: 55 },
    { label: "QA, launch & handover", percent: 15 },
  ],
  ctaLabel: "Book a call to validate this",
  ctaHref: "https://calendly.com/hiiive/dvision-potenzial",
  emailLabel: "Email me the full breakdown",
  emailTo: "hello@hiiive.ai",
  emailSubject: "My MVP estimate",
  disclaimer: "An estimate, not a quote. Ranges reflect projects we have shipped with the same scope pattern.",
  // initial selections (match the Pencil mock)
  initialType: 0,
  initialFeatures: [0, 1, 2, 7],
  initialIntegrations: 3,
  initialDesign: 1,
  initialSpeed: 0,
};

const TYPE_ICONS = [
  <path key="w" d="M3 5h18v14H3zM3 9h18" />,
  <path key="m" d="M8 3h8v18H8zM11 18h2" />,
  <path key="i" d="M4 6h16M4 12h16M4 18h10" />,
  <path key="a" d="M12 3v3m0 0a6 6 0 0 1 6 6v6H6v-6a6 6 0 0 1 6-6zM9 13h.01M15 13h.01" />,
];

export default function MvpEstimator(raw) {
  const cfg = { ...ESTIMATOR_DEFAULTS, ...Object.fromEntries(Object.entries(raw || {}).filter(([, v]) => v !== undefined && v !== null)) };
  const [type, setType] = useState(Number(cfg.initialType) || 0);
  const [features, setFeatures] = useState(() => new Set((cfg.initialFeatures || []).map(Number)));
  const [integrations, setIntegrations] = useState(Number(cfg.initialIntegrations) || 0);
  const [design, setDesign] = useState(Number(cfg.initialDesign) || 0);
  const [speed, setSpeed] = useState(Number(cfg.initialSpeed) || 0);

  const toggleFeature = (i) =>
    setFeatures((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const result = useMemo(() => {
    const t = cfg.types[type] || cfg.types[0] || {};
    const d = cfg.designs[design] || cfg.designs[0] || {};
    const s = cfg.speeds[speed] || cfg.speeds[0] || {};
    let lo = Number(t.costLo) || 0;
    let hi = Number(t.costHi) || 0;
    for (const i of features) {
      const f = cfg.features[i];
      if (f) { lo += Number(f.costLo) || 0; hi += Number(f.costHi) || 0; }
    }
    lo += integrations * (Number(cfg.integrationCostLo) || 0);
    hi += integrations * (Number(cfg.integrationCostHi) || 0);
    lo += Number(d.addLo) || 0;
    hi += Number(d.addHi) || 0;
    const mult = Number(s.multiplier) || 1;
    lo = Math.round(lo * mult);
    hi = Math.round(hi * mult);

    const extraWeeks = Math.round(features.size * 0.4 + integrations * 0.3 + (Number(d.addWeeks) || 0));
    let wLo = (Number(t.weeksLo) || 0) + extraWeeks;
    let wHi = (Number(t.weeksHi) || 0) + extraWeeks;
    if (mult > 1) { wLo = Math.max(2, Math.round(wLo * 0.75)); wHi = Math.max(3, Math.round(wHi * 0.75)); }

    const mid = (lo + hi) / 2;
    const team = mid < 30 ? "2 – 3" : mid < 55 ? "3 – 4" : "4 – 5";

    // Dynamic "where it goes" split (labels stay editable; shares react to the
    // answers): design level drives the design share, features/integrations
    // drive engineering, integrations add discovery, fast-track adds QA/launch.
    let percents = null;
    if ((cfg.breakdown || []).length === 4) {
      const weights = [
        8 + integrations * 0.6, // discovery & scoping
        [10, 20, 28][design] ?? 20, // product & UI design
        45 + features.size * 1.2 + integrations * 1.4, // engineering
        12 + (mult > 1 ? 3 : 0), // QA, launch & handover
      ];
      const total = weights.reduce((a, b) => a + b, 0);
      const raw2 = weights.map((w) => (w / total) * 100);
      percents = raw2.map(Math.floor);
      // largest-remainder rounding so the shares always sum to 100
      let rest = 100 - percents.reduce((a, b) => a + b, 0);
      const order = raw2.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
      for (let k = 0; k < rest; k++) percents[order[k % order.length][1]] += 1;
    }
    return { lo, hi, wLo, wHi, team, percents };
  }, [cfg, type, features, integrations, design, speed]);

  const emailHref = `mailto:${cfg.emailTo}?subject=${encodeURIComponent(cfg.emailSubject)}&body=${encodeURIComponent(
    `Estimate: ${cfg.currency}${result.lo}K – ${cfg.currency}${result.hi}K\nTimeline: ${result.wLo} – ${result.wHi} ${cfg.weeksUnit}\nBuilding: ${(cfg.types[type] || {}).label}\nFeatures: ${[...features].map((i) => (cfg.features[i] || {}).label).join(", ") || "—"}\nIntegrations: ${integrations >= 6 ? "6+" : integrations}\nDesign: ${(cfg.designs[design] || {}).label}\nSpeed: ${(cfg.speeds[speed] || {}).label}\n\n${cfg.breakdownTitle}:\n${cfg.breakdown.map((b2, i) => `  ${b2.label}: ${result.percents ? result.percents[i] : b2.percent}%`).join("\n")}`,
  )}`;

  return (
    <section className={styles.estimator}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* ---------------- form card ---------------- */}
          <div className={styles.formCard}>
            <div className={styles.step}>
              <div className={styles.stepHead}><span className={styles.stepNum}>01</span><span className={styles.stepTitle}>{cfg.step1Title}</span></div>
              <div className={styles.typeGrid}>
                {cfg.types.map((t, i) => (
                  <button key={i} type="button" onClick={() => setType(i)} className={`${styles.typeCard} ${type === i ? styles.typeCardOn : ""}`}>
                    <span className={styles.typeIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{TYPE_ICONS[i % TYPE_ICONS.length]}</svg>
                    </span>
                    <span className={styles.typeBody}>
                      <span className={styles.typeLabel}>{t.label}</span>
                      <span className={styles.typeDesc}>{t.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHead}>
                <span className={styles.stepNum}>02</span><span className={styles.stepTitle}>{cfg.step2Title}</span>
                <span className={styles.stepHint}>{cfg.step2Hint}</span>
              </div>
              <div className={styles.chipsGrid}>
                {cfg.features.map((f, i) => {
                  const on = features.has(i);
                  return (
                    <button key={i} type="button" onClick={() => toggleFeature(i)} className={`${styles.featChip} ${on ? styles.featChipOn : ""}`} aria-pressed={on}>
                      <span className={styles.featMark} aria-hidden="true">{on ? "✓" : "+"}</span>{f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHead}>
                <span className={styles.stepNum}>03</span><span className={styles.stepTitle}>{cfg.step3Title}</span>
                <span className={styles.stepHint}>{cfg.step3Hint}</span>
              </div>
              <input
                type="range" min="0" max="6" step="1" value={integrations}
                onChange={(e) => setIntegrations(Number(e.target.value))}
                className={styles.slider} aria-label={cfg.step3Title}
              />
              <div className={styles.sliderScale}>
                {[0, 1, 2, 3, 4, 5, "6+"].map((v, i) => (
                  <span key={i} className={integrations === i ? styles.sliderTickOn : styles.sliderTick}>{v}</span>
                ))}
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHead}><span className={styles.stepNum}>04</span><span className={styles.stepTitle}>{cfg.step4Title}</span></div>
              <div className={styles.segRow}>
                {cfg.designs.map((d, i) => (
                  <button key={i} type="button" onClick={() => setDesign(i)} className={`${styles.seg} ${design === i ? styles.segOn : ""}`}>
                    <span className={styles.segLabel}>{d.label}</span>
                    <span className={styles.segDesc}>{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHead}><span className={styles.stepNum}>05</span><span className={styles.stepTitle}>{cfg.step5Title}</span></div>
              <div className={styles.segRow}>
                {cfg.speeds.map((s, i) => (
                  <button key={i} type="button" onClick={() => setSpeed(i)} className={`${styles.seg} ${speed === i ? styles.segOn : ""}`}>
                    <span className={styles.segLabel}>{s.label}</span>
                    <span className={styles.segDesc}>{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- result panel ---------------- */}
          <div className={styles.result}>
            <span className={styles.resultKicker}>{cfg.resultKicker}</span>
            <div className={styles.range}>{cfg.currency}{result.lo}K – {cfg.currency}{result.hi}K</div>
            <div className={styles.rangeNote}>{cfg.resultNote}</div>
            <div className={styles.rule} />
            <div className={styles.facts}>
              <div className={styles.fact}><span className={styles.factLabel}>{cfg.factTimeline}</span><span className={styles.factValue}>{result.wLo} – {result.wHi} {cfg.weeksUnit}</span></div>
              <div className={styles.fact}><span className={styles.factLabel}>{cfg.factTeam}</span><span className={styles.factValue}>{result.team} {cfg.peopleUnit}</span></div>
              <div className={styles.fact}><span className={styles.factLabel}>{cfg.factBilling}</span><span className={styles.factValue}>{cfg.factBillingValue}</span></div>
              <div className={styles.fact}><span className={styles.factLabel}>{cfg.factIncludes}</span><span className={styles.factValue}>{cfg.factIncludesValue}</span></div>
            </div>
            <div className={styles.rule} />
            <span className={styles.breakTitle}>{cfg.breakdownTitle}</span>
            <div className={styles.breakRows}>
              {cfg.breakdown.map((b2, i) => {
                const pct = result.percents ? result.percents[i] : Number(b2.percent) || 0;
                return (
                  <div key={i} className={styles.breakRow}>
                    <div className={styles.breakTop}><span>{b2.label}</span><span className={styles.breakPct}>{pct}%</span></div>
                    <div className={styles.breakTrack}><div className={styles.breakFill} style={{ width: `${Math.min(100, pct)}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <a href={cfg.ctaHref} className={styles.resultCta}>{cfg.ctaLabel}</a>
            <a href={emailHref} className={styles.resultGhost}>{cfg.emailLabel}</a>
            <p className={styles.disclaimer}>{cfg.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
