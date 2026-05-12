'use client';

/**
 * Launch execution checklist organism.
 * Groups items by category and shows overall progress.
 * @module components/organisms/LaunchChecklist
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import { useTranslations } from 'next-intl';
import { useLaunchChecklist } from '@/hooks/useLaunchChecklist';
import type { ChecklistCategory } from '@/hooks/useLaunchChecklist';
import { LaunchChecklistItem } from './LaunchChecklistItem';

const CATEGORIES: ChecklistCategory[] = [
  'distribution',
  'product',
  'marketing',
  'ops',
];

/**
 * Renders the full launch checklist grouped by category,
 * with a progress bar showing overall completion.
 *
 * @returns Launch checklist UI.
 */
export const LaunchChecklist: React.FC = () => {
  const t = useTranslations('launch');
  const { items, completed, toggleItem } =
    useLaunchChecklist();

  const total = items.length;
  const done = items.filter((i) => completed[i.id]).length;
  const pct = total > 0
    ? Math.round((done / total) * 100) : 0;

  return (
    <Box
      data-testid="launch-checklist"
      aria-label={t('title')}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5 }}
        >
          {t('progress', { done, total })}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pct}
          aria-label={t('progress', { done, total })}
          sx={{ borderRadius: 4, height: 8 }}
        />
      </Box>

      {CATEGORIES.map((cat) => {
        const catItems = items.filter(
          (i) => i.category === cat,
        );
        if (catItems.length === 0) return null;
        return (
          <Box key={cat} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 0.5, textTransform: 'uppercase',
                letterSpacing: '0.08em', fontSize: '0.7rem' }}
            >
              {t(`categories.${cat}`)}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {catItems.map((item) => (
              <LaunchChecklistItem
                key={item.id}
                item={item}
                checked={Boolean(completed[item.id])}
                onToggle={toggleItem}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default LaunchChecklist;
