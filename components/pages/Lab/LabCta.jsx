import buttons from "@/components/ui/buttons.module.css";
import section from "@/components/pages/HomeV2/HomeSection.module.css";
import Halftone from "@/components/pages/HomeV2/why/Halftone";
import styles from "./Lab.module.css";

const GLOWS = [
  { x: 1, y: 1.1, r: 0.7, color: [247, 244, 44], strength: 0.45 },
  { x: 0.75, y: 1.2, r: 0.6, color: [42, 163, 201], strength: 0.35 },
];

/** The closing call to action on the AI Lab pages (same words as the home story's). */
export default function LabCta({ copy }) {
  return (
    <section className={styles.cta} aria-labelledby="lab-cta-title">
      <div className={section.inner}>
        <div className={styles.ctaCard}>
          <Halftone className={styles.halftone} glows={GLOWS} />
          <div className={section.kicker}>
            <span className={section.kickerDot} />
            {copy.kicker}
          </div>
          <h2 id="lab-cta-title" className={styles.ctaTitle}>
            {copy.title}
          </h2>
          <p className={styles.ctaBody}>{copy.body}</p>
          <div className={styles.ctaActions}>
            <a href={copy.primary.href} className={`${buttons.button} ${buttons.primary}`}>
              {copy.primary.label}
            </a>
            <a href={copy.secondary.href} className={`${buttons.button} ${buttons.secondary}`}>
              {copy.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
