'use client';
/**
 * @file AccountingKpiBar.tsx
 * @brief Compact inline row of accounting KPIs for
 *        embedding on other pages (e.g. startup-compare).
 */

import React from 'react';
import { Box, Typography, Chip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useAccountingDashboard }
  from '@/hooks/useAccountingDashboard';

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB',
    { style: 'currency', currency: 'GBP',
      maximumFractionDigits: 0 }).format(n);

/**
 * @brief Renders a horizontal strip of live Xero/Zelt KPIs.
 *        Returns null if neither service is connected.
 */
export default function AccountingKpiBar() {
  const t = useTranslations('accounting');
  const {
    totalRevenue, monthlyPayroll, headcount,
    xeroConnected, zeltConnected,
  } = useAccountingDashboard();

  if (!xeroConnected && !zeltConnected) return null;

  const chips: Array<{ label: string; v: number | null;
    currency?: boolean }> = [
    { label: t('kpi.revenue'),
      v: totalRevenue, currency: true },
    { label: t('kpi.payroll'),
      v: monthlyPayroll, currency: true },
    { label: t('kpi.headcount'), v: headcount },
  ];

  return (
    <Box
      data-testid="accounting-kpi-bar"
      aria-label={t('kpi.gridLabel')}
      sx={{ display: 'flex', gap: 1.5,
        flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
      <Typography variant="caption"
        color="text.secondary" sx={{ mr: 0.5 }}>
        {t('overview')}:
      </Typography>
      {chips.map(({ label, v, currency }) => (
        <Chip key={label} size="small"
          data-testid={`kpi-bar-${label}`}
          label={v === null
            ? `${label}: —`
            : `${label}: ${currency ? gbp(v) : v}`}
        />
      ))}
    </Box>
  );
}
