'use client';

/**
 * Four-column ICE scoping canvas organism.
 * @module components/organisms/ProductScopingCanvas
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent
  from '@mui/material/DialogContent';
import CircularProgress
  from '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { ScopingLane }
  from '@/components/organisms/ScopingLane';
import { FeatureForm }
  from '@/components/molecules/FeatureForm';
import { useScopingCanvas }
  from '@/hooks/useScopingCanvas';
import type { FeatureStatus } from '@/types/scoping';

const LANES: { status: FeatureStatus;
  key: string }[] = [
  { status: 'in_mvp',      key: 'inMvp' },
  { status: 'considering', key: 'considering' },
  { status: 'later',       key: 'later' },
  { status: 'cut',         key: 'cut' },
];

/**
 * Product Scoping Canvas with ICE prioritisation.
 * @returns Canvas organism UI.
 */
export const ProductScopingCanvas: React.FC = () => {
  const t = useTranslations('scoping');
  const {
    ranked, isLoading, dialogOpen, editing,
    openAdd, openEdit, closeDialog,
    handleStatus, handleSubmit, handleDelete,
  } = useScopingCanvas();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={t('title')} />
      </Box>
    );
  }

  return (
    <Box data-testid="product-scoping-canvas"
      aria-label={t('title')}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={openAdd}
          aria-label={t('addFeature')}
          data-testid="scoping-add-btn">
          {t('addFeature')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap',
        alignItems: 'flex-start' }}>
        {LANES.map(({ status, key }) => (
          <ScopingLane key={status}
            title={t(key)}
            emptyLabel={t('noFeatures')}
            features={ranked.filter(
              (f) => f.status === status)}
            onEdit={openEdit}
            onDelete={handleDelete}
            onStatus={handleStatus}
            testId={`scoping-lane-${status}`} />
        ))}
      </Box>
      <Dialog open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="scoping-dialog-title"
        data-testid="scoping-feature-dialog">
        <DialogTitle id="scoping-dialog-title">
          {editing ? t('editFeature') : t('addFeature')}
        </DialogTitle>
        <DialogContent>
          <FeatureForm initial={editing}
            onSubmit={handleSubmit}
            onCancel={closeDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductScopingCanvas;
