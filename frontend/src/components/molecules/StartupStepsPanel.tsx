'use client';

/**
 * @file StartupStepsPanel.tsx
 * @brief Collapsible startup playbook panel for
 *        an organisation's numbered action steps.
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { Collapse, List, ListItem, ListItemText,
         Divider, Button, CircularProgress }
  from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useListStartupStepsQuery }
  from '@/store/api/organisationsApi';

/** Props for StartupStepsPanel. */
export interface StartupStepsPanelProps {
  /** UUID of the organisation. */
  readonly orgId: string;
}

/**
 * Expandable panel fetching and showing the
 * ordered startup playbook steps.
 * @param props - StartupStepsPanelProps.
 */
export const StartupStepsPanel: React.FC<
  StartupStepsPanelProps
> = ({ orgId }) => {
  const t = useTranslations('startupCompare');
  const [open, setOpen] = useState(false);
  const { data: steps = [], isLoading } =
    useListStartupStepsQuery(orgId, {
      skip: !open,
    });
  return (
    <Box data-testid={`steps-panel-${orgId}`}>
      <Button
        size="small"
        variant="outlined"
        aria-expanded={open}
        aria-label={t('stepsTitle')}
        onClick={() => setOpen((p) => !p)}
        data-testid={`steps-toggle-${orgId}`}
      >
        {t('stepsTitle')}
        {open ? ' ▲' : ' ▼'}
      </Button>
      <Collapse in={open}>
        {isLoading && (
          <CircularProgress size={16}
            data-testid="steps-loading" />
        )}
        {!isLoading && steps.length === 0 && (
          <Typography variant="caption"
            color="text.secondary">
            {t('noSteps')}
          </Typography>
        )}
        <List dense>
          {steps.map((step) => (
            <React.Fragment key={step.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    `${step.step_number}. ${step.title}`}
                  secondary={step.description}
                  data-testid={
                    `step-item-${step.id}`}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default StartupStepsPanel;
