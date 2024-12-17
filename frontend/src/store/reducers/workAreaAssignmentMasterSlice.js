import { createSlice } from '@reduxjs/toolkit';
import { getWorkAreaAssignmentHistory, getWorkAreaAssignments } from 'store/actions';

export const workAreaAssignments = createSlice({
  name: 'workAreaAssignments',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWorkAreaAssignments.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getWorkAreaAssignments.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.workAreaAssignmentsObject = payload.data;
      state.error = '';
    });
    builder.addCase(getWorkAreaAssignments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const workAreaAssignmentHistory = createSlice({
  name: 'workAreaAssignmentHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWorkAreaAssignmentHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getWorkAreaAssignmentHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.workAreaAssignmentHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getWorkAreaAssignmentHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
