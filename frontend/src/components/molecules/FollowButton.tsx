'use client';

import React from 'react';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import {
  useFollowMutation,
  useUnfollowMutation,
  useGetFollowingQuery,
} from '@/store/api/followsApi';

/** Props for FollowButton. */
export interface FollowButtonProps {
  /** UUID of the current authenticated user. */
  currentUserId: string;
  /** UUID of the user to follow/unfollow. */
  targetUserId: string;
  /** Optional follower count to display. */
  followerCount?: number;
}

/**
 * Follow / unfollow toggle button with follower count.
 *
 * @param props - Component props.
 * @returns Follow button element.
 */
const FollowButton: React.FC<FollowButtonProps> = ({
  currentUserId,
  targetUserId,
  followerCount,
}) => {
  const t = useTranslations('social');
  const { data: following = [] } = useGetFollowingQuery(
    currentUserId,
  );
  const [follow, { isLoading: followLoading }] =
    useFollowMutation();
  const [unfollow, { isLoading: unfollowLoading }] =
    useUnfollowMutation();

  const isFollowing = following.some(
    (u) => u.id === targetUserId,
  );
  const loading = followLoading || unfollowLoading;

  const handleClick = () => {
    if (isFollowing) {
      unfollow(targetUserId);
    } else {
      follow(targetUserId);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      size="small"
      disabled={loading}
      onClick={handleClick}
      data-testid={`follow-btn-${targetUserId}`}
      aria-label={
        isFollowing ? t('unfollow') : t('follow')
      }
    >
      {isFollowing ? t('unfollow') : t('follow')}
      {followerCount !== undefined && (
        <>&nbsp;·&nbsp;{followerCount}</>
      )}
    </Button>
  );
};

export default FollowButton;
