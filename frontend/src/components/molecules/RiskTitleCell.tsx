'use client';

/**
 * Table cell displaying a risk title and description.
 * @module components/molecules/RiskTitleCell
 */
import React from 'react';
import TableCell from '@mui/material/TableCell';
import Typography from '@shared/m3/Typography';
import type { Risk } from '@/types/riskAssessment';

/** Props for RiskTitleCell. */
export interface RiskTitleCellProps {
  /** Risk item whose title/description to show. */
  risk: Risk;
}

/**
 * Renders a risk title (bold) with an optional
 * secondary description beneath it.
 *
 * @param props - Component props.
 * @returns TableCell with title and description.
 */
export const RiskTitleCell: React.FC<
  RiskTitleCellProps
> = ({ risk: r }) => (
  <TableCell>
    <Typography variant="body2" fontWeight={600}>
      {r.title}
    </Typography>
    {r.description && (
      <Typography variant="caption"
        color="text.secondary"
        sx={{ display: 'block' }}>
        {r.description}
      </Typography>
    )}
  </TableCell>
);

export default RiskTitleCell;
