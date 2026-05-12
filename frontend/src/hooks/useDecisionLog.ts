/**
 * State logic for the decision log UI.
 * @module hooks/useDecisionLog
 */
import { useState } from 'react';
import {
  useListDecisionsQuery,
  useCreateDecisionMutation,
  useUpdateDecisionMutation,
  useDeleteDecisionMutation,
} from '@/store/api/decisionsApi';
import type {
  Decision,
  DecisionFormData,
} from '@/types/decisions';

const EMPTY: DecisionFormData = {
  title: '', context: '',
  options_considered: '', decision: '',
  rationale: '', planner_step_id: '', outcome: '',
};

/**
 * Encapsulates all state and mutations for the
 * decision log organism.
 *
 * @returns State, handlers, and query result.
 */
export function useDecisionLog() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] =
    useState(false);
  const [editing, setEditing] = useState<
    Decision | undefined
  >(undefined);
  const [form, setForm] =
    useState<DecisionFormData>(EMPTY);

  const { data = [], isLoading } =
    useListDecisionsQuery({ search });
  const [create] = useCreateDecisionMutation();
  const [update] = useUpdateDecisionMutation();
  const [remove] = useDeleteDecisionMutation();

  const openAdd = () => {
    setEditing(undefined);
    setForm(EMPTY);
    setDialogOpen(true);
  };

  const openEdit = (d: Decision) => {
    setEditing(d);
    setForm({
      title: d.title,
      context: d.context,
      options_considered: d.options_considered,
      decision: d.decision,
      rationale: d.rationale,
      planner_step_id: d.planner_step_id,
      outcome: d.outcome,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      void update({ id: editing.id, ...form });
    } else {
      void create(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    void remove(id);
  };

  return {
    search, setSearch,
    dialogOpen, setDialogOpen,
    editing, form, setForm,
    data, isLoading,
    openAdd, openEdit, handleSave, handleDelete,
  };
}
