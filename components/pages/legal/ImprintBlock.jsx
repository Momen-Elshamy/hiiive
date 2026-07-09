// Server-safe Puck block for a legal Imprint / Impressum page (§5 DDG/TMG).
// Static markup, no "use client", so it renders in RSC and the client editor.
import styles from "./ImprintBlock.module.css";

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}

export const ImprintBlock = {
  label: "Imprint / Impressum",
  fields: {
    title: { type: "text" },
    intro: { type: "textarea" },
    companyName: { type: "text" },
    legalForm: { type: "text" },
    addressLines: {
      type: "array",
      getItemSummary: (item) => item.line || "Address line",
      arrayFields: { line: { type: "text" } },
      defaultItemProps: { line: "" },
    },
    representedBy: { type: "text" },
    email: { type: "text" },
    phone: { type: "text" },
    registerCourt: { type: "text" },
    registerNumber: { type: "text" },
    vatId: { type: "text" },
    responsiblePerson: { type: "text" },
    disclaimer: { type: "textarea" },
  },
  defaultProps: {
    title: "Imprint",
    intro: "Information according to § 5 DDG (German Digital Services Act).",
    companyName: "HIIIVE GmbH",
    legalForm: "GmbH (limited liability company)",
    addressLines: [
      { line: "Musterstraße 1" },
      { line: "10115 Berlin" },
      { line: "Germany" },
    ],
    representedBy: "Managing Director: [Full Name]",
    email: "hello@hiiive.example",
    phone: "+49 30 000000",
    registerCourt: "Amtsgericht Berlin (Charlottenburg)",
    registerNumber: "HRB 000000 B",
    vatId: "DE000000000",
    responsiblePerson:
      "Responsible for content per § 18 (2) MStV: [Full Name], address as above",
    disclaimer:
      "Despite careful control of content, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.",
  },
  render: ({
    title,
    intro,
    companyName,
    legalForm,
    addressLines,
    representedBy,
    email,
    phone,
    registerCourt,
    registerNumber,
    vatId,
    responsiblePerson,
    disclaimer,
  }) => (
    <section className={styles.imprint}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {intro ? <p className={styles.intro}>{intro}</p> : null}

        <div className={styles.card}>
          {companyName ? <p className={styles.company}>{companyName}</p> : null}
          {Array.isArray(addressLines) && addressLines.length > 0 ? (
            <address className={styles.address}>
              {addressLines.map((a, i) => (a.line ? <span key={i}>{a.line}</span> : null))}
            </address>
          ) : null}

          <div className={styles.rows}>
            <Row label="Legal form" value={legalForm} />
            <Row label="Represented by" value={representedBy} />
            <Row label="Email" value={email} />
            <Row label="Phone" value={phone} />
            <Row label="Register court" value={registerCourt} />
            <Row label="Register number" value={registerNumber} />
            <Row label="VAT ID" value={vatId} />
          </div>
        </div>

        {responsiblePerson ? (
          <div className={styles.block}>
            <h2 className={styles.heading}>Responsible for content</h2>
            <p className={styles.text}>{responsiblePerson}</p>
          </div>
        ) : null}

        {disclaimer ? (
          <div className={styles.block}>
            <h2 className={styles.heading}>Liability for links</h2>
            <p className={styles.text}>{disclaimer}</p>
          </div>
        ) : null}
      </div>
    </section>
  ),
};
