import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import ThreadList from
  '@/components/organisms/ThreadList';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the board thread-list page. */
interface BoardPageProps {
  readonly params: Promise<{
    locale: string;
    board: string;
  }>;
}

/**
 * Thread list page at /community/[board].
 * Shows all threads for a specific forum board.
 *
 * @param props - Page props with locale and board.
 * @returns Board thread list page.
 */
export default async function BoardPage({
  params,
}: BoardPageProps): Promise<ReactElement> {
  const { locale, board } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('community');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('threads')}
      sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {board}
      </Typography>
      <ThreadList boardSlug={board} />
    </Box>
  );
}
