'use client';
/**
 * @file HoshinObjectiveRow.tsx
 * @brief One row in the Hoshin X-matrix showing an
 *        objective with its linked startup chips.
 */

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { XMatrixRow } from '@/hooks/useHoshinMatrix';
import type { HoshinStrength } from '@/types/hoshin';

const STRENGTH_COLOR: Record<
  HoshinStrength, 'success' | 'warning' | 'default'
> = { strong: 'success', medium: 'warning', weak: 'default' };

interface Props {
  /** A single objective row with linked orgs. */
  row: XMatrixRow;
}

/**
 * @brief Renders one Hoshin objective with its
 *        startup links as colour-coded chips.
 */
export default function HoshinObjectiveRow({ row }: Props) {
  const t = useTranslations('hoshin');
  const { objective: obj, links } = row;

  return (
    <Box
      data-testid={`hoshin-row-${obj.id}`}
      sx={{
        p: 2, mb: 1,
        border: '1px solid', borderColor: 'divider',
        borderRadius: 2, bgcolor: 'background.paper',
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {obj.title}
      </Typography>

      {obj.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {obj.description}
        </Typography>
      )}

      {obj.target_date && (
        <Typography variant="caption" color="text.secondary" display="block">
          {t('target')}: {obj.target_date}
        </Typography>
      )}

      <Stack
        direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}
        aria-label={t('linkedStartups')}
      >
        {links.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            {t('noLinks')}
          </Typography>
        )}
        {links.map(({ link, org }) => (
          <Chip
            key={link.id}
            size="small"
            label={org.name}
            color={STRENGTH_COLOR[link.strength]}
            data-testid={`link-chip-${link.id}`}
            aria-label={
              `${org.name} — ${t(`strength.${link.strength}`)}`
            }
          />
        ))}
      </Stack>
    </Box>
  );
}
