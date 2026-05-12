import styles from "./FooterBlock.module.css";

const defaultFooterNavItems = [
   { label: "Mission", href: "#mission" },
   { label: "Services", href: "#model" },
   { label: "Portfolio", href: "#portfolio" },
   { label: "FAQ", href: "#faq" },
   { label: "Privacy", href: "/" },
];

export default function Footer({ brandName, tagLine, copyrightHolder, navItems }) {
   const items = Array.isArray(navItems) && navItems.length > 0 ? navItems : defaultFooterNavItems;

   return (
      <footer className={styles.footerRoot}>
         <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
               <p className={styles.footerLogo}>{brandName || "HIIIVE"}</p>
               <p className={styles.footerTag}>{tagLine || "Berlin native AI-first company builder."}</p>
               <p className={styles.footerCopy}>
                  © {new Date().getFullYear()} {copyrightHolder || "HIIIVE. Berlin Native."}
               </p>
            </div>
            {items.length > 0 ? (
               <nav className={styles.footerNav} aria-label="Footer">
                  {items.map((item, index) => (
                  <a key={index} href={item.href || "/"} className={styles.footerNavLink}>
                     {item.label || "Link"}
                  </a>
                  ))}
               </nav>
            ) : null}
         </div>
      </footer>
   );
}

export const FooterBlock = {
   label: "Footer",
   fields: {
      brandName: { type: "text" },
      tagLine: { type: "text" },
      copyrightHolder: { type: "text" },
      navItems: {
         type: "array",
         arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
         },
         defaultItemProps: { label: "Link", href: "/" },
         getItemSummary: (item) => item.label || "Link",
      },
   },
   defaultProps: {
      brandName: "HIIIVE",
      tagLine: "Berlin native AI-first company builder.",
      copyrightHolder: "HIIIVE. Berlin Native.",
      navItems: defaultFooterNavItems,
   },
   render: ({ brandName, tagLine, copyrightHolder, navItems }) => (
      <Footer
         brandName={brandName}
         tagLine={tagLine}
         copyrightHolder={copyrightHolder}
         navItems={navItems}
      />
   ),
};
