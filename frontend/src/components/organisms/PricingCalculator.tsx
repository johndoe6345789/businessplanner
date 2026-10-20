'use client';

/**
 * Pricing live calculator organism.
 * @module components/organisms/PricingCalculator
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import {
  useGetPricingQuery,
  useSavePricingMutation,
} from '@/store/api/financialsPricingApi';
import { usePricingCompute }
  from '@/hooks/usePricingCompute';

/**
 * Pricing calculator — shows customers needed for target MRR.
 * D29: price of £0 and target of £0 are both valid.
 * @returns PricingCalculator UI.
 */
export const PricingCalculator: React.FC = () => {
  const t = useTranslations('financials');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetPricingQuery();
  const [savePricing] = useSavePricingMutation();
  const [price, setPrice] = useState(0);
  const [targetMrr, setTargetMrr] = useState(0);

  useEffect(() => {
    if (!data) return;
    setPrice(data.price_gbp);
    setTargetMrr(data.target_mrr_gbp);
  }, [data]);

  const { required_customers } = usePricingCompute({
    price_gbp: price,
    target_mrr_gbp: targetMrr,
    initial_customers: data?.initial_customers ?? 0,
    monthly_growth_pct: data?.monthly_growth_pct ?? 0,
    revenue_model: data?.revenue_model ?? 'subscription',
    notes: data?.notes ?? '',
  });

  const handleBlur = () =>
    void savePricing({
      ...(data ?? {
        initial_customers: 0,
        monthly_growth_pct: 0,
        revenue_model: 'subscription',
        notes: '',
      }),
      price_gbp: price,
      target_mrr_gbp: targetMrr,
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
    <Box data-testid="pricing-calculator"
      aria-label={t('pricing.title')}>
      <TextField label={`${t('pricing.price')} (£)`}
        type="number" value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        onBlur={handleBlur}
        inputProps={{ 'aria-label': t('pricing.price'),
          min: 0 }}
        data-testid="pricing-input-price"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={`${t('pricing.targetMrr')} (£)`}
        type="number" value={targetMrr}
        onChange={(e) => setTargetMrr(Number(e.target.value))}
        onBlur={handleBlur}
        inputProps={{ 'aria-label': t('pricing.targetMrr'),
          min: 0 }}
        data-testid="pricing-input-mrr"
        fullWidth sx={{ mb: 2 }} />
      <Typography data-testid="pricing-result">
        {t('pricing.customersNeeded')}:{' '}
        {price > 0 ? required_customers : 'Not calculable'}
      </Typography>
    </Box>
  );
};

export default PricingCalculator;
