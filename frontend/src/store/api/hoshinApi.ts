/**
 * RTK Query endpoints for the Hoshin Kanri domain.
 * @module store/api/hoshinApi
 */
import { baseApi } from './baseApi';
import type {
  HoshinObjective,
  HoshinLink,
  CreateObjectiveInput,
  CreateLinkInput,
} from '@/types/hoshin';
import apiConstants from '@/constants/api.json';

const OBJ = apiConstants.hoshin.objectives;
const LNK = apiConstants.hoshin.links;

/** Hoshin Kanri API: objectives and X-matrix links. */
export const hoshinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** List objectives ordered vision → breakthrough → annual. */
    listObjectives: build.query<HoshinObjective[], void>({
      query: () => OBJ,
      providesTags: ['Hoshin'],
    }),

    /** Create a new objective. */
    createObjective: build.mutation<
      HoshinObjective, CreateObjectiveInput
    >({
      query: (body) => ({ url: OBJ, method: 'POST', body }),
      invalidatesTags: ['Hoshin'],
    }),

    /** Delete an objective by UUID. */
    deleteObjective: build.mutation<void, string>({
      query: (id) => ({
        url: `${OBJ}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hoshin'],
    }),

    /** List all X-matrix links for the current user. */
    listLinks: build.query<HoshinLink[], void>({
      query: () => LNK,
      providesTags: ['Hoshin'],
    }),

    /** Create an objective–organisation link. */
    createLink: build.mutation<HoshinLink, CreateLinkInput>({
      query: (body) => ({ url: LNK, method: 'POST', body }),
      invalidatesTags: ['Hoshin'],
    }),

    /** Delete an X-matrix link by UUID. */
    deleteLink: build.mutation<void, string>({
      query: (id) => ({
        url: `${LNK}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hoshin'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListObjectivesQuery,
  useCreateObjectiveMutation,
  useDeleteObjectiveMutation,
  useListLinksQuery,
  useCreateLinkMutation,
  useDeleteLinkMutation,
} = hoshinApi;
