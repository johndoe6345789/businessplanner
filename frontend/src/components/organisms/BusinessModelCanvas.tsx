'use client';

/**
 * Business Model Canvas (Lean Canvas) organism.
 * Nine text areas, auto-saved on blur via useBmcAutosave.
 * @module components/organisms/BusinessModelCanvas
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Grid from '@shared/m3/Grid';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useGetBmcQuery }
  from '@/store/api/marketResearchBmcApi';
import { useBmcAutosave }
  from '@/hooks/useBmcAutosave';
import type { BmcCanvas } from '@/types/marketResearch';

const EMPTY_CANVAS: BmcCanvas = {
  problem: '', solution: '', uvp: '',
  channels: '', customerSegments: '',
  costStructure: '', revenueStreams: '',
  keyMetrics: '', unfairAdvantage: '',
};

/** A single canvas field descriptor. */
interface CanvasField {
  key: keyof BmcCanvas;
  labelKey: string;
  testId: string;
}

const FIELDS: CanvasField[] = [
  { key: 'problem', labelKey: 'problem',
    testId: 'bmc-problem' },
  { key: 'solution', labelKey: 'solution',
    testId: 'bmc-solution' },
  { key: 'uvp', labelKey: 'uvp',
    testId: 'bmc-uvp' },
  { key: 'channels', labelKey: 'channels',
    testId: 'bmc-channels' },
  { key: 'customerSegments',
    labelKey: 'customerSegments',
    testId: 'bmc-customer-segments' },
  { key: 'costStructure', labelKey: 'costStructure',
    testId: 'bmc-cost-structure' },
  { key: 'revenueStreams', labelKey: 'revenueStreams',
    testId: 'bmc-revenue-streams' },
  { key: 'keyMetrics', labelKey: 'keyMetrics',
    testId: 'bmc-key-metrics' },
  { key: 'unfairAdvantage',
    labelKey: 'unfairAdvantage',
    testId: 'bmc-unfair-advantage' },
];

/**
 * Business Model Canvas organism.
 * @returns BusinessModelCanvas UI.
 */
export const BusinessModelCanvas: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetBmcQuery();
  const { scheduleAutosave } = useBmcAutosave();
  const [canvas, setCanvas] =
    useState<BmcCanvas>(EMPTY_CANVAS);

  useEffect(() => {
    if (data) setCanvas(data);
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  const handleChange = (
    key: keyof BmcCanvas,
    value: string,
  ) => {
    setCanvas((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = () => {
    scheduleAutosave(canvas);
  };

  return (
    <Box data-testid="business-model-canvas"
      aria-label={t('canvas')}>
      <Grid container spacing={2}>
        {FIELDS.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f.key}>
            <TextField
              label={t(f.labelKey as Parameters<
                typeof t>[0])}
              multiline rows={4}
              value={canvas[f.key]}
              onChange={(e) =>
                handleChange(f.key, e.target.value)}
              onBlur={handleBlur}
              inputProps={{
                'aria-label': t(f.labelKey as Parameters<
                  typeof t>[0]),
              }}
              data-testid={f.testId}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BusinessModelCanvas;
