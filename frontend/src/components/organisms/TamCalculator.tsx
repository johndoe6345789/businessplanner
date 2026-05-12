'use client';

/**
 * TAM / SAM / SOM live calculator organism.
 * @module components/organisms/TamCalculator
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Slider from '@mui/material/Slider';
import CircularProgress from
  '@mui/material/CircularProgress';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useTamCompute } from '@/hooks/useTamCompute';
import {
  useGetTamQuery,
  useSaveTamMutation,
} from '@/store/api/marketResearchTamApi';
import { TamResultCards }
  from '@/components/molecules/TamResultCards';

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

  const [totalMarketUsd, setTotalMarketUsd] = useState(0);
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

  const result = useTamCompute({
    totalMarketUsd, targetSegmentPct, reachablePct,
  });

  const handleSave = () =>
    void saveTam({
      totalMarketUsd, targetSegmentPct,
      reachablePct, notes,
    });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="tam-calculator"
      aria-label={t('tam')}>
      <TextField
        label={t('totalMarket')} type="number"
        value={totalMarketUsd}
        onChange={(e) =>
          setTotalMarketUsd(Number(e.target.value))}
        inputProps={{
          'aria-label': t('totalMarket'), min: 0 }}
        data-testid="tam-input-total"
        fullWidth sx={{ mb: 3 }}
      />
      <Typography gutterBottom>
        {t('targetSegmentPct')}: {targetSegmentPct}%
      </Typography>
      <Slider value={targetSegmentPct}
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
      <Slider value={reachablePct}
        onChange={(_, v) =>
          setReachablePct(v as number)}
        min={0} max={100} step={1}
        aria-label={t('reachablePct')}
        data-testid="tam-slider-reachable"
        sx={{ mb: 3 }}
      />
      <TamResultCards result={result} />
      <TextField label="Notes" multiline rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        inputProps={{ 'aria-label': 'Notes' }}
        data-testid="tam-notes" fullWidth sx={{ mb: 2 }}
      />
      <Button onClick={handleSave} disabled={isSaving}
        aria-label={t('saveInputs')}
        data-testid="tam-save-btn"
        variant="contained">
        {t('saveInputs')}
      </Button>
    </Box>
  );
};

export default TamCalculator;
