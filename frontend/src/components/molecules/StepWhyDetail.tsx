'use client';

/**
 * Collapsible "why this matters" detail for a plan step.
 * @module components/molecules/StepWhyDetail
 */
import React from 'react';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/** Props for StepWhyDetail. */
export interface StepWhyDetailProps {
  /** Step identifier matching the roadmap JSON. */
  stepId: string;
  /** Whether the detail is currently visible. */
  expanded: boolean;
  /** Called when the expand/collapse button is clicked. */
  onExpand: (id: string) => void;
}

/**
 * Expand/collapse toggle and the collapsible
 * "why this matters" body for a plan step row.
 *
 * @param props - Component props.
 * @returns StepWhyDetail UI.
 */
export const StepWhyDetail: React.FC<
  StepWhyDetailProps
> = ({ stepId, expanded, onExpand }) => {
  const t = useTranslations('planner');
  return (
    <>
      <Typography
        component="button"
        variant="caption"
        onClick={() => onExpand(stepId)}
        aria-expanded={expanded}
        aria-controls={`why-${stepId}`}
        data-testid={`expand-${stepId}`}
        sx={{
          display: 'block', background: 'none',
          border: 'none', color: 'primary.main',
          cursor: 'pointer', p: 0, mt: 0.25,
        }}
      >
        {expanded
          ? t('hideDetail')
          : t('whyThisMatters')}
      </Typography>
      {expanded && (
        <Typography
          id={`why-${stepId}`}
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block', mt: 0.5,
            borderLeft: '2px solid',
            borderColor: 'primary.light', pl: 1,
          }}
        >
          {t(`steps.${stepId}.why`)}
        </Typography>
      )}
    </>
  );
};

export default StepWhyDetail;
