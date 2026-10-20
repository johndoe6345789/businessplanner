'use client';

/**
 * @file useSkillsProfile.ts
 * @brief Persists the user's skills & qualifications
 *        to localStorage.  Drop-in replaceable with a
 *        server API by swapping the read/write helpers.
 */
import {
  useState, useEffect, useCallback,
} from 'react';

const STORAGE_KEY = 'launchpad_skills';

/** User's skills and qualifications profile. */
export interface SkillsProfile {
  /** List of skill tags (e.g. "React", "Finance"). */
  skills: string[];
  /** Free-text background / qualifications summary. */
  background: string;
  /** Role in the venture (e.g. "Solo founder"). */
  role: string;
}

const DEFAULT: SkillsProfile = {
  skills: [], background: '', role: '',
};

function readStorage(): SkillsProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? (JSON.parse(raw) as SkillsProfile)
      : DEFAULT;
  } catch { return DEFAULT; }
}

function writeStorage(p: SkillsProfile): void {
  try {
    localStorage.setItem(
      STORAGE_KEY, JSON.stringify(p),
    );
  } catch { /* quota exceeded — ignore */ }
}

/** Return type for useSkillsProfile. */
export interface UseSkillsProfileReturn {
  profile: SkillsProfile;
  save: (next: SkillsProfile) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
}

/**
 * Read/write skills profile from localStorage.
 *
 * @returns Profile state and mutators.
 */
export function useSkillsProfile():
UseSkillsProfileReturn {
  const [profile, setProfile] =
    useState<SkillsProfile>(DEFAULT);

  useEffect(() => { setProfile(readStorage()); }, []);

  const save = useCallback((next: SkillsProfile) => {
    setProfile(next);
    writeStorage(next);
  }, []);

  const addSkill = useCallback((raw: string) => {
    const skill = raw.trim();
    if (!skill) return;
    setProfile(prev => {
      if (prev.skills.includes(skill)) return prev;
      const next = {
        ...prev, skills: [...prev.skills, skill],
      };
      writeStorage(next);
      return next;
    });
  }, []);

  const removeSkill = useCallback((skill: string) => {
    setProfile(prev => {
      const next = {
        ...prev,
        skills: prev.skills.filter(s => s !== skill),
      };
      writeStorage(next);
      return next;
    });
  }, []);

  return { profile, save, addSkill, removeSkill };
}
