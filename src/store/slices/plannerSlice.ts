/**
 * Redux slice for startup planner step completion.
 * @module store/slices/plannerSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

/** Shape of the planner state. */
interface PlannerState {
  /** Map of step ID to completion boolean. */
  completedSteps: Record<string, boolean>;
}

const initialState: PlannerState = {
  completedSteps: {},
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    /**
     * Toggle the completion state for a step.
     * @param state - Current planner state.
     * @param action - Step ID to toggle.
     */
    toggleStep(
      state,
      action: PayloadAction<string>,
    ) {
      const id = action.payload;
      state.completedSteps[id] =
        !state.completedSteps[id];
    },
    /** Reset all step completions to zero. */
    resetPlan(state) {
      state.completedSteps = {};
    },
  },
});

export const {
  toggleStep,
  resetPlan,
} = plannerSlice.actions;
export default plannerSlice.reducer;
