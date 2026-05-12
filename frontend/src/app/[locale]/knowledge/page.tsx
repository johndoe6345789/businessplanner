import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

const KnowledgeBase = nextDynamic(
  () => import(
    '@/components/organisms/KnowledgeBase'
  ),
  { loading: () => (
    <div data-testid="knowledge-loading" />
  ) },
);

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the knowledge base page. */
interface KnowledgePageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Knowledge base page for the /knowledge route.
 *
 * @param props - Page props with locale.
 * @returns Knowledge base UI.
 */
export default async function KnowledgePage({
  params,
}: KnowledgePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('knowledge');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {t('title')}
      </Typography>
      <KnowledgeBase />
    </Box>
  );
}
