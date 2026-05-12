'use client';

/**
 * Form molecule for logging a discovery / interview entry.
 * @module components/molecules/DiscoveryEntryForm
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import {
  useCreateDiscoveryEntryMutation,
} from '@/store/api/marketResearchDiscoveryApi';
import { TagInput }
  from '@/components/molecules/TagInput';

/** Props for DiscoveryEntryForm. */
export interface DiscoveryEntryFormProps {
  /** Called after a successful save. */
  readonly onDone: () => void;
}

/**
 * Log a new customer discovery / interview entry.
 *
 * @param props - DiscoveryEntryFormProps.
 * @returns Discovery entry form UI.
 */
export const DiscoveryEntryForm: React.FC<
  DiscoveryEntryFormProps
> = ({ onDone }) => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const [createEntry] = useCreateDiscoveryEntryMutation();

  const [contactName, setContactName] = useState('');
  const [date, setDate] = useState('');
  const [keyFindings, setKeyFindings] = useState('');
  const [validated, setValidated] =
    useState<string[]>([]);
  const [invalidated, setInvalidated] =
    useState<string[]>([]);

  const handleSubmit = async () => {
    await createEntry({
      contactName, date, keyFindings,
      validatedAssumptions: validated,
      invalidatedAssumptions: invalidated,
    });
    onDone();
  };

  return (
    <Box data-testid="discovery-entry-form"
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 2 }}>
      <TextField label={t('contactName')}
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        inputProps={{ 'aria-label': t('contactName') }}
        data-testid="def-contact" fullWidth />
      <TextField label={t('interviewDate')}
        type="date" value={date}
        onChange={(e) => setDate(e.target.value)}
        inputProps={{ 'aria-label': t('interviewDate') }}
        InputLabelProps={{ shrink: true }}
        data-testid="def-date" fullWidth />
      <TextField label={t('keyFindings')}
        multiline rows={3} value={keyFindings}
        onChange={(e) => setKeyFindings(e.target.value)}
        inputProps={{ 'aria-label': t('keyFindings') }}
        data-testid="def-findings" fullWidth />
      <TagInput label={t('validatedAssumptions')}
        tags={validated} onChange={setValidated}
        placeholder={t('addAssumption')}
        inputAriaLabel={t('validatedAssumptions')}
        testId="def-validated" />
      <TagInput label={t('invalidatedAssumptions')}
        tags={invalidated} onChange={setInvalidated}
        placeholder={t('addAssumption')}
        inputAriaLabel={t('invalidatedAssumptions')}
        testId="def-invalidated" />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained"
          onClick={() => void handleSubmit()}
          aria-label={tc('save')}
          data-testid="def-submit">
          {tc('save')}
        </Button>
        <Button onClick={onDone}
          aria-label={tc('cancel')}
          data-testid="def-cancel">
          {tc('cancel')}
        </Button>
      </Box>
    </Box>
  );
};

export default DiscoveryEntryForm;
