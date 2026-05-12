'use client';

/**
 * Revenue model selector organism.
 * @module components/organisms/RevenueModelSelector
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import CircularProgress from
  '@mui/material/CircularProgress';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from
  '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useTranslations } from 'next-intl';
import {
  useGetPricingQuery,
  useSavePricingMutation,
} from '@/store/api/financialsPricingApi';
import revenueModels from
  '@/constants/revenue-models.json';
import { RevenueModelCard }
  from '@/components/molecules/RevenueModelCard';
import type { RevenueModel } from '@/types/financials';

const MODEL_KEYS: RevenueModel[] = [
  'subscription', 'freemium', 'usage',
  'transactional', 'marketplace',
];

/**
 * Radio selector for revenue model with description card.
 * @returns RevenueModelSelector UI.
 */
export const RevenueModelSelector: React.FC = () => {
  const t = useTranslations('financials');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetPricingQuery();
  const [savePricing] = useSavePricingMutation();
  const [selected, setSelected] =
    useState<RevenueModel>('subscription');

  useEffect(() => {
    if (data?.revenue_model) {
      setSelected(data.revenue_model as RevenueModel);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const model = e.target.value as RevenueModel;
    setSelected(model);
    void savePricing({
      ...(data ?? {
        price_gbp: 0, target_mrr_gbp: 0,
        initial_customers: 0,
        monthly_growth_pct: 0, notes: '',
      }),
      revenue_model: model,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="revenue-model-selector"
      aria-label={t('pricing.model')}>
      <RadioGroup value={selected} onChange={handleChange}
        aria-label={t('pricing.model')}
        data-testid="revenue-model-group">
        {MODEL_KEYS.map((key) => (
          <FormControlLabel key={key} value={key}
            control={
              <Radio
                data-testid={`revenue-model-${key}`}
                aria-label={revenueModels[key].name} />
            }
            label={revenueModels[key].name} />
        ))}
      </RadioGroup>
      <RevenueModelCard selected={selected} />
    </Box>
  );
};

export default RevenueModelSelector;
