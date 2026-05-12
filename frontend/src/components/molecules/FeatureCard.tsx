'use client';

/**
 * Compact card molecule for a scoped feature.
 * @module components/molecules/FeatureCard
 */
import React from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { FeatureCardActions }
  from './FeatureCardActions';
import type {
  ScopedFeature, FeatureStatus,
} from '@/types/scoping';

/** Props for FeatureCard. */
export interface FeatureCardProps {
  readonly feature: ScopedFeature;
  readonly onEdit: (f: ScopedFeature) => void;
  readonly onDelete: (id: string) => void;
  readonly onStatus: (
    id: string, status: FeatureStatus) => void;
}

/**
 * Compact feature card with ICE scores and actions.
 * @param props - FeatureCardProps.
 * @returns Feature card UI.
 */
export const FeatureCard: React.FC<FeatureCardProps> = (
  { feature, onEdit, onDelete, onStatus },
) => {
  const t = useTranslations('scoping');
  return (
    <Card
      data-testid={`feature-card-${feature.id}`}
      aria-label={feature.title}
      sx={{ mb: 1, width: '100%' }}>
      <CardContent sx={{ pb: '8px !important' }}>
        <Box sx={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start' }}>
          <Typography variant="subtitle2"
            sx={{ fontWeight: 700, flex: 1, mr: 1 }}>
            {feature.title}
          </Typography>
          <Chip label={feature.ice_score}
            size="small" color="primary"
            aria-label={
              `${t('iceScore')} ${feature.ice_score}`}
            data-testid={
              `feature-card-${feature.id}-ice`} />
        </Box>
        <Typography variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' }}>
          {feature.description}
        </Typography>
        <Box sx={{ display: 'flex',
          gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={`I:${feature.impact}`}
            size="small" variant="outlined"
            aria-label={
              `${t('impact')} ${feature.impact}`} />
          <Chip label={`C:${feature.confidence}`}
            size="small" variant="outlined"
            aria-label={
              `${t('confidence')} ${feature.confidence}`
            } />
          <Chip label={`E:${feature.ease}`}
            size="small" variant="outlined"
            aria-label={
              `${t('ease')} ${feature.ease}`} />
        </Box>
        <FeatureCardActions feature={feature}
          onEdit={onEdit} onDelete={onDelete}
          onStatus={onStatus} />
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
