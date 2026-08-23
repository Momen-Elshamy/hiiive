import { Render } from "@puckeditor/core/rsc";
import { siteConfig } from "@/site.config";
import Header from "@/components/layout/HeaderBlock";
import Footer from "@/components/layout/FooterBlock";
import { isCmsDbEnabled } from "@/lib/cms-mode";
import { resolveLocale, findLocalized } from "@/lib/i18n";
import { siteJsonLd } from "@/lib/seo";
import styles from "../layout.module.css";
import shellStyles from "./site-shell.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePuckData(content) {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.content)) {
      return parsed;
    }
  } catch {
    /* not valid Puck JSON */
  }
  return null;
}

export default async function SiteLayout({ children }) {
  let headerData = null;
  let footerData = null;

  if (isCmsDbEnabled()) {
    try {
      const connectDB = await siteConfig.getConnectDB();
      await connectDB();
      const models = await siteConfig.getModels();
      const { Global } = models;
      const locale = await resolveLocale(models);
      const [headerDoc, footerDoc] = await Promise.all([
        findLocalized(Global, { key: "header", published: true }, locale),
        findLocalized(Global, { key: "footer", published: true }, locale),
      ]);
      headerData = parsePuckData(headerDoc?.content);
      footerData = parsePuckData(footerDoc?.content);
    } catch {
      /* DB offline — fallback to static components */
    }
  }

  return (
    <div className={`${styles.shell} ${shellStyles.siteShell}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      {headerData ? <Render config={siteConfig.puckConfig} data={headerData} /> : <Header />}
      <main className={`${styles.main} ${shellStyles.siteMain}`}>{children}</main>
      {footerData ? <Render config={siteConfig.puckConfig} data={footerData} /> : <Footer />}
    </div>
  );
}
