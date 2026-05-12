'use client';

/**
 * Read-only table displaying live equity split results.
 * @module components/molecules/EquityResultsTable
 */
import React from 'react';
import {
  Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer,
} from '@shared/m3/Table';
import { useTranslations } from 'next-intl';
import type { EquitySplit } from '@/types/legal';

/** Props for EquityResultsTable. */
export interface EquityResultsTableProps {
  /** Computed splits to display. */
  splits: EquitySplit[];
}

/**
 * Displays equity split computation results.
 *
 * @param props - splits array.
 * @returns Results table element.
 */
export const EquityResultsTable: React.FC<
  EquityResultsTableProps
> = ({ splits }) => {
  const t = useTranslations('legal');

  return (
    <TableContainer>
      <Table aria-label={t('equityTitle')}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{t('score')}</TableCell>
            <TableCell>{t('totalEquity')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {splits.map((s) => (
            <TableRow
              key={s.name}
              data-testid="equity-result-row"
            >
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.score}</TableCell>
              <TableCell>{s.equityPct}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EquityResultsTable;
