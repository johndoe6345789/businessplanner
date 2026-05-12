'use client';

/**
 * Live equity split calculator organism.
 * Results update as the user types; RTK mutation
 * is called only on explicit "Save" click.
 * @module components/organisms/EquityCalculator
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { FounderInputRow }
  from '@/components/molecules/FounderInputRow';
import { EquityResultsTable }
  from '@/components/molecules/EquityResultsTable';
import { useEquityCompute }
  from '@/hooks/useEquityCompute';
import type { FounderInput } from '@/types/legal';

const MAX_FOUNDERS = 5;
const DEFAULT: FounderInput = {
  name: '', role: 'other',
  timeCommitmentMonths: 12,
  capitalContribution: 0,
  ideaOriginator: false,
  priorExperience: 'medium',
};

/**
 * Equity split calculator with live computation.
 *
 * @returns Equity calculator UI.
 */
export const EquityCalculator: React.FC = () => {
  const t = useTranslations('legal');
  const tc = useTranslations('common');
  const [founders, setFounders] = useState<
    FounderInput[]
  >([
    { ...DEFAULT, name: 'Founder 1',
      role: 'ceo', ideaOriginator: true },
    { ...DEFAULT, name: 'Founder 2',
      role: 'cto' },
  ]);
  const { splits } = useEquityCompute(founders);

  const update = (i: number, f: FounderInput) =>
    setFounders((p) =>
      p.map((x, idx) => (idx === i ? f : x)));
  const remove = (i: number) =>
    setFounders((p) =>
      p.filter((_, idx) => idx !== i));
  const add = () =>
    founders.length < MAX_FOUNDERS &&
    setFounders((p) => [
      ...p,
      { ...DEFAULT, name: `Founder ${p.length+1}` },
    ]);

  return (
    <Box data-testid="equity-calculator"
      aria-label={t('equityTitle')}>
      {founders.map((f, i) => (
        <FounderInputRow key={i} founder={f}
          index={i} onChange={(v) => update(i, v)}
          onRemove={() => remove(i)}
          removeLabel={tc('delete')}
        />
      ))}
      {founders.length < MAX_FOUNDERS && (
        <Button onClick={add}
          aria-label={t('addFounder')}
          data-testid="equity-add-founder"
          sx={{ mb: 3 }}>
          {t('addFounder')}
        </Button>
      )}
      <Typography variant="h6" gutterBottom>
        {t('equityTitle')}
      </Typography>
      <EquityResultsTable splits={splits} />
    </Box>
  );
};

export default EquityCalculator;
