'use client';

import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import type { Risk } from '@/types/riskAssessment';
import RiskBadge from '@/components/atoms/RiskBadge';
import {
  useDeleteRiskMutation,
} from '@/store/api/riskAssessmentApi';
import { Delete as DeleteIcon }
  from '@shared/icons/Delete';

/** Props for RiskRow. */
export interface RiskRowProps {
  /** Risk data to display. */
  risk: Risk;
}

/**
 * Single table row representing one risk entry.
 * Shows category, title, probability, impact, score
 * badge, mitigation owner, status, and a delete action.
 *
 * @param props - Risk item.
 * @returns TableRow element.
 */
const RiskRow: React.FC<RiskRowProps> = (
  { risk: r },
) => {
  const t = useTranslations('riskAssessment');
  const [deleteRisk, { isLoading }] =
    useDeleteRiskMutation();

  return (
    <TableRow
      hover
      data-testid={`risk-row-${r.id}`}
      aria-label={r.title}
    >
      <TableCell>
        <Chip
          label={t(`category.${r.category}`)}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2"
          fontWeight={600}>{r.title}
        </Typography>
        {r.description && (
          <Typography variant="caption"
            color="text.secondary"
            sx={{ display: 'block' }}>
            {r.description}
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">
        {r.probability}
      </TableCell>
      <TableCell align="center">
        {r.impact}
      </TableCell>
      <TableCell>
        <RiskBadge score={r.risk_score} />
      </TableCell>
      <TableCell>
        <Typography variant="caption">
          {r.owner || '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={t(`status.${r.status}`)}
          size="small"
          color={
            r.status === 'closed'
              ? 'success'
              : r.status === 'mitigating'
              ? 'warning' : 'default'
          }
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title={t('deleteRisk')}>
          <span>
            <IconButton
              size="small"
              disabled={isLoading}
              onClick={() => deleteRisk(r.id)}
              aria-label={t('deleteRisk')}
              data-testid={`delete-risk-${r.id}`}
            >
              <DeleteIcon size={16} />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default RiskRow;
