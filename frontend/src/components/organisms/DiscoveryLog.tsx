'use client';

/**
 * Discovery log organism — chronological list of
 * customer interview entries.
 * @module components/organisms/DiscoveryLog
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import Divider from '@shared/m3/Divider';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import {
  useListDiscoveryQuery,
  useDeleteDiscoveryEntryMutation,
} from '@/store/api/marketResearchDiscoveryApi';
import { DiscoveryEntryForm }
  from '@/components/molecules/DiscoveryEntryForm';

/**
 * Chronological discovery log with log-interview dialog.
 * @returns DiscoveryLog UI.
 */
export const DiscoveryLog: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const { data = [], isLoading } = useListDiscoveryQuery();
  const [deleteEntry] = useDeleteDiscoveryEntryMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  const sorted = [...data].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );

  return (
    <Box data-testid="discovery-log"
      aria-label={t('discovery')}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained"
          onClick={() => setDialogOpen(true)}
          aria-label={t('logInterview')}
          data-testid="discovery-log-btn">
          {t('logInterview')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
        {sorted.map((entry, idx) => (
          <Box key={entry.id}
            data-testid={`discovery-entry-${entry.id}`}>
            <Box sx={{ display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle1"
                  sx={{ fontWeight: 700 }}>
                  {entry.contactName}
                </Typography>
                <Typography variant="caption"
                  color="text.secondary">
                  {entry.date}
                </Typography>
              </Box>
              <Button size="small"
                onClick={() =>
                  void deleteEntry(entry.id)}
                aria-label={tc('delete')}
                data-testid={
                  `discovery-delete-${entry.id}`}
                color="error">
                {tc('delete')}
              </Button>
            </Box>
            <Typography variant="body2"
              sx={{ mt: 1, mb: 1 }}>
              {entry.keyFindings}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1,
              flexWrap: 'wrap' }}>
              {entry.validatedAssumptions.map(
                (v, i) => (
                  <Chip key={i} label={v} size="small"
                    color="success" variant="outlined" />
                ))}
              {entry.invalidatedAssumptions.map(
                (v, i) => (
                  <Chip key={i} label={v} size="small"
                    color="error" variant="outlined" />
                ))}
            </Box>
            {idx < sorted.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Box>
      <Dialog open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-label={t('logInterview')}
        data-testid="discovery-dialog"
        maxWidth="sm" fullWidth>
        <DialogTitle>{t('logInterview')}</DialogTitle>
        <DialogContent
          style={{ overscrollBehavior: 'contain' }}>
          <DiscoveryEntryForm
            onDone={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DiscoveryLog;
