import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton
  from '@mui/material/ListItemButton';
import ListItemText
  from '@mui/material/ListItemText';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the admin index page. */
interface AdminPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Admin landing page with links to sub-sections.
 *
 * @param props - Page props with locale params.
 * @returns Admin index page.
 */
export default async function AdminPage({
  params,
}: AdminPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t  = await getTranslations('admin');
  const ts = await getTranslations('settings');

  const sections = [
    {
      href: `/${locale}/admin/analytics`,
      label: t('analytics.title'),
    },
    {
      href: `/${locale}/admin/debug`,
      label: t('debugPanel'),
    },
    {
      href: `/${locale}/admin/translations`,
      label: ts('manageTranslations'),
    },
  ];

  return (
    <Box
      aria-label="Admin panel"
      data-testid="admin-index-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {ts('admin')}
      </Typography>
      <List aria-label="Admin sections">
        {sections.map(({ href, label }) => (
          <ListItem key={href} disablePadding>
            <ListItemButton
              component={Link}
              href={href}
              aria-label={label}
              data-testid={
                `admin-nav-${href.split('/').pop()}`
              }
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
