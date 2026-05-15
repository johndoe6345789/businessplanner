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
}

/** Writable fields for create / update. */
export interface OrgFormData {
  name: string;
  website: string;
  description: string;
  entity_types: EntityType[];
  tags: string[];
  notes: string;
}

/** Empty form defaults. */
export const EMPTY_ORG: OrgFormData = {
  name: '',
  website: '',
  description: '',
  entity_types: [],
  tags: [],
  notes: '',
};
