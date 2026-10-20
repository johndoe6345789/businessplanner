'use client';

import React from 'react';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';
import helpData from '@/constants/api-key-help.json';

/** Provider entry from api-key-help.json. */
interface ProviderHelp {
  helpText: string;
  prefix: string;
  docsUrl: string;
}

/** Known provider keys in the constants file. */
type KnownProvider = keyof typeof helpData;

/** Props for ApiKeyHelpText. */
export interface ApiKeyHelpTextProps {
  /** Provider identifier, e.g. 'anthropic' or 'openai'. */
  provider: string;
}

/**
 * Displays provider-specific help text for an API key input.
 * Falls back to a generic message for unknown providers.
 *
 * @param props - Component props.
 * @returns MUI Alert with help text.
 */
const ApiKeyHelpText: React.FC<ApiKeyHelpTextProps> = ({
  provider,
}) => {
  const t = useTranslations('apiKey');
  const known = Object.keys(helpData) as KnownProvider[];
  const isKnown = (p: string): p is KnownProvider =>
    known.includes(p as KnownProvider);

  const text = isKnown(provider)
    ? (helpData[provider] as ProviderHelp).helpText
    : t('helpGeneric');

  return (
    <Alert
      severity="info"
      data-testid={`api-key-help-${provider}`}
      aria-label={t('helpTitle')}
      sx={{ mb: 1 }}
    >
      {text}
    </Alert>
  );
};

export default ApiKeyHelpText;
