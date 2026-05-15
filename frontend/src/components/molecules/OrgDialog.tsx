'use client';

/**
 * Add / edit dialog for an organisation record.
 * @module components/molecules/OrgDialog
 */
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent
  from '@mui/material/DialogContent';
import DialogActions
  from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import type { OrgFormData, EntityType }
  from '@/types/organisations';
import { ENTITY_TYPE_LABELS }
  from '@/types/organisations';

const ALL_TYPES =
  Object.keys(ENTITY_TYPE_LABELS) as EntityType[];

/** Props for OrgDialog. */
interface OrgDialogProps {
  readonly open: boolean;
  readonly isEdit: boolean;
  readonly form: OrgFormData;
  readonly onFormChange: (f: OrgFormData) => void;
  readonly onSave: () => void;
  readonly onClose: () => void;
}

/**
 * Modal dialog for creating or editing an org.
 * @param props - OrgDialog props.
 * @returns Dialog element.
 */
export const OrgDialog: React.FC<OrgDialogProps> = ({
  open, isEdit, form, onFormChange, onSave, onClose,
}) => {
  const t = useTranslations('companies');
  const set = (k: keyof OrgFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onFormChange({ ...form, [k]: e.target.value });
  return (
    <Dialog open={open} onClose={onClose}
      fullWidth maxWidth="sm"
      data-testid="org-dialog">
      <DialogTitle>
        {isEdit ? t('editOrg') : t('addOrg')}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex',
        flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField label={t('name')} required
          value={form.name} onChange={set('name')} />
        <TextField label={t('website')}
          value={form.website}
          onChange={set('website')} />
        <TextField label={t('description')}
          value={form.description}
          onChange={set('description')} multiline />
        <FormControl>
          <InputLabel>{t('types')}</InputLabel>
          <Select multiple label={t('types')}
            value={form.entity_types}
            onChange={(e) => onFormChange({
              ...form,
              entity_types:
                e.target.value as EntityType[],
            })}>
            {ALL_TYPES.map((k) => (
              <MenuItem key={k} value={k}>
                {ENTITY_TYPE_LABELS[k]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label={t('notes')}
          value={form.notes}
          onChange={set('notes')} multiline />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button variant="contained"
          onClick={onSave}
          data-testid="org-save-btn">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrgDialog;
