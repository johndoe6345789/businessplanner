'use client';

/**
 * @brief ViewModel for the DiscoveryLog organism.
 * @module hooks/useDiscoveryLog
 */
import { useState } from 'react';
import {
  useListDiscoveryQuery,
  useDeleteDiscoveryEntryMutation,
} from '@/store/api/marketResearchDiscoveryApi';

/**
 * Provides sorted discovery entries, delete action,
 * and dialog open state for the DiscoveryLog organism.
 *
 * @returns Discovery log state and handlers.
 */
export function useDiscoveryLog() {
  const { data = [], isLoading } =
    useListDiscoveryQuery();
  const [deleteEntry] =
    useDeleteDiscoveryEntryMutation();
  const [dialogOpen, setDialogOpen] =
    useState(false);

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );

  return {
    sorted, isLoading,
    dialogOpen, setDialogOpen, deleteEntry,
  };
}
