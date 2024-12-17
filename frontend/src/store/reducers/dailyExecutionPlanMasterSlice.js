import { createSlice } from '@reduxjs/toolkit';
import { getAllDailyExecutionPlan, getDailyExecutionPlan, getDailyExecutionPlanHistory } from 'store/actions';

export const dailyExecutionPlan = createSlice({
  name: 'dailyExecutionPlan',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDailyExecutionPlan.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDailyExecutionPlan.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.dailyExecutionPlanObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDailyExecutionPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const allDailyExecutionPlan = createSlice({
  name: 'allDailyExecutionPlan',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDailyExecutionPlan.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getAllDailyExecutionPlan.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.allDailyExecutionPlanObject = payload.data;
      state.error = '';
    });
    builder.addCase(getAllDailyExecutionPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const dailyExecutionPlanHistory = createSlice({
  name: 'dailyExecutionPlanHistory',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDailyExecutionPlanHistory.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDailyExecutionPlanHistory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.dailyExecutionPlanHistoryObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDailyExecutionPlanHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
