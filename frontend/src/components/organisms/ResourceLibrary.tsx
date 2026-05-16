'use client';

/**
 * Resource library organism with category filter.
 * @module components/organisms/ResourceLibrary
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Chip from '@shared/m3/Chip';
import Grid from '@mui/material/Grid';
import { useTranslations } from 'next-intl';
import libraryData from '@/constants/resource-library.json';
import {
  ResourceCard,
} from '@/components/molecules/ResourceCard';
import type { ResourceEntry } from
  '@/components/molecules/ResourceCard';

const ALL = 'all';

const CATEGORIES = [
  ALL,
  'legal',
  'finance',
  'fundraising',
  'hiring',
  'strategy',
] as const;

type CategoryFilter = typeof CATEGORIES[number];

/** Typed resource library data. */
interface LibraryData {
  resources: ResourceEntry[];
}

/**
 * Displays all downloadable resources with category
 * filter chips at the top.
 *
 * @returns Resource library UI.
 */
export const ResourceLibrary: React.FC = () => {
  const t = useTranslations('resources');
  const [active, setActive] =
    useState<CategoryFilter>(ALL);

  const resources = (libraryData as LibraryData).resources;
  const filtered = active === ALL
    ? resources
    : resources.filter((r) => r.category === active);

  return (
    <Box
      data-testid="resource-library"
      aria-label={t('title')}
    >
      <Box
        role="toolbar"
        aria-label={t('allCategories')}
        sx={{ display: 'flex', flexWrap: 'wrap',
          gap: 1, mb: 3 }}
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat === ALL
              ? t('allCategories') : cat}
            onClick={() => setActive(cat)}
            color={active === cat
              ? 'primary' : 'default'}
            variant={active === cat
              ? 'filled' : 'outlined'}
            aria-pressed={active === cat}
            data-testid={`resource-filter-${cat}`}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {filtered.map((resource) => (
          <Grid
            key={resource.id}
            item xs={12} sm={6} md={4}
          >
            <ResourceCard resource={resource} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResourceLibrary;
