import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { PathComparison }
  from '@/components/organisms/PathComparison';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the paths comparison page. */
interface PathsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Funding path comparison page at /financials/paths.
 *
 * @param props - Page props with locale.
 * @returns Paths comparison page UI.
 */
export default async function PathsPage({
  params,
}: PathsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('paths.title')}
      sx={{ maxWidth: 1080, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('paths.title')}
      </Typography>
      <PathComparison />
    </Box>
  );
}
