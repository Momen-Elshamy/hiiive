import { Render } from "@puckeditor/core/rsc";
import { siteConfig } from "@/site.config";
import { isCmsDbEnabled } from "@/lib/cms-mode";
import { resolveLocale, findLocalized, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePuckData(content) {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.content)) {
      return parsed;
    }
  } catch { /* not valid Puck JSON */ }
  return null;
}

function extractSeoMetadata(puckData, fallbackTitle, { path = "", locale = DEFAULT_LOCALE } = {}) {
  const root = puckData?.root?.props || {};
  return buildPageMetadata({ root, path, locale, fallbackTitle });
}

/** Split a leading locale segment (e.g. ["de","about"] -> {locale:"de", rest:["about"]}). */
function splitLocale(pathSegments) {
  if (pathSegments.length > 0 && isLocale(pathSegments[0])) {
    return { localePrefix: pathSegments[0].toLowerCase(), rest: pathSegments.slice(1) };
  }
  return { localePrefix: null, rest: pathSegments };
}

/** Resolve a path to a ContentItem, a standalone Page, or the localized home. */
async function resolveContent(pathSegments) {
  if (!isCmsDbEnabled()) return null;

  const connectDB = await siteConfig.getConnectDB();
  await connectDB();
  const models = await siteConfig.getModels();
  const { ContentType, ContentItem, Page } = models;

  const locale = await resolveLocale(models);
  const { rest } = splitLocale(pathSegments);

  // A bare locale prefix (e.g. /de) maps to the localized home page.
  if (rest.length === 0) {
    return findLocalized(Page, { slug: "home", published: true }, locale);
  }

  for (let i = rest.length - 1; i >= 1; i--) {
    const prefix = "/" + rest.slice(0, i).join("/");
    const slug = rest[i];
    const ct = await ContentType.findOne({ urlPrefix: prefix }).lean();
    if (ct) {
      return findLocalized(ContentItem, { contentType: ct._id, slug, published: true }, locale);
    }
  }
  if (rest.length >= 1) {
    // Pages can use a nested slug matching the full path, e.g. "studio/digital-presence".
    return findLocalized(Page, { slug: rest.join("/"), published: true }, locale);
  }
  return null;
}

export async function generateMetadata({ params }) {
  if (!isCmsDbEnabled()) return {};

  const { path } = await params;
  if (!path || path.length === 0) return {};
  try {
    const doc = await resolveContent(path);
    if (doc) {
      const { localePrefix, rest } = splitLocale(path);
      const urlInfo = { path: rest.join("/"), locale: localePrefix || DEFAULT_LOCALE };
      const puckData = parsePuckData(doc.content);
      if (puckData) return extractSeoMetadata(puckData, doc.title, urlInfo);
      return { title: doc.title };
    }
  } catch { /* DB offline */ }
  return {};
}

export default async function ContentCatchAllPage({ params, searchParams }) {
  const { path } = await params;
  const { filter } = (await searchParams) ?? {};

  if (!path || path.length === 0) return notFound();
  if (!isCmsDbEnabled()) return notFound();

  try {
    const connectDB = await siteConfig.getConnectDB();
    await connectDB();
    const models = await siteConfig.getModels();
    const { ContentType, ContentItem, Page } = models;

    const locale = await resolveLocale(models);
    const { localePrefix, rest } = splitLocale(path);

    // Bare locale prefix (/de) -> localized home page.
    if (localePrefix && rest.length === 0) {
      const home = await findLocalized(Page, { slug: "home", published: true }, locale);
      if (!home) return notFound();
      const puckData = parsePuckData(home.content) ?? { root: {}, content: [] };
      const finalData = await siteConfig.runBeforePageRender(puckData, home);
      const jsonLd = puckData.root?.props?.structuredData;
      return (
        <>
          {jsonLd && (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
          )}
          <Render config={siteConfig.puckConfig} data={finalData} />
        </>
      );
    }

    // --- Try content type match first (on the locale-stripped path) ---
    for (let i = rest.length - 1; i >= 1; i--) {
      const prefix = "/" + rest.slice(0, i).join("/");
      const slug = rest[i];

      const contentType = await ContentType.findOne({ urlPrefix: prefix }).lean();
      if (contentType) {
        const item = await findLocalized(
          ContentItem,
          { contentType: contentType._id, slug, published: true },
          locale,
        );
        if (!item) return notFound();

        const puckData = parsePuckData(item.content) ?? { root: {}, content: [] };
        const finalData = await siteConfig.runBeforePageRender(puckData, item);
        const jsonLd = puckData.root?.props?.structuredData;
        return (
          <article>
            {jsonLd && (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
            )}
            <Render config={siteConfig.puckConfig} data={finalData} />
          </article>
        );
      }
    }

    // --- Fallback: standalone Page by slug (supports nested slugs like "studio/digital-presence") ---
    if (rest.length >= 1) {
      const page = await findLocalized(Page, { slug: rest.join("/"), published: true }, locale);
      if (page) {
        // Expose the ?filter= query to beforePageRender hooks (work filters).
        if (filter) page.__filter = String(filter);
        const puckData = parsePuckData(page.content) ?? { root: {}, content: [] };
        const finalData = await siteConfig.runBeforePageRender(puckData, page);
        const jsonLd = puckData.root?.props?.structuredData;
        return (
          <article>
            {jsonLd && (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
            )}
            <Render config={siteConfig.puckConfig} data={finalData} />
          </article>
        );
      }
    }

    return notFound();
  } catch {
    return notFound();
  }
}
