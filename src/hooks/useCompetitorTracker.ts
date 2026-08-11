'use client';

/**
 * @brief ViewModel for the CompetitorTracker organism.
 * @module hooks/useCompetitorTracker
 */
import { useState } from 'react';
import {
  useListCompetitorsQuery,
  useDeleteCompetitorMutation,
} from '@/store/api/marketResearchCompetitorApi';
import type { Competitor } from '@/types/marketResearch';

/**
 * Provides competitor list, delete action, and
 * add/edit dialog state for CompetitorTracker.
 *
 * @returns Competitor tracker state and handlers.
 */
export function useCompetitorTracker() {
  const { data = [], isLoading } =
    useListCompetitorsQuery();
  const [deleteCompetitor] =
    useDeleteCompetitorMutation();
  const [dialogOpen, setDialogOpen] =
    useState(false);
  const [editing, setEditing] =
    useState<Competitor | undefined>(undefined);

  const openAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (c: Competitor) => {
    setEditing(c);
    setDialogOpen(true);
  };
  const handleDelete = (id: string) => {
    void deleteCompetitor(id);
  };

  return {
    data, isLoading,
    dialogOpen, setDialogOpen,
    editing, openAdd, openEdit, handleDelete,
  };
}
