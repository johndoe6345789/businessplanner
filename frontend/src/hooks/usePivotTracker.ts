/**
 * State management hook for PivotTracker.
 * @module hooks/usePivotTracker
 */
import { useState } from 'react';
import {
  useListPivotsQuery,
  useCreatePivotMutation,
  useUpdatePivotMutation,
  useDeletePivotMutation,
} from '@/store/api/pivotApi';
import type { Pivot, PivotFormData } from '@/types/pivot';

/** Default empty pivot form. */
const EMPTY: PivotFormData = {
  original_idea: '',
  new_direction: '',
  trigger_event: '',
  rationale: '',
  plan_impact: '',
  pivoted_at: new Date().toISOString()
    .slice(0, 10),
};

/**
 * Manages CRUD state for the PivotTracker.
 * @returns Query data and dialog control handlers.
 */
export function usePivotTracker() {
  const { data = [], isLoading } =
    useListPivotsQuery();
  const [create] = useCreatePivotMutation();
  const [update] = useUpdatePivotMutation();
  const [remove] = useDeletePivotMutation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] =
    useState<Pivot | null>(null);
  const [form, setForm] =
    useState<PivotFormData>(EMPTY);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (p: Pivot) => {
    setEditing(p);
    const { id: _id, created_at: _c, ...rest } = p;
    setForm(rest);
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await update({ id: editing.id, ...form });
    } else {
      await create(form);
    }
    setOpen(false);
  };

  return {
    data, isLoading,
    open, setOpen,
    editing, form, setForm,
    openAdd, openEdit,
    handleSave,
    handleDelete: (id: string) => remove(id),
  };
}
