import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import { CompoundChain }
  from '../CompoundChain';

const MOCK_ORGS = [
  {
    id: 'root-1', name: 'Dog Walking',
    initial_investment_gbp: 50,
    monthly_revenue_gbp: 600,
    weeks_to_bootstrap: 1,
    parent_org_id: null,
    user_id: 'u1', website: '',
    description: '', entity_types: [],
    tags: [], notes: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'child-1', name: 'MobiWash',
    initial_investment_gbp: 800,
    monthly_revenue_gbp: 1200,
    weeks_to_bootstrap: 3,
    parent_org_id: 'root-1',
    user_id: 'u1', website: '',
    description: '', entity_types: [],
    tags: [], notes: '',
    created_at: '', updated_at: '',
  },
  {
    id: 'orphan-1', name: 'Lone Startup',
    initial_investment_gbp: 0,
    monthly_revenue_gbp: 300,
    weeks_to_bootstrap: 1,
    parent_org_id: null,
    user_id: 'u1', website: '',
    description: '', entity_types: [],
    tags: [], notes: '',
    created_at: '', updated_at: '',
  },
];

jest.mock('@/store/api/organisationsApi', () => ({
  useListOrganisationsQuery: jest.fn(),
}));

const { useListOrganisationsQuery } =
  jest.requireMock('@/store/api/organisationsApi');

beforeEach(() => jest.clearAllMocks());

describe('CompoundChain', () => {
  it('renders nothing while loading', () => {
    useListOrganisationsQuery.mockReturnValue({
      data: [], isLoading: true,
    });
    const { container } = render(<CompoundChain />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when no chains', () => {
    useListOrganisationsQuery.mockReturnValue({
      data: [MOCK_ORGS[2]], isLoading: false,
    });
    const { container } = render(<CompoundChain />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows compound-chain testid when chains exist',
    () => {
      useListOrganisationsQuery.mockReturnValue({
        data: MOCK_ORGS, isLoading: false,
      });
      render(<CompoundChain />);
      expect(screen.getByTestId('compound-chain'))
        .toBeInTheDocument();
    });

  it('renders root and child nodes', () => {
    useListOrganisationsQuery.mockReturnValue({
      data: MOCK_ORGS, isLoading: false,
    });
    render(<CompoundChain />);
    expect(screen.getByTestId('chain-node-root-1'))
      .toBeInTheDocument();
    expect(screen.getByTestId('chain-node-child-1'))
      .toBeInTheDocument();
  });

  it('does not render orphan without children', () => {
    useListOrganisationsQuery.mockReturnValue({
      data: MOCK_ORGS, isLoading: false,
    });
    render(<CompoundChain />);
    expect(screen.queryByTestId('chain-node-orphan-1'))
      .not.toBeInTheDocument();
  });
});
