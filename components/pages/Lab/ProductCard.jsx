import Halftone from "@/components/pages/HomeV2/why/Halftone";
import { NavIcon } from "@/components/layout/navIcons";
import styles from "./Lab.module.css";

/** A product as a card that links to its page (the /lab grid, "More from the AI Lab"). */
export default function ProductCard({ product, href, compact = false }) {
  const Name = compact ? "h3" : "h2";
  return (
    <a href={href} className={`${styles.card} ${compact ? styles.cardCompact : ""}`}>
      <Halftone className={styles.halftone} glows={product.glows} />
      <span className={styles.cardIcon}>
        <NavIcon name={product.icon} />
      </span>
      <Name className={styles.cardName}>{product.name}</Name>
      <p className={styles.cardText}>{product.menu}</p>
      <span className={styles.cardFoot}>
        <span>{product.site.label}</span>
        <span className={styles.cardMore}>
          Learn more
          <NavIcon name="arrow-right" />
        </span>
      </span>
    </a>
  );
}
