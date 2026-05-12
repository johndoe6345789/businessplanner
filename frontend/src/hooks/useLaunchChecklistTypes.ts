/**
 * Shared types for the launch execution checklist.
 * @module hooks/useLaunchChecklistTypes
 */

/** Priority level of a checklist item. */
export type ChecklistPriority = 'high' | 'medium' | 'low';

/** Category of a checklist item. */
export type ChecklistCategory =
  | 'distribution'
  | 'product'
  | 'marketing'
  | 'ops';

/** A single launch checklist item. */
export interface ChecklistItem {
  /** Unique item identifier. */
  id: string;
  /** Grouping category for display. */
  category: ChecklistCategory;
  /** Short action title. */
  title: string;
  /** Longer description of what to do. */
  desc: string;
  /** Relative importance. */
  priority: ChecklistPriority;
}

/** Shape of the checklist JSON data file. */
export interface ChecklistData {
  default: ChecklistItem[];
  [slug: string]: ChecklistItem[];
}

/** Return type of useLaunchChecklist. */
export interface UseLaunchChecklistReturn {
  /** All checklist items for the current startup type. */
  items: ChecklistItem[];
  /** Map of item id to completion state. */
  completed: Record<string, boolean>;
  /** Toggle the completion state of a single item. */
  toggleItem: (id: string) => void;
}
