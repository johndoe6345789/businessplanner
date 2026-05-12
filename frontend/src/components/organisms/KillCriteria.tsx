'use client';

/**
 * Kill criteria editor and evaluator organism.
 * @module components/organisms/KillCriteria
 */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import CircularProgress from
  '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from
  '@mui/material/FormControlLabel';
import { useTranslations } from 'next-intl';
import {
  useGetKillCriteriaQuery,
  useSaveKillCriteriaMutation,
} from '@/store/api/financialsKillCriteriaApi';
import { KillCriteriaFields }
  from '@/components/molecules/KillCriteriaFields';
import type { KillCriteria as KC } from '@/types/financials';

const DEFAULT: KC = {
  runway_months_min: 3, cac_ltv_ratio_min: 1,
  weekly_active_users_min: 10, custom_criteria: [],
};

/**
 * Kill criteria editor with save-on-blur.
 * @returns KillCriteria UI.
 */
export const KillCriteria: React.FC = () => {
  const t = useTranslations('financials');
  const { data, isLoading } = useGetKillCriteriaQuery();
  const [save] = useSaveKillCriteriaMutation();
  const [criteria, setCriteria] = useState<KC>(DEFAULT);

  useEffect(() => { if (data) setCriteria(data); }, [data]);

  const FIELD_MAP = {
    runway: 'runway_months_min',
    ltvCac: 'cac_ltv_ratio_min',
    wau: 'weekly_active_users_min',
  } as const;
  const handleChange = (
    f: keyof typeof FIELD_MAP, v: number,
  ) => setCriteria((c) => ({ ...c, [FIELD_MAP[f]]: v }));

  const handleBlur = () => void save(criteria);

  const toggleCustom = (i: number) => {
    const next = { ...criteria,
      custom_criteria: criteria.custom_criteria.map(
        (item, idx) =>
          idx === i ? { ...item, met: !item.met } : item,
      ) };
    setCriteria(next);
    void save(next);
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex',
      justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box data-testid="kill-criteria"
      aria-label={t('killCriteria.title')}>
      <KillCriteriaFields
        runwayMin={criteria.runway_months_min}
        ltvCacMin={criteria.cac_ltv_ratio_min}
        wauMin={criteria.weekly_active_users_min}
        onChange={handleChange} onBlur={handleBlur} />
      {criteria.custom_criteria.map((item, i) => (
        <FormControlLabel key={i}
          control={
            <Checkbox checked={item.met}
              onChange={() => toggleCustom(i)}
              aria-label={item.label}
              data-testid={`kc-custom-${i}`} />
          }
          label={<Typography>{item.label}</Typography>} />
      ))}
      <Box sx={{ mt: 2 }}>
        <Button onClick={handleBlur}
          aria-label={t('killCriteria.save')}
          data-testid="kc-save-btn" variant="contained">
          {t('killCriteria.save')}
        </Button>
      </Box>
    </Box>
  );
};

export default KillCriteria;
