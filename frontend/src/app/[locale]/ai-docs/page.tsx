import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import ClientAiDocumentDrafter from
  '@/components/atoms/ClientAiDocumentDrafter';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the AI docs page. */
interface AiDocsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * AI document drafting page at /ai-docs.
 * Generates pitch decks, investor updates, NDAs,
 * and job descriptions.
 *
 * @param props - Page props with locale.
 * @returns AI docs page UI.
 */
export default async function AiDocsPage({
  params,
}: AiDocsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aiDocs');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 800, mx: 'auto',
        width: '100%' }}
    >
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <ClientAiDocumentDrafter />
    </Box>
  );
}
