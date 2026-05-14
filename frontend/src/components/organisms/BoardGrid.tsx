'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Card from '@shared/m3/Card';
import CardActionArea from '@shared/m3/CardActionArea';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useListBoardsQuery } from '@/store/api/forumApi';
import { useRouter } from '@/i18n/navigation';
import type { ForumBoard } from '@/types/forum';

/**
 * Grid of forum board cards.
 * Clicking a card navigates to /community/{board.slug}.
 *
 * @returns Board grid organism.
 */
const BoardGrid: React.FC = () => {
  const t = useTranslations('community');
  const { data: boards = [], isLoading } =
    useListBoardsQuery();
  const router = useRouter();

  if (isLoading) {
    return (
      <Typography
        data-testid="board-grid-loading"
        aria-live="polite"
      >
        {t('loadingBoards')}
      </Typography>
    );
  }

  if (!boards.length) {
    return (
      <Typography data-testid="board-grid-empty">
        {t('noBoards')}
      </Typography>
    );
  }

  return (
    <Box
      data-testid="board-grid"
      aria-label={t('boards')}
      sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
    >
      {[...boards]
        .sort((a: ForumBoard, b: ForumBoard) =>
          a.sort_order - b.sort_order)
        .map((board) => (
          <Card
            key={board.slug}
            role="article"
            aria-label={board.label}
            sx={{ width: 260 }}
            data-testid={`board-card-${board.slug}`}
          >
            <CardActionArea
              aria-label={board.label}
              onClick={() =>
                router.push(
                  `/community/${board.slug}` as never,
                )
              }
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {board.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {board.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </Box>
  );
};

export default BoardGrid;
