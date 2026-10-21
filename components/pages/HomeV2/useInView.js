"use client";

import { useEffect, useRef } from "react";

/**
 * Marks an element with data-inview="true" the first time it scrolls into
 * view, so CSS can start its entrance animations then (and only once), and
 * keeps data-visible="true" on it while any of it is on screen, so looping
 * animations can hold still while it is not.
 */
export function useInView({ threshold = 0.25 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.visible = String(entry.isIntersecting);
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) el.dataset.inview = "true";
      },
      { threshold: [0, threshold] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
