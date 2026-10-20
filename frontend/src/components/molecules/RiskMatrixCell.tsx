'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Tooltip from '@mui/material/Tooltip';
import type { Risk } from '@/types/riskAssessment';

/** Background colour keyed by score zone. */
function cellBg(score: number): string {
  if (score <= 4) return '#4caf5033';
  if (score <= 9) return '#ff980033';
  if (score <= 15) return '#f4433633';
  return '#b71c1c44';
}

/** Props for RiskMatrixCell. */
export interface RiskMatrixCellProps {
  /** Probability (row, 1–5). */
  probability: number;
  /** Impact (column, 1–5). */
  impact: number;
  /** Risks that fall in this cell. */
  risks: Risk[];
}

/**
 * Single cell in the 5×5 risk heat-map.
 * Shows a count badge when risks are present.
 *
 * @param props - Cell position and its risks.
 * @returns Coloured box with optional risk count.
 */
const RiskMatrixCell: React.FC<
  RiskMatrixCellProps
> = ({ probability: p, impact: i, risks }) => (
  <Tooltip title={
    risks.map((r) => r.title).join(', ')
    || `P${p}×I${i}`
  }>
    <Box
      data-testid={`matrix-cell-${p}-${i}`}
      sx={{
        width: 52, height: 52,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: cellBg(p * i),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        cursor: risks.length ? 'pointer' : 'default',
      }}
    >
      {risks.length > 0 ? risks.length : null}
    </Box>
  </Tooltip>
);

export default RiskMatrixCell;
