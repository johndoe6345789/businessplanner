/**
 * RTK Query endpoints for server-side roadmap progress, so
 * ticked steps follow the user across devices.
 * @module store/api/plannerProgressApi
 */
import { baseApi } from './baseApi';

/** Server view of the user's roadmap progress. */
export interface PlannerProgress {
  steps: Record<string, boolean>;
}

/** Result of ticking or unticking one step. */
export interface StepResult {
  step: string;
  completed: boolean;
  first_time: boolean;
}

/** Roadmap progress endpoints injected into baseApi. */
export const plannerProgressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Fetch every step the user has ticked. */
    getPlannerProgress: build.query<PlannerProgress, void>({
      query: () => ({ url: '/api/planner/progress' }),
      providesTags: ['PlannerProgress'],
    }),

    /** Tick or untick one step. */
    setPlannerStep: build.mutation<
      StepResult,
      { id: string; completed: boolean }
    >({
      query: ({ id, completed }) => ({
        url: `/api/planner/progress/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: { completed },
      }),
    }),

    /** Untick every step. */
    resetPlannerProgress: build.mutation<void, void>({
      query: () => ({
        url: '/api/planner/progress',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPlannerProgressQuery,
  useSetPlannerStepMutation,
  useResetPlannerProgressMutation,
} = plannerProgressApi;
