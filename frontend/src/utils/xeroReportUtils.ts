/**
 * @file xeroReportUtils.ts
 * @brief Utility for extracting values from Xero report rows.
 */

import type { XeroReportResponse } from '@/types/xero';

/**
 * @brief Extracts a numeric value from a Xero report
 *        SummaryRow matching a given label.
 * @param resp - The Xero report response envelope.
 * @param label - Cell[0] value to match (e.g. "Total Income").
 * @returns Parsed float, or null if row not found.
 */
export function extractReportRow(
  resp: XeroReportResponse | undefined,
  label: string,
): number | null {
  const rows = resp?.Reports?.[0]?.Rows ?? [];
  const row = rows.find((r) =>
    r.rowType === 'SummaryRow' &&
    r.cells?.[0]?.value === label);
  const v = parseFloat(row?.cells?.[1]?.value ?? '');
  return isNaN(v) ? null : v;
}
