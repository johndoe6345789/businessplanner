'use client';

/**
 * Add-hypothesis form molecule.
 * @module components/molecules/HypothesisAddForm
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { useCreateHypothesisMutation }
  from '@/store/api/financialsHypothesisApi';

/**
 * Inline form to create a new financial hypothesis.
 * @returns HypothesisAddForm UI.
 */
export const HypothesisAddForm: React.FC = () => {
  const t = useTranslations('financials');
  const [create] = useCreateHypothesisMutation();
  const [assumption, setAssumption] = useState('');
  const [testMethod, setTestMethod] = useState('');

  const handleAdd = () => {
    if (!assumption.trim()) return;
    void create({
      assumption: assumption.trim(),
      test_method: testMethod.trim(),
    });
    setAssumption('');
    setTestMethod('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1,
      flexWrap: 'wrap', mb: 2 }}>
      <TextField label={t('hypotheses.assumption')}
        value={assumption}
        onChange={(e) => setAssumption(e.target.value)}
        inputProps={{
          'aria-label': t('hypotheses.assumption') }}
        data-testid="hyp-input-assumption"
        sx={{ flex: 2, minWidth: 200 }} />
      <TextField label={t('hypotheses.testMethod')}
        value={testMethod}
        onChange={(e) => setTestMethod(e.target.value)}
        inputProps={{
          'aria-label': t('hypotheses.testMethod') }}
        data-testid="hyp-input-test"
        sx={{ flex: 1, minWidth: 160 }} />
      <Button onClick={handleAdd}
        aria-label={t('hypotheses.add')}
        data-testid="hyp-add-btn"
        variant="contained"
        sx={{ alignSelf: 'center' }}>
        {t('hypotheses.add')}
      </Button>
    </Box>
  );
};

export default HypothesisAddForm;
