"use client";

import { useId } from "react";
import styles from "../HomeWhy.module.css";

/*
 * Light trails (ref 04, Luminal) for "Built with one, made for many": one
 * warm source in the lower left, ribbons of light that sweep along the floor
 * and rise to five companies on the right, cooling from brand yellow to
 * aurora teal and blue on the way. A pulse of light runs along each ribbon.
 */

const VIEW = { w: 520, h: 460 };
const ORIGIN = { x: 34, y: 428 };

// Each ribbon: where it ends (a company) and the control point that makes it
// hug the floor before it rises.
const RIBBONS = [
  { end: [472, 70], control: [448, 452] },
  { end: [494, 148], control: [454, 448] },
  { end: [476, 228], control: [440, 444] },
  { end: [432, 298], control: [408, 440] },
  { end: [362, 352], control: [348, 436] },
];

// A ribbon is a few strands of light side by side.
const STRANDS = [
  { dc: [0, 0], de: [0, 0], width: 2.2, opacity: 1 },
  { dc: [12, 7], de: [7, 5], width: 1.1, opacity: 0.55 },
  { dc: [-12, -7], de: [-6, -4], width: 0.8, opacity: 0.4 },
  { dc: [22, 12], de: [12, 9], width: 0.6, opacity: 0.22 },
];

const strandPath = ({ end, control }, { dc, de }) =>
  `M${ORIGIN.x} ${ORIGIN.y} Q${control[0] + dc[0]} ${control[1] + dc[1]} ${end[0] + de[0]} ${end[1] + de[1]}`;

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
        {RIBBONS.map(({ end }, i) => (
          <linearGradient
            key={i}
            id={`${id}-ribbon-${i}`}
            gradientUnits="userSpaceOnUse"
            x1={ORIGIN.x}
            y1={ORIGIN.y}
            x2={end[0]}
            y2={end[1]}
          >
            <stop offset="0%" stopColor="#fff6c9" />
            <stop offset="28%" stopColor="var(--hv-accent)" />
            <stop offset="64%" stopColor="var(--hv-aurora-teal)" />
            <stop offset="100%" stopColor="#b9d6ff" />
          </linearGradient>
        ))}
        <radialGradient id={`${id}-source`}>
          <stop offset="0%" stopColor="var(--hv-accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--hv-accent)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}-node`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft light under the strands. */}
      <g filter={`url(#${id}-glow)`} opacity="0.75">
        {RIBBONS.map((ribbon, i) => (
          <path
            key={i}
            d={strandPath(ribbon, STRANDS[0])}
            fill="none"
            stroke={`url(#${id}-ribbon-${i})`}
            strokeWidth="7"
            strokeLinecap="round"
          />
        ))}
      </g>

      {RIBBONS.map((ribbon, i) =>
        STRANDS.map((strand, s) => (
          <path
            key={`${i}-${s}`}
            d={strandPath(ribbon, strand)}
            fill="none"
            stroke={`url(#${id}-ribbon-${i})`}
            strokeWidth={strand.width}
            strokeLinecap="round"
            opacity={strand.opacity}
          />
        )),
      )}

      {/* A pulse of light running out along each ribbon. */}
      {RIBBONS.map((ribbon, i) => (
        <path
          key={`pulse-${i}`}
          className={styles.pulse}
          d={strandPath(ribbon, STRANDS[0])}
          pathLength="1"
          fill="none"
          stroke="#fffbe8"
          strokeWidth="2.6"
          strokeLinecap="round"
          filter={`url(#${id}-node)`}
          style={{ animationDelay: `${(i * 0.55).toFixed(2)}s`, animationDuration: `${(3.4 + i * 0.25).toFixed(2)}s` }}
        />
      ))}

      {/* The companies. */}
      {RIBBONS.map(({ end }, i) => (
        <g key={`node-${i}`}>
          <circle cx={end[0]} cy={end[1]} r="8" fill="none" stroke="#b9d6ff" strokeOpacity="0.28" />
          <circle cx={end[0]} cy={end[1]} r="3.4" fill="#e9f4ff" filter={`url(#${id}-node)`} />
        </g>
      ))}

      {/* The source. */}
      <circle cx={ORIGIN.x} cy={ORIGIN.y} r="30" fill={`url(#${id}-source)`} />
      <circle cx={ORIGIN.x} cy={ORIGIN.y} r="5.5" fill="#fffbe0" filter={`url(#${id}-node)`} />
    </svg>
  );
}
