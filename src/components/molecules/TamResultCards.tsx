'use client';

/**
 * Result cards for TAM, SAM, and SOM values.
 * @module components/molecules/TamResultCards
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import type { TamResult } from '@/types/marketResearch';

/** Format a USD value to B / M / K shorthand. */
export function formatUsd(n: number): string {
  if (n >= 1_000_000_000) {
    return `$${(n / 1_000_000_000).toFixed(1)}B`;
  }
  if (n >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `$${(n / 1_000).toFixed(1)}K`;
  }
  return `$${n.toFixed(0)}`;
}

/** Props for TamResultCards. */
export interface TamResultCardsProps {
  /** Computed TAM/SAM/SOM result. */
  readonly result: TamResult;
}

/**
 * Three result cards showing TAM, SAM, and SOM values.
 *
 * @param props - TamResultCardsProps.
 * @returns Horizontal card row with computed values.
 */
export const TamResultCards: React.FC<
  TamResultCardsProps
> = ({ result }) => {
  const t = useTranslations('marketResearch');
  const cards = [
    { label: t('tam'), value: formatUsd(result.tam),
      testId: 'tam-result-tam' },
    { label: t('samLabel'),
      value: formatUsd(result.sam),
      testId: 'tam-result-sam' },
    { label: t('somLabel'),
      value: formatUsd(result.som),
      testId: 'tam-result-som' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2,
      flexWrap: 'wrap', mb: 3 }}>
      {cards.map((c) => (
        <Card key={c.testId}
          data-testid={c.testId}
          sx={{ flex: '1 1 140px' }}>
          <CardContent>
            <Typography variant="body2"
              color="text.secondary">
              {c.label}
            </Typography>
            <Typography variant="h6"
              sx={{ fontWeight: 700 }}>
              {c.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TamResultCards;
