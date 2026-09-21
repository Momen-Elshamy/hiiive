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
            {/* AI-readable summary of the site. Kept in <head> as a raw link so
                per-page `alternates` metadata can't overwrite it. */}
            <link rel="llms-txt" type="text/markdown" href="/llms.txt" title="llms.txt" />
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
