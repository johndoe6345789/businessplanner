'use client';

/**
 * Phase card for the startup roadmap planner.
 * @module components/molecules/PlanPhaseCard
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import { PlanPhaseHeader } from './PlanPhaseHeader';
import { PlannerStepItem } from './PlannerStepItem';
import type { PhaseProgress } from '@/hooks';

interface Step { id: string; }

/** Props for PlanPhaseCard. */
export interface PlanPhaseCardProps {
  /** Phase metadata and progress. */
  phase: PhaseProgress;
  /** Steps belonging to this phase. */
  steps: Step[];
  /** Map of step ID to completion. */
  completedSteps: Record<string, boolean>;
  /** Called when the user toggles a step. */
  onToggle: (stepId: string) => void;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Card showing one startup roadmap phase with its
 * steps, a progress bar, and expandable guidance.
 */
export const PlanPhaseCard: React.FC<
  PlanPhaseCardProps
> = ({ phase, steps, completedSteps, onToggle,
  testId = 'plan-phase-card' }) => {
  const [expanded, setExpanded] = useState<
    string | null
  >(null);
  const toggleExpand = (id: string) =>
    setExpanded((p) => (p === id ? null : id));

  return (
    <Box
      data-testid={testId}
      aria-label={phase.id}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2, p: 2.5, mb: 2,
      }}
    >
      <PlanPhaseHeader phase={phase} />
      <Box
        component="ul"
        aria-label={`${phase.id} steps`}
        sx={{ listStyle: 'none', p: 0, m: 0 }}
      >
        {steps.map((step) => (
          <PlannerStepItem
            key={step.id}
            stepId={step.id}
            done={!!completedSteps[step.id]}
            expanded={expanded === step.id}
            onToggle={onToggle}
            onExpand={toggleExpand}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PlanPhaseCard;
