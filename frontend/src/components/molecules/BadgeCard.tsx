'use client';

import React from 'react';
import Card from '@shared/m3/Card';
import { CardContent } from '@shared/m3/Card';
import Typography from '@shared/m3/Typography';
import Tooltip from '@shared/m3/Tooltip';
import Box from '@shared/m3/Box';
import type { BadgeAward } from '@/types/gamification';

/** Props for a single badge card. */
export interface BadgeCardProps {
  /** Badge definition data. */
  badge: BadgeAward;
  /** Whether the current user has earned it. */
  earned: boolean;
  /** ISO-8601 date the badge was earned, if earned. */
  earnedAt?: string;
}

/**
 * Displays a single badge: colour if earned,
 * greyscale with a lock overlay if not yet earned.
 *
 * @param props - Component props.
 * @returns Badge card element.
 */
export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  earned,
  earnedAt,
}) => {
  const dateLabel = earnedAt
    ? new Date(earnedAt).toLocaleDateString()
    : undefined;

  return (
    <Tooltip title={badge.description} placement="top">
      <Card
        data-testid={`badge-card-${badge.id}`}
        aria-label={
          `${badge.name}${earned
            ? `, earned ${dateLabel ?? ''}`
            : ', locked'}`
        }
        sx={{
          filter: earned
            ? 'none' : 'grayscale(100%)',
          opacity: earned ? 1 : 0.55,
          position: 'relative',
          cursor: 'default',
        }}
      >
        <CardContent>
          <Box
            component="img"
            src={badge.iconUrl}
            alt={badge.name}
            sx={{
              width: 48, height: 48,
              objectFit: 'contain', mb: 1,
            }}
          />
          {!earned && (
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: 8, right: 8,
                fontSize: 18,
              }}
            >
              🔒
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {badge.name}
          </Typography>
          {earned && dateLabel && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {dateLabel}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default BadgeCard;
