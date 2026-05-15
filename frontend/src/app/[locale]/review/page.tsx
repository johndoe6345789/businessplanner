import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Divider from '@mui/material/Divider';
import { WeeklyReviewForm }
  from '@/components/organisms/WeeklyReviewForm';
import { WeeklyReviewHistory }
  from '@/components/organisms/WeeklyReviewHistory';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the weekly review page. */
interface ReviewPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Weekly review page at /review.
 * Shows the reflection form and past history.
 *
 * @param props - Page props with locale.
 * @returns Weekly review page UI.
 */
export default async function ReviewPage({
  params,
}: ReviewPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('review');

  return (
    <Box component="main" role="main"
      data-testid="review-page"
      aria-label={t('title')}
      sx={{
        maxWidth: 720,
        mx: 'auto',
        width: '100%',
      }}>
      <Typography
        variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <WeeklyReviewForm />
      <Divider sx={{ my: 4 }} />
      <WeeklyReviewHistory />
    </Box>
  );
}
