import { createSiteConfig } from "@premast/site-core";
import { baseBlocks, baseCategories } from "@/components/puck/puckConfig";
import { seoPlugin } from "@premast/site-plugin-seo";
import { uiPlugin } from "@premast/site-plugin-ui";
import { symbolsPlugin } from "@premast/site-plugin-symbols";

// i18n is wired as a SERVER plugin only (models, locale hooks, API). The client
// editor gets it via puck.config.js; the public <Render> config intentionally
// omits it to avoid a Puck root-field hydration mismatch on the live pages.
const i18nOptions = { locales: ["en", "de"], defaultLocale: "en" };

export const siteConfig = createSiteConfig({
  blocks: baseBlocks,
  categories: baseCategories,
  plugins: [
    seoPlugin(),
    uiPlugin(),
    symbolsPlugin(),
  ],
  serverPlugins: async () => {
    const { seoPluginServer } = await import("@premast/site-plugin-seo/server");
    const { i18nPluginServer } = await import("@premast/site-plugin-i18n/server");
    const { symbolsPluginServer } = await import("@premast/site-plugin-symbols/server");
    const { injectCaseStudies } = await import("@/lib/case-studies");
    return [
      { name: "seo", ...seoPluginServer },
      { name: "i18n", ...i18nPluginServer(i18nOptions) },
      { name: "symbols", ...symbolsPluginServer },
      // Local site plugin: fills CaseStudyListBlock items from ContentItems.
      { name: "hiiive", hooks: { beforePageRender: injectCaseStudies } },
    ];
  },
  admin: {
    title: "Hive Homepage CMS",
  },
});
