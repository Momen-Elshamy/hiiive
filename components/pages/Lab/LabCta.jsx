import buttons from "@/components/ui/buttons.module.css";
import section from "@/components/pages/HomeV2/HomeSection.module.css";
import Halftone from "@/components/pages/HomeV2/why/Halftone";
import styles from "./Lab.module.css";

export const BOOK_A_CALL = "https://calendly.com/hiiive/get-to-know";

const GLOWS = [
  { x: 1, y: 1.1, r: 0.7, color: [247, 244, 44], strength: 0.45 },
  { x: 0.75, y: 1.2, r: 0.6, color: [42, 163, 201], strength: 0.35 },
];

/** The closing call to action on the AI Lab pages (same words as the home story's). */
export default function LabCta() {
  return (
    <section className={styles.cta} aria-labelledby="lab-cta-title">
      <div className={section.inner}>
        <div className={styles.ctaCard}>
          <Halftone className={styles.halftone} glows={GLOWS} />
          <div className={section.kicker}>
            <span className={section.kickerDot} />
            Your turn
          </div>
          <h2 id="lab-cta-title" className={styles.ctaTitle}>
            Bring us your hardest problem.
          </h2>
          <p className={styles.ctaBody}>
            Tell us what slows your team down. We&apos;ll show you what AI can do about it, and how fast.
          </p>
          <div className={styles.ctaActions}>
            <a href={BOOK_A_CALL} className={`${buttons.button} ${buttons.primary}`}>
              Book a call
            </a>
            <a href="/work" className={`${buttons.button} ${buttons.secondary}`}>
              See what we build
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
