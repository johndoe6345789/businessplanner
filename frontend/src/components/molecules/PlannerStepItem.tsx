'use client';

/**
 * Wrapper rendering a step row + AI suggestion card.
 * @module components/molecules/PlannerStepItem
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { PlanStepRow } from './PlanStepRow';
import { AiSuggestionCard } from './AiSuggestionCard';

/** Props for PlannerStepItem. */
export interface PlannerStepItemProps {
  /** Step identifier matching the roadmap JSON. */
  stepId: string;
  /** Whether this step is completed. */
  done: boolean;
  /** Whether the 'why' detail is expanded. */
  expanded: boolean;
  /** Called when the checkbox is toggled. */
  onToggle: (id: string) => void;
  /** Called when the expand toggle is clicked. */
  onExpand: (id: string) => void;
}

/**
 * Step checkbox row plus contextual AI suggestion card.
 */
export const PlannerStepItem: React.FC<
  PlannerStepItemProps
> = ({ stepId, done, expanded, onToggle, onExpand }) => {
  const t = useTranslations('planner');
  return (
    <>
      <PlanStepRow
        stepId={stepId}
        done={done}
        expanded={expanded}
        onToggle={onToggle}
        onExpand={onExpand}
      />
      <AiSuggestionCard
        stepId={stepId}
        stepTitle={t(`steps.${stepId}.title`)}
      />
    </>
  );
};

export default PlannerStepItem;
