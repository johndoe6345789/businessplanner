'use client';

/**
 * Revenue model description card molecule.
 * @module components/molecules/RevenueModelCard
 */
import React from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import revenueModels from
  '@/constants/revenue-models.json';
import type { RevenueModel } from '@/types/financials';

/** Props for RevenueModelCard. */
export interface RevenueModelCardProps {
  /** Currently selected revenue model key. */
  selected: RevenueModel;
}

/**
 * Shows name, description, and examples for a model.
 * @param props - RevenueModelCardProps.
 * @returns RevenueModelCard UI.
 */
export const RevenueModelCard: React.FC<
  RevenueModelCardProps
> = ({ selected }) => {
  const info = revenueModels[selected];
  return (
    <Card sx={{ mt: 2 }}
      data-testid="revenue-model-desc-card">
      <CardContent>
        <Typography variant="h6">
          {info.name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {info.description}
        </Typography>
        <Typography variant="caption"
          color="text.secondary">
          Examples: {info.examples.join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RevenueModelCard;
