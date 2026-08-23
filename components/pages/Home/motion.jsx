"use client";
// Scroll-reveal primitives for the home page (framer-motion / `motion`).
//
// Robustness model: these render INSIDE Puck's RSC <Render>, which emits a
// persistent server/client hydration mismatch (it adds contenteditable/cursor
// to links on the server only). To guarantee content is NEVER stuck hidden if
// hydration/effects don't run, every primitive is gated on a client "mounted"
// flag: server + first client paint render the element plain and fully visible;
// only after mount do we hand it to framer-motion for the entrance. If effects
// never run, the content simply stays visible with no animation.
//
// The above-the-fold hero does NOT use these (it would flash visible->hidden on
// mount); it uses a pure-CSS entrance instead — see .heroReveal* in the module.
import { Children, cloneElement, isValidElement, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" };

function useEntrance() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return !reduce && mounted;
}

/** Fade + rise a single element into view once (scroll-triggered). */
export function Reveal({ as = "div", y = 24, delay = 0, className, children, ...rest }) {
  const animate = useEntrance();
  const Comp = motion[as] || motion.div;
  if (!animate) {
    return <Comp className={className} {...rest}>{children}</Comp>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Plain container that cascades its <StaggerItem> children by injecting an
 * incremental delay. No motion on the container itself — items self-animate.
 */
export function Stagger({ as = "div", step = 0.08, className, children, ...rest }) {
  const Container = as || "div";
  let i = 0;
  const kids = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const delay = (child.props.delay ?? 0) + i * step;
    i += 1;
    return cloneElement(child, { delay });
  });
  return (
    <Container className={className} {...rest}>
      {kids}
    </Container>
  );
}

/** A self-contained cascade item (delay injected by <Stagger>). */
export function StaggerItem({ as = "div", y = 18, delay = 0, className, children, ...rest }) {
  const animate = useEntrance();
  const Comp = motion[as] || motion.div;
  if (!animate) {
    return <Comp className={className} {...rest}>{children}</Comp>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
