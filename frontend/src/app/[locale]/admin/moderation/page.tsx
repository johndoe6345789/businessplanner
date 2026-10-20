import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import ModerationQueue from
  '@/components/organisms/ModerationQueue';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the moderation queue page. */
interface ModerationPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Admin moderation queue page at /admin/moderation.
 * Lists flagged forum posts with hide/clear actions.
 *
 * @param props - Page props with locale.
 * @returns Moderation queue page.
 */
export default async function ModerationPage({
  params,
}: ModerationPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('moderation');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {t('title')}
      </Typography>
      <ModerationQueue />
    </Box>
  );
}
