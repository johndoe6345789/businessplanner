'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useListBoardsQuery } from '@/store/api/forumApi';

/** Props for BoardHeader. */
export interface BoardHeaderProps {
  /** URL slug of the board. */
  boardSlug: string;
}

/**
 * Client component that resolves a board slug to its
 * display name and renders a breadcrumb + h1.
 *
 * @param props - Component props.
 * @returns Board heading with breadcrumb.
 */
const BoardHeader: React.FC<BoardHeaderProps> = ({
  boardSlug,
}) => {
  const t = useTranslations('community');
  const { data: boards, isLoading } =
    useListBoardsQuery();

  const board = boards?.find(
    (b) => b.slug === boardSlug,
  );
  const label = isLoading
    ? null
    : (board?.label ?? t('boardNotFound'));

  return (
    <>
      <Box
        component="nav"
        aria-label="Breadcrumb"
        sx={{ mb: 0.5 }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          component="span"
        >
          <Link href="/community">
            {t('breadcrumbCommunity')}
          </Link>
          {' › '}
          {isLoading ? (
            <Skeleton
              variant="text"
              width={120}
              style={{ display: 'inline-block' }}
            />
          ) : (
            <span>{label}</span>
          )}
        </Typography>
      </Box>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {isLoading ? (
          <Skeleton variant="text" width={200} />
        ) : (
          label
        )}
      </Typography>
    </>
  );
};

export default BoardHeader;
