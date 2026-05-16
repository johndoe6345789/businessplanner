'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import { Button } from '@shared/m3/Button';
import Stack from '@shared/m3/Stack';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useFirstVisit } from '@/hooks/useFirstVisit';

/**
 * Dismissible welcome banner shown only on the
 * user's first visit. Guides them to the Planner
 * or the onboarding wizard.
 *
 * @returns Banner element or null after dismissal.
 */
export const WelcomeBanner: React.FC = () => {
  const t = useTranslations('welcome');
  const { isFirstVisit, dismiss } = useFirstVisit();

  if (!isFirstVisit) return null;

  return (
    <Alert
      severity="info"
      onClose={dismiss}
      data-testid="welcome-banner"
      aria-label={t('title')}
      sx={{ borderRadius: 2, mb: 2 }}
    >
      <Typography variant="subtitle2" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {t('body')}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          component={Link}
          href="/planner"
          variant="contained"
          size="small"
          onClick={dismiss}
          testId="welcome-cta-planner"
          aria-label={t('ctaPlanner')}
        >
          {t('ctaPlanner')}
        </Button>
        <Button
          component={Link}
          href="/onboarding"
          variant="outlined"
          size="small"
          onClick={dismiss}
          testId="welcome-cta-setup"
          aria-label={t('ctaSetup')}
        >
          {t('ctaSetup')}
        </Button>
      </Stack>
    </Alert>
  );
};

export default WelcomeBanner;
