/**
 * State management hook for the OrganisationRegistry.
 * @module hooks/useOrganisations
 */
import { useState } from 'react';
import {
  useListOrganisationsQuery,
  useCreateOrganisationMutation,
  useUpdateOrganisationMutation,
  useDeleteOrganisationMutation,
} from '@/store/api/organisationsApi';
import type {
  Organisation,
  OrgFormData,
} from '@/types/organisations';
import { EMPTY_ORG } from '@/types/organisations';

/**
 * Manages CRUD state for OrganisationRegistry.
 * @returns Query data and dialog control handlers.
 */
export function useOrganisations() {
  const [search, setSearch] = useState('');
  const { data = [], isLoading, isError } =
    useListOrganisationsQuery(search || undefined);
  const [create] = useCreateOrganisationMutation();
  const [update] = useUpdateOrganisationMutation();
  const [remove] = useDeleteOrganisationMutation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] =
    useState<Organisation | null>(null);
  const [form, setForm] =
    useState<OrgFormData>(EMPTY_ORG);
  const [saveError, setSaveError] =
    useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_ORG);
    setOpen(true);
  };

  const openEdit = (org: Organisation) => {
    setEditing(org);
    const {
      id: _i, user_id: _u,
      created_at: _c, updated_at: _up,
      ...rest
    } = org;
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
    data, isLoading, isError,
    search, setSearch,
    open, setOpen,
    editing, form, setForm,
    saveError, openAdd, openEdit,
    handleSave,
    handleDelete: (id: string) => remove(id),
  };
}
