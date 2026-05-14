'use client';

import React from 'react';
import { Box, Pagination } from '@shared/m3';
import { useTranslations } from 'next-intl';

/** Props for NotificationPager. */
export interface NotificationPagerProps {
  /** Total number of pages. */
  pageCount: number;
  /** Current active page (1-based). */
  page: number;
  /**
   * Called when the user selects a different page.
   *
   * @param p - New page number.
   */
  onPageChange: (p: number) => void;
}

/**
 * Pagination controls for the notification inbox.
 * Renders only when there is more than one page.
 *
 * @param props - Pager props.
 * @returns Pagination element or null.
 */
const NotificationPager: React.FC<
  NotificationPagerProps
> = ({ pageCount, page, onPageChange }) => {
  const t = useTranslations('notifications');

  if (pageCount <= 1) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={2}
      data-testid="notification-pager"
    >
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, p) => onPageChange(p)}
        aria-label={t('pagination')}
      />
    </Box>
  );
};

export default NotificationPager;
