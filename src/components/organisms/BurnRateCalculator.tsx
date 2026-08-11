'use client';

/**
 * Burn rate calculator organism.
 * @module components/organisms/BurnRateCalculator
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useBurnCompute } from '@/hooks/useBurnCompute';
import {
  useGetBurnQuery,
  useSaveBurnMutation,
} from '@/store/api/financialsBurnApi';
import { BurnInputFields }
  from '@/components/molecules/BurnInputFields';
import { BurnResultDisplay }
  from '@/components/molecules/BurnResultDisplay';

/**
 * Live burn rate calculator with save-on-blur.
 * @returns BurnRateCalculator UI.
 */
export const BurnRateCalculator: React.FC = () => {
  const t = useTranslations('financials');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetBurnQuery();
  const [saveBurn] = useSaveBurnMutation();
  const [burn, setBurn] = useState(0);
  const [cash, setCash] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!data) return;
    setBurn(data.monthly_burn_gbp);
    setCash(data.cash_in_bank_gbp);
    setRevenue(data.monthly_revenue_gbp);
    setNotes(data.notes ?? '');
  }, [data]);

  const result = useBurnCompute({
    monthly_burn_gbp: burn, cash_in_bank_gbp: cash,
    monthly_revenue_gbp: revenue, notes,
  });

  const handleBlur = () =>
    void saveBurn({
      monthly_burn_gbp: burn, cash_in_bank_gbp: cash,
      monthly_revenue_gbp: revenue, notes,
    });

  const handleChange = (
    field: 'burn' | 'cash' | 'revenue',
    value: number,
  ) => {
    if (field === 'burn') setBurn(value);
    else if (field === 'cash') setCash(value);
    else setRevenue(value);
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
    <Box data-testid="burn-rate-calculator"
      aria-label={t('burn.title')}>
      <BurnInputFields burn={burn} cash={cash}
        revenue={revenue}
        onChange={handleChange} onBlur={handleBlur} />
      <BurnResultDisplay result={result}
        onSave={handleBlur} />
    </Box>
  );
};

export default BurnRateCalculator;
