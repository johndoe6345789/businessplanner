'use client';

/**
 * Financial dashboard layout organism.
 * Composes health score, burn, unit econ, and pricing.
 * @module components/organisms/FinancialDashboard
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Grid from '@mui/material/Grid';
import { useTranslations } from 'next-intl';
import { BurnRateCalculator }
  from './BurnRateCalculator';
import { UnitEconomicsModel }
  from './UnitEconomicsModel';
import { PricingCalculator }
  from './PricingCalculator';
import { FinancialHealthScore }
  from './FinancialHealthScore';
import { useBurnCompute }
  from '@/hooks/useBurnCompute';
import { useUnitEconCompute }
  from '@/hooks/useUnitEconCompute';
import { useHealthScore }
  from '@/hooks/useHealthScore';
import type {
  BurnInputs,
  UnitEconInputs,
  PricingInputs,
} from '@/types/financials';

const DEFAULT_BURN: BurnInputs = {
  monthly_burn_gbp: 0, cash_in_bank_gbp: 0,
  monthly_revenue_gbp: 0, notes: '',
};
const DEFAULT_UE: UnitEconInputs = {
  cac_gbp: 0, arpu_gbp: 0,
  churn_pct: 5, cogs_pct: 20,
};
const DEFAULT_PRICING: PricingInputs = {
  revenue_model: 'subscription', price_gbp: 0,
  target_mrr_gbp: 0, initial_customers: 0,
  monthly_growth_pct: 10, notes: '',
};

/**
 * Dashboard layout — no business logic, just composition.
 * @returns FinancialDashboard UI.
 */
export const FinancialDashboard: React.FC = () => {
  const t = useTranslations('financials');
  const [burnInputs] = useState<BurnInputs>(DEFAULT_BURN);
  const [ueInputs] = useState<UnitEconInputs>(DEFAULT_UE);
  const [pricingInputs] =
    useState<PricingInputs>(DEFAULT_PRICING);

  const burnResult = useBurnCompute(burnInputs);
  const unitEconResult = useUnitEconCompute(ueInputs);
  const health = useHealthScore(
    burnResult, unitEconResult, pricingInputs,
  );

  return (
    <Box data-testid="financial-dashboard"
      aria-label={t('nav.dashboard')}>
      <Typography variant="h5" sx={{ mb: 3,
        fontWeight: 700 }}>
        {t('nav.dashboard')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FinancialHealthScore health={health} />
        </Grid>
        <Grid item xs={12} md={6}>
          <BurnRateCalculator />
        </Grid>
        <Grid item xs={12} md={6}>
          <UnitEconomicsModel />
        </Grid>
        <Grid item xs={12} md={6}>
          <PricingCalculator />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialDashboard;
