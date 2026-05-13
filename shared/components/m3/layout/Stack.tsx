import React from 'react'
import { sxToStyle } from '../utils/sx'
import { sxToCssMap } from '../utils/sxMaps'

const SX_KEYS = new Set(Object.keys(sxToCssMap))

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  direction?: 'row' | 'column'
  spacing?: string | number
  alignItems?: string
  justifyContent?: string
  divider?: React.ReactNode
  sx?: Record<string, unknown>
  testId?: string
}

/**
 * Stack — a flex container with optional direction,
 * spacing, and divider support.
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing,
  alignItems,
  justifyContent,
  divider,
  className = '',
  sx,
  style,
  testId,
  ...allRest
}) => {
  // Intercept shorthand sx-style props from rest
  const shorthands: Record<string, unknown> = {}
  const domProps: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(allRest)) {
    if (SX_KEYS.has(k)) { shorthands[k] = v }
    else { domProps[k] = v }
  }

  const computedStyle = {
    display: 'flex',
    flexDirection: direction === 'row' ? 'row' : 'column',
    ...(spacing !== undefined && {
      gap: typeof spacing === 'number'
        ? `${spacing * 8}px` : spacing,
    }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...sxToStyle({ ...shorthands, ...sx }),
    ...style,
  } as React.CSSProperties

  const content = divider
    ? React.Children.toArray(children).flatMap(
        (child, i) => (i > 0 ? [divider, child] : [child]),
      )
    : children

  return (
    <div
      className={className}
      style={computedStyle}
      data-testid={testId}
      {...domProps}
    >
      {content}
    </div>
  )
}

export default Stack
