'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useListRisksQuery }
  from '@/store/api/riskAssessmentApi';
import type { Risk } from '@/types/riskAssessment';
import RiskMatrixCell
  from '@/components/molecules/RiskMatrixCell';

/** Build a (probability-impact) → Risk[] map. */
function buildCellMap(
  risks: Risk[],
): Map<string, Risk[]> {
  const m = new Map<string, Risk[]>();
  risks.forEach((r) => {
    const k = `${r.probability}-${r.impact}`;
    m.set(k, [...(m.get(k) ?? []), r]);
  });
  return m;
}

/**
 * 5×5 risk heat-map matrix.
 * Probability increases up the Y axis (5 = top),
 * impact increases along the X axis.
 * Each cell is colour-coded by score zone and
 * shows the count of risks in that cell.
 *
 * @returns Risk matrix organism.
 */
const RiskMatrix: React.FC = () => {
  const t = useTranslations('riskAssessment');
  const { data = [] } = useListRisksQuery();
  const byCell = React.useMemo(
    () => buildCellMap(data), [data],
  );

  return (
    <Box data-testid="risk-matrix">
      <Typography variant="h6" fontWeight={700}
        sx={{ mb: 1 }}>{t('matrixTitle')}
      </Typography>
      <Typography variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 2 }}>{t('matrixHint')}
      </Typography>

      <Box display="flex" alignItems="flex-end"
        gap={0.5}>
        {/* Y-axis label */}
        <Typography variant="caption" sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)', mr: 0.5,
        }}>{t('axisY')}</Typography>

        <Box>
          {[5, 4, 3, 2, 1].map((p) => (
            <Box key={p} display="flex"
              alignItems="center" gap={0.5} mb={0.5}>
              <Typography variant="caption"
                sx={{ width: 12, textAlign: 'right' }}>
                {p}
              </Typography>
              {[1, 2, 3, 4, 5].map((imp) => (
                <RiskMatrixCell key={imp}
                  probability={p} impact={imp}
                  risks={
                    byCell.get(`${p}-${imp}`) ?? []
                  }
                />
              ))}
            </Box>
          ))}

          {/* X-axis ticks and label */}
          <Box display="flex" gap={0.5}
            ml="18px" mt={0.5}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Typography key={i} variant="caption"
                sx={{ width: 52, textAlign: 'center' }}>
                {i}
              </Typography>
            ))}
          </Box>
          <Typography variant="caption"
            sx={{ display: 'block', ml: '18px', mt: 0.5 }}>
            {t('axisX')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RiskMatrix;
