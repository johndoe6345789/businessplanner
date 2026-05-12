import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { UnitEconomicsModel }
  from '@/components/organisms/UnitEconomicsModel';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the unit economics page. */
interface UnitEconPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Unit economics model page at /financials/unit-economics.
 *
 * @param props - Page props with locale.
 * @returns Unit economics page UI.
 */
export default async function UnitEconPage({
  params,
}: UnitEconPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('unitEcon.title')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('unitEcon.title')}
      </Typography>
      <UnitEconomicsModel />
    </Box>
  );
}
