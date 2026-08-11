'use client';

import type { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Stack from '@shared/m3/Stack';

/**
 * Locale-aware 404 for explicit notFound() calls.
 * 'use client' so Link is safe as a component prop.
 * @returns Not-found page with navigation shortcuts.
 */
export default function NotFound(): ReactElement {
  const t = useTranslations('NotFound');

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60dvh',
        textAlign: 'center',
        gap: 2,
        px: 2,
      }}
    >
      <Typography
        component="p"
        sx={{ fontSize: '5rem', lineHeight: 1 }}
        aria-hidden="true"
      >
        🚀
      </Typography>
      <Typography
        variant="h2"
        component="h1"
        sx={{ fontWeight: 800, letterSpacing: '-2px' }}
      >
        {t('statusCode')}
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{ fontWeight: 600 }}
      >
        {t('title')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: '30rem' }}
      >
        {t('description')}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Button
          component={Link}
          href="/dashboard"
          variant="contained"
          size="large"
          data-testid="not-found-dashboard-btn"
        >
          {t('dashboardLink')}
        </Button>
        <Button
          component={Link}
          href="/"
          variant="outlined"
          size="large"
          data-testid="not-found-home-btn"
        >
          {t('homeLink')}
        </Button>
      </Stack>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          mt: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link href="/planner">{t('plannerLink')}</Link>
        <Link href="/resources">{t('resourcesLink')}</Link>
        <Link href="/knowledge">{t('knowledgeLink')}</Link>
      </Stack>
    </Box>
  );
}
