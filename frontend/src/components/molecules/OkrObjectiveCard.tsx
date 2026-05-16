'use client';

import React, { useState } from 'react';
import {
  Card, CardContent, CardActions,
  Typography, Chip, Button, IconButton, Collapse, Box,
} from '@shared/m3';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslations } from 'next-intl';
import type {
  OkrObjective, AddKeyResultInput,
} from '@/types/okr';
import OkrKeyResultRow
  from '@/components/molecules/OkrKeyResultRow';
import OkrAddKrInline
  from '@/components/molecules/OkrAddKrInline';

/** Props for OkrObjectiveCard. */
export interface OkrObjectiveCardProps {
  readonly objective: OkrObjective;
  readonly onAddKr: (
    input: { objectiveId: string } & AddKeyResultInput,
  ) => void;
  readonly onDeleteObjective: (id: string) => void;
  readonly onDeleteKr: (id: string) => void;
}

/** Card showing an OKR objective with key results. */
const OkrObjectiveCard: React.FC<
  OkrObjectiveCardProps
> = ({ objective, onAddKr,
       onDeleteObjective, onDeleteKr }) => {
  const t = useTranslations('okr');
  const [adding, setAdding] = useState(false);

  return (
    <Card data-testid={`okr-obj-card-${objective.id}`}>
      <CardContent>
        <Box sx={{ display:'flex', justifyContent:'space-between' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {objective.title}
          </Typography>
          <Chip size="small"
            label={t(
              `objective.status.${objective.status}`)}
            color={
              objective.status === 'completed'
                ? 'success' : 'primary'} />
        </Box>
        {objective.key_results.map((kr) => (
          <OkrKeyResultRow key={kr.id} kr={kr}
            onDelete={onDeleteKr} />
        ))}
        <Collapse in={adding}>
          <OkrAddKrInline
            objectiveId={objective.id}
            onAdd={onAddKr} />
        </Collapse>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<AddIcon />}
          data-testid={`okr-kr-add-btn-${objective.id}`}
          aria-label={t('addKeyResult')}
          onClick={() => setAdding((v) => !v)}>
          {t('addKeyResult')}
        </Button>
        <IconButton size="small"
          aria-label={t('deleteObjective')}
          data-testid={`okr-obj-delete-${objective.id}`}
          onClick={() =>
            onDeleteObjective(objective.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default OkrObjectiveCard;
