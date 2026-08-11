'use client';

import React from 'react';
import Chip from '@shared/m3/Chip';
import { useTranslations } from 'next-intl';

/** Props for MentorBadge. */
export interface MentorBadgeProps {
  /** Extra MUI sx overrides. */
  sx?: Record<string, unknown>;
}

/**
 * Small chip displayed on mentor user cards.
 *
 * @param props - Component props.
 * @returns Mentor badge chip.
 */
const MentorBadge: React.FC<MentorBadgeProps> = ({
  sx,
}) => {
  const t = useTranslations('mentor');

  return (
    <Chip
      label={`🎓 ${t('badge')}`}
      size="small"
      color="primary"
      variant="outlined"
      data-testid="mentor-badge"
      aria-label={t('badge')}
      sx={sx}
    />
  );
};

export default MentorBadge;
