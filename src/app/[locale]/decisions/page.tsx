import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { DecisionLog }
  from '@/components/organisms/DecisionLog';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the decisions page. */
interface DecisionsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Decision log page at /decisions.
 * Shows a searchable CRUD list of key decisions.
 *
 * @param props - Page props with locale.
 * @returns Decisions page UI.
 */
export default async function DecisionsPage({
  params,
}: DecisionsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('decisions');

  return (
    <Box component="main" role="main"
      data-testid="decisions-page"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <DecisionLog />
    </Box>
  );
}
