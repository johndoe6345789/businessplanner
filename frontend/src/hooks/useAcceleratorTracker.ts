/**
 * State management hook for AcceleratorTracker.
 * @module hooks/useAcceleratorTracker
 */
import { useState } from 'react';
import {
  useListAcceleratorsQuery,
  useCreateAcceleratorMutation,
  useUpdateAcceleratorMutation,
  useDeleteAcceleratorMutation,
} from '@/store/api/acceleratorsApi';
import type {
  Accelerator,
  AcceleratorFormData,
} from '@/types/accelerators';

/** Default empty form state. */
const EMPTY: AcceleratorFormData = {
  name: '',
  programme_type: 'accelerator',
  website: '',
  deadline: null,
  status: 'researching',
  notes: '',
  equity_pct: null,
  funding_gbp: null,
};

/**
 * Manages CRUD state for the AcceleratorTracker.
 * @returns Query data and dialog control handlers.
 */
export function useAcceleratorTracker() {
  const { data = [], isLoading, isError } =
    useListAcceleratorsQuery();
  const [create] = useCreateAcceleratorMutation();
  const [update] = useUpdateAcceleratorMutation();
  const [remove] = useDeleteAcceleratorMutation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] =
    useState<Accelerator | null>(null);
  const [form, setForm] =
    useState<AcceleratorFormData>(EMPTY);
  const [saveError, setSaveError] =
    useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (a: Accelerator) => {
    setEditing(a);
    const {
      id: _i, created_at: _c,
      updated_at: _u, ...rest
    } = a;
    setForm(rest);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      if (editing) {
        await update({
          id: editing.id, ...form,
        }).unwrap();
      } else {
        await create(form).unwrap();
      }
      setOpen(false);
    } catch {
      setSaveError('Failed to save. Try again.');
    }
  };

  return {
    data, isLoading, isError, saveError,
    open, setOpen,
    editing, form, setForm,
    openAdd, openEdit,
    handleSave,
    handleDelete: (id: string) => remove(id),
  };
}
