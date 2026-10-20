'use client';

/**
 * Hook for the launch execution checklist.
 * Merges default items with startup-type-specific items
 * and persists completion state in localStorage.
 * @module hooks/useLaunchChecklist
 */
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import data from '@/constants/launch-checklists.json';
import type {
  ChecklistData,
  ChecklistItem,
  UseLaunchChecklistReturn,
} from './useLaunchChecklistTypes';

const STORAGE_KEY = 'launchChecklist-anon';

/**
 * Build a localStorage key scoped to the user when possible.
 *
 * @param userId - Optional authenticated user id.
 * @returns Storage key string.
 */
function storageKey(userId?: string | null): string {
  return userId ? `launchChecklist-${userId}` : STORAGE_KEY;
}

/**
 * Merge default checklist items with type-specific extras.
 * Type-specific items are appended; ids are deduplicated.
 *
 * @param slug - Selected startup type slug.
 * @returns Merged array of checklist items.
 */
function mergeItems(slug: string | null): ChecklistItem[] {
  const typedData = data as ChecklistData;
  const defaults = typedData.default ?? [];
  const extras =
    slug && typedData[slug] ? typedData[slug] : [];
  const seen = new Set(defaults.map((i) => i.id));
  const unique = extras.filter((i) => !seen.has(i.id));
  return [...defaults, ...unique];
}

/**
 * Provides merged launch checklist items, persisted
 * completion state in localStorage, and a toggle action.
 *
 * @returns Items, completion map, and toggle function.
 */
export function useLaunchChecklist(): UseLaunchChecklistReturn {
  const slug = useAppSelector(
    (s) => s.startupType.selectedSlug,
  );
  const items = mergeItems(slug);
  const key = storageKey();

  const [completed, setCompleted] = useState<
    Record<string, boolean>
  >(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(key);
      return raw
        ? (JSON.parse(raw) as Record<string, boolean>)
        : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(completed));
    } catch { /* quota exceeded — ignore */ }
  }, [completed, key]);

  const toggleItem = useCallback((id: string) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  return { items, completed, toggleItem };
}

export type {
  ChecklistItem,
  ChecklistCategory,
  ChecklistPriority,
  UseLaunchChecklistReturn,
} from './useLaunchChecklistTypes';
