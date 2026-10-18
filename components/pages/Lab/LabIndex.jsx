import section from "@/components/pages/HomeV2/HomeSection.module.css";
import styles from "./Lab.module.css";
import LabCta from "./LabCta";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "./products";

const copy = {
  kicker: "AI Lab",
  title: ["Built with one.", "Made for many."],
  intro:
    "Every product in the lab started as work for one company. We run them in our own company first, then make them for everyone with the same problem.",
};

/** /lab: the AI Lab's products. `base` is the lab's path (/lab or /de/lab). */
export default function LabIndex({ base }) {
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
              {copy.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className={section.intro}>{copy.intro}</p>
          </div>
        </div>

        <ul className={styles.grid}>
          {PRODUCTS.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} href={`${base}/${product.slug}`} />
            </li>
          ))}
        </ul>
      </div>

      <LabCta />
    </div>
  );
}
