'use client';

/**
 * Account info card for the profile page.
 * Reads user name and email from Redux auth state.
 * @module components/molecules/ProfileAccountCard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useAppSelector }
  from '@/store/hooks';

/** Props for ProfileAccountCard. */
export interface ProfileAccountCardProps {
  /** Translated label for the name row. */
  nameLabel: string;
  /** Translated label for the email row. */
  emailLabel: string;
}

/**
 * Displays the authenticated user's name and
 * email in a card above the skills form.
 *
 * @param props - Card props.
 * @returns Account info card or null when loading.
 */
const ProfileAccountCard: React.FC<
  ProfileAccountCardProps
> = ({ nameLabel, emailLabel }) => {
  const user = useAppSelector(
    (s) => s.auth.user,
  );

  if (!user) return null;

  return (
    <Box
      sx={{ mb: 3, p: 2, borderRadius: 2,
        bgcolor: 'background.paper' }}
      data-testid="profile-account-card"
      aria-label="account information"
    >
      <Typography variant="body2"
        color="text.secondary">
        <strong>{nameLabel}: </strong>
        {user.displayName}
      </Typography>
      <Typography variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5 }}>
        <strong>{emailLabel}: </strong>
        {user.email}
      </Typography>
    </Box>
  );
};

export default ProfileAccountCard;
