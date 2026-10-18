"use client";

import { useEffect, useRef } from "react";

/**
 * Marks an element with data-inview="true" the first time it scrolls into
 * view, so CSS can start its entrance animations then (and only once).
 */
export function useInView({ threshold = 0.25 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.inview = "true";
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
