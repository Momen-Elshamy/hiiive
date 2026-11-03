import { AntdProvider } from "./antd-provider";
import { ThemeRootVars } from "@/theme/ThemeRootVars";
import { resolveLocale } from "@/lib/i18n";

import "./globals.css";
import styles from "./layout.module.css";

// Pages set the topic alone as their title; the template adds the brand.
// No default description: it would be English on German pages too, so a page
// without its own leaves the snippet to the search engine.
export const metadata = {
   title: { template: "%s | HIIIVE", default: "HIIIVE" },
};

export default async function RootLayout({ children }) {
   // The root layout wraps every route, so the document language has to come
   // from the request. Same resolver as the pages, so `lang` always matches the
   // language the page renders in. /admin is pinned to en by the middleware.
   const locale = await resolveLocale();

   return (
      <html lang={locale} suppressHydrationWarning>
         <head>
            {/* AI-readable summary of the site. `describedby` is the relation the
                llms.txt spec defines for this (llmstxt.org). Kept as a raw link so
                per-page `alternates` metadata can't overwrite it. */}
            <link rel="describedby" type="text/markdown" href="/llms.txt" />
            {/* The fonts above the fold (the @font-face rules are in globals.css):
                fetched with the HTML instead of after the CSS is parsed. */}
            <link rel="preload" href="/fonts/inter-var-latin.c9407645.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/big-shoulders-var-latin.5faff1f8.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
         </head>
         <body className={styles.body} suppressHydrationWarning>
            <ThemeRootVars />
            <AntdProvider>{children}</AntdProvider>
         </body>
      </html>
   );
}
