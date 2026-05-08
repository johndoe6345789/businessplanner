'use client';

import React from 'react';
import { Box, Container } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { HeroCta } from '@shared/components/ui/HeroCta';
import s from '@shared/scss/modules/HeroSection.module.scss';

/** Props for the HeroSection organism. */
export interface HeroSectionProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full-width hero with gradient background,
 * eyebrow label, value-proposition heading,
 * CTA buttons, and a stats strip.
 *
 * @param props - Component props.
 */
export const HeroSection: React.FC<
  HeroSectionProps
> = ({ testId = 'hero-section' }) => {
  const t = useTranslations('hero');
  return (
    <Box
      component="section"
      data-testid={testId}
      aria-label="Hero section"
      className={s.root}
    >
      <Container maxWidth="md">
        <p
          className={s.eyebrow}
          data-testid="hero-eyebrow"
          aria-hidden="true"
        >
          {t('eyebrow')}
        </p>
        <h1
          className={s.heading}
          data-testid="hero-heading"
        >
          {t('title')}
        </h1>
        <p
          className={s.subtitle}
          data-testid="hero-subtitle"
        >
          {t('subtitle')}
        </p>
        <HeroCta
          ctaLabel={t('cta')}
          featuresLabel={t('features')}
          registerHref="/planner"
        />
        <div
          className={s.stats}
          aria-label="Key stats"
          data-testid="hero-stats"
        >
          <span className={s.stat}>{t('stat1')}</span>
          <span className={s.stat}>{t('stat2')}</span>
          <span className={s.stat}>{t('stat3')}</span>
        </div>
      </Container>
    </Box>
  );
};

export default HeroSection;
