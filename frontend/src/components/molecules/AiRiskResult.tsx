'use client';

/**
 * Displays AI risk report results with copy button.
 * @module components/molecules/AiRiskResult
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/** Props for AiRiskResult. */
export interface AiRiskResultProps {
  /** Risk text content. */
  risks: string;
  /** ISO timestamp from the API. */
  generatedAt: string;
}

/**
 * Neutral card showing risk analysis with timestamp
 * and copy-to-clipboard button.
 */
export const AiRiskResult: React.FC<AiRiskResultProps> = (
  { risks, generatedAt },
) => {
  const t = useTranslations('riskReport');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(risks)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <Box
      aria-live="polite"
      data-testid="risk-report-result"
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 0.5 }}
      >
        {t('resultsHeading')}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 1 }}
      >
        {t('generatedAt')}{' '}
        {new Date(generatedAt).toLocaleString()}
      </Typography>
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap', mb: 1.5 }}
      >
        {risks}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        onClick={handleCopy}
        data-testid="risk-report-copy-btn"
        aria-label={copied ? t('copied') : t('copy')}
      >
        {copied ? t('copied') : t('copy')}
      </Button>
    </Box>
  );
};

export default AiRiskResult;
