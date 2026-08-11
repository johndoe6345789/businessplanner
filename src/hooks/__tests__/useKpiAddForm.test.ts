import { renderHook, act } from '@testing-library/react';
import { useKpiAddForm } from '../useKpiAddForm';

describe('useKpiAddForm', () => {
  it('initialises with empty/default fields', () => {
    const { result } = renderHook(() => useKpiAddForm());
    expect(result.current.title).toBe('');
    expect(result.current.category).toBe('financial');
    expect(result.current.target).toBe('');
    expect(result.current.unit).toBe('');
  });

  it('setTitle updates title', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => { result.current.setTitle('MRR'); });
    expect(result.current.title).toBe('MRR');
  });

  it('setCategory updates category', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => { result.current.setCategory('growth'); });
    expect(result.current.category).toBe('growth');
  });

  it('setTarget and setUnit update fields', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => {
      result.current.setTarget('10000');
      result.current.setUnit('GBP');
    });
    expect(result.current.target).toBe('10000');
    expect(result.current.unit).toBe('GBP');
  });

  it('buildInput returns null when title is empty', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => { result.current.setTarget('100'); });
    expect(result.current.buildInput()).toBeNull();
  });

  it('buildInput returns null when target is empty', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => { result.current.setTitle('Revenue'); });
    expect(result.current.buildInput()).toBeNull();
  });

  it('buildInput returns payload when title and target set', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => {
      result.current.setTitle('Revenue');
      result.current.setTarget('5000');
      result.current.setUnit('GBP');
    });
    const input = result.current.buildInput();
    expect(input).not.toBeNull();
    expect(input?.title).toBe('Revenue');
    expect(input?.target_value).toBe(5000);
    expect(input?.unit).toBe('GBP');
    expect(input?.current_value).toBe(0);
    expect(input?.baseline_value).toBe(0);
  });

  it('reset clears title, target, and unit', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => {
      result.current.setTitle('NPS');
      result.current.setTarget('80');
      result.current.setUnit('%');
    });
    act(() => { result.current.reset(); });
    expect(result.current.title).toBe('');
    expect(result.current.target).toBe('');
    expect(result.current.unit).toBe('');
  });

  it('buildInput period_start and period_end are ISO dates', () => {
    const { result } = renderHook(() => useKpiAddForm());
    act(() => {
      result.current.setTitle('CAC');
      result.current.setTarget('200');
    });
    const input = result.current.buildInput();
    expect(input?.period_start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(input?.period_end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
