/**
 * Gamification type definitions.
 * @module types/gamification
 */

/** A badge awarded to a user. */
export interface BadgeAward {
  /** Unique badge identifier. */
  id: string;
  /** Display name of the badge. */
  name: string;
  /** Human-readable description. */
  description: string;
  /** URL of the badge icon asset. */
  iconUrl: string;
  /** Category grouping for the badge. */
  category: string;
  /** ISO-8601 timestamp when earned. */
  earnedAt: string;
}

/** Gamification progress for the current user. */
export interface GamificationProgress {
  /** Current level number. */
  level: number;
  /** Display title for the current level. */
  levelTitle: string;
  /** Total points accumulated. */
  points: number;
  /** Points threshold for the next level. */
  nextLevelAt: number;
  /** Points still needed to reach the next level. */
  pointsToNextLevel: number;
  /** Current consecutive-day streak. */
  currentStreak: number;
  /** Longest streak ever achieved. */
  longestStreak: number;
  /** Badges the user has earned. */
  badges: BadgeAward[];
}

/** Streak details for the current user. */
export interface MyStreaks {
  /** Current consecutive-day streak. */
  currentStreak: number;
  /** Longest streak ever achieved. */
  longestStreak: number;
  /** Whether the user just hit a milestone. */
  milestoneReached: boolean;
  /** Value of the reached milestone, if any. */
  milestoneValue: number | null;
}

/** Single entry in the leaderboard. */
export interface LeaderboardEntry {
  /** User identifier. */
  id: string;
  /** Username handle. */
  username: string;
  /** Display name. */
  displayName: string;
  /** URL of the user's avatar. */
  avatarUrl: string;
  /** Aggregate points total. */
  totalPoints: number;
  /** Current level number. */
  currentLevel: number;
  /** Current streak. */
  currentStreak: number;
  /** Number of badges earned. */
  badgeCount: number;
  /** Rank position on the leaderboard. */
  rank: number;
}

/** Time period filter for leaderboard queries. */
export type LeaderboardPeriod = 'all' | 'weekly' | 'monthly';
