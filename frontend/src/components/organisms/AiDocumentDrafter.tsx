'use client';

/**
 * AI document drafting organism.
 * @module components/organisms/AiDocumentDrafter
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import CircularProgress from '@shared/m3/CircularProgress';
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
import { AiErrorCard }
  from '@/components/atoms/AiErrorCard';

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

  const [draft, { data, isLoading, isError }] =
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

  const btnLabel = isLoading ? t('generating') : t('generate');

  return (
    <Box data-testid="ai-document-drafter">
      <AiDraftSelector
        selected={selected}
        onSelect={setSelected}
      />
      {!selected && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {t('selectHint')}
        </Typography>
      )}
      {selected && (
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label={btnLabel}
          startIcon={
            isLoading ? <CircularProgress size={16} /> : null
          }
          sx={{ mb: 2 }}
        >
          {btnLabel}
        </Button>
      )}
      {isError && (
        <AiErrorCard message={t('generateError')} />
      )}
      {data?.content && (
        <AiDraftResult content={data.content} />
      )}
    </Box>
  );
};

export default AiDocumentDrafter;
