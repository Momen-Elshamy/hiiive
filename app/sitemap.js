import { siteConfig } from "@/site.config";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Locale-aware URL: en lives at /slug, other locales at /<locale>/slug. */
function urlFor(slug, locale) {
  const prefix = locale && locale !== DEFAULT_LOCALE ? `/${locale}` : "";
  return `${SITE_URL}${prefix}${slug ? `/${slug}` : prefix ? "" : "/"}`;
}

function isNoIndex(content) {
  try {
    const data = typeof content === "string" ? JSON.parse(content) : content;
    const v = data?.root?.props?.noIndex;
    return v === true || v === "true";
  } catch {
    return false;
  }
}

export default async function sitemap() {
  const connectDB = await siteConfig.getConnectDB();
  await connectDB();
  const models = await siteConfig.getModels();
  const { Page, ContentType, ContentItem } = models;

  const entries = [];
  const seen = new Set();
  const push = (url, extra) => {
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, changeFrequency: "weekly", ...extra });
  };

  // Standalone pages. The "home" slug is the site root, not /home.
  const pages = await Page.find({ published: true }, { slug: 1, locale: 1, updatedAt: 1, content: 1 }).lean();
  for (const page of pages) {
    if (isNoIndex(page.content)) continue;
    const slug = page.slug === "home" ? "" : page.slug;
    push(urlFor(slug, page.locale), {
      lastModified: page.updatedAt,
      priority: slug === "" ? 1.0 : 0.8,
    });
  }

  // Content items (case studies etc.) under their content type's urlPrefix.
  const contentTypes = await ContentType.find({}, { _id: 1, urlPrefix: 1 }).lean();
  const ctMap = Object.fromEntries(contentTypes.map((ct) => [ct._id.toString(), ct.urlPrefix]));

  const items = await ContentItem.find(
    { published: true },
    { slug: 1, locale: 1, contentType: 1, updatedAt: 1, content: 1 },
  ).lean();

  // llms.txt is a real crawlable resource, not a page — list it so AI-readiness
  // checkers and crawlers find it without having to guess the path.
  push(`${SITE_URL}/llms.txt`, { changeFrequency: "monthly", priority: 0.3 });

  for (const item of items) {
    if (isNoIndex(item.content)) continue;
    const prefix = ctMap[item.contentType.toString()];
    if (!prefix) continue;
    const slug = `${prefix.replace(/^\//, "")}/${item.slug}`;
    push(urlFor(slug, item.locale), { lastModified: item.updatedAt, priority: 0.6 });
  }

  return entries;
}
