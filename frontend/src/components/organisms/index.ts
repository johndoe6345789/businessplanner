/**
 * Barrel export for all organism components.
 * @module components/organisms
 */

export { Navbar } from './Navbar';
export type { NavbarProps } from './Navbar';

export { Footer } from './Footer';
export type {
  FooterProps,
  FooterLink,
} from '@shared/components/ui/Footer';

export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm';

export { RegisterForm } from './RegisterForm';
export type { RegisterFormProps } from './RegisterForm';

export { HeroSection } from './HeroSection';
export type { HeroSectionProps } from './HeroSection';

export { DashboardShortcuts } from './DashboardShortcuts';
export type { DashboardShortcutsProps } from './DashboardShortcuts';

export { ShortcutCheatSheet } from './ShortcutCheatSheet';
export type { ShortcutCheatSheetProps } from './ShortcutCheatSheet';

export { ForgotPasswordForm } from './ForgotPasswordForm';
export type { ForgotPasswordFormProps } from './ForgotPasswordForm';

export { default as DashboardStats }
  from './DashboardStats';

export { default as DashboardGrid }
  from './DashboardGrid';

export { ErrorBoundary } from './ErrorBoundary';
export { default as AdminDebugPanel }
  from './AdminDebugPanel';

export {
  SettingsCard, SettingsRow,
} from './SettingsCard';
export type {
  SettingsCardProps, SettingsRowProps,
} from './SettingsCard';
export { default as SettingsAdminCard }
  from './SettingsAdminCard';
export { default as SettingsPreferences }
  from './SettingsPreferences';

export * from './index.auth';

export { StartupRoadmap } from './StartupRoadmap';
export type {
  StartupRoadmapProps,
} from './StartupRoadmap';

export {
  SkillsProfileForm,
} from './SkillsProfileForm';

export { ContactForm } from './ContactForm';

export { BadgeCabinet } from './BadgeCabinet';

export { LeaderboardTable } from './LeaderboardTable';
export type {
  LeaderboardTableProps,
} from './LeaderboardTable';

export { KnowledgeBase } from './KnowledgeBase';

export {
  EquityCalculator,
} from './EquityCalculator';

export {
  VestingCalculator,
} from './VestingCalculator';

export * from './index.market-research';

export * from './index.financials';

export { default as NotificationInbox }
  from './NotificationInbox';

export { default as CookieConsentBanner }
  from './CookieConsentBanner';

export { default as AdminAnalyticsDashboard }
  from './AdminAnalyticsDashboard';
export {
  LaunchPadKpiGrid,
} from './LaunchPadKpiGrid';
export type {
  LaunchPadKpiGridProps,
} from './LaunchPadKpiGrid';

export { WeeklyReviewForm }
  from './WeeklyReviewForm';
export { WeeklyReviewHistory }
  from './WeeklyReviewHistory';

export { LaunchChecklist }
  from './LaunchChecklist';

export { ResourceLibrary }
  from './ResourceLibrary';

export { DecisionLog } from './DecisionLog';

export { ProductScopingCanvas }
  from './ProductScopingCanvas';
export { ScopingLane } from './ScopingLane';
export type { ScopingLaneProps }
  from './ScopingLane';
