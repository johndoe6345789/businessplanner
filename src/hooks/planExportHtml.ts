/**
 * HTML document builder for plan PDF export.
 * @module hooks/planExportHtml
 */
import roadmap from '@/constants/startup-roadmap.json';

const CSS = [
  'body{font-family:sans-serif;color:#000;',
  'background:#fff;padding:2rem}',
  'h1{font-size:1.5rem;margin-bottom:1rem}',
  'h2{font-size:1.1rem;margin-top:1.5rem;',
  'text-transform:capitalize}',
  'ul{list-style:none;padding:0}',
  'li{padding:0.25rem 0;font-size:0.95rem}',
].join('');

/**
 * Build a print-friendly HTML document from planner state.
 * @param startupName - Display name of the startup.
 * @param completedSteps - Map of step ID to completion.
 * @returns HTML string suitable for PDF rendering.
 */
export function buildPlanHtml(
  startupName: string | null,
  completedSteps: Record<string, boolean>,
): string {
  const title = startupName
    ? `${startupName} — Startup Plan`
    : 'Startup Plan';
  const body = roadmap.phases.map((ph) => {
    const items = ph.steps.map((s) => {
      const mark = completedSteps[s.id] ? '✓' : '☐';
      return `<li>${mark} ${s.id}</li>`;
    }).join('');
    return `<h2>${ph.id}</h2><ul>${items}</ul>`;
  }).join('');
  return [
    '<!DOCTYPE html><html>',
    '<head><meta charset="utf-8">',
    `<style>${CSS}</style></head>`,
    `<body><h1>${title}</h1>${body}</body></html>`,
  ].join('');
}
