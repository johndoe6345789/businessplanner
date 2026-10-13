'use client';

/**
 * Card displaying a customer persona summary.
 * @module components/molecules/PersonaCard
 */
import React from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import Box from '@shared/m3/Box';
import IconButton from '@shared/m3/IconButton';
import { useTranslations } from 'next-intl';
import type { Persona } from '@/types/marketResearch';

const PREVIEW_LIMIT = 3;

/** Props for PersonaCard. */
export interface PersonaCardProps {
  /** Persona data to display. */
  persona: Persona;
  /** Called when the card is activated for editing. */
  onEdit: (p: Persona) => void;
  /** When given, the card shows a delete button. */
  onDelete?: (p: Persona) => void;
}

/**
 * Clickable card showing name, role, pain points
 * and goals previews.
 *
 * @param props - Component props.
 * @returns PersonaCard UI.
 */
export const PersonaCard: React.FC<PersonaCardProps> = (
  { persona: p, onEdit, onDelete },
) => {
  const t = useTranslations('marketResearch');
  return (
  <Card
    data-testid={`persona-card-${p.id}`}
    onClick={() => onEdit(p)}
    sx={{ width: 260, cursor: 'pointer' }}
    role="button"
    aria-label={p.name}
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onEdit(p)}
  >
    <CardContent>
      <Box sx={{ display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start' }}>
        <Typography variant="h6"
          sx={{ fontWeight: 700 }}>
          {p.name}
        </Typography>
        {onDelete && (
          <IconButton size="small"
            aria-label={t('deletePersona')}
            data-testid={`persona-delete-${p.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(p);
            }}
            onKeyDown={(e) => e.stopPropagation()}>
            <span aria-hidden>✕</span>
          </IconButton>
        )}
      </Box>
      <Typography variant="body2"
        color="text.secondary" sx={{ mb: 1 }}>
        {p.role}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5,
        flexWrap: 'wrap', mb: 1 }}>
        {p.painPoints.slice(0, PREVIEW_LIMIT)
          .map((pp, i) => (
            <Chip key={i} label={pp} size="small"
              color="error" variant="outlined" />
          ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5,
        flexWrap: 'wrap' }}>
        {p.goals.slice(0, PREVIEW_LIMIT)
          .map((g, i) => (
            <Chip key={i} label={g} size="small"
              color="success" variant="outlined" />
          ))}
      </Box>
    </CardContent>
  </Card>
  );
};

export default PersonaCard;
