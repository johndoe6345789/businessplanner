/**
 * @file useRiskForm.ts
 * @brief Form state and submit handler for
 *        adding a new risk to the register.
 */
import { useState } from 'react';
import type {
  RiskCategory,
  RiskRating,
  RiskStatus,
} from '@/types/riskAssessment';
import {
  useCreateRiskMutation,
} from '@/store/api/riskAssessmentApi';

/** Shape returned by useRiskForm. */
export interface RiskFormState {
  title: string;
  setTitle: (v: string) => void;
  category: RiskCategory;
  setCategory: (v: RiskCategory) => void;
  probability: RiskRating;
  setProbability: (v: RiskRating) => void;
  impact: RiskRating;
  setImpact: (v: RiskRating) => void;
  owner: string;
  setOwner: (v: string) => void;
  isLoading: boolean;
  handleSubmit: (
    e: React.FormEvent,
  ) => Promise<void>;
}

/**
 * Manages add-risk form state and submit.
 *
 * @returns Form state and submit handler.
 */
export function useRiskForm(): RiskFormState {
  const [create, { isLoading }] =
    useCreateRiskMutation();
  const [title, setTitle] = useState('');
  const [category, setCategory] =
    useState<RiskCategory>('market');
  const [probability, setProbability] =
    useState<RiskRating>(3);
  const [impact, setImpact] =
    useState<RiskRating>(3);
  const [owner, setOwner] = useState('');

  const handleSubmit = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    if (!title.trim()) return;
    await create({
      title, category,
      description: '',
      probability, impact,
      mitigation_strategy: '',
      owner,
      status: 'open' as RiskStatus,
    });
    setTitle('');
    setOwner('');
  };

  return {
    title, setTitle, category, setCategory,
    probability, setProbability,
    impact, setImpact, owner, setOwner,
    isLoading, handleSubmit,
  };
}
