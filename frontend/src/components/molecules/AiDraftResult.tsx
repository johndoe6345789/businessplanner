'use client';

/**
 * Displays generated AI document with copy button.
 * @module components/molecules/AiDraftResult
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Paper from '@shared/m3/Paper';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/** Props for AiDraftResult. */
export interface AiDraftResultProps {
  /** Generated document content. */
  content: string;
}

/**
 * Renders the document draft inside a Paper with
 * a one-click copy-to-clipboard button.
 */
export const AiDraftResult: React.FC<
  AiDraftResultProps
> = ({ content }) => {
  const t = useTranslations('aiDocs');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <Paper
      variant="outlined"
      data-testid="ai-draft-result"
      sx={{ p: 2, mt: 1 }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 1,
      }}>
        <Button
          size="small"
          variant="outlined"
          onClick={handleCopy}
          aria-label={
            copied ? t('copied') : t('copy')
          }
        >
          {copied ? t('copied') : t('copy')}
        </Button>
      </Box>
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap' }}
      >
        {content}
      </Typography>
    </Paper>
  );
};

export default AiDraftResult;
