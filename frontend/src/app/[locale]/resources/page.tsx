import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { ResourceLibrary }
  from '@/components/organisms/ResourceLibrary';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the resource library page. */
interface ResourcesPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Resource library page at /resources.
 * Shows downloadable templates and tools.
 *
 * @param props - Page props with locale.
 * @returns Resource library page UI.
 */
export default async function ResourcesPage({
  params,
}: ResourcesPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('resources');

  return (
    <Box
      component="main"
      role="main"
      data-testid="resources-page"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}
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
      <ResourceLibrary />
    </Box>
  );
}
