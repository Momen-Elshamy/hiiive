import { AntdProvider } from "./antd-provider";
import { ThemeRootVars } from "@/theme/ThemeRootVars";

import "./globals.css";
import styles from "./layout.module.css";

export const metadata = {
   title: "HIIIVE",
   description: "AI-first company builder · Berlin native incubator",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en" suppressHydrationWarning>
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
