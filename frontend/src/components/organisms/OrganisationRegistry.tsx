'use client';
/**
 * @module components/organisms/OrganisationRegistry
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Grid from '@shared/m3/Grid';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import TextField from '@mui/material/TextField';
import CircularProgress
  from '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { OrgCard }
  from '@/components/molecules/OrgCard';
import { OrgDialog }
  from '@/components/molecules/OrgDialog';
import { useOrganisations }
  from '@/hooks/useOrganisations';

/**
 * Unified organisation registry with search and CRUD.
 * @returns OrganisationRegistry UI.
 */
export const OrganisationRegistry: React.FC =
  () => {
    const t = useTranslations('companies');
    const tc = useTranslations('common');
    const {
      data, isLoading, isError, saveError,
      search, setSearch,
      open, setOpen, editing, form, setForm,
      openAdd, openEdit, handleSave, handleDelete,
    } = useOrganisations();

    if (isLoading) return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress aria-label={tc('loading')}/>
      </Box>
    );

    if (isError) return (
      <Typography color="error"
        data-testid="org-error">
        {tc('error')}
      </Typography>
    );

    return (
      <Box data-testid="org-registry">
        {saveError && (
          <Typography color="error" sx={{ mb: 2 }}
            data-testid="org-save-error">
            {saveError}
          </Typography>
        )}
        <Box sx={{ display: 'flex',
          gap: 2, mb: 3, alignItems: 'center' }}>
          <TextField
            data-testid="org-search"
            label={t('search')} size="small"
            value={search} sx={{ flexGrow: 1 }}
            onChange={(e) =>
              setSearch(e.target.value)} />
          <Button variant="contained"
            onClick={openAdd}
            data-testid="org-add-btn"
            aria-label={t('addOrg')}>
            {t('addOrg')}
          </Button>
        </Box>
        {data.length === 0 && (
          <Typography color="text.secondary"
            data-testid="org-empty">
            {t('noEntries')}
          </Typography>
        )}
        <Grid container spacing={2}>
          {data.map((org) => (
            <Grid key={org.id} item
              xs={12} sm={6} md={4}>
              <OrgCard org={org}
                onEdit={openEdit}
                onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
        <OrgDialog open={open}
          isEdit={!!editing} form={form}
          onFormChange={setForm}
          onSave={handleSave}
          onClose={() => setOpen(false)} />
      </Box>
    );
  };

export default OrganisationRegistry;
