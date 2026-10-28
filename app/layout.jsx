import { AntdProvider } from "./antd-provider";
import { ThemeRootVars } from "@/theme/ThemeRootVars";
import { resolveLocale } from "@/lib/i18n";

import "./globals.css";
import styles from "./layout.module.css";

export const metadata = {
   title: "HIIIVE",
   description: "AI-first company builder · Berlin native incubator",
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
               href="https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@100..900&family=Inter:wght@100..900&family=Poppins:wght@500;600;700&display=swap"
               rel="stylesheet"
            />
         </head>
         <body className={styles.body} suppressHydrationWarning>
            <ThemeRootVars />
            <AntdProvider>{children}</AntdProvider>
         </body>
      </html>
   );
}
