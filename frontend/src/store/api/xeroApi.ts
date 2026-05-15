/**
 * RTK Query endpoints for the Xero accounting domain.
 * @module store/api/xeroApi
 */
import { baseApi } from './baseApi';
import type {
  XeroStatus, XeroInvoice,
  XeroBankTransaction, XeroReport,
} from '@/types/xero';
import api from '@/constants/api.json';

const X = api.xero;

/** Xero read-only API: status, invoices, reports. */
export const xeroApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Connection status for the current user. */
    xeroStatus: build.query<XeroStatus, void>({
      query: () => X.status,
      providesTags: ['Xero'],
    }),

    /** List authorised + paid invoices. */
    xeroInvoices: build.query<
      { Invoices: XeroInvoice[] }, void
    >({
      query: () => X.invoices,
      providesTags: ['Xero'],
    }),

    /** List bank transactions. */
    xeroTransactions: build.query<
      { BankTransactions: XeroBankTransaction[] }, void
    >({
      query: () => X.transactions,
      providesTags: ['Xero'],
    }),

    /** P&L report. */
    xeroProfitLoss: build.query<XeroReport, void>({
      query: () => X.profitLoss,
      providesTags: ['Xero'],
    }),

    /** Balance sheet report. */
    xeroBalanceSheet: build.query<XeroReport, void>({
      query: () => X.balanceSheet,
      providesTags: ['Xero'],
    }),

    /** Cash flow summary. */
    xeroCashFlow: build.query<XeroReport, void>({
      query: () => X.cashFlow,
      providesTags: ['Xero'],
    }),

    /** Disconnect Xero (DELETE). */
    xeroDisconnect: build.mutation<void, void>({
      query: () => ({ url: X.disconnect, method: 'DELETE' }),
      invalidatesTags: ['Xero'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useXeroStatusQuery,
  useXeroInvoicesQuery,
  useXeroTransactionsQuery,
  useXeroProfitLossQuery,
  useXeroBalanceSheetQuery,
  useXeroCashFlowQuery,
  useXeroDisconnectMutation,
} = xeroApi;
