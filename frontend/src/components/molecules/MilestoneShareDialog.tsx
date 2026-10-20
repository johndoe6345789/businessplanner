'use client';

/**
 * Dialog content for sharing a milestone card.
 * @module components/molecules/MilestoneShareDialog
 */
import React from 'react';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent
  from '@mui/material/DialogContent';
import DialogActions
  from '@mui/material/DialogActions';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { MilestoneCard }
  from './MilestoneCard';
import type { RefObject } from 'react';

/** Props for MilestoneShareDialog. */
export interface MilestoneShareDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Milestone text for the card. */
  text: string;
  /** Emoji for the card. */
  emoji: string;
  /** Founder display name. */
  founderName: string;
  /** Startup name from Redux. */
  startupName: string;
  /** Card DOM ref for html2canvas. */
  cardRef: RefObject<HTMLDivElement | null>;
  /** Share URL to display and copy. */
  shareUrl: string;
  /** Whether the URL was just copied. */
  copied: boolean;
  /** Copy URL to clipboard. */
  onCopy: () => void;
  /** Close the dialog. */
  onClose: () => void;
}

/**
 * Dialog showing MilestoneCard + copy link button.
 *
 * @param props - Dialog state and handlers.
 * @returns MilestoneShareDialog UI.
 */
export const MilestoneShareDialog: React.FC<
  MilestoneShareDialogProps
> = ({
  open, text, emoji, founderName,
  startupName, cardRef, shareUrl,
  copied, onCopy, onClose,
}) => {
  const t = useTranslations('milestones');
  const tc = useTranslations('common');

  return (
    <Dialog open={open} fullWidth
      maxWidth="md" onClose={onClose}>
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        <MilestoneCard text={text} emoji={emoji}
          founderName={founderName}
          startupName={startupName}
          cardRef={cardRef} />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2"
            color="text.secondary"
            data-testid="share-link-url">
            {shareUrl}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {tc('close')}
        </Button>
        <Button variant="contained"
          onClick={onCopy}
          data-testid="copy-share-link">
          {copied ? t('copied') : t('copyLink')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MilestoneShareDialog;
