import { createSlice } from '@reduxjs/toolkit';
import { getSupervisorAssignmentHistory, getSupervisorAssignments } from 'store/actions';

export const supervisorAssignments = createSlice({
  name: 'supervisorAssignments',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupervisorAssignments.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupervisorAssignments.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supervisorAssignmentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSupervisorAssignments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const supervisorAssignmentHistory = createSlice({
  name: 'supervisorAssignmentHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSupervisorAssignmentHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getSupervisorAssignmentHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.supervisorAssignmentHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getSupervisorAssignmentHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
