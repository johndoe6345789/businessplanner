/**
 * PDF render RTK Query endpoints.
 * @module store/api/pdfApi
 */
import { baseApi } from './baseApi';
import apiConstants from '@/constants/api.json';

/** Body sent to the render endpoint. */
export interface RenderPdfBody {
  /** Template identifier. */
  template: string;
  /** HTML source to render. */
  html: string;
}

/** Response from the render endpoint. */
export interface RenderPdfResponse {
  /** Unique render job identifier. */
  id: string;
  /** Initial job status. */
  status: string;
}

/** Response from the status poll endpoint. */
export interface PdfStatusResponse {
  /** Job identifier. */
  id: string;
  /** 'pending' | 'done' | 'failed'. */
  status: string;
  /** Download URL when status === 'done'. */
  url?: string;
}

/** PDF API endpoints injected into baseApi. */
export const pdfApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Submit an HTML document for PDF rendering.
     * @returns Render job id and initial status.
     */
    renderPdf: build.mutation<
      RenderPdfResponse,
      RenderPdfBody
    >({
      query: (body) => ({
        url: apiConstants.pdf.render,
        method: 'POST',
        body,
      }),
    }),

    /**
     * Poll the render job status.
     * @returns Job id, status, and optional download URL.
     */
    getPdfStatus: build.query<
      PdfStatusResponse,
      string
    >({
      query: (id) =>
        apiConstants.pdf.status.replace(':id', id),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRenderPdfMutation,
  useGetPdfStatusQuery,
} = pdfApi;
