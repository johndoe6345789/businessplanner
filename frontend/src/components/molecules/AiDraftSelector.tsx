'use client';

/**
 * Card-button selector for AI document types.
 * @module components/molecules/AiDraftSelector
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Card from '@shared/m3/Card';
import CardActionArea
  from '@shared/m3/CardActionArea';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import type { DocumentType }
  from '@/store/api/aiApi';

/** Document type option metadata. */
interface DocOption {
  type: DocumentType;
  labelKey: string;
}

const DOC_OPTIONS: DocOption[] = [
  { type: 'pitch_deck',      labelKey: 'pitchDeck' },
  { type: 'investor_update', labelKey: 'investorUpdate' },
  { type: 'nda',             labelKey: 'nda' },
  { type: 'job_description', labelKey: 'jobDescription' },
];

/** Props for AiDraftSelector. */
export interface AiDraftSelectorProps {
  /** Currently selected document type or null. */
  selected: DocumentType | null;
  /** Called when a type card is clicked. */
  onSelect: (type: DocumentType) => void;
}

/**
 * Grid of four document-type card buttons.
 */
export const AiDraftSelector: React.FC<
  AiDraftSelectorProps
> = ({ selected, onSelect }) => {
  const t = useTranslations('aiDocs');

  return (
    <Box
      aria-live="polite"
      sx={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 1.5,
        mb: 2,
      }}
    >
      {DOC_OPTIONS.map(({ type, labelKey }) => (
        <Card
          key={type}
          variant={
            selected === type
              ? 'elevation'
              : 'outlined'
          }
          sx={{
            outline: selected === type
              ? '2px solid'
              : 'none',
            outlineColor: 'primary.main',
          }}
        >
          <CardActionArea
            onClick={() => onSelect(type)}
            data-testid={`doc-type-${type}`}
            aria-label={t(labelKey as never)}
            aria-pressed={selected === type}
            sx={{ p: 1.5 }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              align="center"
            >
              {t(labelKey as never)}
            </Typography>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default AiDraftSelector;
