import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

const OnboardingWizard = nextDynamic(
  () => import(
    '@/components/organisms/OnboardingWizard'
  ),
  { loading: () => (
    <div data-testid="onboarding-loading" />
  ) },
);

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the onboarding page. */
interface OnboardingPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Onboarding setup page. Accessible without completing
 * setup — no hard gate.
 *
 * @param props - Page props with locale params.
 * @returns Onboarding wizard UI.
 */
export default async function OnboardingPage({
  params,
}: OnboardingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('onboarding');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {t('title')}
      </Typography>
      <OnboardingWizard />
    </Box>
  );
}
