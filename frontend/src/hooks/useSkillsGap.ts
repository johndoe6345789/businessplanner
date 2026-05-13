'use client';

/**
 * @file useSkillsGap.ts
 * @brief Computes missing and strength skills for the
 *        user's startup type based on their stored
 *        skills profile.
 */
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useSkillsProfile } from './useSkillsProfile';
import skillsMap from
  '@/constants/startup-type-skills.json';

/** Shape of startup-type-skills.json entries. */
interface SkillSet {
  critical: string[];
  helpful: string[];
}

type SkillsMapType = Record<string, SkillSet>;

const SKILLS_MAP = skillsMap as SkillsMapType;

/** Return type for useSkillsGap. */
export interface UseSkillsGapReturn {
  /** All critical skills for the startup type. */
  recommendedSkills: string[];
  /** Critical skills not present in the user profile. */
  missingSkills: string[];
  /** User skills that match the critical list. */
  strengthSkills: string[];
}

/**
 * Computes skills gap between the user's profile and
 * the recommended critical skills for their startup
 * type.
 *
 * @returns Recommended, missing, and strength skills.
 */
export function useSkillsGap(): UseSkillsGapReturn {
  const selectedSlug = useAppSelector(
    (s) => s.startupType.selectedSlug,
  );
  const { profile } = useSkillsProfile();

  return useMemo((): UseSkillsGapReturn => {
    const empty: UseSkillsGapReturn = {
      recommendedSkills: [],
      missingSkills: [],
      strengthSkills: [],
    };

    if (!selectedSlug) return empty;

    const entry = SKILLS_MAP[selectedSlug];
    if (!entry) return empty;

    const userLower = profile.skills.map(
      (s) => s.toLowerCase(),
    );
    const recommendedSkills = entry.critical;

    const missingSkills = recommendedSkills.filter(
      (s) => !userLower.includes(s.toLowerCase()),
    );
    const strengthSkills = recommendedSkills.filter(
      (s) => userLower.includes(s.toLowerCase()),
    );

    return { recommendedSkills, missingSkills,
             strengthSkills };
  }, [selectedSlug, profile.skills]);
}
