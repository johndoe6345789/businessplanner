/**
 * RTK Query endpoints for the organisations registry.
 * @module store/api/organisationsApi
 */
import { baseApi } from './baseApi';
import type {
  Organisation,
  OrgFormData,
  StartupStep,
} from '@/types/organisations';
import apiConstants from '@/constants/api.json';

/** Input for updating a record (includes id). */
type UpdateOrgInput = OrgFormData & {
  id: string;
};

/** Organisation CRUD endpoints. */
export const organisationsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch all organisations (optional search q). */
      listOrganisations: build.query<
        Organisation[], string | void
      >({
        query: (q) => ({
          url: apiConstants.organisations.list,
          params: q ? { q } : undefined,
        }),
        providesTags: ['Organisations'],
      }),

      /** Create a new organisation record. */
      createOrganisation: build.mutation<
        Organisation, OrgFormData
      >({
        query: (data) => ({
          url: apiConstants.organisations.list,
          method: 'POST', body: data,
        }),
        invalidatesTags: ['Organisations'],
      }),

      /** Update an existing organisation. */
      updateOrganisation: build.mutation<
        Organisation, UpdateOrgInput
      >({
        query: ({ id, ...data }) => ({
          url: apiConstants.organisations.detail
            .replace(':id', id),
          method: 'PUT', body: data,
        }),
        invalidatesTags: ['Organisations'],
      }),

      /** Delete an organisation record. */
      deleteOrganisation: build.mutation<
        void, string
      >({
        query: (id) => ({
          url: apiConstants.organisations.detail
            .replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['Organisations'],
      }),

      /** Fetch startup playbook steps for an org. */
      listStartupSteps: build.query<
        StartupStep[], string
      >({
        query: (id) => ({
          url: apiConstants.organisations.steps
            .replace(':id', id),
        }),
        providesTags: ['Organisations'],
      }),
    }),
  });

export const {
  useListOrganisationsQuery,
  useCreateOrganisationMutation,
  useUpdateOrganisationMutation,
  useDeleteOrganisationMutation,
  useListStartupStepsQuery,
} = organisationsApi;
