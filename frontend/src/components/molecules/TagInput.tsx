'use client';

/**
 * Reusable tag list with add-on-Enter input.
 * @module components/molecules/TagInput
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Chip from '@shared/m3/Chip';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';

/** Props for TagInput. */
export interface TagInputProps {
  /** Section label shown above the chip list. */
  readonly label: string;
  /** Current list of tag values. */
  readonly tags: string[];
  /** Placeholder for the text input. */
  readonly placeholder: string;
  /** aria-label for the text input. */
  readonly inputAriaLabel: string;
  /** data-testid for the text input. */
  readonly testId: string;
  /** Called when the tag list changes. */
  readonly onChange: (tags: string[]) => void;
}

/**
 * Chip list with an Enter-to-add text input.
 *
 * @param props - TagInputProps.
 * @returns Tag input UI.
 */
export const TagInput: React.FC<TagInputProps> = ({
  label, tags, placeholder, inputAriaLabel,
  testId, onChange,
}) => {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...tags, trimmed]);
    setInput('');
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1,
        flexWrap: 'wrap', mb: 0.5 }}>
        {tags.map((tag, i) => (
          <Chip key={i} label={tag} size="small"
            onDelete={() =>
              onChange(tags.filter(
                (_, idx) => idx !== i))} />
        ))}
      </Box>
      <TextField value={input} size="small"
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        inputProps={{ 'aria-label': inputAriaLabel }}
        data-testid={testId}
        fullWidth
      />
    </Box>
  );
};

export default TagInput;
