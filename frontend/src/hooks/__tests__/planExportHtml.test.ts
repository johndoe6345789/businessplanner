jest.mock('@/constants/startup-roadmap.json', () => ({
  phases: [
    {
      id: 'validate',
      steps: [
        { id: 'market-research' },
        { id: 'mvp' },
      ],
    },
    {
      id: 'launch',
      steps: [{ id: 'go-live' }],
    },
  ],
}), { virtual: true });

import { buildPlanHtml } from '../planExportHtml';

describe('buildPlanHtml', () => {
  it('uses startup name in the title', () => {
    const html = buildPlanHtml('Acme', {});
    expect(html).toContain('Acme — Startup Plan');
  });

  it('falls back to generic title when name is null', () => {
    const html = buildPlanHtml(null, {});
    expect(html).toContain('<h1>Startup Plan</h1>');
    expect(html).not.toContain('null');
  });

  it('marks completed steps with checkmark', () => {
    const html = buildPlanHtml(
      null, { 'market-research': true },
    );
    expect(html).toContain('✓ market-research');
    expect(html).toContain('☐ mvp');
  });

  it('renders all phases and steps', () => {
    const html = buildPlanHtml('X', {});
    expect(html).toContain('<h2>validate</h2>');
    expect(html).toContain('<h2>launch</h2>');
    expect(html).toContain('go-live');
  });

  it('returns a valid HTML document', () => {
    const html = buildPlanHtml(null, {});
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
    expect(html).toContain('<style>');
  });

  it('all steps unchecked when completedSteps is empty', () => {
    const html = buildPlanHtml(null, {});
    const checks = (html.match(/✓/g) ?? []).length;
    const boxes = (html.match(/☐/g) ?? []).length;
    expect(checks).toBe(0);
    expect(boxes).toBe(3);
  });
});
