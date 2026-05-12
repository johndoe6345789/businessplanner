import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Card from '@shared/m3/Card';
import CardActionArea from '@shared/m3/CardActionArea';
import CardContent from '@shared/m3/CardContent';
import { Link } from '@/i18n/navigation';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the financials landing page. */
interface FinancialsPageProps {
  readonly params: Promise<{ locale: string }>;
}

type FinCard = {
  href: string; title: string; testId: string;
};

/**
 * Financials dashboard landing page at /financials.
 * @param props - Page props with locale.
 * @returns Financials landing page UI.
 */
export default async function FinancialsPage({
  params,
}: FinancialsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');
  const tn = await getTranslations('nav');

  const cards: FinCard[] = [
    { href: `/${locale}/financials/burn`,
      title: t('nav.burn'), testId: 'fin-card-burn' },
    { href: `/${locale}/financials/unit-economics`,
      title: t('nav.unitEcon'),
      testId: 'fin-card-unit-econ' },
    { href: `/${locale}/financials/paths`,
      title: t('nav.paths'), testId: 'fin-card-paths' },
    { href: `/${locale}/financials/kill-criteria`,
      title: t('nav.killCriteria'),
      testId: 'fin-card-kill-criteria' },
    { href: `/${locale}/financials/hypotheses`,
      title: t('nav.hypotheses'),
      testId: 'fin-card-hypotheses' },
    { href: `/${locale}/financials/revenue`,
      title: t('nav.revenue'),
      testId: 'fin-card-revenue' },
    { href: `/${locale}/financials/pricing`,
      title: t('nav.pricing'),
      testId: 'fin-card-pricing' },
    { href: `/${locale}/financials/projections`,
      title: t('nav.projections'),
      testId: 'fin-card-projections' },
    { href: `/${locale}/financials/health`,
      title: t('nav.health'),
      testId: 'fin-card-health' },
    { href: `/${locale}/financials/dashboard`,
      title: t('nav.dashboard'),
      testId: 'fin-card-dashboard' },
  ];

  return (
    <Box component="main" role="main"
      aria-label={tn('financials')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('nav.financials')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap' }}>
        {cards.map((c) => (
          <Card key={c.testId}
            data-testid={c.testId} sx={{ width: 280 }}>
            <CardActionArea component={Link}
              href={c.href} aria-label={c.title}>
              <CardContent>
                <Typography variant="h6" gutterBottom
                  sx={{ fontWeight: 700 }}>
                  {c.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
