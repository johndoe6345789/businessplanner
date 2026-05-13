'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-dialog.module.scss'

/** Props for the DialogActions component */
export interface DialogActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Action buttons rendered in the footer area */
  children?: React.ReactNode
  /** Align buttons at the start instead of end */
  disableSpacing?: boolean
}

/**
 * DialogActions - dialog footer action buttons wrapper.
 * Renders a row of buttons right-aligned at the bottom
 * of a dialog.
 */
export const DialogActions: React.FC<
  DialogActionsProps
> = ({
  children,
  className = '',
  disableSpacing,
  ...props
}) => (
  <div
    className={[
      styles.dialogActions,
      disableSpacing ? styles.dialogActionsStart : '',
      className,
    ].filter(Boolean).join(' ')}
    data-testid="dialog-actions"
    {...props}
  >
    {children}
  </div>
)

export default DialogActions
