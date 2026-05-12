'use client';

/**
 * Read-only table displaying the vesting schedule.
 * @module components/molecules/VestingScheduleTable
 */
import React from 'react';
import {
  Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer,
} from '@shared/m3/Table';
import { useTranslations } from 'next-intl';
import type { VestingScheduleEntry }
  from '@/types/legal';

/** Props for VestingScheduleTable. */
export interface VestingScheduleTableProps {
  /** Computed schedule rows. */
  schedule: VestingScheduleEntry[];
}

/**
 * Displays a computed vesting schedule.
 *
 * @param props - Schedule entries.
 * @returns Schedule table element.
 */
export const VestingScheduleTable: React.FC<
  VestingScheduleTableProps
> = ({ schedule }) => {
  const t = useTranslations('legal');

  return (
    <TableContainer>
      <Table aria-label={t('vestingTitle')}>
        <TableHead>
          <TableRow>
            <TableCell>{t('month')}</TableCell>
            <TableCell>
              {t('sharesVested')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.map((row) => (
            <TableRow key={row.month}
              data-testid="vesting-schedule-row">
              <TableCell>{row.month}</TableCell>
              <TableCell>
                {row.cumulativeVested
                  .toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VestingScheduleTable;
