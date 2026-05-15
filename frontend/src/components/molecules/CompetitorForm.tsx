'use client';

/**
 * Form molecule for creating or editing a competitor.
 * @module components/molecules/CompetitorForm
 */
import React from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import MenuItem from '@shared/m3/MenuItem';
import Select from '@shared/m3/Select';
import { useTranslations } from 'next-intl';
import { TagInput }
  from '@/components/molecules/TagInput';
import { OrgSearchSelect }
  from '@/components/molecules/OrgSearchSelect';
import { CompetitorFormActions }
  from './CompetitorFormActions';
import { useCompetitorForm, COMPETITOR_STAGES } from './useCompetitorForm';
import type { Competitor } from '@/types/marketResearch';

/** Props for CompetitorForm. */
export interface CompetitorFormProps {
  /** Pre-populated competitor for edit mode. */
  readonly initial?: Competitor;
  /** Called after a successful save. */
  readonly onDone: () => void;
}

/**
 * Add / edit competitor form.
 *
 * @param props - CompetitorFormProps.
 * @returns Competitor form UI.
 */
export const CompetitorForm: React.FC<
  CompetitorFormProps
> = ({ initial, onDone }) => {
  const t = useTranslations('marketResearch');
  const {
    name, setName, website, setWebsite,
    stage, setStage, strengths, setStrengths,
    weaknesses, setWeaknesses, notes, setNotes,
    orgId, setOrgId, handleSubmit,
  } = useCompetitorForm(initial, onDone);

  return (
    <Box data-testid="competitor-form"
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      <OrgSearchSelect
        value={orgId} onChange={setOrgId} />
      <TextField label={t('competitorName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        inputProps={{
          'aria-label': t('competitorName'),
        }}
        data-testid="cf-name" fullWidth />
      <TextField label={t('competitorWebsite')}
        value={website}
        onChange={(e) =>
          setWebsite(e.target.value)}
        inputProps={{
          'aria-label': t('competitorWebsite'),
        }}
        data-testid="cf-website" fullWidth />
      <Select value={stage}
        onChange={(e) => setStage(e.target.value)}
        aria-label={t('competitorStage')}
        data-testid="cf-stage" fullWidth>
        {COMPETITOR_STAGES.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
      <TagInput label={t('competitorStrengths')}
        tags={strengths} onChange={setStrengths}
        placeholder={t('addStrength')}
        inputAriaLabel={t('addStrength')}
        testId="cf-strength-input" />
      <TagInput label={t('competitorWeaknesses')}
        tags={weaknesses} onChange={setWeaknesses}
        placeholder={t('addWeakness')}
        inputAriaLabel={t('addWeakness')}
        testId="cf-weakness-input" />
      <TextField label={t('competitorNotes')}
        multiline rows={3} value={notes}
        onChange={(e) => setNotes(e.target.value)}
        inputProps={{
          'aria-label': t('competitorNotes'),
        }}
        data-testid="cf-notes" fullWidth />
      <CompetitorFormActions
        onSave={() => void handleSubmit()}
        onCancel={onDone} />
    </Box>
  );
};

export default CompetitorForm;
