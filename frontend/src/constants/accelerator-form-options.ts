/**
 * Option arrays for the AcceleratorFormFields molecule.
 * @module constants/accelerator-form-options
 */

/** All supported programme types. */
export const ACCELERATOR_TYPES = [
  'accelerator', 'competition',
  'grant', 'fellowship',
] as const;

/** All supported application statuses. */
export const ACCELERATOR_STATUSES = [
  'researching', 'applying', 'applied',
  'interviewing', 'accepted', 'rejected', 'passed',
] as const;
