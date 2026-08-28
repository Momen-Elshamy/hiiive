"use client";
// Decorative hero background clip. The poster frame is already painted as the
// section's CSS background, so the video is never on the critical path: it is
// only mounted once the page goes idle, and skipped entirely for reduced-motion
// users and data-saver / 2G connections.
import { useEffect, useState } from "react";
import styles from "./HomePageFallback.module.css";

export default function HeroVideo({ src, poster }) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const conn = navigator.connection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ""))) return undefined;

    const start = () => setMounted(true);
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 600);
    return () => window.clearTimeout(id);
  }, [src]);

  if (!mounted) return null;

  return (
    <video
      className={`${styles.heroVideo} ${ready ? styles.heroVideoReady : ""}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
    />
  );
}
