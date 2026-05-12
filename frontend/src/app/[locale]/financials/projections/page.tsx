import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { RevenueProjections }
  from '@/components/organisms/RevenueProjections';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the projections page. */
interface ProjectionsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Revenue projections page at /financials/projections.
 *
 * @param props - Page props with locale.
 * @returns Revenue projections page UI.
 */
export default async function ProjectionsPage({
  params,
}: ProjectionsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('projections.title')}
      sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('projections.title')}
      </Typography>
      <RevenueProjections />
    </Box>
  );
}
