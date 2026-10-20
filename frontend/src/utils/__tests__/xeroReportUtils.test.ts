import { extractReportRow }
  from '../xeroReportUtils';
import type { XeroReportResponse }
  from '@/types/xero';

const mkResp = (
  label: string, value: string,
): XeroReportResponse => ({
  Reports: [{
    ReportID: 'ProfitAndLoss',
    ReportName: 'Profit and Loss',
    Rows: [
      { rowType: 'Header' },
      { rowType: 'SummaryRow',
        cells: [{ value: label }, { value: value }] },
    ],
  }],
});

describe('extractReportRow', () => {
  it('extracts numeric value for matching label', () => {
    const resp = mkResp('Total Income', '150000.00');
    expect(extractReportRow(resp, 'Total Income'))
      .toBe(150000);
  });

  it('returns null when label not found', () => {
    const resp = mkResp('Total Income', '5000');
    expect(extractReportRow(resp, 'Net Profit'))
      .toBeNull();
  });

  it('returns null for undefined response', () => {
    expect(extractReportRow(undefined, 'Total Income'))
      .toBeNull();
  });

  it('returns null when value is not numeric', () => {
    const resp = mkResp('Total Income', 'N/A');
    expect(extractReportRow(resp, 'Total Income'))
      .toBeNull();
  });

  it('returns null for empty Reports array', () => {
    expect(extractReportRow({ Reports: [] }, 'Total Income'))
      .toBeNull();
  });
});
