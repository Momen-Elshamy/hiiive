"use client";

import section from "./HomeSection.module.css";
import styles from "./HomeWhy.module.css";
import { useInView } from "./useInView";
import { OwnProductsArt, OneToManyArt, InsideTeamArt } from "./why/isoArt";

/*
 * "Why Hiiive": what sets the company apart, in three points, each with one
 * illustration in the factory's visual language. Then the programs and
 * networks Hiiive is part of.
 */

const content = {
  kicker: "Why Hiiive",
  title: "An AI lab, not an agency.",
  intro: "Agencies deliver a project and move on. We build our own products, run on our own AI, and keep building what we ship.",
  points: [
    {
      title: "We run it ourselves first.",
      body: "Our products and the AI behind our services run in our own company before they reach yours: Content OS in daily use, Spoky with real users, Komplyo in build. Our money and our risk go first, so what you get has already worked.",
      Art: OwnProductsArt,
      art: "Three Hiiive products as modules: Content OS lit and shipping, Spoky blinking in validation, Komplyo still an outline.",
    },
    {
      title: "Built with one, made for many.",
      body: "What we build with one company becomes a product the next one can start from. You get a system made for your operation, the next company starts where you finished, and every build makes the product better, yours included.",
      Art: OneToManyArt,
      art: "One module sending work along lanes to five smaller modules, which light up one after another.",
    },
    {
      title: "Senior people, inside your team.",
      body: "The people you meet are the people who build. Senior engineers and AI specialists work inside your team, on your real data and processes. No layers, no hand-offs.",
      Art: InsideTeamArt,
      art: "A team as a grid of dark blocks, with three lit Hiiive blocks sitting among them.",
    },
  ],
  partners: {
    label: "Part of",
    // White versions of /public/logos, made for the dark background.
    items: [
      { name: "NVIDIA Inception", src: "/img/home-v2/partners/nvidia-inception.png" },
      { name: "KI Bundesverband", src: "/img/home-v2/partners/ki-bundesverband.png" },
      { name: "Telekom TechBoost", src: "/img/home-v2/partners/telekom-techboost.png" },
      { name: "Berlin Partner", src: "/img/home-v2/partners/berlin-partner.png" },
      { name: "Wayra", src: "/img/home-v2/partners/wayra.png" },
    ],
  },
};

function Point({ index, title, body, Art, art }) {
  const ref = useInView({ threshold: 0.3 });
  return (
    <li ref={ref} className={styles.point}>
      <div className={styles.copy}>
        <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        <h3 className={styles.pointTitle}>{title}</h3>
        <p className={styles.pointBody}>{body}</p>
      </div>
      <div className={styles.art}>
        <Art title={art} />
      </div>
    </li>
  );
}

export default function HomeWhy() {
  return (
    <section className={`${section.section} ${styles.why}`} aria-labelledby="home-why-title">
      <div className={section.inner}>
        <div className={section.head}>
          <div className={section.headCopy}>
            <div className={section.kicker}>
              <span className={section.kickerDot} />
              {content.kicker}
            </div>
            <h2 id="home-why-title" className={section.title}>{content.title}</h2>
            <p className={section.intro}>{content.intro}</p>
          </div>
        </div>

        <ol className={styles.points}>
          {content.points.map((point, i) => (
            <Point key={point.title} index={i} {...point} />
          ))}
        </ol>

        <div className={styles.partners}>
          <span className={styles.partnersLabel}>{content.partners.label}</span>
          <ul className={styles.partnerList}>
            {content.partners.items.map((p) => (
              <li key={p.name}>
                <img className={styles.partner} src={p.src} alt={p.name} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
