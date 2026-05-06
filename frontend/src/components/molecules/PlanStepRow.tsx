'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/** Props for an individual step row. */
export interface PlanStepRowProps {
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
 * A single step row with a checkbox, title, and
 * collapsible guidance detail.
 */
export const PlanStepRow: React.FC<
  PlanStepRowProps
> = ({ stepId, done, expanded, onToggle, onExpand }) => {
  const t = useTranslations('planner');
  return (
    <Box
      component="li"
      data-testid={`step-row-${stepId}`}
      sx={{ py: 0.75 }}
    >
      <Box sx={{ display: 'flex',
        alignItems: 'flex-start', gap: 1 }}>
        <input
          type="checkbox"
          id={`step-${stepId}`}
          checked={done}
          onChange={() => onToggle(stepId)}
          aria-label={t(`steps.${stepId}.title`)}
          style={{
            marginTop: 3, cursor: 'pointer',
            accentColor:
              'var(--mui-palette-primary-main)',
            width: 16, height: 16, flexShrink: 0,
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            component="label"
            htmlFor={`step-${stepId}`}
            variant="body2"
            sx={{
              cursor: 'pointer',
              fontWeight: done ? 400 : 500,
              textDecoration: done
                ? 'line-through' : 'none',
              color: done
                ? 'text.disabled' : 'text.primary',
            }}
          >
            {t(`steps.${stepId}.title`)}
          </Typography>
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
              ? '▲ hide detail'
              : '▼ why this matters'}
          </Typography>
          {expanded && (
            <Typography
              id={`why-${stepId}`}
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block', mt: 0.5,
                borderLeft: '2px solid',
                borderColor: 'primary.light',
                pl: 1,
              }}
            >
              {t(`steps.${stepId}.why`)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PlanStepRow;
