'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress
  from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { useTranslations } from 'next-intl';
import RiskLevelChip
  from '@/components/atoms/RiskLevelChip';
import type { StartupRiskProfile }
  from '@/hooks/startupCompareUtils';

/** Props for StartupScoreCard. */
export interface StartupScoreCardProps {
  /** Aggregated risk profile for one company. */
  readonly profile: StartupRiskProfile;
  /** Whether this is the best (lowest-risk) pick. */
  readonly isBest?: boolean;
}

const MAX_CAT_SCORE = 25;

/**
 * Card displaying one company's risk profile with
 * investment, time, revenue, and per-category bars.
 * @param props - StartupScoreCardProps.
 */
export const StartupScoreCard: React.FC<
  StartupScoreCardProps
> = ({ profile, isBest = false }) => {
  const t = useTranslations('startupCompare');
  const { org, totalScore, riskCount,
    breakdown, level } = profile;
  const gbp = (n: number) =>
    n >= 1000 ? `£${(n / 1000).toFixed(0)}k` : `£${n}`;
  return (
    <Box
      data-testid={`score-card-${org.id}`}
      aria-label={org.name}
      sx={{
        p: 2, borderRadius: 2,
        border: isBest ? '2px solid' : '1px solid',
        borderColor: isBest
          ? 'success.main' : 'divider',
        display: 'flex',
        flexDirection: 'column', gap: 1,
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center', gap: 1,
      }}>
        <Typography variant="subtitle1"
          fontWeight={700} flex={1}>
          {org.name}
        </Typography>
        <RiskLevelChip level={level} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1,
        flexWrap: 'wrap' }}>
        <Chip size="small"
          label={t('investment') + ': ' +
            gbp(org.initial_investment_gbp)}
          data-testid={`chip-inv-${org.id}`} />
        <Chip size="small"
          label={t('bootstrap', {
            weeks: org.weeks_to_bootstrap })}
          data-testid={`chip-wks-${org.id}`} />
        <Chip size="small" color="success"
          label={t('monthlyRevenue', {
            amount: gbp(org.monthly_revenue_gbp) })}
          data-testid={`chip-rev-${org.id}`} />
      </Box>
      <Typography variant="caption"
        color="text.secondary">
        {t('totalScore')}: {totalScore}
        {' · '}
        {t('riskCount', { count: riskCount })}
      </Typography>
      {breakdown.map(({ category, score }) => (
        <Box key={category}>
          <Typography variant="caption">
            {t(`category.${category}`)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(score / MAX_CAT_SCORE) * 100}
            aria-label={t(`category.${category}`)}
            data-testid={
              `bar-${org.id}-${category}`}
          />
        </Box>
      ))}
    </Box>
  );
};

export default StartupScoreCard;
