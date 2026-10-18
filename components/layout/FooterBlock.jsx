import { PRODUCTS } from "@/components/pages/Lab/products";
import styles from "./FooterBlock.module.css";

// The fallback columns (and the CMS block's defaults); the live footer is
// edited in the CMS, like the header.
const defaultColumns = [
   {
      heading: "AI Engineering",
      links: [
         { label: "AI software", href: "/studio#ai-software" },
         { label: "MVP build", href: "/studio/mvp-build" },
         { label: "AI consulting", href: "/studio#consulting" },
      ],
   },
   {
      heading: "AI Lab",
      links: PRODUCTS.map((product) => ({ label: product.name, href: `/lab/${product.slug}` })),
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
                     {tagLine || "Agentic product company. We build with you, then we keep building."}
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
      tagLine: "Agentic product company. We build with you, then we keep building.",
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
