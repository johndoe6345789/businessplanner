import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Grid from '@shared/m3/Grid';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering — data is live. */
export const dynamic = 'force-dynamic';

const RiskRegister = nextDynamic(
  () => import(
    '@/components/organisms/RiskRegister'
  ),
  { loading: () => (
    <div data-testid="risk-register-loading" />
  )},
);

const RiskMatrix = nextDynamic(
  () => import(
    '@/components/organisms/RiskMatrix'
  ),
  { loading: () => (
    <div data-testid="risk-matrix-loading" />
  )},
);

/** Props for the risk assessment page. */
interface RiskAssessmentPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Risk assessment page — register table on the
 * left and the 5×5 heat-map matrix on the right.
 *
 * @param props - Page props with locale.
 * @returns Risk assessment UI.
 */
export default async function RiskAssessmentPage({
  params,
}: RiskAssessmentPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('riskAssessment');

  return (
    <Box component="main" role="main"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 1200, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}
        data-testid="risk-assessment-title">
        {t('pageTitle')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('pageDescription')}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <RiskRegister />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RiskMatrix />
        </Grid>
      </Grid>
    </Box>
  );
}
