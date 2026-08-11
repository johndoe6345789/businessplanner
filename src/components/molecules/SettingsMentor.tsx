'use client';

import React, { useState } from 'react';
import { Switch } from '@shared/m3';
import { useTranslations } from 'next-intl';
import {
  SettingsCard, SettingsRow,
} from '@/components/organisms/SettingsCard';
import apiConstants from '@/constants/api.json';

/**
 * Mentor opt-in toggle that calls PATCH /api/users/me/mentor.
 * Displayed as a card in the settings page.
 *
 * @returns Mentor settings card.
 */
const SettingsMentor: React.FC = () => {
  const t = useTranslations('mentor');
  const [isMentor, setIsMentor] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const next = !isMentor;
      await fetch(apiConstants.mentor, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_mentor: next }),
        credentials: 'include',
      });
      setIsMentor(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard testId="settings-mentor">
      <SettingsRow
        label={isMentor ? t('optOut') : t('optIn')}
      >
        <Switch
          checked={isMentor}
          disabled={loading}
          onChange={handleToggle}
          aria-label={
            isMentor ? t('optOut') : t('optIn')
          }
          data-testid="mentor-toggle"
        />
      </SettingsRow>
    </SettingsCard>
  );
};

export default SettingsMentor;
