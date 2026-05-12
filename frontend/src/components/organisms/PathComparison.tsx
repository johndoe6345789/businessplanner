'use client';

/**
 * Funding path comparison organism.
 * Renders Lean / Bootstrap / Funded columns side by side.
 * No backend interaction — data from local JSON.
 * @module components/organisms/PathComparison
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import { useTranslations } from 'next-intl';
import pathData from
  '@/constants/path-comparison.json';

type PathKey = 'lean' | 'bootstrap' | 'funded';
const PATHS: PathKey[] = ['lean', 'bootstrap', 'funded'];

/** Path column card component (internal). */
const PathColumn: React.FC<{
  titleKey: string;
  data: typeof pathData.lean;
  testId: string;
}> = ({ titleKey, data, testId }) => {
  const t = useTranslations('financials');
  return (
    <Card data-testid={testId}
      sx={{ flex: 1, minWidth: 240 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700,
          mb: 1 }}>
          {t(`paths.${titleKey}` as Parameters<typeof t>[0])}
        </Typography>
        <Typography variant="caption"
          color="success.main" sx={{ fontWeight: 600 }}>
          Pros
        </Typography>
        <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 1 }}>
          {data.pros.map((p) => (
            <li key={p}>
              <Typography variant="body2">{p}</Typography>
            </li>
          ))}
        </Box>
        <Typography variant="caption"
          color="error.main" sx={{ fontWeight: 600 }}>
          Cons
        </Typography>
        <Box component="ul" sx={{ pl: 2, mt: 0.5, mb: 1 }}>
          {data.cons.map((c) => (
            <li key={c}>
              <Typography variant="body2">{c}</Typography>
            </li>
          ))}
        </Box>
        <Typography variant="caption"
          color="info.main" sx={{ fontWeight: 600 }}>
          When to choose
        </Typography>
        <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
          {data.whenToChoose.map((w) => (
            <li key={w}>
              <Typography variant="body2">{w}</Typography>
            </li>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Three-column path comparison — no save button.
 * @returns PathComparison UI.
 */
export const PathComparison: React.FC = () => {
  const t = useTranslations('financials');
  return (
    <Box data-testid="path-comparison"
      aria-label={t('paths.title')}>
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap' }}>
        {PATHS.map((key) => (
          <PathColumn key={key}
            titleKey={key}
            data={pathData[key]}
            testId={`path-col-${key}`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PathComparison;
