'use client';
/**
 * @file HoshinXMatrix.tsx
 * @brief Full Hoshin X-matrix organism: renders
 *        vision / breakthrough / annual sections.
 */

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  useHoshinMatrix,
  type XMatrixRow,
} from '@/hooks/useHoshinMatrix';
import HoshinObjectiveRow
  from '@/components/molecules/HoshinObjectiveRow';

interface SectionProps {
  label: string;
  rows: XMatrixRow[];
  emptyMsg: string;
}

function Section({ label, rows, emptyMsg }: SectionProps) {
  return (
    <Box sx={{ mb: 4 }} data-testid={`hoshin-section-${label}`}>
      <Typography
        variant="h6" fontWeight={700} gutterBottom
        aria-label={label}
      >
        {label}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMsg}
        </Typography>
      ) : (
        rows.map((r) => (
          <HoshinObjectiveRow key={r.objective.id} row={r} />
        ))
      )}
    </Box>
  );
}

/**
 * @brief Renders the full Hoshin Kanri X-matrix.
 *        Groups objectives by horizon and shows linked
 *        startups as colour-coded strength chips.
 */
export default function HoshinXMatrix() {
  const t = useTranslations('hoshin');
  const { vision, breakthrough, annual, isLoading } =
    useHoshinMatrix();

  if (isLoading) return null;

  const empty = t('noObjectives');

  return (
    <Box data-testid="hoshin-xmatrix" aria-label={t('pageTitle')}>
      <Section
        label={t('vision')}
        rows={vision}
        emptyMsg={empty}
      />
      <Section
        label={t('breakthrough')}
        rows={breakthrough}
        emptyMsg={empty}
      />
      <Section
        label={t('annual')}
        rows={annual}
        emptyMsg={empty}
      />
    </Box>
  );
}
