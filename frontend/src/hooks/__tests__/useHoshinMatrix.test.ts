const objMock = jest.fn();
const linkMock = jest.fn();
const orgMock = jest.fn();

jest.mock('@/store/api/hoshinApi', () => ({
  useListObjectivesQuery: () => objMock(),
  useListLinksQuery: () => linkMock(),
}));
jest.mock('@/store/api/organisationsApi', () => ({
  useListOrganisationsQuery: () => orgMock(),
}));

import { renderHook } from '@testing-library/react';
import { useHoshinMatrix } from '../useHoshinMatrix';

const obj = (id: string, horizon: string) => ({
  id, horizon, title: id,
  user_id: 'u', created_at: '', updated_at: '',
});
const org = (id: string) => ({
  id, name: id, description: '',
  user_id: 'u', created_at: '', updated_at: '',
});

describe('useHoshinMatrix', () => {
  beforeEach(() => {
    objMock.mockReturnValue({
      data: [], isLoading: false,
    });
    linkMock.mockReturnValue({
      data: [], isLoading: false,
    });
    orgMock.mockReturnValue({
      data: [], isLoading: false,
    });
  });

  it('returns empty groups when no data', () => {
    const { result } = renderHook(
      () => useHoshinMatrix(),
    );
    expect(result.current.vision).toHaveLength(0);
    expect(result.current.breakthrough).toHaveLength(0);
    expect(result.current.annual).toHaveLength(0);
  });

  it('groups objectives by horizon', () => {
    objMock.mockReturnValue({
      data: [obj('v', 'vision'), obj('a', 'annual')],
      isLoading: false,
    });
    orgMock.mockReturnValue({
      data: [org('o1')], isLoading: false,
    });
    const { result } = renderHook(
      () => useHoshinMatrix(),
    );
    expect(result.current.vision).toHaveLength(1);
    expect(result.current.annual).toHaveLength(1);
  });

  it('isLoading is true when any query is loading', () => {
    objMock.mockReturnValue({
      data: [], isLoading: true,
    });
    const { result } = renderHook(
      () => useHoshinMatrix(),
    );
    expect(result.current.isLoading).toBe(true);
  });
});
