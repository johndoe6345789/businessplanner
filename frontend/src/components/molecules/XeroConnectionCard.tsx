'use client';
/**
 * @file XeroConnectionCard.tsx
 * @brief Xero OAuth connection status card with
 *        connect/disconnect actions.
 */

import React from 'react';
import { Card, CardContent, CardActions,
         Typography, Button, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useXeroStatusQuery,
         useXeroDisconnectMutation }
  from '@/store/api/xeroApi';
import api from '@/constants/api.json';

/**
 * @brief Shows Xero connection status and
 *        provides connect (OAuth redirect) / disconnect.
 */
export default function XeroConnectionCard() {
  const t = useTranslations('accounting');
  const { data, isLoading } = useXeroStatusQuery();
  const [disconnect] = useXeroDisconnectMutation();
  const connected = data?.connected ?? false;

  return (
    <Card variant="outlined"
      data-testid="xero-connection-card"
      aria-label={t('xero.cardLabel')}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}
          gutterBottom>
          {t('xero.title')}
        </Typography>
        <Chip
          label={connected
            ? (data?.tenantName ?? t('xero.connected'))
            : t('xero.notConnected')}
          color={connected ? 'success' : 'default'}
          size="small"
          data-testid="xero-status-chip"
        />
        <Typography variant="body2"
          color="text.secondary" sx={{ mt: 1 }}>
          {t('xero.description')}
        </Typography>
      </CardContent>
      <CardActions>
        {connected ? (
          <Button size="small" color="error"
            data-testid="xero-disconnect-btn"
            onClick={() => disconnect()}>
            {t('xero.disconnect')}
          </Button>
        ) : (
          <Button size="small" variant="contained"
            data-testid="xero-connect-btn"
            href={api.xero.connect}>
            {t('xero.connect')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
