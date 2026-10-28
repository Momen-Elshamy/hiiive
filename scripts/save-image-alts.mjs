// One-off: save the image alt texts (DVT-705) into the CMS, in English and
// German, so they show on the site and editors can change them in admin.
//
//   node scripts/save-image-alts.mjs           # dry run: prints the changes
//   node scripts/save-image-alts.mjs --write   # applies them
//
// It fills the About page's three image alt fields and each published case
// study's "Card photo alt text" (on its hero block; the /work cards and the
// home cases read it from there). It only fills an empty field, and only while
// the block still shows the image the text describes, so nothing an editor
// typed or changed is overwritten. Before writing it backs the docs up to
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
const caseType = await db.collection("contenttypes").findOne({ slug: "case-study" });

const docs = [
  ...(await pages.find({ slug: "about" }).toArray()).map((doc) => ({ col: pages, name: `page ${doc.locale} /about`, doc })),
  ...(caseType
    ? await items.find({ contentType: caseType._id, slug: { $in: Object.keys(CASES) }, published: true }).toArray()
    : []
  ).map((doc) => ({ col: items, name: `case study ${doc.locale} /${doc.slug}`, doc })),
];

const changes = [];
for (const { col, name, doc } of docs) {
  const alts = (byLocale) => byLocale[doc.locale];
  const data = JSON.parse(doc.content || "{}");
  const notes = [];
  let changed = false;

  if (col === pages) {
    for (const [type, imageProp, altProp, src, byLocale] of ABOUT) {
      if (alts(byLocale)) changed = fill(data, type, imageProp, altProp, src, alts(byLocale), notes) || changed;
    }
  } else {
    const [src, byLocale] = CASES[doc.slug];
    if (doc.metadata?.image !== src) notes.push(`card shows ${doc.metadata?.image || "no image"}, left empty`);
    else if (alts(byLocale)) changed = fill(data, "CaseStudyHeroBlock", null, "cardImageAlt", src, alts(byLocale), notes);
  }

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
