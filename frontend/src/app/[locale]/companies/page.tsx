import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { OrganisationRegistry }
  from '@/components/organisms/OrganisationRegistry';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the companies registry page. */
interface CompaniesPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Companies registry page at /companies.
 * Unified browser for all tracked organisations.
 *
 * @param props - Page props with locale.
 * @returns Companies registry page UI.
 */
export default async function CompaniesPage({
  params,
}: CompaniesPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('companies');

  return (
    <Box
      component="main"
      role="main"
      data-testid="companies-page"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {t('title')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {t('subtitle')}
      </Typography>
      <OrganisationRegistry />
    </Box>
  );
}
