'use client';

/**
 * Button that saves an AI suggestion to a planner step.
 * @module components/molecules/SaveChatToStepButton
 */
import React, { useState } from 'react';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import {
  useSaveStepContextMutation,
} from '@/store/api/chatStepApi';

/** Props for SaveChatToStepButton. */
export interface SaveChatToStepButtonProps {
  /** Planner step identifier. */
  stepId: string;
  /** AI suggestion text to save. */
  context: string;
}

/**
 * Small inline button that persists an AI suggestion
 * as the saved context for a planner step.
 * Shows a transient "Saved" confirmation.
 */
export const SaveChatToStepButton: React.FC<
  SaveChatToStepButtonProps
> = ({ stepId, context }) => {
  const t = useTranslations('chatStep');
  const [saved, setSaved] = useState(false);
  const [save, { isLoading }] =
    useSaveStepContextMutation();

  const handleSave = async () => {
    if (!context.trim()) return;
    await save({ step_id: stepId, context });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Button
      size="small"
      variant="text"
      disabled={isLoading || saved}
      onClick={() => void handleSave()}
      data-testid={`save-chat-step-${stepId}`}
      aria-label={
        saved ? t('saved') : t('save')
      }
      sx={{ fontSize: '0.7rem', py: 0 }}
    >
      {saved ? t('saved') : t('save')}
    </Button>
  );
};

export default SaveChatToStepButton;
