'use client';
import React from 'react';
import {
  DialogOverlay,
  DialogPanel,
  type DialogPanelProps,
} from './utils/Dialog';

export * from './utils/Dialog';

/** Props for the Dialog wrapper. */
export interface DialogProps
  extends Omit<DialogPanelProps, 'open'> {
  /** Whether the dialog is visible. */
  open?: boolean;
  /** Called when the backdrop is clicked. */
  onClose?: () => void;
  /** Constrains panel width. */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * MUI-compatible dialog wrapper over m3 primitives.
 */
const Dialog: React.FC<DialogProps> = ({
  open = false,
  onClose,
  maxWidth,
  fullWidth,
  children,
  ...props
}) => {
  if (!open) return null;
  const sm = maxWidth === 'xs' || maxWidth === 'sm';
  const lg = maxWidth === 'lg';
  const xl = maxWidth === 'xl';
  return (
    <DialogOverlay onClick={onClose}>
      <DialogPanel
        sm={sm}
        lg={lg}
        xl={xl}
        fullWidth={fullWidth}
        open={open}
        {...props}
      >
        {children}
      </DialogPanel>
    </DialogOverlay>
  );
};

export default Dialog;
