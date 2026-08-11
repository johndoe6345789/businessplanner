import type { ReactElement } from 'react';
import {
  setRequestLocale, getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import OkrBoard from '@/components/organisms/OkrBoard';

export const dynamic = 'force-dynamic';

interface OkrPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * OKR board page at /okr.
 * Objectives and Key Results tracker.
 *
 * @param props - Page props with locale.
 * @returns OKR board page.
 */
export default async function OkrPage({
  params,
}: OkrPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('okr');

  return (
    <Box component="main" role="main"
      data-testid="okr-page"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('pageTitle')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('pageDescription')}
      </Typography>
      <OkrBoard />
    </Box>
  );
}
