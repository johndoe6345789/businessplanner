/**
 * Barrel export for all custom hooks.
 * @module hooks
 */

export { useDebounce } from './useDebounce';
export { useThemeMode } from './useThemeMode';
export { useLocale } from './useLocale';
export { useFormValidation } from './useFormValidation';
export type { ValidationRule, ValidationRules } from './useFormValidation';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export type { ShortcutMap } from './useKeyboardShortcuts';
export { useGlobalShortcuts } from './useGlobalShortcuts';
export type { GlobalShortcutOptions } from './useGlobalShortcuts';
export { useAuth } from './useAuth';
export { useApi } from './useApi';
export { useLoginForm } from './useLoginForm';
export type { UseLoginFormReturn } from './useLoginForm';
export { useRegisterForm } from './useRegisterForm';
export type { UseRegisterFormReturn } from './useRegisterForm';
export { useForgotPassword } from './useForgotPassword';
export type { UseForgotPasswordReturn } from './useForgotPassword';
export { useDashboard } from './useDashboard';
export { useDashboardLayout } from './useDashboardLayout';
export type { UseDashboardLayoutReturn } from './useDashboardLayout';
export { useDebugPanel } from './useDebugPanel';
export type { DebugPanelData } from './useDebugPanel';
export { useEscapeKey } from './useEscapeKey';
export { useScrollLock } from './useScrollLock';
export { useInitAuth } from './useInitAuth';
export {
  usePlannerProgress,
  getPhaseStatus,
} from './usePlannerProgress';
export type {
  PhaseProgress,
  PhaseStatus,
} from './usePlannerProgress';
export { useGlobalSearch } from './useGlobalSearch';
export { useSearchKeyboardNav } from './useSearchKeyboardNav';
export { useSearchPageState } from './useSearchPageState';
export { useSuggestFetch } from './useSuggestFetch';
export { useGamification } from './useGamification';
export type { UseGamificationReturn } from './useGamification';

export { useNotifications } from './useNotifications';
export type {
  UseNotificationsReturn,
} from './useNotifications';

export { useBurnCompute } from './useBurnCompute';
export { useUnitEconCompute } from './useUnitEconCompute';
export { usePricingCompute } from './usePricingCompute';
export type { PricingComputeResult } from './usePricingCompute';
export { useHealthScore } from './useHealthScore';
