import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { ProductScopingCanvas }
  from '@/components/organisms/ProductScopingCanvas';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the product scoping page. */
interface ScopingPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Product Scoping Canvas page at /scoping.
 * @param props - Page props with locale.
 * @returns Scoping page UI.
 */
export default async function ScopingPage({
  params,
}: ScopingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('scoping');

  return (
    <Box component="main" role="main"
      data-testid="scoping-page"
      aria-label={t('title')}
      sx={{ maxWidth: 1280, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <ProductScopingCanvas />
    </Box>
  );
}
