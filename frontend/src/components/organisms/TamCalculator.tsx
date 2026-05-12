'use client';

/**
 * TAM / SAM / SOM live calculator organism.
 * Loads saved inputs, computes results live, and persists
 * on explicit Save click.
 * @module components/organisms/TamCalculator
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useTamCompute } from '@/hooks/useTamCompute';
import {
  useGetTamQuery,
  useSaveTamMutation,
} from '@/store/api/marketResearchTamApi';

/** Format a USD value to a human-readable string. */
function formatUsd(n: number): string {
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

/**
 * Live TAM/SAM/SOM calculator with save functionality.
 * @returns TamCalculator UI.
 */
export const TamCalculator: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetTamQuery();
  const [saveTam, { isLoading: isSaving }] =
    useSaveTamMutation();

  const [totalMarketUsd, setTotalMarketUsd] =
    useState(0);
  const [targetSegmentPct, setTargetSegmentPct] =
    useState(10);
  const [reachablePct, setReachablePct] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!data) return;
    setTotalMarketUsd(data.totalMarketUsd);
    setTargetSegmentPct(data.targetSegmentPct);
    setReachablePct(data.reachablePct);
    setNotes(data.notes ?? '');
  }, [data]);

  const { tam, sam, som } = useTamCompute({
    totalMarketUsd,
    targetSegmentPct,
    reachablePct,
  });

  const handleSave = () => {
    void saveTam({
      totalMarketUsd,
      targetSegmentPct,
      reachablePct,
      notes,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center',
        mt: 4 }}>
        <CircularProgress aria-label={tc('loading')} />
      </Box>
    );
  }

  const resultCards = [
    { label: t('tam'), value: formatUsd(tam),
      testId: 'tam-result-tam' },
    { label: t('sam'), value: formatUsd(sam),
      testId: 'tam-result-sam' },
    { label: t('som'), value: formatUsd(som),
      testId: 'tam-result-som' },
  ];

  return (
    <Box data-testid="tam-calculator"
      aria-label={t('tam')}>
      <TextField
        label={t('totalMarket')}
        type="number"
        value={totalMarketUsd}
        onChange={(e) =>
          setTotalMarketUsd(Number(e.target.value))}
        inputProps={{
          'aria-label': t('totalMarket'),
          min: 0,
        }}
        data-testid="tam-input-total"
        fullWidth sx={{ mb: 3 }}
      />
      <Typography gutterBottom>
        {t('targetSegmentPct')}: {targetSegmentPct}%
      </Typography>
      <Slider
        value={targetSegmentPct}
        onChange={(_, v) =>
          setTargetSegmentPct(v as number)}
        min={0} max={100} step={1}
        aria-label={t('targetSegmentPct')}
        data-testid="tam-slider-segment"
        sx={{ mb: 3 }}
      />
      <Typography gutterBottom>
        {t('reachablePct')}: {reachablePct}%
      </Typography>
      <Slider
        value={reachablePct}
        onChange={(_, v) =>
          setReachablePct(v as number)}
        min={0} max={100} step={1}
        aria-label={t('reachablePct')}
        data-testid="tam-slider-reachable"
        sx={{ mb: 3 }}
      />
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap', mb: 3 }}>
        {resultCards.map((c) => (
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
      <TextField
        label="Notes"
        multiline rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        inputProps={{ 'aria-label': 'Notes' }}
        data-testid="tam-notes"
        fullWidth sx={{ mb: 2 }}
      />
      <Button
        onClick={handleSave}
        disabled={isSaving}
        aria-label={t('saveInputs')}
        data-testid="tam-save-btn"
        variant="contained"
      >
        {t('saveInputs')}
      </Button>
    </Box>
  );
};

export default TamCalculator;
