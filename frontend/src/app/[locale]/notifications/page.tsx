import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box } from '@shared/m3';
import Typography from '@shared/m3/Typography';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering — data is live. */
export const dynamic = 'force-dynamic';

const NotificationInbox = nextDynamic(
  () => import(
    '@/components/organisms/NotificationInbox'
  ),
  {
    loading: () => (
      <div data-testid="inbox-loading" />
    ),
  },
);

/** Props for the Notifications page. */
interface NotificationsPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Notifications inbox page — full paginated list
 * of all notifications with mark-all-read action.
 *
 * @param props - Page props with locale params.
 * @returns Notification inbox UI.
 */
export default async function NotificationsPage({
  params,
}: NotificationsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('notifications');

  return (
    <Box aria-label={t('title')}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 3 }}
        data-testid="notifications-page-title"
      >
        {t('title')}
      </Typography>
      <NotificationInbox />
    </Box>
  );
}
