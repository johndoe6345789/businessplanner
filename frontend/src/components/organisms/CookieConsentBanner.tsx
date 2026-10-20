'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Box } from '@shared/m3';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'cookie-consent';

/**
 * Cookie consent banner that renders fixed at the bottom of the
 * viewport until the user accepts or declines. Choice is persisted
 * in localStorage so the banner is never shown again.
 */
const CookieConsentBanner: React.FC = () => {
  const t = useTranslations('cookieConsent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Paper
      elevation={4}
      data-testid="cookie-consent-banner"
      role="region"
      aria-label={t('message')}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1400,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        {t('message')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleChoice('accepted')}
          data-testid="cookie-accept"
          aria-label={t('accept')}
        >
          {t('accept')}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleChoice('declined')}
          data-testid="cookie-decline"
          aria-label={t('decline')}
        >
          {t('decline')}
        </Button>
      </Box>
    </Paper>
  );
};

export default CookieConsentBanner;
