import styles from "./Lab.module.css";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * A small, illustrative window of the product at work (like the "We run it
 * ourselves first" card on the home page). Rows are done, active or next.
 */
export default function ProductWindow({ ui }) {
  return (
    <div className={styles.window} aria-hidden="true">
      <div className={styles.windowBar}>
        <span className={styles.windowDots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.windowName}>{ui.name}</span>
        <span className={styles.windowStatus}>
          <span className={styles.liveDot} />
          {ui.status}
        </span>
      </div>
      <ol className={styles.rows}>
        {ui.rows.map((row) => (
          <li key={row.label} className={styles.row} data-state={row.state}>
            <span className={styles.mark}>{row.state === "done" ? <Check /> : null}</span>
            <span className={styles.rowLabel}>{row.label}</span>
            <span className={styles.rowMeta}>{row.meta}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
