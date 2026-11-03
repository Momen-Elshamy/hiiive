import buttons from "@/components/ui/buttons.module.css";
import section from "@/components/pages/HomeV2/HomeSection.module.css";
import Halftone from "@/components/pages/HomeV2/why/Halftone";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./Lab.module.css";
import { fill, labCopy } from "./copy";
import LabCta from "./LabCta";
import ProductCard from "./ProductCard";
import ProductWindow from "./ProductWindow";
import { labProducts } from "./products";

function External() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/** /lab/<product>: what the product does, and the way to its own site. */
export default function ProductPage({ product, base, locale }) {
  const copy = labCopy(locale);
  const others = labProducts(locale).filter((other) => other.slug !== product.slug);

  return (
    <div className={`${section.section} ${styles.page}`}>
      <div className={section.inner}>
        <div className={styles.hero}>
          <div>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <a href={base}>{copy.crumb}</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{product.name}</span>
            </nav>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.tagline}>{product.tagline}</p>
            <p className={styles.lead}>{product.intro}</p>
            <div className={styles.actions}>
              <a href={product.site.href} target="_blank" rel="noopener" className={`${buttons.button} ${buttons.primary}`}>
                {fill(copy.visit, { site: product.site.label })}
                <External />
              </a>
              <a href={copy.bookCall.href} className={`${buttons.button} ${buttons.secondary}`}>
                {copy.bookCall.label}
              </a>
            </div>
          </div>
          <div className={styles.visual}>
            <Halftone className={styles.halftone} glows={product.glows} />
            <ProductWindow ui={product.ui} />
          </div>
        </div>

        <section className={styles.block} aria-labelledby="product-features">
          <div className={section.kicker}>
            <span className={section.kickerDot} />
            {copy.whatKicker}
          </div>
          <h2 id="product-features" className={section.title}>
            {fill(copy.whatTitle, { name: product.name })}
          </h2>
          <ol className={styles.features}>
            {product.features.map((feature, i) => (
              <li key={feature.title} className={styles.feature}>
                <span className={styles.featureNumber}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureBody}>{feature.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="product-more">
          <div className={section.kicker}>
            <span className={section.kickerDot} />
            {copy.moreKicker}
          </div>
          <h2 id="product-more" className={section.title}>
            {copy.moreTitle}
          </h2>
          <ul className={styles.more}>
            {others.map((other) => (
              <li key={other.slug}>
                <ProductCard product={other} href={`${base}/${other.slug}`} learnMore={copy.learnMore} compact />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <LabCta copy={copy.cta} />
    </div>
  );
}

/** Title, description, canonical and hreflang links for a product page. */
export function productMetadata(product, locale) {
  return buildPageMetadata({
    root: { metaTitle: product.meta.title, metaDescription: product.meta.description },
    path: `lab/${product.slug}`,
    locale,
  });
}
