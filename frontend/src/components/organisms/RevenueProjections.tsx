'use client';

/**
 * Revenue projections organism.
 * @module components/organisms/RevenueProjections
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import {
  useGetPricingQuery,
  useSavePricingMutation,
} from '@/store/api/financialsPricingApi';
import { usePricingCompute }
  from '@/hooks/usePricingCompute';
import { ProjectionsTable }
  from '@/components/molecules/ProjectionsTable';

const DEFAULTS = {
  price_gbp: 0, target_mrr_gbp: 0,
  revenue_model: 'subscription', notes: '',
};

/**
 * Growth inputs and 12-month projection table.
 * @returns RevenueProjections UI.
 */
export const RevenueProjections: React.FC = () => {
  const t = useTranslations('financials');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetPricingQuery();
  const [savePricing] = useSavePricingMutation();
  const [initialCustomers, setInitialCustomers] =
    useState(0);
  const [growthPct, setGrowthPct] = useState(10);

  useEffect(() => {
    if (!data) return;
    setInitialCustomers(data.initial_customers);
    setGrowthPct(data.monthly_growth_pct);
  }, [data]);

  const { projections } = usePricingCompute({
    ...(data ?? DEFAULTS),
    initial_customers: initialCustomers,
    monthly_growth_pct: growthPct,
  });

  const handleBlur = () =>
    void savePricing({
      ...(data ?? DEFAULTS),
      initial_customers: initialCustomers,
      monthly_growth_pct: growthPct,
    });

  if (isLoading) return (
    <Box sx={{ display: 'flex',
      justifyContent: 'center', mt: 4 }}>
      <CircularProgress aria-label={tc('loading')} />
    </Box>
  );

  return (
    <Box data-testid="revenue-projections"
      aria-label={t('projections.title')}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2,
        flexWrap: 'wrap' }}>
        <TextField
          label={t('projections.initialCustomers')}
          type="number" value={initialCustomers}
          onChange={(e) =>
            setInitialCustomers(Number(e.target.value))}
          onBlur={handleBlur}
          inputProps={{
            'aria-label': t('projections.initialCustomers'),
            min: 0 }}
          data-testid="proj-input-customers"
          sx={{ flex: 1, minWidth: 180 }} />
        <TextField
          label={`${t('projections.growthPct')} (%)`}
          type="number" value={growthPct}
          onChange={(e) =>
            setGrowthPct(Number(e.target.value))}
          onBlur={handleBlur}
          inputProps={{
            'aria-label': t('projections.growthPct'),
            min: 0 }}
          data-testid="proj-input-growth"
          sx={{ flex: 1, minWidth: 160 }} />
      </Box>
      <ProjectionsTable projections={projections}
        targetMrr={data?.target_mrr_gbp ?? 0} />
    </Box>
  );
};

export default RevenueProjections;
