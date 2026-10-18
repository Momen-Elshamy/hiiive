// The AI Lab's products. The header's AI Lab menu, the /lab page and each
// product page all read from here. Copy follows each product's own site
// (dvision.ai, myspoky.com, komplyo.de). `glows` is each product's halftone
// light (constant, so the canvases draw once); `ui` is the small illustrative
// window on the product page.

export const PRODUCTS = [
  {
    slug: "dvision",
    name: "Dvision",
    icon: "chart",
    site: { label: "dvision.ai", href: "https://dvision.ai" },
    menu: "Organic visibility for the AI era, run as a system.",
    tagline: "From invisible to inevitable.",
    intro:
      "Dvision gets companies found, in search and in AI answers. One growth engineer per company and a content system with a human expert in the loop, for results that compound.",
    glows: [
      { x: 1, y: 0, r: 0.8, color: [42, 163, 201], strength: 0.75 },
      { x: 0, y: 1.05, r: 0.55, color: [96, 104, 230], strength: 0.35 },
    ],
    ui: {
      name: "Dvision",
      status: "Content system",
      rows: [
        { label: "Research", meta: "Questions people ask search and AI", state: "done" },
        { label: "Draft", meta: "Written in your voice", state: "done" },
        { label: "Expert review", meta: "In progress", state: "active" },
        { label: "Publish", meta: "Live on your site", state: "next" },
      ],
    },
    features: [
      { title: "Found by people and by models", body: "Pages built to rank in search and to be quoted in AI answers." },
      { title: "Content as a system", body: "Research, writing and publishing run as one pipeline, so the output stays steady." },
      { title: "One growth engineer", body: "One person owns your visibility, from the strategy to the last page." },
      { title: "Results that compound", body: "Every piece builds on the last, so visibility keeps growing." },
    ],
  },
  {
    slug: "spoky",
    name: "Spoky",
    icon: "message",
    site: { label: "myspoky.com", href: "https://www.myspoky.com" },
    menu: "AI for PR: media monitoring and smarter pitches.",
    tagline: "PR outreach, automated with intelligence.",
    intro:
      "Spoky is an AI-powered PR platform for startups and businesses that want media coverage. It watches the media for you, finds the articles that matter, and helps you pitch smarter and track the results.",
    glows: [
      { x: 1, y: 0, r: 0.8, color: [240, 186, 96], strength: 0.7 },
      { x: 0, y: 1.05, r: 0.55, color: [42, 163, 201], strength: 0.3 },
    ],
    ui: {
      name: "Spoky",
      status: "Media monitor",
      rows: [
        { label: "New mention", meta: "Trade press", state: "done" },
        { label: "Relevant article", meta: "Matches your topics", state: "active" },
        { label: "Pitch draft", meta: "Ready for review", state: "next" },
      ],
    },
    features: [
      { title: "Media monitoring", body: "Spoky watches news and social media for your brand and topics, automatically." },
      { title: "The articles that matter", body: "AI sorts what is relevant, so you only read what is worth a reply." },
      { title: "Smarter pitches", body: "Pitch journalists with context and build the relationship over time." },
      { title: "Results you can track", body: "See what every pitch brings in, in one place." },
    ],
  },
  {
    slug: "komplyo",
    name: "Komplyo",
    icon: "shield",
    site: { label: "komplyo.de", href: "https://komplyo.de" },
    menu: "EU AI Act compliance, from inventory to audit.",
    tagline: "AI in use. Everything in view.",
    intro:
      "The EU AI Act applies to every company that uses AI, from a website chatbot to CV screening. Komplyo brings your AI inventory, risks and documentation into one place, from the first AI system to a finished audit dossier.",
    glows: [
      { x: 1, y: 0, r: 0.8, color: [96, 104, 230], strength: 0.75 },
      { x: 0, y: 1.05, r: 0.55, color: [159, 180, 200], strength: 0.3 },
    ],
    ui: {
      name: "Komplyo",
      status: "AI inventory",
      rows: [
        { label: "Website chatbot", meta: "Limited risk", state: "done" },
        { label: "CV screening", meta: "High risk", state: "active" },
        { label: "Translation AI", meta: "Minimal risk", state: "done" },
      ],
    },
    features: [
      { title: "AI inventory", body: "Every AI system your company uses, in one register." },
      { title: "Risk classification", body: "A guided questionnaire sorts each system into the AI Act's risk classes." },
      { title: "Documents, generated", body: "DPIA, technical documentation, transparency notices and AI policies, prefilled from your data, versioned and ready to print." },
      { title: "Audit dossier", body: "Everything an auditor asks for, in one versioned dossier." },
    ],
  },
];

export const productBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug);
