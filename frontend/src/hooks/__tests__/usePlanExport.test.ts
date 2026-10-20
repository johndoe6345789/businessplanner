const selectorMock = jest.fn();
const renderPdfMock = jest.fn();
const refetchMock = jest.fn();
const statusMock = jest.fn();

jest.mock('@/store/hooks', () => ({
  useAppSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));
jest.mock('@/store/api/pdfApi', () => ({
  useRenderPdfMutation: () => [renderPdfMock],
  useGetPdfStatusQuery: (_id: string, _opts: unknown) =>
    statusMock(),
}));
jest.mock('../planExportHtml', () => ({
  buildPlanHtml: () => '<html>plan</html>',
}));

import { renderHook, act } from '@testing-library/react';
import { usePlanExport } from '../usePlanExport';

describe('usePlanExport', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue({});
    statusMock.mockReturnValue({
      data: undefined, refetch: refetchMock,
    });
    renderPdfMock.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 'job1' }),
    });
  });

  it('initialises in idle state', () => {
    const { result } = renderHook(
      () => usePlanExport(),
    );
    expect(result.current.state).toBe('idle');
    expect(result.current.downloadUrl).toBeUndefined();
  });

  it('exportPlan transitions to generating state', async () => {
    const { result } = renderHook(
      () => usePlanExport(),
    );
    await act(async () => {
      result.current.exportPlan();
    });
    expect(result.current.state).toBe('generating');
  });

  it('transitions to error when renderPdf rejects', async () => {
    renderPdfMock.mockReturnValue({
      unwrap: () => Promise.reject(new Error('fail')),
    });
    const { result } = renderHook(
      () => usePlanExport(),
    );
    await act(async () => {
      result.current.exportPlan();
      await Promise.resolve();
    });
    expect(result.current.state).toBe('error');
  });
});
