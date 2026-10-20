'use client';

/**
 * Discovery log organism — chronological list of
 * customer interview entries.
 * @module components/organisms/DiscoveryLog
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { useDiscoveryLog }
  from '@/hooks/useDiscoveryLog';
import { DiscoveryEntryItem }
  from '@/components/molecules/DiscoveryEntryItem';
import { DiscoveryEntryForm }
  from '@/components/molecules/DiscoveryEntryForm';

/**
 * Chronological discovery log with log-interview dialog.
 * @returns DiscoveryLog UI.
 */
export const DiscoveryLog: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const vm = useDiscoveryLog();

  if (vm.isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="discovery-log"
      aria-label={t('discovery')}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained"
          onClick={() => vm.setDialogOpen(true)}
          aria-label={t('logInterview')}
          data-testid="discovery-log-btn">
          {t('logInterview')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
        {vm.sorted.map((entry, idx) => (
          <DiscoveryEntryItem
            key={entry.id}
            entry={entry}
            onDelete={(id) =>
              void vm.deleteEntry(id)}
            showDivider={
              idx < vm.sorted.length - 1}
          />
        ))}
      </Box>
      <Dialog open={vm.dialogOpen}
        onClose={() => vm.setDialogOpen(false)}
        aria-label={t('logInterview')}
        data-testid="discovery-dialog"
        maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('logInterview')}
        </DialogTitle>
        <DialogContent
          style={{ overscrollBehavior: 'contain' }}>
          <DiscoveryEntryForm
            onDone={() => vm.setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DiscoveryLog;
