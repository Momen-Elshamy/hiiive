// Single source of truth for the Digital Presence page default content.
// Imported by digitalPresenceBlocks.jsx (block defaultProps) AND by the DB
// seed script, so the seeded page and the editor defaults never drift.
export const dp = {
  hero: {
    crumbParent: "Studio", crumbCurrent: "Digital Presence & Funnels",
    kicker: "Service 04 — Digital presence & funnels",
    headline: "Your traffic is\nleaking. We own\nthe fix.",
    subtitle: "We take ownership of how your brand shows up online — measuring how people behave on your site, then shipping the fixes that turn traffic into pipeline.",
    primaryLabel: "Book a call", primaryHref: "https://calendly.com/hiiive/get-to-know",
    secondaryLabel: "Watch the 2-min explainer", secondaryHref: "#",
    monitorUrl: "LIVE · yourbrand.com", sessionLabel: "SESSION #4,203",
    events: [
      { time: "14:31", text: "Rage click detected — pricing table", tone: "alert" },
      { time: "14:32", text: "Drop-off spike — checkout step 2", tone: "warn" },
      { time: "14:33", text: "Fix shipped — form cut to 6 fields", tone: "ok" },
    ],
    kpiLabel: "Conversion, 90 days", kpiFrom: "1.2%", kpiTo: "1.6%",
    monitorImage: "/img/dp-monitor.png",
  },

  trust: {
    kicker: "Trusted by operators in logistics, retail, fintech and health",
    note: "Client names shown with permission",
    logos: [
      { name: "NORTHWIND", icon: "hexagon" },
      { name: "MERIDIAN", icon: "circleDot" },
      { name: "ATLAS FOODS", icon: "none" },
      { name: "CIVIC BANK", icon: "triangle" },
      { name: "ORBIT", icon: "box" },
    ],
  },

  problem: {
    headline: "You pay to bring people to your website —\nthen let them quietly leak away.",
    subhead: "The site goes live once. After that, nobody owns whether it actually converts.",
    chartTitle: "How a new site performs when nobody owns it",
    bars: [
      { value: 100, label: "Launch", note: "New site ships. Everyone celebrates." },
      { value: 88, label: "Month 3", note: "Small friction appears. Nobody is watching." },
      { value: 71, label: "Month 6", note: "The market moves. The site doesn't." },
      { value: 54, label: "Month 12", note: "You buy more traffic to cover the gap." },
    ],
    costTitle: "What the drop-off costs you",
    costFigure: "−€38,400", costPeriod: "/ year",
    costBody: "At 10,000 sessions a month and an €80 order value, sitting at 1.2% instead of 1.6% leaves this on the table — every year.",
    whyTitle: "Why it keeps happening",
    whyBody: "Nobody owns the number after launch, so the leak is never found — let alone fixed.",
    footLine: "We instrument every step, then fix the one that costs the most.",
  },

  meet: {
    kicker: "The solution",
    title: "Meet Hiiive.\nOne team for the\nwhole channel.",
    lead: "An outsourced digital-presence team that owns your online channel end-to-end — measuring how people behave, then shipping the improvements every month.",
    steps: [
      { num: "01", title: "Measure", desc: "Behaviour data from every session, not guesses." },
      { num: "02", title: "Improve", desc: "Changes designed, shipped and QA'd every month." },
      { num: "03", title: "Prove", desc: "Before and after on the KPIs we agreed together." },
    ],
    quote: "One team, one channel, one number to answer for — instead of four agencies pointing at each other.",
    diagramTitle: "Your site",
    surfacesTitle: "Five surfaces we own",
    diagramImage: "/img/dp-site-diagram.png",
    surfaces: [
      { num: "01", title: "Information architecture", desc: "Nav, sitemap and internal links" },
      { num: "02", title: "UX & UI", desc: "Layout, clarity and the path to action" },
      { num: "03", title: "Conversion paths", desc: "The steps between interest and checkout" },
      { num: "04", title: "Content & pages", desc: "What the journey is missing" },
      { num: "05", title: "Analytics & reporting", desc: "The numbers we answer for" },
    ],
  },

  how: {
    kicker: "How it works",
    title: "The monthly loop.",
    intro: "One team owns your whole online channel — on a monthly loop that compounds instead of restarting every quarter.",
    cards: [
      { num: "01", title: "Measure", body: "Week one: Hotjar, Clarity, PostHog & GA4 go live. Your funnel gets defined and every session is captured.", chips: [{ text: "Hotjar" }, { text: "PostHog" }, { text: "Clarity" }, { text: "GA4" }] },
      { num: "02", title: "Improve", body: "Friction found in real sessions becomes shipped, data-backed improvements — designed, built and QA'd.", chips: [{ text: "2–6 improvements / month" }] },
      { num: "03", title: "Prove", body: "Every report opens with your primary KPI, before vs. after. You see exactly what moved, and why.", chips: [{ text: "Live KPI dashboard" }] },
    ],
    loopStrip: "Collect → Analyse → Recommend → Implement → Prove",
  },

  feature: {
    chip: "Real sessions · real friction · real fixes",
    title: "We watch how people\nactually use your site.",
    subtitle: "Not opinions. Not redesign roulette. Every change starts in a real session recording.",
    ctaLabel: "See it on your site", ctaHref: "mailto:hello@hiiive.ai",
    imageUrl: "https://images.unsplash.com/photo-1542744173-b3cd6377db95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
  },

  results: {
    kicker: "What you get",
    title: "Not hours. Not reports.\nShipped improvements.",
    tiles: [
      { value: "WK 1", label: "Tracking live", desc: "Funnel defined, events tracked, baseline captured." },
      { value: "2–6", label: "Improvements / month", desc: "Designed, shipped and QA'd — or spec'd for your team." },
      { value: "DAY 30", label: "Your leak map", desc: "You'll know exactly where your site loses money." },
      { value: "1", label: "Primary KPI", desc: "Agreed in week 0. Every report opens with it." },
    ],
    strip: "By day 30 you'll know exactly where your site leaks — whether or not you continue.",
  },

  cases: {
    kicker: "Selected work", title: "What it looks like\nin practice.", linkLabel: "All case studies", linkHref: "/#work",
    cases: [
      { tag: "E-commerce · Checkout", stat: "+0.8 pts", statLabel: "conversion in 8 weeks", body: "Recordings showed a rage-click loop on the payment step. We rebuilt the checkout — conversion moved in eight weeks." },
      { tag: "B2B SaaS · Pricing page", stat: "−31%", statLabel: "exit rate on pricing", body: "Sessions kept dying on the plan table. We simplified it and rewrote the FAQ from questions real users asked." },
      { tag: "Lead-gen · Mobile forms", stat: "2.1×", statLabel: "form completions", body: "Fourteen fields, half off-screen on mobile. We cut them to six and moved the form above the fold." },
    ],
  },

  packages: {
    kicker: "Investment", title: "Two ways to work with us.",
    intro: "Both run the same monthly loop. The difference is volume — how many improvements ship each month.",
    plans: [
      { name: "Grow", badge: "", price: "€1,000", period: "/ month", desc: "For brands starting to take conversion seriously.", featuresIntro: "",
        features: [{ text: "2 shipped improvements per month" }, { text: "Full tracking setup — Hotjar, Clarity, PostHog & GA4" }, { text: "Weekly monitoring for friction and quick wins" }, { text: "Monthly insights report + live KPI dashboard" }, { text: "Monthly review call" }],
        ctaLabel: "Start with Grow", ctaHref: "https://calendly.com/hiiive/get-to-know", featured: "no" },
      { name: "Scale", badge: "Most popular", price: "€2,500", period: "/ month", desc: "For brands with the volume to make a 1% lift real money.", featuresIntro: "Everything in Grow, plus:",
        features: [{ text: "6 shipped improvements per month" }, { text: "A/B testing & experiment program" }, { text: "Landing pages & new journey pages built" }, { text: "Quarterly strategy roadmap" }, { text: "Priority Slack access to the team" }],
        ctaLabel: "Talk about Scale", ctaHref: "https://calendly.com/hiiive/get-to-know", featured: "yes" },
    ],
  },

  faq: {
    title: "The questions that come up every time.",
    items: [
      { q: "Do you build changes yourselves, or hand them off?", a: "Either. We ship directly on most platforms — or deliver a build-ready spec to your dev team." },
      { q: "We already have GA4. Is that enough?", a: "Almost never. GA4 is usually installed but nothing is tracked beyond page views, and funnels aren't defined. We fix that in week one." },
      { q: "How is this different from a one-off redesign?", a: "A redesign is a bet placed once. We run a measured loop: every change is backed by behaviour data, shipped, and proven against your KPI." },
      { q: "Can we stop anytime?", a: "Yes. Monthly rolling, no long contract. The end of month 3 is a built-in decision point: continue or take the leak map and go." },
    ],
  },

  cta: {
    kicker: "Next step",
    title: "Let's look at the work\nyou shouldn't be doing.",
    subtitle: "A 30-minute call. We map one workflow, tell you if AI is the answer, and what it would take. No deck.",
    buttonLabel: "Book a call", buttonHref: "https://calendly.com/hiiive/get-to-know",
    altText: "or email hello@hiiive.ai",
  },
};
