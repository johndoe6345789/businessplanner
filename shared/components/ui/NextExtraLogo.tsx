'use client';

import React from 'react';

/** Props for the LaunchPad SVG logo. */
export interface NextExtraLogoProps {
  /** Logo height in pixels. */
  height?: number;
  /** Accessible label. */
  ariaLabel?: string;
}

/**
 * LaunchPad SVG wordmark — rocket mark + bold
 * "Launch" with lighter "Pad" in purple. Used in
 * the Navbar and Keycloak login theme.
 *
 * @param props - Component props.
 */
export const NextExtraLogo: React.FC<
  NextExtraLogoProps
> = ({ height = 40, ariaLabel = 'LaunchPad' }) => {
  const w = height * 4.3;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 56"
      width={w}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      <defs>
        <linearGradient
          id="lp-grad" x1="0" y1="0" x2="1" y2="1"
        >
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter
          id="lp-glow"
          x="-40%" y="-40%" width="180%" height="180%"
        >
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Rocket icon */}
      <g filter="url(#lp-glow)">
        {/* Body */}
        <path
          d="M28,6 C28,6 38,10 42,22 L42,36
             L28,44 L14,36 L14,22
             C18,10 28,6 28,6 Z"
          fill="url(#lp-grad)"
        />
        {/* Window */}
        <circle
          cx="28" cy="22" r="5"
          fill="#0c0a14" opacity="0.45"
        />
        {/* Left fin */}
        <path
          d="M14,32 L8,42 L16,38 Z"
          fill="url(#lp-grad)" opacity="0.8"
        />
        {/* Right fin */}
        <path
          d="M42,32 L48,42 L40,38 Z"
          fill="url(#lp-grad)" opacity="0.8"
        />
        {/* Flame */}
        <path
          d="M24,44 Q28,52 32,44"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
      <text
        x="60" y="37"
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif"
        fontSize="26"
        letterSpacing="-0.02em"
      >
        <tspan fontWeight="800" fill="currentColor">
          Launch
        </tspan>
        <tspan
          fontWeight="500" fill="#c4b5fd" dx="4"
        >Pad</tspan>
      </text>
    </svg>
  );
};

export default NextExtraLogo;
