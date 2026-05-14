import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography, Card,
  CardContent } from '@shared/m3';
import LinkedCardActionArea from
  '@/components/atoms/LinkedCardActionArea';
import { Gavel } from '@shared/icons/Gavel';
import { Schedule }
  from '@shared/icons/Schedule';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the legal landing page. */
interface LegalPageProps {
  readonly params: Promise<{ locale: string }>;
}

const ICON_SX = {
  fontSize: 40, marginBottom: 8,
} as const;

/**
 * Legal & Equity tools landing page at /legal.
 * @param props - Page props with locale.
 * @returns Legal tools landing UI.
 */
export default async function LegalPage({
  params,
}: LegalPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  const cards = [
    {
      href: `/${locale}/legal/equity`,
      title: t('equityTitle'),
      desc: t('equityDesc'),
      testId: 'legal-equity-card',
      icon: <Gavel aria-hidden="true"
        style={ICON_SX} />,
    },
    {
      href: `/${locale}/legal/vesting`,
      title: t('vestingTitle'),
      desc: t('vestingDesc'),
      testId: 'legal-vesting-card',
      icon: <Schedule aria-hidden="true"
        style={ICON_SX} />,
    },
  ];

  return (
    <Box component="main" role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <Box sx={{ display: 'flex',
        gap: 2, flexWrap: 'wrap', mb: 4 }}>
        {cards.map((c) => (
          <Card key={c.testId}
            data-testid={c.testId}
            sx={{ width: 280 }}>
            <LinkedCardActionArea
              href={c.href}
              aria-label={c.title}>
              <CardContent>
                {c.icon}
                <Typography variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 700 }}>
                  {c.title}
                </Typography>
                <Typography variant="body2"
                  color="text.secondary">
                  {c.desc}
                </Typography>
              </CardContent>
            </LinkedCardActionArea>
          </Card>
        ))}
      </Box>
      <Typography variant="body2"
        color="text.secondary"
        data-testid="legal-kb-note">
        {t('knowledgeBaseNote')}
      </Typography>
    </Box>
  );
}
