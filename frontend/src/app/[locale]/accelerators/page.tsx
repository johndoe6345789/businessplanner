import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { AcceleratorTracker }
  from '@/components/organisms/AcceleratorTracker';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the accelerators page. */
interface AcceleratorsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Accelerator tracker page at /accelerators.
 * Tracks programme deadlines and application status.
 *
 * @param props - Page props with locale.
 * @returns Accelerators page UI.
 */
export default async function AcceleratorsPage({
  params,
}: AcceleratorsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('accelerators');

  return (
    <Box component="main" role="main"
      data-testid="accelerators-page"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <AcceleratorTracker />
    </Box>
  );
}
