'use client';

/**
 * Competitor tracker organism — table of competitors
 * with add/edit/delete actions.
 * @module components/organisms/CompetitorTracker
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Table from '@shared/m3/Table';
import TableBody from '@shared/m3/TableBody';
import TableCell from '@shared/m3/TableCell';
import TableContainer from '@shared/m3/TableContainer';
import TableHead from '@shared/m3/TableHead';
import TableRow from '@shared/m3/TableRow';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useCompetitorTracker }
  from '@/hooks/useCompetitorTracker';
import { CompetitorRow }
  from '@/components/molecules/CompetitorRow';
import { CompetitorDialog }
  from '@/components/molecules/CompetitorDialog';

/**
 * Competitor tracker organism.
 * @returns CompetitorTracker UI.
 */
export const CompetitorTracker: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const vm = useCompetitorTracker();

  if (vm.isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="competitor-tracker"
      aria-label={t('competitors')}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained"
          onClick={vm.openAdd}
          aria-label={t('addCompetitor')}
          data-testid="competitor-add-btn">
          {t('addCompetitor')}
        </Button>
      </Box>
      <TableContainer>
        <Table aria-label={t('competitors')}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Strengths</TableCell>
              <TableCell>Weaknesses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vm.data.map((c) => (
              <CompetitorRow key={c.id}
                competitor={c}
                onEdit={vm.openEdit}
                onDelete={vm.handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CompetitorDialog
        open={vm.dialogOpen}
        competitor={vm.editing}
        onClose={() => vm.setDialogOpen(false)}
      />
    </Box>
  );
};

export default CompetitorTracker;
