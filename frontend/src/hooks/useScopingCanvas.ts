/**
 * State and API logic for ProductScopingCanvas.
 * @module hooks/useScopingCanvas
 */
import { useState } from 'react';
import {
  useListFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} from '@/store/api/scopingApi';
import { useIceCompute } from './useIceCompute';
import type {
  ScopedFeature, FeatureStatus,
  ScopedFeatureFormData,
} from '@/types/scoping';

/** Return type of useScopingCanvas. */
export interface UseScopingCanvasReturn {
  ranked: ScopedFeature[];
  isLoading: boolean;
  dialogOpen: boolean;
  editing: ScopedFeature | undefined;
  openAdd: () => void;
  openEdit: (f: ScopedFeature) => void;
  closeDialog: () => void;
  handleStatus: (
    id: string, status: FeatureStatus) => void;
  handleSubmit: (d: ScopedFeatureFormData) => void;
  handleDelete: (id: string) => void;
}

/**
 * Encapsulates CRUD state and mutations for the canvas.
 * @returns Canvas state and action handlers.
 */
export function useScopingCanvas():
  UseScopingCanvasReturn {
  const { data = [], isLoading } =
    useListFeaturesQuery();
  const [create] = useCreateFeatureMutation();
  const [update] = useUpdateFeatureMutation();
  const [remove] = useDeleteFeatureMutation();
  const ranked = useIceCompute(data);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] =
    useState<ScopedFeature | undefined>(undefined);

  const openAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (f: ScopedFeature) => {
    setEditing(f);
    setDialogOpen(true);
  };
  const closeDialog = () => setDialogOpen(false);

  const handleStatus = (
    id: string, status: FeatureStatus,
  ) => {
    const f = data.find((x) => x.id === id);
    if (!f) return;
    void update({ id, ...f, status });
  };

  const handleSubmit = (d: ScopedFeatureFormData) => {
    if (editing) {
      void update({ id: editing.id, ...d });
    } else {
      void create(d);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) =>
    void remove(id);

  return {
    ranked, isLoading, dialogOpen, editing,
    openAdd, openEdit, closeDialog,
    handleStatus, handleSubmit, handleDelete,
  };
}
