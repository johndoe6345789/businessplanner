'use client';

/**
 * AI document drafting organism.
 * @module components/organisms/AiDocumentDrafter
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import CircularProgress
  from '@shared/m3/CircularProgress';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useDraftDocumentMutation,
  type DocumentType,
} from '@/store/api/aiApi';
import { AiDraftSelector }
  from '@/components/molecules/AiDraftSelector';
import { AiDraftResult }
  from '@/components/molecules/AiDraftResult';

/**
 * Lets the founder choose a document type, generate
 * the draft, and copy the result.
 */
export const AiDocumentDrafter: React.FC = () => {
  const t = useTranslations('aiDocs');
  const [selected, setSelected] =
    useState<DocumentType | null>(null);

  const startupType = useSelector(
    (s: RootState) => s.startupType.selectedSlug,
  );
  const startupName = useSelector(
    (s: RootState) => s.startupType.startupName,
  );
  const stage = useSelector(
    (s: RootState) => s.startupType.selectedStage,
  );

  const [draft, { data, isLoading }] =
    useDraftDocumentMutation();

  const handleGenerate = () => {
    if (!selected) return;
    void draft({
      document_type: selected,
      startup_type: startupType,
      startup_name: startupName ?? undefined,
      stage,
    });
  };

  return (
    <Box data-testid="ai-document-drafter">
      <Typography variant="h5" gutterBottom
        sx={{ fontWeight: 700 }}>
        {t('title')}
      </Typography>

      <AiDraftSelector
        selected={selected}
        onSelect={setSelected}
      />

      {selected && (
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label={
            isLoading ? t('generating') : t('generate')
          }
          startIcon={
            isLoading
              ? <CircularProgress size={16} />
              : null
          }
          sx={{ mb: 2 }}
        >
          {isLoading ? t('generating') : t('generate')}
        </Button>
      )}

      {data?.content && (
        <AiDraftResult content={data.content} />
      )}
    </Box>
  );
};

export default AiDocumentDrafter;
