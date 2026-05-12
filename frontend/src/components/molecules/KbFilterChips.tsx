'use client';

import React from 'react';
import { Stack } from '@shared/m3';
import { Chip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { KbType } from '@/types/knowledge';

/** A filter value: either 'all' or a KbType slug. */
export type KbFilter = KbType | 'all';

/** Props for KbFilterChips. */
export interface KbFilterChipsProps {
  /** Currently active filter value. */
  active: KbFilter;
  /** Called when the user selects a filter. */
  onChange: (filter: KbFilter) => void;
}

/** Ordered list of all filter options. */
const FILTERS: KbFilter[] = [
  'all', 'guide', 'playbook',
  'benchmark', 'legal', 'template', 'checklist',
];

/** Translation key map for each filter. */
const FILTER_KEYS: Record<KbFilter, string> = {
  all: 'filterAll',
  guide: 'filterGuide',
  playbook: 'filterPlaybook',
  benchmark: 'filterBenchmark',
  legal: 'filterLegal',
  template: 'filterTemplate',
  checklist: 'filterChecklist',
};

/**
 * Row of filter chips for the knowledge base.
 *
 * @param props - Component props.
 * @returns Filter chip row element.
 */
export const KbFilterChips: React.FC<
  KbFilterChipsProps
> = ({ active, onChange }) => {
  const t = useTranslations('knowledge');

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      data-testid="kb-filter-chips"
      aria-label={t('filterAll')}
    >
      {FILTERS.map((f) => (
        <Chip
          key={f}
          label={t(FILTER_KEYS[f])}
          onClick={() => onChange(f)}
          color={active === f ? 'primary' : 'default'}
          variant={active === f ? 'filled' : 'outlined'}
          size="small"
        />
      ))}
    </Stack>
  );
};

export default KbFilterChips;
