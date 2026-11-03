// The AI Lab pages' own words in each language (the products' copy is in
// products.js). {name} and {site} are filled in per product.

const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

export const LAB_COPY = {
  en: {
    meta: {
      title: "AI Lab: AI Products for Companies",
      description:
        "Products that started as work for one company and are made for many: Dvision for AI search visibility, Spoky for PR and Komplyo for EU AI Act compliance.",
    },
    kicker: "AI Lab",
    title: ["Built with one.", "Made for many."],
    intro:
      "Every product in the lab started as work for one company. We run them in our own company first, then make them for everyone with the same problem.",
    learnMore: "Learn more",
    crumb: "AI Lab",
    visit: "Visit {site}",
    bookCall: { label: "Book a call", href: BOOK_A_CALL },
    whatKicker: "What it does",
    whatTitle: "What {name} does.",
    moreKicker: "AI Lab",
    moreTitle: "More from the lab.",
    cta: {
      kicker: "Your turn",
      title: "Bring us your hardest problem.",
      body: "Tell us what slows your team down. We'll show you what AI can do about it, and how fast.",
      primary: { label: "Book a call", href: BOOK_A_CALL },
      secondary: { label: "See what we build", href: "/work" },
    },
  },
  de: {
    meta: {
      title: "KI-Lab: KI-Produkte für Unternehmen",
      description:
        "Produkte, die als Arbeit für ein Unternehmen begannen und für viele gemacht sind: Dvision für KI-Sichtbarkeit, Spoky für PR, Komplyo für den EU AI Act.",
    },
    kicker: "KI-Lab",
    title: ["Mit einem gebaut.", "Für viele gemacht."],
    intro:
      "Jedes Produkt im Lab begann als Arbeit für ein Unternehmen. Wir nutzen es zuerst in unserem eigenen Unternehmen und machen es dann für alle mit demselben Problem.",
    learnMore: "Mehr erfahren",
    crumb: "KI-Lab",
    visit: "{site} besuchen",
    bookCall: { label: "Termin buchen", href: BOOK_A_CALL },
    whatKicker: "Was es kann",
    whatTitle: "Was {name} kann.",
    moreKicker: "KI-Lab",
    moreTitle: "Mehr aus dem Lab.",
    cta: {
      kicker: "Sie sind dran",
      title: "Bringen Sie uns Ihr schwierigstes Problem.",
      body: "Erzählen Sie uns, was Ihr Team ausbremst. Wir zeigen Ihnen, was KI dagegen tun kann, und wie schnell.",
      primary: { label: "Termin buchen", href: BOOK_A_CALL },
      secondary: { label: "Projekte ansehen", href: "/de/work" },
    },
  },
};

/** The lab's words for a locale, falling back to English. */
export const labCopy = (locale) => LAB_COPY[locale] ?? LAB_COPY.en;

/** Fills {name} / {site} in a phrase. */
export const fill = (phrase, values) => phrase.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
