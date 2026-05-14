'use client';

/**
 * @file SkillsProfileForm.tsx
 * @brief Role + skills + background form backed by
 *        localStorage via useSkillsProfile.
 */
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import { TextField } from '@/components/atoms';
import Button from '@shared/m3/Button';
import { useSkillsProfile }
  from '@/hooks/useSkillsProfile';
import { SkillTagInput }
  from '../molecules/SkillTagInput';

/** Role + skills + background form. */
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
    <Box
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2.5 }}
      data-testid="skills-profile-form"
    >
      <TextField
        label={t('roleLabel')}
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder={t('rolePlaceholder')}
        testId="skills-role-input"
        inputProps={{
          'aria-label': t('roleLabel'),
        }}
      />
      <Box sx={{ display: 'flex',
        flexDirection: 'column', gap: 0.5 }}>
        <Box
          component="label"
          sx={{ fontSize: 13, fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em' }}
        >
          {t('skillsLabel')}
        </Box>
        <SkillTagInput
          skills={profile.skills}
          onAdd={addSkill}
          onRemove={removeSkill}
          placeholder={t('skillsPlaceholder')}
          label={t('skillsLabel')}
        />
      </Box>
      <TextField
        label={t('backgroundLabel')}
        value={background}
        onChange={(e) =>
          setBackground(e.target.value)}
        placeholder={t('backgroundPlaceholder')}
        testId="skills-background-input"
        multiline
        minRows={4}
        inputProps={{
          'aria-label': t('backgroundLabel'),
        }}
      />
      <Button variant="filled" onClick={handleSave}
        data-testid="skills-save-btn"
        aria-label={
          saved ? t('saved') : t('saveButton')}>
        {saved ? t('saved') : t('saveButton')}
      </Button>
    </Box>
  );
};

export default SkillsProfileForm;
