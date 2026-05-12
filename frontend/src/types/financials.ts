/**
 * Financial planning domain types — barrel re-export.
 * @module types/financials
 */
export type {
  BurnInputs,
  BurnResult,
} from './financialsBurn';

export type {
  UnitEconInputs,
  UnitEconResult,
} from './financialsUnitEcon';

export type {
  PricingInputs,
  RevenueProjection,
  RevenueModel,
} from './financialsPricing';

export type {
  FinancialHypothesis,
  KillCriteria,
  HealthScore,
} from './financialsMisc';
