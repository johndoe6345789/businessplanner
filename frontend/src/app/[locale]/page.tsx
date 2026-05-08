import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Container } from '@shared/m3';
import { HeroSection } from
  '@/components/organisms/HeroSection';
import { FeatureGrid } from '@shared/ui';
import features from
  '@/constants/features.json';
import s from '@shared/scss/modules/Landing.module.scss';

/** Props for the landing page. */
interface LandingPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Landing page with hero and features.
 * Feature cards are driven by features.json.
 *
 * @param props - Page props with locale.
 * @returns Landing page UI.
 */
export default async function LandingPage({
  params,
}: LandingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('features');

  return (
    <Box
      component="main"
      role="main"
      aria-label="Landing page"
      style={{ minHeight: '100dvh' }}
    >
      <HeroSection />
      <Container
        maxWidth="lg"
        className={s.features}
      >
        <h2
          className={s.sectionTitle}
          data-testid="features-heading"
        >
          {t('sectionTitle')}
        </h2>
        <FeatureGrid features={features} />
      </Container>
    </Box>
  );
}
