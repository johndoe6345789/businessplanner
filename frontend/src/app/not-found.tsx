'use client';

import type { ReactElement } from 'react';
import Link from 'next/link';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Stack from '@shared/m3/Stack';

/**
 * Root-level 404 — compiled as /_not-found/page.
 * Client component so Link can be passed as a prop to
 * Button without a server→client function boundary error.
 * @returns On-brand not-found page.
 */
export default function NotFound(): ReactElement {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
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
        404
      </Typography>
      <Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>
        You&apos;ve gone off the map
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: '30rem' }}
      >
        This page doesn&apos;t exist — but your startup
        journey doesn&apos;t have to stop here.
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Button
          component={Link}
          href="/app/en/dashboard"
          variant="contained"
          size="large"
          data-testid="not-found-dashboard-btn"
        >
          Go to Dashboard
        </Button>
        <Button
          component={Link}
          href="/app/en"
          variant="outlined"
          size="large"
          data-testid="not-found-home-btn"
        >
          Go Home
        </Button>
      </Stack>
      <Stack
        direction="row"
        spacing={3}
        sx={{ mt: 1, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link href="/app/en/planner">Planner</Link>
        <Link href="/app/en/resources">Resources</Link>
        <Link href="/app/en/knowledge">Knowledge</Link>
      </Stack>
    </Box>
  );
}
