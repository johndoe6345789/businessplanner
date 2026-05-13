'use client';

/**
 * @file SettingsEmailPrefs.tsx
 * @brief Email preferences section: opt-out switch for
 *        welcome drip and re-engagement sequences.
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Switch } from '@shared/m3/Switch';
import Typography from '@shared/m3/Typography';
import { SettingsCard, SettingsRow } from './SettingsCard';
import {
  useOptOutMutation,
} from '@/store/api/emailSequencesApi';

/**
 * Email preferences card shown in Settings.
 * Lets users opt out of marketing / drip emails.
 *
 * @returns Email preferences settings card.
 */
const SettingsEmailPrefs: React.FC = () => {
  const t = useTranslations('settings');
  const [subscribed, setSubscribed] = useState(true);
  const [optOut] = useOptOutMutation();

  const handleToggle = () => {
    const next = !subscribed;
    setSubscribed(next);
    if (!next) {
      void optOut().catch(() => { /* no-op */ });
    }
  };

  return (
    <SettingsCard testId="settings-email-prefs">
      <Typography
        variant="subtitle1" gutterBottom
        style={{ fontWeight: 600 }}
      >
        {t('emailPrefsTitle')}
      </Typography>
      <SettingsRow label={t('emailDripLabel')}>
        <Switch
          checked={subscribed}
          onChange={handleToggle}
          aria-label={t('emailDripLabel')}
          data-testid="email-drip-toggle"
        />
      </SettingsRow>
    </SettingsCard>
  );
};

export default SettingsEmailPrefs;
