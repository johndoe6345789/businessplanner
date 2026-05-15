import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { LaunchChecklist }
  from '@/components/organisms/LaunchChecklist';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the launch checklist page. */
interface LaunchPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Launch execution checklist page at /launch.
 * Shows a merged default + startup-type checklist.
 *
 * @param props - Page props with locale.
 * @returns Launch checklist page UI.
 */
export default async function LaunchPage({
  params,
}: LaunchPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('launch');

  return (
    <Box
      component="main"
      role="main"
      data-testid="launch-page"
      aria-label={t('title')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}
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
      <LaunchChecklist />
    </Box>
  );
}
