'use client';

/**
 * @file CompoundChain.tsx
 * @brief Visualises the compound startup funding chain.
 *        Uses parent_org_id to build a tree structure.
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useListOrganisationsQuery }
  from '@/store/api/organisationsApi';
import type { Organisation }
  from '@/types/organisations';
import { ChainNodeView }
  from '@/components/molecules/ChainNodeView';
import type { ChainNode }
  from '@/components/molecules/ChainNodeView';

function buildTree(
  orgs: Organisation[],
): ChainNode[] {
  const map = new Map<string, ChainNode>(
    orgs.map((o) => [
      o.id,
      { org: o, children: [] },
    ]),
  );
  const roots: ChainNode[] = [];
  for (const [, node] of map) {
    const pid = node.org.parent_org_id;
    if (pid && map.has(pid)) {
      map.get(pid)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots.filter((r) =>
    r.children.length > 0,
  );
}

/**
 * Shows compound funding chains derived from
 * parent_org_id relationships between organisations.
 */
export function CompoundChain() {
  const t = useTranslations('startupCompare');
  const { data: orgs = [], isLoading } =
    useListOrganisationsQuery(undefined);
  const chains = buildTree(orgs);
  if (isLoading || chains.length === 0) return null;
  return (
    <Box data-testid="compound-chain" sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={700}>
        {t('compoundTitle')}
      </Typography>
      <Typography variant="body2"
        color="text.secondary" sx={{ mb: 2 }}>
        {t('compoundSub')}
      </Typography>
      {chains.map((root) => (
        <Box key={root.org.id}
          sx={{
            mb: 2, p: 2, borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ChainNodeView node={root} />
        </Box>
      ))}
    </Box>
  );
}

export default CompoundChain;
