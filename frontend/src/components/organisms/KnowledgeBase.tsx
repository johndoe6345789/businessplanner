'use client';

import React, { useState } from 'react';
import Grid from '@shared/m3/Grid';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import CircularProgress
  from '@shared/m3/CircularProgress';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/store/hooks';
import {
  useListKbArticlesQuery,
} from '@/store/api/knowledgeApi';
import {
  KbFilterChips,
  type KbFilter,
} from '@/components/molecules/KbFilterChips';
import KbArticleCard
  from '@/components/molecules/KbArticleCard';
import type { KbArticle } from '@/types/knowledge';

/**
 * Full knowledge-base browser organism.
 * Reads the user's startup type from Redux and fetches
 * matching articles; supports inline kbType filtering.
 *
 * @returns Knowledge base UI element.
 */
export const KnowledgeBase: React.FC = () => {
  const t = useTranslations('knowledge');
  const [filter, setFilter] = useState<KbFilter>('all');

  const selectedSlug = useAppSelector(
    (s) => s.startupType.selectedSlug,
  );

  const { data, isLoading } = useListKbArticlesQuery({
    startupType: selectedSlug ?? undefined,
  });

  const articles: KbArticle[] = (data ?? []).filter(
    (a) => filter === 'all' || a.kbType === filter,
  );

  const emptyKey = selectedSlug ? 'emptyType' : 'empty';

  return (
    <Box data-testid="knowledge-base">
      <Box sx={{ mb: 2 }}>
        <KbFilterChips
          active={filter}
          onChange={setFilter}
        />
      </Box>

      {isLoading && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 6,
        }}>
          <CircularProgress aria-label={t('title')} />
        </Box>
      )}

      {!isLoading && articles.length === 0 && (
        <Typography
          color="text.secondary"
          data-testid="kb-empty"
        >
          {t(emptyKey)}
        </Typography>
      )}

      {!isLoading && articles.length > 0 && (
        <Grid container spacing={2}>
          {articles.map((article) => (
            <Grid
              key={article.id}
              item
              xs={12}
              sm={6}
              md={4}
            >
              <KbArticleCard article={article} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default KnowledgeBase;
