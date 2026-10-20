'use client';

/**
 * Unit economics model organism.
 * @module components/organisms/UnitEconomicsModel
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useUnitEconCompute }
  from '@/hooks/useUnitEconCompute';
import {
  useGetUnitEconQuery,
  useSaveUnitEconMutation,
} from '@/store/api/financialsUnitEconApi';
import { UnitEconInputFields }
  from '@/components/molecules/UnitEconInputFields';
import { UnitEconResultDisplay }
  from '@/components/molecules/UnitEconResultDisplay';

/**
 * Live unit economics calculator with save-on-blur.
 * @returns UnitEconomicsModel UI.
 */
export const UnitEconomicsModel: React.FC = () => {
  const t = useTranslations('financials');
  const tc = useTranslations('common');
  const { data, isLoading } = useGetUnitEconQuery();
  const [saveUnitEcon] = useSaveUnitEconMutation();
  const [cac, setCac] = useState(0);
  const [arpu, setArpu] = useState(0);
  const [churn, setChurn] = useState(5);
  const [cogs, setCogs] = useState(20);

  useEffect(() => {
    if (!data) return;
    setCac(data.cac_gbp);
    setArpu(data.arpu_gbp);
    setChurn(data.churn_pct);
    setCogs(data.cogs_pct);
  }, [data]);

  const result = useUnitEconCompute({
    cac_gbp: cac, arpu_gbp: arpu,
    churn_pct: churn, cogs_pct: cogs,
  });

  const handleBlur = () =>
    void saveUnitEcon({
      cac_gbp: cac, arpu_gbp: arpu,
      churn_pct: churn, cogs_pct: cogs,
    });

  const handleChange = (
    field: 'cac' | 'arpu' | 'churn' | 'cogs',
    value: number,
  ) => {
    if (field === 'cac') setCac(value);
    else if (field === 'arpu') setArpu(value);
    else if (field === 'churn') setChurn(value);
    else setCogs(value);
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
    <Box data-testid="unit-economics-model"
      aria-label={t('unitEcon.title')}>
      <UnitEconInputFields cac={cac} arpu={arpu}
        churn={churn} cogs={cogs}
        onChange={handleChange} onBlur={handleBlur} />
      <UnitEconResultDisplay result={result}
        onSave={handleBlur} />
    </Box>
  );
};

export default UnitEconomicsModel;
