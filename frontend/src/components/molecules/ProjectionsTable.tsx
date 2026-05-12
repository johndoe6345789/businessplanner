'use client';

/**
 * Revenue projections table molecule.
 * @module components/molecules/ProjectionsTable
 */
import React from 'react';
import Typography from '@shared/m3/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslations } from 'next-intl';
import type { RevenueProjection } from '@/types/financials';

/** Props for ProjectionsTable. */
export interface ProjectionsTableProps {
  /** Array of monthly projection rows. */
  projections: RevenueProjection[];
  /** Target MRR used to highlight rows. */
  targetMrr: number;
}

/**
 * Table of 12-month revenue projections.
 * @param props - ProjectionsTableProps.
 * @returns ProjectionsTable UI.
 */
export const ProjectionsTable: React.FC<
  ProjectionsTableProps
> = ({ projections, targetMrr }) => {
  const t = useTranslations('financials');
  return (
    <>
      <Table size="small"
        aria-label={t('projections.title')}
        data-testid="proj-table">
        <TableHead>
          <TableRow>
            <TableCell>
              {t('projections.month')}
            </TableCell>
            <TableCell align="right">
              {t('projections.customers')}
            </TableCell>
            <TableCell align="right">
              {t('projections.mrr')} (£)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projections.map((row) => (
            <TableRow key={row.month}
              data-testid={`proj-row-${row.month}`}
              sx={
                row.mrr_gbp >= targetMrr && targetMrr > 0
                  ? { backgroundColor: 'success.light' }
                  : {}
              }>
              <TableCell>{row.month}</TableCell>
              <TableCell align="right">
                {row.customers}
              </TableCell>
              <TableCell align="right">
                {row.mrr_gbp.toFixed(0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {targetMrr > 0 && (
        <Typography variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: 'block' }}>
          Highlighted rows meet or exceed target MRR.
        </Typography>
      )}
    </>
  );
};

export default ProjectionsTable;
