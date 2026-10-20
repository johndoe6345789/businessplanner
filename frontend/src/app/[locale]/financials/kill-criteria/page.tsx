import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { KillCriteria }
  from '@/components/organisms/KillCriteria';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the kill criteria page. */
interface KillCriteriaPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Kill criteria page at /financials/kill-criteria.
 *
 * @param props - Page props with locale.
 * @returns Kill criteria page UI.
 */
export default async function KillCriteriaPage({
  params,
}: KillCriteriaPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('killCriteria.title')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('killCriteria.title')}
      </Typography>
      <KillCriteria />
    </Box>
  );
}
