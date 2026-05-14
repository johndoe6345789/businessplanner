'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Skeleton from '@shared/m3/Skeleton';
import Divider from '@mui/material/Divider';
import { useTranslations } from 'next-intl';
import { useListRisksQuery }
  from '@/store/api/riskAssessmentApi';
import RiskRow
  from '@/components/molecules/RiskRow';
import RiskAddForm
  from '@/components/molecules/RiskAddForm';

const COLS = [
  'category', 'title', 'p', 'i',
  'score', 'owner', 'status', '',
];

/**
 * Risk register table: shows all user risks
 * ordered by score, plus an inline add form.
 *
 * @returns Full risk register organism.
 */
const RiskRegister: React.FC = () => {
  const t = useTranslations('riskAssessment');
  const { data, isLoading } =
    useListRisksQuery();

  return (
    <Box data-testid="risk-register">
      <Typography variant="h6" fontWeight={700}
        mb={2}>{t('registerTitle')}
      </Typography>

      <RiskAddForm />
      <Divider sx={{ my: 3 }} />

      {isLoading ? (
        <Box data-testid="risk-register-loading"
          aria-busy="true">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={52}
              variant="rectangular"
              sx={{ mb: 1, borderRadius: 1 }} />
          ))}
        </Box>
      ) : !data?.length ? (
        <Typography color="text.secondary"
          variant="body2"
          data-testid="risk-register-empty">
          {t('noRisks')}
        </Typography>
      ) : (
        <TableContainer>
          <Table
            size="small"
            aria-label={t('registerTitle')}
          >
            <TableHead>
              <TableRow>
                {COLS.map((c, i) => (
                  <TableCell key={i}
                    align={
                      c === 'p' || c === 'i'
                        ? 'center' : 'left'
                    }
                  >
                    {c
                      ? t(`cols.${c}`)
                      : null
                    }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((r) => (
                <RiskRow key={r.id} risk={r} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RiskRegister;
