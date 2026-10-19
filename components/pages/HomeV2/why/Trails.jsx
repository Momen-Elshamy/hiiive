"use client";

import { useId } from "react";
import styles from "../HomeWhy.module.css";

/*
 * Light trails (ref 04, Luminal) for "Built with one, made for many": one
 * warm source in the lower left fans out into five ribbons of fine light,
 * each ending at a company. The ribbons cool from brand yellow to aurora
 * teal and blue on the way; a faint pulse runs along each.
 */

const VIEW = { w: 520, h: 460 };
const ORIGIN = { x: 34, y: 428 };

// Final heading (degrees above horizontal) and length of each ribbon. The
// fan stays below the copy in the card's upper left.
const FAN = [
  { angle: 34, length: 460 },
  { angle: 26, length: 470 },
  { angle: 18, length: 475 },
  { angle: 10, length: 470 },
  { angle: 3, length: 455 },
];

// Fine strands that make up a ribbon: a small angular spread and length
// change each, so the ribbon reads as a band of light, not a single line.
const STRANDS = [
  { spread: 0, stretch: 1, width: 1.6, opacity: 0.95 },
  { spread: 0.9, stretch: 0.985, width: 0.9, opacity: 0.55 },
  { spread: -0.9, stretch: 1.01, width: 0.9, opacity: 0.5 },
  { spread: 1.8, stretch: 0.97, width: 0.6, opacity: 0.3 },
  { spread: -1.8, stretch: 1.02, width: 0.6, opacity: 0.28 },
  { spread: 2.8, stretch: 0.96, width: 0.5, opacity: 0.16 },
];

const rad = (deg) => (deg * Math.PI) / 180;
const toward = (angle, distance) => [ORIGIN.x + Math.cos(rad(angle)) * distance, ORIGIN.y - Math.sin(rad(angle)) * distance];

/** Leaves the source flatter than its final heading, then bends up to it. */
function ribbonPath({ angle, length }, { spread = 0, stretch = 1 } = {}) {
  const l = length * stretch;
  const [x1, y1] = toward(angle * 0.25 + spread * 0.4, l * 0.42);
  const [x2, y2] = toward(angle * 0.82 + spread * 0.8, l * 0.8);
  const [x3, y3] = toward(angle + spread, l);
  return `M${ORIGIN.x} ${ORIGIN.y} C${x1.toFixed(1)} ${y1.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} ${x3.toFixed(1)} ${y3.toFixed(1)}`;
}

export default function Trails({ className }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMinYMax meet"
      aria-hidden="true"
    >
      <defs>
        {FAN.map((ribbon, i) => {
          const [x2, y2] = toward(ribbon.angle, ribbon.length);
          return (
            <linearGradient key={i} id={`${id}-ribbon-${i}`} gradientUnits="userSpaceOnUse" x1={ORIGIN.x} y1={ORIGIN.y} x2={x2} y2={y2}>
              <stop offset="0%" stopColor="#fff6c9" />
              <stop offset="22%" stopColor="var(--hv-accent)" />
              <stop offset="60%" stopColor="var(--hv-aurora-teal)" />
              <stop offset="100%" stopColor="var(--hv-aurora-blue)" />
            </linearGradient>
          );
        })}
        <radialGradient id={`${id}-source`}>
          <stop offset="0%" stopColor="var(--hv-accent)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--hv-accent)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${id}-soft`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft light under each ribbon. */}
      <g filter={`url(#${id}-glow)`} opacity="0.45">
        {FAN.map((ribbon, i) => (
          <path key={i} d={ribbonPath(ribbon)} fill="none" stroke={`url(#${id}-ribbon-${i})`} strokeWidth="9" strokeLinecap="round" />
        ))}
      </g>

      {FAN.map((ribbon, i) =>
        STRANDS.map((strand, s) => (
          <path
            key={`${i}-${s}`}
            d={ribbonPath(ribbon, strand)}
            fill="none"
            stroke={`url(#${id}-ribbon-${i})`}
            strokeWidth={strand.width}
            strokeLinecap="round"
            opacity={strand.opacity}
          />
        )),
      )}

      {/* A faint pulse of light running out along each ribbon. */}
      {FAN.map((ribbon, i) => (
        <path
          key={`pulse-${i}`}
          className={styles.pulse}
          d={ribbonPath(ribbon)}
          pathLength="1"
          fill="none"
          stroke="#fffbe8"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
          filter={`url(#${id}-soft)`}
          style={{ animationDelay: `${(i * 0.7).toFixed(2)}s`, animationDuration: `${(4.2 + i * 0.3).toFixed(2)}s` }}
        />
      ))}

      {/* The companies. */}
      {FAN.map((ribbon, i) => {
        const [x, y] = toward(ribbon.angle, ribbon.length);
        return (
          <g key={`node-${i}`}>
            <circle cx={x} cy={y} r="6.5" fill="none" stroke="#b9d6ff" strokeOpacity="0.2" />
            <circle cx={x} cy={y} r="2.6" fill="#e9f4ff" filter={`url(#${id}-soft)`} />
          </g>
        );
      })}

      {/* The source. */}
      <circle cx={ORIGIN.x} cy={ORIGIN.y} r="26" fill={`url(#${id}-source)`} />
      <circle cx={ORIGIN.x} cy={ORIGIN.y} r="4.5" fill="#fffbe0" filter={`url(#${id}-soft)`} />
    </svg>
  );
}
