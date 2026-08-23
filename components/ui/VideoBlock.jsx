// Video section — accepts a direct video file (.mp4/.webm) OR a YouTube/Vimeo
// link and renders the right player. Server-safe (plain <video>/<iframe>).
// Droppable on any page, including case-study detail pages.
import styles from "./VideoBlock.module.css";

const D = {
  url: "",
  poster: "",
  caption: "",
  width: "content", // content (reading width) | wide (full inner width)
  autoplay: "no",
  loop: "no",
  muted: "no",
};

/** Turn YouTube/Vimeo page URLs into embeddable player URLs. */
function embedUrl(url, { autoplay, loop, muted }) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const flags = `autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;

    if (host === "youtu.be" || host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const id =
        host === "youtu.be"
          ? u.pathname.slice(1)
          : u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/")
            ? u.pathname.split("/")[2]
            : u.searchParams.get("v");
      if (!id) return null;
      // loop on YouTube requires a playlist param of the same id
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0&${flags}${loop ? `&playlist=${id}` : ""}`;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (!id || !/^\d+$/.test(id)) return null;
      return `https://player.vimeo.com/video/${id}?${flags}`;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export const VideoBlock = {
  label: "Video",
  fields: {
    url: { type: "text", label: "Video URL (.mp4/.webm file, or YouTube/Vimeo link)" },
    poster: { type: "text", label: "Poster image (optional, file videos only)" },
    caption: { type: "text" },
    width: {
      type: "select",
      options: [
        { label: "Content width", value: "content" },
        { label: "Wide", value: "wide" },
      ],
    },
    autoplay: { type: "select", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes" }] },
    loop: { type: "select", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes" }] },
    muted: { type: "select", options: [{ label: "no", value: "no" }, { label: "yes", value: "yes" }] },
  },
  defaultProps: D,
  render: (raw) => {
    const p = { ...D, ...raw };
    if (!p.url) return null;
    const flags = { autoplay: p.autoplay === "yes", loop: p.loop === "yes", muted: p.muted === "yes" };
    const embed = embedUrl(p.url, flags);
    return (
      <section className={styles.videoSection}>
        <figure className={`${styles.figure} ${p.width === "wide" ? styles.wide : styles.content}`}>
          <div className={styles.frame}>
            {embed ? (
              <iframe
                className={styles.media}
                src={embed}
                title={p.caption || "Video"}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <video
                className={styles.media}
                src={p.url}
                poster={p.poster || undefined}
                controls
                playsInline
                autoPlay={flags.autoplay}
                loop={flags.loop}
                muted={flags.muted || flags.autoplay}
                preload="metadata"
              />
            )}
          </div>
          {p.caption ? <figcaption className={styles.caption}>{p.caption}</figcaption> : null}
        </figure>
      </section>
    );
  },
};

export default VideoBlock;
