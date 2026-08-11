'use client';

/**
 * Molecule for searching and linking an Organisation.
 * @module components/molecules/OrgSearchSelect
 */
import React, { useEffect, useState } from 'react';
import Autocomplete
  from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import {
  useListOrganisationsQuery,
} from '@/store/api/organisationsApi';
import type { Organisation }
  from '@/types/organisations';

/** Props for OrgSearchSelect. */
export interface OrgSearchSelectProps {
  /** Currently linked organisation id, or null. */
  readonly value: string | null;
  /** Called when the user picks or clears an org. */
  readonly onChange: (id: string | null) => void;
}

/**
 * Debounced autocomplete that searches the company
 * registry and emits the selected organisation id.
 *
 * @param props - OrgSearchSelectProps.
 * @returns MUI Autocomplete populated from the registry.
 */
export const OrgSearchSelect: React.FC<
  OrgSearchSelectProps
> = ({ value, onChange }) => {
  const t = useTranslations('companies');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(
      () => setSearch(input), 300,
    );
    return () => clearTimeout(timer);
  }, [input]);

  const { data: orgs = [] } =
    useListOrganisationsQuery(search || undefined);

  const selected =
    orgs.find((o) => o.id === value) ?? null;

  return (
    <Autocomplete<Organisation>
      options={orgs}
      value={selected}
      getOptionLabel={(o) => o.name}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      onChange={(_, v) =>
        onChange(v?.id ?? null)}
      isOptionEqualToValue={
        (o, v) => o.id === v.id}
      data-testid="org-search-select"
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('linkOrg')}
          aria-label={t('linkOrg')}
        />
      )}
    />
  );
};

export default OrgSearchSelect;
