import { AntdProvider } from "./antd-provider";
import { ThemeRootVars } from "@/theme/ThemeRootVars";

import "./globals.css";
import styles from "./layout.module.css";

export const metadata = {
   title: "Premast Site",
   description: "Built with Premast CMS",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={styles.body} suppressHydrationWarning>
            <ThemeRootVars />
            <AntdProvider>{children}</AntdProvider>
         </body>
      </html>
   );
}
