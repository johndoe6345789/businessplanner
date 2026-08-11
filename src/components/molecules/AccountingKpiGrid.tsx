'use client';
/**
 * @file AccountingKpiGrid.tsx
 * @brief 5-tile KPI grid for the accounting dashboard.
 */

import React from 'react';
import { Grid, Card, CardContent, Typography,
         Skeleton } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { AccountingKpis }
  from '@/hooks/useAccountingDashboard';

/** Formats a number as £ GBP. */
const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB',
    { style: 'currency', currency: 'GBP',
      maximumFractionDigits: 0 }).format(n);

interface KpiTileProps {
  label: string; value: number | null;
  isCurrency?: boolean; testId: string;
}

function KpiTile({ label, value, isCurrency,
                   testId }: KpiTileProps) {
  return (
    <Card variant="outlined" data-testid={testId}>
      <CardContent>
        <Typography variant="caption"
          color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={700}
          sx={{ mt: 0.5 }}>
          {value === null
            ? <Skeleton width={80} />
            : isCurrency ? gbp(value) : value}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface Props {
  /** KPI data from useAccountingDashboard. */
  kpis: AccountingKpis;
}

/**
 * @brief Renders 5 KPI tiles: revenue, payroll, cash,
 *        headcount, and outstanding invoices.
 */
export default function AccountingKpiGrid({ kpis }: Props) {
  const t = useTranslations('accounting');
  const tiles = [
    { key: 'totalRevenue',    label: t('kpi.revenue'),
      v: kpis.totalRevenue,    currency: true  },
    { key: 'monthlyPayroll',  label: t('kpi.payroll'),
      v: kpis.monthlyPayroll,  currency: true  },
    { key: 'cashOnHand',      label: t('kpi.cash'),
      v: kpis.cashOnHand,      currency: true  },
    { key: 'headcount',       label: t('kpi.headcount'),
      v: kpis.headcount,       currency: false },
    { key: 'outstandingInv',  label: t('kpi.outstanding'),
      v: kpis.outstandingInv,  currency: true  },
  ];
  return (
    <Grid container spacing={2}
      data-testid="accounting-kpi-grid"
      aria-label={t('kpi.gridLabel')}>
      {tiles.map(({ key, label, v, currency }) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
          <KpiTile label={label} value={v}
            isCurrency={currency}
            testId={`kpi-${key}`} />
        </Grid>
      ))}
    </Grid>
  );
}
