/**
 * RTK Query endpoints for the organisations registry.
 * @module store/api/organisationsApi
 */
import { baseApi } from './baseApi';
import type {
  Organisation,
  OrgFormData,
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
      /**
       * Fetch all organisations for the current user.
       * @param q - Optional search query.
       * @returns Array of Organisation records.
       */
      listOrganisations: build.query<
        Organisation[],
        string | void
      >({
        query: (q) => ({
          url: apiConstants.organisations.list,
          params: q ? { q } : undefined,
        }),
        providesTags: ['Organisations'],
      }),

      /**
       * Create a new organisation record.
       * @param data - Org form data.
       */
      createOrganisation: build.mutation<
        Organisation,
        OrgFormData
      >({
        query: (data) => ({
          url: apiConstants.organisations.list,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Organisations'],
      }),

      /**
       * Update an existing organisation.
       * @param data - Form data plus record id.
       */
      updateOrganisation: build.mutation<
        Organisation,
        UpdateOrgInput
      >({
        query: ({ id, ...data }) => ({
          url: apiConstants.organisations.detail
            .replace(':id', id),
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Organisations'],
      }),

      /**
       * Delete an organisation record.
       * @param id - Record UUID.
       */
      deleteOrganisation: build.mutation<
        void,
        string
      >({
        query: (id) => ({
          url: apiConstants.organisations.detail
            .replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['Organisations'],
      }),
    }),
  });

export const {
  useListOrganisationsQuery,
  useCreateOrganisationMutation,
  useUpdateOrganisationMutation,
  useDeleteOrganisationMutation,
} = organisationsApi;
