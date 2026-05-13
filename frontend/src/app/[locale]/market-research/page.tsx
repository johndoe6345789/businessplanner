import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Chip from '@shared/m3/Chip';
import LinkedCardActionArea from
  '@/components/atoms/LinkedCardActionArea';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the market research landing page. */
interface MarketResearchPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Market research dashboard page at /market-research.
 * Shows card links to all market research tools.
 *
 * @param props - Page props with locale.
 * @returns Market research landing page UI.
 */
export default async function MarketResearchPage({
  params,
}: MarketResearchPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('marketResearch');
  const tn = await getTranslations('nav');

  const cards = [
    {
      href: `/${locale}/market-research/tam`,
      title: t('tam'),
      desc: t('tamDesc'),
      testId: 'mr-card-tam',
    },
    {
      href: `/${locale}/market-research/competitors`,
      title: t('competitors'),
      desc: t('competitorsDesc'),
      testId: 'mr-card-competitors',
    },
    {
      href: `/${locale}/market-research/canvas`,
      title: t('canvas'),
      desc: t('canvasDesc'),
      testId: 'mr-card-canvas',
    },
    {
      href: `/${locale}/market-research/personas`,
      title: t('personas'),
      desc: t('personasDesc'),
      testId: 'mr-card-personas',
    },
    {
      href: `/${locale}/market-research/discovery`,
      title: t('discovery'),
      desc: t('discoveryDesc'),
      testId: 'mr-card-discovery',
    },
  ];

  return (
    <Box component="main" role="main"
      aria-label={tn('marketResearch')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap' }}>
        {cards.map((c) => (
          <Card key={c.testId}
            data-testid={c.testId}
            sx={{ width: 280 }}>
            <LinkedCardActionArea
              href={c.href}
              aria-label={c.title}>
              <CardContent>
                <Typography variant="h6"
                  gutterBottom sx={{ fontWeight: 700 }}>
                  {c.title}
                </Typography>
                <Typography variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}>
                  {c.desc}
                </Typography>
                <Chip
                  label={t('notStarted')}
                  size="small"
                  data-testid={`${c.testId}-status`}
                />
              </CardContent>
            </LinkedCardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
