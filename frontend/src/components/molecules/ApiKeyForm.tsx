'use client';

import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@shared/m3/Typography';
import Select from '@shared/m3/inputs/Select';
import MenuItem from '@shared/m3/navigation/MenuItem';
import Button from '@shared/m3/Button';
import { TextField } from '../atoms';
import ApiKeyHelpText from './ApiKeyHelpText';
import helpData from '@/constants/api-key-help.json';

type KnownProvider = keyof typeof helpData;

/** A selectable model option. */
interface ModelOpt { value: string; label: string; }

/** Translated labels bundle for ApiKeyForm. */
interface ApiKeyLabels {
  apiKey: string; model: string;
  save: string; prefixWarning: string;
}

/** Props for ApiKeyForm. */
export interface ApiKeyFormProps {
  provider: string; label: string;
  models: ModelOpt[]; keyValue: string;
  setKey: (v: string) => void;
  model: string; setModel: (v: string) => void;
  onSave: () => void; labels: ApiKeyLabels;
}

/** Returns expected prefix for a provider, or undefined. */
function getPrefix(p: string): string | undefined {
  const known = Object.keys(helpData) as KnownProvider[];
  return known.includes(p as KnownProvider)
    ? helpData[p as KnownProvider].prefix
    : undefined;
}

/**
 * API key + model inline form with help text
 * and soft prefix-validation hint.
 */
const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  provider, label, models, keyValue,
  setKey, model, setModel, onSave, labels,
}) => {
  const prefix = getPrefix(provider);
  const showWarn = Boolean(prefix) &&
    keyValue.length > 0 &&
    !keyValue.startsWith(prefix as string);

  return (
    <div style={{ padding: '6px 0' }}
      data-testid={`key-form-${provider}`}>
      <Typography variant="body2" gutterBottom>
        {label}
      </Typography>
      <ApiKeyHelpText provider={provider} />
      <div style={{
        display: 'flex', gap: 8,
        alignItems: 'flex-end',
      }}>
        <div style={{ flex: 1 }}>
          <TextField
            label={labels.apiKey}
            value={keyValue}
            onChange={(e) => setKey(e.target.value)}
            testId={`input-key-${provider}`}
          />
          {showWarn && (
            <FormHelperText
              data-testid={`prefix-warn-${provider}`}>
              {labels.prefixWarning}
            </FormHelperText>
          )}
        </div>
        <Select label={labels.model} value={model}
          onChange={(e) =>
            setModel(String(e.target.value))}
          testId={`select-mdl-${provider}`}
          size="small">
          {models.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={onSave} disabled={!keyValue}
          data-testid={`save-key-${provider}`}
          aria-label={labels.save}>
          {labels.save}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyForm;
