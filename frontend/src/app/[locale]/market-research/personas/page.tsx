import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { PersonaBoard }
  from '@/components/organisms/PersonaBoard';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the Customer Personas page. */
interface PersonasPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Customer Personas page at /market-research/personas.
 *
 * @param props - Page props with locale.
 * @returns Customer personas page UI.
 */
export default async function PersonasPage({
  params,
}: PersonasPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('marketResearch');

  return (
    <Box component="main" role="main"
      aria-label={t('personas')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('personas')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('personasDesc')}
      </Typography>
      <PersonaBoard />
    </Box>
  );
}
