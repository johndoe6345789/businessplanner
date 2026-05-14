'use client';

/**
 * @file SkillTagList.tsx
 * @brief Renders a list of removable skill tags.
 *        Extracted from SkillTagInput to keep
 *        each file under 100 lines.
 */
import React from 'react';
import { SkillTag } from './SkillTag';

/** Props for SkillTagList. */
export interface SkillTagListProps {
  /** Skill strings to display as chips. */
  skills: string[];
  /** Called when a chip's × is clicked. */
  onRemove: (skill: string) => void;
}

/**
 * Renders a row of SkillTag chips.
 *
 * @param props - SkillTagListProps.
 */
export const SkillTagList: React.FC<
  SkillTagListProps
> = ({ skills, onRemove }) => (
  <>
    {skills.map((s) => (
      <SkillTag key={s} label={s}
        onRemove={onRemove} />
    ))}
  </>
);

export default SkillTagList;
