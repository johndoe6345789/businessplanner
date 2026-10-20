import type { ReactElement } from 'react';
import {
  setRequestLocale, getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import PdcaBoard
  from '@/components/organisms/PdcaBoard';

export const dynamic = 'force-dynamic';

interface PdcaPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * PDCA cycles page at /pdca.
 * Plan–Do–Check–Act continuous improvement.
 *
 * @param props - Page props with locale.
 * @returns PDCA board page.
 */
export default async function PdcaPage({
  params,
}: PdcaPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pdca');

  return (
    <Box component="main" role="main"
      data-testid="pdca-page"
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
      <PdcaBoard />
    </Box>
  );
}
