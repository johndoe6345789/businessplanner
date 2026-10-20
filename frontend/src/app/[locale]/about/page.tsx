import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Container, Typography }
  from '@shared/m3';

/** Skip static prerendering — avoids manifest write races. */
export const dynamic = 'force-dynamic';

/** Props for the about page. */
interface AboutPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * About page — product description and mission.
 *
 * @param props - Page props with locale.
 * @returns About page UI.
 */
export default async function AboutPage({
  params,
}: AboutPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <Container
      maxWidth="sm"
      component="main"
      data-testid="about-page"
    >
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4" component="h1"
          gutterBottom fontWeight={800}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="body1" color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.8 }}
        >
          {t('description')}
        </Typography>
        <Typography
          variant="body1" color="text.secondary"
          sx={{ mb: 5, lineHeight: 1.8 }}
        >
          {t('description2')}
        </Typography>
        <Typography
          variant="h6" component="h2"
          gutterBottom fontWeight={700}
        >
          {t('missionTitle')}
        </Typography>
        <Typography
          variant="body1" color="text.secondary"
          sx={{ lineHeight: 1.8 }}
        >
          {t('mission')}
        </Typography>
      </Box>
    </Container>
  );
}
