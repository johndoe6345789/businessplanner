'use client';

/**
 * Milestone social cards page.
 * @module app/[locale]/milestones/page
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useTranslations } from 'next-intl';
import { ShareMilestoneButton }
  from '@/components/molecules/ShareMilestoneButton';
import templates
  from '@/constants/milestone-templates.json';

/**
 * Page listing milestone templates to pick and share.
 * @returns Milestones page UI.
 */
export default function MilestonesPage() {
  const t = useTranslations('milestones');

  return (
    <Box component="main" role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}
      data-testid="milestones-page">
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <Grid container spacing={3}>
        {templates.templates.map((tmpl) => (
          <Grid key={tmpl.id} xs={12} sm={6} item>
            <Paper sx={{ p: 3, borderRadius: 2,
              display: 'flex',
              flexDirection: 'column', gap: 2 }}
              data-testid="milestone-template-card">
              <Box sx={{ display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start' }}>
                <Box component="span"
                  sx={{ fontSize: '2rem',
                    lineHeight: 1 }}>
                  {tmpl.emoji}
                </Box>
                <Typography variant="body1"
                  fontWeight={500}>
                  {tmpl.text}
                </Typography>
              </Box>
              <ShareMilestoneButton
                milestoneId={tmpl.id}
                text={tmpl.text}
                emoji={tmpl.emoji}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
