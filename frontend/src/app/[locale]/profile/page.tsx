import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { SkillsProfileForm }
  from '@/components/organisms/SkillsProfileForm';
import ProfileAccountCard
  from '@/components/molecules/ProfileAccountCard';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the profile page. */
interface ProfilePageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * User profile page — shows account info,
 * skills & qualifications form.
 *
 * @param props - Page props with locale params.
 * @returns Profile page UI.
 */
export default async function ProfilePage({
  params,
}: ProfilePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('profile');
  const tSkills = await getTranslations(
    'profile.skills',
  );

  return (
    <Box
      aria-label={t('title')}
      data-testid="profile-page"
      sx={{ maxWidth: 640, mx: 'auto', p: 3 }}
    >
      <Typography
        variant="h4" component="h1" gutterBottom
      >
        {t('title')}
      </Typography>
      <ProfileAccountCard
        nameLabel={t('name')}
        emailLabel={t('email')}
      />
      <Typography
        variant="h6" component="h2"
        sx={{ mt: 3, mb: 1 }}
      >
        {tSkills('sectionTitle')}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {tSkills('sectionDesc')}
      </Typography>
      <SkillsProfileForm />
    </Box>
  );
}
