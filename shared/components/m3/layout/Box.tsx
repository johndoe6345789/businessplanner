'use client';
import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'
import { sxToCssMap } from '../utils/sxMaps'

/**
 * Box — the m3 layout primitive. The `sx` prop is
 * converted to a STATIC inline style object. Shorthand
 * props that appear in `sxToCssMap` (e.g. `display`,
 * `justifyContent`, `py`) are intercepted here and
 * merged into the style object so they never reach the
 * DOM as unknown attributes.
 */

const SX_KEYS = new Set(Object.keys(sxToCssMap))

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
  component?: React.ElementType
  sx?: Record<string, unknown>
  testId?: string
} & Record<string, unknown>

export const Box = forwardRef<HTMLElement, BoxProps>(
  (allProps, ref) => {
    const {
      children,
      component = 'div',
      className = '',
      sx,
      style,
      testId,
      ...rest
    } = allProps

    // Partition: known shorthand → styles; rest → DOM
    const shorthands: Record<string, unknown> = {}
    const domProps: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(rest)) {
      if (SX_KEYS.has(k)) { shorthands[k] = v }
      else { domProps[k] = v }
    }

    const Tag =
      (component ?? 'div') as React.ElementType
    const sxStyle = sxToStyle({
      ...shorthands,
      ...(sx as Record<string, unknown>),
    })

    return (
      <Tag
        ref={ref}
        className={className as string}
        style={{
          ...sxStyle,
          ...(style as React.CSSProperties),
        }}
        data-testid={testId as string}
        {...domProps}
      >
        {children}
      </Tag>
    )
  },
)

Box.displayName = 'Box'

export default Box
