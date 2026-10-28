import { AntdProvider } from "./antd-provider";
import { ThemeRootVars } from "@/theme/ThemeRootVars";

import "./globals.css";
import styles from "./layout.module.css";

// Pages set the topic alone as their title; the template adds the brand.
export const metadata = {
   title: { template: "%s | HIIIVE", default: "HIIIVE" },
   description:
      "HIIIVE is an AI lab & tech house in Berlin. Smart people and smart systems, inventing AI products, agents and software for real companies.",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en" suppressHydrationWarning>
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
