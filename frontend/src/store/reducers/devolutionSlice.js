import { createSlice } from '@reduxjs/toolkit';
import { getDevolutionConfig, getDevolutionMapping, getDevolutionList } from 'store/actions';

export const devolutionConfig = createSlice({
  name: 'devolutionConfig',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDevolutionConfig.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDevolutionConfig.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDevolutionConfig.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const devolutionMapping = createSlice({
  name: 'devolutionMapping',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDevolutionMapping.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDevolutionMapping.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDevolutionMapping.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;

export const devolutionList = createSlice({
  name: 'devolutionList',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDevolutionList.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getDevolutionList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.stocksObject = payload.data;
      state.error = '';
    });
    builder.addCase(getDevolutionList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
}).reducer;
