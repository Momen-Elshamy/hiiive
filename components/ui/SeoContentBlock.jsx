// SEO content section — kicker + display heading + rich-text body. Meant for
// long-form, editable content near the end of landing pages (definitions,
// guides, FAQs-as-prose) so pages rank for informational queries.
// Server-safe: the RichTextField only runs inside the admin editor.
import styles from "./SeoContentBlock.module.css";
import { RichTextField } from "../puck/fields/RichTextField.jsx";

const D = {
  kicker: "Guide",
  title: "Good to know.",
  body: "<p>Write the long-form content here. Headings, lists and links are supported.</p>",
};

export const SeoContentBlock = {
  label: "SEO · Content Section",
  fields: {
    kicker: { type: "text" },
    title: { type: "text" },
    body: {
      type: "custom",
      render: RichTextField,
    },
  },
  defaultProps: D,
  render: (raw) => {
    const p = { ...D, ...raw };
    return (
      <section className={styles.seoSection}>
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.kicker}>{p.kicker}</span>
            <h2 className={styles.title}>{p.title}</h2>
          </div>
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: p.body || "" }} />
        </div>
      </section>
    );
  },
};

export default SeoContentBlock;
