// One-off: save the image alt texts (DVT-705) into the CMS, in English and
// German, so they show on the site and editors can change them in admin.
//
//   node scripts/save-image-alts.mjs           # dry run: prints the changes
//   node scripts/save-image-alts.mjs --write   # applies them
//
// It fills the About page's three image alt fields, each published case
// study's "Card photo alt text" (on its hero block; the /work cards and the
// home cases read it from there), and the photo alt of each "Home · Work" card
// on any page, global or content item. It only fills an empty field, and only
// while the block still shows the image the text describes, so nothing an
// editor typed or changed is overwritten. Before writing it backs the docs up to
// .cms-backups/; each write only lands if the doc is unchanged since it was read.
import fs from "node:fs";
import mongoose from "mongoose";

const WRITE = process.argv.includes("--write");
process.loadEnvFile(".env.local");

// About page blocks: [block type, image prop, alt prop, image the block ships with, alts].
const ABOUT = [
  ["AboutHeroBlock", "imageUrl", "imageAlt", "/img/about-hero.jpg", {
    en: "Glowing yellow light trail looping through a dark 3D ribbon",
    de: "Leuchtende gelbe Lichtspur, die sich durch ein dunkles 3D-Band windet",
  }],
  ["AboutFlywheelBlock", "loopImage", "loopImageAlt", "/img/about-flywheel.png", {
    en: "Flywheel diagram: AI Lab and AI Engineering as two connected loops",
    de: "Flywheel-Diagramm: AI Lab und AI Engineering als zwei verbundene Kreisläufe",
  }],
  ["AboutHiveBlock", "imageUrl", "imageAlt", "/img/about-office.jpg", {
    en: "The hiiive team laughing around a table in the Berlin-Spandau office",
    de: "Das hiiive-Team lacht gemeinsam an einem Tisch im Büro in Berlin-Spandau",
  }],
];

// Case study items by slug: [card image (metadata.image), alts].
const CASES = {
  "mindverse-organic-engine": ["/img/case-mindverse.png", {
    en: "Mindverse banner reading “Secure AI ecosystem to boost your creativity and productivity” beside an isometric line drawing of an AI platform",
    de: "Mindverse-Banner mit dem Slogan „Secure AI ecosystem to boost your creativity and productivity“ neben einer isometrischen Strichzeichnung einer KI-Plattform",
  }],
  "ahead-fibo-game": ["/img/case-ahead.jpg", {
    en: "The colourful ahead booth at FIBO 2026 with the game screen",
    de: "Der bunte ahead-Stand auf der FIBO 2026 mit dem Spiel-Screen",
  }],
  "wavelr-pv-marketplace": ["/img/case-wavelr.jpg", {
    en: "Rows of solar panels in a green field under a cloudy sky",
    de: "Reihen von Solarmodulen auf einer Wiese unter bewölktem Himmel",
  }],
};

// "Home · Work" (HomeWorkBlock) card photos by URL: alts. These are the block's
// default photos; cards saved before the alt field existed have none.
const HOME_WORK = {
  "https://images.unsplash.com/photo-1653347094887-e1d2edbfad5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080": {
    en: "A person holding a yellow bag in a long warehouse aisle lined with shelves",
    de: "Eine Person mit einer gelben Tasche in einem langen Lagergang zwischen Regalen",
  },
  "https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080": {
    en: "Two developers looking at code on a laptop and a monitor",
    de: "Zwei Entwickler schauen sich Code auf einem Laptop und einem Monitor an",
  },
  "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080": {
    en: "Potted plants on wooden stools and shelves by a bright shop window",
    de: "Topfpflanzen auf Holzhockern und Regalen vor einem hellen Schaufenster",
  },
};

/** Every block of a type anywhere in the Puck data (content, zones, slots). */
function blocksOf(node, type, out = []) {
  if (Array.isArray(node)) node.forEach((n) => blocksOf(n, type, out));
  else if (node && typeof node === "object") {
    if (node.type === type && node.props) out.push(node);
    Object.values(node).forEach((v) => blocksOf(v, type, out));
  }
  return out;
}

/** Sets imageAlt on each HomeWorkBlock card that has none and shows a known photo. */
function fillHomeWork(data, locale, notes) {
  let changed = false;
  for (const block of blocksOf(data, "HomeWorkBlock")) {
    for (const card of block.props.cases || []) {
      if (!card.image) continue;
      const name = `HomeWorkBlock card "${card.title || card.category}"`;
      const alt = HOME_WORK[card.image]?.[locale];
      if (card.imageAlt) notes.push(`${name}: already has "${card.imageAlt}"`);
      else if (!alt) notes.push(`${name}: no alt for ${card.image}, left empty`);
      else {
        card.imageAlt = alt;
        notes.push(`${name}.imageAlt = "${alt}"`);
        changed = true;
      }
    }
  }
  return changed;
}

/** Sets props[altProp] = alt on the first block of a type, if empty and still showing src. */
function fill(data, type, imageProp, altProp, src, alt, notes) {
  const block = data.content?.find((b) => b.type === type);
  if (!block) return notes.push(`${type}: not on the page`), false;
  const props = block.props || {};
  if (props[altProp]) return notes.push(`${type}: already has "${props[altProp]}"`), false;
  // A missing image prop renders the block's default image.
  if (imageProp && (props[imageProp] ?? src) !== src) return notes.push(`${type}: shows another image, left empty`), false;
  block.props = { ...props, [altProp]: alt };
  notes.push(`${type}.${altProp} = "${alt}"`);
  return true;
}

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
const db = mongoose.connection.db;
const pages = db.collection("pages");
const items = db.collection("contentitems");
const globals = db.collection("globals");
const caseType = await db.collection("contenttypes").findOne({ slug: "case-study" });

const homeWork = { content: { $regex: "HomeWorkBlock" } };
const caseItems = caseType
  ? await items.find({ contentType: caseType._id, slug: { $in: Object.keys(CASES) }, published: true }).toArray()
  : [];
const found = [
  ...(await pages.find({ $or: [{ slug: "about" }, homeWork] }).toArray()).map((doc) => ({ col: pages, name: `page ${doc.locale} /${doc.slug}`, doc })),
  ...(await globals.find(homeWork).toArray()).map((doc) => ({ col: globals, name: `global ${doc.locale} ${doc.key}`, doc })),
  ...caseItems.map((doc) => ({ col: items, name: `case study ${doc.locale} /${doc.slug}`, doc, isCase: true })),
  ...(await items.find(homeWork).toArray()).map((doc) => ({ col: items, name: `item ${doc.locale} /${doc.slug}`, doc })),
];
// A case study that also holds a HomeWorkBlock is found twice; keep the first.
const seen = new Set();
const docs = found.filter(({ doc }) => !seen.has(String(doc._id)) && seen.add(String(doc._id)));

const changes = [];
for (const { col, name, doc, isCase } of docs) {
  const alts = (byLocale) => byLocale[doc.locale];
  const data = JSON.parse(doc.content || "{}");
  const notes = [];
  let changed = false;

  if (col === pages && doc.slug === "about") {
    for (const [type, imageProp, altProp, src, byLocale] of ABOUT) {
      if (alts(byLocale)) changed = fill(data, type, imageProp, altProp, src, alts(byLocale), notes) || changed;
    }
  } else if (isCase) {
    const [src, byLocale] = CASES[doc.slug];
    if (doc.metadata?.image !== src) notes.push(`card shows ${doc.metadata?.image || "no image"}, left empty`);
    else if (alts(byLocale)) changed = fill(data, "CaseStudyHeroBlock", null, "cardImageAlt", src, alts(byLocale), notes);
  }
  changed = fillHomeWork(data, doc.locale, notes) || changed;

  console.log(`${name}:\n  ${notes.join("\n  ")}`);
  if (changed) changes.push({ col, name, doc, content: JSON.stringify(data) });
}

if (!WRITE) {
  console.log(`\n${changes.length} doc(s) to change. Dry run. Add --write to apply.`);
} else if (changes.length) {
  fs.mkdirSync(".cms-backups", { recursive: true });
  const backup = `.cms-backups/image-alts-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  fs.writeFileSync(backup, JSON.stringify(changes.map(({ doc }) => doc), null, 2));
  console.log(`\nbackup: ${backup}`);

  for (const { col, name, doc, content } of changes) {
    const result = await col.updateOne({ _id: doc._id, updatedAt: doc.updatedAt }, { $set: { content, updatedAt: new Date() } });
    console.log(`${name}: ${result.modifiedCount === 1 ? "written" : "SKIPPED (changed since read, run again)"}`);
  }
}

await mongoose.disconnect();
