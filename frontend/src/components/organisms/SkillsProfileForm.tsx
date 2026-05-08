'use client';

/**
 * @file SkillsProfileForm.tsx
 * @brief Form for role, skills tags, and qualifications
 *        text. Persists to localStorage via
 *        useSkillsProfile.
 */
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSkillsProfile }
  from '@/hooks/useSkillsProfile';
import { SkillTagInput }
  from '../molecules/SkillTagInput';
import {
  FIELD, LABEL, TEXT_INPUT, SAVE_BTN,
} from './SkillsProfileForm.styles';

/**
 * Role + skills + background form backed by
 * localStorage.
 */
export const SkillsProfileForm: React.FC = () => {
  const t = useTranslations('profile.skills');
  const { profile, save, addSkill, removeSkill }
    = useSkillsProfile();
  const [role, setRole] = useState('');
  const [background, setBackground] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRole(profile.role);
    setBackground(profile.background);
  }, [profile.role, profile.background]);

  const handleSave = () => {
    save({ skills: profile.skills, role, background });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      data-testid="skills-profile-form"
    >
      <div style={FIELD}>
        <label style={LABEL}>{t('roleLabel')}</label>
        <input
          style={TEXT_INPUT}
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder={t('rolePlaceholder')}
          data-testid="skills-role-input"
        />
      </div>
      <div style={FIELD}>
        <label style={LABEL}>{t('skillsLabel')}</label>
        <SkillTagInput
          skills={profile.skills}
          onAdd={addSkill}
          onRemove={removeSkill}
          placeholder={t('skillsPlaceholder')}
          label={t('skillsLabel')}
        />
      </div>
      <div style={FIELD}>
        <label style={LABEL}>{t('backgroundLabel')}</label>
        <textarea
          style={{ ...TEXT_INPUT, resize: 'vertical' as const, minHeight: 100 }}
          value={background}
          onChange={e => setBackground(e.target.value)}
          placeholder={t('backgroundPlaceholder')}
          data-testid="skills-background-input"
        />
      </div>
      <button
        type="button" style={SAVE_BTN}
        onClick={handleSave}
        data-testid="skills-save-btn"
      >
        {saved ? t('saved') : t('saveButton')}
      </button>
    </div>
  );
};

export default SkillsProfileForm;
