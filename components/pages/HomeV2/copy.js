// The home page's copy in each language (en, de). Visual settings (images,
// logos, light, chart data) stay in the components; everything a visitor
// reads lives here. The 3D factory's small plate labels stay in English.

const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

export const HOME_COPY = {
  en: {
    meta: {
      title: "HIIIVE — AI lab & tech house, Berlin",
      description:
        "The lab where AI gets to work on your hardest problems. Smart people and smart systems, inventing AI products, agents and software for real companies.",
    },
    preloader: { label: "Opening the lab", ariaLabel: "Loading the page" },
    story: {
      ariaLabel: "The Hiiive story",
      hero: {
        kicker: "Hiiive · AI lab & tech house, Berlin",
        headline: "The lab where AI gets to work",
        accent: "on your hardest problems.",
        sub: "Smart people and smart systems, inventing AI products, agents and software, and putting them to work for real companies.",
        primary: { label: "Book a call", href: BOOK_A_CALL },
        secondary: { label: "See what we build", href: "/work" },
        capabilities: ["AI agents", "SaaS products", "Custom software", "AI-powered SEO & GEO"],
      },
      spark: {
        kicker: "01 · The spark",
        title: "We find the pattern in the noise.",
        body: "A senior crew of engineers and AI specialists. We spot the work companies keep doing by hand, and build the AI that does it for them.",
      },
      factory: {
        kicker: "02 · The software factory",
        title: "Problems go in. Working software comes out.",
      },
      // The factory's five stations, in the order of factory.checkpoints.
      stations: [
        { key: "intake", step: "01", title: "Intake", body: "Real problems in. We start inside your team, with the work that slows it down." },
        { key: "lab", step: "02", title: "AI lab", body: "We design the models and agents that can take that work on." },
        { key: "build", step: "03", title: "Build line", body: "Engineers and AI turn it into real software and internal tools, fast." },
        { key: "gate", step: "04", title: "Quality gate", body: "Only what works in production ships. The rest goes back in." },
        { key: "output", step: "05", title: "Shipped", body: "SaaS products, AI agents, custom software and AI-powered SEO & GEO." },
      ],
      cta: {
        kicker: "Your turn",
        title: "Bring us your hardest problem.",
        body: "Tell us what slows your team down. We'll show you what AI can do about it, and how fast.",
        primary: { label: "Book a call", href: BOOK_A_CALL },
        secondary: { label: "See what we build", href: "/work" },
      },
      hint: "Scroll",
    },
    why: {
      kicker: "Why Hiiive",
      title: "An AI lab, not an agency.",
      intro: "Agencies deliver a project and move on. We build our own products, run on our own AI, and keep building what we ship.",
      partnersLabel: "Part of Germany's AI ecosystem",
      statement: {
        lines: ["Built with one.", "Made for many."],
        body: "What we build with one company becomes a product the next one starts from, and every build makes it better.",
      },
      ourselves: {
        title: "We run it ourselves first.",
        body: "Dvision, Spoky and Komplyo, and the AI behind our services, run in our own company before they reach yours. Our money and our risk go first.",
        window: { name: "Dvision", status: "Running at Hiiive" },
        command: "$ ship dvision --to your-team",
      },
      team: {
        title: "Senior people, inside your team.",
        body: "The people you meet are the people who build. No layers, no hand-offs.",
        roles: { roman: "Co-founder & MD", noel: "Co-founder & MD", momen: "CTO" },
      },
      handover: {
        lines: ["Live is the start,", "not the handover."],
        body: "We stay on what we ship and keep improving it while your team uses it.",
        // Illustrative release notes, faint in the background.
        log: [
          "v2.4.0  new agent: invoice matching",
          "v2.3.2  faster replies in German",
          "v2.3.0  connected to your CRM",
          "v2.2.1  human review for edge cases",
          "v2.2.0  weekly report to your inbox",
          "v2.1.0  second team onboarded",
          "v2.0.0  live in production",
        ],
      },
    },
    cases: {
      kicker: "04 · Proof",
      title: "Proof, not promises.",
      intro: "Every project shipped to production and is still running. Numbers are measured and agreed with the client.",
      all: { label: "All case studies", href: "/work" },
      read: "Read the case study",
      previous: "Previous case",
      next: "Next case",
      // Same wording and numbers as the live /work pages.
      items: {
        mindverse: {
          tag: "SEO & digital presence",
          stat: "3.4×",
          statLabel: "organic sessions in 12 months",
          title: "The organic engine behind a leading German AI platform.",
          href: "/work/mindverse-organic-engine",
        },
        ahead: {
          tag: "Event game",
          stat: "2 wks",
          statLabel: "to build it for ahead's booth at FIBO 2026",
          title: "An offline-first big-screen game with a mobile control panel.",
          href: "/work/ahead-fibo-game",
          imageAlt: "The colourful ahead booth at FIBO 2026 with the game screen",
        },
        wavelr: {
          tag: "MVP & SEO",
          stat: "8 wks",
          statLabel: "to a live marketplace, built from zero",
          title: "The verified-PV marketplace for the German solar market.",
          href: "/work/wavelr-pv-marketplace",
          imageAlt: "Rows of solar panels in a field under a cloudy sky",
        },
      },
      nextStep: {
        kicker: "Next step",
        title: "Let's look at the work you shouldn't be doing.",
        body: "A 30-minute call. We map one workflow, tell you if AI is the answer, and what it would take. No deck.",
        cta: "Book a call",
        href: BOOK_A_CALL,
      },
    },
  },

  de: {
    meta: {
      title: "HIIIVE — KI-Lab & Tech House, Berlin",
      description:
        "Das Lab, in dem KI Ihre schwierigsten Probleme anpackt. Kluge Köpfe und kluge Systeme entwickeln KI-Produkte, Agenten und Software für echte Unternehmen.",
    },
    preloader: { label: "Das Lab öffnet", ariaLabel: "Seite wird geladen" },
    story: {
      ariaLabel: "Die Hiiive-Geschichte",
      hero: {
        kicker: "Hiiive · KI-Lab & Tech House, Berlin",
        headline: "Das Lab, in dem KI anpackt:",
        accent: "Ihre schwierigsten Probleme.",
        sub: "Kluge Köpfe und kluge Systeme: Wir entwickeln KI-Produkte, Agenten und Software und bringen sie in echten Unternehmen zum Einsatz.",
        primary: { label: "Termin buchen", href: BOOK_A_CALL },
        secondary: { label: "Projekte ansehen", href: "/de/work" },
        capabilities: ["KI-Agenten", "SaaS-Produkte", "Individuelle Software", "KI-gestütztes SEO & GEO"],
      },
      spark: {
        kicker: "01 · Der Funke",
        title: "Wir finden das Muster im Rauschen.",
        body: "Ein erfahrenes Team aus Engineers und KI-Spezialisten. Wir erkennen die Arbeit, die Unternehmen noch von Hand erledigen, und bauen die KI, die sie ihnen abnimmt.",
      },
      factory: {
        kicker: "02 · Die Software-Fabrik",
        title: "Probleme rein. Funktionierende Software raus.",
      },
      stations: [
        { key: "intake", step: "01", title: "Eingang", body: "Echte Probleme rein. Wir starten in Ihrem Team, mit der Arbeit, die es ausbremst." },
        { key: "lab", step: "02", title: "KI-Lab", body: "Wir entwerfen die Modelle und Agenten, die diese Arbeit übernehmen können." },
        { key: "build", step: "03", title: "Fertigung", body: "Engineers und KI machen daraus echte Software und interne Tools, schnell." },
        { key: "gate", step: "04", title: "Qualitätsprüfung", body: "Nur was in Produktion funktioniert, wird ausgeliefert. Der Rest geht zurück." },
        { key: "output", step: "05", title: "Ausgeliefert", body: "SaaS-Produkte, KI-Agenten, individuelle Software und KI-gestütztes SEO & GEO." },
      ],
      cta: {
        kicker: "Sie sind dran",
        title: "Bringen Sie uns Ihr schwierigstes Problem.",
        body: "Erzählen Sie uns, was Ihr Team ausbremst. Wir zeigen Ihnen, was KI dagegen tun kann, und wie schnell.",
        primary: { label: "Termin buchen", href: BOOK_A_CALL },
        secondary: { label: "Projekte ansehen", href: "/de/work" },
      },
      hint: "Scrollen",
    },
    why: {
      kicker: "Warum Hiiive",
      title: "Ein KI-Lab, keine Agentur.",
      intro: "Agenturen liefern ein Projekt ab und ziehen weiter. Wir bauen eigene Produkte, arbeiten mit unserer eigenen KI und entwickeln weiter, was wir ausliefern.",
      partnersLabel: "Teil des deutschen KI-Ökosystems",
      statement: {
        lines: ["Mit einem gebaut.", "Für viele gemacht."],
        body: "Was wir mit einem Unternehmen bauen, wird zum Produkt, mit dem das nächste startet. Und jedes Projekt macht es besser.",
      },
      ourselves: {
        title: "Wir nutzen es zuerst selbst.",
        body: "Dvision, Spoky und Komplyo und die KI hinter unseren Leistungen laufen zuerst in unserem eigenen Unternehmen, bevor sie zu Ihnen kommen. Unser Geld und unser Risiko gehen voran.",
        window: { name: "Dvision", status: "Läuft bei Hiiive" },
        command: "$ ship dvision --to your-team",
      },
      team: {
        title: "Erfahrene Leute, mitten in Ihrem Team.",
        body: "Die Menschen, die Sie treffen, sind die, die bauen. Keine Ebenen, keine Übergaben.",
        roles: { roman: "Mitgründer & Geschäftsführer", noel: "Mitgründer & Geschäftsführer", momen: "CTO" },
      },
      handover: {
        lines: ["Live ist der Anfang,", "nicht die Übergabe."],
        body: "Wir bleiben an dem dran, was wir ausliefern, und verbessern es weiter, während Ihr Team damit arbeitet.",
        log: [
          "v2.4.0  neuer Agent: Rechnungsabgleich",
          "v2.3.2  schnellere Antworten auf Deutsch",
          "v2.3.0  mit Ihrem CRM verbunden",
          "v2.2.1  menschliche Prüfung für Sonderfälle",
          "v2.2.0  Wochenbericht in Ihr Postfach",
          "v2.1.0  zweites Team onboardet",
          "v2.0.0  live in Produktion",
        ],
      },
    },
    cases: {
      kicker: "04 · Belege",
      title: "Belege statt Versprechen.",
      intro: "Jedes Projekt ist in Produktion gegangen und läuft bis heute. Die Zahlen sind gemessen und mit dem Kunden abgestimmt.",
      all: { label: "Alle Case Studies", href: "/de/work" },
      read: "Case Study lesen",
      previous: "Vorheriges Projekt",
      next: "Nächstes Projekt",
      // Same wording and numbers as the live /de/work pages.
      items: {
        mindverse: {
          tag: "SEO & Digitale Präsenz",
          stat: "3,4×",
          statLabel: "organische Sessions in 12 Monaten",
          title: "Der organische Motor hinter einer führenden deutschen KI-Plattform.",
          href: "/de/work/mindverse-organic-engine",
        },
        ahead: {
          tag: "Event-Game",
          stat: "2 Wo.",
          statLabel: "für den ahead-Stand auf der FIBO 2026 gebaut",
          title: "Ein Offline-First-Game für den großen Screen mit mobilem Control-Panel.",
          href: "/de/work/ahead-fibo-game",
          imageAlt: "Der bunte ahead-Stand auf der FIBO 2026 mit dem Spiel-Screen",
        },
        wavelr: {
          tag: "MVP & SEO",
          stat: "8 Wo.",
          statLabel: "bis zum Live-Marktplatz, von null gebaut",
          title: "Der Marktplatz für geprüfte PV-Assets im deutschen Solarmarkt.",
          href: "/de/work/wavelr-pv-marketplace",
          imageAlt: "Reihen von Solarmodulen auf einer Wiese unter bewölktem Himmel",
        },
      },
      nextStep: {
        kicker: "Nächster Schritt",
        title: "Schauen wir uns die Arbeit an, die Sie nicht machen sollten.",
        body: "Ein 30-minütiges Gespräch. Wir skizzieren einen Workflow und sagen Ihnen, ob KI die Antwort ist und was es dafür braucht. Ohne Foliensatz.",
        cta: "Termin buchen",
        href: BOOK_A_CALL,
      },
    },
  },
};

/** The copy for a locale, falling back to English. */
export const homeCopy = (locale) => HOME_COPY[locale] ?? HOME_COPY.en;
