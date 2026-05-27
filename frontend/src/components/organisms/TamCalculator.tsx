'use client';

/**
 * TAM / SAM / SOM live calculator organism.
 * @module components/organisms/TamCalculator
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Slider from '@mui/material/Slider';
import CircularProgress from
  '@mui/material/CircularProgress';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useTamCalculator }
  from '@/hooks/useTamCalculator';
import { TamResultCards }
  from '@/components/molecules/TamResultCards';

/**
 * Live TAM/SAM/SOM calculator with save functionality.
 * @returns TamCalculator UI.
 */
export const TamCalculator: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const vm = useTamCalculator();

  if (vm.isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="tam-calculator"
      aria-label={t('tam')}>
      <TextField
        label={t('totalMarket')} type="number"
        value={vm.totalMarketUsd}
        onChange={(e) =>
          vm.setTotalMarketUsd(Number(e.target.value))}
        inputProps={{
          'aria-label': t('totalMarket'), min: 0 }}
        data-testid="tam-input-total"
        fullWidth sx={{ mb: 3 }}
      />
      <Typography gutterBottom>
        {t('targetSegmentPct')}:
        {' '}{vm.targetSegmentPct}%
      </Typography>
      <Slider value={vm.targetSegmentPct}
        onChange={(_, v) =>
          vm.setTargetSegmentPct(v as number)}
        min={0} max={100} step={1}
        aria-label={t('targetSegmentPct')}
        data-testid="tam-slider-segment"
        sx={{ mb: 3 }}
      />
      <Typography gutterBottom>
        {t('reachablePct')}: {vm.reachablePct}%
      </Typography>
      <Slider value={vm.reachablePct}
        onChange={(_, v) =>
          vm.setReachablePct(v as number)}
        min={0} max={100} step={1}
        aria-label={t('reachablePct')}
        data-testid="tam-slider-reachable"
        sx={{ mb: 3 }}
      />
      <TamResultCards result={vm.result} />
      <TextField label="Notes" multiline rows={3}
        value={vm.notes}
        onChange={(e) => vm.setNotes(e.target.value)}
        inputProps={{ 'aria-label': 'Notes' }}
        data-testid="tam-notes"
        fullWidth sx={{ mb: 2 }}
      />
      <Button onClick={vm.handleSave}
        disabled={vm.isSaving}
        aria-label={t('saveInputs')}
        data-testid="tam-save-btn"
        variant="contained">
        {t('saveInputs')}
      </Button>
    </Box>
  );
};

export default TamCalculator;
