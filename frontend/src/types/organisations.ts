/**
 * Types for the organisations (company registry)
 * domain.
 * @module types/organisations
 */

/**
 * Role an organisation plays in the startup context.
 * An org can hold multiple types simultaneously.
 */
export type EntityType =
  | 'competitor'
  | 'accelerator'
  | 'investor'
  | 'partner'
  | 'customer'
  | 'supplier'
  | 'grant_provider'
  | 'other';

/** Display labels for each EntityType. */
export const ENTITY_TYPE_LABELS: Record<
  EntityType, string
> = {
  competitor: 'Competitor',
  accelerator: 'Accelerator',
  investor: 'Investor',
  partner: 'Partner',
  customer: 'Customer',
  supplier: 'Supplier',
  grant_provider: 'Grant Provider',
  other: 'Other',
};

/** A registered organisation record. */
export interface Organisation {
  readonly id: string;
  readonly user_id: string;
  name: string;
  website: string;
  description: string;
  entity_types: EntityType[];
  tags: string[];
  notes: string;
  readonly created_at: string;
  readonly updated_at: string;
  /** Initial capital needed to launch (GBP). */
  initial_investment_gbp: number;
  /** Weeks from start to first revenue. */
  weeks_to_bootstrap: number;
  /** Estimated monthly revenue when running (GBP). */
  monthly_revenue_gbp: number;
  /** Parent org that funded this one (compound chain). */
  parent_org_id?: string | null;
}

/** One actionable step in the startup playbook. */
export interface StartupStep {
  readonly id: string;
  readonly organisation_id: string;
  step_number: number;
  title: string;
  description: string;
  readonly created_at: string;
}

/** Writable fields for create / update. */
export interface OrgFormData {
  name: string;
  website: string;
  description: string;
  entity_types: EntityType[];
  tags: string[];
  notes: string;
  initial_investment_gbp: number;
  weeks_to_bootstrap: number;
  monthly_revenue_gbp: number;
  parent_org_id?: string | null;
}

/** Empty form defaults. */
export const EMPTY_ORG: OrgFormData = {
  name: '',
  website: '',
  description: '',
  entity_types: [],
  tags: [],
  notes: '',
  initial_investment_gbp: 0,
  weeks_to_bootstrap: 0,
  monthly_revenue_gbp: 0,
  parent_org_id: null,
};
