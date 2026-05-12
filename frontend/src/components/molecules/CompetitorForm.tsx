'use client';

/**
 * Form molecule for creating or editing a competitor.
 * @module components/molecules/CompetitorForm
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Button from '@shared/m3/Button';
import Chip from '@shared/m3/Chip';
import MenuItem from '@shared/m3/MenuItem';
import Select from '@shared/m3/Select';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import {
  useCreateCompetitorMutation,
  useUpdateCompetitorMutation,
} from '@/store/api/marketResearchCompetitorApi';
import type { Competitor } from '@/types/marketResearch';

const STAGES = ['idea', 'early', 'growth', 'enterprise'];

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
  const tc = useTranslations('common');
  const [createCompetitor] = useCreateCompetitorMutation();
  const [updateCompetitor] = useUpdateCompetitorMutation();

  const [name, setName] = useState(initial?.name ?? '');
  const [website, setWebsite] =
    useState(initial?.website ?? '');
  const [stage, setStage] = useState(
    initial?.stage ?? STAGES[0]);
  const [strengths, setStrengths] = useState<string[]>(
    initial?.strengths ?? []);
  const [weaknesses, setWeaknesses] = useState<string[]>(
    initial?.weaknesses ?? []);
  const [notes, setNotes] = useState(
    initial?.notes ?? '');
  const [tagInput, setTagInput] = useState('');
  const [weakInput, setWeakInput] = useState('');

  const addTag = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
    clear: () => void,
  ) => {
    if (!val.trim()) return;
    setList([...list, val.trim()]);
    clear();
  };

  const handleSubmit = async () => {
    const payload = {
      name, website, stage,
      strengths, weaknesses, notes,
      features: {} as Record<string, boolean>,
    };
    if (initial) {
      await updateCompetitor(
        { id: initial.id, data: payload });
    } else {
      await createCompetitor(payload);
    }
    onDone();
  };

  return (
    <Box data-testid="competitor-form"
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 2 }}>
      <TextField label={t('competitorName')} value={name}
        onChange={(e) => setName(e.target.value)}
        inputProps={{ 'aria-label': t('competitorName') }}
        data-testid="cf-name" fullWidth />
      <TextField label={t('competitorWebsite')}
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        inputProps={{
          'aria-label': t('competitorWebsite') }}
        data-testid="cf-website" fullWidth />
      <Select value={stage}
        onChange={(e) => setStage(e.target.value)}
        aria-label={t('competitorStage')}
        data-testid="cf-stage" fullWidth>
        {STAGES.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </Select>
      <Typography variant="body2">
        {t('competitorStrengths')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1,
        flexWrap: 'wrap', mb: 0.5 }}>
        {strengths.map((s, i) => (
          <Chip key={i} label={s} size="small"
            onDelete={() =>
              setStrengths(strengths.filter(
                (_, idx) => idx !== i))}
          />
        ))}
      </Box>
      <TextField value={tagInput} size="small"
        placeholder={t('addStrength')}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' &&
          addTag(strengths, setStrengths, tagInput,
            () => setTagInput(''))}
        inputProps={{ 'aria-label': t('addStrength') }}
        data-testid="cf-strength-input" />
      <Typography variant="body2">
        {t('competitorWeaknesses')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1,
        flexWrap: 'wrap', mb: 0.5 }}>
        {weaknesses.map((w, i) => (
          <Chip key={i} label={w} size="small"
            onDelete={() =>
              setWeaknesses(weaknesses.filter(
                (_, idx) => idx !== i))}
          />
        ))}
      </Box>
      <TextField value={weakInput} size="small"
        placeholder={t('addWeakness')}
        onChange={(e) => setWeakInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' &&
          addTag(weaknesses, setWeaknesses, weakInput,
            () => setWeakInput(''))}
        inputProps={{ 'aria-label': t('addWeakness') }}
        data-testid="cf-weakness-input" />
      <TextField label={t('competitorNotes')}
        multiline rows={3} value={notes}
        onChange={(e) => setNotes(e.target.value)}
        inputProps={{ 'aria-label':
          t('competitorNotes') }}
        data-testid="cf-notes" fullWidth />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained"
          onClick={() => void handleSubmit()}
          aria-label={tc('save')}
          data-testid="cf-submit">
          {tc('save')}
        </Button>
        <Button onClick={onDone}
          aria-label={tc('cancel')}
          data-testid="cf-cancel">
          {tc('cancel')}
        </Button>
      </Box>
    </Box>
  );
};

export default CompetitorForm;
