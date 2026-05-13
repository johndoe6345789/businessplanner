import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import ThreadDetail from
  '@/components/organisms/ThreadDetail';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the thread detail page. */
interface ThreadPageProps {
  readonly params: Promise<{
    locale: string;
    board: string;
    id: string;
  }>;
}

/**
 * Thread detail page at /community/[board]/[id].
 * Shows the full thread with posts and reply form.
 *
 * @param props - Page props with locale, board, id.
 * @returns Thread detail page.
 */
export default async function ThreadPage({
  params,
}: ThreadPageProps): Promise<ReactElement> {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('community');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('threads')}
      sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}
    >
      <ThreadDetail threadId={id} />
    </Box>
  );
}
