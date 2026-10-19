// Small inline lucide-style icon set for the header dropdown menus. Icons are
// referenced by name (a string stored in the CMS), so the marketing team picks
// one from a select in Puck — no icon library dependency, DB-safe.
const PATHS = {
  code: <><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>,
  cpu: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  funnel: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  sparkles: (
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
  ),
  compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
  gauge: <><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
  calculator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="18" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </>
  ),
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="m22 12.11-8.58 3.9a2 2 0 0 1-1.66 0L2.6 12.11" />
      <path d="m22 17.11-8.58 3.9a2 2 0 0 1-1.66 0L2.6 17.11" />
    </>
  ),
  chart: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  bot: (
    <>
      <path d="M12 8V4H8" />
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
    </>
  ),
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "arrow-right": <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
};

// The AI Lab products' own marks, from their brand files (Dvision: webdvision
// icon-mark.svg; Spoky: spoky2 spokylogo.svg; Komplyo: KomplyoMark.jsx). They
// draw in one colour (currentColor) until --mark-1 / --mark-2 are set to
// var(--mark-1-brand) / var(--mark-2-brand), e.g. on hover, which shows each
// product's own colours (`colors`; Komplyo's flat gold, its small-size version).
const PRIMARY = { fill: "var(--mark-1, currentColor)", transition: "fill 0.2s ease" };
const SECONDARY = { fill: "var(--mark-2, currentColor)", transition: "fill 0.2s ease" };

const MARKS = {
  dvision: {
    viewBox: "0 4.17 25.54 20.83",
    colors: ["#00e676", "#ffffff"],
    content: (
      <>
        <path style={PRIMARY} d="M25.1 18.14C25.39 17.1 25.54 15.91 25.54 14.58C25.54 13.25 25.39 12.07 25.1 11.04C24.8 10.01 24.39 9.11 23.86 8.34C23.33 7.56 22.7 6.91 21.95 6.38C21.2 5.85 20.37 5.42 19.45 5.1C18.54 4.77 17.56 4.54 16.51 4.4C15.46 4.25 14.37 4.17 13.22 4.17H0L5.63 8.71H12.63C13.96 8.71 15.08 8.83 16 9.07C16.92 9.3 17.66 9.66 18.23 10.15C18.8 10.62 19.22 11.23 19.47 11.97C19.74 12.71 19.87 13.58 19.87 14.58C19.87 15.58 19.74 16.45 19.47 17.19C19.22 17.93 18.8 18.55 18.23 19.05C17.66 19.53 16.92 19.9 16 20.14C15.08 20.37 13.96 20.49 12.63 20.49H5.63L0 25H13.24C14.38 25 15.47 24.93 16.52 24.79C17.57 24.64 18.55 24.4 19.45 24.08C20.36 23.75 21.19 23.32 21.95 22.79C22.7 22.25 23.33 21.6 23.86 20.83C24.39 20.06 24.8 19.16 25.1 18.14Z" />
        <path style={SECONDARY} d="M14.33 18.93L7.2 18.93L11.37 15.77H13.49C14.01 15.77 14.48 15.49 14.71 15.05L14.75 14.98C14.94 14.62 14.92 14.19 14.69 13.84C14.47 13.5 14.08 13.29 13.66 13.29H11.37L7.2 10.14L14.33 10.14C15.05 10.14 18.35 11.24 18.35 14.4C18.35 17.01 16.63 18.93 14.33 18.93Z" />
      </>
    ),
  },
  spoky: {
    viewBox: "14 15 47 47",
    colors: ["#598392"],
    content: <path style={PRIMARY} d="M31.0361 40.9033C31.5816 40.9427 31.8483 41.5884 31.4902 42.002L17.9727 57.6123C17.4334 58.2356 18.2869 59.0891 18.9102 58.5498L34.5205 45.0312C34.9341 44.6733 35.5789 44.9407 35.6182 45.4863L36.8047 62H14V39.6787L31.0361 40.9033ZM61 62H38.7168L39.9033 45.4863C39.9425 44.9407 40.5884 44.6731 41.002 45.0312L56.6123 58.5498C57.2355 59.0888 58.0888 58.2355 57.5498 57.6123L44.0312 42.002C43.6731 41.5884 43.9407 40.9425 44.4863 40.9033L61 39.7168V62ZM35.6182 32.0361C35.5787 32.5816 34.934 32.8483 34.5205 32.4902L18.9102 18.9727C18.2868 18.4331 17.4331 19.2868 17.9727 19.9102L31.4902 35.5205C31.8483 35.934 31.5816 36.5787 31.0361 36.6182L14 37.8418V15H36.8428L35.6182 32.0361ZM61 37.8047L44.4863 36.6182C43.9407 36.5789 43.6733 35.9341 44.0312 35.5205L57.5498 19.9102C58.0891 19.2869 57.2356 18.4334 56.6123 18.9727L41.002 32.4902C40.5884 32.8483 39.9427 32.5816 39.9033 32.0361L38.6797 15H61V37.8047Z" />,
  },
  komplyo: {
    viewBox: "0 0 61.4837 80",
    colors: ["#E3AF65"],
    content: (
      <>
        <rect style={PRIMARY} x="14.8018" y="0" width="32.4229" height="4.2291" />
        <svg x="0.5427" y="9.163" width="60.941" height="70.837" viewBox="0 0 100.10547 116.36133" preserveAspectRatio="none" overflow="visible">
          <path style={PRIMARY} d="M100.10547 0l0 72.0459-51.16309 44.31543-48.94238-29.21289 0-9.39063 49.27734 29.08594 43.31641-37.93848 0.51172-0.44726 0-61.45801-69.5 0 0 52.07227-7-3.5 0-55.57227 83.5 0z" />
        </svg>
        <svg x="0" y="9.163" width="49.311" height="57.0996" viewBox="0 0 81 93.79785" preserveAspectRatio="none" overflow="visible">
          <path style={PRIMARY} d="M7 0l0 61.24316 0.7832 0.42383 40.70313 22.14942 0.63672 0.34765 0.31836 0.17481 24.55859-23.21582 0-45.12305 7 0 0 48.81738-31.98633 28.98047-49.01367-29.04297 0-64.75488 7 0z" />
        </svg>
        <svg x="21.0044" y="17.9877" width="18.2626" height="34.3965" viewBox="0 0 25.91113 48.79883" preserveAspectRatio="none" overflow="visible">
          <path style={PRIMARY} d="M25.91113 0l0 36.27539-12.95605 12.52344-12.95508-6.47852 0-42.32031 25.91113 0z m-18.91113 37.99414l4.65332 2.32617 7.25781-7.01465 0-26.30566-11.91113 0 0 30.99414z" />
        </svg>
      </>
    ),
  },
};

/** Whether a name is a product mark (filled) rather than a line icon. */
export const isMark = (name) => Object.hasOwn(MARKS, name);

/** Options for the Puck icon <select>. */
export const navIconOptions = [...Object.keys(PATHS), ...Object.keys(MARKS)]
  .filter((k) => k !== "arrow-right")
  .map((k) => ({ label: k, value: k }));

export function NavIcon({ name, className }) {
  if (isMark(name)) {
    const { viewBox, colors, content } = MARKS[name];
    const brand = { "--mark-1-brand": colors[0], "--mark-2-brand": colors[1] ?? colors[0] };
    return (
      <svg className={className} viewBox={viewBox} fill="currentColor" style={brand} aria-hidden="true">
        {content}
      </svg>
    );
  }
  const path = PATHS[name] || PATHS.sparkles;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
