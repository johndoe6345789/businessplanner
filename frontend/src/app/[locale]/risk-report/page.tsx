import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import nextDynamic from 'next/dynamic';

const AiRiskReport = nextDynamic(
  () => import(
    '@/components/organisms/AiRiskReport'
  ),
  { ssr: false },
);

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the risk-report page. */
interface RiskReportPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * AI risk-report page at /risk-report.
 * Generates a blind-spot analysis from plan state.
 *
 * @param props - Page props with locale.
 * @returns Risk report page UI.
 */
export default async function RiskReportPage({
  params,
}: RiskReportPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('riskReport');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 720, mx: 'auto',
        width: '100%' }}
    >
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <AiRiskReport />
    </Box>
  );
}
