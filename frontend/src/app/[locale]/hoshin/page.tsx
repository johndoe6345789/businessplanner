import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import HoshinXMatrix
  from '@/components/organisms/HoshinXMatrix';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

interface HoshinPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Hoshin Kanri strategy matrix page at /hoshin.
 * Aligns startup objectives across three horizons.
 *
 * @param props - Page props with locale.
 * @returns Hoshin strategy matrix page.
 */
export default async function HoshinPage({
  params,
}: HoshinPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hoshin');

  return (
    <Box
      component="main"
      role="main"
      data-testid="hoshin-page"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}
      >
        {t('pageTitle')}
      </Typography>
      <Typography
        variant="body1" color="text.secondary"
        sx={{ mb: 4 }}
      >
        {t('pageDescription')}
      </Typography>
      <HoshinXMatrix />
    </Box>
  );
}
