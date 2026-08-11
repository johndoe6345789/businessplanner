'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button }
  from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { KpiMetric } from '@/types/kpi';

/** Props for KpiUpdateInline. */
export interface KpiUpdateInlineProps {
  /** Metric whose value is being updated. */
  readonly metric: KpiMetric;
  /** Called with the new numeric value. */
  readonly onConfirm: (value: number) => void;
  /** Called to dismiss without saving. */
  readonly onCancel: () => void;
}

/** Inline row for updating a KPI metric value. */
const KpiUpdateInline: React.FC<
  KpiUpdateInlineProps
> = ({ metric, onConfirm, onCancel }) => {
  const t = useTranslations('kpi');
  const [value, setValue] = useState(
    String(metric.current_value));

  return (
    <Box sx={{ display: 'flex', gap: 1,
      alignItems: 'center', mt: 1 }}
      data-testid="kpi-update-inline">
      <Typography variant="body2">
        {metric.title}
      </Typography>
      <TextField size="small" type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={t('updateValue')}
        data-testid="kpi-new-value-input"
        sx={{ width: 100 }} />
      <Button size="small" variant="contained"
        data-testid="kpi-update-confirm"
        onClick={() => onConfirm(parseFloat(value))}>
        OK
      </Button>
      <Button size="small" variant="text"
        data-testid="kpi-update-cancel"
        onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
};

export default KpiUpdateInline;
