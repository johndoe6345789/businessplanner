/**
 * RTK Query endpoints for the hoshin domain.
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

/** Hoshin Kanri API endpoints. */
export const hoshinApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * List all objectives for the current user
       * ordered vision → breakthrough → annual.
       * @returns Array of HoshinObjective.
       */
      listObjectives: build.query<
        HoshinObjective[], void
      >({
        query: () => OBJ,
        providesTags: ['Hoshin'],
      }),

      /**
       * Create a new objective.
       * @param input - Objective fields.
       * @returns The created HoshinObjective.
       */
      createObjective: build.mutation<
        HoshinObjective, CreateObjectiveInput
      >({
        query: (body) => ({
          url: OBJ,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Hoshin'],
      }),

      /**
       * Delete an objective by ID.
       * @param id - UUID of the objective.
       */
      deleteObjective: build.mutation<void, string>({
        query: (id) => ({
          url: `${OBJ}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Hoshin'],
      }),

      /**
       * List all X-matrix links for the current user.
       * @returns Array of HoshinLink.
       */
      listLinks: build.query<HoshinLink[], void>({
        query: () => LNK,
        providesTags: ['Hoshin'],
      }),

      /**
       * Create an objective–organisation link.
       * @param input - Link fields.
       * @returns The created HoshinLink.
       */
      createLink: build.mutation<
        HoshinLink, CreateLinkInput
      >({
        query: (body) => ({
          url: LNK,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Hoshin'],
      }),

      /**
       * Delete an X-matrix link by ID.
       * @param id - UUID of the link.
       */
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
