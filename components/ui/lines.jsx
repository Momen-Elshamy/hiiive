// Multi-line Puck text ("\n" from a textarea) as one <span> per line with a
// <br /> between them. A space goes before each <br /> so the text still reads
// as words ("Engineering the future", not "Engineeringthe future") to crawlers
// and screen readers, except after a hyphen that splits a word ("AI-" +
// "native"). Server-safe.

// Hyphen, non-breaking hyphen and soft hyphen: copy pasted from design tools
// often has the last two.
const ENDS_IN_HYPHEN = /[-‐‑­]$/;

export const lines = (t) =>
  (t || "").split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 ? <>{ENDS_IN_HYPHEN.test(line) ? null : " "}<br /></> : null}
    </span>
  ));
