'use client';

/**
 * @brief ViewModel for the PersonaBoard organism.
 * @module hooks/usePersonaBoard
 */
import { useState } from 'react';
import {
  useListPersonasQuery,
} from '@/store/api/marketResearchPersonaApi';
import type { Persona } from '@/types/marketResearch';

/**
 * Provides persona list state and dialog handlers
 * for the PersonaBoard organism.
 *
 * @returns Persona data and add/edit dialog state.
 */
export function usePersonaBoard() {
  const { data = [], isLoading } =
    useListPersonasQuery();
  const [dialogOpen, setDialogOpen] =
    useState(false);
  const [editing, setEditing] =
    useState<Persona | undefined>(undefined);

  const openAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (p: Persona) => {
    setEditing(p);
    setDialogOpen(true);
  };

  return {
    data, isLoading,
    dialogOpen, setDialogOpen,
    editing, openAdd, openEdit,
  };
}
