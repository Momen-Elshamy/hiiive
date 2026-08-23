import { Render } from "@puckeditor/core/rsc";
import { siteConfig } from "@/site.config";
import HomePageFallback from "@/components/pages/Home/HomePageFallback";
import { isCmsDbEnabled } from "@/lib/cms-mode";
import { resolveLocale, findLocalized } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

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

function extractSeoMetadata(puckData, fallbackTitle, locale) {
  const root = puckData?.root?.props || {};
  return buildPageMetadata({ root, path: "", locale, fallbackTitle });
}

export async function generateMetadata() {
  if (!isCmsDbEnabled()) {
    return { title: "HIIIVE", description: "AI-first company builder · Berlin native incubator" };
  }

  try {
    const connectDB = await siteConfig.getConnectDB();
    await connectDB();
    const models = await siteConfig.getModels();
    const locale = await resolveLocale(models);
    const page = await findLocalized(models.Page, { slug: "home", published: true }, locale);
    if (page) {
      const puckData = parsePuckData(page.content);
      if (puckData) return extractSeoMetadata(puckData, page.title, locale);
      return { title: page.title || "Home" };
    }
  } catch { /* DB offline */ }
  return { title: "HIIIVE", description: "AI-first company builder · Berlin native incubator" };
}

export default async function Home() {
  let page = null;
  if (isCmsDbEnabled()) {
    try {
      const connectDB = await siteConfig.getConnectDB();
      await connectDB();
      const models = await siteConfig.getModels();
      const locale = await resolveLocale(models);
      page = await findLocalized(models.Page, { slug: "home", published: true }, locale);
    } catch {
      /* Offline DB — show fallback */
    }
  }

  if (page) {
    const puckData = parsePuckData(page.content);
    if (puckData) {
      const finalData = await siteConfig.runBeforePageRender(puckData, page);
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
    return <p>{page.content || ""}</p>;
  }

  return (
    <HomePageFallback />
  );
}
