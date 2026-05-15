'use client';
/**
 * @file AccountingDashboard.tsx
 * @brief Accounting dashboard organism: KPI grid,
 *        connection cards, and data tables.
 */

import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useAccountingDashboard }
  from '@/hooks/useAccountingDashboard';
import AccountingKpiGrid
  from '@/components/molecules/AccountingKpiGrid';
import XeroConnectionCard
  from '@/components/molecules/XeroConnectionCard';
import ZeltConnectionCard
  from '@/components/molecules/ZeltConnectionCard';

/**
 * @brief Full accounting dashboard: integrations panel
 *        on top, KPI summary below.
 */
export default function AccountingDashboard() {
  const t = useTranslations('accounting');
  const kpis = useAccountingDashboard();

  return (
    <Box data-testid="accounting-dashboard"
      aria-label={t('pageTitle')}>

      <Typography variant="h6" fontWeight={700}
        gutterBottom sx={{ mt: 2 }}>
        {t('integrations')}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <XeroConnectionCard />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ZeltConnectionCard />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" fontWeight={700}
        gutterBottom>
        {t('overview')}
      </Typography>

      <AccountingKpiGrid kpis={kpis} />

      {!kpis.xeroConnected && !kpis.zeltConnected && (
        <Typography variant="body2"
          color="text.secondary"
          sx={{ mt: 4, textAlign: 'center' }}
          data-testid="accounting-empty">
          {t('connectPrompt')}
        </Typography>
      )}
    </Box>
  );
}
