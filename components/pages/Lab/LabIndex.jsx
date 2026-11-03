import section from "@/components/pages/HomeV2/HomeSection.module.css";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./Lab.module.css";
import { labCopy } from "./copy";
import LabCta from "./LabCta";
import ProductCard from "./ProductCard";
import { labProducts } from "./products";

/** /lab: the AI Lab's products. `base` is the lab's path (/lab or /de/lab). */
export default function LabIndex({ base, locale }) {
  const copy = labCopy(locale);
  return (
    <div className={`${section.section} ${styles.page}`}>
      <div className={section.inner}>
        <div className={section.head}>
          <div className={section.headCopy}>
            <div className={section.kicker}>
              <span className={section.kickerDot} />
              {copy.kicker}
            </div>
            <h1 className={`${section.title} ${styles.pageTitle}`}>
              {copy.title.map((line, i, arr) => (
                <span key={line}>{line}{i < arr.length - 1 ? " " : null}</span>
              ))}
            </h1>
            <p className={section.intro}>{copy.intro}</p>
          </div>
        </div>

        <ul className={styles.grid}>
          {labProducts(locale).map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} href={`${base}/${product.slug}`} learnMore={copy.learnMore} />
            </li>
          ))}
        </ul>
      </div>

      <LabCta copy={copy.cta} />
    </div>
  );
}

/** Title, description, canonical and hreflang links for /lab in a language. */
export function labMetadata(locale) {
  const { meta } = labCopy(locale);
  return buildPageMetadata({ root: { metaTitle: meta.title, metaDescription: meta.description }, path: "lab", locale });
}
