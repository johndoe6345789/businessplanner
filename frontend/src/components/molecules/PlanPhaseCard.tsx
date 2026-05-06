'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress from '@shared/m3/LinearProgress';
import { useTranslations } from 'next-intl';
import { PlanStepRow } from './PlanStepRow';
import type { PhaseProgress } from '@/hooks';

interface Step { id: string; }

/** Props for PlanPhaseCard. */
export interface PlanPhaseCardProps {
  /** Phase metadata and progress. */
  phase: PhaseProgress;
  /** Steps belonging to this phase. */
  steps: Step[];
  /** Map of step ID → completed. */
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
  const t = useTranslations('planner');
  const [expanded, setExpanded] = useState<
    string | null
  >(null);
  const toggleExpand = (id: string) =>
    setExpanded((p) => (p === id ? null : id));

  const statusColor =
    phase.status === 'complete' ? 'success.main'
    : phase.status === 'in-progress' ? 'primary.main'
    : 'text.disabled';

  return (
    <Box
      data-testid={testId}
      aria-label={t(`phases.${phase.id}.title`)}
      sx={{
        border: '1px solid', borderColor: 'divider',
        borderRadius: 2, p: 2.5, mb: 2,
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography
          variant="h6" component="h2"
          sx={{ fontWeight: 700 }}
        >
          {t(`phases.${phase.id}.title`)}
        </Typography>
        <Typography
          variant="body2" color="text.secondary"
        >
          {t(`phases.${phase.id}.desc`)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex',
        alignItems: 'center', gap: 1, mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={phase.pct}
          aria-label={`${phase.id} progress`}
          sx={{ flex: 1, height: 6, borderRadius: 3 }}
        />
        <Typography
          variant="caption"
          sx={{ color: statusColor, fontWeight: 600,
            whiteSpace: 'nowrap' }}
        >
          {t('stepsOf', {
            done: phase.done, total: phase.total,
          })}
        </Typography>
      </Box>
      <Box
        component="ul"
        aria-label={`${phase.id} steps`}
        sx={{ listStyle: 'none', p: 0, m: 0 }}
      >
        {steps.map((step) => (
          <PlanStepRow
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
