'use client';

/**
 * @file ChainNodeView.tsx
 * @brief Recursive tree node for CompoundChain organism.
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@mui/material/Chip';

/** One node in the compound chain tree. */
export interface ChainNode {
  org: {
    id: string;
    name: string;
    initial_investment_gbp: number;
    monthly_revenue_gbp: number;
    parent_org_id?: string | null;
  };
  children: ChainNode[];
}

const gbp = (n: number) =>
  n >= 1000
    ? `£${(n / 1000).toFixed(0)}k`
    : `£${n}`;

/** Props for ChainNodeView. */
export interface ChainNodeViewProps {
  readonly node: ChainNode;
  readonly depth?: number;
}

/**
 * Renders one funding chain node with indented
 * children recursively.
 * @param props - ChainNodeViewProps.
 */
export const ChainNodeView: React.FC<
  ChainNodeViewProps
> = ({ node, depth = 0 }) => {
  const { org } = node;
  return (
    <Box
      data-testid={`chain-node-${org.id}`}
      sx={{ ml: depth * 3, mb: 1 }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center',
        gap: 1, flexWrap: 'wrap',
      }}>
        {depth > 0 && (
          <Typography color="text.secondary"
            variant="body2">↳</Typography>
        )}
        <Typography variant="body2"
          fontWeight={600}>{org.name}</Typography>
        <Chip size="small"
          label={gbp(org.initial_investment_gbp)}
          data-testid={`chip-inv-${org.id}`} />
        <Chip size="small" color="success"
          label={`${gbp(org.monthly_revenue_gbp)}/mo`}
          data-testid={`chip-rev-${org.id}`}
        />
      </Box>
      {node.children.map((c) => (
        <ChainNodeView key={c.org.id}
          node={c} depth={depth + 1} />
      ))}
    </Box>
  );
};

export default ChainNodeView;
