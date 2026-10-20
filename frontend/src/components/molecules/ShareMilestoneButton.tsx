'use client';

/**
 * Button that opens a dialog to share a milestone.
 * @module components/molecules/ShareMilestoneButton
 */
import React, { useRef, useState } from 'react';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { MilestoneShareDialog }
  from './MilestoneShareDialog';
import { useAppSelector }
  from '@/store/hooks';

/** Props for ShareMilestoneButton. */
export interface ShareMilestoneButtonProps {
  /** Milestone template id (used for share link). */
  milestoneId: string;
  /** Milestone text to display on the card. */
  text: string;
  /** Emoji for the card. */
  emoji: string;
}

/**
 * Button that opens a shareable milestone card dialog.
 *
 * @param props - Milestone identity and content.
 * @returns ShareMilestoneButton UI.
 */
export const ShareMilestoneButton: React.FC<
  ShareMilestoneButtonProps
> = ({ milestoneId, text, emoji }) => {
  const t = useTranslations('milestones');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(
    null,
  );
  const user = useAppSelector(
    (s) => s.auth.user,
  );
  const startupName = useAppSelector(
    (s) => s.startupType.startupName,
  );

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}` +
        `/milestones/${milestoneId}`
      : `/milestones/${milestoneId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        data-testid="share-milestone-button"
        aria-label={t('share')}>
        {t('share')}
      </Button>
      <MilestoneShareDialog
        open={open}
        text={text}
        emoji={emoji}
        founderName={user?.displayName ?? ''}
        startupName={startupName ?? ''}
        cardRef={cardRef}
        shareUrl={shareUrl}
        copied={copied}
        onCopy={handleCopy}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default ShareMilestoneButton;
