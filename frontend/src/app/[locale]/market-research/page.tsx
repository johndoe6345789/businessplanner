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
import { MARKET_RESEARCH_ROUTES }
  from '@/constants/market-research-routes';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the market research landing page. */
interface MarketResearchPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Market research dashboard — card links to all tools.
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
        {MARKET_RESEARCH_ROUTES.map((r) => (
          <Card key={r.testId}
            data-testid={r.testId}
            sx={{ width: 280 }}>
            <LinkedCardActionArea
              href={`/${locale}/market-research/${r.path}`}
              aria-label={t(r.titleKey)}>
              <CardContent>
                <Typography variant="h6"
                  gutterBottom sx={{ fontWeight: 700 }}>
                  {t(r.titleKey)}
                </Typography>
                <Typography variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}>
                  {t(r.descKey)}
                </Typography>
                <Chip
                  label={t('notStarted')}
                  size="small"
                  data-testid={`${r.testId}-status`}
                />
              </CardContent>
            </LinkedCardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
