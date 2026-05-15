'use client';

/**
 * Financial health score page.
 * Derives the composite health score from persisted
 * burn, unit-econ, and pricing data via RTK Query.
 * @module app/[locale]/financials/health/page
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { FinancialHealthScore }
  from '@/components/organisms/FinancialHealthScore';
import { useBurnCompute }
  from '@/hooks/useBurnCompute';
import { useUnitEconCompute }
  from '@/hooks/useUnitEconCompute';
import { useHealthScore }
  from '@/hooks/useHealthScore';
import { useGetBurnQuery }
  from '@/store/api/financialsBurnApi';
import { useGetUnitEconQuery }
  from '@/store/api/financialsUnitEconApi';
import { useGetPricingQuery }
  from '@/store/api/financialsPricingApi';
import type {
  BurnInputs, UnitEconInputs, PricingInputs,
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
 * Financial health score standalone page.
 * @returns Health page UI.
 */
export default function HealthPage() {
  const t = useTranslations('financials');
  const { data: burnInputs = DEFAULT_BURN } =
    useGetBurnQuery();
  const { data: ueInputs = DEFAULT_UE } =
    useGetUnitEconQuery();
  const { data: pricingInputs = DEFAULT_PRICING } =
    useGetPricingQuery();

  const burnResult = useBurnCompute(burnInputs);
  const unitEconResult = useUnitEconCompute(ueInputs);
  const health = useHealthScore(
    burnResult, unitEconResult, pricingInputs,
  );

  return (
    <Box component="main" role="main"
      data-testid="financials-health-page"
      aria-label={t('health.title')}
      sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('health.title')}
      </Typography>
      <FinancialHealthScore health={health} />
    </Box>
  );
}
