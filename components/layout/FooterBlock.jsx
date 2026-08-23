import styles from "./FooterBlock.module.css";

const defaultColumns = [
   {
      heading: "Studio",
      links: [
         { label: "AI software", href: "/studio#ai-software" },
         { label: "MVP build", href: "/studio/mvp-build" },
         { label: "Organic visibility", href: "/studio/organic-visibility" },
         { label: "Digital presence", href: "/studio/digital-presence" },
         { label: "AI consulting", href: "/studio#consulting" },
      ],
   },
   {
      heading: "Lab",
      links: [
         { label: "Spoky", href: "/#approach" },
         { label: "Komplyo", href: "/#approach" },
      ],
   },
   {
      heading: "Company",
      links: [
         { label: "Work", href: "/work" },
         { label: "Cost estimator", href: "/tools/mvp-cost-estimator" },
         { label: "Contact", href: "mailto:hello@hiiive.ai" },
         { label: "Imprint", href: "/imprint" },
      ],
   },
];

const defaultLegal = [
   { label: "Imprint", href: "/imprint" },
   { label: "LinkedIn", href: "https://www.linkedin.com/company/hiiive" },
   { label: "X", href: "/" },
];

export default function Footer({ brandName, tagLine, copyright, columns, legal }) {
   const cols = Array.isArray(columns) && columns.length > 0 ? columns : defaultColumns;
   const legalLinks = Array.isArray(legal) && legal.length > 0 ? legal : defaultLegal;

   return (
      <footer className={styles.footerRoot}>
         <div className={styles.footerInner}>
            <div className={styles.footerTop}>
               <div className={styles.footerBrand}>
                  <p className={styles.footerLogo}>{brandName || "HIIIVE"}</p>
                  <p className={styles.footerTag}>
                     {tagLine || "AI-native company builder. Studio for services, Lab for products."}
                  </p>
               </div>
               <div className={styles.footerCols}>
                  {cols.map((col, i) => (
                     <div key={i} className={styles.footerCol}>
                        <p className={styles.footerColHead}>{col.heading}</p>
                        {(col.links || []).map((link, j) => (
                           <a key={j} href={link.href || "/"} className={styles.footerColLink}>
                              {link.label || "Link"}
                           </a>
                        ))}
                     </div>
                  ))}
               </div>
            </div>

            <div className={styles.footerRule} />

            <div className={styles.footerBottom}>
               <p className={styles.footerCopy}>
                  {copyright || `© ${new Date().getFullYear()} Hiiive.ai — All rights reserved.`}
               </p>
               <div className={styles.footerLegal}>
                  {legalLinks.map((link, i) => (
                     <a key={i} href={link.href || "/"} className={styles.footerLegalLink}>
                        {link.label || "Link"}
                     </a>
                  ))}
               </div>
            </div>
         </div>
      </footer>
   );
}

export const FooterBlock = {
   label: "Footer",
   fields: {
      brandName: { type: "text" },
      tagLine: { type: "textarea" },
      copyright: { type: "text" },
      columns: {
         type: "array",
         getItemSummary: (item) => item.heading || "Column",
         arrayFields: {
            heading: { type: "text" },
            links: {
               type: "array",
               getItemSummary: (item) => item.label || "Link",
               arrayFields: {
                  label: { type: "text" },
                  href: { type: "text" },
               },
               defaultItemProps: { label: "Link", href: "/" },
            },
         },
         defaultItemProps: { heading: "Column", links: [{ label: "Link", href: "/" }] },
      },
      legal: {
         type: "array",
         getItemSummary: (item) => item.label || "Link",
         arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
         },
         defaultItemProps: { label: "Link", href: "/" },
      },
   },
   defaultProps: {
      brandName: "HIIIVE",
      tagLine: "AI-native company builder. Studio for services, Lab for products.",
      copyright: "",
      columns: defaultColumns,
      legal: defaultLegal,
   },
   render: ({ brandName, tagLine, copyright, columns, legal }) => (
      <Footer
         brandName={brandName}
         tagLine={tagLine}
         copyright={copyright}
         columns={columns}
         legal={legal}
      />
   ),
};
