'use client';

import React, { useState } from 'react';
import { Box, TextField, Button } from '@shared/m3';
import type { AddKeyResultInput } from '@/types/okr';

/** Props for OkrAddKrInline. */
export interface OkrAddKrInlineProps {
  readonly objectiveId: string;
  readonly onAdd: (
    input: { objectiveId: string } & AddKeyResultInput,
  ) => void;
}

/**
 * Inline form for adding a key result to an objective.
 *
 * @param props - OkrAddKrInlineProps.
 * @returns Form row element.
 */
const OkrAddKrInline: React.FC<OkrAddKrInlineProps> = (
  { objectiveId, onAdd },
) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleAdd = () => {
    if (!title || !target) return;
    onAdd({
      objectiveId,
      title,
      start_value: 0,
      target_value: parseFloat(target),
      unit: '',
    });
    setTitle(''); setTarget('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <TextField size="small" label="KR title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        data-testid="okr-kr-title-input" />
      <TextField size="small" label="Target"
        type="number" value={target}
        onChange={(e) => setTarget(e.target.value)}
        data-testid="okr-kr-target-input"
        sx={{ width: 90 }} />
      <Button size="small" variant="contained"
        data-testid="okr-kr-add-confirm"
        onClick={handleAdd}>Add</Button>
    </Box>
  );
};

export default OkrAddKrInline;
