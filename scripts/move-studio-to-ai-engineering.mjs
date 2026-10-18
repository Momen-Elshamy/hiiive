// One-off: move the AI Engineering pages from /studio to /ai-engineering.
//
// Run it once, AFTER the code that follows CMS redirects is live
// (app/(site)/[...path]/page.jsx); before that, old /studio links would 404.
//
//   node scripts/move-studio-to-ai-engineering.mjs           # dry run: prints the changes
//   node scripts/move-studio-to-ai-engineering.mjs --write   # applies them
//
// It renames the page slugs (every locale), adds 301 redirects from the old
// paths, points every /studio link in the header, footer and pages at
// /ai-engineering, and links the old home's AI Lab card to /lab. Before writing
// it backs the docs up to .cms-backups/; each write only lands if the doc is
// unchanged since it was read, so an edit made in the meantime is skipped.
import fs from "node:fs";
import mongoose from "mongoose";

const WRITE = process.argv.includes("--write");
process.loadEnvFile(".env.local");

const MOVES = [
  ["studio", "ai-engineering"],
  ["studio/mvp-build", "ai-engineering/mvp-build"],
];
// "/studio…" and "/de/studio…" in links (also inside HTML in JSON), never the word in text.
const LINK = /(^|[^\w-])((?:\/[a-z]{2})?)\/studio(?=$|[/#?"'\s<)\\])/g;

function relink(content) {
  let count = 0;
  const next = content.replace(LINK, (match, before, locale) => {
    count += 1;
    return `${before}${locale}/ai-engineering`;
  });
  return { next, count };
}

/** The old home's AI Lab card linked to "#work" until the AI Lab pages existed. */
function linkLabCard(content, locale) {
  const data = JSON.parse(content);
  const pillars = data.content?.find((block) => block.type === "HomePillarsBlock");
  if (!pillars || pillars.props.labLinkHref !== "#work") return { next: content, count: 0 };
  pillars.props.labLinkHref = locale === "en" ? "/lab" : `/${locale}/lab`;
  return { next: JSON.stringify(data), count: 1 };
}

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
const db = mongoose.connection.db;
const pages = db.collection("pages");
const globals = db.collection("globals");
const redirects = db.collection("redirects");

const docs = [
  ...(await pages.find({}).toArray()).map((doc) => ({ col: pages, name: `page ${doc.locale} /${doc.slug}`, doc })),
  ...(await globals.find({}).toArray()).map((doc) => ({ col: globals, name: `global ${doc.locale} ${doc.key}`, doc })),
];

const changes = [];
for (const { col, name, doc } of docs) {
  const set = {};
  const move = MOVES.find(([from]) => doc.slug === from);
  if (col === pages && move) set.slug = move[1];

  if (typeof doc.content === "string" && doc.content.startsWith("{")) {
    let { next, count } = relink(doc.content);
    if (col === pages && doc.slug === "home") {
      const lab = linkLabCard(next, doc.locale);
      next = lab.next;
      count += lab.count;
    }
    if (count) set.content = next;
    if (count) set.links = count;
  }
  if (Object.keys(set).length) changes.push({ col, name, doc, set });
}

for (const { name, set } of changes) {
  console.log(`${name}: ${set.slug ? `slug -> ${set.slug}` : ""}${set.slug && set.links ? ", " : ""}${set.links ? `${set.links} link(s)` : ""}`);
}
for (const [from, to] of MOVES) console.log(`redirect /${from} -> /${to} (301, every locale)`);

if (!WRITE) {
  console.log("\nDry run. Add --write to apply.");
} else {
  fs.mkdirSync(".cms-backups", { recursive: true });
  const backup = `.cms-backups/move-studio-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  fs.writeFileSync(backup, JSON.stringify(changes.map(({ doc }) => doc), null, 2));
  console.log(`\nbackup: ${backup}`);

  for (const { col, name, doc, set } of changes) {
    const { links, ...fields } = set;
    const result = await col.updateOne({ _id: doc._id, updatedAt: doc.updatedAt }, { $set: { ...fields, updatedAt: new Date() } });
    console.log(`${name}: ${result.modifiedCount === 1 ? "written" : "SKIPPED (changed since read)"}`);
  }
  const now = new Date();
  for (const [from, to] of MOVES) {
    await redirects.updateOne(
      { fromPath: `/${from}`, locale: null },
      {
        $set: { toPath: `/${to}`, statusCode: 301, source: "manual", updatedAt: now },
        $setOnInsert: { hits: 0, lastHitAt: null, createdAt: now },
      },
      { upsert: true },
    );
    console.log(`redirect /${from} -> /${to}: written`);
  }
}

await mongoose.disconnect();
