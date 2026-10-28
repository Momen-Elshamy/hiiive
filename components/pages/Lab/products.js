// The AI Lab's products. The header's AI Lab menu, the /lab page and each
// product page all read from here, through labProducts(locale). Copy follows
// each product's own site (dvision.ai, myspoky.com, komplyo.de). `glows` is
// each product's halftone light (constant, so the canvases draw once); `ui`
// is the small illustrative window on the product page; `meta` is the product
// page's search title (topic only, the brand is added) and description.

const PRODUCTS = [
  {
    slug: "dvision",
    name: "Dvision",
    icon: "dvision",
    site: { label: "dvision.ai", href: "https://dvision.ai" },
    glows: [
      { x: 1, y: 0, r: 0.8, color: [42, 163, 201], strength: 0.75 },
      { x: 0, y: 1.05, r: 0.55, color: [96, 104, 230], strength: 0.35 },
    ],
    copy: {
      en: {
        meta: {
          title: "Dvision: Get Found in Search and AI Answers",
          description:
            "Dvision gets companies found in search and in AI answers: one growth engineer per company and a content system with a human expert in the loop.",
        },
        menu: "Organic visibility for the AI era, run as a system.",
        tagline: "From invisible to inevitable.",
        intro:
          "Dvision gets companies found, in search and in AI answers. One growth engineer per company and a content system with a human expert in the loop, for results that compound.",
        ui: {
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
      de: {
        meta: {
          title: "Dvision: Sichtbar in Suche und KI-Antworten",
          description:
            "Dvision macht Unternehmen in Suche und KI-Antworten auffindbar: ein Growth Engineer pro Unternehmen und ein Content-System mit Experten im Loop.",
        },
        menu: "Organische Sichtbarkeit im KI-Zeitalter.",
        tagline: "Von unsichtbar zu unübersehbar.",
        intro:
          "Dvision macht Unternehmen auffindbar, in der Suche und in KI-Antworten. Ein Growth Engineer pro Unternehmen und ein Content-System mit menschlicher Expertise im Loop, für Ergebnisse, die sich aufbauen.",
        ui: {
          status: "Content-System",
          rows: [
            { label: "Recherche", meta: "Fragen an Suche und KI", state: "done" },
            { label: "Entwurf", meta: "In Ihrer Stimme geschrieben", state: "done" },
            { label: "Expertenprüfung", meta: "In Arbeit", state: "active" },
            { label: "Veröffentlichen", meta: "Live auf Ihrer Website", state: "next" },
          ],
        },
        features: [
          { title: "Gefunden von Menschen und Modellen", body: "Seiten, die in der Suche ranken und in KI-Antworten zitiert werden." },
          { title: "Content als System", body: "Recherche, Schreiben und Veröffentlichen laufen als eine Pipeline, damit der Output stabil bleibt." },
          { title: "Ein Growth Engineer", body: "Eine Person verantwortet Ihre Sichtbarkeit, von der Strategie bis zur letzten Seite." },
          { title: "Ergebnisse, die sich aufbauen", body: "Jedes Stück baut auf dem letzten auf, und die Sichtbarkeit wächst weiter." },
        ],
      },
    },
  },
  {
    slug: "spoky",
    name: "Spoky",
    icon: "spoky",
    site: { label: "myspoky.com", href: "https://www.myspoky.com" },
    glows: [
      { x: 1, y: 0, r: 0.8, color: [240, 186, 96], strength: 0.7 },
      { x: 0, y: 1.05, r: 0.55, color: [42, 163, 201], strength: 0.3 },
    ],
    copy: {
      en: {
        meta: {
          title: "Spoky: AI PR Platform for Media Coverage",
          description:
            "Spoky is an AI PR platform for startups and businesses: it watches the media for you, finds the articles that matter and helps you pitch smarter.",
        },
        menu: "AI for PR: media monitoring and smarter pitches.",
        tagline: "PR outreach, automated with intelligence.",
        intro:
          "Spoky is an AI-powered PR platform for startups and businesses that want media coverage. It watches the media for you, finds the articles that matter, and helps you pitch smarter and track the results.",
        ui: {
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
      de: {
        meta: {
          title: "Spoky: KI-PR-Plattform für Medienpräsenz",
          description:
            "Spoky ist eine KI-PR-Plattform für Startups und Unternehmen: Sie beobachtet die Medien, findet die relevanten Artikel und hilft, besser zu pitchen.",
        },
        menu: "KI für PR: Medienbeobachtung und bessere Pitches.",
        tagline: "Intelligente PR-Arbeit mit KI.",
        intro:
          "Spoky ist eine KI-gestützte PR-Plattform für Startups und Unternehmen, die in die Medien wollen. Sie beobachtet die Medien für Sie, erkennt die relevanten Artikel und hilft Ihnen, besser zu pitchen und die Ergebnisse zu verfolgen.",
        ui: {
          status: "Medienbeobachtung",
          rows: [
            { label: "Neue Erwähnung", meta: "Fachpresse", state: "done" },
            { label: "Relevanter Artikel", meta: "Passt zu Ihren Themen", state: "active" },
            { label: "Pitch-Entwurf", meta: "Bereit zur Prüfung", state: "next" },
          ],
        },
        features: [
          { title: "Medienbeobachtung", body: "Spoky beobachtet News und Social Media für Ihre Marke und Ihre Themen, automatisch." },
          { title: "Die Artikel, die zählen", body: "KI sortiert, was relevant ist, damit Sie nur lesen, was eine Antwort wert ist." },
          { title: "Bessere Pitches", body: "Pitchen Sie Journalisten mit Kontext und bauen Sie die Beziehung über die Zeit auf." },
          { title: "Messbare Ergebnisse", body: "Sehen Sie an einem Ort, was jeder Pitch bringt." },
        ],
      },
    },
  },
  {
    slug: "komplyo",
    name: "Komplyo",
    icon: "komplyo",
    site: { label: "komplyo.de", href: "https://komplyo.de" },
    glows: [
      { x: 1, y: 0, r: 0.8, color: [96, 104, 230], strength: 0.75 },
      { x: 0, y: 1.05, r: 0.55, color: [159, 180, 200], strength: 0.3 },
    ],
    copy: {
      en: {
        meta: {
          title: "Komplyo: EU AI Act Compliance Software",
          description:
            "Komplyo is EU AI Act compliance software: your AI inventory, risk classes and documentation in one place, from the first AI system to the audit dossier.",
        },
        menu: "EU AI Act compliance, from inventory to audit.",
        tagline: "AI in use. Everything in view.",
        intro:
          "The EU AI Act applies to every company that uses AI, from a website chatbot to CV screening. Komplyo brings your AI inventory, risks and documentation into one place, from the first AI system to a finished audit dossier.",
        ui: {
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
      de: {
        meta: {
          title: "Komplyo: Software für EU-AI-Act-Compliance",
          description:
            "Komplyo ist Software für EU-AI-Act-Compliance: KI-Inventar, Risikoklassen und Dokumentation an einem Ort, vom ersten KI-System bis zum Audit-Dossier.",
        },
        menu: "EU-AI-Act-Compliance, vom Inventar bis zum Audit.",
        tagline: "KI im Einsatz. Alles im Blick.",
        intro:
          "Der EU AI Act gilt für jedes Unternehmen, das KI einsetzt, vom Website-Chatbot bis zum Bewerbungsscreening. Komplyo bringt Inventar, Risiken und Dokumentation an einen Ort, vom ersten KI-System bis zum fertigen Audit-Dossier.",
        ui: {
          status: "KI-Inventar",
          rows: [
            { label: "Website-Chatbot", meta: "Begrenztes Risiko", state: "done" },
            { label: "Bewerbungsscreening", meta: "Hohes Risiko", state: "active" },
            { label: "Übersetzungs-KI", meta: "Minimales Risiko", state: "done" },
          ],
        },
        features: [
          { title: "KI-Inventar", body: "Jedes KI-System Ihres Unternehmens in einem Register." },
          { title: "Risikoklassifizierung", body: "Ein geführter Fragebogen ordnet jedes System den Risikoklassen des AI Act zu." },
          { title: "Dokumente, generiert", body: "DSFA, technische Dokumentation, Transparenzhinweise und KI-Richtlinien, vorausgefüllt aus Ihren Daten, versioniert und druckfertig." },
          { title: "Audit-Dossier", body: "Alles, was ein Prüfer verlangt, in einem versionierten Dossier." },
        ],
      },
    },
  },
];

/** The products with their copy in a language (falling back to English). */
export function labProducts(locale = "en") {
  return PRODUCTS.map(({ copy, ...product }) => {
    const text = copy[locale] ?? copy.en;
    return { ...product, ...text, ui: { name: product.name, icon: product.icon, ...text.ui } };
  });
}

export const productBySlug = (slug, locale) => labProducts(locale).find((product) => product.slug === slug);
