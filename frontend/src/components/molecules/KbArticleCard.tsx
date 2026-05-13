'use client';

import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
} from '@shared/m3';
import { Chip } from '@shared/m3';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import type { KbArticle } from '@/types/knowledge';
import KbFeedbackBar from './KbFeedbackBar';

/** Props for KbArticleCard. */
export interface KbArticleCardProps {
  /** Article data to display. */
  article: KbArticle;
  /** Optional click handler. */
  onClick?: () => void;
}

/**
 * Card representing a single knowledge-base article.
 * Shows title, kbType chip, optional stage chip, and tags.
 *
 * @param props - Component props.
 * @returns Article card element.
 */
export const KbArticleCard: React.FC<
  KbArticleCardProps
> = ({ article, onClick }) => (
  <Card
    data-testid="kb-article-card"
    aria-label={article.title}
  >
    <CardActionArea onClick={onClick}>
      <CardContent>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
        >
          {article.title}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          sx={{ mb: article.tags.length ? 1 : 0 }}
        >
          <Chip
            label={article.kbType}
            size="small"
            color="primary"
            variant="outlined"
          />
          {article.stage && (
            <Chip
              label={article.stage}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
        {article.tags.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
          }}>
            {article.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="filled"
              />
            ))}
          </Box>
        )}
        <KbFeedbackBar articleId={article.id} />
      </CardContent>
    </CardActionArea>
  </Card>
);

export default KbArticleCard;
